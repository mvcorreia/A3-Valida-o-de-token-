import { useStore, products, Product } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Star, Shield, Truck, Plus, Sparkles, Heart, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { getProductReviews } from "@/lib/reviews";

const StarRating = ({ value, size = "w-4 h-4" }: { value: number; size?: string }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => {
      const filled = i <= Math.round(value);
      return (
        <Star
          key={i}
          className={`${size} ${filled ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
        />
      );
    })}
  </div>
);

const ProductDetailPage = () => {
  const { selectedProduct, setPage, addToCart, setBuyingFromCart, selectProduct, favorites, toggleFavorite } = useStore();

  if (!selectedProduct) return null;

  const isFav = favorites.includes(selectedProduct.id);
  const { reviews, average, count } = getProductReviews(selectedProduct.id);

  const handleBuyNow = () => {
    setBuyingFromCart(false);
    setPage("payment");
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct);
    toast.success(`${selectedProduct.name} adicionado ao carrinho`);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(selectedProduct.id);
    toast.success(isFav ? "Removido dos favoritos" : `${selectedProduct.name} salvo nos favoritos`);
  };

  // Recomendados
  const sameCategory = products.filter(
    (p) => p.id !== selectedProduct.id && p.category === selectedProduct.category
  );
  const others = products.filter(
    (p) => p.id !== selectedProduct.id && p.category !== selectedProduct.category
  );
  const recommended = [...sameCategory, ...others].slice(0, 4);

  const handleAddRecommended = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} adicionado ao carrinho`);
  };

  // Distribuição de estrelas (gráfico de barras)
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const maxBar = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b">
        <div className="container flex items-center justify-between h-16">
          <Button variant="ghost" size="sm" onClick={() => setPage("products")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <Button variant="ghost" size="sm" onClick={handleToggleFavorite}>
            <Heart className={`w-4 h-4 mr-1 ${isFav ? "fill-primary text-primary" : ""}`} />
            {isFav ? "Salvo" : "Favoritar"}
          </Button>
        </div>
      </header>

      <main className="container py-8 animate-fade-in">
        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl border flex items-center justify-center p-12 relative">
            <button
              onClick={handleToggleFavorite}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background border flex items-center justify-center hover:scale-110 transition-transform"
              aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              <Heart className={`w-5 h-5 ${isFav ? "fill-primary text-primary" : "text-muted-foreground"}`} />
            </button>
            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-64 h-64 object-contain" />
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
              {selectedProduct.category}
            </span>
            <h1 className="text-3xl font-heading mt-3">{selectedProduct.name}</h1>

            <div className="flex items-center gap-2 mt-2">
              <StarRating value={average} />
              <span className="text-sm font-semibold">{average.toFixed(1)}</span>
              <a href="#avaliacoes" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                ({count} avaliações)
              </a>
            </div>

            <p className="text-muted-foreground mt-4 leading-relaxed">{selectedProduct.description}</p>

            <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Truck className="w-4 h-4" /> Frete grátis</span>
              <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Garantia 1 ano</span>
            </div>

            <div className="mt-6 p-4 bg-secondary rounded-xl">
              <span className="text-sm text-muted-foreground">Preço</span>
              <p className="text-3xl font-bold text-primary">
                R$ {selectedProduct.price.toFixed(2).replace(".", ",")}
              </p>
              <span className="text-xs text-muted-foreground">
                ou 12x de R$ {(selectedProduct.price / 12).toFixed(2).replace(".", ",")}
              </span>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                size="lg"
                className="flex-1 h-14 text-base font-semibold"
                onClick={handleBuyNow}
              >
                <ShoppingCart className="w-5 h-5 mr-2" /> Comprar Agora
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 text-base font-semibold"
                onClick={handleAddToCart}
              >
                <Plus className="w-5 h-5 mr-2" /> Carrinho
              </Button>
            </div>
          </div>
        </div>

        {/* Avaliações */}
        <section id="avaliacoes" className="max-w-4xl mx-auto mt-16 animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2 className="text-xl sm:text-2xl font-heading">Avaliações dos clientes</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 bg-card border rounded-2xl p-6 mb-6">
            <div className="flex flex-col items-center justify-center text-center md:border-r md:pr-6">
              <p className="text-5xl font-bold text-primary">{average.toFixed(1)}</p>
              <StarRating value={average} size="w-5 h-5" />
              <p className="text-sm text-muted-foreground mt-2">
                Baseado em {count} avaliações
              </p>
            </div>
            <div className="md:col-span-2 space-y-2">
              {distribution.map(({ star, count: c }) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-semibold w-6 flex items-center gap-0.5">
                    {star} <Star className="w-3 h-3 fill-accent text-accent" />
                  </span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all"
                      style={{ width: `${(c / maxBar) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-6 text-right">{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-card border rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center">
                      {r.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{r.author}</p>
                      <p className="text-xs text-muted-foreground">{r.date}</p>
                    </div>
                  </div>
                  <StarRating value={r.rating} />
                </div>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Você também pode gostar */}
        {recommended.length > 0 && (
          <section className="max-w-4xl mx-auto mt-16 animate-fade-in">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl sm:text-2xl font-heading">Você também pode gostar</h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {recommended.map((product) => (
                <div
                  key={product.id}
                  className="group bg-card rounded-2xl border p-4 transition-all hover:border-primary/50 hover:-translate-y-1 animate-scale-in flex flex-col"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <button onClick={() => selectProduct(product)} className="text-left flex-1">
                    <div className="rounded-xl flex items-center justify-center h-28 mb-3 bg-[#e6e6e6]">
                      <img src={product.image} alt={product.name} className="w-20 h-20 object-contain group-hover:scale-110 transition-transform" loading="lazy" />
                    </div>
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                    <h3 className="font-semibold text-sm mt-2 line-clamp-1">{product.name}</h3>
                    <p className="text-base font-bold text-primary mt-1">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </p>
                  </button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={(e) => handleAddRecommended(e, product)}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProductDetailPage;
