import base64url from 'base64url';
import {KMS} from 'aws-sdk';
import KSUID from 'ksuid';
import {JwtHeader, JwtPayload, verify} from 'jsonwebtoken';
import {derToJose} from 'ecdsa-sig-formatter';
import jose from 'node-jose';

export type AuthJwtPayload = JwtPayload & {purpose: 'auth'};
export type SignupJwtPayload = JwtPayload & {purpose: 'signup'};
export type AppJwtPayload = AuthJwtPayload | SignupJwtPayload;

export async function kmsJwtSign(payload: AppJwtPayload, keyAlias: string): Promise<string> {
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

const publicKeys = new Map<string, string>();

async function getPublicKey(keyAlias: string) {
  let publicKey = publicKeys.get(keyAlias);
  if (publicKey) {
    return publicKey;
  }

  const kms = new KMS();
  const parameters: KMS.GetPublicKeyRequest = {
    KeyId: keyAlias,
  };
  const result = await kms.getPublicKey(parameters).promise();
  publicKey = (await jose.JWK.asKey(result.PublicKey!, 'spki')).toPEM();
  console.log(keyAlias, publicKey);
  publicKeys.set(keyAlias, publicKey);
  return publicKey;
}

export async function kmsVerifyJwt(jwt: string, purpose: AppJwtPayload['purpose'], keyAlias: string): Promise<AppJwtPayload> {
  const publicKey = await getPublicKey(keyAlias);
  const verified = verify(jwt, publicKey, {complete: true});
  const payload = verified.payload as AppJwtPayload;
  if (payload.purpose !== purpose) {
    throw new Error('purpose not match');
  }

  return payload;
}
