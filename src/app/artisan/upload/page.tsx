
'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Copy, Eye, Facebook, GalleryHorizontal, Loader2, Mic, Twitter, UploadCloud, Sparkles, Share2, ArrowLeft, CircleDot, AlertTriangle, MicOff, BadgeIndianRupee, Wand2 } from 'lucide-react';
import { generateSocialMediaContent } from '@/ai/flows/generate-social-media-content';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import Image from 'next/image';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { generateProductDetails } from '@/ai/flows/generate-product-details';
import { generateProductImage } from '@/ai/flows/generate-product-image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter, useSearchParams } from 'next/navigation';
import { translateText } from '@/ai/flows/translate-text';
import { useArtisan } from '@/context/ArtisanContext';
import type { Product } from '@/context/ArtisanContext';
import { cn } from '@/lib/utils';

const categories = ["Woodwork", "Pottery", "Paintings", "Sculptures", "Textiles", "Jewelry", "Metalwork"];

type TranslatedContent = {
    headerTitle: string;
    uploadTitle: string;
    uploadDescription: string;
    imageLabel: string;
    imagePlaceholder: string;
    cameraButton: string;
    galleryButton: string;
    generateImageButton: string;
    categoryLabel: string;
    categoryPlaceholder: string;
    aiTitle: string;
    aiDescription: string;
    generateDetailsButton: string;
    nameLabel: string;
    namePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    storyLabel: string;
    storyPlaceholder: string;
    priceLabel: string;
    pricePlaceholder: string;
    socialTitle: string;
    socialDescription: string;
    generateSocialButton: string;
    actionsTitle: string;
    previewButton: string;
    uploadButton: string;
    previewDialogTitle: string;
    previewDialogDescription: string;
    previewProductNamePlaceholder: string;
    previewDescriptionPlaceholder: string;
    previewStoryPlaceholder: string;
    cameraDialogTitle: string;
    cameraDialogDescription: string;
    captureButton: string;
    cameraAccessTitle: string;
    cameraAccessDescription: string;
    categoryNames: Record<string, string>;
    listeningToastTitle: string;
    listeningToastDescription: string;
    stoppedListeningToastTitle: string;
    micPermissionDeniedTitle: string;
    micPermissionDeniedDescription: string;
    micNotSupportedTitle: string;
    micNotSupportedDescription: string;
    micErrorTitle: string;
    toasts: {
        cameraAccessDeniedTitle: string;
        cameraAccessDeniedDesc: string;
        detailsErrorTitle: string;
        detailsErrorDesc: string;
        imageGenErrorTitle: string;
        imageGenErrorDesc: string;
        detailsSuccessTitle: string;
        detailsSuccessDesc: string;
        socialErrorTitle: string;
        socialErrorDesc: string;
        copied: string;
        uploadMissingInfoTitle: string;
        uploadMissingInfoDesc: string;
        uploadSuccessTitle: string;
        uploadSuccessDesc: (name: string) => string;
    }
};


