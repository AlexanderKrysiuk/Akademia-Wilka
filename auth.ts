import NextAuth from "next-auth"
import credentials from "next-auth/providers/credentials"
import Credentials from "next-auth/providers/credentials"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        return null
      }
    })
  ],
})