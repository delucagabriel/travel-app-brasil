import { corporateCardConfig } from "../../../../formConfigurations/corporateCards";
import { IRequests_AllFields } from "../../../../Interfaces/Requests/IRequests";
import { TestaCPF } from "../../../../Utils/validaCPF";
import * as yup from "yup";


export const newCreditCardSchema: yup.ObjectSchema<IRequests_AllFields> = yup.object().shape({
    MACROPROCESSO: yup.string().required(),
    PROCESSO: yup.string().required(),
    ALCADA_APROVACAO: yup.string()
    .when('TIPO_LIMITE_VALOR', (TIPO_LIMITE_VALOR, sch) => {
      if(
        [
          corporateCardConfig.tipo_cartao_valor.Tipo_I,
          corporateCardConfig.tipo_cartao_valor.Tipo_II,
          corporateCardConfig.tipo_cartao_valor.Tipo_III,
          corporateCardConfig.tipo_cartao_valor.Tipo_IV
        ].indexOf(TIPO_LIMITE_VALOR) >=0 ) return sch.default('D-3');
  
      if(
        [
          corporateCardConfig.tipo_cartao_valor.Tipo_V,
          corporateCardConfig.tipo_cartao_valor.Tipo_VI
        ].indexOf(TIPO_LIMITE_VALOR)>=0) return sch.default('D-2');
  
        if(TIPO_LIMITE_VALOR === corporateCardConfig.tipo_cartao_valor.Tipo_VII) return sch.default('D-1');
    }),
    SLA: yup.number().default(72),
    AREA_RESOLVEDORA: yup.string().default("Bradesco"),
    WF_APROVACAO: yup.boolean().default(true),
  
    BENEFICIARIO_ID: yup.string().required(),
    BENEFICIARIO_NOME: yup.string().required(),
    BENEFICIARIO_NASCIMENTO: yup.date().required(),
    BENEFICIARIO_EMPRESA_NOME: yup.string().required(),
    BENEFICIARIO_EMAIL: yup.string().email().notRequired(),
    BENEFICIARIO_EMPRESA_COD: yup.string().required(),
    BENEFICIARIO_CARGO: yup.string().required(),
    BENEFICIARIO_LEVEL: yup.string().required(),
    TELEFONE: yup.string(),
    CPF: yup.string().test('validCPF','CPF inválido',(cpf)=>TestaCPF(cpf)).required(),
    CENTRO_DE_CUSTOS: yup.string().required(),
    END_CEP: yup.string().required(),
    END_LOGRADOURO: yup.string().required(),
    END_NUMERO: yup.number().default(0),
    END_COMPLEMENTO: yup.string(),
    VIA_CARTAO: yup.string(), 
  
    APROVADOR_ID: yup.string().required(),
    APROVADOR_NOME: yup.string().required(),
    APROVADOR_EMAIL: yup.string().email().required(),
    APROVADOR_EMPRESA_COD: yup.string().required(),
    APROVADOR_EMPRESA_NOME: yup.string().required(),
    APROVADOR_LEVEL: yup.string()
    .when('ALCADA_APROVACAO', (ALCADA_APROVACAO, sch) => {
      if(ALCADA_APROVACAO === 'D-3') return sch.oneOf(['D-3', 'D-2', 'D-1', 'DE'], "Nível de aprovação mínimo é D-3");
      if(ALCADA_APROVACAO === 'D-2') return sch.oneOf(['D-2', 'D-1', 'DE'], "Nível de aprovação mínimo é DE-2");
      if(ALCADA_APROVACAO === 'D-1') return sch.oneOf(['D-1', 'DE'], "Nível de aprovação mínimo é DE-1");
      })
    .required(),
  
    TIPO_LIMITE_VALOR: yup.string().required(),
    VISA_INFINITE: yup.string().default("Visa Corporativo")
  });