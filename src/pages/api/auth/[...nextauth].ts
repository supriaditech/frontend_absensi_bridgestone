import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { signOut } from "next-auth/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const options: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        userId: { label: "User ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const { userId, password } = credentials;
        const response = await fetch(apiUrl + "/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            password: password,
          }),
        });
        const user = await response.json();
        if (response.ok && user.meta.statusCode === 200) {
          return user.data;
        } else {
          return null;
        }
      },
    }),
  ],
  secret: "projectabsenniya",

  callbacks: {
    async jwt({ token, user }: any) {
      // the user present here gets the same data as received from DB call  made above -> fetchUserInfo(credentials.opt)
      return { ...token, ...user };
    },
    async session({ session, user, token }: any) {
      session.user = user;
      const response = await fetch(apiUrl + "/auth/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: token.user.id,
        }),
      });

      try {
        const resp = await response.json();
        if (resp.message === "Unauthenticated.") {
          signOut();
          return;
        }
        token.user = resp.data;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }

      return token;
    },
  },
};

export default NextAuth(options);
