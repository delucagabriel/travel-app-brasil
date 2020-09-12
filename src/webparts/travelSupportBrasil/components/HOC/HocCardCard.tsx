import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import More from '@material-ui/icons/ForwardSharp';
import { useHistory } from 'react-router-dom';


export default function HocCard({content, qtd, destination, icon=null}) {
  const history = useHistory();

    return (
    <Card>
      <CardContent>
      { icon }
        <Typography align="center" variant="h5" component="p">
          { qtd }
        </Typography>
        <Typography align="center" variant="subtitle1" component="p">
          { content }
        </Typography>
      </CardContent>
      <CardActions style={{float:"right"}}>
        <Button onClick={ ()=> history.push(destination) } size="small"> <small>More information </small><More/></Button>
      </CardActions>
    </Card>
  );
}
