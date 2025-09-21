
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockProducts } from '@/lib/mock-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// Define types
export interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
  story: string;
  image?: {
    imageUrl: string;
    description: string;
    imageHint: string;
  };
  likes?: number;
  shares?: number;
  rating?: number;
  reviews?: number;
  revenue?: number;
  bought?: number;
  artisan?: string;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered';

export interface Order {
  id: string;
  product: Product;
  quantity: number;
  buyer: string;
  phone: string;
  status: OrderStatus;
  orderDate: Date;
  expectedDelivery: Date;
}

export interface OrderRequest {
  id: string;
  buyer: string;
  image: { imageUrl: string } | undefined;
  description: string;
  isAiRequest: boolean;
}

interface ArtisanContextType {
  products: Product[];
  orders: Order[];
  requests: OrderRequest[];
  savedProducts: Product[];
  addProduct: (product: Product) => void;
  acceptRequest: (requestId: string) => void;
  denyRequest: (requestId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  saveProduct: (product: Product) => boolean; // Returns true if saved, false if already saved
}

// Initial Data
const initialOrders: Order[] = [
  { id: 'ORD001', product: mockProducts[0], quantity: 2, buyer: 'Anjali P.', phone: '+91 12345 67890', status: 'Processing', orderDate: new Date('2024-07-20T10:30:00'), expectedDelivery: new Date('2024-07-28') },
  { id: 'ORD002', product: mockProducts[2], quantity: 1, buyer: 'Ravi K.', phone: '+91 23456 78901', status: 'Shipped', orderDate: new Date('2024-07-18T15:00:00'), expectedDelivery: new Date('2024-07-25') },
  { id: 'ORD003', product: mockProducts[4], quantity: 1, buyer: 'Sunita M.', phone: ' +91 34567 89012', status: 'Delivered', orderDate: new Date('2024-07-15T09:00:00'), expectedDelivery: new Date('2024-07-22') },
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
const ArtisanContext = createContext<ArtisanContextType | undefined>(undefined);

// Create Provider
export const ArtisanProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [requests, setRequests] = useState<OrderRequest[]>(initialRequests);
  const [savedProducts, setSavedProducts] = useState<Product[]>(mockProducts.slice(0, 5));

  const addProduct = (product: Product) => {
    setProducts(prevProducts => [product, ...prevProducts]);
  };

  const saveProduct = (productToSave: Product) => {
    let alreadySaved = false;
    setSavedProducts(prevSaved => {
        if (prevSaved.some(p => p.id === productToSave.id)) {
            alreadySaved = true;
            return prevSaved;
        }
        alreadySaved = false;
        return [productToSave, ...prevSaved];
    });
    return !alreadySaved;
  }

  const acceptRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    // Create a new product or find a matching one for the order
    const productForOrder: Product = {
        id: `prod-${Date.now()}`,
        name: request.isAiRequest ? `Custom Craft for ${request.buyer}`: `Custom ${request.description.substring(0,20)}...`,
        price: '99.99', // Example price
        category: 'Custom',
        description: request.description,
        story: 'A custom creation based on a buyer request.',
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
      orderDate: new Date(),
      expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    setRequests(prevRequests => prevRequests.filter(r => r.id !== requestId));
  };

  const denyRequest = (requestId: string) => {
    setRequests(prevRequests => prevRequests.filter(r => r.id !== requestId));
  };
  
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  return (
    <ArtisanContext.Provider value={{ products, orders, requests, savedProducts, addProduct, acceptRequest, denyRequest, updateOrderStatus, saveProduct }}>
      {children}
    </ArtisanContext.Provider>
  );
};

// Create custom hook
export const useArtisan = () => {
  const context = useContext(ArtisanContext);
  if (context === undefined) {
    throw new Error('useArtisan must be used within an ArtisanProvider');
  }
  return context;
};

    