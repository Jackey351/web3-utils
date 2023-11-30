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

  const upload = async (e: any) => {
    let file = e.target.files[0];
    console.log(file);
    if (!file) {
      return;
    }

    const uploadResponse = await lighthouse.upload([file], apiKey);
    const cid = uploadResponse.data.Hash;

    console.log(cid);
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
      <button onClick={getUploads}>getUploads</button>
      <input
          type='file'
          onChange={upload}
          name='createBareFile'
          style={{ width: "168px", marginLeft: "10px" }}
        />
    </div>
  );
};
export default Lighthouse;
