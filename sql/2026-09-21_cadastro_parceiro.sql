-- ============================================================
-- MIGRATION APLICADA NO SUPABASE EM 21/09/2026 (SQL Editor)
-- Mantido no repositório como registro histórico desta migration.
-- ============================================================
--
-- Objetivo: suportar a funcionalidade pública "Cadastre-se" do
-- Portal de Parceiros, sem enfraquecer RLS e sem tocar nas
-- functions/policies existentes.
--
-- O que este arquivo faz:
--   1. Adiciona duas colunas novas e nullable em public.wp_parceiros
--      para registrar a evidência do aceite do Termo de Adesão
--      (versão + timestamp gerado pelo banco). O próprio uid da
--      linha já identifica qual parceiro aceitou — não é necessária
--      uma coluna extra nem uma tabela separada para isso.
--   2. Cria uma função RPC nova (SECURITY DEFINER) que conclui o
--      cadastro do parceiro de forma controlada, chamável somente
--      por usuários autenticados.
--
-- O que este arquivo NÃO faz (intencionalmente):
--   - Não recria a tabela wp_parceiros.
--   - Não recria/derruba as constraints UNIQUE já existentes
--     (email, uid, token_indicacao).
--   - Não altera public.wp_indicacao_token_ativo(...).
--   - Não altera public.wp_criar_indicacao_publica(...).
--   - Não cria nem altera policies de RLS (wp_parceiros_admin_all,
--     wp_parceiros_select_own permanecem exatamente como estão).
--   - Não concede nenhum privilégio a "anon".
--   - Não usa nem referencia service_role.
--   - Não afeta parceiros já existentes: termo_versao/termo_aceito_em
--     ficam NULL para eles; ativo, uid, email, id_funcao e
--     token_indicacao de linhas existentes não são tocados.
--
-- Pré-requisito importante:
--   A função abaixo é SECURITY DEFINER e depende de ser criada pelo
--   mesmo owner/role que já criou public.wp_criar_indicacao_publica
--   (o padrão já usado neste projeto para permitir escrita controlada
--   contornando RLS sem abrir policy genérica). Esse mesmo owner
--   também precisa conseguir ler auth.users — o que já é o caso para
--   o role usado normalmente para criar funções SECURITY DEFINER no
--   Supabase (é o mesmo padrão da função oficial "handle_new_user"
--   documentada pelo próprio Supabase). Execute este script com o
--   mesmo usuário/role usado para as functions existentes.
--
-- ============================================================


-- ----------------------------------------------------------------
-- 1) Colunas novas em wp_parceiros para evidência do aceite do Termo
-- ----------------------------------------------------------------
-- Nullable propositalmente: parceiros já existentes, cadastrados
-- manualmente antes desta funcionalidade, não têm esses dados e não
-- devem ser afetados nem obrigados a aceitar retroativamente.
--
-- "Quem aceitou" é sempre a própria linha (uid) de wp_parceiros —
-- por isso não há coluna separada para isso. Se no futuro for
-- necessário manter histórico de múltiplas versões aceitas por um
-- mesmo parceiro ao longo do tempo, essas duas colunas podem ser
-- complementadas por uma tabela wp_parceiros_termo_aceites nessa
-- ocasião, sem quebrar o que existe aqui.

ALTER TABLE public.wp_parceiros
  ADD COLUMN IF NOT EXISTS termo_versao text,
  ADD COLUMN IF NOT EXISTS termo_aceito_em timestamptz;


-- ----------------------------------------------------------------
-- 2) Função RPC: conclusão segura do cadastro do parceiro
-- ----------------------------------------------------------------
-- Regras de segurança aplicadas:
--   - SECURITY DEFINER com search_path vazio (''); todo objeto é
--     qualificado explicitamente (public.*, auth.*, pg_catalog.*).
--     Funções nativas do Postgres (now, btrim, length, lower,
--     regexp_replace) são resolvidas via pg_catalog, que é sempre
--     implicitamente pesquisado pelo Postgres independentemente de
--     search_path — por isso search_path = '' é seguro aqui e não
--     quebra nenhuma chamada.
--   - Identidade obtida SOMENTE de auth.uid() — a função não aceita
--     uid como parâmetro.
--   - E-mail, confirmação de e-mail, nome, telefone e id_funcao são
--     lidos diretamente de auth.users (linha do próprio auth.uid()),
--     nunca de parâmetros enviados pelo navegador. O único parâmetro
--     de entrada é o aceite explícito do Termo nesta chamada
--     específica (p_termo_aceite), porque isso precisa ser uma ação
--     do usuário neste exato momento, não um dado armazenado.
--   - Conclusão só é permitida se auth.users.email_confirmed_at não
--     for nulo — ou seja, só depois que o Supabase Auth confirmou
--     de fato o e-mail via verifyOtp. Não existe nenhum booleano
--     vindo do cliente decidindo isso.
--   - id_funcao validado contra o conjunto público permitido
--     (3,4,5,6), mesmo vindo de user_metadata (que o próprio usuário
--     pode editar via updateUser) — nunca aceita 1 (Administrador)
--     ou 2 (Vendedor).
--   - Idempotente: se já existe wp_parceiros para o uid autenticado,
--     retorna 'ja_concluido' sem tentar inserir de novo e SEM
--     sobrescrever termo_versao/termo_aceito_em já gravados
--     anteriormente (protege contra duplo clique, refresh ou nova
--     chamada da mesma RPC).
--   - Checa duplicidade de e-mail antes do INSERT e novamente trata
--     unique_violation na exceção (defesa em profundidade contra
--     condição de corrida entre duas chamadas quase simultâneas).
--   - NÃO informa token_indicacao no INSERT — o DEFAULT já existente
--     da coluna gera o valor.
--   - Criação de wp_parceiros e gravação do aceite do Termo ocorrem
--     no mesmo INSERT, dentro da mesma transação implícita da
--     função — não há como existir uma sem a outra.
--   - EXECUTE revogado de PUBLIC e concedido apenas a "authenticated".
--     "anon" nunca recebe permissão de executar esta função.

