import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../contexts/User";
import "./styles.scss";
import FileUpload from "./Sections/FileUpload";
import FileList from "./Sections/FileList";
import firebaseApp from "../../../configs/firebase";
import { cloudFunctionUrl } from "../../../utils/constants";
import Modal from "../../ui/Modal";
import FileView from "./Sections/FileView";
import useComponentVisible from "../../../hooks/useComponentVisible";
import { logOut } from "../../../contexts/UserAction";

const HomePage = () => {
  const [files, setFiles] = useState<{ key: string; name: string }[]>([]);
  const [show, setShow] = useState(false);
  const [extracted, setExtracted] = useState<{ text: string; name: string }[]>(
    []
  );
  const {
    ref,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible(false);
  const { user, dispatch } = useContext(UserContext);

  useEffect(() => {
    if (!isComponentVisible) {
      setShow(false);
      setExtracted([]);
    }
  }, [isComponentVisible]);

  useEffect(() => {
    const usersDb = firebaseApp.database().ref("users");
    if (user) {
      usersDb.child(user.uid).on("child_added", (snapshot) => {
        const filename = snapshot.val();
        if (filename && snapshot.key) {
          setFiles((filenames) => [
            ...filenames,
            {
              key: snapshot.key || " ",
              name: filename,
            },
          ]);
        }
      });

      usersDb.child(user.uid).on("child_removed", (snapshot) => {
        if (snapshot.key) {
          setFiles((filenames) =>
            filenames.filter((file) => file.key !== snapshot.key)
          );
        }
      });
    }
  }, [user]);

  const extractFile = async (name: string) => {
    console.log('ok');

    const url = await firebaseApp
      .storage()
      .ref(`pdfs/${user?.uid}/${name}`)
      .getDownloadURL();

      console.log('ok2');

    if (cloudFunctionUrl) {
      return fetch(cloudFunctionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileLink: url }),
      }).then((res) => res.json());
    }
  };

  const showFile = async (filename: string) => {
    setShow(true);
    try {
      const res = await extractFile(filename);

      if (res.text) {
        setExtracted([
          {
            name: filename,
            text: res.text,
          },
        ]);
        setIsComponentVisible(true);
      }
    } catch (error) {
      console.error(error, 'bee');
      setShow(false);
    }
  };

  const deleteFile = async (
    filename: string,
    key: string,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    try {
      firebaseApp.database().ref(`users/${user?.uid}/${key}`).remove().then(() => {
        firebaseApp.storage().ref(`pdfs/${user?.uid}/${filename}`).delete();
      });
    } catch (error) {
      console.error(error);
    }
  };

  const updateFiles = async (filesnames: string[]) => {
    setShow(true);
    const usersDb = firebaseApp.database().ref("users");
    if (user) {
      const fileLinks = await Promise.allSettled(
        filesnames.map((name) => usersDb.child(user.uid).push(name))
      );
      const dbFilenames: string[] = [];
      for (let i = 0; i < fileLinks.length; i += 1) {
        if (fileLinks[i].status === "fulfilled") {
          dbFilenames.push(filesnames[i]);
        }
      }

      const extractions = await Promise.allSettled(
        dbFilenames.map(extractFile)
      );

      const successfulExtraction: { text: string; name: string }[] = [];
      extractions.forEach((e, index) => {
        if (e.status === "fulfilled" && e.value?.text) {
          successfulExtraction.push({
            name: dbFilenames[index],
            text: e.value.text,
          });
        }
      });

      if (successfulExtraction) {
        setExtracted(successfulExtraction);
        setIsComponentVisible(true);
      } else {
        setShow(false);
      }
    }
  };

  const fileViewProps: any = {
    files: extracted,
  };

  if (extracted.length) {
    fileViewProps.ref = ref;
  }

  return (
    <div className="homePage">
      <header>
        <h1>Extractify</h1>{" "}
        <button type="button" onClick={() => logOut(dispatch)}>
          Log out
        </button>
      </header>
      <main>
        {user ? <FileUpload user={user} updateFiles={updateFiles} /> : ""}
        <FileList files={files} deleteFile={deleteFile} showFile={showFile} />
      </main>
      {show ? (
        <Modal>
          <FileView {...fileViewProps} />
        </Modal>
      ) : null}
    </div>
  );
};

export default HomePage;
