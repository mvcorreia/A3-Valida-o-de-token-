import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User } from "lucide-react";
import buynowLogo from "@/assets/buynow-logo.png";

const LoginPage = () => {
  const { currentPage, setPage, login } = useStore();
  const isRegister = currentPage === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(isRegister ? name : email.split("@")[0]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <img src={buynowLogo} alt="BuyNow" className="w-32 h-32 mx-auto object-contain" />
          <p className="text-muted-foreground -mt-2 text-base">
            Compre rápido e com segurança
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className="bg-card rounded-2xl border p-7 space-y-4"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <h2 className="text-xl font-heading text-center">
              {isRegister ? "Criar Conta" : "Entrar na sua conta"}
            </h2>

            {isRegister && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-11"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold mt-2"
              style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-brand)" }}
            >
              {isRegister ? "Registrar" : "Entrar"}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isRegister ? "Já tem uma conta?" : "Não tem conta?"}{" "}
          <button
            onClick={() => setPage(isRegister ? "login" : "register")}
            className="text-primary font-semibold hover:underline"
          >
            {isRegister ? "Fazer login" : "Registre-se"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
