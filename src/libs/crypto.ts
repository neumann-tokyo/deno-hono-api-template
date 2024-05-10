import * as djwt from "djwt";
import { decodeBase64 } from "std/encoding/base64.ts";

export const algName = "ES384";
export const cryptoMethod = {
	name: "ECDSA",
	namedCurve: "P-384",
	hash: { name: "SHA-384" },
};
export const expire = 60 * 60 * 24 * 30;

export async function jwtPrivateKey() {
	const pem = await Deno.readTextFile("./jwt-key.pem");
	const pemHeader = "-----BEGIN PRIVATE KEY-----";
	const pemFooter = "-----END PRIVATE KEY-----";
	const pemContents = pem.substring(
		pemHeader.length,
		pem.length - (pemFooter.length + 2),
	);
	const binaryDer = decodeBase64(pemContents);
	return crypto.subtle.importKey("pkcs8", binaryDer, cryptoMethod, true, [
		"sign",
	]);
}

export async function jwtPublicKey() {
	const pem = await Deno.readTextFile("./jwt-key.pub");
	const pemHeader = "-----BEGIN PUBLIC KEY-----";
	const pemFooter = "-----END PUBLIC KEY-----";
	const pemContents = pem.substring(
		pemHeader.length,
		pem.length - (pemFooter.length + 2),
	);
	const binaryDer = decodeBase64(pemContents);
	return crypto.subtle.importKey("spki", binaryDer, cryptoMethod, true, [
		"verify",
	]);
}

export async function generateJwtToken({ userId }) {
	return await djwt.create(
		{
			alg: algName,
			typ: "JWT",
		},
		{
			sub: userId.toString(),
			exp: djwt.getNumericDate(expire),
		},
		await jwtPrivateKey(),
	);
}
