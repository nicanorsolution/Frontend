
import { Injectable } from '@angular/core';
import * as Forge from 'node-forge';

@Injectable({
  providedIn: 'root',
})
export class Encrypt {
  publicKey: string = `-----BEGIN PUBLIC KEY-----
  MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbimc1HpnjVgL6EyUuufu9qzI9
  aqHUUJOrS5mDUPyM5zkbzuiU8q7DBrN/qgyJ5wlrXPvr2HgnvYGBmREES6Si+odO
  TIUI5g7VwX2DN3af4W30z1YE+RbaOFGOtOcF4ivwgqIQ6u5GhoBUvwXGQ5rwj2k2
  B70i9Ku7K7hkcNbf/QIDAQAB
  -----END PUBLIC KEY-----`;

  constructor() { }

  encryptWithPublicKey(tx: string): string {
    const rsa = Forge.pki.publicKeyFromPem(this.publicKey);
    return window.btoa(rsa.encrypt(tx.toString()));
  }
}
