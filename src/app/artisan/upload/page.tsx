
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Copy, Download, Eye, Facebook, GalleryHorizontal, Instagram, Loader2, Mic, Twitter, UploadCloud, Sparkles, Share2, ArrowLeft, Video, CircleDot, AlertTriangle } from 'lucide-react';
import { generateProductStory } from '@/ai/flows/generate-product-story';
import { generateSocialMediaContent } from '@/ai/flows/generate-social-media-content';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const previewImage = PlaceHolderImages.find(p => p.id === "pottery-1");

export default function UploadPage() {
    const { toast } = useToast();
    const [productStory, setProductStory] = useState('');
    const [socialContent, setSocialContent] = useState<Record<string, string> | null>(null);
    const [isStoryLoading, setIsStoryLoading] = useState(false);
    const [isSocialLoading, setIsSocialLoading] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [productImage, setProductImage] = useState<string | null>(null);

    // Camera states
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);


    useEffect(() => {
        if (isCameraOpen) {
            const getCameraPermission = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    setHasCameraPermission(true);

                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (error) {
                    console.error('Error accessing camera:', error);
                    setHasCameraPermission(false);
                    toast({
                        variant: 'destructive',
                        title: 'Camera Access Denied',
                        description: 'Please enable camera permissions in your browser settings.',
                    });
                }
            };
            getCameraPermission();
        } else {
            // Stop camera stream when dialog is closed
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        }
    }, [isCameraOpen, toast]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if(context) {
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const dataUrl = canvas.toDataURL('image/png');
                setProductImage(dataUrl);
                setIsCameraOpen(false);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProductImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

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
    <div className="flex justify-center min-h-screen bg-background">
    <div className="w-full">
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-2 border-b bg-background/80 px-4 backdrop-blur-sm">
        <div className='flex items-center gap-2'>
            <Button variant="ghost" size="icon" asChild>
                <Link href="/artisan/dashboard"><ArrowLeft /></Link>
            </Button>
            <h1 className="font-headline text-xl font-bold">Upload Product</h1>
        </div>
        <Button variant="ghost" size="icon" className="bg-primary/10 text-primary hover:bg-primary/20">
            <Mic className="h-5 w-5" />
            <span className="sr-only">Voice Command</span>
        </Button>
    </header>
    <main className="p-4">
    <div className="grid grid-cols-1 gap-8 max-w-md mx-auto">
      <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Upload Your Product</CardTitle>
                <CardDescription>Add images and details for your new creation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label>Product Images</Label>
                    <div className="mt-2 flex justify-center items-center w-full h-48 border-2 border-dashed rounded-lg relative overflow-hidden">
                        {productImage ? (
                            <Image src={productImage} alt="Product preview" fill className="object-contain" />
                        ) : (
                            <div className="text-center p-4">
                                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">Drag & drop or select an option below</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 flex justify-center gap-4">
                        <Button variant="outline" onClick={() => setIsCameraOpen(true)}><Camera className="mr-2 h-4 w-4" /> Take Photo</Button>
                        <Input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept="image/*" />
                        <Button variant="outline" asChild>
                           <Label htmlFor='file-upload' className="cursor-pointer flex items-center">
                                <GalleryHorizontal className="mr-2 h-4 w-4" /> From Gallery
                           </Label>
                        </Button>
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
      
      <div>
          <Card className="sticky bottom-4 top-auto mt-8">
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
                    <div className="relative h-80 w-full rounded-lg overflow-hidden bg-muted">
                        <Image src={productImage || previewImage!.imageUrl} alt="Preview" fill className="object-contain" />
                    </div>
                    <h2 className="font-headline text-2xl mt-4">Azure Clay Vase</h2>
                    <p className="text-lg font-semibold text-primary mt-1">$49.99</p>
                    <h3 className="font-headline text-lg mt-4 font-semibold">Description</h3>
                    <p className="text-muted-foreground text-sm">A beautiful handmade clay vase with a unique azure glaze, perfect for any home decor.</p>
                    <h3 className="font-headline text-lg mt-4 font-semibold">The Story</h3>
                    <p className="text-muted-foreground text-sm italic">{productStory || "Your generated story will appear here."}</p>
                </div>
            </DialogContent>
        </Dialog>

        <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Take a Photo</DialogTitle>
                    <DialogDescription>Center your product in the frame and capture the image.</DialogDescription>
                </DialogHeader>
                <div className="relative aspect-video w-full rounded-md bg-muted overflow-hidden">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                    <canvas ref={canvasRef} className="hidden" />
                </div>
                {hasCameraPermission === false && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access in your browser settings to use this feature.
                        </AlertDescription>
                    </Alert>
                )}
                <DialogFooter>
                    <Button onClick={handleCapture} disabled={hasCameraPermission !== true}>
                        <CircleDot className="mr-2 h-4 w-4" /> Capture
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
    </main>
    </div>
    </div>
  );
}
