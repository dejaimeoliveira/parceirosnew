DATABASE_SCHEMA.md

Supabase --- Estrutura oficial do banco do Portal dos Parceiros Catedral

Este documento é a \***\*fonte de verdade do banco de dados para o
novo Portal dos Parceiros Catedral\*\***.

Regra de escopo --- obrigatória

Para este projeto, a aplicação deve considerar como tabelas de negócio
válidas \***\*somente as tabelas do schema public cujo nome começa
com wp\_\*\***.

Todas as tabelas public sem o prefixo wp\_ são consideradas \***\*legado\*\*** e devem ser ignoradas pelo novo portal.

Exemplos de tabelas que NÃO devem influenciar o novo projeto:

parceiros

usuarios

qualquer outra tabela public sem prefixo wp\_

Exceção técnica: Supabase Auth

auth.users pertence ao Supabase Auth e pode ser utilizado \***\*somente por meio das APIs oficiais de autenticação do
Supabase\*\***.

Não inserir, atualizar ou excluir diretamente registros de auth.users
via SQL.

Regras obrigatórias para o Claude Code

Antes de qualquer SELECT, INSERT, UPDATE, DELETE, relacionamento ou
alteração ligada ao Supabase:

1. Ler este arquivo.

2. Usar apenas tabelas wp\_ documentadas aqui.

3. Usar exatamente os nomes de colunas documentados.

4. Respeitar tipos, NOT NULL, defaults, PKs e FKs.

5. Não inferir colunas com base no código TypeScript.

6. Não criar tabela ou coluna sem autorização explícita.

7. Não alterar RLS, policies, constraints ou defaults sem autorização
   explícita.

8. Se a estrutura necessária não estiver documentada aqui, \***\*parar e pedir confirmação\*\***.

9. Não usar tabelas antigas sem prefixo wp\_, mesmo que tenham nomes
   ou estruturas semelhantes.

10. Não assumir que IDs numéricos de tabelas diferentes representam a
    mesma entidade.

Convenção de nomes

As tabelas e colunas do banco usam predominantemente snake_case.

Exemplos:

id_funcao

email_parceiro

data_indicacao

uid_parceiro

Não chamar email_parceiro ou data_indicacao de camelCase.

Estrutura documentada das tabelas wp\_

wp_aulas

| coluna | tipo | nullable | default |

|---|---|---:|---|

| id | bigint | NO | null |

| treinamento_id | bigint | NO | null |

| titulo | text | NO | null |

| descricao | text | YES | null |

| tipo_conteudo | text | NO | 'video'::text |

| conteudo_texto | text | YES | null |

| video_url | text | YES | null |

| arquivo_url | text | YES | null |

| link_externo | text | YES | null |

| duracao_minutos | integer | YES | null |

| ordem | integer | NO | 0 |

| ativo | boolean | NO | true |

| created_at | timestamp with time zone | NO | now() |

| updated_at | timestamp with time zone | NO | now() |

wp_categorias_materiais

| coluna | tipo | nullable | default |

|---|---|---:|---|

| id | bigint | NO | null |

| nome | text | NO | null |

| descricao | text | YES | null |

| ordem | integer | NO | 0 |

| ativo | boolean | NO | true |

| created_at | timestamp with time zone | NO | now() |

| updated_at | timestamp with time zone | NO | now() |

wp_comunicados

| coluna | tipo | nullable | default |

|---|---|---:|---|

| id | bigint | NO | null |

| titulo | text | NO | null |

| conteudo | text | NO | null |

| imagem_url | text | YES | null |

| destaque | boolean | NO | false |

| ativo | boolean | NO | true |

| data_publicacao | timestamp with time zone | NO | now() |

| data_expiracao | timestamp with time zone | YES | null |

| created_by | uuid | YES | null |

| created_at | timestamp with time zone | NO | now() |

| updated_at | timestamp with time zone | NO | now() |

wp_configuracoes

| coluna | tipo | nullable | default |

|---|---|---:|---|

| chave | text | NO | null |

| valor | jsonb | NO | '{}'::jsonb |

| descricao | text | YES | null |

| updated_at | timestamp with time zone | NO | now() |

| updated_by | uuid | YES | null |

wp_funcoes

| coluna | tipo | nullable | default |

|---|---|---:|---|

| id | bigint | NO | null |

| created_at | timestamp with time zone | NO | now() |

| funcao_nome | text | NO | null |

wp_indicacoes

| coluna | tipo | nullable | default |

|---|---|---:|---|

| id | bigint | NO | null |

| created_at | timestamp with time zone | NO | now() |

| uid_parceiro | uuid | NO | auth.uid() |

| nome_contato | text | YES | null |

| empresa | text | YES | null |

| cnpj | text | NO | null |

| telefone | text | YES | null |

| email | text | YES | null |

| data_indicacao | date | NO | now() |

| data_exclusao | date | YES | null |

| data_venda | date | YES | null |

| data_limite | date | NO | null |

