import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Receipt } from "lucide-react";

const OrdersPage = () => {
  const { orders, setPage } = useStore();

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
          <div className="flex items-center gap-3 mb-8">
            <Receipt className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-heading">Meus Pedidos</h1>
            <span className="text-sm text-muted-foreground">
              ({orders.length} {orders.length === 1 ? "pedido" : "pedidos"})
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">Você ainda não realizou nenhuma compra</p>
              <Button variant="outline" className="mt-4" onClick={() => setPage("products")}>
                Ver Produtos
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card rounded-xl border p-5 animate-scale-in"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="flex items-center justify-between mb-3 pb-3 border-b">
                    <div>
                      <p className="text-xs text-muted-foreground">Pedido</p>
                      <p className="font-heading font-bold">#{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                      <p className="font-bold text-primary">
                        R$ {order.total.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.quantity}x {item.name}
                        </span>
                        <span>R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;
