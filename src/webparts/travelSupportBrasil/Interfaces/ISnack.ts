import { AlertProps } from '@material-ui/lab';

export interface ISnack extends AlertProps {
  open: boolean;
  message: string;
}
