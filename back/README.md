pnpm install express dotenv jsonwebtoken mongoose bcryptjs speakeasy bluebird cookie-parser cors express-async-errors qrcode winston

`bluebird` é uma extensão para promises que torna ela mais performática, torna outras promises não standard como a do mongoose padronizadas, etc.

`express-async-errors` com esse npm se houver um throw new Error('') dentro de uma função async o express irá pegar e jogar no next('')

um cookie assinado usa um HMAC que é uma assinatura usando um hash (md5,sha1,sha256) e um código secret, esse cookie será somente leitura


https://geekflare.com/user-authentication-with-jwt-in-nodejs/


