import { css } from '@emotion/react';
import lighthouse from '@lighthouse-web3/sdk';
import { CID } from 'multiformats/cid';
import { base64 } from 'multiformats/bases/base64';

const apiKey = '9d632fe6.e756cc9797c345dc85595a688017b226';
console.log(CID.parse('bafkreie775twekzkdrvumo74od6gkzf2yobse55matzg2z3wgqx5a26ona'));
console.log(CID.parse('bafybeifeygrdp7h2vgdhnljktrpge3n63b4isfavrh4cimpnm6edd3cxku'));

const Lighthouse = function () {
  const getUploads = async () => {
    const uploads = await lighthouse.getUploads(apiKey);
    console.log(uploads);
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
      <button onClick={async () => getUploads()}>getUploads</button>
    </div>
  );
};
export default Lighthouse;
