import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Check, Clock, MessageCircle, Zap, Loader2, CheckCircle, CreditCard } from "lucide-react";

interface PaymentTier {
  id: string;
  name: string;
  amount: number; // in INR
  credits: number;
  minutes: number;
  description: string;
}

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Load Razorpay script
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface RazorpayPaymentProps {
  onPaymentSuccess: () => void;
}

export function RazorpayPayment({ onPaymentSuccess }: RazorpayPaymentProps) {
  const [selectedTier, setSelectedTier] = useState<PaymentTier | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'processing' | 'success' | 'error'>('processing');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch payment tiers from API
  const { data: paymentTiers = [], isLoading: tiersLoading } = useQuery({
    queryKey: ["/api/payments/tiers"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/payments/tiers");
      return response.json();
    }
  });

  const createOrderMutation = useMutation({
    mutationFn: async (tier: PaymentTier) => {
      const response = await apiRequest("POST", "/api/payments/create-order", {
        paymentTier: tier.id
      });
      return response.json();
    }
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: async (paymentData: { 
      paymentId: string; 
      tier: PaymentTier;
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) => {
      const response = await apiRequest("POST", "/api/payments/verify", {
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_signature: paymentData.razorpay_signature,
        paymentId: paymentData.paymentId
      });
      return { response: await response.json(), tier: paymentData.tier };
    }
  });

  const handlePurchase = async (tier: PaymentTier) => {
    setIsProcessing(true);
    setSelectedTier(tier);
    setShowPaymentModal(true);
    setPaymentStep('processing');

    try {
      // Step 1: Load Razorpay script
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        throw new Error('Failed to load Razorpay');
      }

      // Step 2: Create order
      const orderData = await createOrderMutation.mutateAsync(tier);

      // Step 3: Open Razorpay checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount * 100, // Convert to paise
        currency: orderData.currency,
        name: 'MysticAI',
        description: `${tier.name} Plan - ${tier.credits} Credits`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Step 4: Verify payment
            await verifyPaymentMutation.mutateAsync({
              paymentId: orderData.paymentId,
              tier,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            // Step 5: Show success
            setPaymentStep('success');

            // Step 6: Update UI after a short delay
            setTimeout(() => {
              toast({
                title: "Payment Successful! 🎉",
                description: `You've received ${tier.credits} AI chat credits (${tier.minutes} minutes)`,
              });

              // Invalidate user data to refresh credit balance
              queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
              setShowPaymentModal(false);
              onPaymentSuccess();
              
              // Reset states
              setIsProcessing(false);
              setSelectedTier(null);
              setPaymentStep('processing');
            }, 1500);

          } catch (error) {
            setPaymentStep('error');
            setTimeout(() => {
              toast({
                title: "Payment Verification Failed",
                description: "Unable to verify payment. Please contact support.",
                variant: "destructive"
              });
              setShowPaymentModal(false);
              setIsProcessing(false);
              setSelectedTier(null);
              setPaymentStep('processing');
            }, 2000);
          }
        },
        prefill: {
          name: 'MysticAI User',
          email: 'user@mysticai.com',
        },
        theme: {
          color: '#6366f1'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            setShowPaymentModal(false);
            setSelectedTier(null);
            setPaymentStep('processing');
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (error) {
      setPaymentStep('error');
      setTimeout(() => {
        toast({
          title: "Payment Failed",
          description: "Unable to process payment. Please try again.",
          variant: "destructive"
        });
        setShowPaymentModal(false);
        setIsProcessing(false);
        setSelectedTier(null);
        setPaymentStep('processing');
      }, 2000);
    }
  };

  if (tiersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading payment plans...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your AI Chat Plan</h2>
        <p className="text-muted-foreground">
          Get instant access to our AI mystical assistant for personalized guidance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paymentTiers.map((tier: PaymentTier, index: number) => (
          <Card 
            key={tier.id} 
            className={`relative transition-all hover:scale-105 ${
              index === 1 // Make middle tier popular
                ? 'border-accent shadow-lg ring-2 ring-accent ring-opacity-20' 
                : 'border-border'
            }`}
          >
            {index === 1 && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold text-foreground">₹{tier.amount}</span>
                <span className="text-muted-foreground"> INR</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {tier.credits} credits
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {tier.minutes} minutes
                </div>
              </div>

              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                  {tier.credits} AI chat credits
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                  {tier.minutes} minutes of chat time
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                  Mystical guidance
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                  24/7 availability
                </li>
                {index === 1 && (
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                    Priority support
                  </li>
                )}
                {index === 2 && (
                  <>
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                      Priority support
                    </li>
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                      Premium features
                    </li>
                  </>
                )}
              </ul>

              <Button
                onClick={() => handlePurchase(tier)}
                disabled={isProcessing}
                className={`w-full ${
                  index === 1 
                    ? 'bg-accent hover:bg-accent/90' 
                    : 'bg-secondary hover:bg-secondary/90'
                }`}
                data-testid={`button-purchase-${tier.id}`}
              >
                {isProcessing && selectedTier?.id === tier.id ? (
                  <>
                    <Zap className="mr-2 h-4 w-4 animate-pulse" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Get {tier.name} Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>💳 Secure payment powered by Razorpay</p>
        <p>✨ Credits are valid for 30 days from purchase</p>
      </div>

      {/* Mock Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md"  onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {paymentStep === 'processing' && "Processing Payment"}
              {paymentStep === 'success' && "Payment Successful!"}
              {paymentStep === 'error' && "Payment Failed"}
            </DialogTitle>
            <DialogDescription>
              {paymentStep === 'processing' && `Processing your ${selectedTier?.name} plan purchase...`}
              {paymentStep === 'success' && `Your ${selectedTier?.name} plan has been activated!`}
              {paymentStep === 'error' && "There was an issue processing your payment."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-6">
            {paymentStep === 'processing' && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-accent" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Please wait...</p>
                  <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-foreground">Payment Complete!</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTier?.credits} credits added to your account
                  </p>
                </div>
              </div>
            )}

            {paymentStep === 'error' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <Zap className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-foreground">Payment Failed</p>
                  <p className="text-sm text-muted-foreground">
                    Please try again or contact support
                  </p>
                </div>
              </div>
            )}
          </div>

          {selectedTier && (
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-medium">{selectedTier.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Credits:</span>
                <span className="font-medium">{selectedTier.credits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">₹{selectedTier.amount} INR</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}