import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Overlay, Modal } from './Modal.styled';

export function AddModal({ largeImageURL, tags, onClose, id, onKeyDown }) {
  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <Overlay onClick={onClose}>
      <Modal>
        <img src={largeImageURL} alt={tags} id={id} />
      </Modal>
    </Overlay>
  );
}

AddModal.propTypes = {
  largeImageURL: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};
