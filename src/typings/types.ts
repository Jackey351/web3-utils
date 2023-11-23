import { Dispatch, SetStateAction } from 'react';

export interface States {
  item: any;
  setItem: Dispatch<SetStateAction<any>>;
}
