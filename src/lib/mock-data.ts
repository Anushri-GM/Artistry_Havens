import { PlaceHolderImages } from "./placeholder-images";

export const mockProducts = [
  { id: 'pottery-1', name: 'Terracotta Vase', price: '49.99', rating: 4.5, reviews: 89, artisan: 'Mira Varma', category: "Pottery", likes: 1200, shares: 345, revenue: 4449.11 },
  { id: 'woodwork-1', name: 'Elephant Sculpture', price: '129.99', rating: 4.9, reviews: 152, artisan: 'Rohan Joshi', category: "Woodwork", likes: 3400, shares: 890, revenue: 19758.48 },
  { id: 'jewelry-1', name: 'Turquoise Necklace', price: '89.99', rating: 4.7, reviews: 210, artisan: 'Priya Mehta', category: "Jewelry", likes: 5600, shares: 1200, revenue: 18897.90 },
  { id: 'textiles-1', name: 'Kalamkari Weave', price: '75.00', rating: 4.8, reviews: 112, artisan: 'Ananya Reddy', category: "Textiles", likes: 2100, shares: 560, revenue: 8400.00 },
  { id: 'paintings-1', name: 'Abstract Dreams', price: '250.00', rating: 4.6, reviews: 45, artisan: 'Vikram Singh', category: "Paintings", likes: 850, shares: 150, revenue: 11250.00 },
  { id: 'metalwork-1', name: 'Brass Wall Art', price: '180.00', rating: 4.9, reviews: 99, artisan: 'Sanjay Patel', category: "Metalwork", likes: 4200, shares: 980, revenue: 17820.00 },
].map(p => ({
    ...p,
    image: PlaceHolderImages.find(img => img.id === p.id),
    description: `This exquisite ${p.name.toLowerCase()} is a testament to the artisan's skill. Crafted with traditional techniques, it brings a touch of elegance and cultural heritage to any space.`,
    story: `From a small workshop in rural India, ${p.artisan} pours heart and soul into each piece. This ${p.name.toLowerCase()} is not just an object; it's a story of generations of craftsmanship, a legacy of art passed down through time, and a dream of preserving a beautiful tradition.`
}));


export const mockStatsData = [
    { month: "Jan", likes: 4000, shares: 2400 },
    { month: "Feb", likes: 3000, shares: 1398 },
    { month: "Mar", likes: 2000, shares: 9800 },
    { month: "Apr", likes: 2780, shares: 3908 },
    { month: "May", likes: 1890, shares: 4800 },
    { month: "Jun", likes: 2390, shares: 3800 },
    { month: "Jul", likes: 3490, shares: 4300 },
    { month: "Aug", likes: 3600, shares: 4100 },
    { month: "Sep", likes: 2900, shares: 3500 },
    { month: "Oct", likes: 4100, shares: 2900 },
    { month: "Nov", likes: 4500, shares: 3100 },
    { month: "Dec", likes: 4800, shares: 4200 },
]

export const mockSponsors = [
  {
    id: 'sponsor-1',
    name: 'Craft Ventures',
    avatar: PlaceHolderImages.find(img => img.id === 'avatar-2'),
    status: 'Active',
    expiry: '2024-12-31',
    share: 15,
  },
   {
    id: 'sponsor-2',
    name: 'Heritage Supporters',
    avatar: PlaceHolderImages.find(img => img.id === 'avatar-2'),
    status: 'Active',
    expiry: '2025-06-30',
    share: 20,
  }
]

export const mockSponsorRequests = [
    {
    id: 'request-1',
    name: 'Artisan Fund',
    avatar: PlaceHolderImages.find(img => img.id === 'avatar-2'),
    message: 'We love your woodwork and would like to sponsor your next collection.',
  }
]
