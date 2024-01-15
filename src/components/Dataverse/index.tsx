import { css } from '@emotion/react';
import { IPFS } from './ipfs';
import { useState } from 'react';

const ipfs = new IPFS();
let cid: string = 'QmTuy7MBuHJNbyNYxTz8cdge1Xb97H6aMZxyJegWBBHAcj';

const Dataverse = function () {
  const [originFile, setOriginFile] = useState<string>();
  const [contentType, setContentType] = useState<string>();

  const handleSelectFile = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jpg,.png,.jpeg,.gif,.heic,.webp';
    input.click();
    return new Promise<File>((resolve) => {
      input.addEventListener('change', (e: any) => {
        const file = e.target.files[0];
        resolve(file);
      });
    });
  };

  const uploadFile = async () => {
    const file = await handleSelectFile();
    console.log(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const fileBase64: string = await new Promise((resolve) => {
      reader.addEventListener('load', async (e: any) => {
        resolve(e.target.result);
      });
    });
    console.log(fileBase64);
    cid = await ipfs.uploadFile(fileBase64);
    console.log(cid);
  };

  const getFileContentType = async () => {
    const contentType = await ipfs.getFileContentType(cid);
    console.log(contentType);
    setContentType(contentType);
  };

  const retriveFile = async () => {
    const originFile = await ipfs.retriveFile(cid);
    console.log(originFile);
    setOriginFile(originFile);
  };

  return (
    <div>
      <div
        css={css`
          font-size: 100px;
          padding: 20px;
          button {
            width: fit-content;
            margin: 10px;
          }
        `}
      >
        <button onClick={async () => uploadFile()}>uploadFile</button>
        <button onClick={async () => getFileContentType()}>getFileContentType</button>
        <button onClick={async () => retriveFile()}>retriveFile</button>
      </div>
      {contentType?.includes('image') && <img src={ipfs.getFileLink(cid)} />}
      {originFile?.match('data:image/.*;base64,') && <img src={originFile} />}
    </div>
  );
};

export default Dataverse;
