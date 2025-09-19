
'use client';

import { useState } from 'react';
import { CartesianGrid, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { mockProducts, mockStatsData, mockWeeklyStatsData, mockYearlyStatsData } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Bot, Loader2, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { provideAiReview, ProvideAiReviewInput } from '@/ai/flows/provide-ai-review';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const chartConfig = {
  likes: {
    label: 'Likes',
    color: 'hsl(var(--chart-1))',
  },
  bought: {
    label: 'Bought',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

type Product = (typeof mockProducts)[0];

function AiReviewDialog({ product, open, onOpenChange }: { product: Product | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReview = async () => {
    if (!product) return;
    setIsLoading(true);
    setReview('');
    try {
      const input: ProvideAiReviewInput = {
        productDescription: product.description,
        productStory: product.story,
        likes: product.likes,
        shares: product.shares,
        revenue: product.revenue,
        targetedAudience: "Art lovers aged 25-45, home decorators, and gift shoppers.",
      };
      const result = await provideAiReview(input);
      setReview(result.review);
    } catch (error) {
      console.error('Failed to generate AI review:', error);
      setReview('Sorry, we couldn\'t generate a review at this time. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">AI Review for: {product.name}</DialogTitle>
          <DialogDescription>
            An AI-powered analysis of your product's performance with suggestions for improvement.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-6 mt-4">
            <div className='space-y-4'>
                {product.image && (
                <div className="relative h-56 w-full rounded-lg overflow-hidden">
                    <Image src={product.image.imageUrl} alt={product.name} fill className="object-contain" />
                </div>
                )}
                <div className='grid grid-cols-2 gap-4'>
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Likes</CardTitle></CardHeader>
                        <CardContent><div className="text-xl font-bold">{product.likes.toLocaleString()}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Shares</CardTitle></CardHeader>
                        <CardContent><div className="text-xl font-bold">{product.shares.toLocaleString()}</div></CardContent>
                    </Card>
                    <Card className='col-span-2'>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Revenue</CardTitle></CardHeader>
                        <CardContent><div className="text-xl font-bold">${product.revenue.toLocaleString()}</div></CardContent>
                    </Card>
                </div>

            </div>
            <div className="space-y-4">
                <h3 className='font-semibold font-headline'>Generated AI Review</h3>
                <Card className="min-h-[180px] bg-primary/5">
                    <CardContent className="p-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : review ? (
                             <div className="text-sm prose prose-sm max-w-none">
                                <p>{review}</p>
                             </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                <Sparkles className="h-8 w-8 text-primary/50 mb-2"/>
                                <p className="text-sm text-muted-foreground">Click the button to generate an AI performance review.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Button onClick={handleGenerateReview} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                    {review ? 'Regenerate' : 'Show AI Review'}
                </Button>
            </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}


export default function StatisticsPage() {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleShowReview = (product: Product) => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Performance Overview</h1>
        <p className="text-muted-foreground">Likes and sales for all your products.</p>
      </div>

      <Tabs defaultValue="monthly">
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <ChartContainer config={chartConfig} className="h-[300px] w-full min-w-[400px]">
                  <BarChart data={mockWeeklyStatsData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                    <CartesianGrid vertical={false} />
                    <YAxis />
                    <XAxis dataKey="week" tickLine={false} tickMargin={10} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="likes" fill="var(--color-likes)" radius={4} barSize={40} />
                    <Bar dataKey="bought" fill="var(--color-bought)" radius={4} barSize={40} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monthly">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <ChartContainer config={chartConfig} className="h-[300px] w-full min-w-[600px]">
                  <BarChart data={mockStatsData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                    <CartesianGrid vertical={false} />
                    <YAxis />
                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="likes" fill="var(--color-likes)" radius={4} barSize={25} />
                    <Bar dataKey="bought" fill="var(--color-bought)" radius={4} barSize={25} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="yearly">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <ChartContainer config={chartConfig} className="h-[300px] w-full min-w-[300px]">
                  <BarChart data={mockYearlyStatsData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                    <CartesianGrid vertical={false} />
                    <YAxis />
                    <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="likes" fill="var(--color-likes)" radius={4} barSize={80} />
                    <Bar dataKey="bought" fill="var(--color-bought)" radius={4} barSize={80} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div>
        <h2 className="text-2xl font-bold font-headline">Product Breakdown</h2>
        <p className="text-muted-foreground">Individual performance metrics for each product.</p>
      </div>

      <div className="space-y-4">
        {mockProducts.map((product) => (
           <Card key={product.id}>
             <div className="flex flex-row gap-4">
                {product.image && (
                 <div className="w-1/3 p-4 flex-shrink-0">
                     <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
                         <Image src={product.image.imageUrl} alt={product.name} fill className="object-contain" />
                     </div>
                 </div>
               )}
               <div className="flex-1 flex flex-col">
                 <CardHeader className="flex-1 pb-2">
                    <CardTitle className="font-headline font-semibold text-base">{product.name}</CardTitle>
                    <div className="grid grid-cols-2 gap-4 text-center pt-2">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Likes</p>
                            <div className="flex items-center justify-center gap-1 font-bold text-sm">
                                <Heart className="h-4 w-4 text-pink-500" />
                                {product.likes.toLocaleString()}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Shares</p>
                            <div className="flex items-center justify-center gap-1 font-bold text-sm">
                                <Share2 className="h-4 w-4 text-blue-500" />
                                {product.shares.toLocaleString()}
                            </div>
                        </div>
                    </div>
                 </CardHeader>
                 <CardFooter className="flex justify-end gap-2 bg-background/50 p-4 pt-2">
                      <Button variant="outline" size="sm" onClick={() => handleShowReview(product)}>
                        <Bot className="mr-2 h-4 w-4" />
                        Review
                      </Button>
                 </CardFooter>
               </div>
             </div>
           </Card>
        ))}
      </div>

      <AiReviewDialog product={selectedProduct} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}

    