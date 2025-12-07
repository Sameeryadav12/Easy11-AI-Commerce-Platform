import NextAuth, { type NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { recordAuditEvent } from '@/lib/audit';
import {
  ROLE_DEFINITIONS,
  resolveDirectoryProfile,
  type AdminRole,
  type DirectoryProfile,
} from '@/lib/rbac';

type DirectoryUser = DirectoryProfile & {
  permissions: string[];
};

const MOCK_PASSWORD = process.env.EASY11_ADMIN_PASSWORD ?? 'admin123';

async function authenticateDirectory(
  email?: string | null,
  password?: string | null
): Promise<DirectoryUser | null> {
  if (!email || !password) return null;
  const profile = resolveDirectoryProfile(email);
  if (!profile) return null;

  const passwordMatches = password === MOCK_PASSWORD;
  if (!passwordMatches) return null;

  return {
    ...profile,
    permissions: [`role:${profile.role}`, `department:${profile.department.toLowerCase()}`],
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'easy11-directory',
      name: 'Easy11 Directory',
      credentials: {
        email: { label: 'Work Email', type: 'email' },
        password: { label: 'Password or TOTP (mock)', type: 'password' },
      },
      async authorize(credentials) {
        const user = await authenticateDirectory(credentials?.email, credentials?.password);
        if (!user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
          permissions: user.permissions,
        } as const;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const role = (user as { role?: AdminRole }).role ?? 'support_agent';
        token.role = role;
        token.department = (user as { department?: string }).department ?? 'Support';
        token.permissions = (user as { permissions?: string[] }).permissions ?? [];
        token.id = user.id;
      }
      return token as JWT & {
        role?: AdminRole;
        department?: string;
        permissions?: string[];
      };
    },

    async session({ session, token }) {
      const role = token.role ?? 'support_agent';
      (session.user as any).role = role;
      (session.user as any).department = token.department ?? 'Support';
      (session.user as any).permissions = token.permissions ?? [];
      (session.user as any).id = token.id;
      (session as any).claims = ROLE_DEFINITIONS[role];
      return session;
    },
  },

  events: {
    async signIn({ user }) {
      const role = (user as { role?: AdminRole }).role ?? 'support_agent';
      await recordAuditEvent({
        actorId: String(user.id),
        actorRole: role,
        actorEmail: user.email ?? undefined,
        action: 'auth.sign_in',
        resource: 'auth/session',
        metadata: { provider: 'directory', status: 'success' },
      });
    },
    async signOut({ token }) {
      if (!token) return;
      const role = (token.role as AdminRole | undefined) ?? 'support_agent';
      await recordAuditEvent({
        actorId: String(token.id ?? 'unknown'),
        actorRole: role,
        actorEmail: typeof token.email === 'string' ? token.email : undefined,
        action: 'auth.sign_out',
        resource: 'auth/session',
        metadata: { provider: 'directory', status: 'success' },
      });
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

