import { create } from "zustand";

import headphonesImg from "@/assets/products/headphones.png";
import smartwatchImg from "@/assets/products/smartwatch.png";
import tshirtImg from "@/assets/products/tshirt.png";
import sneakersImg from "@/assets/products/sneakers.png";
import backpackImg from "@/assets/products/backpack.png";
import sunglassesImg from "@/assets/products/sunglasses.png";
import keyboardImg from "@/assets/products/keyboard.png";
import jacketImg from "@/assets/products/jacket.png";
import smartphoneImg from "@/assets/products/smartphone.png";
import tvImg from "@/assets/products/tv.png";
import laptopImg from "@/assets/products/laptop.png";
import chargerCableImg from "@/assets/products/charger-cable.png";
import monitorImg from "@/assets/products/monitor.png";
import projectorImg from "@/assets/products/projector.png";
import polaroidImg from "@/assets/products/polaroid.png";
import jeansImg from "@/assets/products/jeans.png";
import skirtImg from "@/assets/products/skirt.png";
import dressImg from "@/assets/products/dress.png";
import hoodieImg from "@/assets/products/hoodie.png";
import watchImg from "@/assets/products/watch.png";
import perfumeImg from "@/assets/products/perfume.png";
import earringsImg from "@/assets/products/earrings.png";
import ringsImg from "@/assets/products/rings.png";
import braceletsImg from "@/assets/products/bracelets.png";
import flipflopsImg from "@/assets/products/flipflops.png";
import heelsImg from "@/assets/products/heels.png";
import bootsImg from "@/assets/products/boots.png";
import fanImg from "@/assets/products/fan.png";
import airfryerImg from "@/assets/products/airfryer.png";
import robotVacuumImg from "@/assets/products/robot-vacuum.png";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
}

const emptyAddress: Address = {
  cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "",
};

export interface AppliedCoupon {
  code: string;
  discount: number; // 0-1
  label: string;
}

interface StoreState {
  isLoggedIn: boolean;
  userName: string;
  currentPage: "login" | "register" | "products" | "product-detail" | "payment" | "token-validation" | "cart" | "orders" | "favorites";
  selectedProduct: Product | null;
  cart: CartItem[];
  favorites: number[];
  buyingFromCart: boolean;
  address: Address;
  orders: Order[];
  coupon: AppliedCoupon | null;
  login: (name: string) => void;
  logout: () => void;
  setPage: (page: StoreState["currentPage"]) => void;
  selectProduct: (product: Product) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (productId: number) => void;
  setBuyingFromCart: (v: boolean) => void;
  setAddress: (a: Address) => void;
  addOrder: (order: Order) => void;
  setCoupon: (c: AppliedCoupon | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  isLoggedIn: false,
  userName: "",
  currentPage: "login",
  selectedProduct: null,
  cart: [],
  favorites: [],
  buyingFromCart: false,
  address: emptyAddress,
  orders: [],
  coupon: null,
  login: (name) => set({ isLoggedIn: true, userName: name, currentPage: "products" }),
  logout: () => set({ isLoggedIn: false, userName: "", currentPage: "login", selectedProduct: null, cart: [], favorites: [], buyingFromCart: false, address: emptyAddress, orders: [], coupon: null }),
  setPage: (page) => set({ currentPage: page }),
  selectProduct: (product) => set({ selectedProduct: product, currentPage: "product-detail" }),
  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((item) => item.product.id === product.id);
      if (existing) {
        return { cart: state.cart.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) };
      }
      return { cart: [...state.cart, { product, quantity: 1 }] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({ cart: state.cart.filter((item) => item.product.id !== productId) })),
  updateCartQuantity: (productId, quantity) =>
    set((state) => ({
      cart: quantity <= 0
        ? state.cart.filter((item) => item.product.id !== productId)
        : state.cart.map((item) => item.product.id === productId ? { ...item, quantity } : item),
    })),
  clearCart: () => set({ cart: [] }),
  toggleFavorite: (productId) =>
    set((state) => ({
      favorites: state.favorites.includes(productId)
        ? state.favorites.filter((id) => id !== productId)
        : [...state.favorites, productId],
    })),
  setBuyingFromCart: (v) => set({ buyingFromCart: v }),
  setAddress: (a) => set({ address: a }),
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  setCoupon: (c) => set({ coupon: c }),
}));

export const categories = ["Eletrônicos", "Roupas", "Calçados", "Acessórios", "Eletrodomésticos"] as const;

