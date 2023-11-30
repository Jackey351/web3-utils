import { css } from '@emotion/react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import LitJsSDK from '@lit-protocol/lit-node-client';
import { checkAndSignAuthMessage } from '@lit-protocol/auth-browser';
import {
  encryptString,
  decryptString,
  zipAndEncryptString,
  decryptZip,
} from '@lit-protocol/encryption';
import acl from './acl.json';
import { base16ToString, stringToBase16, utf8ToString } from '@/utils';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { uint8arrayToString } from '@lit-protocol/uint8arrays';
import { SiweMessage } from 'siwe';
import { Web3 } from 'web3';

LitJsSDK;
const Lit = function () {
  const [litNodeClient, setLitNodeClient] = useState<LitNodeClient>();
  const [ciphertext, setCiphertext] = useState<string>('');
  const [base16, setBase16] = useState<string>('');
  const [dataToEncryptHash, setDataToEncryptHash] = useState<string>('');
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState<Uint8Array>();
  const [encryptedZip, setEncryptedZip] = useState<Blob>();

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

  const decryptWithLocalAuthSig = async (withSessionSigs?: boolean) => {
    let litNodeClientScoped = litNodeClient;
    if (!litNodeClient) {
      litNodeClientScoped = await initLit();
    }

    const decryptedString = await decryptString(
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

    const decryptedString = await decryptString(
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

    // const litResource = new LitAccessControlConditionResource('*');

    //   {
    //     expiration?: any;
    //     chain: Chain;
    //     resourceAbilityRequests: LitResourceAbilityRequest[];
    //     sessionCapabilityObject?: ISessionCapabilityObject;
    //     switchChain?: boolean;
    //     authNeededCallback?: AuthCallback;
    //     sessionKey?: any;
    // }
    const sessionSigs = await litNodeClientScoped.getSessionSigs({
      chain: 'ethereum',
      resourceAbilityRequests: [
        // {
        //   resource: litResource,
        //   ability: LitAbility.AccessControlConditionDecryption,
        // },
      ],
      // authNeededCallback,
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

  const saveSigningCondition = async () => {
    let litNodeClientScoped = litNodeClient as LitNodeClient;
    if (!litNodeClient) {
      litNodeClientScoped = await initLit();
    }
    const accessControlConditions = acl as any;

    // const sessionSigs = await getSessionSigs();
    // console.log({ sessionSigs });
    const { publicKey } = litNodeClientScoped.getSessionKey();
    const uri = litNodeClientScoped.getSessionKeyUri(publicKey);
    console.log({ uri });

    const authSig = await authNeededCallback({ uri });
    console.log({ authSig });
    const resourceId = {
      baseUrl: location.host,
      path: '',
      orgId: '',
      role: '',
      extraData: '',
    };
    // Saving signing condition
    const res = await litNodeClientScoped.saveSigningCondition({
      accessControlConditions,
      authSig,
      // sessionSigs,
      resourceId,
      chain: 'ethereum',
    });
    console.log({ res });
    // Retrieving a signature
  };

  const getSignedToken = async () => {
    let litNodeClientScoped = litNodeClient as LitNodeClient;
    if (!litNodeClient) {
      litNodeClientScoped = await initLit();
    }
    const resourceId = {
      baseUrl: location.host,
      path: '',
      orgId: '',
      role: '',
      extraData: '',
    };

    // const authSig = {
    //   sig: '0xe4eebe35493692475b941b2c23c816948cf6c4ea4696954f727f1a46579ecc633183e7d35409ac759f0de7acdf3d713cdfe705899d5195b3f6c900f2425fc7e41c',
    //   derivedVia: 'web3.eth.personal.sign',
    //   signedMessage:
    //     'localhost:3009 wants you to sign in with your Ethereum account:\n0x312eA852726E3A9f633A0377c0ea882086d66666\n\nSign a session key to use with Lit Protocol\n\nURI: lit:session:\nVersion: 1\nChain ID: 1\nNonce: 2ftFYz705Noh00e8K\nIssued At: 2023-11-30T11:44:52.755Z\nResources:\n- lit://*',
    //   address: '0x312eA852726E3A9f633A0377c0ea882086d66666',
    // };
    const authSig = await authNeededCallback({ uri: 'lit:session:', resources: ['lit://*'] });

    let jwt = await litNodeClientScoped.getSignedToken({
      accessControlConditions: acl as any,
      authSig,
      resourceId,
    });
    console.log({ jwt });
  };

  const encrypt = async () => {
    let litNodeClientScoped = litNodeClient as LitNodeClient;
    if (!litNodeClient) {
      litNodeClientScoped = await initLit();
    }
    const accessControlConditions = acl as any;

    // case2
    // const { publicKey } = litNodeClientScoped.getSessionKey();
    // const uri = litNodeClientScoped.getSessionKeyUri(publicKey);
    // const authSig = await authNeededCallback({ uri });

    // case3
    // const sessionSigs = await getSessionSigs();

    // case4
    const uri = 'did:key:z6Mkkc2wtZPpr7a6aubmXpH6okjGJU8YiAcMR796Ns1gYUPa';
    const authSig = await authNeededCallback({
      uri,
    });

    const { encryptedZip, symmetricKey } = await zipAndEncryptString('this is a secret message');
    console.log({ encryptedZip });
    console.log({ symmetricKey });
    setEncryptedZip(encryptedZip);
    // store the decryption conditions
    const encryptedSymmetricKey = await litNodeClientScoped.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      // sessionSigs,
      authSig,
      chain: 'ethereum',
    });
    setEncryptedSymmetricKey(encryptedSymmetricKey);
    console.log({ encryptedSymmetricKey });

    // // retrieving the key:
    // const hashOfKey = await LitJsSDK.hashEncryptionKey({
    //   encryptedSymmetricKey,
    // });

    // // Create an access control condition resource
    // var litResource = new LitAccessControlConditionResource(hashOfKey);
  };

  const decrypt = async () => {
    let litNodeClientScoped = litNodeClient as LitNodeClient;
    if (!litNodeClient) {
      litNodeClientScoped = await initLit();
    }
    const accessControlConditions = acl as any;

    // case2
    // const { publicKey } = litNodeClientScoped.getSessionKey();
    // const uri = litNodeClientScoped.getSessionKeyUri(publicKey);
    // const authSig = await authNeededCallback({ uri });

    // case3
    // const sessionSigs = await getSessionSigs();

    // case4
    const uri = 'did:key:z6Mkkc2wtZPpr7a6aubmXpH6okjGJU8YiAcMR796Ns1gYUPa';
    const authSig = await authNeededCallback({
      uri,
    });

    const retrievedSymmKey = await litNodeClientScoped.getEncryptionKey({
      accessControlConditions,
      toDecrypt: uint8arrayToString(encryptedSymmetricKey!, 'base16'),
      // sessionSigs,
      authSig,
      chain: 'ethereum',
    });
    console.log({ retrievedSymmKey });

    const decryptedFiles = await decryptZip(encryptedZip!, retrievedSymmKey);
    console.log({ decryptedFiles });
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
      <button onClick={() => decrypt()}>decrypt</button>
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
      <button onClick={() => saveSigningCondition()}>saveSigningCondition</button>
      <button onClick={() => getSignedToken()}>makingSigningRequests</button>
      <br />
      <br />
    </div>
  );
};
export default Lit;
