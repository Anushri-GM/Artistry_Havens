

'use client';
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { mockProducts, mockReviews } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShoppingBag, Star, MessageSquare, Heart, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArtistryHavensLogo } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const productId = params.id as string;
  const product = mockProducts.find(p => p.id === productId);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  if (!product) {
    notFound();
  }

  const image = PlaceHolderImages.find(img => img.id === product.id);
  const artisanAvatar = PlaceHolderImages.find(img => img.id === "avatar-1");
  const reviews = mockReviews.filter(r => r.productId === productId);

  const handleLike = () => {
    toast({ title: `You liked ${product.name}!` });
  };
  
  const handleAddToCart = () => {
    toast({ title: `${product.name} added to cart!` });
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(rating > 0 && reviewText.trim() !== '') {
        toast({
            title: "Review Submitted!",
            description: "Thank you for your feedback."
        });
        setRating(0);
        setReviewText("");
    } else {
         toast({
            variant: "destructive",
            title: "Incomplete Review",
            description: "Please provide a rating and a comment."
        });
    }
  }

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-md bg-background">
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center justify-between p-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft />
                </Button>
                <h1 className="font-headline text-xl font-bold truncate">{product.name}</h1>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleLike}>
                    <Heart />
                </Button>
                <Button variant="ghost" size="icon">
                    <ShoppingBag />
                </Button>
            </div>
            </div>
        </header>
        <main>
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
                        <h1 className="font-headline text-2xl font-bold">{product.name}</h1>
                         <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={product.rating} readOnly/>
                            <span className="font-semibold ml-1 text-sm">{product.rating}</span>
                            <span className="text-muted-foreground text-sm">({product.reviews} reviews)</span>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-primary">${product.price}</p>
                </div>
                
                <Card className="bg-primary/5">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={artisanAvatar?.imageUrl} />
                                <AvatarFallback>{product.artisan.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-xs text-muted-foreground">Created by</p>
                                <CardTitle className="font-headline text-lg">{product.artisan}</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <div>
                    <h3 className="font-headline text-lg font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
                
                 <div>
                    <h3 className="font-headline text-lg font-semibold mb-2">The Story Behind</h3>
                    <p className="text-sm text-muted-foreground italic">{product.story}</p>
                </div>
                
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t flex gap-2 w-full max-w-md mx-auto">
                    <Button size="lg" variant="outline" className="flex-1">
                        <MessageSquare className="mr-2 h-4 w-4" /> Message
                    </Button>
                    <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                        <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                </div>
            </div>

            <div className="p-4 pt-0 mb-24">
                <h2 className="font-headline text-xl font-bold mb-4">Ratings & Reviews</h2>
                <div className="space-y-6">
                    <div>
                         <h3 className="font-headline text-lg font-semibold mb-4">Write a Review</h3>
                         <Card>
                            <CardContent className="p-4">
                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                    <div>
                                        <label className="font-medium mb-2 block text-sm">Your Rating</label>
                                        <StarRating rating={rating} setRating={setRating} />
                                    </div>
                                    <div>
                                        <label htmlFor="review-text" className="font-medium mb-2 block text-sm">Your Review</label>
                                        <Textarea 
                                            id="review-text"
                                            placeholder="What did you like or dislike?"
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full">Submit Review</Button>
                                </form>
                            </CardContent>
                         </Card>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-headline text-lg font-semibold">What others are saying</h3>
                        {reviews.length > 0 ? (
                            reviews.map(review => (
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
                                        <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <p className="text-muted-foreground text-sm">No reviews yet. Be the first to write one!</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
      </div>
    </div>
  )
}

    