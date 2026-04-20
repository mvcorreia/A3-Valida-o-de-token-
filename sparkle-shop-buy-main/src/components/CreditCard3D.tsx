import { Wifi } from "lucide-react";

interface Props {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
  flipped: boolean;
}

const CreditCard3D = ({ number, name, expiry, cvv, flipped }: Props) => {
  const displayNumber = (number || "").padEnd(19, "•").slice(0, 19);
  const groups = [
    displayNumber.slice(0, 4),
    displayNumber.slice(5, 9),
    displayNumber.slice(10, 14),
    displayNumber.slice(15, 19),
  ];

  return (
    <div className="card-3d w-full max-w-sm mx-auto aspect-[1.6/1]">
      <div className={`card-3d-inner ${flipped ? "is-flipped" : ""}`}>
        {/* FRONT */}
        <div
          className="card-face text-white p-5 flex flex-col justify-between"
          style={{
            background: "linear-gradient(135deg, #0a0a0a 0%, #2a2a2a 50%, #6b6b6b 100%)",
            boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)",
          }}
        >
          {/* Decorative shapes */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-8 w-44 h-44 rounded-full bg-white/5 blur-2xl" />

          <div className="relative flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest opacity-70">BuyNow</span>
              <span className="font-heading text-base font-bold">SafeCard</span>
            </div>
            <Wifi className="w-5 h-5 rotate-90 opacity-80" />
          </div>

          {/* Chip */}
          <div className="relative flex items-center gap-3">
            <div
              className="w-11 h-8 rounded-md"
              style={{
                background: "linear-gradient(135deg, #d4b25a, #f5e1a4 50%, #c9a14a)",
                boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
              }}
            />
          </div>

          <div className="relative">
            <div className="font-mono text-lg sm:text-xl tracking-[0.2em] flex justify-between">
              {groups.map((g, i) => (
                <span key={i}>{g}</span>
              ))}
            </div>
          </div>

          <div className="relative flex justify-between items-end gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[9px] uppercase tracking-widest opacity-60 mb-0.5">Titular</p>
              <p className="text-sm font-semibold uppercase truncate">
                {name || "NOME COMPLETO"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-widest opacity-60 mb-0.5">Validade</p>
              <p className="text-sm font-mono">{expiry || "MM/AA"}</p>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className="card-face card-face-back text-white"
          style={{
            background: "linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 50%, #555555 100%)",
            boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)",
          }}
        >
          <div className="h-9 bg-black/80 mt-5" />
          <div className="px-5 mt-5">
            <div className="bg-white/90 h-9 rounded flex items-center justify-end pr-3">
              <span className="font-mono text-sm tracking-widest text-foreground">
                {"•".repeat(Math.max(cvv.length, 3))}
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-widest opacity-70 mt-2 text-right">
              CVV
            </p>
          </div>
          <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
            <span className="text-[10px] uppercase tracking-widest opacity-60">
              BuyNow • SafeCard
            </span>
            <span className="text-[10px] opacity-60">Pagamento seguro</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCard3D;
