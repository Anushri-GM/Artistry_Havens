
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Copy, Download, Eye, Facebook, GalleryHorizontal, Instagram, Loader2, Mic, Twitter, UploadCloud, Sparkles, Share2 } from 'lucide-react';
import { generateProductStory } from '@/ai/flows/generate-product-story';
import { generateSocialMediaContent } from '@/ai/flows/generate-social-media-content';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const previewImage = PlaceHolderImages.find(p => p.id === "pottery-1");

export default function UploadPage() {
    const { toast } = useToast();
    const [productStory, setProductStory] = useState('');
    const [socialContent, setSocialContent] = useState<Record<string, string> | null>(null);
    const [isStoryLoading, setIsStoryLoading] = useState(false);
    const [isSocialLoading, setIsSocialLoading] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handleGenerateStory = async () => {
        setIsStoryLoading(true);
        try {
            const result = await generateProductStory({ voiceInput: "I made this vase from local clay, inspired by the rivers near my village. It took me three days to shape and fire, and the glaze reminds me of the monsoon sky." });
            setProductStory(result.productStory);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate product story.' });
        } finally {
            setIsStoryLoading(false);
        }
    };
    
    const handleGenerateSocial = async () => {
        setIsSocialLoading(true);
        try {
            const result = await generateSocialMediaContent({
                productName: "Azure Clay Vase",
                productDescription: "A beautiful handmade clay vase with a unique azure glaze, perfect for any home decor.",
                productStory: productStory || "Handcrafted with passion, this vase tells a story of tradition and nature.",
                socialMediaPlatforms: ["Instagram", "Facebook", "Twitter(X)"]
            });
            setSocialContent(result.content);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate social media content.' });
        } finally {
            setIsSocialLoading(false);
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copied to clipboard!" });
    }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Upload Your Product</CardTitle>
                <CardDescription>Add images and details for your new creation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label>Product Images</Label>
                    <div className="mt-2 flex justify-center items-center w-full h-48 border-2 border-dashed rounded-lg">
                        <div className="text-center">
                            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">Drag & drop or click to upload</p>
                            <div className="mt-4 flex justify-center gap-4">
                                <Button variant="outline"><Camera className="mr-2 h-4 w-4" /> Take Photo</Button>
                                <Button variant="outline"><GalleryHorizontal className="mr-2 h-4 w-4" /> From Gallery</Button>
                            </div>
                        </div>
                    </div>
                </div>
                 <div>
                    <Label htmlFor="product-name">Product Name</Label>
                    <Input id="product-name" placeholder="e.g., Handwoven Silk Scarf" />
                </div>
                <div>
                    <Label htmlFor="product-desc">Product Description</Label>
                    <Textarea id="product-desc" placeholder="Describe your product, its materials, dimensions, etc." />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Sparkles className="text-primary" />
                    AI-Powered Content Generation
                </CardTitle>
                <CardDescription>Let AI help you tell your story and market your product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label>Product Story</Label>
                     <p className="text-sm text-muted-foreground mb-2">Use your voice to tell the story behind your craft. We'll enhance it for you.</p>
                    <div className="relative">
                        <Textarea value={productStory} onChange={e => setProductStory(e.target.value)} placeholder="Your generated story will appear here..." rows={5} />
                    </div>
                    <Button onClick={handleGenerateStory} disabled={isStoryLoading} className="mt-2">
                        {isStoryLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mic className="mr-2 h-4 w-4" />}
                        Generate with Voice Input
                    </Button>
                </div>
                 <div>
                    <Label>Social Media Posts</Label>
                    <p className="text-sm text-muted-foreground mb-2">Auto-generate posts for different platforms.</p>
                     {socialContent ? (
                        <Tabs defaultValue="Instagram">
                            <TabsList>
                                <TabsTrigger value="Instagram"><Instagram className="h-4 w-4 mr-2" /> Instagram</TabsTrigger>
                                <TabsTrigger value="Facebook"><Facebook className="h-4 w-4 mr-2" /> Facebook</TabsTrigger>
                                <TabsTrigger value="Twitter(X)"><Twitter className="h-4 w-4 mr-2" /> Twitter (X)</TabsTrigger>
                            </TabsList>
                             {Object.entries(socialContent).map(([platform, content]) => (
                                <TabsContent key={platform} value={platform}>
                                    <Card className="bg-primary/5">
                                        <CardContent className="p-4 space-y-4">
                                            <p className="text-sm whitespace-pre-wrap">{content}</p>
                                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(content)}>
                                                <Copy className="mr-2 h-4 w-4" /> Copy
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            ))}
                        </Tabs>
                    ) : (
                         <Button onClick={handleGenerateSocial} disabled={isSocialLoading} className="mt-2 w-full">
                            {isSocialLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />}
                            Generate Social Media Content
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
                <CardTitle className="font-headline">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                 <Button onClick={() => setIsPreviewOpen(true)} variant="outline" size="lg"><Eye className="mr-2 h-4 w-4" /> Preview</Button>
                 <Button size="lg"><UploadCloud className="mr-2 h-4 w-4" /> Upload Product</Button>
            </CardContent>
          </Card>
      </div>

       <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="font-headline">Post Preview</DialogTitle>
                    <DialogDescription>This is how your product will appear to buyers.</DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    {previewImage && (
                        <div className="relative h-80 w-full rounded-lg overflow-hidden">
                            <Image src={previewImage.imageUrl} alt="Preview" fill className="object-cover" />
                        </div>
                    )}
                    <h2 className="font-headline text-2xl mt-4">Azure Clay Vase</h2>
                    <p className="text-lg font-semibold text-primary mt-1">$49.99</p>
                    <h3 className="font-headline text-lg mt-4 font-semibold">Description</h3>
                    <p className="text-muted-foreground text-sm">A beautiful handmade clay vase with a unique azure glaze, perfect for any home decor.</p>
                    <h3 className="font-headline text-lg mt-4 font-semibold">The Story</h3>
                    <p className="text-muted-foreground text-sm italic">{productStory || "Your generated story will appear here."}</p>
                </div>
            </DialogContent>
        </Dialog>

    </div>
  );
}
