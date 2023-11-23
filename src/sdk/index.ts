import PinataClient from '@pinata/sdk';

export const pinataClient = new PinataClient(
  process.env.pinataApiKey,
  process.env.pinataSecretApiKey,
);
// export {}