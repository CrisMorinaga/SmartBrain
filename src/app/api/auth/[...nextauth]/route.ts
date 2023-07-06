import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "@/library/axios";

const handler = NextAuth ({
// Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
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
        async session({ session, token, user }) {
            session.user = token as any;
            return session;
        }
    }

})

export { handler as GET, handler as POST }