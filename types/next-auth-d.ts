import NextAuth from "next-auth/next";
import { JWT } from "next-auth/jwt";

declare module "next-auth"{

    interface Session{
        user:{
            id: number,
            name: string,
            username: string,
            email: string,
            access_token: string,
            total_searches: number,
            profile_picture_url: any,
        }
    }
}

declare module "next-auth/jwt"{

    interface JWT{
        id: number,
        name: string,
        username: string,
        email: string,
        access_token: string,
        total_searches: number,
        profile_picture_url: any,
    }
}
