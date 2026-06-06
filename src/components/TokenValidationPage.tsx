import { useState, useEffect, useMemo } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Loader2,
  Clock,
  RotateCw,
  Ban,
} from "lucide-react";

import { toast } from "sonner";
import safecardLogo from "@/assets/safecard-logo.png";
import CheckoutSteps from "./CheckoutSteps";

const TOKEN_DURATION = 180;
const MAX_ATTEMPTS = 3;

const TokenValidationPage = () => {
  const {
    selectedProduct,
    buyingFromCart,
    cart,
    setPage,
    clearCart,
    addOrder,
    coupon,
    setCoupon,
    user,
  } = useStore();

  const [token, setToken] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [denied, setDenied] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(TOKEN_DURATION);
  const [validating, setValidating] = useState(false);
  const [resending, setResending] = useState(false);

  const [confirmedItems, setConfirmedItems] = useState<
    { name: string; quantity: number }[]
  >([]);

  const [orderId, setOrderId] = useState("");

  const items = useMemo(
    () =>
      buyingFromCart
        ? cart
        : selectedProduct
          ? [{ product: selectedProduct, quantity: 1 }]
          : [],
    [buyingFromCart, cart, selectedProduct],
  );

  useEffect(() => {
    if (confirmed || denied || blocked) return;

    if (secondsLeft <= 0) return;

    const id = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [secondsLeft, confirmed, denied, blocked]);

  const expired = secondsLeft <= 0;

  const attemptsLeft = MAX_ATTEMPTS - attempts;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);

    const r = s % 60;

    return `${m}:${r.toString().padStart(2, "0")}`;
  };

  const handleResend = async () => {
    setResending(true);

    try {
      const subtotal = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );

      const response = await fetch("https://a3-valida-o-de-token.onrender.com/payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: subtotal,
          email: user.email,
        }),
      });

      if (response.ok) {
        setSecondsLeft(TOKEN_DURATION);

        setToken("");

        setAttempts(0);

        toast.success("Novo token enviado para seu email!");
      } else {
        toast.error("Erro ao reenviar token");
      }
    } catch {
      toast.error("Erro ao conectar com backend");
    } finally {
      setResending(false);
    }
  };

  const handleValidate = async () => {
    if (token.length !== 6 || validating) return;

    setValidating(true);

    try {
      const response = await fetch(
        "https://a3-valida-o-de-token.onrender.com/payment/validate-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
          }),
        },
      );

      const data = await response.text();

      if (response.ok && data.includes("sucesso")) {
        const subtotal = items.reduce(
          (s, i) => s + i.product.price * i.quantity,
          0,
        );

        const activeCoupon = buyingFromCart ? coupon : null;

        const discount = activeCoupon ? subtotal * activeCoupon.discount : 0;

        const total = subtotal - discount;

        const id = String(Math.floor(Math.random() * 900000 + 100000));

        const orderItems = items.map((i) => ({
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        }));

        addOrder({
          id,
          date: new Date().toLocaleDateString("pt-BR"),
          total,
          items: orderItems,
        });

        setOrderId(id);

        setConfirmedItems(
          orderItems.map((i) => ({
            name: i.name,
            quantity: i.quantity,
          })),
        );

        if (buyingFromCart) {
          clearCart();

          setCoupon(null);
        }

        setConfirmed(true);
      } else {
        const newAttempts = attempts + 1;

        setAttempts(newAttempts);

        setToken("");

        if (newAttempts >= MAX_ATTEMPTS) {
          setBlocked(true);

          toast.error("Compra bloqueada");
        } else {
          toast.error(
            `Token inválido. ${
              MAX_ATTEMPTS - newAttempts
            } tentativa(s) restante(s).`,
          );
        }
      }
    } catch {
      toast.error("Erro ao conectar com backend");
    } finally {
      setValidating(false);
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 app-bg py-8">
        <CheckoutSteps current="confirmation" />

        <div className="text-center animate-scale-in max-w-md">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/10 mb-6">
            <CheckCircle2 className="w-12 h-12 text-success" />
          </div>

          <h1 className="text-3xl font-heading">
            Compra realizada com sucesso
          </h1>

          <p className="text-muted-foreground mt-3">
            {confirmedItems.length === 1 ? (
              <>
                Seu pedido de{" "}
                <span className="font-semibold text-foreground">
                  {confirmedItems[0].name}
                </span>{" "}
                foi confirmado.
              </>
            ) : (
              <>
                Seus {confirmedItems.length} itens foram comprados com sucesso.
              </>
            )}
          </p>

          <div
            className="bg-card border rounded-xl p-4 mt-6 inline-block"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <p className="text-sm text-muted-foreground">Número do pedido</p>

            <p className="font-heading font-bold text-lg">#{orderId}</p>
          </div>

          <div className="mt-8 flex gap-3 justify-center flex-wrap">
            <Button
              onClick={() => setPage("products")}
              className="h-12 px-8 font-semibold"
              style={{
                background: "var(--gradient-brand)",
                boxShadow: "var(--shadow-brand)",
              }}
            >
              Voltar ao início
            </Button>

            <Button
              variant="outline"
              onClick={() => setPage("orders")}
              className="h-12 px-6 font-semibold"
            >
              Ver meus pedidos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (blocked) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "var(--gradient-safecard)" }}
      >
        <div className="text-center animate-scale-in max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/15 mb-6">
            <Ban className="w-10 h-10 text-destructive" />
          </div>

          <h1 className="text-3xl font-heading text-white">Compra bloqueada</h1>

          <p className="text-white/70 mt-3">
            Você excedeu o número máximo de tentativas.
          </p>

          <Button
            onClick={() => setPage("products")}
            className="h-12 px-8 font-semibold mt-8"
          >
            Voltar à Loja
          </Button>
        </div>
      </div>
    );
  }

  if (denied) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "var(--gradient-safecard)" }}
      >
        <div className="text-center animate-scale-in max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/15 mb-6">
            <XCircle className="w-10 h-10 text-destructive" />
          </div>

          <h1 className="text-3xl font-heading text-white">Compra negada</h1>

          <p className="text-white/70 mt-3">O token informado é inválido.</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: "var(--gradient-safecard)" }}
    >
      <div className="max-w-md w-full text-center animate-scale-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/10 mb-4 p-2 safecard-glow">
          <img
            src={safecardLogo}
            alt="SafeCard"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>

        <p className="text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
          SafeCard
        </p>

        <h1 className="text-3xl font-heading text-white mt-1">
          Confirme sua compra
        </h1>

        <p className="text-white/60 text-sm mt-2 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          Proteção inteligente contra fraudes
        </p>

        <div
          className="rounded-2xl border border-white/10 p-6 mt-7 safecard-glow-card animate-fade-in"
          style={{ background: "hsl(var(--safecard-surface))" }}
        >
          <div className="flex items-center justify-between mb-5 text-xs">
            <div
              className={`flex items-center gap-1.5 ${
                expired ? "text-destructive" : "text-white/70"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />

              <span className="font-mono font-semibold">
                {expired ? "Expirado" : `Expira em ${formatTime(secondsLeft)}`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-white/70">
              <span>Tentativas:</span>

              <span
                className={`font-bold ${
                  attemptsLeft <= 1 ? "text-destructive" : "text-success"
                }`}
              >
                {attemptsLeft}/{MAX_ATTEMPTS}
              </span>
            </div>
          </div>

          <p className="text-white/70 text-sm mb-4">
            Insira o token de 6 dígitos enviado para seu email
          </p>

          <div className="flex justify-center [&_input]:bg-white/5 [&_input]:border-white/20 [&_input]:text-white">
            <InputOTP
              maxLength={6}
              value={token}
              onChange={setToken}
              disabled={expired || validating}
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className="border-white/20 text-white"
                />
                <InputOTPSlot
                  index={1}
                  className="border-white/20 text-white"
                />
                <InputOTPSlot
                  index={2}
                  className="border-white/20 text-white"
                />
                <InputOTPSlot
                  index={3}
                  className="border-white/20 text-white"
                />
                <InputOTPSlot
                  index={4}
                  className="border-white/20 text-white"
                />
                <InputOTPSlot
                  index={5}
                  className="border-white/20 text-white"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <Button
          onClick={handleValidate}
          disabled={token.length !== 6 || validating || expired}
          className="w-full h-12 text-base font-semibold mt-6 bg-success hover:bg-success/90 text-white"
        >
          {validating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Validando...
            </>
          ) : (
            "Validar compra"
          )}
        </Button>

        <Button
          variant="outline"
          onClick={handleResend}
          disabled={!expired || resending}
          className="w-full h-11 mt-3 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          {resending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Reenviando...
            </>
          ) : (
            <>
              <RotateCw className="w-4 h-4 mr-2" />
              Reenviar código
            </>
          )}
        </Button>

        <button
          onClick={() => setPage("payment")}
          className="text-sm text-white/50 hover:text-white mt-4 inline-block"
        >
          Voltar ao pagamento
        </button>
      </div>
    </div>
  );
};
export default TokenValidationPage;
