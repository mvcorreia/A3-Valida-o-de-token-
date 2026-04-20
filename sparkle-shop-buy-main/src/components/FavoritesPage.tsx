import { useStore, products } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Plus, Trash2, Zap, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const FavoritesPage = () => {
  const { favorites, toggleFavorite, addToCart, selectProduct, setPage, setBuyingFromCart } = useStore();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-background/85 backdrop-blur-lg border-b">
        <div className="container flex items-center justify-between h-16">
          <Button variant="ghost" size="sm" onClick={() => setPage("products")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Heart className="w-4 h-4 fill-primary text-primary" />
            {favoriteProducts.length} {favoriteProducts.length === 1 ? "favorito" : "favoritos"}
          </div>
        </div>
      </header>

      <main className="container py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-heading">Meus favoritos</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Produtos que você salvou para comprar depois
          </p>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-heading">Sua lista de favoritos está vazia</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-sm mx-auto">
              Toque no coração de qualquer produto para salvá-lo aqui.
            </p>
            <Button className="mt-6" onClick={() => setPage("products")}>
              Explorar produtos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-card rounded-2xl border p-5 transition-all hover:border-primary/40 hover:-translate-y-1 animate-scale-in flex flex-col relative"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <button
                  onClick={() => {
                    toggleFavorite(product.id);
                    toast.success("Removido dos favoritos");
                  }}
                  className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm border flex items-center justify-center hover:bg-destructive/10 hover:border-destructive/40 transition-colors"
                  aria-label="Remover dos favoritos"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>

                <button onClick={() => selectProduct(product)} className="text-left flex-1">
                  <div className="rounded-xl flex items-center justify-center h-32 mb-4 bg-[#e6e6e6]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-contain group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {product.category}
                  </span>
                  <h3 className="font-heading text-lg mt-2 line-clamp-1">{product.name}</h3>
                  <p className="text-xl font-bold text-primary mt-3">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </p>
                </button>
                <div className="flex flex-col gap-2 mt-4">
                  <Button
                    size="sm"
                    className="w-full font-semibold"
                    style={{ background: "var(--gradient-brand)" }}
                    onClick={() => {
                      selectProduct(product);
                      setBuyingFromCart(false);
                      setPage("payment");
                    }}
                  >
                    <Zap className="w-4 h-4 mr-1" /> Comprar agora
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      addToCart(product);
                      toast.success(`${product.name} adicionado ao carrinho`);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Adicionar ao carrinho
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FavoritesPage;
