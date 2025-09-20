
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useArtisan } from "@/context/ArtisanContext";
import Link from "next/link";
import { format } from 'date-fns';
import type { Order } from "@/context/ArtisanContext";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { translateText } from "@/ai/flows/translate-text";

type TranslatedContent = {
    title: string;
    description: string;
    orderListTitles: {
        Processing: string;
        Shipped: string;
        Delivered: string;
    };
    cardLabels: {
        orderId: string;
        buyer: string;
        quantity: string;
        orderDate: string;
        deliverBy: string;
    };
    buttons: {
        details: string;
        update: string;
    };
    noOrders: string;
    productNames: Record<string, string>;
};


function OrderList({ title, orders, labels, buttons, productNames, lang }: { title: string, orders: Order[], labels: TranslatedContent['cardLabels'], buttons: TranslatedContent['buttons'], productNames: Record<string, string>, lang: string }) {
    if (orders.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">{title}</h2>
            {orders.map(order => (
              <Card key={order.id}>
                <div className="flex flex-col sm:flex-row gap-4">
                   {order.product.image && (
                    <div className="w-full sm:w-1/3 p-4 flex-shrink-0">
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
                            <Image src={order.product.image.imageUrl} alt={order.product.name} fill className="object-cover" />
                        </div>
                    </div>
                  )}
                  <div className="flex-1 flex flex-col p-4 pt-0 sm:pt-4">
                    <CardHeader className="p-0">
                        <CardTitle className="text-lg font-headline">{productNames[order.product.id] || order.product.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 mt-4 flex-1">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div>
                                <p className="font-semibold text-muted-foreground">{labels.orderId}</p>
                                <p>{order.id}</p>
                            </div>
                             <div>
                                <p className="font-semibold text-muted-foreground">{labels.buyer}</p>
                                <p>{order.buyer}</p>
                            </div>
                             <div>
                                <p className="font-semibold text-muted-foreground">{labels.quantity}</p>
                                <p>{order.quantity}</p>
                            </div>
                             <div>
                                <p className="font-semibold text-muted-foreground">{labels.orderDate}</p>
                                <p>{format(order.orderDate, 'PPp')}</p>
                            </div>
                             <div className="col-span-2">
                                <p className="font-semibold text-muted-foreground">{labels.deliverBy}</p>
                                <p>{format(order.expectedDelivery, 'PPP')}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="p-0 mt-4 flex justify-end gap-2">
                        <Button variant="outline" size="sm">{buttons.details}</Button>
                        <Button size="sm" asChild>
                            <Link href={`/artisan/dashboard/orders/${order.id}?lang=${lang}`}>{buttons.update}</Link>
                        </Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
        </div>
    )
}

function MyOrders() {
  const { orders } = useArtisan();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';

  const [translatedContent, setTranslatedContent] = useState<TranslatedContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const originalContent = {
        title: "My Orders",
        description: "Manage and track all your customer orders.",
        orderListTitles: {
            Processing: "Processing",
            Shipped: "Shipped",
            Delivered: "Delivered",
        },
        cardLabels: {
            orderId: "Order ID",
            buyer: "Buyer",
            quantity: "Quantity",
            orderDate: "Order Date",
            deliverBy: "Deliver By",
        },
        buttons: {
            details: "Details",
            update: "Update",
        },
        noOrders: "You have no orders.",
    };

    const translateAll = async () => {
        if (lang === 'en') {
            const productNames = orders.reduce((acc, o) => ({...acc, [o.product.id]: o.product.name}), {});
            setTranslatedContent({...originalContent, productNames });
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const textsToTranslate = [
                originalContent.title,
                originalContent.description,
                ...Object.values(originalContent.orderListTitles),
                ...Object.values(originalContent.cardLabels),
                ...Object.values(originalContent.buttons),
                originalContent.noOrders,
                ...orders.map(o => o.product.name)
            ];

            const translations = await Promise.all(textsToTranslate.map(text => translateText({ text, targetLanguage: lang })));
            let i = 0;

            const newContent: TranslatedContent = {
                title: translations[i++].translatedText,
                description: translations[i++].translatedText,
                orderListTitles: {
                    Processing: translations[i++].translatedText,
                    Shipped: translations[i++].translatedText,
                    Delivered: translations[i++].translatedText,
                },
                cardLabels: {
                    orderId: translations[i++].translatedText,
                    buyer: translations[i++].translatedText,
                    quantity: translations[i++].translatedText,
                    orderDate: translations[i++].translatedText,
                    deliverBy: translations[i++].translatedText,
                },
                buttons: {
                    details: translations[i++].translatedText,
                    update: translations[i++].translatedText,
                },
                noOrders: translations[i++].translatedText,
                productNames: orders.reduce((acc, order, index) => {
                    acc[order.product.id] = translations[i + index].translatedText;
                    return acc;
                }, {} as Record<string, string>),
            };
            setTranslatedContent(newContent);
        } catch (error) {
            console.error("Translation failed for My Orders page:", error);
            const productNames = orders.reduce((acc, o) => ({...acc, [o.product.id]: o.product.name}), {});
            setTranslatedContent({...originalContent, productNames });
        } finally {
            setIsLoading(false);
        }
    };
    translateAll();
  }, [lang, orders]);
  

  const processingOrders = orders.filter(o => o.status === 'Processing');
  const shippedOrders = orders.filter(o => o.status === 'Shipped');
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');

  if (isLoading || !translatedContent) {
    return <div className="flex h-full items-center justify-center">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{translatedContent.title}</h1>
        <p className="text-muted-foreground">{translatedContent.description}</p>
      </div>
      
      <div className="space-y-8">
        <OrderList title={translatedContent.orderListTitles.Processing} orders={processingOrders} labels={translatedContent.cardLabels} buttons={translatedContent.buttons} productNames={translatedContent.productNames} lang={lang} />
        <OrderList title={translatedContent.orderListTitles.Shipped} orders={shippedOrders} labels={translatedContent.cardLabels} buttons={translatedContent.buttons} productNames={translatedContent.productNames} lang={lang} />
        <OrderList title={translatedContent.orderListTitles.Delivered} orders={deliveredOrders} labels={translatedContent.cardLabels} buttons={translatedContent.buttons} productNames={translatedContent.productNames} lang={lang} />

        {orders.length === 0 && (
            <p className="text-center text-muted-foreground">{translatedContent.noOrders}</p>
        )}
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
    return (
        <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
            <MyOrders />
        </Suspense>
    )
}
