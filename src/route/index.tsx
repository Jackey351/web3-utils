import { css } from '@emotion/react';
import React, { Suspense } from 'react';
import { ReactNode, useContext, useEffect, useState } from 'react';
import AppContext from '../context/AppContext';
import { Route, Switch } from 'react-router-dom';
import WalletConnect from '@/components/WalletConnect/index2';
import Wagmi from '@/components/Wagmi/index2';
import Pinata from '@/components/Pinata';
import index from '../page';
import { pinataClient } from '../sdk';
import { Ceramic } from '@/components/Ceramic';
import Dataverse from '@/components/Dataverse';
import CoinBase from '@/components/Coinbase';
import Huddle01 from '@/components/Huddle01';
import MetaMaskSnap from '@/components/MetaMaskSnap';
import Lit from '@/components/Lit';
import Utils from '@/components/Utils';
const ThirdwebStorage = React.lazy(() => import('@/components/ThirdwebStorage'));
import Lighthouse from '@/components/Lighthouse';
import Lens from '@/components/Lens';
import { LensProvider, LensConfig, development, sandbox } from '@lens-protocol/react-web';
import { bindings as wagmiBindings } from '@lens-protocol/wagmi';
import ZK from '@/components/ZK';
import Ethers from '@/components/Ethers';

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: sandbox,
};

const Page = function () {
  const [item, setItem] = useState({});

  const states = {
    item,
    setItem,
  };

  return (
    <AppContext.Provider value={{ states,  }}>
      <Switch>
        <Layout>
          <Route exact path="/" component={index} />
          <Route exact path="/WalletConnect" component={WalletConnect} />
          <Route exact path="/Wagmi" component={Wagmi} />
          <Route exact path="/Ethers" component={Ethers} />
          <Route exact path="/Pinata" component={Pinata} />
          <Route
            exact
            path="/ThirdwebStorage"
            render={() => (
              <Suspense fallback={<div />}>
                <ThirdwebStorage />
              </Suspense>
            )}
          />
          <Route exact path="/Lighthouse" component={Lighthouse} />
          <Route exact path="/Ceramic" component={Ceramic} />
          <Route exact path="/Dataverse" component={Dataverse} />
          <Route exact path="/Huddle01" component={Huddle01} />
          <Route exact path="/CoinBase" component={CoinBase} />
          <LensProvider config={lensConfig}>
            <Route exact path="/Lens" component={Lens} />
          </LensProvider>
          <Route exact path="/MetaMaskSnap" component={MetaMaskSnap} />
          <Route exact path="/Lit" component={Lit} />
          <Route exact path="/ZK" component={ZK} />
          <Route exact path="/Utils" component={Utils} />
        </Layout>
      </Switch>
    </AppContext.Provider>
  );
};

const Layout = function ({ children }: { children: ReactNode }) {
  return (
    <div
      css={css`
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100%;
      `}
    >
      {children}
    </div>
  );
};

export default Page;
