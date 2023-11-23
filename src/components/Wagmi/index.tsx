import React, { useEffect } from 'react';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import {
  configureChains,
  createConfig,
  useAccount,
  WagmiConfig,
  useDisconnect,
  useConnect,
  Connector,
  useBalance,
  useNetwork,
  useBlockNumber,
  useContractEvent,
  useContractRead,
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
  useSwitchNetwork,
  useConfig,
  useEnsAddress,
  useEnsAvatar,
  useEnsName,
  useEnsResolver,
  useFeeData,
  useSendTransaction,
  usePrepareSendTransaction,
  useSignMessage,
  useSignTypedData,
} from 'wagmi';
import { watchNetwork } from '@wagmi/core';
import { createPublicClient, createWalletClient, custom, http, parseEther, parseGwei } from 'viem';
import { arbitrum, mainnet, goerli, polygonMumbai, polygon } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { DataverseConnector } from './DataverseConnector';
import { publicProvider } from 'wagmi/providers/public';
import { css } from '@emotion/react';
import {
  abi1,
  abi2,
  contractAddress1,
  contractAddress2,
  domain,
  ensName,
  message,
  types,
} from './constants';
import { Layout, RenderObjectRecursively } from '../RenderObjectRecursively';
// const chains = [arbitrum, mainnet, polygon];
// const projectId = 'de2a6e522f354b90448adfa7c76d9c05';

// const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

// BigInt.prototype.toJSON = function () {
//   return this.toString();
// };

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli, polygonMumbai],
  [publicProvider()],
);
// const wagmiConfig = createConfig({
//   autoConnect: true,
//   connectors: w3mConnectors({ projectId, version: 1, chains }),
//   publicClient,
// });

// const client = createPublicClient({
//   chain: mainnet,
//   transport: http(),
// });

// const client2 = createWalletClient({
//   chain: mainnet,
//   transport: custom((window as any).ethereum),
// });

const dataverseConnector = new DataverseConnector();

const config = createConfig({
  // autoConnect: true,
  connectors: [dataverseConnector],
  publicClient,
});

dataverseConnector.autoConnect();

function Wagmi() {
  return (
    <WagmiConfig config={config}>
      <Profile />
    </WagmiConfig>
  );
}

