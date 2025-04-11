import { StringValue } from "ms";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            PORT: number;
            SUPER_ADMIN_PASSWORD: string;
            SUPER_ADMIN_HASH: string;
            ACCESS_TOKEN_SECRET: string;
            REFRESH_TOKEN_SECRET: string;
            ACCESS_TOKEN_EXPIRY: StringValue;
            REFRESH_TOKEN_EXPIRY: StringValue;
        }
    }
}

export {};
