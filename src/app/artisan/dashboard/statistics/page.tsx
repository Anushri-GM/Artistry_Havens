

'use client';

import { useState } from 'react';
import { CartesianGrid, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { mockProducts, mockStatsData, mockWeeklyStatsData, mockYearlyStatsData } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Bot, Loader2, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { provideAiReview, ProvideAiReviewInput } from '@/ai/flows/provide-ai-review';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const chartConfig = {
  likes: {
    label: 'Likes',
    color: 'hsl(var(--chart-1))',
  },
  shares: {
    label: 'Shares',
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
                    <Image src={product.image.imageUrl} alt={product.name} fill className="object-cover" />
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
        <p className="text-muted-foreground">Likes and shares for all your products.</p>
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
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer>
                  <LineChart data={mockWeeklyStatsData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="week" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line dataKey="likes" type="monotone" stroke="var(--color-likes)" strokeWidth={2} dot={true} />
                    <Line dataKey="shares" type="monotone" stroke="var(--color-shares)" strokeWidth={2} dot={true} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monthly">
          <Card>
            <CardContent className="pt-6">
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer>
                   <LineChart data={mockStatsData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                     <ChartLegend content={<ChartLegendContent />} />
                    <Line dataKey="likes" type="monotone" stroke="var(--color-likes)" strokeWidth={2} dot={true} />
                    <Line data-key="shares" type="monotone" stroke="var(--color-shares)" strokeWidth={2} dot={true} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="yearly">
          <Card>
            <CardContent className="pt-6">
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer>
                  <LineChart data={mockYearlyStatsData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                     <ChartLegend content={<ChartLegendContent />} />
                    <Line dataKey="likes" type="monotone" stroke="var(--color-likes)" strokeWidth={2} dot={true} />
                    <Line dataKey="shares" type="monotone" stroke="var(--color-shares)" strokeWidth={2} dot={true} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div>
        <h2 className="text-2xl font-bold font-headline">Product Breakdown</h2>
        <p className="text-muted-foreground">Individual performance metrics for each product.</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-center">Likes</TableHead>
              <TableHead className="text-center">Shares</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium whitespace-normal">{product.name}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    {product.likes.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                    {product.shares.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleShowReview(product)}>
                    <Bot className="mr-2 h-4 w-4" />
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AiReviewDialog product={selectedProduct} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