function Profile() {
  const { connect } = useConnect({
    connector: dataverseConnector,
  });
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetworkAsync, switchNetwork, status } = useSwitchNetwork();
  // console.log(status);
  const { data: balance, refetch: refetchBalance } = useBalance({
    address,
    chainId: chain?.id,
    enabled: true,
  });
  // console.log(chain);
  const { data: blockNumber, refetch: refetchBlockNumber } = useBlockNumber();

  useContractEvent({
    address: contractAddress1,
    abi: abi1,
    eventName: 'NewOwner',
    listener(log) {
      console.log(log);
    },
  });

  const { data: contractRead, refetch: refetchContractRead } = useContractReads({
    contracts: [
      {
        address: contractAddress2,
        //@ts-ignore
        abi: abi2,
        functionName: 'value',
        chainId: polygonMumbai.id,
      },
    ],
    enabled: false,
  });

  //@ts-ignore
  const { config: prepareContractWriteConfig } = usePrepareContractWrite({
    address: contractAddress2,
    abi: abi2,
    args: [123],
    functionName: 'setValue',
    chainId: polygonMumbai.id,
  });

  const { data: contractWrite, writeAsync } = useContractWrite(prepareContractWriteConfig);

  const { disconnect } = useDisconnect();

  const { data: ensAddress, refetch: refetchEnsAddress } = useEnsAddress({
    name: ensName,
    chainId: mainnet.id,
  });

  const { data: ensAvatar, refetch: refetchEnsAvatar } = useEnsAvatar({
    name: ensName,
    chainId: mainnet.id,
  });

  const { data: ensNameData, refetch: refetchEnsName } = useEnsName({
    address: ensAddress!,
    chainId: mainnet.id,
  });

  const { data: ensResolver, refetch: refetchEnsResolver } = useEnsResolver({
    name: ensName,
    chainId: mainnet.id,
  });

  const { data: feeData, refetch: refetchFeeData } = useFeeData();

  const {
    config: prepareSendTransactionConfig,
    data,
    error,
  } = usePrepareSendTransaction({
    chainId: polygonMumbai.id,
    to: address,
    value: parseEther('0.0001'),
    // chainId: polygonMumbai.id,
  });
  // console.log({
  //   account: address,
  //   to: address,
  //   value: parseEther('0.0001'),
  //   // chainId: polygonMumbai.id,
  // });
  console.log({ address, data, error });
  const { data: sendTransactionData, sendTransaction } = useSendTransaction(
    prepareSendTransactionConfig,
  );
  console.log({ prepareSendTransactionConfig });
  console.log({ sendTransactionData });

  const { data: signMessageData, signMessage } = useSignMessage({
    message: 'gm wagmi frens',
  });

  const { data: signTypedDataData, signTypedData } = useSignTypedData({
    domain,
    message,
    primaryType: 'Mail',
    types,
  });

  // const unwatch = watchNetwork((network) => console.log(network));

  if (isConnected)
    return (
      <div>
        <div>
          Connected to {address}
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
        <div>
          chain:{' '}
          {
            <RenderObjectRecursively
              object={{ id: chain?.id, name: chain?.name }}
              layout={Layout.horizontal}
            />
          }{' '}
          <button onClick={() => switchNetwork?.(polygonMumbai.id)}>switchNetwork</button>
        </div>
        <div>
          balance: {balance?.formatted} {balance?.symbol}
          <button onClick={() => refetchBalance().then((res) => console.log(res))}>refetch</button>
        </div>
        <div>
          Block number: {typeof blockNumber === 'bigint' && Number(blockNumber)}
          <button onClick={() => refetchBlockNumber()}>refetch</button>
        </div>
        <div
          css={css`
            display: flex;
            align-items: flex-start;
          `}
        >
          Contract read:
          <span
            css={css`
              margin-left: 10px;
            `}
          >
            {contractRead?.map((item, index) => {
              return (
                <div>
                  {index}: {typeof item.result === 'bigint' && Number(item.result)}
                </div>
              );
            })}
          </span>
          <button
            onClick={async () => {
              const res = await switchNetworkAsync?.(polygonMumbai.id);
              const res2 = await refetchContractRead?.();
              console.log(res2);
            }}
            css={css`
              margin: 0 10px !important;
            `}
          >
            refetch
          </button>
        </div>
        <div>
          Contract write: {(contractWrite?.hash as any)?.hash}
          <button
            onClick={async () => {
              const res = await switchNetworkAsync?.(polygonMumbai.id);
              const res2 = await writeAsync?.();
              console.log(res2);
              const tx = await (res2?.hash as any).wait();
              refetchContractRead();
              console.log(tx);
            }}
          >
            Excute
          </button>
        </div>
        <div>
          ENS Address: {ensAddress}
          <button onClick={() => refetchEnsAddress()}>refetch</button>
        </div>
        <div
          css={css`
            display: flex;
            align-items: flex-start;
          `}
        >
          ENS Avatar:{' '}
          {ensAvatar && (
            <img
              src={ensAvatar}
              css={css`
                width: 60px;
                margin-left: 10px;
              `}
            />
          )}
          <button
            onClick={() => refetchEnsAvatar()}
            css={css`
              margin: 0 10px !important;
            `}
          >
            refetch
          </button>
        </div>
        <div>
          ENS Name: {ensNameData}
          <button onClick={() => refetchEnsName()}>refetch</button>
        </div>
        <div>
          ENS Resolver: {ensResolver}
          <button onClick={() => refetchEnsResolver()}>refetch</button>
        </div>
        <div
          css={css`
            display: flex;
          `}
        >
          Fee Data:
          <span
            css={css`
              display: flex;
            `}
          >
            <div>{feeData && <RenderObjectRecursively object={feeData} />}</div>
            <button
              onClick={async () => {
                const res = await refetchFeeData();
                console.log(res);
              }}
              css={css`
                height: fit-content;
                margin: 0 !important;
              `}
            >
              refetch
            </button>
          </span>
        </div>
        <div>
          Send Transaction: {sendTransactionData?.hash}
          <button
            onClick={async () => {
              sendTransaction?.();
            }}
          >
            sendTransaction
          </button>
        </div>
        <div>
          Sign Message: {signMessageData}
          <button
            onClick={async () => {
              signMessage?.();
            }}
          >
            signMessage
          </button>
        </div>
        <div>
          Sign Typed Data: {signTypedDataData}
          <button
            onClick={async () => {
              await switchNetworkAsync?.(1);
              signTypedData?.({ domain, message, primaryType: 'Mail', types });
            }}
          >
            signTypedData
          </button>
        </div>
      </div>
    );
  return (
    <div>
      <button
        onClick={() =>
          connect({
            connector: dataverseConnector,
          })
        }
      >
        Connect Wallet
      </button>
    </div>
  );
}

export default Wagmi;
