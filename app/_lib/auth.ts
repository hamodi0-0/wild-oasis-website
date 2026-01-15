import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { NextResponse } from "next/server";
import { createGuest, getGuest } from "./data-service";
import { CustomSession } from "../_types/types";

export const {
  handlers: { GET, POST },
  auth,
  signOut,
  signIn,
} = NextAuth({
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      if (auth?.user && pathname.startsWith("/login")) {
        return NextResponse.redirect(new URL("/", request.nextUrl));
      }

      return !!auth?.user;
    },
    async signIn({ user }) {
      try {
        const existingGuest = await getGuest(user.email!);

        if (!existingGuest) {
          await createGuest({
            fullName: user.name!,
            email: user.email!,
          });
        }
        return true;
      } catch (error) {
        console.log("Error during sign-in:", error);
        return false;
      }
    },
    async session({ session }) {
      const customSession = session as CustomSession;
      const guest = await getGuest(session.user.email!);

      customSession.user.guestId = guest?.id;

      return customSession;
    },
  },
  pages: {
    signIn: "/login",
  },
  providers: [Google],
});
