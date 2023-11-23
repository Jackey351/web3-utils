import { Connector, Chain, Address, WalletClient } from 'wagmi';
import { getConfig } from '@wagmi/core';
import { Extension, RuntimeConnector, WALLET } from '@dataverse/runtime-connector';
import {
  SignMessageParameters,
  Account,
  numberToHex,
  JsonRpcAccount,
  WriteContractParameters,
  formatEther,
  SignTypedDataParameters,
} from 'viem';
import { AddChainParameters } from 'viem/dist/types/actions/wallet/addChain';
import { deployContract } from 'viem/dist/esm/actions/wallet/deployContract';
import { RequestPermissionsParameters } from 'viem/dist/types/actions/wallet/requestPermissions';
import { SendTransactionParameters } from 'viem/dist/types/actions/wallet/sendTransaction';
import { SwitchChainParameters } from 'viem/dist/types/actions/wallet/switchChain';
import { WatchAssetParams } from 'viem/dist/types/types/eip1193';
import { ethers, Contract, BigNumber } from 'ethers';
import { nanoid } from 'nanoid';
import { arbitrum, mainnet, polygonMumbai, polygon } from 'wagmi/chains';

// BigInt.prototype.toJSON = function () {
//   return this.toString();
// };

export class DataverseConnector extends Connector {
  readonly id = 'Dataverse';
  readonly name = 'Dataverse';
  readonly ready = true;
  runtimeConnector: RuntimeConnector;

  constructor() {
    super({ options: {} });
    this.runtimeConnector = new RuntimeConnector(Extension);
  }

  async getProvider() {
    return this.runtimeConnector.provider;
  }

  async connect() {
    if (this.storage?.getItem('DataverseConnector_isConnected')) {
      const res = await this.runtimeConnector.connectWallet(
        this.storage?.getItem('DataverseConnector_wallet') as WALLET,
      );
      return {
        account: res.address as Address,
        chain: {
          id: res.chain!.chainId,
          unsupported: false,
        },
      };
    }
    const res = await this.runtimeConnector.connectWallet();
    this.storage?.setItem('DataverseConnector_wallet', res.wallet);
    this.storage?.setItem('DataverseConnector_isConnected', true);
    return {
      account: res.address as Address,
      chain: {
        id: res.chain.chainId,
        unsupported: false,
      },
    };
  }

  async autoConnect() {
    const config = getConfig();
    if (this.storage?.getItem('DataverseConnector_isConnected')) {
      const data = await this.connect();
      config.setState((x) => ({
        ...x,
        connectors: [this],
        connector: this,
        chains: [mainnet, polygonMumbai],
        data,
        status: 'connected',
      }));
    }
  }

  async disconnect(): Promise<void> {
    this.runtimeConnector.isConnected = false;
    this.runtimeConnector.address = undefined;
    this.runtimeConnector.chain = undefined;
    this.storage?.setItem('isConnected', false);
  }

  async switchChain(chainId: number): Promise<Chain> {
    const res = await this.runtimeConnector.switchNetwork(chainId);
    await this.autoConnect();
    return {
      id: res.chainId,
      name: res.chainName,
    } as Chain;
  }

