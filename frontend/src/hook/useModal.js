import { useState } from 'react';

function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function toggle() {
    setIsOpen(!isOpen);
  }

  return { isOpen, openModal, closeModal, toggle };
}

export default useModal;
