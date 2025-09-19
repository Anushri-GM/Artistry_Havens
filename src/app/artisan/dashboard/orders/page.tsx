
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/context/OrderContext";
import Link from "next/link";
import { format } from 'date-fns';
import type { Order } from "@/context/OrderContext";

function OrderList({ title, orders }: { title: string, orders: Order[] }) {
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
                        <CardTitle className="text-lg font-headline">{order.product.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 mt-4 flex-1">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div>
                                <p className="font-semibold text-muted-foreground">Order ID</p>
                                <p>{order.id}</p>
                            </div>
                             <div>
                                <p className="font-semibold text-muted-foreground">Buyer</p>
                                <p>{order.buyer}</p>
                            </div>
                             <div>
                                <p className="font-semibold text-muted-foreground">Quantity</p>
                                <p>{order.quantity}</p>
                            </div>
                             <div>
                                <p className="font-semibold text-muted-foreground">Order Date</p>
                                <p>{format(order.orderDate, 'PPp')}</p>
                            </div>
                             <div className="col-span-2">
                                <p className="font-semibold text-muted-foreground">Deliver By</p>
                                <p>{format(order.expectedDelivery, 'PPP')}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="p-0 mt-4 flex justify-end gap-2">
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
    )
}

export default function MyOrdersPage() {
  const { orders } = useOrders();

  const processingOrders = orders.filter(o => o.status === 'Processing');
  const shippedOrders = orders.filter(o => o.status === 'Shipped');
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Orders</h1>
        <p className="text-muted-foreground">Manage and track all your customer orders.</p>
      </div>
      
      <div className="space-y-8">
        <OrderList title="Processing" orders={processingOrders} />
        <OrderList title="Shipped" orders={shippedOrders} />
        <OrderList title="Delivered" orders={deliveredOrders} />

        {orders.length === 0 && (
            <p className="text-center text-muted-foreground">You have no orders.</p>
        )}
      </div>
    </div>
  );
}