  async getWalletClient(): Promise<WalletClient> {
    if (!this.runtimeConnector.isConnected) {
      throw 'Wallet is not connected';
    }
    const chain = this.runtimeConnector.chain;
    const signer = this.runtimeConnector.signer;
    const account = {
      // ...this.runtimeConnector.signer,
      // signMessage: ({ message }: { message: string }) =>
      //   this.runtimeConnector.signer.signMessage(message) as Promise<JsonRpcAccount<Address>>,
      // signTransaction: this.runtimeConnector.signer.signTransaction as (
      //   transaction: TransactionSerializable,
      // ) => Promise<Address>,
      // signTypedData: this.runtimeConnector.signer._signTypedData as <
      //   TTypedData extends TypedData | { [key: string]: unknown },
      //   TPrimaryType extends string = string,
      // >(
      //   typedData: TypedDataDefinition<TTypedData, TPrimaryType>,
      // ) => Promise<Address>,
      // address: this.runtimeConnector.address as Address,
      // publicKey: this.runtimeConnector.address as Address,
      // source: 'custom',
      address: this.runtimeConnector.address as Address,
      type: 'json-rpc',
    } as JsonRpcAccount;
    let walletClientChain = { id: chain!.chainId, name: chain!.chainName } as Chain;

    if (polygonMumbai.id === chain!.chainId) {
      walletClientChain = polygonMumbai;
    } else if (mainnet.id === chain!.chainId) {
      walletClientChain = mainnet;
    }

    const request = (args: { method: string; params?: any }) => {
      return this.runtimeConnector.ethereumRequest(args);
    };

    return {
      chain: walletClientChain,
      key: '',
      name: '',
      pollingInterval: 0,
      request,
      transport: {
        name: '',
        key: '',
        request,
        type: '',
      },
      type: 'json-rpc',
      uid: nanoid(),
      addChain: async (args: AddChainParameters) => {
        const { id, name, nativeCurrency, rpcUrls, blockExplorers } = args.chain;
        return this.runtimeConnector.ethereumRequest({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: numberToHex(id),
              chainName: name,
              nativeCurrency,
              rpcUrls: rpcUrls.default.http,
              blockExplorerUrls: blockExplorers
                ? Object.values(blockExplorers).map(({ url }) => url)
                : undefined,
            },
          ],
        });
      },
      deployContract: (args) =>
        deployContract({ account, chain: walletClientChain, request } as WalletClient, args),
      getAddresses: async () => [this.runtimeConnector.address as Address],
      getChainId: async () => this.runtimeConnector!.chain!.chainId as number,
      getPermissions: async () => {
        return this.runtimeConnector.ethereumRequest({ method: 'wallet_getPermissions' });
      },
      requestAddresses: async () => [this.runtimeConnector.address as Address],
      requestPermissions: (args: RequestPermissionsParameters) =>
        this.runtimeConnector.ethereumRequest({
          method: 'requestPermissions',
          params: [args],
        }),
      sendTransaction: async (args: SendTransactionParameters<Chain, Account>) => {
        const res = await signer!.sendTransaction(args);
        return res.hash as unknown as Promise<Address>;
      },
      signMessage: (args: SignMessageParameters<Account>) =>
        signer!.signMessage(args.message) as Promise<Address>,
      signTypedData: (args: any) => {
        return signer!._signTypedData(
          args.domain!,
          args.types as Record<string, any>,
          args.message as Record<string, any>,
        ) as Promise<Address>;
      },
      switchChain: async (args: SwitchChainParameters) => {
        await this.runtimeConnector.switchNetwork(args.id);
        await this.autoConnect();
      },
      watchAsset: async (args: WatchAssetParams) => {
        return this.runtimeConnector.ethereumRequest({ method: '', params: [args] });
      },
      writeContract: async (args: any) => {
        const ethersSigner = this.runtimeConnector.provider?.ethersProvider.getSigner();

        const contract = new Contract(args.address, args.abi as any[], ethersSigner);

        return contract[args.functionName](...(args?.args ?? []));
      },
      account,
    };
  }

  async getAccount(): Promise<Address> {
    return this.runtimeConnector.address as Address;
  }

  async getChainId(): Promise<number> {
    return this.runtimeConnector?.chain?.chainId as number;
  }

  async isAuthorized(): Promise<boolean> {
    // return this.runtimeConnector.isConnected as boolean;
    return true;
  }

  protected onAccountsChanged(accounts: Address[]): void {
    throw new Error('Method not implemented.');
  }

  protected onChainChanged(chain: string | number): void {
    throw new Error('Method not implemented.');
  }

  protected onDisconnect(error: Error): void {
    throw new Error('Method not implemented.');
  }
}
