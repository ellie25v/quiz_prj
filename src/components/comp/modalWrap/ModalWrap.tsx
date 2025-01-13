import { useRef, useEffect, ReactNode } from "react";
import "./modalWrap.css"; 

interface ModalWrapProps {
  onClose: () => void;
  isOpen: boolean;
  title: string;
  sizeWidth?: number;
  sizeHeight?: number | string;
  children: ReactNode;
}

const ModalWrap: React.FC<ModalWrapProps> = ({
  onClose,
  isOpen,
  title,
  sizeWidth = 400,
  sizeHeight = "auto",
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
        document.removeEventListener("mousedown", handleOutsideClick);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);

  return (
    <div className={`modal__backdrop ${isOpen ? "open" : ""}`}>
      <div
        style={{
          width: `${sizeWidth}px` ,
          height: sizeHeight === "auto" ? sizeHeight : sizeHeight + "px",
        }}
        className="modal__content"
        ref={modalRef}
      >
        {/* {isOpen && ( */}
          <>
            <div className="modal__header">
              <h2>{title}</h2>
              <button type="button" className="close-btn" onClick={onClose}>
                X
              </button>
            </div>
            {children}
          </>
        {/* )} */}
      </div>
    </div>
  );
};

export default ModalWrap;
