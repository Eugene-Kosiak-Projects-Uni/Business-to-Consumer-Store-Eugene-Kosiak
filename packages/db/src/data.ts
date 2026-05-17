export type Product = {
  id: number;
  urlId: string;
  title: string;
  description: string;
  date: Date;
  content: string;
  imageUrl: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  rating: number;
  tags: string;
  featured: boolean;
  active: boolean;
};

const wirelessHeadphonesContent = `
# Wireless Headphones

Experience premium sound quality with active noise cancellation,
Bluetooth 5.3 connectivity, and up to 40 hours of battery life.

## Features

- Active Noise Cancellation
- Wireless Bluetooth Connection
- USB-C Fast Charging
- Built-in Microphone
- Comfortable Ear Cushions

Perfect for gaming, music, travel, and everyday use.
`;

const gamingKeyboardContent = `
# RGB Gaming Keyboard

Mechanical gaming keyboard with customizable RGB lighting
and ultra-fast response switches.

## Features

- Mechanical Switches
- RGB Backlighting
- Anti-Ghosting
- USB-C Connectivity
- Gaming Mode

Built for competitive gaming and productivity.
`;

const smartWatchContent = `
# Smart Watch Pro

Track your health, fitness, and notifications in one sleek device.

## Features

- Heart Rate Monitor
- Sleep Tracking
- GPS
- Waterproof Design
- 7-Day Battery Life
`;

const runningShoesContent = `
# Running Shoes

Lightweight running shoes designed for comfort and performance.

## Features

- Breathable Fabric
- Cushioned Sole
- Lightweight Design
- Durable Grip
`;

export const products: Product[] = [
  {
    id: 1,
    urlId: "wireless-headphones",
    title: "Wireless Headphones",
    description:
      "Premium audio device with active noise cancellation and 40-hour battery life.",
    date: new Date("2025-02-01"),
    content: wirelessHeadphonesContent,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
    category: "Electronics",
    brand: "SoundMax",
    price: 199,
    stock: 12,
    rating: 4.8,
    tags: "Audio,Wireless,Tech,Gaming",
    featured: true,
    active: true,
  },
  {
    id: 2,
    urlId: "rgb-gaming-keyboard",
    title: "RGB Gaming Keyboard",
    description:
      "Mechanical gaming keyboard with RGB lighting and ultra-fast response switches.",
    date: new Date("2024-11-15"),
    content: gamingKeyboardContent,
    imageUrl:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1200&auto=format&fit=crop",
    category: "Gaming",
    brand: "HyperTech",
    price: 149,
    stock: 18,
    rating: 4.7,
    tags: "Gaming,Keyboard,RGB",
    featured: true,
    active: true,
  },
  {
    id: 3,
    urlId: "smart-watch-pro",
    title: "Smart Watch Pro",
    description:
      "Track your fitness, notifications, and health metrics all day long.",
    date: new Date("2024-12-20"),
    content: smartWatchContent,
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
    category: "Electronics",
    brand: "Nova",
    price: 249,
    stock: 9,
    rating: 4.6,
    tags: "Watch,Fitness,Tech",
    featured: true,
    active: true,
  },
  {
    id: 4,
    urlId: "running-shoes",
    title: "Running Shoes",
    description:
      "Comfortable lightweight running shoes built for performance and everyday wear.",
    date: new Date("2025-01-15"),
    content: runningShoesContent,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
    category: "Clothing",
    brand: "Velocity",
    price: 129,
    stock: 22,
    rating: 4.5,
    tags: "Shoes,Sports,Fitness",
    featured: false,
    active: true,
  },
];


export type Purchase = {
  id: number;
  userId: string;
  date: Date;
  items: {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  }[];
  total: number;
};