export const products: Product[] = [
  // Eletrônicos
  { id: 1, name: "Fone Bluetooth Pro", price: 299.90, image: headphonesImg, description: "Fone de ouvido sem fio com cancelamento de ruído ativo e bateria de 30h.", category: "Eletrônicos" },
  { id: 2, name: "Smartwatch Ultra", price: 899.90, image: smartwatchImg, description: "Relógio inteligente com GPS, monitor cardíaco e tela AMOLED.", category: "Eletrônicos" },
  { id: 7, name: "Teclado Mecânico", price: 549.90, image: keyboardImg, description: "Teclado mecânico RGB com switches blue e layout ABNT2.", category: "Eletrônicos" },
  { id: 9, name: "Smartphone Galaxy S", price: 3299.90, image: smartphoneImg, description: "Celular flagship com câmera tripla 108MP, tela AMOLED 120Hz e 256GB.", category: "Eletrônicos" },
  { id: 10, name: "Smart TV 55\" 4K", price: 2799.90, image: tvImg, description: "Televisão 4K UHD com HDR10+, sistema operacional smart e Wi-Fi integrado.", category: "Eletrônicos" },
  { id: 11, name: "Notebook UltraSlim", price: 4599.90, image: laptopImg, description: "Notebook com processador i7, 16GB RAM, SSD 512GB e tela Full HD 14\".", category: "Eletrônicos" },
  { id: 12, name: "Cabo Carregador USB-C", price: 49.90, image: chargerCableImg, description: "Cabo trançado USB-C de 2m, carregamento rápido até 100W.", category: "Eletrônicos" },
  { id: 13, name: "Monitor Curvo 27\"", price: 1799.90, image: monitorImg, description: "Monitor curvo Full HD 165Hz com tempo de resposta 1ms para gamers.", category: "Eletrônicos" },
  { id: 14, name: "Projetor Full HD", price: 1499.90, image: projectorImg, description: "Projetor portátil 1080p com 6000 lumens e suporte para Bluetooth.", category: "Eletrônicos" },
  { id: 15, name: "Câmera Polaroide", price: 599.90, image: polaroidImg, description: "Câmera instantânea retrô que imprime fotos em segundos.", category: "Eletrônicos" },

  // Roupas
  { id: 3, name: "Camiseta Premium", price: 89.90, image: tshirtImg, description: "Camiseta 100% algodão pima com corte slim fit.", category: "Roupas" },
  { id: 8, name: "Jaqueta Couro", price: 699.90, image: jacketImg, description: "Jaqueta em couro sintético premium com forro térmico.", category: "Roupas" },
  { id: 16, name: "Calça Jeans Slim", price: 199.90, image: jeansImg, description: "Calça jeans slim fit com lavagem azul clássica e elastano.", category: "Roupas" },
  { id: 17, name: "Saia Plissada Midi", price: 159.90, image: skirtImg, description: "Saia midi plissada preta, elegante e versátil para qualquer ocasião.", category: "Roupas" },
  { id: 18, name: "Vestido Floral", price: 249.90, image: dressImg, description: "Vestido midi vermelho com estampa floral em tecido leve e fluido.", category: "Roupas" },
  { id: 19, name: "Moletom Oversized", price: 219.90, image: hoodieImg, description: "Moletom unissex cinza com capuz e bolso canguru, felpa interna macia.", category: "Roupas" },

  // Calçados
  { id: 4, name: "Tênis Runner X", price: 459.90, image: sneakersImg, description: "Tênis de corrida com amortecimento em gel e solado antiderrapante.", category: "Calçados" },
  { id: 20, name: "Chinelo Conforto", price: 79.90, image: flipflopsImg, description: "Chinelo de borracha ergonômico, leve e antiderrapante.", category: "Calçados" },
  { id: 21, name: "Scarpin Salto Alto", price: 329.90, image: heelsImg, description: "Scarpin preto em verniz com salto fino de 10cm.", category: "Calçados" },
  { id: 22, name: "Bota Cano Curto", price: 499.90, image: bootsImg, description: "Bota em couro legítimo marrom com cano curto e zíper lateral.", category: "Calçados" },

  // Acessórios
  { id: 5, name: "Mochila Urban", price: 199.90, image: backpackImg, description: "Mochila impermeável com compartimento para notebook 15\".", category: "Acessórios" },
  { id: 6, name: "Óculos Solar", price: 349.90, image: sunglassesImg, description: "Óculos com proteção UV400 e armação em titânio.", category: "Acessórios" },
  { id: 23, name: "Relógio Clássico", price: 459.90, image: watchImg, description: "Relógio analógico com pulseira em aço inoxidável e mostrador branco.", category: "Acessórios" },
  { id: 24, name: "Perfume Amber", price: 389.90, image: perfumeImg, description: "Eau de parfum amadeirado com notas de âmbar e baunilha, 100ml.", category: "Acessórios" },
  { id: 25, name: "Brinco Argola Gold", price: 149.90, image: earringsImg, description: "Brincos de argola folheados a ouro com microzircônias cravejadas.", category: "Acessórios" },
  { id: 26, name: "Kit 5 Anéis", price: 119.90, image: ringsImg, description: "Conjunto de 5 anéis empilháveis em prata e ouro, ajustáveis.", category: "Acessórios" },
  { id: 27, name: "Kit Pulseiras Boho", price: 99.90, image: braceletsImg, description: "Kit com 6 pulseiras de miçangas em tons dourados e cristais.", category: "Acessórios" },

  // Eletrodomésticos
  { id: 28, name: "Ventilador Torre Smart", price: 549.90, image: fanImg, description: "Ventilador torre com display digital, controle remoto e 3 velocidades.", category: "Eletrodomésticos" },
  { id: 29, name: "Air Fryer 5L Digital", price: 599.90, image: airfryerImg, description: "Fritadeira sem óleo de 5 litros com painel touch e 8 funções.", category: "Eletrodomésticos" },
  { id: 30, name: "Robô Aspirador WiFi", price: 1899.90, image: robotVacuumImg, description: "Robô aspirador com mapeamento a laser, controle por app e auto-recarga.", category: "Eletrodomésticos" },
];
