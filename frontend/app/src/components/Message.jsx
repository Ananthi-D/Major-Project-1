import React,{useEffect} from 'react';
import { Alert } from 'react-bootstrap';

function Message({variant,children,onClose}) {
  useEffect(()=>{
    const timer=setTimeout(()=>{
      if (onClose) {
      // Clear the message after 3 seconds
      onClose();
      }
    },15000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [onClose]);

  return (
    <Alert 
    variant={variant} 
    dismissible={!!onClose}
    onClose={onClose} >
      {children}
    </Alert>
  );
}

export default Message;