import { siwe } from './siwe';
import { Cacao } from 'ceramic-cacao';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ceramicAPI } from './config';

export class Ceramic {
  authSig?: object;
  siweMessage?: object;

  async initCeramicClient() {
    const { siweMessage, didKey, authSig, keySeed } = await siwe();
    this.authSig = authSig;
    this.siweMessage = siweMessage;
    const cacao = Cacao.fromSiweMessage(siweMessage);

    // attach cacao to ceramic client
    const didKeyWithCap = didKey.withCapability(cacao);
    await didKeyWithCap.authenticate();

    const ceramic = new CeramicClient(ceramicAPI);

    ceramic.did = didKeyWithCap;
    console.log(ceramic.did);
    const pkh = ceramic.did?.parent;
    console.log(ceramic);
    return ceramic;
  }
}
