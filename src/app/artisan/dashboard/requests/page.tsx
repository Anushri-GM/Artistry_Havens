
'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, ThumbsDown, Wand2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useArtisan } from "@/context/ArtisanContext";

export default function OrderRequestsPage() {
  const { requests, acceptRequest, denyRequest } = useArtisan();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Order Requests</h1>
        <p className="text-muted-foreground">Review custom requests from potential buyers.</p>
      </div>

      <div className="space-y-6">
        {requests.length > 0 ? requests.map(request => (
          <Card key={request.id}>
            <div className="flex gap-4">
              <div className="flex flex-col flex-1">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Request from {request.buyer}</CardTitle>
                        <CardDescription className="pt-2 italic">"{request.description}"</CardDescription>
                    </div>
                    {request.isAiRequest && (
                        <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-full text-sm font-medium">
                            <Wand2 className="h-4 w-4"/>
                            <span>AI</span>
                        </div>
                    )}
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-end gap-2 mt-auto">
                    <Button variant="outline" size="sm" onClick={() => denyRequest(request.id)}><ThumbsDown className="mr-2 h-4 w-4" /> Deny</Button>
                    <Button size="sm" onClick={() => acceptRequest(request.id)}><Check className="mr-2 h-4 w-4" /> Accept</Button>
                </CardFooter>
              </div>
              
              {request.image && (
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="w-1/3 p-4 cursor-pointer">
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
                            <Image src={request.image.imageUrl} alt="Request reference" fill className="object-cover" />
                        </div>
                         <p className="text-xs text-center font-semibold mt-2 text-muted-foreground">{request.isAiRequest ? "AI Mockup" : "Reference"}</p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl p-2">
                    <div className="relative aspect-square w-full">
                        <Image src={request.image.imageUrl} alt="Request reference" fill className="object-contain rounded-lg" />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </Card>
        )) : (
          <p className="text-sm text-muted-foreground text-center">You have no new order requests.</p>
        )}
      </div>
    </div>
  );
}
