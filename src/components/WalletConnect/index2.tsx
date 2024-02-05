import React from 'react';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, mainnet, polygon } from 'wagmi/chains';
import { Web3Button } from '@web3modal/react';

const chains = [arbitrum, mainnet, polygon];
const projectId = 'de2a6e522f354b90448adfa7c76d9c05';

// console.log(w3mProvider({ projectId })(mainnet))
// console.log(await w3mConnectors({ projectId, version: 1, chains })[0].getProvider())
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
console.log(publicClient)
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);
console.log(ethereumClient);

function WalletConnect() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Web3Button />
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}

export default WalletConnect;
