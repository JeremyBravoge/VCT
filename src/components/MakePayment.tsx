import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  Download,
  FileText,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Sub-components (defined below for copy-paste ease, but should be in separate files)
import { MakePaymentForm } from "./components/MakePaymentForm";
import { TransactionTable } from "./components/TransactionTable";
import { FeeStatementTable } from "./components/FeeStatementTable";
import { DepartmentSummaryTable } from "./components/DepartmentSummaryTable";
import FinanceChart from "@/components/FinanceChart"; // Assumed existing component

// --- Interfaces ---
export interface FinanceRecord {
  id: number;
  student_id: string;
  total_amount: string;
  amount_paid: string;
  amount_pending: string;
  is_paid: number;
  payment_method: string | null;
  payment_date: string | null;
  first_name: string;
  last_name: string;
  student_name: string;
}

export interface Transaction {
  transaction_no: number;
  student_name: string;
  amount: number | string;
  payment_method: string;
  reference: string;
  date: string;
}

export interface Student {
  student_id: string;
  name: string;
}

export interface DepartmentSummary {
  department: string;
  total_amount: string;
  amount_paid: string;
  amount_pending: string;
}

const FinancePage: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Trigger to re-fetch

  // Data State
  const [financeData, setFinanceData] = useState<FinanceRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);

  // --- Fetch Logic ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [finRes, studRes, transRes, deptRes] = await Promise.all([
        fetch("http://localhost:5000/api/finance"),
        fetch("http://localhost:5000/api/students"),
        fetch("http://localhost:5000/api/transactions"),
        fetch("http://localhost:5000/api/finance/fees-summary"),
      ]);

      if (!finRes.ok) throw new Error("Failed to load finance records");
      
      const finData = await finRes.json();
      const studData = studRes.ok ? await studRes.json() : [];
      const transData = transRes.ok ? await transRes.json() : [];
      const deptData = deptRes.ok ? await deptRes.json() : [];

      setFinanceData(Array.isArray(finData) ? finData : []);
      setStudents(Array.isArray(studData) ? studData : []);
      setTransactions(Array.isArray(transData) ? transData : []);
      setDepartments(Array.isArray(deptData) ? deptData : []);

    } catch (err) {
      console.error(err);
      toast({
        title: "Connection Error",
        description: "Could not load data. Please ensure the server is running.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  // --- Summary Calculations (Memoized for performance) ---
  const summary = useMemo(() => {
    const parse = (val: string | number) => parseFloat(String(val || "0"));
    return {
      totalFees: financeData.reduce((acc, curr) => acc + parse(curr.total_amount), 0),
      amountPaid: financeData.reduce((acc, curr) => acc + parse(curr.amount_paid), 0),
      outstanding: financeData.reduce((acc, curr) => acc + parse(curr.amount_pending), 0),
      overdueCount: financeData.filter((f) => parse(f.amount_pending) > 0).length,
    };
  }, [financeData]);

  // --- PDF Export Logic ---
  const handleDownloadStatement = () => {
    if (!financeData.length) return toast({ title: "No data to export", variant: "destructive" });

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Fee Statement Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [["Student", "Total", "Paid", "Pending", "Status"]],
      body: financeData.map((f) => [
        f.student_name,
        parseFloat(f.total_amount).toLocaleString(),
        parseFloat(f.amount_paid).toLocaleString(),
        parseFloat(f.amount_pending).toLocaleString(),
        f.is_paid ? "Paid" : "Pending",
      ]),
    });

    doc.save("Fee_Statement.pdf");
    toast({ title: "Success", description: "Report downloaded successfully." });
  };

  // --- Helper: Currency Formatter ---
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);

  return (
    <div className="space-y-8 p-2 md:p-4 bg-gray-50/50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Financial Overview</h1>
          <p className="text-muted-foreground">Manage fees, payments, and track revenue.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleDownloadStatement} className="bg-blue-600 hover:bg-blue-700">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Fees Expected" 
          value={formatCurrency(summary.totalFees)} 
          icon={<FileText className="h-5 w-5 text-blue-600" />} 
          bg="bg-blue-50" 
        />
         <StatsCard 
          title="Total Collected" 
          value={formatCurrency(summary.amountPaid)} 
          valueColor="text-green-600"
          icon={<DollarSign className="h-5 w-5 text-green-600" />} 
          bg="bg-green-50" 
        />
        <StatsCard 
          title="Outstanding Balance" 
          value={formatCurrency(summary.outstanding)} 
          valueColor="text-red-600"
          icon={<AlertCircle className="h-5 w-5 text-red-600" />} 
          bg="bg-red-50" 
        />
        <StatsCard 
          title="Students with Arrears" 
          value={summary.overdueCount.toString()} 
          icon={<TrendingUp className="h-5 w-5 text-orange-600" />} 
          bg="bg-orange-50" 
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white border w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Make Payment</TabsTrigger>
          <TabsTrigger value="statement">Fee Statement</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
          <TabsTrigger value="summaries">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader><CardTitle>Fee Analytics</CardTitle></CardHeader>
            <CardContent>
              {/* Ensure FinanceChart handles empty data gracefully */}
              <FinanceChart financeData={financeData} /> 
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <div className="max-w-2xl mx-auto">
            <MakePaymentForm 
              students={students} 
              onSuccess={handleRefresh} 
            />
          </div>
        </TabsContent>

        <TabsContent value="statement">
          <FeeStatementTable data={financeData} />
        </TabsContent>

        <TabsContent value="history">
          <TransactionTable transactions={transactions} />
        </TabsContent>

        <TabsContent value="summaries">
          <DepartmentSummaryTable departments={departments} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// --- Reusable Stats Card Component ---
const StatsCard = ({ title, value, icon, bg, valueColor = "text-gray-900" }: any) => (
  <Card>
    <CardContent className="p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className={`text-2xl font-bold mt-1 ${valueColor}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-full ${bg}`}>{icon}</div>
    </CardContent>
  </Card>
);

export default FinancePage;