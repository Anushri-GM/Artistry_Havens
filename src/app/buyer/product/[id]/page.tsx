

'use client';
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { mockProducts, mockReviews } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShoppingBag, Star, MessageSquare, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArtistryHavensLogo } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

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
                                : 'text-yellow-500 fill-yellow-400/50'
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
    <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-20 items-center justify-between p-4">
            <div className="flex items-center gap-2">
                <Link href="/buyer">
                    <ArtistryHavensLogo className="h-8 w-8 text-primary" />
                </Link>
                <Link href="/buyer">
                    <h1 className="font-headline text-2xl font-bold">Artistry Havens</h1>
                </Link>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                    <Link href="/buyer/login">Login</Link>
                </Button>
                <Button variant="ghost" size="icon">
                    <ShoppingBag />
                </Button>
            </div>
            </div>
        </header>
        <main className="container mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    {image && (
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src={image.imageUrl}
                            alt={image.description}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                        />
                        </div>
                    )}
                </div>
                <div className="space-y-6">
                    <h1 className="font-headline text-4xl font-bold">{product.name}</h1>
                    <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1">
                            <StarRating rating={product.rating} readOnly/>
                            <span className="font-semibold ml-1">{product.rating}</span>
                            <span className="text-muted-foreground">({product.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <Heart className="h-4 w-4" />
                            <span>{product.likes?.toLocaleString()} likes</span>
                        </div>
                    </div>
                    <p className="text-4xl font-semibold text-primary">${product.price}</p>
                    
                    <div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Description</h3>
                        <p className="text-muted-foreground">{product.description}</p>
                    </div>
                    
                     <div>
                        <h3 className="font-headline text-xl font-semibold mb-2">The Story Behind</h3>
                        <p className="text-muted-foreground italic">{product.story}</p>
                    </div>

                    <Card className="bg-primary/5">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={artisanAvatar?.imageUrl} />
                                    <AvatarFallback>{product.artisan.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm text-muted-foreground">Created by</p>
                                    <CardTitle className="font-headline text-xl">{product.artisan}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                            <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
                        </Button>
                         <Button size="lg" variant="outline" className="flex-1" onClick={handleLike}>
                            <Heart className="mr-2 h-5 w-5" /> Like Product
                        </Button>
                    </div>
                     <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" variant="outline" className="flex-1">
                            <MessageSquare className="mr-2 h-5 w-5" /> Message Artisan
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-16">
                <h2 className="font-headline text-3xl font-bold mb-8">Ratings & Reviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h3 className="font-headline text-xl font-semibold">What others are saying</h3>
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <Card key={review.id}>
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={review.avatarUrl} />
                                                <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{review.author}</p>
                                                <StarRating rating={review.rating} readOnly />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground italic">"{review.comment}"</p>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <p className="text-muted-foreground">No reviews yet. Be the first to write one!</p>
                        )}
                    </div>
                    <div>
                         <h3 className="font-headline text-xl font-semibold mb-4">Write a Review</h3>
                         <Card>
                            <CardContent className="p-6">
                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                    <div>
                                        <label className="font-medium mb-2 block">Your Rating</label>
                                        <StarRating rating={rating} setRating={setRating} />
                                    </div>
                                    <div>
                                        <label htmlFor="review-text" className="font-medium mb-2 block">Your Review</label>
                                        <Textarea 
                                            id="review-text"
                                            placeholder="What did you like or dislike?"
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full">Submit Review</Button>
                                </form>
                            </CardContent>
                         </Card>
                    </div>
                </div>
            </div>
        </main>
    </div>
  )
}

    
