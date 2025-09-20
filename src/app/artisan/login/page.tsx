'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArtistryHavensLogo } from '@/components/icons';
import { Phone, Shield } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { translateText } from '@/ai/flows/translate-text';

type TranslatedContent = {
    title: string;
    description: string;
    mobileLabel: string;
    mobilePlaceholder: string;
    sendOtpButton: string;
    otpSentButton: string;
    otpLabel: string;
    otpPlaceholder: string;
    signInButton: string;
    signUpPrompt: string;
    signUpLink: string;
};

function ArtisanLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  const { toast } = useToast();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [translatedContent, setTranslatedContent] = useState<TranslatedContent | null>(null);

  useEffect(() => {
    const translateContent = async () => {
      if (lang === 'en') {
        setTranslatedContent({
            title: "Artisan Portal",
            description: "Sign in to manage your craft and connect with your audience.",
            mobileLabel: "Mobile Number",
            mobilePlaceholder: "10-digit mobile number",
            sendOtpButton: "Send OTP",
            otpSentButton: "Sent",
            otpLabel: "One-Time Password",
            otpPlaceholder: "Enter the 5-digit OTP",
            signInButton: "Sign In",
            signUpPrompt: "New to Artistry Havens?",
            signUpLink: "Sign Up"
        });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const [
          title,
          description,
          mobileLabel,
          mobilePlaceholder,
          sendOtpButton,
          otpLabel,
          otpPlaceholder,
          signInButton,
          signUpPrompt,
          signUpLink,
        ] = await Promise.all([
          translateText({ text: "Artisan Portal", targetLanguage: lang }),
          translateText({ text: "Sign in to manage your craft and connect with your audience.", targetLanguage: lang }),
          translateText({ text: "Mobile Number", targetLanguage: lang }),
          translateText({ text: "10-digit mobile number", targetLanguage: lang }),
          translateText({ text: "Send OTP", targetLanguage: lang }),
          translateText({ text: "One-Time Password", targetLanguage: lang }),
          translateText({ text: "Enter the 5-digit OTP", targetLanguage: lang }),
          translateText({ text: "Sign In", targetLanguage: lang }),
          translateText({ text: "New to Artistry Havens?", targetLanguage: lang }),
          translateText({ text: "Sign Up", targetLanguage: lang }),
        ]);

        const otpSentButton = await translateText({ text: "Sent", targetLanguage: lang });

        setTranslatedContent({
          title: title.translatedText,
          description: description.translatedText,
          mobileLabel: mobileLabel.translatedText,
          mobilePlaceholder: mobilePlaceholder.translatedText,
          sendOtpButton: sendOtpButton.translatedText,
          otpSentButton: otpSentButton.translatedText,
          otpLabel: otpLabel.translatedText,
          otpPlaceholder: otpPlaceholder.translatedText,
          signInButton: signInButton.translatedText,
          signUpPrompt: signUpPrompt.translatedText,
          signUpLink: signUpLink.translatedText,
        });
      } catch (error) {
        console.error("Translation failed", error);
        toast({
          variant: "destructive",
          title: "Translation Error",
          description: "Could not translate the page. Falling back to English.",
        });
         setTranslatedContent({
            title: "Artisan Portal",
            description: "Sign in to manage your craft and connect with your audience.",
            mobileLabel: "Mobile Number",
            mobilePlaceholder: "10-digit mobile number",
            sendOtpButton: "Send OTP",
            otpSentButton: "Sent",
            otpLabel: "One-Time Password",
            otpPlaceholder: "Enter the 5-digit OTP",
            signInButton: "Sign In",
            signUpPrompt: "New to Artistry Havens?",
            signUpLink: "Sign Up"
        });
      } finally {
        setIsLoading(false);
      }
    };

    translateContent();
  }, [lang, toast]);

  const handleSendOtp = () => {
    if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Phone Number',
        description: 'Please enter a valid 10-digit mobile number.',
      });
      return;
    }
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
    toast({
      title: 'Login Successful',
      description: 'Welcome back!',
    });
    router.push(`/artisan/category-selection?lang=${lang}`);
  };

  if (isLoading || !translatedContent) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <ArtistryHavensLogo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">{translatedContent.title}</CardTitle>
          <CardDescription>
            {translatedContent.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="auth-number">{translatedContent.mobileLabel}</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                  <Input
                    id="auth-number"
                    type="text"
                    placeholder={translatedContent.mobilePlaceholder}
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
                {otpSent ? translatedContent.otpSentButton : translatedContent.sendOtpButton}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
              <Label htmlFor="otp">{translatedContent.otpLabel}</Label>
              <div className="relative">
              <Input 
                  id="otp" 
                  type="text" 
                  placeholder={translatedContent.otpPlaceholder}
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
            {translatedContent.signInButton}
          </Button>
          <p className="text-xs text-muted-foreground">
            {translatedContent.signUpPrompt}{' '}
            <Link href={`#?lang=${lang}`} className="font-medium text-primary underline-offset-4 hover:underline">
              {translatedContent.signUpLink}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function ArtisanLoginPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <ArtisanLogin />
        </Suspense>
    )
}
