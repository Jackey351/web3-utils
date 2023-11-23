import {
  WagmiConfig,
  createConfig,
  configureChains,
  mainnet,
  useConnect,
  useSwitchNetwork,
  useDisconnect,
  useAccount,
} from 'wagmi';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
);

const projectId = 'a0e03b973ec9560c3f40607b20019762'

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

// Pass config to React Context Provider
export default function App() {
  return (
    <WagmiConfig config={config}>
      <Profile />
    </WagmiConfig>
  );
}

// Pass config to React Context Provider
export function Profile() {
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const { switchNetworkAsync } = useSwitchNetwork();

  return (
    <div>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {!connector.ready && ' (unsupported)'}
          {isLoading && connector.id === pendingConnector?.id && ' (connecting)'}
        </button>
      ))}
     
      <button onClick={() => switchNetworkAsync?.(1)}>switchNetwork</button>
      {address}{isConnected}
      {error && <div>{error.message}</div>}
      <button onClick={() => disconnect()}>disconnect</button>
    </div>
  );
}
