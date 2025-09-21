import { PlaceHolderImages } from "./placeholder-images";

export const mockProducts = [
  { id: 'pottery-1', name: 'Terracotta Vase', price: '49.99', rating: 4.5, reviews: 89, artisan: 'Mira Varma', category: "Pottery", likes: 1200, shares: 345, revenue: 4449.11, bought: 90 },
  { id: 'woodwork-1', name: 'Elephant Sculpture', price: '129.99', rating: 4.9, reviews: 152, artisan: 'Rohan Joshi', category: "Woodwork", likes: 3400, shares: 890, revenue: 19758.48, bought: 152 },
  { id: 'jewelry-1', name: 'Turquoise Necklace', price: '89.99', rating: 4.7, reviews: 210, artisan: 'Priya Mehta', category: "Jewelry", likes: 5600, shares: 1200, revenue: 18897.90, bought: 210 },
  { id: 'textiles-1', name: 'Kalamkari Weave', price: '75.00', rating: 4.8, reviews: 112, artisan: 'Ananya Reddy', category: "Textiles", likes: 2100, shares: 560, revenue: 8400.00, bought: 112 },
  { id: 'paintings-1', name: 'Abstract Dreams', price: '250.00', rating: 4.6, reviews: 45, artisan: 'Vikram Singh', category: "Paintings", likes: 850, shares: 150, revenue: 11250.00, bought: 45 },
  { id: 'metalwork-1', name: 'Brass Wall Art', price: '180.00', rating: 4.9, reviews: 99, artisan: 'Sanjay Patel', category: "Metalwork", likes: 4200, shares: 980, revenue: 17820.00, bought: 99 },
].map((p, index) => ({
    ...p,
    image: {
        imageUrl: `https://picsum.photos/seed/${p.id}/400/400`,
        description: p.name,
        imageHint: `${p.category} ${p.name}`
    },
    description: `This exquisite ${p.name.toLowerCase()} is a testament to the artisan's skill. Crafted with traditional techniques, it brings a touch of elegance and cultural heritage to any space.`,
    story: `From a small workshop in rural India, ${p.artisan} pours heart and soul into each piece. This ${p.name.toLowerCase()} is not just an object; it's a story of generations of craftsmanship, a legacy of art passed down through time, and a dream of preserving a beautiful tradition.`
}));


export const mockStatsData = [
    { month: "Jan", likes: 4000, bought: 240 },
    { month: "Feb", likes: 3000, bought: 139 },
    { month: "Mar", likes: 2000, bought: 980 },
    { month: "Apr", likes: 2780, bought: 390 },
    { month: "May", likes: 1890, bought: 480 },
    { month: "Jun", likes: 2390, bought: 380 },
    { month: "Jul", likes: 3490, bought: 430 },
    { month: "Aug", likes: 3600, bought: 410 },
    { month: "Sep", likes: 2900, bought: 350 },
    { month: "Oct", likes: 4100, bought: 290 },
    { month: "Nov", likes: 4500, bought: 310 },
    { month: "Dec", likes: 4800, bought: 420 },
]

export const mockWeeklyStatsData = [
    { week: "Week 1", likes: 980, bought: 45 },
    { week: "Week 2", likes: 1100, bought: 55 },
    { week: "Week 3", likes: 850, bought: 35 },
    { week: "Week 4", likes: 1250, bought: 70 },
];

export const mockYearlyStatsData = [
    { year: "2022", likes: 35000, bought: 2000 },
    { year: "2023", likes: 48000, bought: 2800 },
    { year: "2024", likes: 42000, bought: 2500 },
];


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

export const mockReviews = [
    { id: 'review-1', productId: 'pottery-1', author: 'Aisha K.', rating: 5, comment: 'Absolutely stunning vase! The color is even more beautiful in person. It was packed so carefully and arrived in perfect condition.', avatarUrl: 'https://picsum.photos/seed/rev-aisha/100/100' },
    { id: 'review-2', productId: 'pottery-1', author: 'Raj S.', rating: 4, comment: 'Great craftsmanship. A bit smaller than I expected, but it\'s a beautiful decorative piece. Happy with my purchase.', avatarUrl: 'https://picsum.photos/seed/rev-raj/100/100' },
    { id: 'review-3', productId: 'woodwork-1', author: 'Priya D.', rating: 5, comment: 'The detail on this sculpture is incredible. It\'s the centerpiece of my living room now. Worth every penny!', avatarUrl: 'https://picsum.photos/seed/rev-priya/100/100' },
];
