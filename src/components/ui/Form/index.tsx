import React, { FC } from "react";
import Input, { InputProps } from "../Input";
import "./styles.scss";

const Form: FC<Props> = ({
  disabled,
  inputs,
  submitLbl,
  onSubmit,
  error,
}: Props) => (
  <div className="form">
    <p className="error">{error ?? ""}</p>
    <form onSubmit={onSubmit}>
      {inputs.map((inp) => (
        <Input {...inp} key={inp.label} />
      ))}
      <button disabled={disabled} type="submit">
        {submitLbl}
      </button>
    </form>
  </div>
);

type Props = {
  error?: string;
  inputs: InputProps[];
  submitLbl: string;
  disabled?: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default Form;
