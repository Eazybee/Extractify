import React, { forwardRef } from "react";
import "./styles.scss";
import Input from "../../../../ui/Input";
import LoadingSpinner from "../../../../ui/LoadingSpinner";

const FileView = forwardRef(({ files }: Props, ref: any) => (
  <div className="fileview">
    <div ref={ref}>
      {files.length ? files.map((file) => (
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
      )) : <LoadingSpinner />}

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
