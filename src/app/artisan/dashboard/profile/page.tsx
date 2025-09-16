import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Edit, Star, MapPin, Building, Mail, Phone } from "lucide-react";

const avatarImage = PlaceHolderImages.find(img => img.id === "avatar-1");
const artCategories = ["Pottery", "Woodwork", "Jewelry", "Textiles", "Paintings"];

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Profile</h1>
        <p className="text-muted-foreground">View and manage your public and private information.</p>
      </div>

      <Card>
        <CardHeader className="relative">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage src={avatarImage?.imageUrl} alt="Artisan" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-headline text-4xl">Rohan Joshi</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-500" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-500" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-500" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-500" />
                  <Star className="h-5 w-5 fill-yellow-400/50 text-yellow-500" />
                </div>
                <span className="text-muted-foreground text-sm">(4.9 from 152 reviews)</span>
              </div>
               <div className="mt-4 flex flex-wrap gap-2">
                {artCategories.map(cat => <Badge key={cat} variant="secondary">{cat}</Badge>)}
               </div>
            </div>
          </div>
          <Button variant="outline" className="absolute top-4 right-4"><Edit className="mr-2 h-4 w-4"/> Edit Profile</Button>
        </CardHeader>
        <CardContent className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h3 className="font-headline text-xl font-semibold">Professional Details</h3>
                 <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-1"/>
                    <div>
                        <p className="font-semibold">Place of Work</p>
                        <p className="text-muted-foreground">Jaipur, Rajasthan</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <Building className="h-5 w-5 text-muted-foreground mt-1"/>
                    <div>
                        <p className="font-semibold">Company</p>
                        <p className="text-muted-foreground">Joshi Wooden Crafts</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <p className="font-semibold w-32">Years of Experience:</p>
                    <p className="text-muted-foreground">15+ Years</p>
                </div>
            </div>
             <div className="space-y-4">
                <h3 className="font-headline text-xl font-semibold">Personal Details</h3>
                <p className="text-sm text-muted-foreground italic">These details are only visible to you and accepted sponsors.</p>
                 <div className="flex items-start gap-4">
                    <Mail className="h-5 w-5 text-muted-foreground mt-1"/>
                    <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-muted-foreground">rohan.joshi@example.com</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <Phone className="h-5 w-5 text-muted-foreground mt-1"/>
                    <div>
                        <p className="font-semibold">Phone Number</p>
                        <p className="text-muted-foreground">+91 98765 43210</p>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
