import * as bcrypt from "bcrypt";

const saltRounds = bcrypt.genSaltSync(15);
const password = Deno.args[0];

const hash = bcrypt.hashSync(password, saltRounds);
console.log("Password: ", password);
console.log("Password Digest: ", hash);
