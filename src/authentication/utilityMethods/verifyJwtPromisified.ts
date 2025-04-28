import jwt, { JwtPayload } from "jsonwebtoken";

/**
 *A promisified version of the jwt.verify method
 *
 * @param {string} token
 * @param {string} secret
 * @return {Promise<JwtPayload | string>} Promise object returns the decoded ```JwtPayload```
 */
function verifyJwtPromisified(
    token: string,
    secret: string
): Promise<JwtPayload | string | undefined> {
    return new Promise((res, rej) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                rej(err.name);
                return;
            } else {
                res(decoded);
            }
        });
    });
}

export { verifyJwtPromisified };
