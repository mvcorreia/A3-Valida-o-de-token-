import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CreditCard, Lock, ShieldCheck, Loader2 } from "lucide-react";
import AddressForm from "./AddressForm";
import CreditCard3D from "./CreditCard3D";
import CheckoutSteps from "./CheckoutSteps";
import { toast } from "sonner";

const PaymentPage = () => {
  const { selectedProduct, cart, buyingFromCart, setPage, address, setAddress, coupon } = useStore();
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const items = buyingFromCart ? cart : selectedProduct ? [{ product: selectedProduct, quantity: 1 }] : [];
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  // Cupom aplica apenas em compras vindas do carrinho
  const activeCoupon = buyingFromCart ? coupon : null;
  const discountAmount = activeCoupon ? subtotal * activeCoupon.discount : 0;
  const total = subtotal - discountAmount;

  if (items.length === 0) return null;

  const isAddressValid = () =>
    address.cep.replace(/\D/g, "").length === 8 &&
    address.street.trim() !== "" &&
    address.number.trim() !== "" &&
    address.neighborhood.trim() !== "" &&
    address.city.trim() !== "" &&
    address.state.trim().length === 2;

  const formatCard = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})/g, "$1 ").trim();
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddressValid()) {
      toast.error("Preencha o endereço de entrega completo");
      return;
    }
    setSubmitting(true);
    setTimeout(() => setPage("token-validation"), 700);
  };

  const handleBack = () => {
    setPage(buyingFromCart ? "cart" : "product-detail");
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b">
        <div className="container flex items-center h-16">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
        </div>
      </header>

      <main className="container py-8 animate-fade-in">
        <div className="max-w-lg mx-auto">
          <CheckoutSteps current="payment" />

          <div className="text-center mb-6">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
              style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-brand)" }}
            >
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-heading">Pagamento</h1>
            <p className="text-muted-foreground text-sm mt-1">Insira os dados do cartão</p>
          </div>

          {/* Selo de segurança */}
          <div className="flex items-center gap-3 bg-success/10 border border-success/20 rounded-xl p-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-success/15 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-success" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-foreground">Pagamento protegido</p>
              <p className="text-xs text-muted-foreground">Seus dados são criptografados de ponta a ponta</p>
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-secondary rounded-xl p-4 mb-6 space-y-3">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-4">
                <img src={item.product.image} alt={item.product.name} className="w-14 h-14 object-contain" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity > 1 ? `${item.quantity}x ` : ""}{item.product.category}
                  </p>
                </div>
                <p className="font-bold text-primary text-sm">
                  R$ {(item.product.price * item.quantity).toFixed(2).replace(".", ",")}
                </p>
              </div>
            ))}
            {(items.length > 1 || activeCoupon) && (
              <div className="border-t pt-3 mt-1 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                </div>
                {activeCoupon && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Cupom ({activeCoupon.code})</span>
                    <span className="text-success font-medium">- R$ {discountAmount.toFixed(2).replace(".", ",")}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1">
                  <span className="font-semibold text-sm">Total</span>
                  <span className="font-bold text-primary">R$ {total.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>
            )}
          </div>

          {!buyingFromCart && (
            <div className="mb-4">
              <AddressForm value={address} onChange={setAddress} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-2">
              <CreditCard3D
                number={cardNumber}
                name={cardName}
                expiry={expiry}
                cvv={cvv}
                flipped={flipped}
              />
            </div>

            <div className="bg-card rounded-xl border p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Número do Cartão</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCard(e.target.value))}
                    onFocus={() => setFlipped(false)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Nome no Cartão</label>
                <Input
                  placeholder="Nome como está no cartão"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  onFocus={() => setFlipped(false)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Validade</label>
                  <Input
                    placeholder="MM/AA"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    onFocus={() => setFlipped(false)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">CVV</label>
                  <Input
                    type="password"
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    onFocus={() => setFlipped(true)}
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 text-base font-semibold"
              style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-brand)" }}
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processando pagamento...</>
              ) : (
                <><Lock className="w-4 h-4 mr-2" /> Pagar — R$ {total.toFixed(2).replace(".", ",")}</>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Pagamento seguro e criptografado
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
