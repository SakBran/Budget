import { prisma } from "prisma/client";

export async function GET() {
    try {
        const result = await prisma.category.findMany({
            where: { isDeleted: false }, // Filter out deleted entries
            select: { id: true, name: true }, // Select only necessary fields
        });

        return new Response(JSON.stringify(result), {
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