function Upload() {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const lang = searchParams.get('lang') || 'en';
    const { addProduct } = useArtisan();

    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productStory, setProductStory] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productPrice, setProductPrice] = useState('');

    const [socialContent, setSocialContent] = useState<{ content: Record<string, string>, imageDataUri: string } | null>(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [isSocialLoading, setIsSocialLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [productImage, setProductImage] = useState<string | null>(null);

    // Camera states
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // STT States
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);


    const [translatedContent, setTranslatedContent] = useState<TranslatedContent | null>(null);
    const [isTranslating, setIsTranslating] = useState(false);


    useEffect(() => {
        const originalContent = {
            headerTitle: "Upload Product",
            uploadTitle: "Upload Your Product",
            uploadDescription: "Add an image to get started with AI.",
            imageLabel: "1. Product Image",
            imagePlaceholder: "Drag & drop, select an option, or generate with AI",
            cameraButton: "Take Photo",
            galleryButton: "From Gallery",
            generateImageButton: "Generate with AI",
            categoryLabel: "2. Product Category",
            categoryPlaceholder: "AI will suggest a category",
            aiTitle: "AI-Generated Content",
            aiDescription: "Generate product details with the power of AI.",
            generateDetailsButton: "Generate Details with AI",
            nameLabel: "Product Name",
            namePlaceholder: "e.g., Handwoven Silk Scarf",
            descriptionLabel: "Product Description",
            descriptionPlaceholder: "Describe your product, its materials, dimensions, etc.",
            storyLabel: "Product Story",
            storyPlaceholder: "The story behind your craft...",
            priceLabel: "Product Price",
            pricePlaceholder: "Enter price in ₹",
            socialTitle: "Generate Social Media Posts",
            socialDescription: "Once your details are ready, let AI help market your product.",
            generateSocialButton: "Generate Social Media Content",
            actionsTitle: "Actions",
            previewButton: "Preview",
            uploadButton: "Upload Product",
            previewDialogTitle: "Post Preview",
            previewDialogDescription: "This is how your product will appear to buyers.",
            previewProductNamePlaceholder: "Product Name",
            previewDescriptionPlaceholder: "Product description will appear here.",
            previewStoryPlaceholder: "Your generated story will appear here.",
            cameraDialogTitle: "Take a Photo",
            cameraDialogDescription: "Center your product in the frame and capture the image.",
            captureButton: "Capture",
            cameraAccessTitle: "Camera Access Required",
            cameraAccessDescription: "Please allow camera access in your browser settings to use this feature.",
            listeningToastTitle: "Listening...",
            listeningToastDescription: "Start speaking your product story.",
            stoppedListeningToastTitle: "Stopped Listening.",
            micPermissionDeniedTitle: "Permission Denied",
            micPermissionDeniedDescription: "Microphone access was denied. Please allow it in your browser settings.",
            micNotSupportedTitle: "Not Supported",
            micNotSupportedDescription: "Speech recognition is not supported in this browser.",
            micErrorTitle: "Recognition Error",
            toasts: {
                cameraAccessDeniedTitle: 'Camera Access Denied',
                cameraAccessDeniedDesc: 'Please enable camera permissions in your browser settings.',
                detailsErrorTitle: 'Error',
                detailsErrorDesc: 'Please provide an image first.',
                imageGenErrorTitle: 'Image Generation Error',
                imageGenErrorDesc: 'Please provide a product name and category first.',
                detailsSuccessTitle: 'Success!',
                detailsSuccessDesc: 'Product details have been generated by AI.',
                socialErrorTitle: 'Error',
                socialErrorDesc: 'Failed to generate social media content.',
                copied: "Copied to clipboard!",
                uploadMissingInfoTitle: 'Missing Information',
                uploadMissingInfoDesc: 'Please ensure all product details, including price, are filled out before uploading.',
                uploadSuccessTitle: 'Upload Successful!',
                uploadSuccessDesc: (name: string) => `"${name}" has been added to your products.`
            }
        };

        const translateAll = async () => {
            if (lang === 'en') {
                const categoryNames = categories.reduce((acc, cat) => ({...acc, [cat]: cat}), {});
                setTranslatedContent({...originalContent, categoryNames});
                setIsTranslating(false);
                return;
            }

            setIsTranslating(true);
            try {
                const baseContent = { ...originalContent };
                 const textsToTranslate = [
                    ...Object.values(baseContent).filter(v => typeof v === 'string'),
                    ...Object.values(baseContent.toasts).filter(v => typeof v === 'string'),
                    ...categories
                ];

                const translationPromises = textsToTranslate.map(text => translateText({ text, targetLanguage: lang }));
                const translations = await Promise.all(translationPromises);
                
                const contentKeys = Object.keys(baseContent).filter(k => typeof (baseContent as any)[k] === 'string') as (keyof typeof originalContent)[];
                const toastKeys = Object.keys(baseContent.toasts).filter(k => typeof (baseContent.toasts as any)[k] === 'string') as (keyof typeof originalContent.toasts)[];
                
                const newTranslatedContent = {} as TranslatedContent;
                let tIndex = 0;
                contentKeys.forEach(key => {
                    (newTranslatedContent as any)[key] = translations[tIndex++].translatedText;
                });

                newTranslatedContent.toasts = {} as any;
                toastKeys.forEach(key => {
                    (newTranslatedContent.toasts as any)[key] = translations[tIndex++].translatedText;
                });
                
                newTranslatedContent.categoryNames = categories.reduce((acc, cat, index) => {
                    acc[cat] = translations[tIndex + index].translatedText;
                    return acc;
                }, {} as Record<string, string>);

                const uploadSuccessDescText = await translateText({text: "has been added to your products.", targetLanguage: lang});
                newTranslatedContent.toasts.uploadSuccessDesc = (name: string) => `"${name}" ${uploadSuccessDescText.translatedText}`;

                setTranslatedContent(newTranslatedContent);
            } catch (error) {
                console.error("Translation failed", error);
                const categoryNames = categories.reduce((acc, cat) => ({...acc, [cat]: cat}), {});
                setTranslatedContent({...originalContent, categoryNames});
            } finally {
                setIsTranslating(false);
            }
        };

        translateAll();
    }, [lang]);

    useEffect(() => {
        if (isCameraOpen && translatedContent) {
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
                        title: translatedContent.toasts.cameraAccessDeniedTitle,
                        description: translatedContent.toasts.cameraAccessDeniedDesc,
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
    }, [isCameraOpen, toast, translatedContent]);

    const handleImageChange = (dataUrl: string) => {
        setProductImage(dataUrl);
        // Reset details when image changes
        // setProductName('');
        // setProductDescription('');
        // setProductStory('');
    };
    
    const handleCategoryChange = (category: string) => {
        setProductCategory(category);
    };

    const handleGenerateImage = async () => {
        if (!translatedContent) return;
        if (!productName || !productCategory) {
            toast({ variant: 'destructive', title: translatedContent.toasts.imageGenErrorTitle, description: translatedContent.toasts.imageGenErrorDesc });
            return;
        }
        setIsImageLoading(true);
        setProductImage(null);
         try {
            const result = await generateProductImage({ productName, category: productCategory });
            handleImageChange(result.imageDataUri);
        } catch (error) {
            console.error("Failed to generate product image:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate product image.' });
        } finally {
            setIsImageLoading(false);
        }
    };


    const handleGenerateDetails = async () => {
        if (!translatedContent) return;
        if (!productImage) {
            toast({ variant: 'destructive', title: translatedContent.toasts.detailsErrorTitle, description: translatedContent.toasts.detailsErrorDesc });
            return;
        }
        
        setIsDetailsLoading(true);
        // Keep product name if user entered it
        if (!productName) setProductName('');
        setProductDescription('');
        setProductStory('');
        setProductCategory('');
        setProductPrice('');
        try {
            const result = await generateProductDetails({ productImageDataUri: productImage, targetLanguage: lang });
            if (!productName) setProductName(result.productName); // Only set if it was empty
            setProductDescription(result.productDescription);
            setProductStory(result.productStory);
            setProductCategory(result.predictedCategory);
            setProductPrice(result.suggestedPrice);
            toast({ title: translatedContent.toasts.detailsSuccessTitle, description: translatedContent.toasts.detailsSuccessDesc });
        } catch (error) {
            console.error("Failed to generate product details:", error);
            toast({ variant: 'destructive', title: translatedContent.toasts.detailsErrorTitle, description: 'Failed to generate product details.' });
        } finally {
            setIsDetailsLoading(false);
        }
    };

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
                handleImageChange(dataUrl);
                setIsCameraOpen(false);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleImageChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleGenerateSocial = async () => {
        if (!translatedContent) return;
        setIsSocialLoading(true);
        try {
            const result = await generateSocialMediaContent({
                productName: productName || "Handcrafted Product",
                productDescription: productDescription || "A beautiful handmade item.",
                productStory: productStory || "Handcrafted with passion, this item tells a story of tradition and nature.",
                socialMediaPlatforms: ["Instagram", "Facebook", "Twitter(X)"]
            });
            setSocialContent(result);
        } catch (error) {
            toast({ variant: 'destructive', title: translatedContent.toasts.socialErrorTitle, description: translatedContent.toasts.socialErrorDesc });
        } finally {
            setIsSocialLoading(false);
        }
    }

    const copyToClipboard = (text: string) => {
        if (!translatedContent) return;
        navigator.clipboard.writeText(text);
        toast({ title: translatedContent.toasts.copied });
    }

    const handlePreview = () => {
        const previewData = {
            productName,
            productDescription,
            productStory,
            productCategory,
            productImage,
            price: productPrice || '0.00'
        };
        sessionStorage.setItem('productPreview', JSON.stringify(previewData));
        router.push(`/artisan/upload/preview?lang=${lang}`);
    };

    const handleUpload = () => {
        if (!translatedContent) return;
        if (!productImage || !productName || !productDescription || !productStory || !productCategory || !productPrice) {
            toast({
                variant: 'destructive',
                title: translatedContent.toasts.uploadMissingInfoTitle,
                description: translatedContent.toasts.uploadMissingInfoDesc,
            });
            return;
        }

        setIsUploading(true);

        const newProduct: Product = {
            id: `prod-${Date.now()}`,
            name: productName,
            description: productDescription,
            story: productStory,
            category: productCategory,
            price: productPrice,
            image: {
                imageUrl: productImage,
                description: productName,
                imageHint: `${productCategory} ${productName.split(' ').slice(0, 2).join(' ')}`,
            },
            likes: 0,
            shares: 0,
            rating: 0,
            reviews: 0,
            revenue: 0,
            bought: 0,
            artisan: "Rohan Joshi" // Assuming current user
        };

        addProduct(newProduct);
        
        toast({
            title: translatedContent.toasts.uploadSuccessTitle,
            description: translatedContent.toasts.uploadSuccessDesc(productName),
        });

        // Simulate network delay then redirect
        setTimeout(() => {
            setIsUploading(false);
            router.push(`/artisan/dashboard/my-products?lang=${lang}`);
        }, 1000);
    };


    if (isTranslating || !translatedContent) {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <div className="p-4">
        <div className="grid grid-cols-1 gap-8 max-w-md mx-auto">
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">{translatedContent.uploadTitle}</CardTitle>
                    <CardDescription>{translatedContent.uploadDescription}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label>{translatedContent.imageLabel}</Label>
                        <div className="mt-2 flex justify-center items-center w-full h-48 border-2 border-dashed rounded-lg relative overflow-hidden">
                            {isImageLoading ? (
                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                    <p className="mt-2 text-sm">Generating Image...</p>
                                </div>
                            ) : productImage ? (
                                <Image src={productImage} alt="Product preview" fill className="object-contain p-2" />
                            ) : (
                                <div className="text-center p-4">
                                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <p className="mt-2 text-sm text-muted-foreground">{translatedContent.imagePlaceholder}</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 grid grid-cols-1 gap-4">
                            <Button variant="outline" onClick={() => setIsCameraOpen(true)}><Camera className="mr-2 h-4 w-4" /> {translatedContent.cameraButton}</Button>
                            
                            <Input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept="image/*" />
                            <Button variant="outline" asChild>
                                <Label htmlFor='file-upload' className="cursor-pointer flex items-center justify-center">
                                    <GalleryHorizontal className="mr-2 h-4 w-4" /> {translatedContent.galleryButton}
                                </Label>
                            </Button>
                        </div>
                    </div>
                    
                    <Card className="bg-primary/5">
                        <CardHeader>
                            <CardTitle className="font-headline text-xl flex items-center gap-2">
                                {translatedContent.aiTitle}
                            </CardTitle>
                            <CardDescription>
                                {translatedContent.aiDescription}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button onClick={handleGenerateDetails} disabled={isDetailsLoading || !productImage} className="w-full">
                            {isDetailsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            {translatedContent.generateDetailsButton}
                            </Button>

                            <div>
                                <Label htmlFor="product-name">{translatedContent.nameLabel}</Label>
                                <Input id="product-name" placeholder={translatedContent.namePlaceholder} value={productName} onChange={e => setProductName(e.target.value)} disabled={isDetailsLoading}/>
                            </div>
                           
                             <div>
                                <Label htmlFor="product-category">{translatedContent.categoryLabel}</Label>
                                <Input id="product-category" placeholder={translatedContent.categoryPlaceholder} value={productCategory} onChange={e => setProductCategory(e.target.value)} disabled={isDetailsLoading}/>
                            </div>
                            
                            <Button variant="outline" onClick={handleGenerateImage} disabled={isImageLoading || !productName || !productCategory} className="w-full">
                                {isImageLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                                {translatedContent.generateImageButton}
                            </Button>

                            <div>
                                <Label htmlFor="product-desc">{translatedContent.descriptionLabel}</Label>
                                <Textarea id="product-desc" placeholder={translatedContent.descriptionPlaceholder} value={productDescription} onChange={e => setProductDescription(e.target.value)} disabled={isDetailsLoading} rows={4}/>
                            </div>
                            <div>
                                <Label htmlFor="product-story">{translatedContent.storyLabel}</Label>
                                <Textarea id="product-story" placeholder={translatedContent.storyPlaceholder} value={productStory} onChange={e => setProductStory(e.target.value)} disabled={isDetailsLoading} rows={4} />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <div>
                        <Label htmlFor="product-price">{translatedContent.priceLabel}</Label>
                        <div className="relative mt-2">
                            <Input 
                                id="product-price" 
                                type="number"
                                placeholder={translatedContent.pricePlaceholder} 
                                value={productPrice} 
                                onChange={e => setProductPrice(e.target.value)} 
                                className="pl-8"
                                disabled={isDetailsLoading}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                <BadgeIndianRupee className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2">
                        {translatedContent.socialTitle}
                    </CardTitle>
                    <CardDescription>{translatedContent.socialDescription}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        {socialContent ? (
                            <div className='space-y-4'>
                                {socialContent.imageDataUri && (
                                     <div className="relative aspect-square w-full rounded-lg border overflow-hidden">
                                        <Image src={socialContent.imageDataUri} alt="Generated Social Media Image" fill className="object-cover" />
                                    </div>
                                )}
                                <Tabs defaultValue="Instagram">
                                    <TabsList>
                                        <TabsTrigger value="Instagram"><Instagram className="h-4 w-4 mr-2" /> Instagram</TabsTrigger>
                                        <TabsTrigger value="Facebook"><Facebook className="h-4 w-4 mr-2" /> Facebook</TabsTrigger>
                                        <TabsTrigger value="Twitter(X)"><Twitter className="h-4 w-4 mr-2" /> Twitter (X)</TabsTrigger>
                                    </TabsList>
                                    {Object.entries(socialContent.content).map(([platform, content]) => (
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
                            </div>
                        ) : (
                            <Button onClick={handleGenerateSocial} disabled={isSocialLoading || !productName} className="mt-2 w-full">
                                {isSocialLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />}
                                {translatedContent.generateSocialButton}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
        
        <div>
            <Card className="sticky bottom-4 top-auto mt-8">
                <CardHeader>
                    <CardTitle className="font-headline">{translatedContent.actionsTitle}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Button onClick={handlePreview} variant="outline" size="lg"><Eye className="mr-2 h-4 w-4" /> {translatedContent.previewButton}</Button>
                    <Button onClick={handleUpload} disabled={isUploading} size="lg">
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                        {translatedContent.uploadButton}
                    </Button>
                </CardContent>
            </Card>
        </div>

            <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{translatedContent.cameraDialogTitle}</DialogTitle>
                        <DialogDescription>{translatedContent.cameraDialogDescription}</DialogDescription>
                    </DialogHeader>
                    <div className="relative aspect-video w-full rounded-md bg-muted overflow-hidden">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                        <canvas ref={canvasRef} className="hidden" />
                    </div>
                    {hasCameraPermission === false && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>{translatedContent.cameraAccessTitle}</AlertTitle>
                            <AlertDescription>
                                {translatedContent.cameraAccessDescription}
                            </AlertDescription>
                        </Alert>
                    )}
                    <DialogFooter>
                        <Button onClick={handleCapture} disabled={hasCameraPermission !== true}>
                            <CircleDot className="mr-2 h-4 w-4" /> {translatedContent.captureButton}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
        </div>
    );
}


export default function UploadPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <Upload />
        </Suspense>
    )
}

    