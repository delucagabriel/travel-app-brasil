import { sp } from "@pnp/sp";


export const GetCorporateCardConfig = async ()=>{
    let items = await sp.web
    .lists.getByTitle("Config_CartaoCorporativo").items.get();
    return items;
  };