CREATE OR REPLACE FUNCTION public.wp_concluir_cadastro_parceiro(
  p_termo_aceite boolean
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_uid uuid;
  v_email text;
  v_email_confirmado timestamptz;
  v_metadata jsonb;
  v_nome text;
  v_telefone text;
  v_id_funcao_raw text;
  v_id_funcao integer;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RETURN 'nao_autenticado';
  END IF;

  -- Idempotência: repetição da chamada para um cadastro já concluído
  -- não deve criar um segundo registro, nem reescrever o aceite do
  -- termo já registrado na primeira conclusão.
  IF EXISTS (SELECT 1 FROM public.wp_parceiros WHERE uid = v_uid) THEN
    RETURN 'ja_concluido';
  END IF;

  IF p_termo_aceite IS DISTINCT FROM true THEN
    RETURN 'termo_nao_aceito';
  END IF;

  -- Dados obtidos diretamente da identidade autenticada no banco,
  -- nunca de parâmetros arbitrários vindos do navegador.
  SELECT email, email_confirmed_at, raw_user_meta_data
    INTO v_email, v_email_confirmado, v_metadata
    FROM auth.users
   WHERE id = v_uid;

  IF v_email IS NULL THEN
    RETURN 'nao_autenticado';
  END IF;

  IF v_email_confirmado IS NULL THEN
    RETURN 'email_nao_confirmado';
  END IF;

  v_email := pg_catalog.lower(pg_catalog.btrim(v_email));

  v_nome := pg_catalog.btrim(coalesce(v_metadata ->> 'nome', ''));
  IF v_nome = '' OR pg_catalog.length(v_nome) > 150 THEN
    RETURN 'dados_invalidos';
  END IF;

  v_telefone := pg_catalog.regexp_replace(coalesce(v_metadata ->> 'telefone', ''), '\D', '', 'g');
  IF pg_catalog.length(v_telefone) NOT IN (10, 11) THEN
    RETURN 'dados_invalidos';
  END IF;

  -- Validação textual ANTES do cast: raw_user_meta_data pode ser editado
  -- pelo próprio usuário via updateUser(), então um valor como 'abc' ou
  -- '3.5' não pode chegar a um ::integer (isso lançaria exceção do
  -- Postgres em vez de retornar 'perfil_invalido' de forma controlada).
  v_id_funcao_raw := v_metadata ->> 'id_funcao';
  IF v_id_funcao_raw IS NULL
     OR v_id_funcao_raw !~ '^[0-9]+$'
     OR pg_catalog.length(v_id_funcao_raw) > 4 THEN
    -- length > 4 também evita overflow de integer em cast de string
    -- absurdamente longa (defesa extra, além do valor em si nunca
    -- passar de um único dígito nos perfis públicos válidos).
    RETURN 'perfil_invalido';
  END IF;

  v_id_funcao := v_id_funcao_raw::integer;
  IF v_id_funcao NOT IN (3, 4, 5, 6) THEN
    RETURN 'perfil_invalido';
  END IF;

  IF EXISTS (SELECT 1 FROM public.wp_parceiros WHERE email = v_email) THEN
    RETURN 'email_duplicado';
  END IF;

  BEGIN
    INSERT INTO public.wp_parceiros (
      email, nome, telefone, id_funcao, uid, termo_versao, termo_aceito_em
    )
    VALUES (
      v_email, v_nome, v_telefone, v_id_funcao, v_uid, '1.0', pg_catalog.now()
    );
  EXCEPTION
    WHEN unique_violation THEN
      -- Condição de corrida: outra chamada concorrente já inseriu.
      IF EXISTS (SELECT 1 FROM public.wp_parceiros WHERE uid = v_uid) THEN
        RETURN 'ja_concluido';
      ELSIF EXISTS (SELECT 1 FROM public.wp_parceiros WHERE email = v_email) THEN
        RETURN 'email_duplicado';
      ELSE
        RETURN 'erro';
      END IF;
  END;

  RETURN 'ok';
END;
$$;

REVOKE ALL ON FUNCTION public.wp_concluir_cadastro_parceiro(boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.wp_concluir_cadastro_parceiro(boolean) TO authenticated;

-- Nota histórica: nenhum rascunho anterior com 4 parâmetros chegou a ser
-- executado no Supabase — a versão efetivamente aplicada em 21/09/2026
-- foi sempre esta, com o parâmetro único p_termo_aceite. Caso este script
-- precise ser reexecutado no futuro com uma assinatura diferente, use
-- DROP FUNCTION na assinatura antiga antes do CREATE OR REPLACE acima,
-- para não deixar duas sobrecargas da função.

-- ============================================================
-- FIM DO SCRIPT — APLICADO NO SUPABASE EM 21/09/2026.
-- ============================================================
