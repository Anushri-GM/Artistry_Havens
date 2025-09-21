
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
    toasts: {
        invalidPhoneTitle: string;
        invalidPhoneDesc: string;
        otpSentTitle: string;
        otpSentDesc: (phone: string) => string;
        invalidOtpTitle: string;
        invalidOtpDesc: string;
        sendOtpFirstTitle: string;
        sendOtpFirstDesc: string;
        loginSuccessTitle: string;
        loginSuccessDesc: string;
        translationErrorTitle: string;
        translationErrorDesc: string;
    }
};

function SponsorLogin() {
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
    const originalContent = {
        title: "Sponsor Portal",
        description: "Sign in to empower artisans and track your impact.",
        mobileLabel: "Mobile Number",
        mobilePlaceholder: "10-digit mobile number",
        sendOtpButton: "Send OTP",
        otpSentButton: "Sent",
        otpLabel: "One-Time Password",
        otpPlaceholder: "Enter the 5-digit OTP",
        signInButton: "Sign In",
        signUpPrompt: "New to Artistry Havens?",
        signUpLink: "Sign Up",
        toasts: {
            invalidPhoneTitle: 'Invalid Phone Number',
            invalidPhoneDesc: 'Please enter a valid 10-digit mobile number.',
            otpSentTitle: 'OTP Sent',
            otpSentDesc: (phone: string) => `An OTP has been sent to ${phone}.`,
            invalidOtpTitle: 'Invalid OTP',
            invalidOtpDesc: 'Please enter the 5-digit OTP.',
            sendOtpFirstTitle: 'Send OTP First',
            sendOtpFirstDesc: 'Please request an OTP before trying to sign in.',
            loginSuccessTitle: 'Login Successful',
            loginSuccessDesc: 'Welcome, Sponsor!',
            translationErrorTitle: "Translation Error",
            translationErrorDesc: "Could not translate the page. Falling back to English."
        }
    };

    const translateContent = async () => {
      if (lang === 'en') {
        setTranslatedContent(originalContent);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const textsToTranslate = [
            originalContent.title,
            originalContent.description,
            originalContent.mobileLabel,
            originalContent.mobilePlaceholder,
            originalContent.sendOtpButton,
            originalContent.otpSentButton,
            originalContent.otpLabel,
            originalContent.otpPlaceholder,
            originalContent.signInButton,
            originalContent.signUpPrompt,
            originalContent.signUpLink,
            ...Object.values(originalContent.toasts).filter(t => typeof t === 'string')
        ];

        const translationPromises = textsToTranslate.map(text => translateText({ text, targetLanguage: lang }));
        const translations = await Promise.all(translationPromises);
        
        let i = 0;
        const newTranslatedContent: TranslatedContent = {
            title: translations[i++].translatedText,
            description: translations[i++].translatedText,
            mobileLabel: translations[i++].translatedText,
            mobilePlaceholder: translations[i++].translatedText,
            sendOtpButton: translations[i++].translatedText,
            otpSentButton: translations[i++].translatedText,
            otpLabel: translations[i++].translatedText,
            otpPlaceholder: translations[i++].translatedText,
            signInButton: translations[i++].translatedText,
            signUpPrompt: translations[i++].translatedText,
            signUpLink: translations[i++].translatedText,
            toasts: {
                invalidPhoneTitle: translations[i++].translatedText,
                invalidPhoneDesc: translations[i++].translatedText,
                otpSentTitle: translations[i++].translatedText,
                otpSentDesc: (phone: string) => `${translations[i++].translatedText} ${phone}.`,
                invalidOtpTitle: translations[i++].translatedText,
                invalidOtpDesc: translations[i++].translatedText,
                sendOtpFirstTitle: translations[i++].translatedText,
                sendOtpFirstDesc: translations[i++].translatedText,
                loginSuccessTitle: translations[i++].translatedText,
                loginSuccessDesc: translations[i++].translatedText,
                translationErrorTitle: translations[i++].translatedText,
                translationErrorDesc: translations[i++].translatedText,
            }
        };

        // Special handling for the function
        const otpDescTranslation = await translateText({ text: "An OTP has been sent to", targetLanguage: lang });
        newTranslatedContent.toasts.otpSentDesc = (phone: string) => `${otpDescTranslation.translatedText} ${phone}.`;

        setTranslatedContent(newTranslatedContent);

      } catch (error) {
        console.error("Translation failed", error);
        toast({
          variant: "destructive",
          title: originalContent.toasts.translationErrorTitle,
          description: originalContent.toasts.translationErrorDesc,
        });
        setTranslatedContent(originalContent); // Fallback to English
      } finally {
        setIsLoading(false);
      }
    };

    translateContent();
  }, [lang]);

  const handleSendOtp = () => {
    if (!translatedContent) return;
    if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
      toast({
        variant: 'destructive',
        title: translatedContent.toasts.invalidPhoneTitle,
        description: translatedContent.toasts.invalidPhoneDesc,
      });
      return;
    }
    toast({
      title: translatedContent.toasts.otpSentTitle,
      description: translatedContent.toasts.otpSentDesc(phoneNumber),
    });
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (!translatedContent) return;
    if (otp.length !== 5) {
      toast({
        variant: 'destructive',
        title: translatedContent.toasts.invalidOtpTitle,
        description: translatedContent.toasts.invalidOtpDesc,
      });
      return;
    }
    if (!otpSent) {
      toast({
        variant: 'destructive',
        title: translatedContent.toasts.sendOtpFirstTitle,
        description: translatedContent.toasts.sendOtpFirstDesc,
      });
      return;
    }
    toast({
      title: translatedContent.toasts.loginSuccessTitle,
      description: translatedContent.toasts.loginSuccessDesc,
    });
    // Redirect to sponsor dashboard
    router.push(`/sponsor?lang=${lang}`);
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

export default function SponsorLoginPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <SponsorLogin />
        </Suspense>
    )
}
