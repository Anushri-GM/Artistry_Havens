
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { translateText } from '@/ai/flows/translate-text';
import { Suspense } from 'react';
import { useArtisan } from '@/context/ArtisanContext';
import type { SavedProduct as Product } from '@/context/ArtisanContext';
import { Button } from '@/components/ui/button';
import { X, MessageSquare, Pencil, Check } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

type TranslatedContent = {
    title: string;
    description: string;
    removeButton: string;
    notesPlaceholder: string;
    editNotesButton: string;
    saveNotesButton: string;
    noSavedProducts: string;
};

type TranslatedProduct = Product & {
    translatedName?: string;
};

function SavedProductCard({ product, onRemove, onNoteChange }: { product: TranslatedProduct, onRemove: (id: string) => void, onNoteChange: (id: string, note: string) => void }) {
    const { toast } = useToast();
    const [isEditingNote, setIsEditingNote] = React.useState(false);
    const [note, setNote] = React.useState(product.note || '');

    const handleNoteSave = () => {
        onNoteChange(product.id, note);
        setIsEditingNote(false);
        toast({ title: "Note saved!" });
    };

    return (
        <Card className="overflow-hidden flex flex-col">
            {product.image && (
                <div className="relative w-full aspect-[4/3]">
                    <Image
                        src={product.image.imageUrl}
                        alt={product.image.description}
                        fill
                        className="object-cover"
                        data-ai-hint={product.image.imageHint}
                    />
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => onRemove(product.id)}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                    </Button>
                </div>
            )}
            <CardHeader className="p-3">
                <CardTitle className="font-headline text-sm leading-tight">{product.translatedName || product.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 flex-1">
                <div className="space-y-2">
                    {isEditingNote ? (
                        <Textarea 
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add your inspiration..."
                            className="text-xs"
                            rows={3}
                        />
                    ) : (
                        <p className="text-xs text-muted-foreground italic">
                            {product.note || "No notes yet."}
                        </p>
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-3 pt-0 mt-auto flex justify-end">
                {isEditingNote ? (
                     <Button variant="default" size="sm" className="h-7 text-xs" onClick={handleNoteSave}>
                        <Check className="mr-2 h-3 w-3" /> Save Note
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setIsEditingNote(true)}>
                        <Pencil className="mr-2 h-3 w-3" /> Edit Note
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

function SavedCollection() {
    const { savedProducts, removeSavedProduct, updateSavedProductNote } = useArtisan();
    const searchParams = useSearchParams();
    const lang = searchParams.get('lang') || 'en';
    const { toast } = useToast();

    const [translatedContent, setTranslatedContent] = React.useState<TranslatedContent | null>(null);
    const [translatedProducts, setTranslatedProducts] = React.useState<TranslatedProduct[]>(savedProducts);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const originalContent = {
            title: "My Moodboard",
            description: "A collection of your saved inspirations. Add notes to capture your ideas.",
            removeButton: "Remove",
            notesPlaceholder: "Add your inspiration...",
            editNotesButton: "Edit Note",
            saveNotesButton: "Save Note",
            noSavedProducts: "You haven't saved any products yet. Explore trends to find inspiration!",
        };

        const translate = async () => {
            if (lang === 'en') {
                setTranslatedContent(originalContent);
                setTranslatedProducts(savedProducts.map(p => ({ ...p, translatedName: p.name })));
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const textsToTranslate = [
                    ...Object.values(originalContent),
                    ...savedProducts.map(p => p.name)
                ];

                const translations = await Promise.all(
                    textsToTranslate.map(text => translateText({ text, targetLanguage: lang }))
                );
                
                const contentKeys = Object.keys(originalContent) as (keyof TranslatedContent)[];
                const newContent: any = {};
                contentKeys.forEach((key, index) => {
                    newContent[key] = translations[index].translatedText;
                });

                const newTranslatedProducts = savedProducts.map((p, index) => ({
                    ...p,
                    translatedName: translations[contentKeys.length + index].translatedText
                }));
                setTranslatedProducts(newTranslatedProducts);
                setTranslatedContent(newContent);

            } catch (error) {
                console.error("Failed to translate Saved Collection:", error);
                setTranslatedContent(originalContent);
                setTranslatedProducts(savedProducts.map(p => ({ ...p, translatedName: p.name })));
            } finally {
                setIsLoading(false);
            }
        };

        translate();
    }, [lang, savedProducts]);

    const handleRemoveProduct = (productId: string) => {
        const product = savedProducts.find(p => p.id === productId);
        removeSavedProduct(productId);
        if (product) {
            toast({
                title: "Removed from Moodboard",
                description: `"${product.name}" has been removed.`,
            });
        }
    };
    
    const handleNoteChange = (productId: string, note: string) => {
        updateSavedProductNote(productId, note);
    };

    if (isLoading || !translatedContent) {
        return <div className="flex h-full items-center justify-center">Loading...</div>;
    }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{translatedContent.title}</h1>
        <p className="text-muted-foreground">{translatedContent.description}</p>
      </div>

      {savedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {translatedProducts.map(product => (
                <SavedProductCard key={product.id} product={product} onRemove={handleRemoveProduct} onNoteChange={handleNoteChange} />
            ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-10">
            <p>{translatedContent.noSavedProducts}</p>
        </div>
      )}
    </div>
  );
}

export default function SavedCollectionPage() {
    return (
        <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
            <SavedCollection />
        </Suspense>
    )
}
