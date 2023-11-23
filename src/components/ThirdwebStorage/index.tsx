import { css } from '@emotion/react';
import { ThirdwebStorage as Thirdweb } from '@thirdweb-dev/storage';

const storage = new Thirdweb({
  clientId: '622e263026dbe3fefa619a5d708dc77b', // You can get one from dashboard settings
});

const ThirdwebStorage = function () {
  const resolveScheme = async (uri: string) => {
    const url = storage.resolveScheme(uri);
    console.log(url);
  };

  const downloadJSON = async (uri: string) => {
    const data = await storage.downloadJSON(uri);
    console.log(data);
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
        onClick={async () => resolveScheme('ipfs://QmWgbcjKWCXhaLzMz4gNBxQpAHktQK6MkLvBkKXbsoWEEy')}
      >
        resolveScheme
      </button>
      <button
        onClick={async () => downloadJSON('ipfs://QmWgbcjKWCXhaLzMz4gNBxQpAHktQK6MkLvBkKXbsoWEEy')}
      >
        downloadJSON
      </button>
      <button
        onClick={async () => downloadJSON('ipfs://QmWgbcjKWCXhaLzMz4gNBxQpAHktQK6MkLvBkKXbsoWEEy')}
      >
        downloadJSON
      </button>
    </div>
  );
};
export default ThirdwebStorage;
