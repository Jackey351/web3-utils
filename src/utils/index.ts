import qs from 'query-string';
import { useLocation } from 'react-router-dom';
import { toString } from 'uint8arrays/to-string';
import { fromString } from 'uint8arrays/from-string';
import parse from 'url-parse';

export function useQuery<T = any>(): T {
  const { search } = useLocation();
  return qs.parse(search) as unknown as T;
}

export function stringToBase16(s: string) {
  var arr = [];
  for (var i = 0, j = s.length; i < j; ++i) {
    arr.push(s.charCodeAt(i));
  }
  return toString(new Uint8Array(arr), 'base16');
}

export function base16ToString(base16: string) {
  const Unint8Array = fromString(base16, 'base16');
  var dataString = '';
  for (var i = 0; i < Unint8Array.length; i++) {
    dataString += String.fromCharCode(Unint8Array[i]);
  }
  return dataString;
}

export function getTopDomain(url: string) {
  console.log(parse(url));
  return parse(url).origin.split('.').slice(-2).join('.');
}

export function buffer2bits(buff: number[]) {
  const res = [];
  for (let i = 0; i < buff.length; i++) {
    for (let j = 0; j < 8; j++) {
      if ((buff[i] >> (7 - j)) & 1) {
        res.push(1n);
      } else {
        res.push(0n);
      }
    }
  }
  return res;
}

export function convertToLength(hexInput: string, len: number) {
  while (hexInput.length != len) {
    hexInput = '0' + hexInput;
  }
  return hexInput;
}

export function intToLEBuffer(x: { toString: (arg0: number) => any }, bufSize: number) {
  return Buffer.from(convertToLength(x.toString(16), bufSize * 2), 'hex').reverse();
}