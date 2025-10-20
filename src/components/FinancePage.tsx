import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FinanceChart from "@/components/FinanceChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  DollarSign,
  CreditCard,
  Download,
  FileText,
  Plus,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Receipt
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FinanceRecord {
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

const FinancePage: React.FC = () => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [financeData, setFinanceData] = useState<FinanceRecord[]>([]);
  const { toast } = useToast();

  // Mock fee structure
  const feeStructure = [
    { item: 'Tuition Fee', amount: 2500, semester: 'Spring 2024', status: 'due' },
    { item: 'Library Fee', amount: 50, semester: 'Spring 2024', status: 'paid' },
    { item: 'Lab Fee', amount: 100, semester: 'Spring 2024', status: 'overdue' },
    { item: 'Student Activity Fee', amount: 75, semester: 'Spring 2024', status: 'paid' },
    { item: 'Technology Fee', amount: 150, semester: 'Spring 2024', status: 'overdue' }
  ];

  // Fetch finance data from API
  useEffect(() => {
    fetch('http://localhost:5000/api/finance')
      .then(res => res.json())
      .then(data => setFinanceData(data))
      .catch(err => {
        console.error(err);
        toast({
          title: 'Error fetching finance data',
          description: 'Could not load financial records',
          variant: 'destructive'
        });
      });
  }, [toast]);

  // Summary calculationss
const summary = {
  totalFees: financeData.reduce((sum, f) => sum + parseFloat(f.total_amount || '0'), 0),
  amountPaid: financeData.reduce((sum, f) => sum + parseFloat(f.amount_paid || '0'), 0),
  currentBalance: financeData.reduce((sum, f) => sum + parseFloat(f.amount_pending || '0'), 0),
  overdueCount: financeData.filter(f => parseFloat(f.amount_pending || '0') > 0).length,
  overdueAmount: financeData.reduce((sum, f) => sum + parseFloat(f.amount_pending || '0'), 0),
};
const [formData, setFormData] = useState({
  studentId: '',
  amountPaid: '',
  paymentMethod: '',
  reference: '',
});
const [students, setStudents] = useState<any[]>([]);

useEffect(() => {
  fetch('http://localhost:5000/api/students')
    .then(res => res.json())
    .then(data => {
      console.log("Students fetched:", data);
      setStudents(data);
    })
    .catch(err => console.error(err));
}, []);

const handleFeeSubmit = async () => {
  if (!formData.studentId || !formData.amountPaid || !formData.paymentMethod) {
    toast({
      title: "Missing Information",
      description: "Please fill in all required fields.",
      variant: "destructive",
    });
    return;
  }

  try {
const res = await fetch('http://localhost:5000/api/finance/fees/pay', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    student_id: formData.studentId,
    amount_paid: formData.amountPaid,
    payment_method: formData.paymentMethod,
    reference: formData.reference,
  }),
});


    if (!res.ok) throw new Error('Payment submission failed');

    toast({
      title: "Payment Submitted",
      description: "Fee payment has been successfully recorded.",
    });

    // Reset form
    setFormData({ studentId: '', amountPaid: '', paymentMethod: '', reference: '' });
  } catch (err) {
    toast({
      title: "Error",
      description: (err as Error).message,
      variant: "destructive",
    });
  }
};

interface Transaction {
  transaction_no: number;
  student_name: string;
  amount: number;
  payment_method: string;
  reference: string;
  date: string;
}

const [transactions, setTransactions] = useState<Transaction[]>([]);

useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/transactions"); // adjust URL
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  fetchTransactions();
}, []);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/finance/fees-summary")
        const data = await res.json()
        setDepartments(data)
      } catch (error) {
        console.error("Error fetching fees summary:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])
 

  const handlePayment = () => {
    if (!paymentAmount || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please enter payment amount and select payment method.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Payment Initiated",
      description: `Payment of Ksh ${paymentAmount} has been initiated via ${paymentMethod}.`,
    });
    setPaymentAmount('');
    setPaymentMethod('');
  };

function formatName(name: string) {
  if (!name) return "";
  return name
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}


const handleDownloadStatement = () => {
  if (!financeData.length) {
    toast({
      title: "No Data",
      description: "No financial records available to download.",
      variant: "destructive",
    });
    return;
  }

  // Create a new PDF
  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.text("Fee Statement", 14, 20);

  // Add a table
  autoTable(doc, {
   startY: 30,
  head: [["No.", "Student", "Total Amount", "Amount Payed", "Pending", "Status"]],
  body: financeData.map((f, index) => [
    index + 1,
        formatName(f.student_name),
  // ✅ correct field
      `Ksh ${parseFloat(f.total_amount).toLocaleString()}`,
      `Ksh ${parseFloat(f.amount_paid).toLocaleString()}`,
      `Ksh ${parseFloat(f.amount_pending).toLocaleString()}`,
      f.is_paid ? "Paid" : "Pending",
    ]),
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 14, pageHeight - 10);

  // Save the PDF
  doc.save("Fee_Statement.pdf");

  toast({
    title: "Download Complete",
    description: "Your fee statement has been downloaded.",
  });
};

  const handleInputChange = (field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'due': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-3 w-3" />;
      case 'due': 
      case 'overdue': return <AlertCircle className="h-3 w-3" />;
      default: return null;
    }
  };
  
    const [departments, setDepartments] = useState([
      { department: 'Computer Science', total_amount: '10000', amount_paid: '6000', amount_pending: '4000' },
      { department: 'Electrical Engineering', total_amount: '12000', amount_paid: '8000', amount_pending: '4000' },
    ]);
    return (
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Management</h1>
          <p className="text-muted-foreground">Manage your fees, payments, and financial records</p>
        </div>
        <Button onClick={handleDownloadStatement} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Statement
        </Button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Fees</p>
                <p className="text-2xl font-bold">Ksh {summary.totalFees.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-50 text-blue-600"><FileText className="h-6 w-6" /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-red-600"> Ksh {summary.currentBalance.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-full bg-red-50 text-red-600"><DollarSign className="h-6 w-6" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Amount Payed</p>
        <p className="text-2xl font-bold text-red-600">
          Ksh {summary.amountPaid.toLocaleString()}
        </p>
      </div>
      <div className="p-2 rounded-full bg-red-50 text-red-600">
        <DollarSign className="h-6 w-6" />
      </div>
    </div>
  </CardContent>
</Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue Amount</p>
                <p className="text-2xl font-bold text-red-600">{summary.overdueCount}</p>
              </div>
              <div className="p-2 rounded-full bg-red-50 text-red-600"><DollarSign className="h-6 w-6" /></div>
            </div>
          </CardContent>
        </Card>
        
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Fee Overview</TabsTrigger>
          <TabsTrigger value="summaries">Departmental Summary</TabsTrigger>
          <TabsTrigger value="payments">Make Payment</TabsTrigger>
          <TabsTrigger value="statement">Fee Statement</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="summaries" className="space-y-6">
                <Card>
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <TrendingUp className="h-5 w-5" />
         <span>Departmental Fees Summary</span>
      </CardTitle>
      <CardDescription>
        Breakdown of fees collected and pending per department
      </CardDescription>
    </CardHeader>

    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Department</th>
              <th className="p-2 text-left">Total Expected</th>
              <th className="p-2 text-left">Collected</th>
              <th className="p-2 text-left">Pending</th>
            </tr>
          </thead>
            <tbody>
              {departments.map((dept, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
              <td className="p-2">{dept.department}</td>
              <td className="p-2">Ksh {parseFloat(dept.total_amount).toLocaleString()}</td>
              <td className="p-2 text-green-600">Ksh {parseFloat(dept.amount_paid).toLocaleString()}</td>
             <td className="p-2 text-red-600">Ksh {Math.max(0, parseFloat(dept.amount_pending)).toLocaleString()}
              </td>
              </tr>
                ))}
            </tbody>
        </table>
      </div>
    </CardContent>
  </Card>

        </TabsContent>

            <TabsContent value="history" className="space-y-6">
    <Card>
  <CardHeader>
    <CardTitle className="flex items-center space-x-2">
      <FileText className="h-5 w-5" />
      <span>Transactions</span>
    </CardTitle>
    <CardDescription>
      A record of all student payments
    </CardDescription>
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
    {transactions
      .sort((a, b) => a.transaction_no - b.transaction_no) // ensure ascending order
      .map((tx, index) => (
        <tr key={tx.transaction_no}>
          <td className="px-4 py-2">{index + 1}</td> {/* numbering 1, 2, 3 */}
          <td className="px-4 py-2">{tx.student_name}</td>
          <td className="px-4 py-2">
            {parseFloat(tx.amount).toString()}
          </td>
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

            </TabsContent>

    <TabsContent value="overview" className="space-y-6">
  <h2 className="text-2xl font-bold mb-4">Fee Overview</h2>
  <FinanceChart financeData={financeData} />
</TabsContent>
    <TabsContent value="history">
        

    </TabsContent>
    <TabsContent value="payments">
  <div className="max-w-4xl mx-auto space-y-6">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-2">Fee Payment</h1>
      <p className="text-muted-foreground">Process student fees quickly and securely</p>
    </div>

    {/* Form Card */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Payment Details</span>
        </CardTitle>
        <CardDescription>Fill in the fee payment information</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Student Selection */}
          <div className="space-y-2">
            <Label htmlFor="student">Select Student *</Label>
            <Select
              value={formData.studentId}
              onValueChange={(value) => handleInputChange('studentId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {students.map((student) => (
                  <SelectItem key={student.student_id} value={student.student_id}>
                    {student.name} ({student.student_id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Paid */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount Paid *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount paid"
              value={formData.amountPaid}
              onChange={(e) => handleInputChange('amountPaid', e.target.value)}
            />
          </div>
        </div>

        {/* Display selected student's fee info */}
        {formData.studentId && (() => {
          const selectedStudent = students.find(s => s.student_id === formData.studentId);
          if (!selectedStudent) return null;
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <p className="font-medium">Course Fee: <span className="font-bold">{selectedStudent.totalFees}</span></p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">Balance: <span className="font-bold">{selectedStudent.feesPending}</span></p>
              </div>
            </div>
          );
        })()}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Payment Method */}
          <div className="space-y-2">
  <Label htmlFor="paymentMethod">Payment Method *</Label>
  <Select
    value={formData.paymentMethod}
    onValueChange={(value) => handleInputChange("paymentMethod", value)}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select payment method" />
    </SelectTrigger>
    <SelectContent className="bg-white">
      <SelectItem value="cash">Cash</SelectItem>
      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
      <SelectItem value="mobile-money">Mobile Money</SelectItem>
      <SelectItem value="credit-card">Credit Card</SelectItem>
    </SelectContent>
  </Select>
</div>


          {/* Reference */}
          <div className="space-y-2">
            <Label htmlFor="reference">Payment Reference</Label>
            <Input
              id="reference"
              placeholder="Transaction reference (optional)"
              value={formData.reference}
              onChange={(e) => handleInputChange('reference', e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={handleFeeSubmit} className="gradient-primary text-white">
            <CheckCircle className="mr-2 h-4 w-4" />
            Submit Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</TabsContent>



        {/* Fee Statement Tab (API Data) */}
<TabsContent value="statement" className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <FileText className="h-5 w-5" />
        Fee Statement
      </CardTitle>
      <CardDescription>
        Detailed breakdown of all financial transactions in Ksh
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">No.</th>
              <th className="p-2 text-left">Student</th>
              <th className="p-2 text-left">Total Amount</th>
              <th className="p-2 text-left">Amount Paid</th>
              <th className="p-2 text-left">Amount Pending</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
           {financeData.map((f, index) => (
              <tr key={f.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{index + 1}</td> {/* Serial number starts from 1 */}
                <td className="p-2">{f.student_name}</td>
                <td className="p-2">Ksh {parseFloat(f.total_amount).toLocaleString()}</td>
                <td className="p-2">Ksh {parseFloat(f.amount_paid).toLocaleString()}</td>
                <td className="p-2">Ksh {parseFloat(f.amount_pending).toLocaleString()}</td>
                <td className="p-2">{f.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</TabsContent>

      </Tabs>
    </div>
  );
};

export default FinancePage;
