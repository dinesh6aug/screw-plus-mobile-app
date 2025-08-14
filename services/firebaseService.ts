import { db } from '@/config/firebase';
import { Banner, Category, Product } from '@/types/product';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc
} from 'firebase/firestore';

export interface FirebaseProduct extends Omit<Product, 'id'> {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebaseCategory extends Omit<Category, 'id'> {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebaseBanner extends Omit<Banner, 'id'> {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
  order: number;
}

class FirebaseService {
  // Products
  async getProducts(): Promise<Product[]> {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<string> {
    const productsRef = collection(db, 'products');
    const now = Timestamp.now();
    const docRef = await addDoc(productsRef, {
      ...product,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, {
      ...product,
      updatedAt: Timestamp.now()
    });
  }

  async deleteProduct(id: string): Promise<void> {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  }

  async addCategory(category: Omit<Category, 'id'>): Promise<string> {
    const categoriesRef = collection(db, 'categories');
    const now = Timestamp.now();
    const docRef = await addDoc(categoriesRef, {
      ...category,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<void> {
    const categoryRef = doc(db, 'categories', id);
    await updateDoc(categoryRef, {
      ...category,
      updatedAt: Timestamp.now()
    });
  }

  async deleteCategory(id: string): Promise<void> {
    const categoryRef = doc(db, 'categories', id);
    await deleteDoc(categoryRef);
  }

  // Banners
  async getBanners(): Promise<Banner[]> {
    const bannersRef = collection(db, 'banners');
    const q = query(bannersRef, orderBy('order'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Banner[];
  }

  async addBanner(banner: Omit<Banner, 'id'> & { isActive?: boolean; order?: number }): Promise<string> {
    const bannersRef = collection(db, 'banners');
    const now = Timestamp.now();
    const docRef = await addDoc(bannersRef, {
      ...banner,
      isActive: banner.isActive ?? true,
      order: banner.order ?? 0,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  }

  async updateBanner(id: string, banner: Partial<Banner & { isActive?: boolean; order?: number }>): Promise<void> {
    const bannerRef = doc(db, 'banners', id);
    await updateDoc(bannerRef, {
      ...banner,
      updatedAt: Timestamp.now()
    });
  }

  async deleteBanner(id: string): Promise<void> {
    const bannerRef = doc(db, 'banners', id);
    await deleteDoc(bannerRef);
  }

  // Real-time listeners
  subscribeToProducts(callback: (products: Product[]) => void) {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      callback(products);
    });
  }

  subscribeToCategories(callback: (categories: Category[]) => void) {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, orderBy('name'));
    return onSnapshot(q, (snapshot) => {
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      callback(categories);
    });
  }

  subscribeToBanners(callback: (banners: Banner[]) => void) {
    const bannersRef = collection(db, 'banners');
    const q = query(bannersRef, orderBy('order'));
    return onSnapshot(q, (snapshot) => {
      const banners = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Banner[];
      callback(banners);
    });
  }

  // Inside class FirebaseService
  async getProductById(id: string): Promise<Product | null> {
    try {
      const productRef = doc(db, 'products', id);
      const snapshot = await getDoc(productRef);

      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Product;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  }
}

export const firebaseService = new FirebaseService();