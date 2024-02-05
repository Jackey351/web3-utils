import axios, { AxiosHeaders } from 'axios';
import { createJWS } from '../Ceramic/jws';
import { Ceramic } from '../Ceramic/ceramic-client';
import { baseURL } from './constant';

export class IPFS {
  async auth(requestPath: string) {
    const codeRes = await axios.post(`${baseURL}/v0/code`);
    const ceramic = new Ceramic();
    const ceramicClient = await ceramic.initCeramicClient();
    const jws = await createJWS({
      code: codeRes.data.code,
      requestPath,
      ceramic: ceramicClient,
    });
    return { siweMessage: ceramic.siweMessage, jws };
  }

  async uploadFile(file: File | ArrayBuffer | string): Promise<string> {
    const requestPath = '/v0/upload';
    const { jws,siweMessage } = await this.auth(requestPath);
    const res = await axios.put(`${baseURL}${requestPath}`, file, {
      headers: {
        Authorization: `Bearer ${jws}`,
        "x-dataverse-siwe": btoa(JSON.stringify(siweMessage))
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

  async getBlockSum(): Promise<number> {
    const requestPath = '/v0/block_sum';
    const { jws,siweMessage } = await this.auth(requestPath);
    const res = await axios.get(`${baseURL}${requestPath}`, {
      headers: {
        Authorization: `Bearer ${jws}`,
        "x-dataverse-siwe": btoa(JSON.stringify(siweMessage))
      },
    });
    return parseInt(res.data.block_size) * 256;
  }
}
