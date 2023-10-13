import { PrismaClient } from '@prisma/client';

declare global {
	var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

// this to prevent hot reloading from creating new instances of PrismaClient
if (process.env.NODE_ENV === 'production') globalThis.prisma = db;
