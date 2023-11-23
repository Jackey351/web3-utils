import { css, Global } from '@emotion/react';
import type { ReactNode } from 'react';
import React from 'react';

import { colors, styles } from '../styles';

type BaseProps = { children: ReactNode };

const Base = function ({ children }: BaseProps) {
  return (
    <>
      <Global
        styles={css`
          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }
          body,
          h1,
          button {
            margin: 0;
            font: 16px/1.4 Poppins, monospace;
          }
          body {
            background-color: ${colors.background};
          }
          button {
            cursor: pointer;
          }
          body,
          a {
            /* color: ${colors.accent}; */
            text-decoration: none;
            outline: 0;
          }
          /* a:focus:not(:focus-visible) {
            color: ${colors.accent};
            background: transparent;
          } */
          a:focus-visible {
            color: ${colors.accentOver};
            background: ${colors.accent};
          }
          .hideScrollbar::-webkit-scrollbar {
            display: none;
          }
          input,
          textarea {
            border: none;
            outline: none;
            font-family: Poppins, sans-serif;
          }
        `}
      />
      <main css={css``}>{children}</main>
    </>
  );
};

export default Base;
