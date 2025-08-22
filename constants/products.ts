import { Banner, Category } from '@/types/product';

export const banners: Banner[] = [
  {
    id: '1',
    title: 'New Collection',
    subtitle: 'Up to 50% Off',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
    cta: 'Shop Now'
  },
  {
    id: '2',
    title: 'Summer Sale',
    subtitle: 'Fresh Styles',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop',
    cta: 'Explore'
  },
  {
    id: '3',
    title: 'Trending Now',
    subtitle: 'Must Have Items',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=400&fit=crop',
    cta: 'Discover'
  }
];

export const categories: Category[] = [
  {
    id: '1',
    name: 'Men',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    productCount: 245
  },
  {
    id: '2',
    name: 'Women',
    image: 'https://images.unsplash.com/photo-1494790108755-2616c9c0b8d3?w=300&h=300&fit=crop',
    productCount: 189
  },
  {
    id: '3',
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    productCount: 67
  },
  {
    id: '4',
    name: 'Footwear',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
    productCount: 123
  }
];

// export const products: Product[] = [
//   {
//     id: '1',
//     title: 'Classic White T-Shirt',
//     price: 799,
//     originalPrice: 1299,
//     discount: 38,
//     image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
//     category: 'Men',
//     brand: 'Screw Plus',
//     rating: 4.5,
//     reviews: 128,
//     sizes: ['S', 'M', 'L', 'XL', 'XXL'],
//     colors: ['White', 'Black', 'Navy'],
//     description: 'Premium cotton t-shirt with comfortable fit and modern design.',
//     isNew: true
//   },
//   {
//     id: '2',
//     title: 'Denim Jacket',
//     price: 2499,
//     originalPrice: 3999,
//     discount: 37,
//     image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=500&fit=crop',
//     category: 'Men',
//     brand: 'Screw Plus',
//     rating: 4.3,
//     reviews: 89,
//     sizes: ['S', 'M', 'L', 'XL'],
//     colors: ['Blue', 'Black'],
//     description: 'Stylish denim jacket perfect for casual outings.',
//     isBestseller: true
//   },
//   {
//     id: '3',
//     title: 'Floral Summer Dress',
//     price: 1899,
//     originalPrice: 2799,
//     discount: 32,
//     image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop',
//     category: 'Women',
//     brand: 'Screw Plus',
//     rating: 4.7,
//     reviews: 156,
//     sizes: ['XS', 'S', 'M', 'L', 'XL'],
//     colors: ['Floral', 'Pink', 'Blue'],
//     description: 'Beautiful floral dress perfect for summer occasions.',
//     isNew: true
//   },
//   {
//     id: '4',
//     title: 'Casual Sneakers',
//     price: 2999,
//     originalPrice: 4499,
//     discount: 33,
//     image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop',
//     category: 'Footwear',
//     brand: 'Screw Plus',
//     rating: 4.4,
//     reviews: 203,
//     sizes: ['6', '7', '8', '9', '10', '11'],
//     colors: ['White', 'Black', 'Grey'],
//     description: 'Comfortable casual sneakers for everyday wear.'
//   },
//   {
//     id: '5',
//     title: 'Leather Backpack',
//     price: 3499,
//     originalPrice: 4999,
//     discount: 30,
//     image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
//     category: 'Accessories',
//     brand: 'Screw Plus',
//     rating: 4.6,
//     reviews: 94,
//     sizes: ['One Size'],
//     colors: ['Brown', 'Black', 'Tan'],
//     description: 'Premium leather backpack with multiple compartments.',
//     isBestseller: true
//   },
//   {
//     id: '6',
//     title: 'Striped Polo Shirt',
//     price: 1299,
//     originalPrice: 1999,
//     discount: 35,
//     image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=500&fit=crop',
//     category: 'Men',
//     brand: 'Screw Plus',
//     rating: 4.2,
//     reviews: 67,
//     sizes: ['S', 'M', 'L', 'XL'],
//     colors: ['Navy', 'White', 'Grey'],
//     description: 'Classic striped polo shirt for smart casual look.'
//   },
//   {
//     id: '7',
//     title: 'Maxi Dress',
//     price: 2299,
//     originalPrice: 3299,
//     discount: 30,
//     image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop',
//     category: 'Women',
//     brand: 'Screw Plus',
//     rating: 4.5,
//     reviews: 112,
//     sizes: ['XS', 'S', 'M', 'L'],
//     colors: ['Black', 'Navy', 'Maroon'],
//     description: 'Elegant maxi dress for special occasions.'
//   },
//   {
//     id: '8',
//     title: 'Canvas Shoes',
//     price: 1799,
//     originalPrice: 2499,
//     discount: 28,
//     image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=500&fit=crop',
//     category: 'Footwear',
//     brand: 'Screw Plus',
//     rating: 4.1,
//     reviews: 78,
//     sizes: ['6', '7', '8', '9', '10'],
//     colors: ['White', 'Black', 'Red'],
//     description: 'Comfortable canvas shoes for casual wear.'
//   }
// ];