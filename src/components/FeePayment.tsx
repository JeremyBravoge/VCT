
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  DollarSign, 
  Receipt, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Download,
  Smartphone,
  Building2,
  Wallet
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeePaymentPageProps {
  onBack: () => void;
  studentData?: any;
}

export const FeePaymentPage: React.FC<FeePaymentPageProps> = ({ onBack, studentData }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1);
  const { toast } = useToast();

  // Mock fee data
  const feeData = {
    student: {
      name: "Mary Wanjiku",
      admissionNumber: "STD2024001",
      class: "Grade 7A",
      term: "Term 2, 2025"
    },
    fees: {
      tuition: 25000,
      activities: 2000,
      materials: 1000,
      total: 28000,
      paid: 20000,
      balance: 8000,
      dueDate: "2025-02-15"
    },
    paymentHistory: [
      { date: "2025-01-15", amount: 10000, method: "M-Pesa", receipt: "MPT001", status: "completed" },
      { date: "2025-01-05", amount: 10000, method: "Bank Transfer", receipt: "BNK001", status: "completed" }
    ]
  };

  const paymentMethods = [
    { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, description: 'Pay via M-Pesa mobile money' },
    { id: 'bank', name: 'Bank Transfer', icon: Building2, description: 'Direct bank transfer' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Pay with your card' },
    { id: 'cash', name: 'Cash Payment', icon: Wallet, description: 'Pay at school office' }
  ];

  const handlePayment = async () => {
    if (!paymentMethod || !paymentAmount) {
      toast({
        title: "Payment Error",
        description: "Please select payment method and enter amount",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep(3);
      toast({
        title: "Payment Successful",
        description: `KSh ${paymentAmount} has been paid successfully`,
      });
    }, 3000);
    
    setPaymentStep(2);
  };

  if (paymentStep === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h2>
            <p className="text-gray-600 mb-4">Please wait while we process your payment...</p>
            <p className="text-sm text-gray-500">This may take a few moments</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStep === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your payment of KSh {paymentAmount} has been processed successfully.</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Receipt Number</p>
              <p className="font-mono font-bold">PAY{Date.now()}</p>
            </div>
            <div className="space-y-3">
              <Button className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Button onClick={onBack} className="w-full">
                Back to Portal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button onClick={onBack} variant="ghost">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Fee Payment</h1>
                <p className="text-gray-600">Pay your school fees online</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Student Info & Fee Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Student Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Receipt className="w-5 h-5" />
                  <span>Student Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name</span>
                    <span className="font-medium">{feeData.student.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admission No.</span>
                    <span className="font-medium">{feeData.student.admissionNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Class</span>
                    <span className="font-medium">{feeData.student.class}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Term</span>
                    <span className="font-medium">{feeData.student.term}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fee Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Fee Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tuition Fee</span>
                    <span>KSh {feeData.fees.tuition.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Activities</span>
                    <span>KSh {feeData.fees.activities.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Materials</span>
                    <span>KSh {feeData.fees.materials.toLocaleString()}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Total Fee</span>
                    <span>KSh {feeData.fees.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Amount Paid</span>
                    <span>KSh {feeData.fees.paid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-600 font-semibold">
                    <span>Outstanding Balance</span>
                    <span>KSh {feeData.fees.balance.toLocaleString()}</span>
                  </div>
                </div>
                <Progress 
                  value={(feeData.fees.paid / feeData.fees.total) * 100} 
                  className="h-3" 
                />
                <p className="text-sm text-gray-600 mt-2">
                  {Math.round((feeData.fees.paid / feeData.fees.total) * 100)}% paid
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Make Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Payment Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Payment Amount (KSh)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount to pay"
                    max={feeData.fees.balance}
                    min="100"
                  />
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPaymentAmount(feeData.fees.balance.toString())}
                    >
                      Pay Full Balance
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPaymentAmount((feeData.fees.balance / 2).toString())}
                    >
                      Pay Half
                    </Button>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <method.icon className="w-6 h-6 text-blue-600" />
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Form Based on Method */}
                {paymentMethod === 'mpesa' && (
                  <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-800">M-Pesa Payment Details</h3>
                    <div className="space-y-2">
                      <Label htmlFor="mpesaPhone">M-Pesa Phone Number</Label>
                      <Input
                        id="mpesaPhone"
                        type="tel"
                        placeholder="254700000000"
                      />
                    </div>
                    <div className="text-sm text-green-700">
                      <p>• You will receive an M-Pesa prompt on your phone</p>
                      <p>• Enter your M-Pesa PIN to complete payment</p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800">Card Payment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          type="text"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Expiry Date</Label>
                        <Input
                          id="cardExpiry"
                          type="text"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardCvv">CVV</Label>
                        <Input
                          id="cardCvv"
                          type="text"
                          placeholder="123"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          type="text"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-medium text-purple-800">Bank Transfer Details</h3>
                    <div className="text-sm text-purple-700 space-y-2">
                      <p><strong>Bank:</strong> KCB Bank Kenya</p>
                      <p><strong>A/C Name:</strong> Centre of Hope and Transformation</p>
                      <p><strong>A/C Number:</strong> 1234567890</p>
                      <p><strong>Reference:</strong> {feeData.student.admissionNumber}</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded border border-yellow-300">
                      <p className="text-sm text-yellow-800">
                        <AlertCircle className="w-4 h-4 inline mr-1" />
                        Please use your admission number as the reference
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'cash' && (
                  <div className="space-y-4 p-4 bg-orange-50 rounded-lg">
                    <h3 className="font-medium text-orange-800">Cash Payment</h3>
                    <div className="text-sm text-orange-700 space-y-2">
                      <p>• Visit the school accounts office</p>
                      <p>• Office hours: 8:00 AM - 4:00 PM (Mon-Fri)</p>
                      <p>• Bring this payment reference with you</p>
                    </div>
                  </div>
                )}

                {/* Payment Button */}
                <Button 
                  onClick={handlePayment}
                  disabled={!paymentMethod || !paymentAmount || isProcessing}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    `Pay KSh ${paymentAmount || '0'}`
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {feeData.paymentHistory.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">KSh {payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{payment.date} • {payment.method}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">
                        {payment.status}
                      </Badge>
                      <span className="text-sm text-gray-600">{payment.receipt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
