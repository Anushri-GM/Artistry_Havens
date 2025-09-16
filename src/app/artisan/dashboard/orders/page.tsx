import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/lib/mock-data";

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
      <Card>
        <CardHeader>
          <CardTitle>Active Orders</CardTitle>
          <CardDescription>A list of products ordered by buyers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.product.name}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.buyer}</TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'Delivered' ? 'default' : (order.status === 'Shipped' ? 'secondary' : 'outline')}>
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
