import { css } from '@emotion/react';

import { useContext, useEffect, useState } from 'react';
import AppContext from '../context/AppContext';

const Home = function () {
  const { states } = useContext(AppContext);

  return (
    <div
      css={css`
        font-size: 100px;
      `}
    >
      3
    </div>
  );
};
export default Home;
