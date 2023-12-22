import { groth16 } from 'snarkjs';
import zkey from './aes_256_ctr_test/aes_256_ctr_test_0001.zkey?url';
import vkey from './aes_256_ctr_test/aes_256_ctr_test_vkey.json?url';
import wasm from './aes_256_ctr_test/aes_256_ctr_test_js/aes_256_ctr_test.wasm?url';

class Circuit {
  wasmPath: string;
  zkeyPath: string;
  vkey: any;

  constructor() {
    this.zkeyPath = zkey;
    this.wasmPath = wasm;
    fetch(vkey)
      .then(function (res) {
        return res.json();
      })
      .then((vkey) => {
        this.vkey = vkey;
      });
  }

  async generateProof(inputs: any) {
    const { proof, publicSignals } = await groth16.fullProve(inputs, this.wasmPath, this.zkeyPath);
    // let proofCalldata = await groth16.exportSolidityCallData(proof, publicSignals);
    // proofCalldata = JSON.parse("[" + proofCalldata + "]");
    return { proofJson: proof, publicSignals: publicSignals };
  }

  async verifyProof(proofJson: any, publicSignals: any) {
    const verify = await groth16.verify(this.vkey, publicSignals, proofJson);
    return verify;
  }
}

export default Circuit;
