
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArtistryHavensLogo } from '@/components/icons';
import { Phone, Shield } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

function TermsAndConditionsDialog() {
    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Terms & Conditions</DialogTitle>
                <DialogDescription>
                    Please read and agree to the terms and conditions before proceeding.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-72 w-full rounded-md border p-4">
                <div className="space-y-4 text-sm text-muted-foreground">
                    <p><strong>1. Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.</p>
                    <p><strong>2. Product Authenticity:</strong> Artisans guarantee that all products listed are handmade by them and accurately represented. Misrepresentation may result in account suspension.</p>
                    <p><strong>3. Prohibited Content:</strong> Users may not post or transmit any content that is illegal, offensive, or infringes on the rights of others. This includes intellectual property rights.</p>
                    <p><strong>4. Transactions:</strong> All transactions are processed through our secure payment gateway. Artistry Havens is not responsible for any disputes between buyers and artisans but will provide mediation support.</p>
                    <p><strong>5. Data Privacy:</strong> We are committed to protecting your privacy. Your personal information will be handled in accordance with our Privacy Policy. We will not sell your data to third parties.</p>
                    <p><strong>6. Platform Modifications:</strong> We reserve the right to modify or terminate the platform or your access to it for any reason, without notice, at any time.</p>
                </div>
            </ScrollArea>
        </DialogContent>
    );
}

export default function ArtisanLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <ArtistryHavensLogo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Artisan Portal</CardTitle>
          <CardDescription>Sign in to manage your craft and connect with your audience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="auth-number">Mobile / Aadhar Number</Label>
            <div className="relative">
              <Input id="auth-number" type="text" placeholder="Enter your 10 or 16 digit number" className="pl-10" />
               <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Phone className="h-5 w-5" />
               </div>
            </div>
            
          </div>
           <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="text-sm font-light">
              I agree to the{' '}
              <Dialog>
                <DialogTrigger asChild>
                    <Button variant="link" className="p-0 h-auto text-sm">Terms & Conditions</Button>
                </DialogTrigger>
                <TermsAndConditionsDialog />
              </Dialog>
            </Label>
          </div>
           <p className="px-1 text-center text-xs text-muted-foreground">
            An OTP will be sent to your registered mobile number for verification.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" asChild>
            <Link href="/artisan/dashboard">Send OTP & Sign In</Link>
          </Button>
           <p className="text-xs text-muted-foreground">
            Don't have an account?{' '}
            <Link href="#" className="font-medium text-primary underline-offset-4 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
