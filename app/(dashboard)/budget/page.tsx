"use server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Prisma } from "@prisma/client";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

type transation = {
  id: number; // Unique identifier for the transaction
  amount: number; // Amount of the transaction
  description: string; // Description of the transaction
  date: string; // Date of the transaction
  userId: string; // Identifier for the user associated with the transaction
  user: Prisma.UserGetPayload<{}>; // Associated user details
  categoryId: number; // Identifier for the category of the transaction
  category: Prisma.CategoryGetPayload<{}>; // Associated category details
  transactionTypeId: number; // Identifier for the type of transaction
  transactionType: Prisma.TransactionTypeGetPayload<{}>; // Associated transaction type details
  financialAccountId: number; // Identifier for the financial account
  financialAccount: Prisma.FinancialAccountGetPayload<{}>; // Associated financial account details
  isDeleted: boolean; // Indicates if the transaction is marked as deleted
  createdAt: Date; // Date when the transaction was created
  updatedAt: Date; // Date when the transaction was last updated
  Payment: Prisma.PaymentGetPayload<{}>[]; // Array of associated payments
};

type Props = {
  data: transation[];
};

const listPage = async () => {
  const url = "http://localhost:3000/api/transaction";
  const res = await fetch(url);
  const data: transation[] = await res.json();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finance Records</CardTitle>
        <CardDescription>View all fiance record.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <div className="ml-auto flex items-center gap-2">
              <Link className="btn btn-sm" href={"/budget/new"}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Record
                </span>
              </Link>
            </div>
          </div>
          <TabsContent value="all"></TabsContent>
        </Tabs>
        <div className="overflow-x-auto">
          <table className="table table-xs table-pin-rows table-pin-cols">
            <thead>
              <tr>
                <th></th>
                <td>Description</td>
                <td>Date</td>
                <td>User</td>
                <td>Category</td>
                <td>Transaction Type</td>
                <td>Financial Account</td>
                <td>Amount</td>
              </tr>
            </thead>
            <tbody>
              {data?.map((record, index) => {
                return (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{record.description}</td>
                    <td>{record.date.split("T")[0]}</td>
                    <td>{record?.user.name}</td>
                    <td>{record.category.name}</td>
                    <td>{record.transactionType.name}</td>
                    <td>{record.financialAccount.name}</td>
                    <td>{record.amount}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <td>Description</td>
                <td>Date</td>
                <td>User</td>
                <td>Category</td>
                <td>Transaction Type</td>
                <td>Financial Account</td>
                <td>Amount</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default listPage;
