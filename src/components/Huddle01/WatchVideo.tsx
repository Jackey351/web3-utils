import { css } from '@emotion/react';

import { useCallback, useContext, useEffect, useState } from 'react';
import { huddleClient } from '@huddle01/web-core';
import axios from 'axios';

const API_KEY = '83fr6rDY1UBBE4N2wrVmlUSMVSzFR-x9';

const WatchVideo = function ({ meetingLink }: { meetingLink: string }) {
  return (
    <div
      css={css`
        padding: 20px;
        button {
          width: fit-content;
          margin: 10px;
        }
      `}
    >
      <iframe
        id="huddle01-iframe"
        src={meetingLink}
        name="myiFrame"
        scrolling="no"
        height="900"
        width="900"
        allowFullScreen
        allow="camera; microphone; clipboard-read; clipboard-write; display-capture"
      ></iframe>
    </div>
  );
};
export default WatchVideo;
