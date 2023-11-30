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
  const [litNodeClient, setLitNodeClient] = useState<LitNodeClient>();
  const [ciphertext, setCiphertext] = useState<string>('');
  const [base16, setBase16] = useState<string>('');
  const [dataToEncryptHash, setDataToEncryptHash] = useState<string>('');

  const initLit = async (): Promise<LitNodeClient> => {
    const client = new globalThis.LitNodeClient({
      alertWhenUnauthorized: false,
      debug: false,
    });
    setLitNodeClient(client);
    await client.connect();
    console.log(client);
    return client;
  };

  const getAuthSig = async (withLitResource?: boolean) => {
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

  const encrypt = async (withSessionSigs?: boolean) => {
    let litNodeClientScoped = litNodeClient;
    if (!litNodeClient) {
      litNodeClientScoped = await initLit();
    }

    const { ciphertext, dataToEncryptHash } = await encryptString(
      {
        accessControlConditions: acl as any,
        ...(withSessionSigs
          ? { sessionSigs: await getSessionSigs() }
          : { authSig: await getAuthSig(true) }),
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

  const decryptWithLocalAuthSig = async (withSessionSigs?: boolean) => {
    let litNodeClientScoped = litNodeClient;
    if (!litNodeClient) {
      litNodeClientScoped = await initLit();
    }

    const decryptedString = await decryptToString(
      {
        accessControlConditions: acl as any,
        ciphertext,
        dataToEncryptHash,
        ...(withSessionSigs
          ? { sessionSigs: await getSessionSigs() }
          : { authSig: await getAuthSig(true) }),
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

    const authSig = await getAuthSig();

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

  const authNeededCallback = async ({
    resources,
    expiration,
    uri,
  }: {
    resources?: string[];
    expiration?: string;
    uri?: string;
  }) => {
    const web3 = new Web3(window.ethereum);
    const [address] = await web3.eth.getAccounts();
    await window.ethereum.enable();

    const domain = location.host;
    const message = new SiweMessage({
      domain,
      address,
      statement: 'Sign a session key to use with Lit Protocol',
      uri,
      version: '1',
      chainId: 1,
      expirationTime: expiration,
      resources,
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

  const getSessionSigs = async () => {
    let litNodeClientScoped = litNodeClient as LitNodeClient;
    if (!litNodeClient) {
      litNodeClientScoped = await initLit();
    }

    const litResource = new LitAccessControlConditionResource('Lit://*');

    //   {
    //     expiration?: any;
    //     chain: Chain;
    //     /**
    //      * An array of resource abilities that you want to request for this session. These will be signed with the session key.
    //      *
    //      * @example If you want to request the ability to decrypt an access control condition, then you would pass
    //      * [{ resource: new LitAccessControlConditionResource('someResource), ability: LitAbility.AccessControlConditionDecryption }]
    //      */
    //     resourceAbilityRequests: LitResourceAbilityRequest[];
    //     /**
    //      * The session capability object that you want to request for this session.
    //      * If you pass nothing, then this will default to a wildcard for each type of resource you're accessing.
    //      *
    //      * @example If you passed nothing, and you're requesting to perform a decryption operation for an access
    //      * control condition, then the session capability object will be a wildcard for the access control condition,
    //      * which grants this session signature the ability to decrypt this access control condition.
    //      */
    //     sessionCapabilityObject?: ISessionCapabilityObject;
    //     switchChain?: boolean;
    //     authNeededCallback?: AuthCallback;
    //     sessionKey?: any;
    // }
    const sessionSigs = await litNodeClientScoped.getSessionSigs({
      chain: 'ethereum',
      resourceAbilityRequests: [
        {
          resource: litResource,
          ability: LitAbility.AccessControlConditionDecryption,
        },
      ],
      authNeededCallback,
    });
    return sessionSigs;
  };

  const encryptWithSessionSig = async () => {
    await encrypt(true);
  };

  const decryptWithSessionSig = async () => {
    await decryptWithLocalAuthSig(true);
  };

  const decryptWithAuthSig = async () => {
    await decryptWithLocalAuthSig();
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
      <br />
      <br />
      <button onClick={() => encryptWithSessionSig()}>encryptWithSessionSig</button>
      <button onClick={() => decryptWithSessionSig()}>decryptWithSessionSig</button>
      <button onClick={() => decryptWithAuthSig()}>decryptWithAuthSig</button>
      <br />
      <br />   
      <br />
      <br />
    </div>
  );
};
export default Lit;
