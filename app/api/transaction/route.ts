import { NextRequest, NextResponse } from "next/server";
import { prisma } from "prisma/client";



export async function GET() {
    try {
        const transaction = await prisma.transaction.findMany({
            include: {
                transactionType: true,
                category: true,
                user: true,
                financialAccount: true,
            },
        });

        return new Response(JSON.stringify(transaction), {
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

export async function POST(request: NextRequest) {
    const body = await request.json();
    const newData = await prisma.transaction.create({
        data: {
            amount: +body.amount,
            description: body.description,
            date: new Date(body.date),
            userId: body.userId,
            categoryId: +body.categoryId,
            transactionTypeId: +body.transactionTypeId,
            financialAccountId: +body.financialAccountId,
            isDeleted: body.isDeleted
        },
    });

    return NextResponse.json(newData, { status: 201 });
}

