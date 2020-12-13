export const yup_pt_br = {
  mixed: {
    default: 'Valor do campo é inválido',
    required: 'Campo obrigatório',
    oneOf: 'Valor do campo deve ser um dos seguintes valores: ${values}',
    notOneOf: 'Valor do campo não pode ser um dos seguintes valores: ${values}',
  },
  string: {
    required: 'Campo obrigatório',
    length: 'Valor do campo deve ter exatamente ${length} caracteres',
    min: 'Valor do campo deve ter pelo menos ${min} caracteres',
    max: 'Valor do campo deve ter no máximo ${max} caracteres',
    email: 'Valor do campo tem o formato de e-mail inválido',
    url: 'Valor do campo deve ter um formato de URL válida',
    trim: 'Valor do campo não deve conter espaços no início ou no fim.',
    lowercase: 'Valor do campo deve estar em maiúsculo',
    uppercase: 'Valor do campo deve estar em minúsculo',
  },
  number: {
    min: 'Valor do campo deve ser no mínimo ${min}',
    max: 'Valor do campo deve ser no máximo ${max}',
    lessThan: 'Valor do campo deve ser menor que ${less}',
    moreThan: 'Valor do campo deve ser maior que ${more}',
    notEqual: 'Valor do campo não pode ser igual à ${notEqual}',
    positive: 'Valor do campo deve ser um número positivo',
    negative: 'Valor do campo deve ser um número negativo',
    integer: 'Valor do campo deve ser um número inteiro',
  },
  date: {
    min: 'Data deve ser maior que a data ${min}',
    max: 'Data deve ser menor que a data ${max}',
  },
  array: {
    min: 'Valor do campo deve ter no mínimo ${min} itens',
    max: 'Valor do campo deve ter no máximo ${max} itens',
  },
};
