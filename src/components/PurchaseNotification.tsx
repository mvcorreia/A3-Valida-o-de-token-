import { useEffect, useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import { products } from "@/store/useStore";

const FIRST_NAMES = ["Lucas", "Mariana", "Rafael", "Juliana", "Pedro", "Camila", "Felipe", "Ana", "Bruno", "Larissa", "Thiago", "Beatriz"];
const CITIES = ["São Paulo - SP", "Rio de Janeiro - RJ", "Belo Horizonte - MG", "Curitiba - PR", "Porto Alegre - RS", "Salvador - BA", "Recife - PE", "Brasília - DF"];
const TIMES = ["há 1 minuto", "há 2 minutos", "há 4 minutos", "há 7 minutos", "há 12 minutos"];

interface Notif {
  id: number;
  productName: string;
  productImage: string;
  name: string;
  city: string;
  time: string;
}

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const PurchaseNotification = () => {
  const [notif, setNotif] = useState<Notif | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let counter = 0;
    let hideTimer: ReturnType<typeof setTimeout>;

    const show = () => {
      const product = pick(products);
      counter += 1;
      setNotif({
        id: counter,
        productName: product.name,
        productImage: product.image,
        name: pick(FIRST_NAMES),
        city: pick(CITIES),
        time: pick(TIMES),
      });
      setVisible(true);
      hideTimer = setTimeout(() => setVisible(false), 5000);
    };

    // Primeira após 4s, depois a cada 15-20s
    const firstTimer = setTimeout(show, 4000);
    const interval = setInterval(() => show(), 17000);

    return () => {
      clearTimeout(firstTimer);
      clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, []);

  if (!notif) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 z-40 max-w-xs transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      role="status"
      aria-live="polite"
    >
      <div
        className="flex items-center gap-3 bg-card border rounded-xl p-3 pr-8 relative"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-lg bg-[#e6e6e6] flex items-center justify-center">
            <img src={notif.productImage} alt="" className="w-9 h-9 object-contain" loading="lazy" />
          </div>
          <span className="absolute -bottom-1 -right-1 bg-success text-white rounded-full p-1">
            <ShoppingBag className="w-3 h-3" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-foreground truncate">
            {notif.name} de {notif.city.split(" - ")[0]}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            comprou <span className="text-foreground font-medium">{notif.productName}</span>
          </p>
          <p className="text-[10px] text-muted-foreground/80 mt-0.5">{notif.time}</p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="absolute top-1.5 right-1.5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Fechar notificação"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default PurchaseNotification;
