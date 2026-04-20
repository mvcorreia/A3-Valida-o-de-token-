import { useStore, products, categories, Product } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { LogOut, Search, ShoppingCart, Plus, Zap, Receipt, Flame, ArrowRight, Sparkles, Star, Menu, Smartphone, Shirt, Footprints, Watch, Refrigerator, LayoutGrid, Heart, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import buynowLogo from "@/assets/buynow-logo.png";
import PurchaseNotification from "./PurchaseNotification";
import { getProductReviews } from "@/lib/reviews";

const CATEGORY_ICONS: Record<string, typeof Smartphone> = {
  "Eletrônicos": Smartphone,
  "Roupas": Shirt,
  "Calçados": Footprints,
  "Acessórios": Watch,
  "Eletrodomésticos": Refrigerator,
};

type SortOption = "relevance" | "price-asc" | "price-desc" | "rating" | "name";

const PRICE_MIN = 0;
const PRICE_MAX = Math.ceil(Math.max(...products.map((p) => p.price)) / 100) * 100;

const ProductsPage = () => {
  const { userName, logout, selectProduct, addToCart, cart, favorites, toggleFavorite, setPage, setBuyingFromCart } = useStore();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "Todos" || p.category === activeCategory;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });

    const sorted = [...list];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating":
        sorted.sort((a, b) => getProductReviews(b.id).average - getProductReviews(a.id).average);
        break;
      default:
        break;
    }
    return sorted;
  }, [search, activeCategory, priceRange, sortBy]);

  // Produtos em destaque (curados)
  const featuredIds = [2, 4, 7, 8, 9, 29];
  const featured = products.filter((p) => featuredIds.includes(p.id));
  const priceFilterActive = priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX;
  const showFeatured = search.trim() === "" && activeCategory === "Todos" && !priceFilterActive && sortBy === "relevance";

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categoryCounts = categories.reduce<Record<string, number>>((acc, c) => {
    acc[c] = products.filter((p) => p.category === c).length;
    return acc;
  }, {});

  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    setSearch("");
    setMenuOpen(false);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} adicionado ao carrinho`);
  };

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    selectProduct(product);
    setBuyingFromCart(false);
    setPage("payment");
  };

  const handleToggleFavorite = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const wasFav = favorites.includes(product.id);
    toggleFavorite(product.id);
    toast.success(wasFav ? "Removido dos favoritos" : `${product.name} salvo nos favoritos`);
  };

  const resetFilters = () => {
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setSortBy("relevance");
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-background/85 backdrop-blur-lg border-b">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menu de categorias">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle className="font-heading text-left">Categorias</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-1">
                  <button
                    onClick={() => handleSelectCategory("Todos")}
                    className={`flex items-center justify-between gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                      activeCategory === "Todos" ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <LayoutGrid className="w-4 h-4" />
                      Todos
                    </span>
                    <span className="text-xs text-muted-foreground">{products.length}</span>
                  </button>
                  {categories.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat] ?? LayoutGrid;
                    const active = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => handleSelectCategory(cat)}
                        className={`flex items-center justify-between gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                          active ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          {cat}
                        </span>
                        <span className="text-xs text-muted-foreground">{categoryCounts[cat]}</span>
                      </button>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
            <button onClick={() => setPage("products")} className="flex items-center gap-2">
              <img src={buynowLogo} alt="BuyNow" className="h-9 w-auto object-contain" />
            </button>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Olá, <span className="font-semibold text-foreground">{userName}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={() => setPage("favorites")} className="relative">
              <Heart className={`w-4 h-4 ${favorites.length > 0 ? "fill-primary text-primary" : ""}`} />
              <span className="hidden sm:inline ml-1">Favoritos</span>
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center sm:hidden">
                  {favorites.length}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setPage("orders")} className="hidden sm:inline-flex">
              <Receipt className="w-4 h-4 mr-1" /> Pedidos
            </Button>
            <Button variant="ghost" size="sm" className="relative" onClick={() => setPage("cart")}>
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>

        {/* Abas de categorias */}
        <div className="border-t bg-background/60">
          <div className="container">
            <div className="flex items-center gap-1 overflow-x-auto py-2">
              <button
                onClick={() => handleSelectCategory("Todos")}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === "Todos"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Todos
              </button>
              {categories.map((cat) => {
                const Icon = CATEGORY_ICONS[cat] ?? LayoutGrid;
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleSelectCategory(cat)}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 animate-fade-in">
        {/* Banner Promocional */}
        <div
          className="relative overflow-hidden rounded-2xl mb-8 p-6 sm:p-8 animate-fade-in"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.7) 60%, hsl(var(--accent)) 100%)" }}
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <Sparkles className="absolute top-4 right-6 w-5 h-5 text-white/60 animate-pulse" />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="text-primary-foreground">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold mb-3">
                <Flame className="w-3.5 h-3.5" /> Promoção do dia
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl leading-tight">
                Até <span className="text-4xl sm:text-5xl font-bold">30% OFF</span> em Eletrônicos
              </h2>
              <p className="text-sm text-primary-foreground/90 mt-2">
                Aproveite os melhores preços em fones, smartwatches e mais.
              </p>
            </div>
            <Button
              size="lg"
              variant="secondary"
              className="font-semibold shadow-lg hover-scale shrink-0"
              onClick={() => handleSelectCategory("Eletrônicos")}
            >
              Ver ofertas <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Produtos em Destaque */}
        {showFeatured && (
          <section className="mb-10 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary fill-primary" />
                <h2 className="text-xl sm:text-2xl font-heading">Produtos em destaque</h2>
              </div>
              <span className="text-xs text-muted-foreground hidden sm:block">Selecionados para você</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {featured.map((product) => (
                <button
                  key={product.id}
                  onClick={() => selectProduct(product)}
                  className="group relative text-left bg-card rounded-2xl border p-4 transition-all hover:border-primary/50 hover:-translate-y-1 animate-scale-in overflow-hidden"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <span className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-primary-foreground" /> TOP
                  </span>
                  <div className="rounded-xl flex items-center justify-center h-28 mb-3 bg-[#e6e6e6]">
                    <img src={product.image} alt={product.name} className="w-20 h-20 object-contain group-hover:scale-110 transition-transform" loading="lazy" />
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                  <p className="text-base font-bold text-primary mt-1">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-heading">
              {activeCategory === "Todos" ? "Produtos" : activeCategory}
            </h2>
            <p className="text-muted-foreground text-sm">{filtered.length} itens disponíveis</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar produto..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>

        {/* Toolbar de filtros e ordenação */}
        <div className="flex flex-wrap items-center gap-3 mb-8 p-3 bg-card border rounded-xl">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Preço
                {priceFilterActive && (
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {`R$${priceRange[0]}–${priceRange[1]}`}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Faixa de preço</h4>
                  <span className="text-xs text-muted-foreground">
                    R$ {priceRange[0]} – R$ {priceRange[1]}
                  </span>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={50}
                  className="my-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>R$ {PRICE_MIN}</span>
                  <span>R$ {PRICE_MAX}</span>
                </div>
                {priceFilterActive && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setPriceRange([PRICE_MIN, PRICE_MAX])}
                  >
                    Limpar faixa
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[200px] h-9">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Mais relevantes</SelectItem>
              <SelectItem value="price-asc">Menor preço</SelectItem>
              <SelectItem value="price-desc">Maior preço</SelectItem>
              <SelectItem value="rating">Melhor avaliados</SelectItem>
              <SelectItem value="name">Nome (A-Z)</SelectItem>
            </SelectContent>
          </Select>

          {(priceFilterActive || sortBy !== "relevance") && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1 ml-auto">
              <X className="w-3.5 h-3.5" /> Limpar filtros
            </Button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border">
            <h3 className="text-lg font-heading">Nenhum produto encontrado</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Tente ajustar os filtros ou a busca.
            </p>
            <Button variant="outline" size="sm" className="mt-4" onClick={resetFilters}>
              Limpar filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => {
              const reviews = getProductReviews(product.id);
              const isFav = favorites.includes(product.id);
              return (
                <div
                  key={product.id}
                  className="group bg-card rounded-2xl border p-5 transition-all hover:border-primary/40 hover:-translate-y-1 animate-scale-in flex flex-col relative"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <button
                    onClick={(e) => handleToggleFavorite(e, product)}
                    className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm border flex items-center justify-center hover:scale-110 transition-transform"
                    aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </button>

                  <button onClick={() => selectProduct(product)} className="text-left flex-1">
                    <div className="rounded-xl flex items-center justify-center h-32 mb-4 bg-[#e6e6e6]">
                      <img src={product.image} alt={product.name} className="w-24 h-24 object-contain group-hover:scale-105 transition-transform" loading="lazy" />
                    </div>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                    <h3 className="font-heading text-lg mt-2 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                      <span className="text-xs font-semibold">{reviews.average.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({reviews.count})</span>
                    </div>
                    <p className="text-xl font-bold text-primary mt-3">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </p>
                  </button>
                  <div className="flex flex-col gap-2 mt-4">
                    <Button
                      size="sm"
                      className="w-full font-semibold"
                      style={{ background: "var(--gradient-brand)" }}
                      onClick={(e) => handleBuyNow(e, product)}
                    >
                      <Zap className="w-4 h-4 mr-1" /> Comprar agora
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Adicionar ao carrinho
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <PurchaseNotification />
    </div>
  );
};

export default ProductsPage;
