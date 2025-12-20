import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FinanceChart from "@/components/FinanceChart"; // Ensure this component accepts 'financeData' prop
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  DollarSign,
  Download,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  CreditCard,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// --- Interfaces ---
interface FinanceRecord {
  id: number;
  student_id: string;
  total_amount: string;
  amount_paid: string;
  amount_pending: string;
  is_paid: number; // 0 or 1
  payment_method: string | null;
  payment_date: string | null;
  first_name: string;
  last_name: string;
  student_name: string;
  status?: string; // Optional derived field
}

interface Student {
  student_id: string;
  name: string;
  totalFees: string | number;
  feesPending: string | number;
}

interface Transaction {
  transaction_no: number;
  student_name: string;
  amount: number | string;
  payment_method: string;
  reference: string;
  date: string;
}

interface DepartmentSummary {
  department: string;
  total_amount: string;
  amount_paid: string;
  amount_pending: string;
}

const FinancePage: React.FC = () => {
  // --- State Management ---
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Used to re-trigger fetches

  const [financeData, setFinanceData] = useState<FinanceRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);

  // Payment Form State
  const [formData, setFormData] = useState({
    studentId: '',
    amountPaid: '',
    paymentMethod: '',
    reference: '',
    paymentDate: new Date().toISOString().split('T')[0], // Default to today
    receiptFile: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Helpers ---
  const formatCurrency = (amount: string | number) => {
    const val = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(isNaN(val) ? 0 : val);
  };

  const formatName = (name: string) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // --- Data Fetching ---
  const refreshData = () => setRefreshKey(prev => prev + 1);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [financeRes, studentsRes, transRes, deptRes] = await Promise.all([
          fetch('http://localhost:5000/api/finance'),
          fetch('http://localhost:5000/api/students'),
          fetch('http://localhost:5000/api/transactions'),
          fetch('http://localhost:5000/api/finance/fees-summary')
        ]);

        if (!financeRes.ok) throw new Error("Failed to fetch finance records");
        const financeJson = await financeRes.json();
        setFinanceData(financeJson);

        if (studentsRes.ok) {
          const studentsJson = await studentsRes.json();
          setStudents(studentsJson);
        }

        if (transRes.ok) {
          const transJson = await transRes.json();
          setTransactions(transJson);
        }

        if (deptRes.ok) {
          const deptJson = await deptRes.json();
          setDepartments(deptJson);
        }

      } catch (error) {
        console.error(error);
        toast({
          title: 'Connection Error',
          description: 'Could not load financial records. Ensure API is running.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [refreshKey, toast]);

  // 

  // --- Derived Calculations ---
  const summary = useMemo(() => {
    return {
      totalFees: financeData.reduce((sum, f) => sum + parseFloat(f.total_amount || '0'), 0),
      amountPaid: financeData.reduce((sum, f) => sum + parseFloat(f.amount_paid || '0'), 0),
      currentBalance: financeData.reduce((sum, f) => sum + parseFloat(f.amount_pending || '0'), 0),
      overdueCount: financeData.filter(f => parseFloat(f.amount_pending || '0') > 0).length,
    };
  }, [financeData]);

  // --- Handlers ---

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.amountPaid || !formData.paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Student, Amount, Method).",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        student_id: formData.studentId,
        amount_paid: formData.amountPaid,
        payment_method: formData.paymentMethod,
        reference: formData.reference,
        payment_date: formData.paymentDate,
        // Note: File upload logic usually requires FormData object and multipart/form-data header, 
        // adhering to current JSON requirement:
      };

      const res = await fetch('http://localhost:5000/api/finance/fees/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Payment submission failed at server.');

      toast({
        title: "Success",
        description: `Payment of ${formatCurrency(formData.amountPaid)} recorded successfully.`,
        variant: "default", 
        className: "bg-green-50 border-green-200"
      });

      // Reset form & Refresh Data
      setFormData(prev => ({ ...prev, amountPaid: '', reference: '', studentId: '' }));
      refreshData();

    } catch (err) {
      toast({
        title: "Transaction Failed",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadStatement = () => {
    if (!financeData.length) {
      toast({ title: "No Data", description: "No records to export.", variant: "destructive" });
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Fee Statement", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [["Student", "Total", "Paid", "Pending", "Status"]],
      body: financeData.map((f) => [
        formatName(f.student_name),
        parseFloat(f.total_amount).toLocaleString(),
        parseFloat(f.amount_paid).toLocaleString(),
        parseFloat(f.amount_pending).toLocaleString(),
        parseFloat(f.amount_pending) <= 0 ? "Paid" : "Pending",
      ]),
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save("Fee_Statement.pdf");
    toast({ title: "Downloaded", description: "Statement PDF saved to device." });
  };

  // --- Render Helpers ---
  const getStatusBadge = (pending: string | number) => {
    const isPaid = parseFloat(pending.toString()) <= 0;
    return isPaid 
      ? <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Paid</Badge>
      : <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Pending</Badge>;
  };

  if (loading && financeData.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center space-x-2">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-lg font-medium text-gray-600">Loading Financial Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Financial Management</h1>
          <p className="text-muted-foreground mt-1">Manage fees, track payments, and analyze revenue.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleDownloadStatement} className="bg-blue-600 hover:bg-blue-700">
            <Download className="mr-2 h-4 w-4" />
            Export Statement
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Fees Expected</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(summary.totalFees)}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Collected</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(summary.amountPaid)}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Outstanding Balance</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(summary.currentBalance)}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Students with Arrears</p>
              <p className="text-2xl font-bold text-orange-700 mt-1">{summary.overdueCount}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white p-1 border rounded-lg grid w-full max-w-4xl grid-cols-5 gap-4 h-auto">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Overview</TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">New Payment</TabsTrigger>
          <TabsTrigger value="statement" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Statements</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Transactions</TabsTrigger>
          <TabsTrigger value="summaries" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Departments</TabsTrigger>
        </TabsList>

        {/* 1. OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fee Collection Analytics</CardTitle>
              <CardDescription>Visual representation of fees collected vs pending</CardDescription>
            </CardHeader>
            <CardContent className="pl-0">
               {/* Ensure FinanceChart is robust to empty data */}
              <FinanceChart financeData={financeData} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. MAKE PAYMENT TAB */}
        <TabsContent value="payments">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600"/>
                    Record Fee Payment
                  </CardTitle>
                  <CardDescription>Enter details to process a student fee payment.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFeeSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label>Select Student <span className="text-red-500">*</span></Label>
                        <Select value={formData.studentId} onValueChange={(val) => handleInputChange("studentId", val)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Search student..." />
                          </SelectTrigger>
                          <SelectContent>
                            {students.map((s) => (
                              <SelectItem key={s.student_id} value={s.student_id}>
                                {s.name} ({s.student_id})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Amount (KES) <span className="text-red-500">*</span></Label>
                        <Input 
                          type="number" 
                          placeholder="e.g., 5000" 
                          value={formData.amountPaid}
                          onChange={(e) => handleInputChange("amountPaid", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Student Context Info */}
                    {formData.studentId && (() => {
                      const sel = students.find(s => s.student_id === formData.studentId);
                      if (!sel) return null;
                      return (
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-md flex justify-between items-center text-sm">
                          <span>Current Balance: <strong>{formatCurrency(sel.feesPending)}</strong></span>
                          <span className="text-gray-500">Total Fees: {formatCurrency(sel.totalFees)}</span>
                        </div>
                      );
                    })()}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div className="space-y-2">
                        <Label>Payment Method <span className="text-red-500">*</span></Label>
                        <Select value={formData.paymentMethod} onValueChange={(val) => handleInputChange("paymentMethod", val)}>
                          <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                            <SelectItem value="mobile-money">M-Pesa / Mobile Money</SelectItem>
                            <SelectItem value="credit-card">Credit Card</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Reference Code (Optional)</Label>
                        <Input 
                          placeholder="e.g., QDH45..." 
                          value={formData.reference}
                          onChange={(e) => handleInputChange("reference", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" /> Submit Payment
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Tips / Side Panel */}
            <div className="space-y-6">
              <Card className="bg-blue-50/50 border-blue-100">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">Payment Instructions</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-900 space-y-2">
                  <p>1. Ensure the correct student is selected.</p>
                  <p>2. For M-Pesa, input the transaction code in the Reference field.</p>
                  <p>3. Receipts are generated automatically upon submission.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 3. STATEMENTS TAB */}
        <TabsContent value="statement">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Fee Statements</CardTitle>
                <CardDescription>Comprehensive list of student financial records.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Total Fees</TableHead>
                      <TableHead>Amount Paid</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financeData.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell className="font-medium">{formatName(f.student_name)}</TableCell>
                        <TableCell>{formatCurrency(f.total_amount)}</TableCell>
                        <TableCell className="text-green-600">{formatCurrency(f.amount_paid)}</TableCell>
                        <TableCell className="text-red-600 font-semibold">{formatCurrency(f.amount_pending)}</TableCell>
                        <TableCell>{getStatusBadge(f.amount_pending)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. HISTORY TAB */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent payments received.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">No.</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions
                      .sort((a, b) => b.transaction_no - a.transaction_no)
                      .map((tx, i) => (
                      <TableRow key={tx.transaction_no}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell className="font-medium">{tx.student_name}</TableCell>
                        <TableCell>{formatCurrency(tx.amount)}</TableCell>
                        <TableCell className="capitalize">{tx.payment_method}</TableCell>
                        <TableCell className="font-mono text-xs">{tx.reference || '-'}</TableCell>
                        <TableCell className="text-right text-gray-500">
                          {new Date(tx.date).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {transactions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. SUMMARIES TAB */}
        <TabsContent value="summaries">
          <Card>
            <CardHeader>
              <CardTitle>Departmental Summary</CardTitle>
              <CardDescription>Revenue breakdown by academic department.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Total Expected</TableHead>
                    <TableHead>Collected</TableHead>
                    <TableHead>Pending</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{dept.department}</TableCell>
                      <TableCell>{formatCurrency(dept.total_amount)}</TableCell>
                      <TableCell className="text-green-600">{formatCurrency(dept.amount_paid)}</TableCell>
                      <TableCell className="text-red-600">{formatCurrency(dept.amount_pending)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default FinancePage;