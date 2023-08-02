import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "@/library/axios";

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {

                const res = await axios.post('/login', {
                    username: credentials?.username,
                    password: credentials?.password
                })
                
                const user = await res.data

                // If no error and we have user data, return it
                if (user) {
                    return user
                }
                // Return null if user data could not be retrieved
                return null
            }
        })
    ], 

    session:{
        strategy:"jwt"
    },

    pages: {
        signIn: '/login',
    },

    callbacks: {
        async jwt({token, user, trigger, session}) {
            if (trigger === 'update') {
                return { ...token, ...session.user }
            }

            return {...token, ...user};
        },
        async session({ session, token }) {
            session.user = token as any;
            return session;
        }
    }
}