import { css } from '@emotion/react';
import { ethers } from 'ethers';

const Ethers = function () {
  const checkSumAddress = async () => {
    const res = ethers.utils.getAddress('0x312eA852726E3A9f633A0377c0ea882086d66666');
    console.log(res);
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
      <button onClick={async () => checkSumAddress()}>checkSumAddress</button>
    </div>
  );
};

export default Ethers;
