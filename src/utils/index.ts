import qs from 'query-string';
import { useLocation } from 'react-router-dom';
import { toString } from 'uint8arrays/to-string';
import { fromString } from 'uint8arrays/from-string';

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

export function utf8ToString(utf8: string) {
  const Unint8Array = fromString(utf8, 'utf8');
  var dataString = '';
  for (var i = 0; i < Unint8Array.length; i++) {
    dataString += String.fromCharCode(Unint8Array[i]);
  }
  return dataString;
}