| email_vendedor | text | YES |
'parceiros@catedralempresas.com.br'::text |

| email_parceiro | text | YES | null |

| observacao | text | YES | null |

| origem | text | YES | 'parceiro'::text |

| token_indicacao | text | YES | null |

Regras funcionais confirmadas de wp_indicacoes

uid_parceiro identifica o parceiro autenticado e referencia
wp_parceiros.uid.

O banco já possui default auth.uid() para uid_parceiro.

data_indicacao usa o default now().

data_limite deve ser gravada como \***\*data da indicação + 90
dias\*\***.

origem deve usar o default 'parceiro'.

email_vendedor deve usar o default existente.

email_parceiro deve receber o e-mail do parceiro autenticado,
obtido de wp_parceiros.

Não existe coluna status em wp_indicacoes.

Não criar coluna de status apenas para representar o fluxo atual.

Considerar:

  - \***\*Ativa / em andamento:\*\***
data_venda IS NULL AND data_exclusao IS NULL

  - \***\*Vendida:\*\*** data_venda IS NOT NULL

  - \***\*Excluída / encerrada:\*\*** data_exclusao IS NOT NULL

Não é necessário criar registro inicial em wp_indicacoes_historico
apenas para representar o status inicial.

INSERT de nova indicação --- mapeamento oficial

| informação | origem | coluna |

|---|---|---|

| parceiro autenticado | sessão Supabase Auth / default do banco |
uid_parceiro |

| nome do contato | formulário | nome_contato |

| empresa | formulário | empresa |

| CNPJ | formulário | cnpj |

| telefone | formulário | telefone |

| e-mail do indicado | formulário | email |

| data da indicação | default do banco | data_indicacao |

| data limite | calculada automaticamente: hoje + 90 dias |
data_limite |

| e-mail do parceiro | wp_parceiros.email | email_parceiro |

| observação | formulário | observacao |

| origem | default do banco | origem |

| vendedor | default do banco | email_vendedor |

| token_indicacao | wp_parceiros.token_indicacao (parceiro autenticado) ou
p_token da RPC wp_criar_indicacao_publica (cadastro via link) | token_indicacao |

Campos que NÃO pertencem ao formulário de criação:

data_exclusao

data_venda

wp_indicacoes_historico

| coluna | tipo | nullable | default |

|---|---|---:|---|

| id | bigint | NO | null |

| indicacao_id | bigint | NO | null |

| evento | text | NO | null |

| observacao | text | YES | null |

| created_by | uuid | YES | null |

| created_at | timestamp with time zone | NO | now() |

wp_lancamentos

| coluna | tipo | nullable | default |

|---|---|---:|---|

| id | bigint | NO | null |

| created_at | timestamp with time zone | NO | now() |

| tipo | text | NO | null |

| qtd | integer | NO | null |

| data_lancamento | date | NO | null |

| descricao | text | YES | null |

| email_parceiro | text | NO | null |

| cnpj_empresa | text | YES | null |

wp_materiais

| coluna | tipo | nullable | default |

|---|---|---:|---|

| id | bigint | NO | null |

| categoria_id | bigint | YES | null |

| titulo | text | NO | null |

| descricao | text | YES | null |

| conteudo_texto | text | YES | null |

| arquivo_url | text | YES | null |

| imagem_url | text | YES | null |

| video_url | text | YES | null |

| link_externo | text | YES | null |

| ordem | integer | NO | 0 |

| destaque | boolean | NO | false |

| ativo | boolean | NO | true |

| created_by | uuid | YES | null |

| created_at | timestamp with time zone | NO | now() |

| updated_at | timestamp with time zone | NO | now() |

wp_mensalidadesrecebidas

| coluna | tipo | nullable | default |

|---|---|---:|---|

| id | bigint | NO | null |

| created_at | timestamp with time zone | NO | now() |

| nu_registro | bigint | YES | null |

| co_cliente | text | YES | null |

| no_cliente | text | YES | null |

| nu_cgc | text | YES | null |

| vr_areceber | numeric | YES | null |

| dt_prevista | date | YES | null |

| dt_recebimento | date | YES | null |

| parceiro_id | bigint | YES | null |

| email_parceiro | text | YES | null |

wp_parceiros

Estrutura confirmada diretamente no Supabase:

| coluna | tipo | nullable | default |

|---|---|---:|---|

| id | bigint | NO | null |

| created_at | timestamp with time zone | NO | now() |

| email | text | NO | null |

| nome | text | YES | null |

| telefone | text | YES | null |

| cpf | text | YES | null |

| id_funcao | integer | NO | null |

| ativo | boolean | NO | true |

| uid | uuid | NO | null |

| email_vendedor | text | YES | null |

| pix_conta | text | YES | null |

| nome_sem_acento | text | YES | null |

| endereco_imagem | text | YES | null |

| uid_text | text | YES | null |

| token_indicacao | text | YES |
encode(gen_random_bytes(16), 'hex'::text) |

Regras confirmadas de wp_parceiros

