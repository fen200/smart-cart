import productHeadphones from "@/assets/product-headphones.jpg";
import productWatch from "@/assets/product-watch.jpg";
import productSneakers from "@/assets/product-sneakers.jpg";
import productBackpack from "@/assets/product-backpack.jpg";
import productLaptop from "@/assets/product-laptop.jpg";
import productMug from "@/assets/product-mug.jpg";
import productSpeaker from "@/assets/product-speaker.jpg";
import productSunglasses from "@/assets/product-sunglasses.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  badge?: "sale" | "new" | "trending" | "low-stock";
  stock: number;
  description: string;
  specs: Record<string, string>;
}

export const products: Product[] = [
  {
    id: "1",
    name: "ProSound Wireless Headphones",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviewCount: 2341,
    image: productHeadphones,
    category: "Electronics",
    badge: "sale",
    stock: 45,
    description: "Immerse yourself in crystal-clear audio with active noise cancellation, 40-hour battery life, and ultra-comfortable memory foam ear cushions. Perfect for music lovers and professionals alike.",
    specs: {
      "Driver Size": "40mm",
      "Battery Life": "40 hours",
      "Connectivity": "Bluetooth 5.3",
      "Weight": "250g",
      "Noise Cancellation": "Active (ANC)",
    },
  },
  {
    id: "2",
    name: "SmartFit Pro Watch",
    price: 299.99,
    rating: 4.5,
    reviewCount: 1892,
    image: productWatch,
    category: "Electronics",
    badge: "new",
    stock: 120,
    description: "Track your fitness goals with precision. Features heart rate monitoring, GPS, sleep tracking, and a stunning AMOLED display that's always on.",
    specs: {
      "Display": "1.4\" AMOLED",
      "Battery Life": "7 days",
      "Water Resistance": "5ATM",
      "Sensors": "HR, SpO2, GPS",
      "Compatibility": "iOS & Android",
    },
  },
  {
    id: "3",
    name: "AeroRun Ultra Sneakers",
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.8,
    reviewCount: 3567,
    image: productSneakers,
    category: "Fashion",
    badge: "trending",
    stock: 3,
    description: "Engineered for peak performance with responsive cushioning, breathable mesh upper, and a lightweight design that keeps you moving faster.",
    specs: {
      "Material": "Engineered mesh",
      "Sole": "React foam",
      "Weight": "280g",
      "Drop": "8mm",
      "Closure": "Lace-up",
    },
  },
  {
    id: "4",
    name: "Heritage Leather Backpack",
    price: 89.99,
    rating: 4.6,
    reviewCount: 987,
    image: productBackpack,
    category: "Fashion",
    badge: "trending",
    stock: 28,
    description: "Crafted from premium full-grain leather with a water-resistant lining. Features a padded laptop compartment, multiple organizer pockets, and timeless design.",
    specs: {
      "Material": "Full-grain leather",
      "Capacity": "25L",
      "Laptop": "Up to 15\"",
      "Pockets": "6 compartments",
      "Dimensions": "45 × 30 × 15 cm",
    },
  },
  {
    id: "5",
    name: 'UltraBook Pro 15"',
    price: 1299.99,
    originalPrice: 1499.99,
    rating: 4.9,
    reviewCount: 4521,
    image: productLaptop,
    category: "Electronics",
    badge: "sale",
    stock: 15,
    description: "Powerhouse performance in a sleek, ultra-thin design. Features the latest processor, stunning Retina display, and all-day battery life for creators and professionals.",
    specs: {
      "Processor": "M3 Pro",
      "RAM": "18GB",
      "Storage": "512GB SSD",
      "Display": "15.3\" Liquid Retina XDR",
      "Battery": "22 hours",
    },
  },
  {
    id: "6",
    name: "Artisan Ceramic Mug Set",
    price: 34.99,
    rating: 4.4,
    reviewCount: 654,
    image: productMug,
    category: "Home",
    stock: 200,
    description: "Handcrafted ceramic mugs with a smooth matte finish. Set of 4 in earthy tones, perfect for your morning coffee ritual. Microwave and dishwasher safe.",
    specs: {
      "Material": "Stoneware ceramic",
      "Capacity": "12 oz each",
      "Set": "4 mugs",
      "Care": "Dishwasher safe",
      "Finish": "Matte glaze",
    },
  },
  {
    id: "7",
    name: "SoundWave Portable Speaker",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.3,
    reviewCount: 1234,
    image: productSpeaker,
    category: "Electronics",
    badge: "sale",
    stock: 67,
    description: "Take your music anywhere with 360° immersive sound, IP67 waterproof rating, and 20 hours of playtime. Compact enough for any adventure.",
    specs: {
      "Output": "20W",
      "Battery": "20 hours",
      "Waterproof": "IP67",
      "Connectivity": "Bluetooth 5.0",
      "Weight": "560g",
    },
  },
  {
    id: "8",
    name: "Horizon Aviator Sunglasses",
    price: 159.99,
    rating: 4.6,
    reviewCount: 876,
    image: productSunglasses,
    category: "Fashion",
    badge: "new",
    stock: 42,
    description: "Classic aviator design with polarized lenses and titanium frames. UV400 protection keeps your eyes safe while you look effortlessly cool.",
    specs: {
      "Frame": "Titanium",
      "Lens": "Polarized CR-39",
      "Protection": "UV400",
      "Weight": "28g",
      "Includes": "Hard case + cloth",
    },
  },
];

export const categories = [
  { name: "Electronics", icon: "💻", count: 1240 },
  { name: "Fashion", icon: "👗", count: 3450 },
  { name: "Home", icon: "🏠", count: 890 },
  { name: "Sports", icon: "⚽", count: 670 },
  { name: "Books", icon: "📚", count: 2100 },
  { name: "Beauty", icon: "✨", count: 1560 },
];

export const reviews = [
  { id: "1", user: "Alex M.", rating: 5, date: "2026-02-15", text: "Absolutely love these! The noise cancellation is incredible and they're so comfortable I forget I'm wearing them." },
  { id: "2", user: "Sarah K.", rating: 4, date: "2026-02-10", text: "Great sound quality and battery life. The only downside is they're a bit bulky for traveling." },
  { id: "3", user: "James R.", rating: 5, date: "2026-01-28", text: "Best headphones I've ever owned. The sound is rich and detailed. Highly recommend!" },
  { id: "4", user: "Emily L.", rating: 4, date: "2026-01-15", text: "Very comfortable and good sound. The app could use some improvements but overall excellent." },
];
