import { Fragment } from "react";

const Modal = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null;

  return (
    <Fragment>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50" // backdrop-blur-sm
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed left-1/2 top-1/2 z-50 ${className} -translate-x-1/2 -translate-y-1/2 rounded-xl bg-background p-6 shadow-lg`}
      >
        {children}
      </div>
    </Fragment>
  );
};

export default Modal;
