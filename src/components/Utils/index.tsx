import { css } from '@emotion/react';
import * as utils from '../../utils';
import wasm from './module.wasm?url';

const Utils = function () {
  const getTopDomain = async () => {
    const topDomain = await utils.getTopDomain('https://scholar.google.com:11/?hl=');
    console.log(topDomain);
  };

  const importWASM = () => {
    const importObject = {
      env: {
        emscripten_resize_heap: () => {},
      },
    };

    WebAssembly.compileStreaming(fetch(wasm))
      .then((module) => {
        console.log(module);
        return WebAssembly.instantiate(module, importObject);
      })
      .then((instance) => {
        console.log(instance);
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
      <button onClick={async () => getTopDomain()}>parse url</button>
      <button onClick={async () => importWASM()}>import WASM</button>
    </div>
  );
};
export default Utils;
