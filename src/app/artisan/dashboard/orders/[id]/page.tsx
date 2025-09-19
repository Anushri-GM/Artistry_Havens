
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrders } from '@/context/OrderContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function UpdateOrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const { orders, updateOrderStatus } = useOrders();
  const { toast } = useToast();
  
  const order = orders.find(o => o.id === id);
  
  const [status, setStatus] = useState(order?.status || 'Processing');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  if (!order) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Order not found.</p>
      </div>
    );
  }
  
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
        updateOrderStatus(order.id, status);
        setIsSaving(false);
        toast({
            title: "Status Updated!",
            description: `Order ${order.id} has been marked as ${status}.`,
        });
        router.push('/artisan/dashboard/orders');
    }, 1000);
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft />
            </Button>
            <div>
                <h1 className="text-2xl font-bold font-headline">Update Order Status</h1>
                <p className="text-muted-foreground">Order ID: {order.id}</p>
            </div>
        </div>

        <Card>
            <CardHeader>
                <div className="flex gap-4">
                    {order.product.image && (
                         <div className="relative aspect-square w-24 rounded-lg overflow-hidden border flex-shrink-0">
                            <Image src={order.product.image.imageUrl} alt={order.product.name} fill className="object-cover" />
                        </div>
                    )}
                    <div className='flex-1'>
                        <CardTitle className="font-headline text-xl">{order.product.name}</CardTitle>
                        <CardDescription className="pt-2 text-sm">
                            <p><strong>Buyer:</strong> {order.buyer}</p>
                            <p><strong>Quantity:</strong> {order.quantity}</p>
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <h3 className="font-semibold">Current Status: {order.status}</h3>
                <div>
                    <Label htmlFor="status-group" className='font-semibold'>New Status</Label>
                    <RadioGroup id="status-group" value={status} onValueChange={(value) => setStatus(value as 'Processing' | 'Shipped' | 'Delivered')} className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Processing" id="processing" />
                            <Label htmlFor="processing">Processing</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Shipped" id="shipped" />
                            <Label htmlFor="shipped">Shipped</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Delivered" id="delivered" />
                            <Label htmlFor="delivered">Delivered</Label>
                        </div>
                    </RadioGroup>
                </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleSave} disabled={isSaving || status === order.status} className="w-full">
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Status
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
