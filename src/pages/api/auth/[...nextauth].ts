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

        try {
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
            // Mengembalikan objek pengguna dengan accessToken
            return {
              ...user.data,

              accessToken: user.data.accessToken,
              id: user.data.user.id,
              role: user.data.user.role,
            };
          } else {
            return null;
          }
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  secret: "projectabsenniya",

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id; // Menyertakan id pengguna
        token.role = user.role; // Menambahkan role ke token
      }
      return token;
    },

    async session({ session, token }: any) {
      // Meneruskan accessToken ke sesi
      session.accessToken = token.accessToken;
      session.user = {
        ...session.user,
        id: token.id, // Menyertakan properti user lainnya jika diperlukan
      };
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
        console.error("Error fetching profile:", e);
      }

      return session;
    },
  },
};

export default NextAuth(options);
