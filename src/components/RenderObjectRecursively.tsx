import { css } from '@emotion/react';
import React from 'react';

export enum Layout {
  horizontal,
  verticle,
}

export function RenderObjectRecursively({
  object,
  layout = Layout.verticle,
}: {
  object: any;
  layout?: Layout;
}) {
  return (
    <>
      {Object.entries(object).map(([key, value]) => {
        if (layout === Layout.verticle) {
          return (
            <ul
              css={css`
                margin: 0;
              `}
            >
              {key}:{' '}
              {(() => {
                if (value && typeof value === 'object')
                  return <RenderObjectRecursively object={value} layout={layout} />;
                return typeof value === 'bigint' ? Number(value) : value;
              })()}
            </ul>
          );
        } else {
          return (
            <span
              css={css`
                margin-right: 5px;
              `}
            >
              {key}:{' '}
              {(() => {
                if (value && typeof value === 'object')
                  return <RenderObjectRecursively object={value} layout={layout} />;
                return typeof value === 'bigint' ? Number(value) : value;
              })()}
            </span>
          );
        }
      })}
    </>
  );
}
