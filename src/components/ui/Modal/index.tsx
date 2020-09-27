import React, { useEffect, FC } from "react";
import ReactDOM from "react-dom";

const el = document.createElement("div");
el.classList.add("modal-root");

const Modal: FC<Props> = (props: Props) => {
  useEffect(() => {
    const body = document.querySelector("body");
    if (body) {
      body.appendChild(el);
    }

    return () => {
      if (body) {
        body.removeChild(el);
      }
    };
  }, []);

  return ReactDOM.createPortal(props.children, el);
};

type Props = {
  children?: React.ReactNode;
};

export default Modal;
