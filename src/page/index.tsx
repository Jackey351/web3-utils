import React from 'react';
import { useHistory } from 'react-router-dom';

const index = function () {
  const history = useHistory();
  return (
    <>
      <button onClick={() => history.push('/Ethers')}>Ethers</button>
      <button onClick={() => history.push('/Wagmi')}>Wagmi</button>
      <button onClick={() => history.push('/MetaMaskSnap')}>MetaMaskSnap</button>
      <button onClick={() => history.push('/CoinBase')}>CoinBase</button>
      <button onClick={() => history.push('/WalletConnect')}>WalletConnect</button>
      <button onClick={() => history.push('/Privy')}>Privy</button>
      <button onClick={() => history.push('/Web3Auth')}>Web3Auth</button>
      <button onClick={() => history.push('/Lighthouse')}>Lighthouse</button>
      <button onClick={() => history.push('/Pinata')}>Pinata</button>
      <button onClick={() => history.push('/ThirdwebStorage')}>ThirdwebStorage</button>
      <button onClick={() => history.push('/Ceramic')}>Ceramic</button>
      <button onClick={() => history.push('/Dataverse')}>Dataverse</button>
      <button onClick={() => history.push('/Lit')}>Lit</button>
      <button onClick={() => history.push('/Lens')}>Lens</button>
      <button onClick={() => history.push('/ZK')}>ZK</button>
      <button onClick={() => history.push('/Huddle01')}>Huddle01</button>
      <button onClick={() => history.push('/Utils')}>utils</button>
    </>
  );
};
export default index;
