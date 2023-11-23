import { css } from '@emotion/react';

import { useCallback, useContext, useEffect, useState } from 'react';
import { huddleClient } from '@huddle01/web-core';
import axios from 'axios';
import WatchVideo from './WatchVideo';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@/utils';

const API_KEY = '83fr6rDY1UBBE4N2wrVmlUSMVSzFR-x9';

const Huddle01 = function () {
  const [meetingLink, setMeetingLink] = useState('');
  const [watchLive, setWatchLive] = useState(false);
  const query = useQuery();
  console.log(query);

  useEffect(() => {
    if (query.meetingLink) {
      setWatchLive(true);
      setMeetingLink(query.meetingLink);
    }
  }, [query]);

  const createIframeRoom = async () => {
    huddleClient.initialize('VwIxTuZmv8dDmTcYr4O7_woHFBOBPZIv');

    const response = await axios.post(
      '/create-iframe-room',
      {
        title: 'Huddle01-Test',
        roomLocked: false,
        hostWallets: ['0x312eA852726E3A9f633A0377c0ea882086d66666'],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
      },
    );
    console.log(response);
    setMeetingLink(response.data.data.meetingLink);
    // await huddleClient.joinLobby('YOUR_ROOM_ID');
    // huddleClient.joinRoom();
  };

  const openNewTab = () => {
    window.open(`${window.location.href}?meetingLink=${meetingLink}`);
  };

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
      <button onClick={createIframeRoom}>createIframeRoom</button>
      <button onClick={openNewTab}>watchLive</button>
      {!watchLive && meetingLink && (
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
      )}
      {watchLive && <WatchVideo meetingLink={meetingLink} />}
    </div>
  );
};
export default Huddle01;