uid existe, é uuid, NOT NULL e é o campo correto de vínculo
com o Supabase Auth.

wp_indicacoes.uid_parceiro referencia wp_parceiros.uid.

id_funcao referencia wp_funcoes.id.

Para identificar o parceiro logado, preferir uid, não id
numérico.

Não assumir equivalência entre wp_parceiros.id e IDs de outras
tabelas.

wp_perguntas_frequentes

Estrutura criada para a página Perguntas Frequentes do Portal:

coluna tipo nullable default

id bigint NO identity
pergunta text NO null
resposta text NO null
categoria text YES null
ordem integer NO 0
ativo boolean NO true
created_at timestamp with time zone NO now()
updated_at timestamp with time zone NO now()

Regras confirmadas de wp_perguntas_frequentes

A tabela é utilizada pela página Perguntas Frequentes.

Exibir aos parceiros somente registros com ativo = true.

As perguntas podem ser agrupadas por categoria.

Dentro de cada categoria, ordenar por ordem ASC e, como critério
secundário, por id ASC.

pergunta contém o texto apresentado no título do item.

resposta contém o conteúdo exibido quando o parceiro abrir a
pergunta.

A interface pode utilizar accordion para abrir e fechar as
respostas.

Parceiros autenticados possuem somente acesso de leitura conforme a
policy RLS existente.

Não permitir INSERT, UPDATE ou DELETE pelo parceiro.

Administração das perguntas deverá ser implementada separadamente.

Não criar novas colunas ou alterar a estrutura sem autorização
explícita.

Tabelas wp\_ referenciadas, mas com colunas ainda não documentadas aqui

As seguintes tabelas aparecem nas PKs/FKs, mas a lista completa de
colunas ainda não foi incluída neste documento:

wp_progresso_aulas

wp_solicitacoes_suporte

wp_treinamentos

Regra

O Claude Code \***\*não deve usar essas tabelas para implementar novas
funcionalidades\*\*** até que suas colunas sejam documentadas aqui.

Se uma tarefa precisar delas, deve parar e pedir a estrutura completa.

Primary Keys

| table_name | column_name |

|---|---|

| wp_aulas | id |

| wp_categorias_materiais | id |

| wp_comunicados | id |

| wp_configuracoes | chave |

| wp_funcoes | id |

| wp_indicacoes | id |

| wp_indicacoes_historico | id |

| wp_lancamentos | id |

| wp_materiais | id |

| wp_mensalidadesrecebidas | id |

| wp_parceiros | id |

| wp_perguntas_frequentes | id |

| wp_progresso_aulas | id |

| wp_solicitacoes_suporte | id |

| wp_treinamentos | id |

Foreign Keys

| table_name | column_name | foreign_table_name |
foreign_column_name |

|---|---|---|---|

| wp_aulas | treinamento_id | wp_treinamentos | id |

| wp_indicacoes | uid_parceiro | wp_parceiros | uid |

| wp_indicacoes_historico | indicacao_id | wp_indicacoes | id |

| wp_lancamentos | cnpj_empresa | wp_indicacoes | cnpj |

| wp_lancamentos | email_parceiro | wp_parceiros | email |

| wp_materiais | categoria_id | wp_categorias_materiais | id |

| wp_mensalidadesrecebidas | parceiro_id | wp_parceiros | id |

| wp_perguntas_frequentes | id |

| wp_parceiros | id_funcao | wp_funcoes | id |

| wp_progresso_aulas | aula_id | wp_aulas | id |

| wp_progresso_aulas | parceiro_id | wp_parceiros | id |

| wp_perguntas_frequentes | id |

| wp_solicitacoes_suporte | parceiro_id | wp_parceiros | id |

| wp_perguntas_frequentes | id |

Regras de autenticação e relacionamento

Supabase Auth

Usuários autenticados pertencem ao Supabase Auth.

Não modificar auth.users diretamente por SQL.

O UUID do Supabase Auth deve ser relacionado ao portal por
wp_parceiros.uid.

Sempre que houver necessidade de identificar o parceiro atual, usar
a sessão autenticada e o uid.

Não aceitar uid_parceiro arbitrário vindo do formulário do
navegador.

RLS de wp_perguntas_frequentes

RLS está habilitado.

Policy de leitura para usuários autenticados:
wp_perguntas_frequentes_select_authenticated.

A policy permite SELECT somente quando ativo = true.

Não assumir permissão de INSERT, UPDATE ou DELETE para parceiros.

Segurança

Não expor service_role no navegador.

Não alterar RLS ou policies sem autorização.

Não usar dados de autenticação privados em cache.

Não confiar em IDs enviados pelo cliente para decidir qual parceiro
é dono de um registro.

Regra final para alterações de banco

Se uma funcionalidade exigir qualquer tabela, coluna, constraint, FK,
default, policy ou regra que não esteja claramente documentada aqui:

\***\*NÃO INVENTAR. NÃO CRIAR AUTOMATICAMENTE. PARAR E
PERGUNTAR.\*\***
