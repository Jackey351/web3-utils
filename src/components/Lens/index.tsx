import { css } from '@emotion/react';
import { createClient, cacheExchange, fetchExchange } from 'urql';
import { ethers, Contract, BigNumber } from 'ethers';
import { LensProvider, usePublication } from '@lens-protocol/react-web';
import { useState } from 'react';
import { LensClient, development } from '@lens-protocol/client';

const APIURL = 'https://api-mumbai.lens.dev';

export const urqlClient = createClient({
  url: APIURL,
  exchanges: [cacheExchange, fetchExchange],
});

const Lens = function () {
  const [publicationId, setPublicationId] = useState('');

  const query = async () => {
    const rpcNode = 'https://endpoints.omniatech.io/v1/matic/mumbai/public';
    const provider = ethers.getDefaultProvider(rpcNode);
    // const DATATOKEN_HUB = '0xC40f6995BBfE0B6AA024dE812C94503b3d7DB17e';
    const datatokenHub = new Contract(
      '0x1F974d0Fc77AB305376049370d2d7CEe5fF7a660',
      [
        {
          inputs: [],
          name: 'metadata',
          outputs: [
            {
              components: [
                {
                  internalType: 'address',
                  name: 'hub',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'profileId',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'pubId',
                  type: 'uint256',
                },
                {
                  internalType: 'address',
                  name: 'collectModule',
                  type: 'address',
                },
              ],
              internalType: 'struct IDataToken.Metadata',
              name: '',
              type: 'tuple',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      provider,
    );

    const { profileId, pubId } = await datatokenHub.metadata();

    const publicationId = `${profileId.toHexString()}-${pubId.toHexString()}`;
    console.log(publicationId);
    setPublicationId(publicationId);
    // const response = await urqlClient
    //   .query(pingQuery, {
    //     request: { publicationId },
    //   })
    //   .toPromise();
    // console.log('Lens example data: ', response);
  };

  const queryLensProfile = async () => {
    const lensClient = new LensClient({
      environment: development,
    });

    const result = await lensClient.profile.fetchAll({
      where: {
        ownedBy: ['0xd10d5b408A290a5FD0C2B15074995e899E944444'],
      },
    });
    console.log('get profiles result:', result);
  };

  const res = usePublication({
    publicationId,
  });
  console.log(res);

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
      <button onClick={async () => query()}>query</button>
      <button onClick={async () => queryLensProfile()}>queryLensProfile</button>
    </div>
  );
};

export default Lens;
