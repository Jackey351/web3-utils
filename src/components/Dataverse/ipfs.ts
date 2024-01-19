import axios, { AxiosHeaders } from 'axios';
import { createJWS } from '../Ceramic/jws';
import { initCeramicClient } from '../Ceramic/ceramic-client';
import { baseURL } from './constant';

export class IPFS {
  async uploadFile(file: File | ArrayBuffer | string): Promise<string> {
    const codeRes = await axios.post(`${baseURL}/v0/code`);
    const jws = await createJWS({
      code: codeRes.data.code,
      requestPath: '/v0/upload',
      ceramic: await initCeramicClient(),
    });
    const res = await axios.put(`${baseURL}/v0/upload`, file, {
      headers: {
        Authorization: `Bearer ${jws}`,
      },
    });
    return res.data.cid.replace('ipfs://', '');
  }

  // async removeFile(cid: string): Promise<string> {
  //   const codeRes = await axios.post(`${baseURL}/v0/code`);
  //   const res = await axios.delete(`${baseURL}/v0/upload`, file, {
  //     headers: {
  //       Authorization: `Bearer ${jws}`,
  //     },
  //   });
  //   return res.data.cid.replace('ipfs://', '');
  // }

  getFileLink(cid: string): string {
    return `${baseURL}/ipfs/${cid}`;
  }

  async getFileContentType(cid: string): Promise<string> {
    const res = await axios.head(this.getFileLink(cid));
    return (res?.headers as AxiosHeaders)?.getContentType() as unknown as string;
  }

  async retriveFile(cid: string): Promise<string> {
    const res = await axios.get(this.getFileLink(cid));
    return res.data;
  }
}
