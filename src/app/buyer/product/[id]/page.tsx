

'use client';
import Image from "next/image";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { mockProducts, mockReviews } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Star, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, Suspense } from "react";
import { translateText } from "@/ai/flows/translate-text";

const StarRating = ({ rating, setRating, readOnly = false }: { rating: number, setRating?: (rating: number) => void, readOnly?: boolean }) => {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <button
                        key={index}
                        type="button"
                        className={`transition-colors ${readOnly ? '' : 'cursor-pointer'}`}
                        onClick={() => !readOnly && setRating?.(ratingValue)}
                        onMouseEnter={() => !readOnly && setHover(ratingValue)}
                        onMouseLeave={() => !readOnly && setHover(0)}
                    >
                        <Star
                            className={`h-5 w-5 ${
                                ratingValue <= (hover || rating)
                                ? 'text-yellow-500 fill-yellow-400'
                                : 'text-yellow-500/30'
                            }`}
                        />
                    </button>
                );
            })}
        </div>
    );
};

type TranslatedContent = {
    reviewsLabel: string;
    createdByLabel: string;
    descriptionLabel: string;
    storyLabel: string;
    ratingsAndReviewsLabel: string;
    writeReviewLabel: string;
    yourRatingLabel: string;
    yourReviewLabel: string;
    reviewPlaceholder: string;
    submitReviewButton: string;
    whatOthersSayingLabel: string;
    noReviewsLabel: string;
    messageButton: string;
    addToCartButton: string;
    toastLiked: (name: string) => string;
    toastAddedToCart: (name: string) => string;
    toastReviewSuccessTitle: string;
    toastReviewSuccessDesc: string;
    toastReviewErrorTitle: string;
    toastReviewErrorDesc: string;
};

type TranslatedProduct = (typeof mockProducts)[0] & {
    translatedName: string;
    translatedDescription: string;
    translatedStory: string;
};

type TranslatedReview = (typeof mockReviews)[0] & {
    translatedComment: string;
};

