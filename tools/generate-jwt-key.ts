import { encodeBase64 } from "std/encoding/base64.ts";

const pair = await crypto.subtle.generateKey(
	{
		name: "ECDSA",
		modulusLength: 4096,
		publicExponent: new Uint8Array([1, 0, 1]),
		namedCurve: "P-384",
		hash: { name: "SHA-384" },
	},
	true,
	["sign", "verify"],
);

const privateKey = await crypto.subtle.exportKey("pkcs8", pair.privateKey);
const privatePem = `-----BEGIN PRIVATE KEY-----\n${encodeBase64(
	privateKey,
)}\n-----END PRIVATE KEY-----\n`;
await Deno.writeTextFile("./jwt-key.pem", privatePem);

const publicKey = await crypto.subtle.exportKey("spki", pair.publicKey);
const publicPem = `-----BEGIN PUBLIC KEY-----\n${encodeBase64(
	publicKey,
)}\n-----END PUBLIC KEY-----\n`;
await Deno.writeTextFile("./jwt-key.pub", publicPem);
