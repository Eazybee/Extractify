import React, { FC, useState } from "react";
import "./styles.scss";

const FileList: FC<Props> = ({ files, deleteFile, showFile }: Props) => {
  const [status, setStatus] = useState(files.map((file) => false));

  const onClick = async (index: number, filename: string) => {
    if (!status[index]) {
      const newStatus = [...status];
      newStatus[index] = true;
      setStatus(newStatus);

      await showFile(filename);

      newStatus[index] = false;
      setStatus(newStatus);
    }
  };
  return (
    <div className="files">
      {files.map((file, index: number) => (
        <div
          key={file.key}
          role="button"
          tabIndex={0}
          onClick={() => onClick(index, file.name)}
          onKeyPress={() => onClick(index, file.name)}
          aria-label={`Show ${file}`}
          className={status[index] ? "disabled" : ""}
        >
          <p>{file.name}</p>
          <button
            type="button"
            aria-label="Delete"
            onClick={(e) => deleteFile(file.name, file.key, e)}
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};

type Props = {
  files: {
    key: string;
    name: string;
  }[];
  deleteFile: (
    name: string,
    key: string,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  showFile: (name: string) => Promise<void>;
};

export default FileList;
