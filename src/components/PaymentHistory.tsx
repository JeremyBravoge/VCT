import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface Transaction {
  transaction_no: number;
  student_name: string;
  amount: number;
  payment_method: string;
  reference: string;
  date: string;
}

interface Props {
  transactions: Transaction[];
}

const PaymentHistory: React.FC<Props> = ({ transactions }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Transactions</span>
        </CardTitle>
        <CardDescription>A record of all student payments</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">No.</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Student</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Amount (Ksh)</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Method</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Reference</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Date</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx, index) => (
                <tr key={tx.transaction_no}>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{tx.student_name}</td>
                  <td className="px-4 py-2">{parseFloat(tx.amount).toFixed(2)}</td>
                  <td className="px-4 py-2">{tx.payment_method}</td>
                  <td className="px-4 py-2">{tx.reference}</td>
                  <td className="px-4 py-2">
                    {new Date(tx.date).toLocaleString("en-KE", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
