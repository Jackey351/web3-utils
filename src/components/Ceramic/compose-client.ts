import { Ceramic } from './ceramic-client';
import { ComposeClient } from '@composedb/client';
import { Composite } from '@composedb/devtools';
import { ceramicAPI } from './config';

export async function initComposeClient() {
  const ceramic = await new Ceramic().initCeramicClient();
  console.log(ceramic);
  const composite = await Composite.fromModels({
    ceramic,
    models: ['kjzl6hvfrbw6c763ubdhowzao0m4yp84cxzbfnlh4hdi5alqo4yrebmc0qpjdi5'],
  });
  console.log(composite);
  const definition = composite.toRuntime();
  console.log({ definition });
  const compose = new ComposeClient({ ceramic: ceramicAPI, definition });
  console.log({ compose });
  return compose;
}
