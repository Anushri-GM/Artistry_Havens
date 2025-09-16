import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Check, ThumbsDown } from "lucide-react";

const requests = [
  {
    id: "REQ001",
    buyer: "Priya Desai",
    image: PlaceHolderImages.find(p => p.id === "jewelry-1"),
    description: "I love your turquoise necklace, but could you make one with a moonstone instead? Same design.",
  },
  {
    id: "REQ002",
    buyer: "Amit Kumar",
    image: PlaceHolderImages.find(p => p.id === "woodwork-1"),
    description: "Can you create a custom wooden chess set? I'm looking for a traditional Rajasthani design.",
  }
];

export default function OrderRequestsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Order Requests</h1>
        <p className="text-muted-foreground">Review custom requests from potential buyers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map(request => (
          <Card key={request.id}>
            <CardHeader>
              <CardTitle>Request from {request.buyer}</CardTitle>
              <CardDescription className="pt-2 italic">"{request.description}"</CardDescription>
            </CardHeader>
            <CardContent>
              {request.image && (
                <div>
                    <p className="text-sm font-semibold mb-2">Reference Image:</p>
                    <div className="relative h-48 w-full rounded-lg overflow-hidden">
                        <Image src={request.image.imageUrl} alt="Request reference" fill className="object-cover" />
                    </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline"><ThumbsDown className="mr-2 h-4 w-4" /> Deny</Button>
                <Button><Check className="mr-2 h-4 w-4" /> Accept</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
