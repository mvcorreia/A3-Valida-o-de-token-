import { useEffect, useState } from "react";

import { useStore } from "@/store/useStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ArrowLeft, User, CreditCard, MapPin, Save } from "lucide-react";

import { toast } from "sonner";

const AccountPage = () => {
  const { setPage } = useStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");

    if (savedEmail) {
      setEmail(savedEmail);
      loadUser(savedEmail);
    }
  }, []);

  const loadUser = async (userEmail: string) => {
    try {
      const response = await fetch(`https://a3-valida-o-de-token.onrender.com/users/${userEmail}`);

      if (!response.ok) return;

      const data = await response.json();

      setName(data.name || "");

      setStreet(data.street || "");
      setNumber(data.number || "");
      setCity(data.city || "");
      setState(data.state || "");

      setCardNumber(data.cardNumber || "");
      setCardName(data.cardName || "");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch("https://a3-valida-o-de-token.onrender.com/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          street,
          number,
          city,
          state,
          cardNumber,
          cardName,
        }),
      });

      if (response.ok) {
        toast.success("Conta atualizada com sucesso");
      } else {
        toast.error("Erro ao salvar");
      }
    } catch (error) {
      toast.error("Erro ao conectar com backend");
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b">
        <div className="container flex items-center h-16">
          <Button variant="ghost" size="sm" onClick={() => setPage("products")}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <User className="w-8 h-8 text-primary" />
            </div>

            <h1 className="text-3xl font-heading">Minha Conta</h1>

            <p className="text-muted-foreground">Gerencie seus dados</p>
          </div>

          {/* Dados pessoais */}
          <div className="bg-card border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Dados Pessoais</h2>
            </div>

            <Input
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input placeholder="Email" value={email} disabled />
          </div>

          {/* Endereço */}
          <div className="bg-card border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Endereço</h2>
            </div>

            <Input
              placeholder="Rua"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />

            <Input
              placeholder="Número"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Cidade"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <Input
                placeholder="UF"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </div>

          {/* Cartão */}
          <div className="bg-card border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Cartão</h2>
            </div>

            <Input
              placeholder="Número do cartão"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />

            <Input
              placeholder="Nome no cartão"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
          </div>

          <Button onClick={handleSave} className="w-full h-12">
            <Save className="w-4 h-4 mr-2" />
            Salvar alterações
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AccountPage;