function ProductDetail() {
  const params = useParams();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  const { toast } = useToast();
  
  const productId = params.id as string;
  const product = mockProducts.find(p => p.id === productId);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [translatedContent, setTranslatedContent] = useState<TranslatedContent | null>(null);
  const [translatedProduct, setTranslatedProduct] = useState<TranslatedProduct | null>(null);
  const [translatedReviews, setTranslatedReviews] = useState<TranslatedReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  if (!product) {
    notFound();
  }

  const reviews = mockReviews.filter(r => r.productId === productId);

  useEffect(() => {
    const original = {
        reviewsLabel: "reviews",
        createdByLabel: "Created by",
        descriptionLabel: "Description",
        storyLabel: "The Story Behind",
        ratingsAndReviewsLabel: "Ratings & Reviews",
        writeReviewLabel: "Write a Review",
        yourRatingLabel: "Your Rating",
        yourReviewLabel: "Your Review",
        reviewPlaceholder: "What did you like or dislike?",
        submitReviewButton: "Submit Review",
        whatOthersSayingLabel: "What others are saying",
        noReviewsLabel: "No reviews yet. Be the first to write one!",
        messageButton: "Message",
        addToCartButton: "Add to Cart",
        toastLiked: (name: string) => `You liked ${name}!`,
        toastAddedToCart: (name: string) => `${name} added to cart!`,
        toastReviewSuccessTitle: "Review Submitted!",
        toastReviewSuccessDesc: "Thank you for your feedback.",
        toastReviewErrorTitle: "Incomplete Review",
        toastReviewErrorDesc: "Please provide a rating and a comment.",
    };

    const translate = async () => {
        setIsLoading(true);
        if (lang === 'en') {
            setTranslatedContent(original);
            setTranslatedProduct({ ...product, translatedName: product.name, translatedDescription: product.description, translatedStory: product.story });
            setTranslatedReviews(reviews.map(r => ({...r, translatedComment: r.comment})));
            setIsLoading(false);
            return;
        }

        try {
            const staticTexts = Object.values(original).filter(v => typeof v === 'string');
            const dynamicTexts = [product.name, product.description, product.story, ...reviews.map(r => r.comment)];
            const allTexts = [...staticTexts, ...dynamicTexts];

            const translations = await Promise.all(allTexts.map(t => translateText({ text: t, targetLanguage: lang })));
            
            const newContent: any = {};
            let i = 0;
            Object.keys(original).forEach(key => {
                if (typeof (original as any)[key] === 'string') {
                    newContent[key] = translations[i++].translatedText;
                }
            });

            const translatedName = translations[i++].translatedText;
            newContent.toastLiked = () => `${translatedName} liked!`;
            newContent.toastAddedToCart = () => `${translatedName} added to cart!`;
            setTranslatedContent(newContent);
            
            setTranslatedProduct({
                ...product,
                translatedName: translatedName,
                translatedDescription: translations[i++].translatedText,
                translatedStory: translations[i++].translatedText
            });

            const newTranslatedReviews = reviews.map((_, reviewIndex) => ({
                ...reviews[reviewIndex],
                translatedComment: translations[i + reviewIndex].translatedText
            }));
            setTranslatedReviews(newTranslatedReviews);

        } catch (error) {
            console.error("Translation failed for product page", error);
            setTranslatedContent(original);
            setTranslatedProduct({ ...product, translatedName: product.name, translatedDescription: product.description, translatedStory: product.story });
            setTranslatedReviews(reviews.map(r => ({...r, translatedComment: r.comment})));
        } finally {
            setIsLoading(false);
        }
    };
    translate();
  }, [lang, product]);

  const image = PlaceHolderImages.find(img => img.id === product.id);
  const artisanAvatar = PlaceHolderImages.find(img => img.id === "avatar-1");

  const handleAddToCart = () => {
    if (!translatedContent || !translatedProduct) return;
    toast({ title: translatedContent.toastAddedToCart(translatedProduct.translatedName) });
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!translatedContent) return;
    if(rating > 0 && reviewText.trim() !== '') {
        toast({
            title: translatedContent.toastReviewSuccessTitle,
            description: translatedContent.toastReviewSuccessDesc,
        });
        setRating(0);
        setReviewText("");
    } else {
         toast({
            variant: "destructive",
            title: translatedContent.toastReviewErrorTitle,
            description: translatedContent.toastReviewErrorDesc,
        });
    }
  }

  if (isLoading || !translatedContent || !translatedProduct) {
      return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto">
          <div>
              {image && (
                  <div className="relative aspect-square w-full">
                  <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover"
                      data-ai-hint={image.imageHint}
                      priority
                  />
                  </div>
              )}
          </div>

          <div className="p-4 space-y-6">
              <div className="flex items-start justify-between">
                  <div>
                      <h1 className="font-headline text-2xl font-bold">{translatedProduct.translatedName}</h1>
                       <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={product.rating} readOnly/>
                          <span className="font-semibold ml-1 text-sm">{product.rating}</span>
                          <span className="text-muted-foreground text-sm">({product.reviews} {translatedContent.reviewsLabel})</span>
                      </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">₹{product.price}</p>
              </div>
              
              <Card className="bg-primary/5">
                  <CardHeader>
                      <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                              <AvatarImage src={artisanAvatar?.imageUrl} />
                              <AvatarFallback>{product.artisan.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                              <p className="text-xs text-muted-foreground">{translatedContent.createdByLabel}</p>
                              <CardTitle className="font-headline text-lg">{product.artisan}</CardTitle>
                          </div>
                      </div>
                  </CardHeader>
              </Card>

              <div>
                  <h3 className="font-headline text-lg font-semibold mb-2">{translatedContent.descriptionLabel}</h3>
                  <p className="text-sm text-muted-foreground">{translatedProduct.translatedDescription}</p>
              </div>
              
               <div>
                  <h3 className="font-headline text-lg font-semibold mb-2">{translatedContent.storyLabel}</h3>
                  <p className="text-sm text-muted-foreground italic">{translatedProduct.translatedStory}</p>
              </div>
          </div>

          <div className="p-6 pt-0">
              <h2 className="font-headline text-xl font-bold mb-4">{translatedContent.ratingsAndReviewsLabel}</h2>
              <div className="space-y-6">
                  <div>
                       <h3 className="font-headline text-lg font-semibold mb-4">{translatedContent.writeReviewLabel}</h3>
                       <Card>
                          <CardContent className="p-4">
                              <form onSubmit={handleReviewSubmit} className="space-y-4">
                                  <div>
                                      <label className="font-medium mb-2 block text-sm">{translatedContent.yourRatingLabel}</label>
                                      <StarRating rating={rating} setRating={setRating} />
                                  </div>
                                  <div>
                                      <label htmlFor="review-text" className="font-medium mb-2 block text-sm">{translatedContent.yourReviewLabel}</label>
                                      <Textarea 
                                          id="review-text"
                                          placeholder={translatedContent.reviewPlaceholder}
                                          value={reviewText}
                                          onChange={(e) => setReviewText(e.target.value)}
                                          rows={3}
                                      />
                                  </div>
                                  <Button type="submit" className="w-full">{translatedContent.submitReviewButton}</Button>
                              </form>
                          </CardContent>
                       </Card>
                  </div>
                  <div className="space-y-4">
                      <h3 className="font-headline text-lg font-semibold">{translatedContent.whatOthersSayingLabel}</h3>
                      {translatedReviews.length > 0 ? (
                          translatedReviews.map(review => (
                              <Card key={review.id}>
                                  <CardHeader className="p-4">
                                      <div className="flex items-center gap-3">
                                          <Avatar className="h-10 w-10">
                                              <AvatarImage src={review.avatarUrl} />
                                              <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                                          </Avatar>
                                          <div>
                                              <p className="font-semibold text-sm">{review.author}</p>
                                              <StarRating rating={review.rating} readOnly />
                                          </div>
                                      </div>
                                  </CardHeader>
                                  <CardContent className="px-4 pb-4">
                                      <p className="text-sm text-muted-foreground italic">"{review.translatedComment}"</p>
                                  </CardContent>
                              </Card>
                          ))
                      ) : (
                          <p className="text-muted-foreground text-sm">{translatedContent.noReviewsLabel}</p>
                      )}
                  </div>
              </div>
          </div>
      </main>
      <footer className="sticky bottom-0 p-4 bg-background border-t flex gap-2 w-full">
          <Button size="lg" variant="outline" className="flex-1">
              <MessageSquare className="mr-2 h-4 w-4" /> {translatedContent.messageButton}
          </Button>
          <Button size="lg" className="flex-1" onClick={handleAddToCart}>
              <ShoppingBag className="mr-2 h-4 w-4" /> {translatedContent.addToCartButton}
          </Button>
      </footer>
    </>
  )
}


export default function ProductDetailPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <ProductDetail />
        </Suspense>
    )
}
