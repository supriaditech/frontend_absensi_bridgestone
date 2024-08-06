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
          // Ensure the response includes an accessToken
          return {
            ...user.data,
            accessToken: user.data.accessToken,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  secret: "projectabsenniya",

  callbacks: {
    async jwt({ token, user }: any) {
      // Include user in the token
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id; // Include user id if needed
      }
      return token;
    },
    async session({ session, token }: any) {
      // Pass the accessToken to the session
      session.accessToken = token.accessToken;
      session.user = {
        ...session.user,
        id: token.id, // Include other user properties if needed
      };

      // If additional API call is needed to validate or extend the session
      try {
        const response = await fetch(apiUrl + "/auth/profile", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: token.id,
          }),
        });

        const resp = await response.json();
        if (resp.message === "Unauthenticated.") {
          signOut();
          return;
        }
        session.user = resp.data;
      } catch (e) {
        console.error(e);
      }

      return session;
    },
  },
};

export default NextAuth(options);
