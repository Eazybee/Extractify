import React, { FC } from "react";
import "./styles.scss";

const LoadingSpinner: FC<Props> = (props: Props) => {
  const {
    height = 100,
    positionTop = 0,
    text = "Loading",
    style = {},
    textStyle = {},
  } = props;

  return (
    <div
      className="loading-spinner"
      style={{
        height,
        paddingTop: height ? height / 2 - 12 : 0,
        top: positionTop || 0,
        position: positionTop ? "relative" : "static",
        ...style,
      }}
    >
      <div className="spinner" />
      <p style={textStyle}>{text}</p>
    </div>
  );
};

type Props = {
  height?: number;
  positionTop?: number;
  text?: string;
  style?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  className?: string;
};

export default LoadingSpinner;
