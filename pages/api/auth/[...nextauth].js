// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import nodemailer from 'nodemailer';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

// prisma adapter allows us to link our database to next auth for persistence of sign in tokens, sessions, etc.

//handles api routes for authentication. NextAuth is a method and we are passing in objects to configure the authentication providers
const prisma = new PrismaClient();

export default NextAuth({
	providers: [
		EmailProvider({
			server: {
				host: process.env.EMAIL_SERVER_HOST,
				port: process.env.EMAIL_SERVER_PORT,
				auth: {
					user: process.env.EMAIL_SERVER_USER,
					pass: process.env.EMAIL_SERVER_PASSWORD,
				},
			},
			from: process.env.EMAIL_FROM,
			maxAge: 10 * 60, // Magic links are valid for 10 min only
		}),
	],
	adapter: PrismaAdapter(prisma),
});
