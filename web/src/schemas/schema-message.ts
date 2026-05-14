export const SchemaMessageTypes = {
  REQUIRED_FIELD: 'Este campo é obrigatório.',
  INVALID_EMAIL: 'O email informado é inválido.',
  INVALID_PHONE: 'Informe um telefone válido com DDD.',
  INVALID_FUTURE_DATE: 'A data precisa ser no futuro.',
  MIN_ONE_CONTACT: 'Selecione ao menos um contato.',
  MAX_CARACTERS: (max: number) =>
    `O campo deve ter no máximo ${max} caracteres.`,
  MIN_CARACTERS: (min: number) =>
    `O campo deve ter no mínimo ${min} caracteres.`,
};
