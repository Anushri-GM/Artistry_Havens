
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/context/OrderContext";
import Link from "next/link";

export default function MyOrdersPage() {
  const { orders } = useOrders();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Orders</h1>
        <p className="text-muted-foreground">Manage and track all your customer orders.</p>
      </div>
      <div className="space-y-6">
        {orders.map(order => (
          <Card key={order.id}>
            <div className="flex flex-row gap-4">
               {order.product.image && (
                <div className="w-1/3 p-4 flex-shrink-0">
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
                        <Image src={order.product.image.imageUrl} alt={order.product.name} fill className="object-cover" />
                    </div>
                </div>
              )}
              <div className="flex-1 flex flex-col">
                <CardHeader className="flex-1 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg font-headline">{order.product.name}</CardTitle>
                        <CardDescription className="pt-2 text-xs">
                            <p><strong>Order ID:</strong> {order.id}</p>
                            <p><strong>Buyer:</strong> {order.buyer}</p>
                            <p><strong>Qty:</strong> {order.quantity}</p>
                        </CardDescription>
                    </div>
                    <Badge variant={order.status === 'Delivered' ? 'default' : (order.status === 'Shipped' ? 'secondary' : 'outline')}>
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-end gap-2 bg-background/50 p-4 pt-2">
                    <Button variant="outline" size="sm">Details</Button>
                    <Button size="sm" asChild>
                        <Link href={`/artisan/dashboard/orders/${order.id}`}>Update</Link>
                    </Button>
                </CardFooter>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
