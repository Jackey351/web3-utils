import { ApolloClient, gql } from '@apollo/client';
import { initApolloClient as _initApolloClient } from './apollo-client';
import { initCeramicClient as _initCeramicClient } from './ceramic-client';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ModelInstanceDocument } from '@ceramicnetwork/stream-model-instance';
import { CID } from 'multiformats/cid';
import { StreamID } from '@ceramicnetwork/streamid';
// import { Ceramic as CeramicClient2 } from '@ceramicnetwork/core';

// createStreamFromGenesis
let client: ApolloClient<{}>;
let ceramic: CeramicClient;
const initApolloClient = async () => {
  client = await _initApolloClient();
};
const query = async () => {
  const res = await client.query({
    query: gql`
      query {
        playground_indexFilesIndex(last: 100) {
          edges {
            node {
              id
              appVersion
              comment
              contentId
              contentType
              createdAt
              datatokenId
              decryptionConditions
              decryptionConditionsType
              encryptedSymmetricKey
              fileType
              updatedAt
              decryptionConditions
            }
          }
        }
      }
    `,
  });
  console.log(res);
};

const initCeramicClient = async () => {
  ceramic = await _initCeramicClient();
};

const updateStream = async () => {
  const document = await ModelInstanceDocument.load(
    ceramic,
    'kjzl6kcym7w8y5pj1xs5iotnbplg7x4hgoohzusuvk8s7oih3h2fuplcvwvu2wx',
  );
  console.log(document.content);
  await document.replace({ ...document.content, contentId: '' });
};

const cidToStreamId = () => {
  console.log(CID.parse('bagcqceraymd6dcl57zomqlpaoozwpojsziose64rcymaacg63a7bumjhfvcq'));
  console.log(
    new StreamID(
      3,
      CID.parse('bagcqceraymd6dcl57zomqlpaoozwpojsziose64rcymaacg63a7bumjhfvcq'),
    ).toString(),
  );
};

