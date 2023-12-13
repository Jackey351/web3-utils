import { css } from '@emotion/react';
import * as utils from '../../utils';

const Utils = function () {
  const getTopDomain = async () => {
    const topDomain = await utils.getTopDomain('https://scholar.google.com:11/?hl=');
    console.log(topDomain);
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
      <button onClick={async () => getTopDomain()}>parse url</button>
    </div>
  );
};
export default Utils;
