
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/lib/mock-data";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const orders = [
  { id: 'ORD001', product: mockProducts[0], quantity: 2, buyer: 'Anjali P.', phone: '+91 12345 67890', status: 'Processing' },
  { id: 'ORD002', product: mockProducts[2], quantity: 1, buyer: 'Ravi K.', phone: '+91 23456 78901', status: 'Shipped' },
  { id: 'ORD003', product: mockProducts[4], quantity: 1, buyer: 'Sunita M.', phone: '+91 34567 89012', status: 'Delivered' },
];

export default function MyOrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Orders</h1>
        <p className="text-muted-foreground">Manage and track all your customer orders.</p>
      </div>
      <div className="space-y-6">
        {orders.map(order => (
          <Card key={order.id}>
            <div className="flex flex-col sm:flex-row gap-4">
               {order.product.image && (
                <div className="w-full sm:w-1/4 p-4 sm:p-0 sm:pl-4 sm:py-4">
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
                        <Image src={order.product.image.imageUrl} alt={order.product.name} fill className="object-cover" />
                    </div>
                </div>
              )}
              <div className="flex-1">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{order.product.name}</CardTitle>
                        <CardDescription className="pt-2">
                            <p><strong>Order ID:</strong> {order.id}</p>
                            <p><strong>Buyer:</strong> {order.buyer}</p>
                            <p><strong>Quantity:</strong> {order.quantity}</p>
                            <p><strong>Contact:</strong> {order.phone}</p>
                        </CardDescription>
                    </div>
                    <Badge variant={order.status === 'Delivered' ? 'default' : (order.status === 'Shipped' ? 'secondary' : 'outline')}>
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-end gap-2 bg-background/50 p-4">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button size="sm">Update Status</Button>
                </CardFooter>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
