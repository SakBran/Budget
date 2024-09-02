import { prisma } from "prisma/client";

export async function GET() {
    try {
        const transactionTypes = await prisma.user.findMany({

            select: { id: true, name: true }, // Select only necessary fields
        });

        return new Response(JSON.stringify(transactionTypes), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function GetByEmail(request: Request) {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email || typeof email !== 'string') {
        return Response.json({ message: 'Invalid email query parameter' }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user) {
            return Response.json({ user });
        } else {
            return Response.json({ message: 'User not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        return Response.json({ message: 'Internal server error' }, { status: 500 });
    }
}