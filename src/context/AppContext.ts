import React from 'react';
import { States } from '../typings/types';
import PinataClient from '@pinata/sdk';

interface Context {
  pinataClient?: PinataClient;
  states: States;
}
export default React.createContext<Context>({} as Context);
