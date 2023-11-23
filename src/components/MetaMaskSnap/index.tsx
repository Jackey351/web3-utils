import { css } from '@emotion/react';
import { panel, heading, text } from '@metamask/snaps-ui';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// const content = panel([heading('Alert heading'), text('Something happened in the system.')]);

const onRpcRequest = async ({ origin, request }: { origin: any; request: any }) => {
  const res = await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      'npm:saferoot-metamask-snap': {},
    },
  });
  console.log(res); // 'world!'

  const response = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: { snapId: 'npm:saferoot-metamask-snap', request: { method: 'deployContract' } },
  });

  console.log(response); // 'world!'

  switch (request.method) {
    case 'hello':
      return window.snap.request({
        method: 'snap_dialog',
        params: {
          type: 'Confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
            text('But you can edit the Snap source code to make it do something, if you want to!'),
          ]),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};
const MetaMaskSnap = function () {
  const rpcRequest = () => {
    onRpcRequest({ origin: '', request: { method: 'hello' } });
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
      {/* <div>{content}</div> */}
      <button onClick={rpcRequest}>rpcRequest</button>
    </div>
  );
};
export default MetaMaskSnap;
