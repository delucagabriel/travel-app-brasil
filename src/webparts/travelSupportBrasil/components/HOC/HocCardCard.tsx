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
    <Card style={{cursor:"pointer"}} onClick={ ()=> history.push(destination) }>
      <CardContent>
      { icon }
        <Typography align="center" variant="h5" component="p">
          { qtd }
        </Typography>
        <Typography align="center" variant="subtitle1" component="p">
          { content }
        </Typography>
      </CardContent>
    </Card>
  );
}
