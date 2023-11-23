import { css } from '@emotion/react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import LitJsSDK from '@lit-protocol/lit-node-client';
import { checkAndSignAuthMessage } from '@lit-protocol/auth-browser';
import { encryptString, decryptToString } from '@lit-protocol/encryption';
import acl from './acl.json';
import { base16ToString, stringToBase16 } from '@/utils';

console.log(LitJsSDK);
const Lit = function () {
  const [litNodeClient, setLitNodeClient] = useState();
  const [ciphertext, setCiphertext] = useState<string>('');
  const [base16, setBase16] = useState<string>('');
  const [dataToEncryptHash, setDataToEncryptHash] = useState<string>('');

  const initLit = async (): Promise<any> => {
    const client = new globalThis.LitNodeClient({
      alertWhenUnauthorized: false,
      debug: false,
    });
    setLitNodeClient(client);
    await client.connect();
    console.log(client)
    return client;
  };

  const encrypt = async () => {
    let litNodeClientScoped = litNodeClient;
    if (!litNodeClient) {
      litNodeClientScoped = await initLit();
    }
    const authSig = await checkAndSignAuthMessage({ chain: 'ethereum' });
    const { ciphertext, dataToEncryptHash } = await encryptString(
      {
        unifiedAccessControlConditions: acl as any,
        authSig,
        chain: 'ethereum',
        dataToEncrypt: 'this is a secret message',
      },
      litNodeClientScoped!,
    );
    console.log({
      ciphertext,
      dataToEncryptHash,
    });
    setCiphertext(ciphertext);
    setDataToEncryptHash(dataToEncryptHash);
    return {
      ciphertext,
      dataToEncryptHash,
    };
  };

  const decrypt = async () => {
    let litNodeClientScoped = litNodeClient;
    if (!litNodeClient) {
      litNodeClientScoped = await initLit();
    }

    const authSig = await checkAndSignAuthMessage({ chain: 'ethereum' });

    const decryptedString = await decryptToString(
      {
        unifiedAccessControlConditions: acl as any,
        ciphertext,
        dataToEncryptHash,
        authSig,
        chain: 'ethereum',
      },
      litNodeClientScoped!,
    );
    console.log({
      decryptedString,
    });
    return { decryptedString };
  };

  const stringToBase16Method = async () => {
    const res = stringToBase16(JSON.stringify(acl));
    setBase16(res);
    console.log(res);
  };

  const base16ToStringMethod = async () => {
    const res = base16ToString(base16);
    console.log(res);
  };

  return (
    <div
      css={css`
        padding: 20px;
        button {
          width: fit-content;
          margin: 10px;
        }
      `}
    >
      <button onClick={() => initLit()}>initLit</button>
      <button onClick={() => encrypt()}>encrypt</button>
      <button onClick={() => decrypt()}>decrypt</button>
      <button onClick={() => stringToBase16Method()}>stringToBase16</button>
      <button onClick={() => base16ToStringMethod()}>base16ToString</button>
    </div>
  );
};
export default Lit;
