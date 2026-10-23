import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

function Notification({ show, message, onClose, variant = 'success', title = 'Уведомление' }) {
  return (
    <ToastContainer
      position="bottom-end"
      className="p-3"
      style={{ position: 'fixed', zIndex: 9999 }}
    >
      <Toast
        show={show}
        onClose={onClose}
        delay={3000}
        autohide
        bg={variant}
      >
        <Toast.Header>
          <strong className="me-auto">{title}</strong>
          <small>только что</small>
        </Toast.Header>
        <Toast.Body className={variant === 'light' ? 'text-dark' : 'text-white'}>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default Notification;