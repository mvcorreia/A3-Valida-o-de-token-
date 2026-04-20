import { useStore } from "@/store/useStore";
import LoginPage from "@/components/LoginPage";
import ProductsPage from "@/components/ProductsPage";
import ProductDetailPage from "@/components/ProductDetailPage";
import PaymentPage from "@/components/PaymentPage";
import TokenValidationPage from "@/components/TokenValidationPage";
import CartPage from "@/components/CartPage";
import OrdersPage from "@/components/OrdersPage";
import FavoritesPage from "@/components/FavoritesPage";

const Index = () => {
  const { currentPage } = useStore();

  switch (currentPage) {
    case "login":
    case "register":
      return <LoginPage />;
    case "products":
      return <ProductsPage />;
    case "product-detail":
      return <ProductDetailPage />;
    case "cart":
      return <CartPage />;
    case "payment":
      return <PaymentPage />;
    case "token-validation":
      return <TokenValidationPage />;
    case "orders":
      return <OrdersPage />;
    case "favorites":
      return <FavoritesPage />;
    default:
      return <LoginPage />;
  }
};

export default Index;
