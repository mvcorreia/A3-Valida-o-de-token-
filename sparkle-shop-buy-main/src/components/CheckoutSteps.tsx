import { Check, ShoppingCart, MapPin, CreditCard, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckoutStep = "cart" | "address" | "payment" | "confirmation";

interface Props {
  current: CheckoutStep;
}

const steps: { key: CheckoutStep; label: string; icon: typeof ShoppingCart }[] = [
  { key: "cart", label: "Carrinho", icon: ShoppingCart },
  { key: "address", label: "Endereço", icon: MapPin },
  { key: "payment", label: "Pagamento", icon: CreditCard },
  { key: "confirmation", label: "Confirmação", icon: ShieldCheck },
];

const CheckoutSteps = ({ current }: Props) => {
  const currentIdx = steps.findIndex((s) => s.key === current);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 px-2">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    isDone && "bg-success border-success text-success-foreground",
                    isCurrent && "border-primary text-primary scale-110",
                    !isDone && !isCurrent && "border-muted-foreground/30 text-muted-foreground/50 bg-card"
                  )}
                  style={isCurrent ? { boxShadow: "var(--shadow-brand)" } : undefined}
                >
                  {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span
                  className={cn(
                    "text-[11px] font-semibold whitespace-nowrap",
                    (isDone || isCurrent) ? "text-foreground" : "text-muted-foreground/60"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 mb-5 transition-all",
                    idx < currentIdx ? "bg-success" : "bg-muted-foreground/20"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;
