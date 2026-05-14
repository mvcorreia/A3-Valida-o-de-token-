import { useState } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface Props {
  value: Address;
  onChange: (a: Address) => void;
}

const AddressForm = ({ value, onChange }: Props) => {
  const [loading, setLoading] = useState(false);

  const formatCep = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 8);
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
  };

  const fetchCep = async (cep: string) => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }
      onChange({
        ...value,
        cep: formatCep(digits),
        street: data.logradouro || "",
        neighborhood: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || "",
      });
      toast.success("Endereço encontrado!");
    } catch {
      toast.error("Erro ao buscar CEP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-xl border p-5 space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary" />
        <h2 className="font-heading text-lg">Endereço de entrega</h2>
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 block">CEP</label>
        <div className="relative">
          <Input
            placeholder="00000-000"
            value={value.cep}
            onChange={(e) => {
              const formatted = formatCep(e.target.value);
              onChange({ ...value, cep: formatted });
              if (formatted.replace(/\D/g, "").length === 8) fetchCep(formatted);
            }}
            required
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          O endereço será preenchido automaticamente
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="text-sm font-medium mb-1.5 block">Rua</label>
          <Input
            placeholder="Rua / Avenida"
            value={value.street}
            onChange={(e) => onChange({ ...value, street: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Número</label>
          <Input
            placeholder="123"
            value={value.number}
            onChange={(e) => onChange({ ...value, number: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 block">Complemento</label>
        <Input
          placeholder="Apto, bloco (opcional)"
          value={value.complement}
          onChange={(e) => onChange({ ...value, complement: e.target.value })}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 block">Bairro</label>
        <Input
          placeholder="Bairro"
          value={value.neighborhood}
          onChange={(e) => onChange({ ...value, neighborhood: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="text-sm font-medium mb-1.5 block">Cidade</label>
          <Input
            placeholder="Cidade"
            value={value.city}
            onChange={(e) => onChange({ ...value, city: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">UF</label>
          <Input
            placeholder="UF"
            maxLength={2}
            value={value.state}
            onChange={(e) => onChange({ ...value, state: e.target.value.toUpperCase() })}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
