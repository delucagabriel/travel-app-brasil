import * as React from 'react';
import { HocRenderDetails } from '../HOC/HocRenderDetails';
import { getRequestById } from '../../services/RequestServices';
import { Grid, Dialog } from '@material-ui/core';
import { IRequests_AllFields } from '../../Interfaces/Requests/IRequests';


export default function DetailsById(props) {
  const [requestDetails, setRequestDetails] = React.useState<IRequests_AllFields>();

  React.useEffect(()=>{
    getRequestById(Number(props.match.params.id)).then(response => setRequestDetails(response));
    console.log(requestDetails);
  }, []);

  return (
    <Grid container>
      { requestDetails ?
        <Dialog fullScreen open={true}>
          <HocRenderDetails
            type={requestDetails.MACROPROCESSO}
            details={requestDetails}
          />
        </Dialog>
        :
        <h1>Loading...</h1>
        }
    </Grid>

  );
}
