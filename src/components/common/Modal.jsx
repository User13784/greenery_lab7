import React from 'react';
import { Modal as BootstrapModal, Button } from 'react-bootstrap';

function Modal({ isOpen, onClose, children, title, size = 'lg' }) {
  return (
    <BootstrapModal
      show={isOpen}
      onHide={onClose}
      centered
      size={size}
      backdrop="static"
      keyboard={true}
    >
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{title}</BootstrapModal.Title>
      </BootstrapModal.Header>

      <BootstrapModal.Body>
        {children}
      </BootstrapModal.Body>

      <BootstrapModal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Закрыть
        </Button>
      </BootstrapModal.Footer>
    </BootstrapModal>
  );
}

export default Modal;