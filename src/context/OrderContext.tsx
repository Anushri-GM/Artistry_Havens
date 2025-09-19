
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockProducts } from '@/lib/mock-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// Define types
interface Product {
  id: string;
  name: string;
  price: string;
  image?: {
    imageUrl: string;
    description: string;
    imageHint: string;
  };
}

interface Order {
  id: string;
  product: Product;
  quantity: number;
  buyer: string;
  phone: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
}

interface OrderRequest {
  id: string;
  buyer: string;
  image: { imageUrl: string } | undefined;
  description: string;
  isAiRequest: boolean;
}

interface OrderContextType {
  orders: Order[];
  requests: OrderRequest[];
  acceptRequest: (requestId: string) => void;
  denyRequest: (requestId: string) => void;
}

// Initial Data
const initialOrders: Order[] = [
  { id: 'ORD001', product: mockProducts[0], quantity: 2, buyer: 'Anjali P.', phone: '+91 12345 67890', status: 'Processing' },
  { id: 'ORD002', product: mockProducts[2], quantity: 1, buyer: 'Ravi K.', phone: '+91 23456 78901', status: 'Shipped' },
  { id: 'ORD003', product: mockProducts[4], quantity: 1, buyer: 'Sunita M.', phone: '+91 34567 89012', status: 'Delivered' },
];

const initialRequests: OrderRequest[] = [
  {
    id: "REQ001",
    buyer: "Priya Desai",
    image: PlaceHolderImages.find(p => p.id === "jewelry-1"),
    description: "I love your turquoise necklace, but could you make one with a moonstone instead? Same design.",
    isAiRequest: false,
  },
  {
    id: "REQ002",
    buyer: "Amit Kumar",
    image: PlaceHolderImages.find(p => p.id === "woodwork-1"),
    description: "Can you create a custom wooden chess set? I'm looking for a traditional Rajasthani design.",
    isAiRequest: false,
  },
  {
    id: "AI_REQ001",
    buyer: "Deepa Sharma",
    image: {imageUrl: "https://picsum.photos/seed/ai-mockup-1/600/600"},
    description: 'A terracotta vase with traditional Madhubani art depicting a peacock scene. The color palette should be earthy tones with a touch of royal blue.',
    isAiRequest: true,
  }
];


// Create Context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Create Provider
export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [requests, setRequests] = useState<OrderRequest[]>(initialRequests);

  const acceptRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    // Create a new product or find a matching one for the order
    const productForOrder: Product = {
        id: `prod-${Date.now()}`,
        name: request.isAiRequest ? `Custom Craft for ${request.buyer}`: `Custom ${request.description.substring(0,20)}...`,
        price: '99.99', // Example price
        image: request.image ? {
            imageUrl: request.image.imageUrl,
            description: request.description,
            imageHint: 'custom craft'
        } : undefined
    }

    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      product: productForOrder,
      quantity: 1,
      buyer: request.buyer,
      phone: '+91 99999 88888', // Example phone
      status: 'Processing',
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    setRequests(prevRequests => prevRequests.filter(r => r.id !== requestId));
  };

  const denyRequest = (requestId: string) => {
    setRequests(prevRequests => prevRequests.filter(r => r.id !== requestId));
  };

  return (
    <OrderContext.Provider value={{ orders, requests, acceptRequest, denyRequest }}>
      {children}
    </OrderContext.Provider>
  );
};

// Create custom hook
export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
