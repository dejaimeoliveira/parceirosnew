/**
 * Tradução centralizada das mensagens de erro do Supabase Auth para pt-BR.
 *
 * Prioriza sempre `error.code` (estável entre versões do GoTrue) em vez de
 * comparar o texto de `error.message`, que muda de redação sem aviso e
 * chega em inglês. Nunca repassa `error.message` ao usuário.
 *
 * Função pura, sem dependências de runtime — pode ser chamada tanto em
 * componentes "use client" quanto em Route Handlers server-side.
 */

export type AuthErrorContext =
  | "login"
  | "signup"
  | "recovery"
  | "confirm"
  | "update-password";

const ERROR_CODE_MESSAGES: Record<string, string> = {
  invalid_credentials: "E-mail ou senha incorretos.",
  email_not_confirmed: "Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.",
  user_banned: "Este acesso está temporariamente bloqueado. Entre em contato com a Catedral Automação.",
  over_request_rate_limit: "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.",
  over_email_send_rate_limit: "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.",
  user_already_exists: "Já existe um cadastro com este e-mail.",
  email_exists: "Já existe um cadastro com este e-mail.",
  email_address_invalid: "Informe um e-mail válido.",
  signup_disabled: "Novos cadastros estão temporariamente indisponíveis. Tente novamente mais tarde.",
  otp_expired: "Este link não é mais válido. Solicite um novo link para continuar.",
  otp_disabled: "Este link não é mais válido. Solicite um novo link para continuar.",
  flow_state_not_found: "Este link não é mais válido. Solicite um novo link para continuar.",
  flow_state_expired: "Este link não é mais válido. Solicite um novo link para continuar.",
  bad_code_verifier: "Este link não é mais válido. Solicite um novo link para continuar.",
  weak_password: "A senha informada não atende aos requisitos de segurança.",
  same_password: "A nova senha deve ser diferente da senha atual.",
  session_not_found: "Sua sessão expirou. Solicite um novo link para continuar.",
  session_expired: "Sua sessão expirou. Solicite um novo link para continuar.",
  user_not_found: "Não foi possível concluir a operação. Tente novamente.",
  // unexpected_failure é o código genérico que o próprio Supabase usa para
  // falhas internas não catalogadas — cai propositalmente no fallback do
  // contexto abaixo, junto com qualquer outro código desconhecido.
};

const FALLBACK_MESSAGES: Record<AuthErrorContext, string> = {
  login: "Não foi possível entrar. Tente novamente.",
  signup: "Não foi possível concluir o cadastro. Tente novamente.",
  recovery: "Não foi possível concluir a solicitação. Tente novamente.",
  confirm: "Não foi possível validar este link. Solicite um novo link e tente novamente.",
  "update-password": "Não foi possível alterar sua senha. Tente novamente.",
};

const DEFAULT_FALLBACK_MESSAGE = "Ocorreu um erro. Tente novamente.";

function getFallbackMessage(context?: AuthErrorContext): string {
  if (context && context in FALLBACK_MESSAGES) {
    return FALLBACK_MESSAGES[context];
  }
  return DEFAULT_FALLBACK_MESSAGE;
}

/**
 * Traduz um código de erro do Supabase Auth (`error.code`) para uma
 * mensagem segura em pt-BR. Códigos desconhecidos ou ausentes caem no
 * fallback do contexto informado.
 */
export function getAuthErrorMessageFromCode(
  code: string | null | undefined,
  context?: AuthErrorContext,
): string {
  if (code && ERROR_CODE_MESSAGES[code]) {
    return ERROR_CODE_MESSAGES[code];
  }
  return getFallbackMessage(context);
}

/**
 * Traduz um erro do Supabase Auth (ou qualquer erro capturado em um
 * try/catch) para uma mensagem segura em pt-BR, a partir do seu
 * `error.code`. Nunca retorna `error.message`.
 */
export function getAuthErrorMessage(error: unknown, context?: AuthErrorContext): string {
  return getAuthErrorMessageFromCode(extractErrorCode(error), context);
}

function extractErrorCode(error: unknown): string | undefined {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
  ) {
    return (error as { code: string }).code;
  }
  return undefined;
}
