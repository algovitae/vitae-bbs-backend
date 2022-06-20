import base64url from 'base64url';
import {KMS} from 'aws-sdk';
import KSUID from 'ksuid';
import {JwtHeader, JwtPayload, verify} from 'jsonwebtoken';
import {derToJose} from 'ecdsa-sig-formatter';

export async function kmsJwtSign(keyAlias: string, payload: JwtPayload): Promise<string> {
  const header: JwtHeader = {alg: 'ES512', typ: 'JWT'};

  const encoded_header = base64url(JSON.stringify(header));
  const encoded_payload = base64url(JSON.stringify({jti: KSUID.randomSync().toString(), ...payload}));

  const data = `${encoded_header}.${encoded_payload}`;

  const kms = new KMS();
  const parameters: KMS.SignRequest = {
    KeyId: keyAlias,
    MessageType: 'RAW',
    Message: data,
    SigningAlgorithm: 'ECDSA_SHA_512',
  };
  const response = await kms.sign(parameters).promise();
  const signature = response.Signature?.toString('base64url');
  if (!signature) {
    throw new Error('sign failed');
  }

  const encoded_signature = derToJose(signature, 'ES512');

  return `${encoded_header}.${encoded_payload}.${encoded_signature}`;
}

export async function kmsVerifyJwt(jwt: string): Promise<JwtPayload> {
  // TODO: 公開鍵をAPI経由で取得する＆キャッシュ
  const publicKey = `-----BEGIN PUBLIC KEY-----
MIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQAhyFFmL1eMIeWHsMtB0ok+4kwtcvD
deIxiCcfwWv/CpTvK3Hniacd6VRGZ79Evnidn9r+qN8KzOtCIr8Gw0nh7lIAJQW2
TcZumJd8dSeGffBtNuJouz8duROfIIjX4RKjoGMwXc0P0M4L8DOB9PfqsdMj2omG
0QgXEc6ZHsVFIwJz1OQ=
-----END PUBLIC KEY-----
  `;
  const verified = verify(jwt, publicKey, {complete: true});
  // Console.log(verified);
  return verified.payload as JwtPayload;
}
