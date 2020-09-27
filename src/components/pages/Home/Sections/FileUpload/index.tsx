import React, { FC, useCallback, useState } from "react";
import { User } from "firebase";
import { useDropzone } from "react-dropzone";
import firebaseApp from "../../../../../configs/firebase";
import "./styles.scss";

const FileUpload: FC<Props> = ({ user, updateFiles }: Props) => {
  const [files, setFiles] = useState<any[]>([]);
  const [status, setStatus] = useState<Status>({
    rejected: false,
    uploaded: false,
    uploadingPercent: 0,
    percentages: [],
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) {
        return setStatus({
          ...status,
          rejected: true,
        });
      }

      setStatus({
        ...status,
        rejected: false,
      });

      setFiles(acceptedFiles.map((file) => file.name));

      const fileUploads = await Promise.allSettled(
        acceptedFiles.map(
          (file, ind: number) =>
            new Promise((res, rej) => {
              const pdfRef = firebaseApp
                .storage()
                .ref(`pdfs/${user?.uid}/${file.name}`);
              const upload = pdfRef.put(file);

              upload.on(
                "state_changed",
                (snapshot) => {
                  setStatus((stat) => {
                    const percentage =
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    const percentages = [...stat.percentages];
                    percentages[ind] = percentage || 0;
                    const totalPecentage = percentages.reduce(
                      (acc, current) => acc + current,
                      0
                    );

                    return {
                      ...stat,
                      percentages,
                      uploadingPercent: totalPecentage / acceptedFiles.length,
                    };
                  });
                },
                (err) => {
                  console.error(err);
                  rej(err);
                },
                () => {
                  res(file.name);
                }
              );
            })
        )
      );

      const succesfulRes = fileUploads.filter(
        (res) => res.status === "fulfilled"
      );
      const fileNames = succesfulRes.map((res) => res.value);
      setStatus({ ...status, uploaded: true });
      setFiles(fileNames);
      updateFiles(fileNames);
      return setTimeout(() => {
        setStatus({ ...status, uploaded: false });
        setFiles([]);
      }, 5000);
    },
    [status, updateFiles, user]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isFileDialogActive,
  } = useDropzone({
    onDrop,
    accept: [".pdf", ".PDF"],
    multiple: true,
    disabled: !!files.length,
  });

  const { rejected, uploaded, uploadingPercent } = status;
  return (
    <div className="dragContainer">
      <div
        {...getRootProps({
          className: `${
            isDragActive || isFileDialogActive
              ? "dragActive"
              : rejected
              ? "dragRejected"
              : files.length
              ? "uploading"
              : ""
          }`,
        })}
      >
        <input {...getInputProps()} />
        {!files.length ? (
          <div className="uploadBoard">
            <div>
              <p>Click to upload</p>
            </div>
            <p>You can upload multiple files at once</p>
          </div>
        ) : !uploaded ? (
          <div className="uploading">
            <div>
              {files.map((fileName) => (
                <div key={fileName} className="file">
                  <p>{fileName}</p>
                </div>
              ))}
            </div>
            <div>
              <span>
                <span>
                  <span style={{ width: `${uploadingPercent}%` }} />
                </span>
              </span>
            </div>
          </div>
        ) : (
          <div className="uploaded">
            <div>
              <p>{files.length} file(s) uploaded successfully</p>
              <p>Processing...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

type Status = {
  rejected: boolean;
  uploaded: boolean;
  uploadingPercent: number;
  percentages: number[];
};

type Props = {
  user: User;
  updateFiles: (files: string[]) => any;
};

export default FileUpload;
