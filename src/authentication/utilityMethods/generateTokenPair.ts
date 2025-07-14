import jwt from "jsonwebtoken";
import "dotenv/config";
import { EnvironmentVariableNotFoundError } from "../../errors/errors.js";
import { StringValue } from "ms";
import { type tokenObject } from "../../models/types.js";
/**
 * Generates a pair of JWT tokens with the value accessTokenExpiry parameter as the expiry for the access token.
 *
 * @param {{ email: string }} tokenData
 * @param {StringValue} accessTokenExpiry
 * @return {*}  {{accessToken: string,refreshToken: string}}
 */
function generateTokenPair(
    tokenData: tokenObject,
    accessTokenExpiry: StringValue,
    refreshTokenExpiry: StringValue
): { accessToken: string; refreshToken: string } {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!accessTokenSecret || !refreshTokenSecret) {
        const notFoundVariable = !accessTokenSecret
            ? "ACCESS_TOKEN_SECRET"
            : "REFRESH_TOKEN_SECRET";
        throw new EnvironmentVariableNotFoundError(
            "Environment Variable not found",
            notFoundVariable
        );
    }

    const accessToken = jwt.sign(tokenData, accessTokenSecret, {
        expiresIn: accessTokenExpiry,
    });
    const refreshToken = jwt.sign(tokenData, refreshTokenSecret, {
        expiresIn: refreshTokenExpiry,
    });

    return { accessToken, refreshToken };
}

export { generateTokenPair };
