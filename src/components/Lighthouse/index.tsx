import { css } from '@emotion/react';
import lighthouse from '@lighthouse-web3/sdk';
import { CID } from 'multiformats/cid';
import { base64 } from 'multiformats/bases/base64';
import axios from 'axios';
import { ethers } from 'ethers';

const apiKey = '9d632fe6.e756cc9797c345dc85595a688017b226';
console.log(CID.parse('bafkreie775twekzkdrvumo74od6gkzf2yobse55matzg2z3wgqx5a26ona'));
console.log(CID.parse('bafybeifeygrdp7h2vgdhnljktrpge3n63b4isfavrh4cimpnm6edd3cxku'));

const Lighthouse = function () {
  const getLighthouseApiKey = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const publicKey = await signer.getAddress(); //>> Example: '0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1'
    const verificationMessage = (
      await axios.get(`https://api.lighthouse.storage/api/auth/get_message?publicKey=${publicKey}`)
    ).data;
    const signedMessage = await signer.signMessage(verificationMessage);
    const response = await lighthouse.getApiKey(publicKey, signedMessage);
    console.log(response);
    return response.data.apiKey;
  };

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
      <button onClick={getLighthouseApiKey}>getLighthouseApiKey</button>
      <button onClick={getUploads}>getUploads</button>
    </div>
  );
};
export default Lighthouse;
