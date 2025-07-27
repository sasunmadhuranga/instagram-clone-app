import { createPortal } from "react-dom";

const ModalPortal = ({ children }) => {
  const modalRoot = document.getElementById("modal-root");
  return modalRoot ? createPortal(children, modalRoot) : null;
};

export default ModalPortal;
