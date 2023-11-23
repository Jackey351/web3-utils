import { css } from '@emotion/react';

import { useCallback, useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import FormData from 'form-data';
import axios from 'axios';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

const Coinbase = function () {
  const [address, setAddress] = useState();
  const connect = async () => {
    const defaultRpc = 'https://rpc-mainnet.maticvigil.com';
    const defaultChainId = 137;

    // Initialize Coinbase Wallet SDK
    const coinbaseWallet = new CoinbaseWalletSDK({
      appName: 'Dataverse',
      darkMode: false,
    });
    // Initialize a Web3 Provider object
    const coinbaseProvider = coinbaseWallet.makeWeb3Provider(defaultRpc, defaultChainId);
    // window.coinbaseProvider = coinbaseProvider;
    const res: any = await coinbaseProvider.request({ method: 'eth_requestAccounts' });
    console.log(res);
    setAddress(res[0]);
  };

  const switchNetwork = async () => {
    // console.log(window.ethereum.providers[1].request)
    console.log(window.coinbaseProvider)
    const res = await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x63564C40',
        rpcUrls: ['https://api.harmony.one'],
        chainName: 'Harmony Mainnet',
        nativeCurrency: { name: 'ONE', decimals: 18, symbol: 'ONE' },
        blockExplorerUrls: ['https://explorer.harmony.one'],
        iconUrls: ['https://harmonynews.one/wp-content/uploads/2019/11/slfdjs.png'],
      }],
    })
    console.log(res)
    const res2 = await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }],
    });
    console.log(res2)
  };

  const sign = async () => {
    const res = await window.ethereum.request({
      method: "eth_sign",
      params: [address,"test"],
    });
    console.log(res)
  };

  return (
    <div
      css={css`
        padding: 20px;
        button {
          width: fit-content;
          margin: 10px;
        }
      `}
    >
      {address} <button onClick={connect}>connect</button>
      <button onClick={switchNetwork}>switchNetwork</button>
      <button onClick={sign}>sign</button>
    </div>
  );
};
export default Coinbase;
