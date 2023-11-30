import { css } from '@emotion/react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import LitJsSDK from '@lit-protocol/lit-node-client';
import { checkAndSignAuthMessage } from '@lit-protocol/auth-browser';
import { encryptString, decryptToString } from '@lit-protocol/encryption';
import acl from './acl.json';
import { base16ToString, stringToBase16, utf8ToString } from '@/utils';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { LitAccessControlConditionResource, LitAbility } from '@lit-protocol/auth-helpers';
import { SiweMessage } from 'siwe';
import { Web3 } from 'web3';

LitJsSDK;
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
    console.log(client);
    return client;
  };

  const authSigNeededCallback = async (withLitResource?: boolean) => {
    const domain = location.host;
    const web3 = new Web3(window.ethereum);
    window.ethereum.enable();
    // const address = await signer.getAddress();
    const [address] = await web3.eth.getAccounts();

    const message = new SiweMessage({
      domain,
      address,
      statement: 'Give this application access to some of your data',
      version: '1',
      uri: 'did:key:z6MktsgQ1qrSisGPb81AnTKsdUzgbePQ5k4QThnhetAujaff',
      nonce: 'hKbh72FQtCLsoI',
      issuedAt: '2023-11-28T10:20:56.117Z',
      expirationTime: '2023-12-05T10:20:56.117Z',
      chainId: 1,
      resources: [...(withLitResource ? ['lit://*'] : [])],
    });
    const toSign = message.prepareMessage();
    const signature = await web3.eth.personal.sign(toSign, address, '');

    const authSig = {
      sig: signature,
      derivedVia: 'web3.eth.personal.sign',
      signedMessage: toSign,
      address,
    };

    return authSig;
  };

  const encrypt = async () => {
    let litNodeClientScoped = litNodeClient;
    if (!litNodeClient) {
      litNodeClientScoped = await initLit();
    }
    const authSig = await authSigNeededCallback(true);
    // const sessionSigs = await getSessionSigs();
    const { ciphertext, dataToEncryptHash } = await encryptString(
      {
        accessControlConditions: acl as any,
        // sessionSigs,
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

  const decryptWithLocalAuthSig = async () => {
    let litNodeClientScoped = litNodeClient;
    if (!litNodeClient) {
      litNodeClientScoped = await initLit();
    }

    const authSig = await authSigNeededCallback(true);

    const decryptedString = await decryptToString(
      {
        accessControlConditions: acl as any,
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

  const decryptWithCeramicAuthSig = async () => {
    let litNodeClientScoped = litNodeClient;
    if (!litNodeClient) {
      litNodeClientScoped = await initLit();
    }

    const authSig = await authSigNeededCallback();

    const decryptedString = await decryptToString(
      {
        accessControlConditions: acl as any,
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
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        button {
          width: fit-content;
          margin: 10px;
        }
      `}
    >
      <button onClick={() => initLit()}>initLit</button>
      <button onClick={() => encrypt()}>encrypt</button>
      <button onClick={() => decryptWithLocalAuthSig()}>decryptWithLocalAuthSig</button>
      <button onClick={() => decryptWithCeramicAuthSig()}>decryptWithCeramicAuthSig</button>
      <button onClick={() => stringToBase16Method()}>stringToBase16</button>
      <button onClick={() => base16ToStringMethod()}>base16ToString</button>
    </div>
  );
};
export default Lit;
