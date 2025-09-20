
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArtistryHavensLogo } from '@/components/icons';
import { Phone } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { translateText } from '@/ai/flows/translate-text';

type TCTranslation = {
    title: string;
    description: string;
    content: { title: string; text: string }[];
};

function TermsAndConditionsDialog() {
    const searchParams = useSearchParams();
    const lang = searchParams.get('lang') || 'en';
    const [translatedContent, setTranslatedContent] = useState<TCTranslation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const originalContent = [
        { title: "Account Responsibility", text: "You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer." },
        { title: "Product Authenticity", text: "Artisans guarantee that all products listed are handmade by them and accurately represented. Misrepresentation may result in account suspension." },
        { title: "Prohibited Content", text: "Users may not post or transmit any content that is illegal, offensive, or infringes on the rights of others. This includes intellectual property rights." },
        { title: "Transactions", text: "All transactions are processed through our secure payment gateway. Artistry Havens is not responsible for any disputes between buyers and artisans but will provide mediation support." },
        { title: "Data Privacy", text: "We are committed to protecting your privacy. Your personal information will be handled in accordance with our Privacy Policy. We will not sell your data to third parties." },
        { title: "Platform Modifications", text: "We reserve the right to modify or terminate the platform or your access to it for any reason, without notice, at any time." },
    ];

    useEffect(() => {
        const translateContent = async () => {
            if (lang === 'en') {
                setTranslatedContent({
                    title: "Terms & Conditions",
                    description: "Please read and agree to the terms and conditions before proceeding.",
                    content: originalContent
                });
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const [title, description, ...contentTranslations] = await Promise.all([
                    translateText({ text: "Terms & Conditions", targetLanguage: lang }),
                    translateText({ text: "Please read and agree to the terms and conditions before proceeding.", targetLanguage: lang }),
                    ...originalContent.flatMap(item => [
                        translateText({ text: item.title, targetLanguage: lang }),
                        translateText({ text: item.text, targetLanguage: lang })
                    ])
                ]);

                const translatedItems = originalContent.map((_, index) => ({
                    title: contentTranslations[index * 2].translatedText,
                    text: contentTranslations[index * 2 + 1].translatedText,
                }));

                setTranslatedContent({
                    title: title.translatedText,
                    description: description.translatedText,
                    content: translatedItems
                });

            } catch (error) {
                console.error("TC Translation failed", error);
                 setTranslatedContent({
                    title: "Terms & Conditions",
                    description: "Please read and agree to the terms and conditions before proceeding.",
                    content: originalContent
                });
            } finally {
                setIsLoading(false);
            }
        };

        translateContent();
    }, [lang]);


    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{isLoading ? "Loading..." : translatedContent?.title}</DialogTitle>
                <DialogDescription>
                    {isLoading ? "..." : translatedContent?.description}
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-72 w-full rounded-md border p-4">
                {isLoading ? <p>Loading terms...</p> : (
                    <div className="space-y-4 text-sm text-muted-foreground">
                        {translatedContent?.content.map((item, index) => (
                             <p key={index}><strong>{item.title}:</strong> {item.text}</p>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </DialogContent>
    );
}

type LoginPageTranslation = {
    title: string;
    description: string;
    mobileLabel: string;
    mobilePlaceholder: string;
    agreeLabel: string;
    tcButton: string;
    otpInfo: string;
    signInButton: string;
    signUpPrompt: string;
    signUpLink: string;
};

function Login() {
    const searchParams = useSearchParams();
    const lang = searchParams.get('lang') || 'en';
    const [translatedContent, setTranslatedContent] = useState<LoginPageTranslation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
     useEffect(() => {
        const translateContent = async () => {
            if (lang === 'en') {
                setTranslatedContent({
                    title: "Welcome Back!",
                    description: "Sign in to continue your journey through art.",
                    mobileLabel: "Mobile Number",
                    mobilePlaceholder: "Enter your 10-digit mobile number",
                    agreeLabel: "I agree to the",
                    tcButton: "Terms & Conditions",
                    otpInfo: "An OTP will be sent to your registered mobile number for verification.",
                    signInButton: "Send OTP & Sign In",
                    signUpPrompt: "New to Artistry Havens?",
                    signUpLink: "Sign Up",
                });
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const results = await Promise.all([
                    translateText({ text: "Welcome Back!", targetLanguage: lang }),
                    translateText({ text: "Sign in to continue your journey through art.", targetLanguage: lang }),
                    translateText({ text: "Mobile Number", targetLanguage: lang }),
                    translateText({ text: "Enter your 10-digit mobile number", targetLanguage: lang }),
                    translateText({ text: "I agree to the", targetLanguage: lang }),
                    translateText({ text: "Terms & Conditions", targetLanguage: lang }),
                    translateText({ text: "An OTP will be sent to your registered mobile number for verification.", targetLanguage: lang }),
                    translateText({ text: "Send OTP & Sign In", targetLanguage: lang }),
                    translateText({ text: "New to Artistry Havens?", targetLanguage: lang }),
                    translateText({ text: "Sign Up", targetLanguage: lang }),
                ]);

                setTranslatedContent({
                    title: results[0].translatedText,
                    description: results[1].translatedText,
                    mobileLabel: results[2].translatedText,
                    mobilePlaceholder: results[3].translatedText,
                    agreeLabel: results[4].translatedText,
                    tcButton: results[5].translatedText,
                    otpInfo: results[6].translatedText,
                    signInButton: results[7].translatedText,
                    signUpPrompt: results[8].translatedText,
                    signUpLink: results[9].translatedText,
                });

            } catch (error) {
                console.error("Login Page Translation failed", error);
                 setTranslatedContent({
                    title: "Welcome Back!",
                    description: "Sign in to continue your journey through art.",
                    mobileLabel: "Mobile Number",
                    mobilePlaceholder: "Enter your 10-digit mobile number",
                    agreeLabel: "I agree to the",
                    tcButton: "Terms & Conditions",
                    otpInfo: "An OTP will be sent to your registered mobile number for verification.",
                    signInButton: "Send OTP & Sign In",
                    signUpPrompt: "New to Artistry Havens?",
                    signUpLink: "Sign Up",
                });
            } finally {
                setIsLoading(false);
            }
        };

        translateContent();
    }, [lang]);

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
          <CardDescription>{translatedContent.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="auth-number">{translatedContent.mobileLabel}</Label>
            <div className="relative">
              <Input id="auth-number" type="text" placeholder={translatedContent.mobilePlaceholder} className="pl-10" />
               <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Phone className="h-5 w-5" />
               </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="text-sm font-light">
              {translatedContent.agreeLabel}{' '}
              <Dialog>
                <DialogTrigger asChild>
                    <Button variant="link" className="p-0 h-auto text-sm">{translatedContent.tcButton}</Button>
                </DialogTrigger>
                <TermsAndConditionsDialog />
              </Dialog>
            </Label>
          </div>
           <p className="px-1 text-center text-xs text-muted-foreground">
            {translatedContent.otpInfo}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" asChild>
            <Link href={`/buyer?lang=${lang}`}>{translatedContent.signInButton}</Link>
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


export default function BuyerLoginPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <Login />
        </Suspense>
    )
}
