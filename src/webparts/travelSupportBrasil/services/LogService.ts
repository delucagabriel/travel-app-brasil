import { sp } from "@pnp/sp";

interface iLog {
  Title:string; 
  Request:string; 
  Response:string;
}

export const Log = (data:iLog) => sp.web.lists.getByTitle('Logs').items
  .add(data)
  .then(res => { 
    console.log("Log success:", res.data.Id);
  })
  .catch(error=>{
    console.log("Log error: ", error, data);
  });
