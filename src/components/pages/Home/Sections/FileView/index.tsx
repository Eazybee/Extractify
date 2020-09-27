import React, { forwardRef } from "react";
import "./styles.scss";
import Input from "../../../../ui/Input";

const FileView = forwardRef(({ files }: Props, ref: any) => (
  <div className="fileview">
    <div ref={ref}>
      {files.map((file) => (
        <div key={file.name}>
          <Input
            label={file.name}
            value={file.text}
            type="textarea"
            onChange={() => {}}
            placeholder=""
            style={{
              resize: "vertical",
              height: "15rem",
            }}
          />
        </div>
      ))}
    </div>
  </div>
));

type Props = {
  files: {
    text: string;
    name: string;
  }[];
};

export default FileView;
