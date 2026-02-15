import { prisma } from '@/lib/db/prisma';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email as string } });
        if (!user?.passwordHash) return null;
        const valid = await bcrypt.compare(credentials.password as string, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name };
      }
    }),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [GitHub({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET })]
      : [])
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    }
  },
  pages: { signIn: '/auth/login' }
};
