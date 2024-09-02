import { prisma } from "prisma/client";

export async function GET() {
    try {
        const transactionTypes = await prisma.financialAccount.findMany({
            where: { isDeleted: false }, // Filter out deleted entries
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