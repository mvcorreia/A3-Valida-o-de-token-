import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart, Loader2, Ticket, X, Check } from "lucide-react";
import AddressForm from "./AddressForm";
import CheckoutSteps from "./CheckoutSteps";
import { toast } from "sonner";

const COUPONS: Record<string, { discount: number; label: string }> = {
  DESCONTO10: { discount: 0.1, label: "10% OFF" },
  PROMO20: { discount: 0.2, label: "20% OFF" },
  FRETE5: { discount: 0.05, label: "5% OFF extra" },
};

const CartPage = () => {
  const { cart, updateCartQuantity, removeFromCart, setPage, setBuyingFromCart, address, setAddress, coupon: appliedCoupon, setCoupon: setAppliedCoupon } = useStore();
  const [loading, setLoading] = useState(false);
  const [couponInput, setCouponInput] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? subtotal * appliedCoupon.discount : 0;
  const total = subtotal - discountAmount;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      toast.error("Digite um cupom");
      return;
    }
    const coupon = COUPONS[code];
    if (!coupon) {
      toast.error("Cupom inválido");
      return;
    }
    if (appliedCoupon?.code === code) {
      toast.info("Este cupom já está aplicado");
      return;
    }
    setAppliedCoupon({ code, ...coupon });
    setCouponInput("");
    toast.success(`Cupom ${code} aplicado: ${coupon.label}`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.info("Cupom removido");
  };

  const isAddressValid = () =>
    address.cep.replace(/\D/g, "").length === 8 &&
    address.street.trim() !== "" &&
    address.number.trim() !== "" &&
    address.neighborhood.trim() !== "" &&
    address.city.trim() !== "" &&
    address.state.trim().length === 2;

  const handleCheckout = () => {
    if (!isAddressValid()) {
      toast.error("Preencha o endereço de entrega completo");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setBuyingFromCart(true);
      setPage("payment");
    }, 600);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b">
        <div className="container flex items-center h-16">
          <Button variant="ghost" size="sm" onClick={() => setPage("products")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
        </div>
      </header>

      <main className="container py-8 animate-fade-in">
        <div className="max-w-2xl mx-auto">
          {cart.length > 0 && <CheckoutSteps current={isAddressValid() ? "payment" : "address"} />}

          <div className="flex items-center gap-3 mb-8">
            <ShoppingCart className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-heading">Meu Carrinho</h1>
            <span className="text-sm text-muted-foreground">({cart.length} {cart.length === 1 ? "item" : "itens"})</span>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">Seu carrinho está vazio</p>
              <Button variant="outline" className="mt-4" onClick={() => setPage("products")}>
                Ver Produtos
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="bg-card rounded-xl border p-4 flex items-center gap-4">
                    <img src={item.product.image} alt={item.product.name} className="w-14 h-14 object-contain" loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">{item.product.category}</p>
                      <p className="text-sm font-bold text-primary mt-1">
                        R$ {item.product.price.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <AddressForm value={address} onChange={setAddress} />
              </div>

              {/* Cupom de desconto */}
              <div className="bg-card border rounded-xl p-5 mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Ticket className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm">Cupom de desconto</h3>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-success/10 border border-success/30 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{appliedCoupon.code}</p>
                        <p className="text-xs text-muted-foreground">{appliedCoupon.label}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={handleRemoveCoupon}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ex: DESCONTO10"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyCoupon())}
                        className="uppercase"
                      />
                      <Button variant="outline" onClick={handleApplyCoupon}>Aplicar</Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-2">
                      Experimente: <span className="font-mono">DESCONTO10</span>, <span className="font-mono">PROMO20</span> ou <span className="font-mono">FRETE5</span>
                    </p>
                  </>
                )}
              </div>

              <div className="bg-secondary rounded-xl p-5 mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-success font-medium">Grátis</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Cupom ({appliedCoupon.code})</span>
                    <span className="text-success font-medium">- R$ {discountAmount.toFixed(2).replace(".", ",")}</span>
                  </div>
                )}
                <div className="border-t pt-3 mt-1 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">R$ {total.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>

              <Button onClick={handleCheckout} disabled={loading} className="w-full h-12 text-base font-semibold mt-4">
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processando...</>
                ) : (
                  "Finalizar Compra"
                )}
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CartPage;
