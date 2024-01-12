import { ethers } from 'ethers';
import { randomString, randomBytes } from '@stablelib/random';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { DID } from 'dids';
import KeyDidResolver from 'key-did-resolver';
import { SiweMessage } from 'ceramic-cacao';

export async function siwe() {
  let resources = ['ceramic://*?model=kjzl6hvfrbw6c86gt9j415yw2x8stmkotcrzpeutrbkp42i4z90gp5ibptz4sso'];

  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  const signer = provider.getSigner();
  const address = await signer.getAddress();

  const res = await provider.getNetwork();
  const chainId = String(res.chainId);

  // create temp pkh:key
  const keySeed = randomBytes(32);
  const didKey = await createDIDKey(keySeed);

  // generate siwe message
  const now = new Date();
  const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const capabilityOpts = {
    domain: location.host,
    address,
    statement: 'Give this application access to some of your data',
    version: '1',
    uri: didKey.id,
    nonce: randomString(10),
    issuedAt: now.toISOString(),
    expirationTime: oneWeekLater.toISOString(),
    chainId: '1',
    resources,
  };

  const siweMessage = new SiweMessage(capabilityOpts);
  const message = siweMessage.toMessage();

  // sign siwe message
  const signature = await signer.signMessage(message);

  // create cacao object
  siweMessage.signature = signature;

  return { siweMessage, didKey, keySeed };
}

async function createDIDKey(seed?: Uint8Array): Promise<DID> {
  const didProvider = new Ed25519Provider(seed ?? randomBytes(32));
  const didKey = new DID({
    provider: didProvider,
    resolver: KeyDidResolver.getResolver(),
  });
  await didKey.authenticate();
  return didKey;
}
