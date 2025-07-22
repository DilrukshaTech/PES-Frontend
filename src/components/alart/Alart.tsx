import { Dialog, DialogContent, DialogTitle, DialogContentText, Button } from '@mui/material';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import useFeedbackAlertStore from '../../store/useFeedbackAlartStore';
import './alart.scss'
const FeedbackAlert = () => {
  const { msg, type, visible, hideFeedback } = useFeedbackAlertStore();

  if (!visible) return null; // prevent rendering if not visible

  const isError = type === 'failed';

  const icon = isError ? (
    <FiXCircle size={28} color="#f44336" style={{ marginRight: 8 }} />
  ) : (
    <FiCheckCircle size={28} color="#4caf50" style={{ marginRight: 8 }} />
  );

  const title = isError ? 'Something went wrong' : 'Success';

  return (
    <Dialog open={visible} onClose={hideFeedback} className='feedback-dialog'>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
        {icon}
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ fontSize: '1.2rem', color: 'text.secondary' }}>
          {msg}
        </DialogContentText>
      </DialogContent>

      <Button
        onClick={hideFeedback}
        variant="contained"
       className={isError ? 'error' : 'success'}
        sx={{ m: 2, ml: 'auto', display: 'block' }}
      >
        OK
      </Button>
    </Dialog>
  );
};

export default FeedbackAlert;
