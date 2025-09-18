
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BadgeIndianRupee, Users, Percent } from "lucide-react";
import { mockProducts } from "@/lib/mock-data";
import Image from "next/image";

const myProfitProducts = mockProducts.slice(0, 3);
const sharedProfitProducts = mockProducts.slice(3, 6);

export default function RevenuePage() {
    const totalMyProfit = myProfitProducts.reduce((acc, p) => acc + p.revenue, 0);
    const totalSharedProfit = sharedProfitProducts.reduce((acc, p) => acc + p.revenue, 0);

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Revenue</h1>
            <p className="text-muted-foreground">Track your earnings and profit shares.</p>
        </div>
        <Tabs defaultValue="my-profit">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="my-profit">My Profit</TabsTrigger>
                <TabsTrigger value="shared-profit">Shared Profit</TabsTrigger>
            </TabsList>
            <TabsContent value="my-profit" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>My Profit</CardTitle>
                        <CardDescription>Revenue from products that are not sponsored.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 p-6 bg-primary/5 rounded-lg">
                            <BadgeIndianRupee className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Earnings</p>
                                <p className="text-3xl font-bold">${totalMyProfit.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Revenue</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {myProfitProducts.map(product => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell className="text-right">${product.revenue.toLocaleString('en-US', {minimumFractionDigits: 2})}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="shared-profit" className="mt-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Shared Profit</CardTitle>
                        <CardDescription>Profit gained from selling sponsored products.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <Card className="bg-primary/5">
                                 <CardHeader className="pb-2">
                                     <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
                                        <BadgeIndianRupee className="h-5 w-5" /> Total Shared Revenue
                                     </CardTitle>
                                 </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">${totalSharedProfit.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                                </CardContent>
                            </Card>
                             <Card className="bg-primary/5">
                                 <CardHeader className="pb-2">
                                     <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
                                        <Users className="h-5 w-5" /> Your Share (80%)
                                     </CardTitle>
                                 </CardHeader>
                                <CardContent>
                                     <p className="text-2xl font-bold">${(totalSharedProfit * 0.8).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                                </CardContent>
                            </Card>
                         </div>
                        
                        <div className="space-y-4">
                            <h3 className="font-headline text-lg font-semibold">Product Breakdown</h3>
                            {sharedProfitProducts.map(product => (
                                <Card key={product.id} className="bg-card overflow-hidden">
                                    <div className="flex gap-4">
                                        {product.image && (
                                            <div className="relative w-1/3 aspect-square">
                                                <Image src={product.image.imageUrl} alt={product.name} fill className="object-cover" />
                                            </div>
                                        )}
                                        <div className="flex-1 py-4 pr-4">
                                            <p className="font-bold font-headline">{product.name}</p>
                                            <p className="text-xs text-muted-foreground mb-2">Sponsored by Craft Ventures</p>
                                            
                                            <div className="space-y-2 mt-3">
                                                 <div className="flex justify-between items-baseline">
                                                    <span className="text-muted-foreground text-xs">Total Revenue:</span>
                                                    <span className="font-semibold text-sm">${product.revenue.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                                                </div>
                                                 <div className="flex justify-between items-baseline text-primary">
                                                    <span className="text-xs font-medium">Your Profit (80%):</span>
                                                    <span className="font-bold text-base">${(product.revenue * 0.8).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
