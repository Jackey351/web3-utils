import { CeramicClient } from '@ceramicnetwork/http-client';
import axios from 'axios';
import { DID } from 'dids';
import KeyDidResolver from 'key-did-resolver';

export async function createJWS({
  code,
  requestPath,
  requestBody,
  ceramic,
}: {
  code: string;
  requestPath: string;
  requestBody?: string;
  ceramic: CeramicClient;
}) {
  if (!ceramic.did) {
    throw new Error('missing ceramic.did');
  }
  const jws = await ceramic.did.createJWS({
    code,
    requestPath,
    requestBody,
  });
  console.log(jws);
  return `${jws.signatures[0].protected}.${jws.payload}.${jws.signatures[0].signature}`;
}

export async function verifyJWS(ceramic: CeramicClient, jws: string) {
  if (!ceramic.did) {
    throw new Error('missing ceramic.did');
  }
  const did = new DID({ resolver: KeyDidResolver.getResolver() });
  const res = await did.verifyJWS(jws);
  console.log(res);
  return res;
}
