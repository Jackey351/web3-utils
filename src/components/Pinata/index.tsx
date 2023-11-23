import { css } from '@emotion/react';

import { useCallback, useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import FormData from 'form-data';
import axios from 'axios';

const Pinata = function () {
  const { pinataClient } = useContext(AppContext);

  const handleSelectFile = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jpg,.png,.jpeg,.gif,.heic,.webp';
    input.click();
    return new Promise((resolve) => {
      input.addEventListener('change', (e: any) => {
        const file = e.target.files[0];
        resolve(file);
      });
    });
  };

  return (
    <div
      css={css`
        font-size: 100px;
        padding: 20px;
        button {
          width: fit-content;
          margin: 10px;
        }
      `}
    >
      <button
        onClick={async () => {
          const res = await pinataClient.hashMetadata(
            'Qma6e8dovfLyiG2UUfdkSHNPAySzrWLX9qVXb44v1muqcp',
            {
              name: 'testname',
              keyvalues: {
                existingKey: 'newKey1',
                // newKey1ToRemove: null,
              },
            } as any,
          );
          console.log(res);
        }}
      >
        hashMetadata
      </button>
      <button
        onClick={async () => {
          const res = await pinataClient.pinByHash(
            'Qma6e8dovfLyiG2UUfdkSHNPAySzrWLX9qVXb44v1muqcp',
            {
              pinataMetadata: {
                name: 'testname',
              },
            },
          );

          console.log(res);
        }}
      >
        pinByHash
      </button>
      <button
        onClick={async () => {
          const file = await handleSelectFile();
          const formData = new FormData();
          formData.append('file', file);
          console.log(formData);

          const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

          const res = await axios.post(url, formData, {
            headers: {
              pinata_api_key: process.env.pinataApiKey,
              pinata_secret_api_key: process.env.pinataSecretApiKey,
            },
          });
          console.log(res);
        }}
      >
        pinFileToIPFS
      </button>
      <button
        onClick={async () => {
          const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

          const res = await axios.post(
            url,
            { test: 'testname' },
            {
              headers: {
                pinata_api_key: process.env.pinataApiKey,
                pinata_secret_api_key: process.env.pinataSecretApiKey,
              },
            },
          );

          console.log(res);
          // const res = await pinataClient.pinJSONToIPFS(
          //   { test: 'testname' },
          //   {
          //     pinataMetadata: {
          //       name: 'testname',
          //       keyvalues: {
          //         testname: 'testname',
          //       },
          //     } as any,
          //     pinataOptions: {
          //       cidVersion: 1,
          //     },
          //   },
          // );
          // console.log(res);
        }}
      >
        pinJSONToIPFS
      </button>
      <button
        onClick={async () => {
          const res = await pinataClient.unpin('Qma6e8dovfLyiG2UUfdkSHNPAySzrWLX9qVXb44v1muqcp');
          console.log(res);
        }}
      >
        unpin
      </button>
      <button
        onClick={async () => {
          const res = await pinataClient.pinList({
            status: 'pinned',
            pageLimit: 10,
            pageOffset: 0,
            // metadata: {
            //   name: 'testname123',
            //   keyvalues: {
            //     newKey123: { value: 'newValue123', op: 'eq' },
            //   },
            // },
          });
          console.log(res.rows);
        }}
      >
        pinList
      </button>
    </div>
  );
};
export default Pinata;
