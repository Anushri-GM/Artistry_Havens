
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, MessageSquare, ShieldCheck, ThumbsDown, X } from "lucide-react";
import { mockSponsors, mockSponsorRequests } from "@/lib/mock-data";

export default function SponsorsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Sponsors</h1>
        <p className="text-muted-foreground">Manage your partnerships and requests.</p>
      </div>

      <Tabs defaultValue="my-sponsors">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-sponsors">My Sponsors</TabsTrigger>
          <TabsTrigger value="sponsor-requests">Sponsor Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="my-sponsors" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>My Sponsors</CardTitle>
              <CardDescription>List of your active sponsors.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockSponsors.map(sponsor => (
                <div key={sponsor.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={sponsor.avatar?.imageUrl} alt={sponsor.name} />
                      <AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{sponsor.name}</p>
                      <p className="text-sm text-muted-foreground">Expires: {sponsor.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{sponsor.share}% Share</Badge>
                     <Button variant="outline" size="sm"><MessageSquare className="h-4 w-4 mr-2"/>Chat</Button>
                    <Button variant="destructive" size="sm">Terminate</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sponsor-requests" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sponsor Requests</CardTitle>
              <CardDescription>Review and respond to new sponsorship opportunities.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockSponsorRequests.map(request => (
                     <Card key={request.id}>
                        <CardHeader>
                            <div className="flex items-start gap-4">
                                <Avatar>
                                    <AvatarImage src={request.avatar?.imageUrl} alt={request.name} />
                                    <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="font-headline text-lg">{request.name}</CardTitle>
                                    <CardDescription className="pt-2 italic">"{request.message}"</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardFooter className="flex justify-end gap-2">
                           <Button size="sm" variant="outline"><ThumbsDown className="h-4 w-4 mr-2"/>Deny</Button>
                           <Button size="sm"><Check className="h-4 w-4 mr-2"/>Accept</Button>
                        </CardFooter>
                     </Card>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
