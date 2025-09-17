import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArtistryHavensLogo } from '@/components/icons';
import { Phone } from 'lucide-react';

export default function BuyerLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <ArtistryHavensLogo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Welcome Back!</CardTitle>
          <CardDescription>Sign in to continue your journey through art.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="auth-number">Mobile Number</Label>
            <div className="relative">
              <Input id="auth-number" type="text" placeholder="Enter your 10-digit mobile number" className="pl-10" />
               <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Phone className="h-5 w-5" />
               </div>
            </div>
            
          </div>
           <p className="px-1 text-center text-xs text-muted-foreground">
            An OTP will be sent to your registered mobile number for verification.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" asChild>
            <Link href="/buyer">Send OTP & Sign In</Link>
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