// const createStreamFromGenesis = async () => {
//   const ceramic = new CeramicClient2();
//   const a = {
//     type: 3,
//     genesis: {
//       jws: {
//         payload: 'AXESIKql64cbBv2uYZu1fB5y7NiCP6xBc8v-gH-eEn9J9Jlp',
//         signatures: [
//           {
//             protected:
//               'eyJhbGciOiJFZERTQSIsImNhcCI6ImlwZnM6Ly9iYWZ5cmVpYTc0dXRkdHRxenRvZDZpdmU0d3p4dnQ2eXpqdTJsbzN0cTNvcmJ4NWZhNWl1cm5pa3JkNCIsImtpZCI6ImRpZDprZXk6ejZNa3NIdzVFWWlXd3hOS2VGOHQyU3hZM0RlazJ4ekthQ01lWUt2dzVyUlBldTdNI3o2TWtzSHc1RVlpV3d4TktlRjh0MlN4WTNEZWsyeHpLYUNNZVlLdnc1clJQZXU3TSJ9',
//             signature:
//               'LEVPs5mj2HjtSyZyasqYL8UZe8TCINiMSlcnD744-QgW1j77UfYY5Tmx93ua-oEGQSeWAUJ6OZcc1pILRO5kCw',
//           },
//         ],
//         link: 'bafyreifkuxvyogyg7wxgdg5vpqphf3gyqi72yqltzp7ia746cj7ut5ezne',
//       },
//       linkedBlock:
//         'omRkYXRhp2hmaWxlTmFtZW1jcmVhdGUgYSBmaWxlaGZpbGVUeXBlAGljb250ZW50SWR4P2tqemw2a2N5bTd3OHliMHhwcjlvMm1kdW9oaWhobm02cmF2MG1mbnE5NmFsaXBrZzJwdmdoZzQycW9tcnhtNWljcmVhdGVkQXR4GDIwMjMtMTAtMDhUMTA6MTI6MzEuMDE0Wmlmc1ZlcnNpb25kMC4xMWl1cGRhdGVkQXR4GDIwMjMtMTAtMDhUMTA6MTI6MzEuMDE0Wmtjb250ZW50VHlwZXiHZXlKeVpYTnZkWEpqWlNJNklrTkZVa0ZOU1VNaUxDSnlaWE52ZFhKalpVbGtJam9pYTJwNmJEWm9kbVp5WW5jMlkyRjBaV3N6Tm1nemNHVndNRGxyT1dkNWJXWnViR0U1YXpadmFteG5jbTEzYW05bmRtcHhaemh4TTNwd2VXSnNNWGwxSW4wZmhlYWRlcqRjc2VwZW1vZGVsZW1vZGVsWCjOAQIBhQESIH8JG4Y2KIV/LJ/ZtDn5+K80Ln63tgcVD+fDPvKyFFHIZnVuaXF1ZUxPLQRlcMyfYfG/YMBrY29udHJvbGxlcnOBeDtkaWQ6cGtoOmVpcDE1NToxOjB4MzEyZUE4NTI3MjZFM0E5ZjYzM0EwMzc3YzBlYTg4MjA4NmQ2NjY2Ng',
//       cacaoBlock:
//         'o2FooWF0Z2VpcDQzNjFhcKljYXVkeDhkaWQ6a2V5Ono2TWtzSHc1RVlpV3d4TktlRjh0MlN4WTNEZWsyeHpLYUNNZVlLdnc1clJQZXU3TWNleHB4GDIwMjMtMTAtMTVUMDM6MzU6MjIuOTIxWmNpYXR4GDIwMjMtMTAtMDhUMDM6MzU6MjIuOTIxWmNpc3N4O2RpZDpwa2g6ZWlwMTU1OjE6MHgzMTJlQTg1MjcyNkUzQTlmNjMzQTAzNzdjMGVhODgyMDg2ZDY2NjY2ZW5vbmNlblBmRmF5QWdSUU9BS0ZKZmRvbWFpbnggY2VrcGZua2xjaWZpb21nZW9nYm1rbm5tY2dia2RwaW1ndmVyc2lvbmExaXJlc291cmNlc4p4UWNlcmFtaWM6Ly8qP21vZGVsPWtqemw2aHZmcmJ3NmM4c29nY2M0MzhmZ2dzdW55YnVxNnE5ZWN4b2FvemN4ZThxbGprOHd1M3VxdTM5NHV4N3hRY2VyYW1pYzovLyo/bW9kZWw9a2p6bDZodmZyYnc2Y2F0ZWszNmgzcGVwMDlrOWd5bWZubGE5azZvamxncm13am9ndmpxZzhxM3pweWJsMXl1eFFjZXJhbWljOi8vKj9tb2RlbD1ranpsNmh2ZnJidzZjN3hsdGh6eDlkaXk2azNyM3MweGFmOGg3NG5neGhuY2dqd3llcGw1OHBrYTE1eDl5aGN4UWNlcmFtaWM6Ly8qP21vZGVsPWtqemw2aHZmcmJ3NmM4NjFjenZkc2xlZDN5bHNhOTk3N2k3cmxvd3ljOWw3anBnNmUxaGp3aDlmZWZsNmJzdXhRY2VyYW1pYzovLyo/bW9kZWw9a2p6bDZodmZyYnc2Y2I0bXNkODhpOG1sanp5cDNhencwOXgyNnYza2pvamVpdGJleDE4MWVmaTk0ZzU4ZWxmeFFjZXJhbWljOi8vKj9tb2RlbD1ranpsNmh2ZnJidzZjN2d1ODhnNjZ6MjhuODFsY3BiZzZodTJ0OHB1MnB1aTBzZm5wdnNyaHFuM2t4aDl4YWl4UWNlcmFtaWM6Ly8qP21vZGVsPWtqemw2aHZmcmJ3NmNhd3JsN2Y3NjdiNmN6NDhkbjBlZnI5d2Z0eDl0OWplbHc5dGIxb3R4ejc1MmpoODZrbnhRY2VyYW1pYzovLyo/bW9kZWw9a2p6bDZodmZyYnc2Yzg2Z3Q5ajQxNXl3Mng4c3Rta290Y3J6cGV1dHJia3A0Mmk0ejkwZ3A1aWJwdHo0c3NveFFjZXJhbWljOi8vKj9tb2RlbD1ranpsNmh2ZnJidzZjNnZiNjR3aTg4dWI0N2dibWNoODJ3Y3BibWU1MWh5bTRzOXFicDJ1a2FjMHl0aHpiajl4UWNlcmFtaWM6Ly8qP21vZGVsPWtqemw2aHZmcmJ3NmNhZ3Q2OTRpaW0yd3VlY3U3ZXVtZWRzN3FkMHA2dXptOGRucXNxNjlsbDdrYWNtMDVndWlzdGF0ZW1lbnR4MUdpdmUgdGhpcyBhcHBsaWNhdGlvbiBhY2Nlc3MgdG8gc29tZSBvZiB5b3VyIGRhdGFhc6Jhc3iEMHgyYTVjNWVmOWNiY2Y0MTM2YmJjOTVjYWI5NWYyZDg0MzU4MDc1ZWJjYzU5OTYzNTRkMTc2Yjg3ZWQxNzQxNTBmM2UyY2M5ZTkxMjJmOTlmNDZkZjc4YTI3MzZiNDU2NTFkMDU0MDIxM2I0ODg3ODNjZjVmMzMzMmYzNzUzODg3MjFiYXRmZWlwMTkx',
//     },
//     opts: {
//       anchor: true,
//       publish: true,
//       sync: 3,
//       syncTimeoutSeconds: 0,
//     },
//   };
//   const res = await ceramic.createStreamFromGenesis(a.type, a.genesis);
//   console.log(res);
//   console.log(res.id.toString());
// };

export function Ceramic() {
  return (
    <div>
      <button onClick={initApolloClient}>initApolloClient</button>
      {/* <button onClick={query}>query</button> */}
      <button onClick={initCeramicClient}>initCeramicClient</button>
      <button onClick={updateStream}>updateStream</button>
      <button onClick={cidToStreamId}>cidToStreamId</button>
      {/* <button onClick={createStreamFromGenesis}>createStreamFromGenesis</button> */}
    </div>
  );
}
