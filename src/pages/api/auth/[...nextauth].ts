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
console.log(user)
          if (response.ok && user.meta.statusCode === 200) {
            // Mengembalikan objek pengguna dengan properti yang sesuai dengan format yang diminta
            return {
              id: user.data.user.id,
              userId: user.data.user.userId,
              password: user.data.user.password,
              name: user.data.user.name,
              dateOfBirth: user.data.user.dateOfBirth,
              employmentStartDate: user.data.user.employmentStartDate,
              phoneNumber: user.data.user.phoneNumber,
              address: user.data.user.address,
              employmentStatus: user.data.user.employmentStatus,
              role: user.data.user.role,
              photoUrl: user.data.user.photoUrl,
              faceDescriptor: user.data.user.faceDescriptor,
              createdAt: user.data.user.createdAt,
              updatedAt: user.data.user.updatedAt,
              accessToken: user.data.accessToken, // Menyimpan accessToken jika diperlukan
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  secret: "projectabsenniya",

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        // Menambahkan semua properti pengguna ke dalam token
        token = {
          ...token,
          accessToken: user.accessToken ?? null,
          id: user.id ?? null,
          userId: user.userId ?? null,
          password: user.password ?? null,
          name: user.name ?? null,
          dateOfBirth: user.dateOfBirth ?? null,
          employmentStartDate: user.employmentStartDate ?? null,
          phoneNumber: user.phoneNumber ?? null,
          address: user.address ?? null,
          employmentStatus: user.employmentStatus ?? null,
          role: user.role ?? null,
          photoUrl: user.photoUrl ?? null,
          faceDescriptor: user.faceDescriptor ?? null,
          createdAt: user.createdAt ?? null,
          updatedAt: user.updatedAt ?? null,
        };
      }
      return token;
    },

    async session({ session, token }: any) {
      console.log(token)
      // Meneruskan semua properti dari token ke sesi
      session.accessToken = token.accessToken;
      session.user = {
        id: token.id,
        userId: token.userId,
        password: token.password,
        name: token.name,
        dateOfBirth: token.dateOfBirth,
        employmentStartDate: token.employmentStartDate,
        phoneNumber: token.phoneNumber,
        address: token.address,
        employmentStatus: token.employmentStatus,
        role: token.role,
        photoUrl: token.photoUrl,
        faceDescriptor: token.faceDescriptor,
        createdAt: token.createdAt,
        updatedAt: token.updatedAt,
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
      console.log(session)
      return session;
    },
  },    
};

export default NextAuth(options);
