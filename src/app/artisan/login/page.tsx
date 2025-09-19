
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArtistryHavensLogo } from '@/components/icons';
import { Phone, Shield } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function ArtisanLoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSendOtp = () => {
    if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Phone Number',
        description: 'Please enter a valid 10-digit mobile number.',
      });
      return;
    }
    // In a real app, you would send the OTP here.
    toast({
      title: 'OTP Sent',
      description: `An OTP has been sent to ${phoneNumber}.`,
    });
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 5) {
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: 'Please enter the 5-digit OTP.',
      });
      return;
    }
    if (!otpSent) {
      toast({
        variant: 'destructive',
        title: 'Send OTP First',
        description: 'Please request an OTP before trying to sign in.',
      });
      return;
    }
    // In a real app, you would verify the OTP here.
    // Simulating successful verification.
    toast({
      title: 'Login Successful',
      description: 'Welcome back!',
    });
    router.push('/artisan/category-selection');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <ArtistryHavensLogo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Artisan Portal</CardTitle>
          <CardDescription>
            Sign in to manage your craft and connect with your audience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="auth-number">Mobile Number</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                  <Input
                    id="auth-number"
                    type="text"
                    placeholder="10-digit mobile number"
                    className="pl-10"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    maxLength={10}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Phone className="h-5 w-5" />
                  </div>
              </div>
              <Button variant="outline" onClick={handleSendOtp} disabled={otpSent}>
                {otpSent ? 'Sent' : 'Send OTP'}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
              <Label htmlFor="otp">One-Time Password</Label>
              <div className="relative">
              <Input 
                  id="otp" 
                  type="text" 
                  placeholder="Enter the 5-digit OTP" 
                  className="pl-10 text-center tracking-[0.5em]"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={5}
                  disabled={!otpSent}
              />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Shield className="h-5 w-5" />
              </div>
              </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleVerifyOtp} disabled={!otpSent}>
            Sign In
          </Button>
          <p className="text-xs text-muted-foreground">
            New to Artistry Havens?{' '}
            <Link href="#" className="font-medium text-primary underline-offset-4 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
