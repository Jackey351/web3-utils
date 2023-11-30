import React from 'react';
import { useHistory } from 'react-router-dom';

const index = function () {
  const history = useHistory();
  return (
    <>
      <button onClick={() => history.push('/Lit-v2')}>Lit-v2</button>
      <button onClick={() => history.push('/Lit-v3')}>Lit-v3</button>
    </>
  );
};
export default index;
