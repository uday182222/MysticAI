import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Check, Clock, MessageCircle, Zap } from "lucide-react";

interface PaymentTier {
  id: string;
  name: string;
  credits: number;
  minutes: number;
  price: number;
  popular?: boolean;
  description: string;
  features: string[];
}

const paymentTiers: PaymentTier[] = [
  {
    id: "tier1",
    name: "Starter",
    credits: 5,
    minutes: 5,
    price: 1,
    description: "Perfect for quick questions",
    features: [
      "5 minutes of AI chat",
      "5 chat credits",
      "Mystical guidance",
      "24/7 availability"
    ]
  },
  {
    id: "tier2",
    name: "Explorer",
    credits: 10,
    minutes: 10,
    price: 2.5,
    popular: true,
    description: "Great for deeper insights",
    features: [
      "10 minutes of AI chat",
      "10 chat credits",
      "Extended conversations",
      "Detailed guidance",
      "Priority support"
    ]
  },
  {
    id: "tier3",
    name: "Mystic",
    credits: 15,
    minutes: 15,
    price: 5,
    description: "Comprehensive spiritual guidance",
    features: [
      "15 minutes of AI chat",
      "15 chat credits",
      "Unlimited questions",
      "Deep spiritual insights",
      "Premium features",
      "Expert guidance"
    ]
  }
];

interface RazorpayPaymentProps {
  onPaymentSuccess: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function RazorpayPayment({ onPaymentSuccess }: RazorpayPaymentProps) {
  const [selectedTier, setSelectedTier] = useState<PaymentTier | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: async (tier: PaymentTier) => {
      const response = await apiRequest("POST", "/api/payments/create-order", {
        amount: tier.price,
        creditsRequested: tier.credits,
        paymentTier: tier.id,
        minutesGranted: tier.minutes
      });
      return response.json();
    }
  });

  const handlePurchase = async (tier: PaymentTier) => {
    if (!window.Razorpay) {
      toast({
        title: "Payment Error",
        description: "Payment system is not loaded. Please refresh and try again.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setSelectedTier(tier);

    try {
      const orderData = await createOrderMutation.mutateAsync(tier);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount * 100, // Amount in paise
        currency: "USD",
        name: "MysticRead AI",
        description: `${tier.name} Plan - ${tier.minutes} minutes AI chat`,
        order_id: orderData.orderId,
        theme: {
          color: "#8B5CF6"
        },
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            await apiRequest("POST", "/api/payments/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: orderData.paymentId
            });

            toast({
              title: "Payment Successful!",
              description: `You've received ${tier.credits} AI chat credits (${tier.minutes} minutes)`,
            });

            // Invalidate user data to refresh credit balance
            queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
            onPaymentSuccess();
          } catch (error) {
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if your payment was deducted.",
              variant: "destructive"
            });
          }
        },
        prefill: {
          email: "user@example.com" // Will be filled from user data
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Unable to create payment order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setSelectedTier(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your AI Chat Plan</h2>
        <p className="text-muted-foreground">
          Get instant access to our AI mystical assistant for personalized guidance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paymentTiers.map((tier) => (
          <Card 
            key={tier.id} 
            className={`relative transition-all hover:scale-105 ${
              tier.popular 
                ? 'border-accent shadow-lg ring-2 ring-accent ring-opacity-20' 
                : 'border-border'
            }`}
          >
            {tier.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold text-foreground">${tier.price}</span>
                <span className="text-muted-foreground"> USD</span>
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
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handlePurchase(tier)}
                disabled={isProcessing}
                className={`w-full ${
                  tier.popular 
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
    </div>
  );
}