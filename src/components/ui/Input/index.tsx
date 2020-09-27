import React, { FC } from "react";
import "./styles.scss";

const Input: FC<InputProps> = ({
  label,
  ref,
  name,
  errMsg,
  type,
  ...rest
}: InputProps) => (
  <div className="input">
    <label htmlFor={label}>{label}</label>
    {type === "textarea" ? (
      // @ts-ignore
      <textarea id={`${label}${name}`} name={name} {...rest} />
    ) : (
      <input
        // @ts-ignore
        ref={ref}
        id={`${label}${name}`}
        type={type || "text"}
        {...rest}
        name={name}
      />
    )}

    {errMsg && <p>{errMsg}</p>}
  </div>
);

export interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
    HTMLInputElement | HTMLTextAreaElement
  > {
  label: string;
  placeholder: string;
  errMsg?: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
}

export default Input;
