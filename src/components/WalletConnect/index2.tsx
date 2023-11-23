import React, { useState } from 'react';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { ethers } from 'ethers';

const projectId = 'de2a6e522f354b90448adfa7c76d9c05';

function WalletConnect() {
  const [address, setAddress] = useState('');
  const connect = async () => {
    const client = await EthereumProvider.init({
      projectId,
      showQrModal: true,
      chains: [1],
      methods: ['eth_sendTransaction', 'personal_sign'],
      events: ['chainChanged', 'accountsChanged'],
    });

    await client.enable();
    
    const provider = new ethers.providers.Web3Provider(client);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const { chainId } = await provider.getNetwork();
    console.log(signer, address, chainId);
    setAddress(address);
  };

  return (
    <>
      {address} <button onClick={connect}>connect</button>
    </>
  );
}

export default WalletConnect;
