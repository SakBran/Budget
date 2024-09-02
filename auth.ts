import NextAuth from "next-auth"
import { ZodError } from "zod"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "prisma/client"
import { signInSchema } from "./lib/zod"



export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      authorize: async (credentials) => {

        const { email, password } = await signInSchema.parseAsync(credentials)
        // logic to verify if the user exists
        const user = await prisma.user.findUnique({
          where: { email: email },
        });

        if (!user) {
          console.log("No user exist")
          return null;
        }

        if (password == user.password) {
          return user
        }
        else {
          return null
        }

      },
    }),
  ],
  secret: "Power Secret Key",
  session: {
    strategy: "jwt",
  },

})