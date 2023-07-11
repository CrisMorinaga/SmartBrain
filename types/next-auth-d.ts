import NextAuth from "next-auth/next";

declare module "next-auth"{
    interface Session{
        user:{
            id: number,
            name: string,
            username: string,
            email: string,
            access_token: string,
            total_searches: number,
            profile_picture: any,
            profile_picture_url: string,
        }
    }
}