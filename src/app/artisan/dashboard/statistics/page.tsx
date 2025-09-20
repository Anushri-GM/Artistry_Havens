
'use client';

import { useState, useEffect, Suspense } from 'react';
import { CartesianGrid, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { mockStatsData, mockWeeklyStatsData, mockYearlyStatsData } from '@/lib/mock-data';
import { useArtisan } from '@/context/ArtisanContext';
import type { Product } from '@/context/ArtisanContext';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Bot, Loader2, Sparkles, Volume2, Pause } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { provideAiReview, ProvideAiReviewInput } from '@/ai/flows/provide-ai-review';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { useSearchParams } from 'next/navigation';
import { translateText } from '@/ai/flows/translate-text';

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


type TranslatedDialogContent = {
    title: string;
    description: string;
    likes: string;
    shares: string;
    revenue: string;
    generatedReviewTitle: string;
    listen: string;
    pause: string;
    regenerate: string;
    showReview: string;
    placeholder: string;
    error: string;
    synthesizing: string;
};

function AiReviewDialog({ product, open, onOpenChange, lang }: { product: Product | null; open: boolean; onOpenChange: (open: boolean) => void, lang: string }) {
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<TranslatedDialogContent | null>(null);

  useEffect(() => {
    const originalContent = {
        title: "AI Review for: ",
        description: "An AI-powered analysis of your product's performance with suggestions for improvement.",
        likes: "Likes",
        shares: "Shares",
        revenue: "Income",
        generatedReviewTitle: "Generated AI Review",
        listen: "Listen",
        pause: "Pause",
        regenerate: "Regenerate",
        showReview: "Show AI Review",
        placeholder: "Click the button to generate an AI performance review.",
        error: "Sorry, we couldn't generate a review at this time. Please try again later.",
        synthesizing: "Synthesizing...",
    };

    const translate = async () => {
        if (lang === 'en' || !product) {
            setTranslatedContent(originalContent);
            return;
        }

        try {
            const texts = Object.values(originalContent);
            const translations = await Promise.all(texts.map(text => translateText({ text, targetLanguage: lang })));
            const keys = Object.keys(originalContent) as (keyof TranslatedDialogContent)[];
            const newContent = keys.reduce((acc, key, index) => {
                acc[key] = translations[index].translatedText;
                return acc;
            }, {} as TranslatedDialogContent);
            setTranslatedContent(newContent);
        } catch (error) {
            console.error("Failed to translate AI Review Dialog", error);
            setTranslatedContent(originalContent);
        }
    };
    translate();
  }, [lang, product]);


  const handleGenerateReview = async () => {
    if (!product) return;
    setIsLoading(true);
    setReview('');
    setAudioUrl(null);
    if(audio) {
      audio.pause();
      setIsPlaying(false);
    }
    try {
      const input: ProvideAiReviewInput = {
        productDescription: product.description,
        productStory: product.story,
        likes: product.likes || 0,
        shares: product.shares || 0,
        revenue: product.revenue || 0,
        targetedAudience: "Art lovers aged 25-45, home decorators, and gift shoppers.",
        targetLanguage: lang,
      };
      const result = await provideAiReview(input);
      setReview(result.review);
    } catch (error) {
      console.error('Failed to generate AI review:', error);
      setReview(translatedContent?.error || 'Sorry, we couldn\'t generate a review at this time. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextToSpeech = async () => {
      if(!review) return;

      setIsSynthesizing(true);
      if(audio) {
        audio.pause();
        setIsPlaying(false);
      }
      setAudioUrl(null);

      try {
          const result = await textToSpeech({ text: review });
          setAudioUrl(result.audioDataUri);
          const newAudio = new Audio(result.audioDataUri);
          setAudio(newAudio);
          newAudio.play();
          setIsPlaying(true);
          newAudio.onended = () => setIsPlaying(false);

      } catch(error) {
          console.error("Failed to synthesize speech:", error);
      } finally {
          setIsSynthesizing(false);
      }
  }

  const togglePlay = () => {
      if(!audio) return;
      if(isPlaying) {
          audio.pause();
      } else {
          audio.play();
      }
      setIsPlaying(!isPlaying);
  }
  
  if (!product || !translatedContent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden flex flex-col h-[90vh]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="font-headline text-xl">{translatedContent.title}{product.name}</DialogTitle>
          <DialogDescription>
            {translatedContent.description}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1">
        <div className="grid grid-cols-1 gap-6 p-6 pt-2">
            <div className='space-y-4'>
                {product.image && (
                <div className="relative h-56 w-full rounded-lg overflow-hidden">
                    <Image src={product.image.imageUrl} alt={product.name} fill className="object-contain" />
                </div>
                )}
                <div className='grid grid-cols-2 gap-4'>
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{translatedContent.likes}</CardTitle></CardHeader>
                        <CardContent><div className="text-xl font-bold">{(product.likes || 0).toLocaleString()}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{translatedContent.shares}</CardTitle></CardHeader>
                        <CardContent><div className="text-xl font-bold">{(product.shares || 0).toLocaleString()}</div></CardContent>
                    </Card>
                    <Card className='col-span-2'>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{translatedContent.revenue}</CardTitle></CardHeader>
                        <CardContent><div className="text-xl font-bold">₹{(product.revenue || 0).toLocaleString('en-IN')}</div></CardContent>
                    </Card>
                </div>

            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className='font-semibold font-headline'>{translatedContent.generatedReviewTitle}</h3>
                    {review && (
                        <Button onClick={isSynthesizing ? togglePlay : handleTextToSpeech} variant="ghost" size="sm" disabled={isSynthesizing}>
                            {isSynthesizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : (isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />)}
                            {isSynthesizing ? translatedContent.synthesizing : (isPlaying ? translatedContent.pause : translatedContent.listen)}
                        </Button>
                    )}
                </div>
                <Card className="bg-primary/5">
                    <CardContent className="p-4">
                        <ScrollArea className="h-[180px] w-full">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : review ? (
                                <div className="text-sm prose prose-sm max-w-none pr-4">
                                    <p>{review}</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                    <Sparkles className="h-8 w-8 text-primary/50 mb-2"/>
                                    <p className="text-sm text-muted-foreground">{translatedContent.placeholder}</p>
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Button onClick={handleGenerateReview} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                    {review ? translatedContent.regenerate : translatedContent.showReview}
                </Button>
            </div>
        </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}


type TranslatedPageContent = {
    title: string;
    description: string;
    weekly: string;
    monthly: string;
    yearly: string;
    breakdownTitle: string;
    breakdownDescription: string;
    likes: string;
    shares: string;
    review: string;
    productNames: Record<string, string>;
};

function Statistics() {
    const { products } = useArtisan();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const searchParams = useSearchParams();
    const lang = searchParams.get('lang') || 'en';

    const [translatedContent, setTranslatedContent] = useState<TranslatedPageContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const originalContent = {
            title: "Performance Overview",
            description: "Likes and sales for all your products.",
            weekly: "Weekly",
            monthly: "Monthly",
            yearly: "Yearly",
            breakdownTitle: "Product Breakdown",
            breakdownDescription: "Individual performance metrics for each product.",
            likes: "Likes",
            shares: "Shares",
            review: "Review",
        };

        const translate = async () => {
            if (lang === 'en') {
                const productNames = products.reduce((acc, p) => ({...acc, [p.id]: p.name}), {});
                setTranslatedContent({ ...originalContent, productNames });
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const textsToTranslate = [
                    ...Object.values(originalContent),
                    ...products.map(p => p.name)
                ];
                
                const translations = await Promise.all(textsToTranslate.map(text => translateText({ text, targetLanguage: lang })));
                
                const baseContentKeys = Object.keys(originalContent) as (keyof typeof originalContent)[];
                const newContent: any = {};
                baseContentKeys.forEach((key, index) => {
                    newContent[key] = translations[index].translatedText;
                });
                
                newContent.productNames = products.reduce((acc, p, index) => {
                    acc[p.id] = translations[baseContentKeys.length + index].translatedText;
                    return acc;
                }, {} as Record<string, string>);
                
                setTranslatedContent(newContent);
            } catch (error) {
                console.error("Failed to translate stats page", error);
                const productNames = products.reduce((acc, p) => ({...acc, [p.id]: p.name}), {});
                setTranslatedContent({ ...originalContent, productNames });
            } finally {
                setIsLoading(false);
            }
        };
        translate();
    }, [lang, products]);

    const handleShowReview = (product: Product) => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    };

    if (isLoading || !translatedContent) {
        return <div className="flex h-full items-center justify-center">Loading...</div>
    }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{translatedContent.title}</h1>
        <p className="text-muted-foreground">{translatedContent.description}</p>
      </div>

      <Tabs defaultValue="monthly">
        <TabsList>
          <TabsTrigger value="weekly">{translatedContent.weekly}</TabsTrigger>
          <TabsTrigger value="monthly">{translatedContent.monthly}</TabsTrigger>
          <TabsTrigger value="yearly">{translatedContent.yearly}</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <ChartContainer config={chartConfig} className="h-[300px] w-full min-w-[400px]">
                  <ResponsiveContainer>
                    <BarChart data={mockWeeklyStatsData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                        <CartesianGrid vertical={false} />
                        <YAxis />
                        <XAxis dataKey="week" tickLine={false} tickMargin={10} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="likes" fill="var(--color-likes)" radius={4} barSize={40} />
                        <Bar dataKey="bought" fill="var(--color-bought)" radius={4} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
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
                  <ResponsiveContainer>
                    <BarChart data={mockStatsData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                        <CartesianGrid vertical={false} />
                        <YAxis />
                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="likes" fill="var(--color-likes)" radius={4} barSize={25} />
                        <Bar dataKey="bought" fill="var(--color-bought)" radius={4} barSize={25} />
                    </BarChart>
                  </ResponsiveContainer>
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
                   <ResponsiveContainer>
                    <BarChart data={mockYearlyStatsData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                        <CartesianGrid vertical={false} />
                        <YAxis />
                        <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="likes" fill="var(--color-likes)" radius={4} barSize={80} />
                        <Bar dataKey="bought" fill="var(--color-bought)" radius={4} barSize={80} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div>
        <h2 className="text-2xl font-bold font-headline">{translatedContent.breakdownTitle}</h2>
        <p className="text-muted-foreground">{translatedContent.breakdownDescription}</p>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
           <Card key={product.id}>
             <div className="flex flex-row items-center gap-4 p-4">
                {product.image && (
                 <div className="relative w-24 h-24 flex-shrink-0">
                     <Image src={product.image.imageUrl} alt={product.name} fill className="object-contain rounded-md" />
                 </div>
               )}
               <div className="flex-1 flex flex-col gap-2">
                  <CardTitle className="font-headline font-semibold text-base">{translatedContent.productNames[product.id] || product.name}</CardTitle>
                  <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">{translatedContent.likes}</p>
                          <div className="flex items-center justify-center gap-1 font-bold text-sm">
                              <Heart className="h-4 w-4 text-pink-500" />
                              {(product.likes || 0).toLocaleString()}
                          </div>
                      </div>
                      <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">{translatedContent.shares}</p>
                          <div className="flex items-center justify-center gap-1 font-bold text-sm">
                              <Share2 className="h-4 w-4 text-blue-500" />
                              {(product.shares || 0).toLocaleString()}
                          </div>
                      </div>
                  </div>
                 <CardFooter className="flex justify-end gap-2 p-0 pt-2">
                      <Button variant="outline" size="sm" onClick={() => handleShowReview(product)}>
                        <Bot className="mr-2 h-4 w-4" />
                        {translatedContent.review}
                      </Button>
                 </CardFooter>
               </div>
             </div>
           </Card>
        ))}
      </div>

      <AiReviewDialog product={selectedProduct} open={isDialogOpen} onOpenChange={setIsDialogOpen} lang={lang} />
    </div>
  );
}

export default function StatisticsPage() {
    return (
        <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
            <Statistics />
        </Suspense>
    )
}

    
