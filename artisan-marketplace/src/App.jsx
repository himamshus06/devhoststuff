
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  Heart,
  Leaf,
  MapPin,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { clearSession, getSellerProducts, getSession, saveOrders } from "./localStore";
import "./index.css";
import { LanguageToggle, useLanguage } from "./i18n.jsx";

const BASKET_IMAGE =
  "https://amritkalash.shop/wp-content/uploads/2024/03/Handmade_Bamboo_Storage_Basket_.png";

const products = [
  {
    id: 1, slug: "savitri-hegde",
    name: "Kasuti Embroidered Wall Textile",
    craft: "Kasuti Embroidery", artisan: "Savitri Hegde",
    location: "North Karnataka", price: 1450,
    image: "https://images.livemint.com/img/2021/08/06/1140x641/kasuti_1_1628239231619_1628239246101.jpg",
    description: "A textile inspired by the intricate geometric patterns of traditional Kasuti hand embroidery, made slowly stitch by stitch.",
    color: "#E9D7C4", tag: "Hand embroidered",
  },
  {
    id: 2, slug: "savitri-hegde",
    name: "Lotus Kasuti Cushion Cover", craft: "Kasuti Embroidery",
    artisan: "Savitri Hegde", location: "North Karnataka", price: 780,
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=85",
    description: "A soft cotton cushion cover with a quiet, geometric Kasuti-inspired border for a little colour at home.",
    color: "#D7C7B8", tag: "Small batch",
  },
  {
    id: 3, slug: "basketry-artisan",
    name: "Handwoven Bamboo Basket", craft: "Basketry",
    artisan: "Local Basketry Artisan", location: "Coastal Karnataka",
    price: 850, image: BASKET_IMAGE,
    description: "A finished woven basket made with natural fibers and traditional weaving techniques.",
    color: "#DCC6A4", tag: "Natural weave",
  },
  {
    id: 4, slug: "basketry-artisan",
    name: "Little Market Carry Basket", craft: "Basketry",
    artisan: "Local Basketry Artisan", location: "Coastal Karnataka", price: 620,
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85",
    description: "A light, easy-to-carry basket for market mornings, made from locally gathered natural fibres.",
    color: "#E2D0B6", tag: "Everyday carry",
  },
  {
    id: 5, slug: "coastal-clay-artisan",
    name: "Traditional Terracotta Pot", craft: "Terracotta",
    artisan: "Coastal Clay Artisan", location: "Coastal Karnataka",
    price: 690,
    image: "https://images.jdmagicbox.com/quickquotes/images_main/traditional-terracotta-planters-weather-resistant-outdoor-grade-nan-atth-e4zelpwl.jpg",
    description: "A handmade terracotta vessel with an earthy finish inspired by traditional pottery.",
    color: "#C9825D", tag: "Earth made",
  },
  {
    id: 6, slug: "coastal-clay-artisan",
    name: "Monsoon Blue Clay Tumbler Set", craft: "Terracotta",
    artisan: "Coastal Clay Artisan", location: "Coastal Karnataka", price: 980,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=85",
    description: "A pair of hand-thrown tumblers with a soft blue wash and the gentle irregularity of handmade pottery.",
    color: "#B9C6C8", tag: "Wheel thrown",
  },
  {
    id: 7, slug: "coastal-craft-collective",
    name: "Handcrafted Coconut Shell Bowl", craft: "Coastal Crafts",
    artisan: "Coastal Craft Collective", location: "Dakshina Kannada",
    price: 420,
    image: "https://m.media-amazon.com/images/I/71OdGBGU6OL._AC_UF350,350_QL80_.jpg",
    description: "A decorative bowl inspired by natural materials and coastal craft traditions.",
    color: "#B7A18A", tag: "Natural materials",
  },
  {
    id: 8, slug: "coastal-craft-collective",
    name: "Coconut Wood Serving Spoon", craft: "Coastal Crafts",
    artisan: "Coastal Craft Collective", location: "Dakshina Kannada", price: 340,
    image: "https://images.unsplash.com/photo-1584990347449-a9b9e4f3e4c4?auto=format&fit=crop&w=900&q=85",
    description: "A warm-toned serving spoon shaped from coconut wood and finished with food-safe oil.",
    color: "#CBB296", tag: "Made for everyday",
  },
  {
    id: 9, slug: "palm-leaf-artisan",
    name: "Palm Leaf Woven Mat", craft: "Palm Leaf Craft",
    artisan: "Local Palm Leaf Artisan", location: "Coastal Karnataka",
    price: 580,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqy2PidbDvId627czlf_6MER8Lt3ABVYhMz6PCXg1LPBy23nzrhz3N8Z8&s=10",
    description: "A natural-textured decorative piece inspired by traditional weaving.",
    color: "#D8C7A5", tag: "Handwoven",
  },
  {
    id: 10, slug: "palm-leaf-artisan",
    name: "Sunrise Palm Leaf Placemats", craft: "Palm Leaf Craft",
    artisan: "Local Palm Leaf Artisan", location: "Coastal Karnataka", price: 720,
    image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=900&q=85",
    description: "A set of four woven placemats that bring the texture of the coast to the everyday table.",
    color: "#E4D6AE", tag: "Set of four",
  },
  {
    id: 11, slug: "regional-folk-artist",
    name: "Hand-painted Folk Art", craft: "Folk Art",
    artisan: "Regional Folk Artist", location: "Karnataka",
    price: 1100,
    image: "https://cdn.vaaree.com/catalog/assets/ast_b6a04ebe32255b846c43c331edb48b59/variants/product_gallery_1200x1200_webp.webp",
    description: "Artwork inspired by the colors and visual storytelling of Indian folk art.",
    color: "#D6B6A4", tag: "Artist made",
  },
  {
    id: 12, slug: "regional-folk-artist",
    name: "Karnataka Village Print", craft: "Folk Art",
    artisan: "Regional Folk Artist", location: "Karnataka", price: 890,
    image: "https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=900&q=85",
    description: "A cheerful folk-art print that celebrates village life, bold colour, and hand-drawn storytelling.",
    color: "#D8B49F", tag: "Colourful story",
  },
];

const crafts = [
  "All crafts", "Kasuti Embroidery", "Basketry", "Terracotta",
  "Coastal Crafts", "Palm Leaf Craft", "Folk Art",
];

const money = (amount) =>
  new Intl.NumberFormat(document.documentElement.lang === "kn" ? "kn-IN" : "en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function readCart() {
  try {
    return JSON.parse(localStorage.getItem("kayaka-cart") || "{}");
  } catch {
    return {};
  }
}

function readOrders() {
  try {
    return JSON.parse(localStorage.getItem("kayaka-orders") || "[]");
  } catch {
    return [];
  }
}

function Brand({ onClick }) {
  const { t } = useLanguage();
  return (
    <button
      type="button"
      className="brand"
      onClick={onClick}
      aria-label={t("KAYAKA home")}
    >
      <img
        src="/kayaka-logo.png"
        alt="KAYAKA"
        className="brand-logo-image"
      />
    </button>
  );
}

function ProductCard({ product, favorite, onFavorite, onOpen }) {
  const { t } = useLanguage();
  return (
    <article className="product-card">
      <button className="product-image-button" onClick={() => onOpen(product)}
        aria-label={`${t("View ")}${product.name}`}>
        <div className="product-image-wrap" style={{ background: product.color }}>
          <img className="product-image" src={product.image} alt={product.name}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.parentElement.classList.add("image-fallback");
            }} />
          <span className="product-tag">{product.tag}</span>
        </div>
      </button>

      <button className={`favorite-button ${favorite ? "is-favorite" : ""}`}
        onClick={() => onFavorite(product.id)}
        aria-label={t(favorite ? "Remove from favorites" : "Add to favorites")}>
        <Heart size={18} fill={favorite ? "currentColor" : "none"} />
      </button>

      <div className="product-info">
        <div className="product-craft">{product.craft}</div>
        <button className="product-name" onClick={() => onOpen(product)}>
          {product.name}
        </button>
        <div className="product-bottom">
          <span className="product-price">{money(product.price)}</span>
          <button className="product-arrow" onClick={() => onOpen(product)}
            aria-label={`${t("See ")}${product.name}`}>
            <ArrowUpRight size={19} />
          </button>
        </div>
        <p className="product-artisan"><MapPin size={12} /> {product.location}</p>
      </div>
    </article>
  );
}

function ProductModal({ product, onClose, onAdd }) {
  const { t } = useLanguage();
  if (!product) return null;

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="product-modal" role="dialog" aria-modal="true"
        aria-label={product.name}
        onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label={t("Close")}>
          <X size={21} />
        </button>
        <div className="modal-image" style={{ background: product.color }}>
          <img src={product.image} alt={product.name} />
        </div>
        <div className="modal-copy">
          <span className="eyebrow">{product.craft}</span>
          <h2>{product.name}</h2>
          <p className="modal-price">{money(product.price)}</p>
          <p className="modal-description">{product.description}</p>
          <div className="modal-maker">
            <span className="maker-icon">ಕಾ</span>
            <div><strong>{product.artisan}</strong><span>{product.location}</span></div>
          </div>
          <Link className="text-link artisan-visit-link"
            to={`/artisan/${product.slug}`} onClick={onClose}>
            {t("Visit artisan shop")} <ArrowUpRight size={16} />
          </Link>
          <button className="button button-dark button-full" onClick={() => onAdd(product)}>
            {t("Add to bag")} <ShoppingBag size={17} />
          </button>
          <p className="seller-note"><Leaf size={14} /> {t("No platform commission charged to the artisan.")}</p>
        </div>
      </section>
    </div>
  );
}

function CartDrawer({ cart, onClose, onChangeQuantity, onCheckout }) {
  const { t } = useLanguage();
  const entries = Object.values(cart);
  const subtotal = entries.reduce((sum, entry) =>
    sum + entry.product.price * entry.quantity, 0);

  return (
    <div className="modal-backdrop drawer-backdrop" onMouseDown={onClose}>
      <aside className="cart-drawer" role="dialog" aria-modal="true"
        aria-label={t("Shopping bag")} onMouseDown={(event) => event.stopPropagation()}>
        <div className="drawer-header">
          <div><span className="eyebrow">{t("YOUR SELECTION")}</span><h2>{t("Your bag")}</h2></div>
          <button className="icon-button" onClick={onClose} aria-label={t("Close bag")}>
            <X size={21} />
          </button>
        </div>

        {!entries.length ? (
          <div className="empty-state">
            <ShoppingBag size={34} strokeWidth={1.3} />
            <h3>{t("Your bag is waiting.")}</h3>
            <p>{t("Find something handmade and make it yours.")}</p>
            <button className="button button-dark" onClick={onClose}>
              {t("Explore the collection")} <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {entries.map(({ product, quantity }) => (
                <div className="cart-item" key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <div className="cart-item-info">
                    <strong>{product.name}</strong>
                    <span>{money(product.price)}</span>
                    <div className="quantity-control">
                      <button onClick={() => onChangeQuantity(product.id, quantity - 1)}
                        aria-label={t("Decrease quantity")}><Minus size={13} /></button>
                      <span>{quantity}</span>
                      <button onClick={() => onChangeQuantity(product.id, quantity + 1)}
                        aria-label={t("Increase quantity")}><Plus size={13} /></button>
                    </div>
                    <button className="cart-remove"
                      onClick={() => onChangeQuantity(product.id, 0)}>{t("Remove")}</button>
                  </div>
                  <strong className="cart-line-total">
                    {money(product.price * quantity)}
                  </strong>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div><span>{t("Subtotal")}</span><strong>{money(subtotal)}</strong></div>
              <div><span>{t("Artisan commission")}</span><strong>₹0</strong></div>
              <p>{t("Artisans pay zero platform commission.")}</p>
              <button className="button button-dark button-full" onClick={onCheckout}>
                {t("Continue to checkout")} <ArrowRight size={17} />
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function CheckoutModal({ cart, onClose, onComplete }) {
  const { t } = useLanguage();
  const [step, setStep] = useState("address");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [method, setMethod] = useState("razorpay");
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  const entries = Object.values(cart);
  const subtotal = entries.reduce((sum, item) =>
    sum + item.product.price * item.quantity, 0);
  const platformFee = Math.round(subtotal * 0.05);
  const total = subtotal + platformFee;

  function continueCheckout(event) {
    event.preventDefault();
    setError("");
    if (!name.trim() || !/^\d{10}$/.test(phone) || !address.trim()) {
      setError(t("Enter your name, a valid 10-digit phone number and delivery address."));
      return;
    }
    setStep("payment");
  }

  function placeDemoOrder() {
    setError("");
    if (!entries.length) {
      setError(t("Your cart is empty."));
      return;
    }

    // This only simulates payment. It does not contact a UPI provider.
    const newOrder = {
      id: `KAYAKA-${Date.now().toString().slice(-8)}`,
      name: name.trim(),
      phone,
      address: address.trim(),
      paymentMethod: method,
      paymentStatus: method === "razorpay"
        ? "Razorpay test-mode simulation successful"
        : "Cash on delivery (demo)",
      subtotal,
      platformFee,
      total,
      items: entries.map(({ product, quantity }) => ({
        productId: product.id,
        name: product.name,
        artisan: product.artisan,
        sellerId: product.sellerId || null,
        price: product.price,
        quantity,
      })),
      createdAt: new Date().toISOString(),
    };

    setOrder(newOrder);
    setStep("confirmation");
    onComplete(newOrder);
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="checkout-modal" role="dialog" aria-modal="true"
        aria-label={t("Checkout")} onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label={t("Close checkout")}>
          <X size={21} />
        </button>

        {step === "address" && (
          <>
            <span className="eyebrow">{t("STEP 1 OF 3")}</span>
            <h2>{t("Delivery details")}</h2>
            <p className="checkout-intro">{t("Where should your handmade finds go?")}</p>
            <form className="checkout-form" onSubmit={continueCheckout}>
              <label>{t("Full name")}
                <input value={name} onChange={(e) => setName(e.target.value)}
                  placeholder={t("Your name")} required />
              </label>
              <label>{t("Phone number")}
                <input type="tel" inputMode="numeric" maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder={t("10-digit phone number")} required />
              </label>
              <label>{t("Delivery address")}
                <textarea rows={3} value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t("House, street, city, PIN code")} required />
              </label>
              {error && <p className="payment-error" role="alert">{error}</p>}
              <div className="checkout-total">
                <div><span>{t("Subtotal")}</span><strong>{money(subtotal)}</strong></div>
                <div><span>{t("Buyer platform fee (5%)")}</span><strong>{money(platformFee)}</strong></div>
                <div className="grand-total"><span>{t("Total")}</span><strong>{money(total)}</strong></div>
                <p>{t("The artisan pays ₹0 commission.")}</p>
              </div>
              <button className="button button-dark button-full" type="submit">
                {t("Continue to payment")} <ArrowRight size={17} />
              </button>
            </form>
          </>
        )}

        {step === "payment" && (
          <>
            <span className="eyebrow">{t("STEP 2 OF 3")}</span>
            <h2>{t("Demo payment")}</h2>
            <p className="checkout-intro">
              {t("Simulation only. No real money will be transferred.")}
            </p>
            <div className="checkout-total">
              <div><span>{t("Order total")}</span><strong>{money(total)}</strong></div>
            </div>
            <fieldset className="payment-options">
              <legend>{t("Choose payment method")}</legend>
              <label className="payment-option">
                <input type="radio" name="method" checked={method === "razorpay"}
                  onChange={() => setMethod("razorpay")} />
                <span><strong>{t("Razorpay test-mode simulation")}</strong><small>{t("Official Checkout-style flow; no payment is processed")}</small></span>
              </label>
              <label className="payment-option">
                <input type="radio" name="method" checked={method === "cod"}
                  onChange={() => setMethod("cod")} />
                <span><strong>{t("Cash on delivery")}</strong><small>{t("Demo selection only")}</small></span>
              </label>
            </fieldset>
            {error && <p className="payment-error" role="alert">{error}</p>}
            <div className="checkout-actions">
              <button className="button button-outline" onClick={() => {
                setStep("address");
                setError("");
              }}>{t("Back")}</button>
              <button className="button button-dark" onClick={placeDemoOrder}>
                {t("Simulate Razorpay payment")} <Check size={17} />
              </button>
            </div>
            <p className="demo-disclaimer">
              {t("This prototype does not charge an account or contact a payment service.")}
            </p>
          </>
        )}

        {step === "confirmation" && order && (
          <div className="order-success">
            <span className="success-icon"><Check size={26} /></span>
            <span className="eyebrow">{t("STEP 3 OF 3 · ORDER CONFIRMED")}</span>
            <h2>{t("Thank you for choosing handmade.")}</h2>
            <p>{t("Your demo order has been saved on this device.")}</p>
            <div className="order-reference">
              <span>{t("Order reference")}</span><strong>{order.id}</strong>
            </div>
            <div className="confirmation-details">
              <div><span>{t("Payment status")}</span><strong>{order.paymentStatus}</strong></div>
              <div><span>{t("Delivery to")}</span><strong>{order.name}</strong></div>
              <div><span>{t("Delivery address")}</span><strong>{order.address}</strong></div>
              {order.items.map((item) => (
                <div key={item.productId}>
                  <span>{item.name} × {item.quantity}</span>
                  <strong>{money(item.price * item.quantity)}</strong>
                </div>
              ))}
              <div><span>{t("Subtotal")}</span><strong>{money(order.subtotal)}</strong></div>
              <div><span>{t("Buyer fee")}</span><strong>{money(order.platformFee)}</strong></div>
              <div><span>{t("Total")}</span><strong>{money(order.total)}</strong></div>
            </div>
            <button className="button button-dark button-full" onClick={onClose}>
              {t("Back to the marketplace")} <ArrowRight size={17} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default function App() {
  const { t } = useLanguage();
  const [activeCraft, setActiveCraft] = useState("All crafts");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState(readCart);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const [sellerProducts, setSellerProducts] = useState(getSellerProducts);
  const [session, setSession] = useState(getSession);

  useEffect(() => {
    const refreshCart = () => setCart(readCart());
    window.addEventListener("kayaka-cart-updated", refreshCart);
    window.addEventListener("storage", refreshCart);
    return () => {
      window.removeEventListener("kayaka-cart-updated", refreshCart);
      window.removeEventListener("storage", refreshCart);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("kayaka-cart", JSON.stringify(cart));
    } catch {
      // Continue with in-memory cart if storage is unavailable.
    }
  }, [cart]);

  useEffect(() => {
    const refreshMarketplace = () => { setSellerProducts(getSellerProducts()); setSession(getSession()); };
    window.addEventListener("storage", refreshMarketplace);
    return () => window.removeEventListener("storage", refreshMarketplace);
  }, []);

  const cartCount = Object.values(cart).reduce(
    (sum, entry) => sum + entry.quantity, 0
  );

  const filteredProducts = useMemo(() => {
    let result = [...sellerProducts, ...products].filter((product) => {
      const matchesCraft = activeCraft === "All crafts" ||
        product.craft === activeCraft;
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch = !query ||
        [product.name, product.craft, product.artisan, product.location]
          .join(" ").toLowerCase().includes(query);
      const matchesFavorite = !showFavoritesOnly ||
        favorites.includes(product.id);
      return matchesCraft && matchesSearch && matchesFavorite;
    });

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [activeCraft, searchTerm, sortBy, favorites, showFavoritesOnly, sellerProducts]);

  const heroAccentImage = sellerProducts[0]?.image || BASKET_IMAGE;

  function goToShop() {
    setMobileMenuOpen(false);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  }

  function goHome() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveCraft("All crafts");
    setSearchTerm("");
    setShowFavoritesOnly(false);
    setMobileMenuOpen(false);
  }

  function toggleFavorite(id) {
    setFavorites((current) => current.includes(id)
      ? current.filter((itemId) => itemId !== id)
      : [...current, id]);
  }

  function addToCart(product) {
    setCart((current) => ({
      ...current,
      [product.id]: {
        product,
        quantity: (current[product.id]?.quantity || 0) + 1,
      },
    }));
    setSelectedProduct(null);
    setShowCart(true);
  }

  function changeQuantity(id, quantity) {
    setCart((current) => {
      const next = { ...current };
      if (quantity <= 0) delete next[id];
      else if (next[id]) next[id] = { ...next[id], quantity };
      return next;
    });
  }

  function completeOrder(order) {
    try {
      saveOrders([...readOrders(), order]);
    } catch {
      // The on-screen confirmation still works.
    }
    setCart({});
    setOrderConfirmation(order);
  }

  return (
    <div className="site-shell">
      <div className="announcement-bar">
        {t("Thoughtfully made. Rooted in Karnataka.")}
        <span>{t("Made by hand, meant to be kept.")}</span>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <Brand onClick={goHome} />
          <nav className={`main-nav ${mobileMenuOpen ? "nav-open" : ""}`}>
            <button onClick={goToShop}>{t("Shop all")}</button>
            <button onClick={() => { setActiveCraft("Kasuti Embroidery"); goToShop(); }}>
              Kasuti
            </button>
            <button onClick={() => { setActiveCraft("Basketry"); goToShop(); }}>
              Basketry
            </button>
            <a href="#our-story" onClick={() => setMobileMenuOpen(false)}>{t("Our story")}</a>
          </nav>
          <div className="header-actions">
            <LanguageToggle />
            {session ? (
              <>
                <Link className="account-link" to={session.role === "seller" ? "/seller/dashboard" : "/"}>
                  {session.role === "seller" ? t("My shop") : `${t("Hi, ")}${session.name.split(" ")[0]}`}
                </Link>
                <button className="header-icon" onClick={() => { clearSession(); setSession(null); }} aria-label={t("Sign out")}>{t("Sign out")}</button>
              </>
            ) : <Link className="account-link" to="/login">{t("Sign in")}</Link>}
            <button className={`header-icon ${showFavoritesOnly ? "active-icon" : ""}`}
              onClick={() => { setShowFavoritesOnly((value) => !value); goToShop(); }}
              aria-label={t("Toggle favorites")}>
              <Heart size={19} />
            </button>
            <button className="header-icon bag-button"
              onClick={() => setShowCart(true)}
              aria-label={`Shopping bag, ${cartCount} items`}>
              <ShoppingBag size={19} /><span className="bag-count">{cartCount}</span>
            </button>
            <button className="mobile-menu-button"
              onClick={() => setMobileMenuOpen((value) => !value)}
              aria-label={t("Toggle navigation")}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow">{t("A MARKETPLACE FOR THE MADE-BY-HAND")}</span>
            <h1>{t("Good things")}<br />{t("are made ")}<em>{t("slowly.")}</em></h1>
            <p>{t("Discover the hands, heritage, and little details behind Karnataka's beautiful handmade crafts.")}</p>
            <div className="hero-actions">
              <button className="button button-dark" onClick={goToShop}>
                {t("Explore the collection")} <ArrowRight size={17} />
              </button>
              <a className="text-link" href="#our-story">{t("Get to know us")} <ArrowDownRight size={16} /></a>
            </div>
            <div className="hero-note">
              <span className="hero-note-icon"><Leaf size={16} /></span>
              <span>{t("Small-batch pieces, made with care.")}</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-main">
              <img src={BASKET_IMAGE} alt={t("Handwoven bamboo basket")} />
            </div>
            <div className="hero-image-small">
              <img src={heroAccentImage} alt={t("Handmade marketplace preview")} />
            </div>
            <div className="hero-stamp">
              <span>{t("CRAFTED")}</span><span>{t("WITH CARE")}</span><span className="stamp-symbol">ಕಾ</span>
            </div>
            <p className="hero-image-caption">{t("Tradition, woven into everyday life.")}</p>
          </div>
        </section>

        <section className="values-strip" aria-label={t("Our values")}>
          <div className="value-item">
            <span className="value-symbol"><Leaf size={19} /></span>
            <div><strong>{t("Made by hand")}</strong><span>{t("Not mass produced")}</span></div>
          </div>
          <div className="value-item">
            <span className="value-symbol"><Heart size={19} /></span>
            <div><strong>{t("Rooted in heritage")}</strong><span>{t("Craft with a story")}</span></div>
          </div>
          <div className="value-item">
            <span className="value-symbol"><ArrowUpRight size={19} /></span>
            <div><strong>{t("Direct from makers")}</strong><span>{t("More value for artisans")}</span></div>
          </div>
        </section>

        <section className="shop-section section-pad" id="shop">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{t("THE COLLECTION")}</span>
              <h2>{t("Made to be ")}<em>{t("discovered.")}</em></h2>
              <p>{t("Meaningful pieces from makers who keep tradition alive.")}</p>
            </div>
            <span className="result-count">{filteredProducts.length} {t("pieces")}</span>
          </div>

          <div className="shop-toolbar">
            <div className="craft-filters" aria-label={t("Filter by craft")}>
              {crafts.map((craft) => (
                <button key={craft}
                  className={`filter-chip ${activeCraft === craft ? "selected" : ""}`}
                  onClick={() => setActiveCraft(craft)}>
                  {t(craft)}
                </button>
              ))}
            </div>
            <div className="shop-tools">
              <label className="search-box">
                <Search size={17} />
                <input value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={t("Find a piece...")} aria-label={t("Search products")} />
                {searchTerm && <button onClick={() => setSearchTerm("")}
                  aria-label={t("Clear search")}><X size={15} /></button>}
              </label>
              <label className="sort-box">
                <SlidersHorizontal size={16} />
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}
                  aria-label={t("Sort products")}>
                  <option value="featured">{t("Featured")}</option>
                  <option value="price-low">{t("Price: low to high")}</option>
                  <option value="price-high">{t("Price: high to low")}</option>
                  <option value="name">{t("Name: A to Z")}</option>
                </select>
              </label>
            </div>
          </div>

          {showFavoritesOnly && (
            <div className="favorites-banner">
              <Heart size={16} /> {t("Showing your saved pieces.")}
              <button onClick={() => setShowFavoritesOnly(false)}>{t("Show everything")}</button>
            </div>
          )}

          {filteredProducts.length ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product}
                  favorite={favorites.includes(product.id)}
                  onFavorite={toggleFavorite} onOpen={setSelectedProduct} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <Search size={28} strokeWidth={1.4} />
              <h3>{t("Nothing here just yet.")}</h3>
              <p>{t("Try another search or explore the full collection.")}</p>
              <button className="button button-outline" onClick={() => {
                setActiveCraft("All crafts"); setSearchTerm(""); setShowFavoritesOnly(false);
              }}>{t("Clear filters")}</button>
            </div>
          )}
        </section>

        <section className="story-section" id="our-story">
          <div className="story-image">
            <img src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=85"
              alt={t("A handmade creative workspace")} loading="lazy" />
            <div className="story-image-note">
              <span className="story-note-mark">ಕಾ</span>
              <span>{t("Made with patience.")}<br />{t("Shared with pride.")}</span>
            </div>
          </div>
          <div className="story-copy">
            <span className="eyebrow">{t("A LITTLE ABOUT US")}</span>
            <h2>{t("Every handmade piece has a ")}<em>{t("human story.")}</em></h2>
            <p>{t("Behind every stitch, weave, and curve is someone who has spent years learning their craft. We want those makers to be seen, their work to be valued, and their stories to travel further.")}</p>
            <p>{t("KAYAKA brings Karnataka’s regional crafts closer to the people who love them, making it easier to discover handmade work and connect with the people behind it.")}</p>
            <button className="button button-outline" onClick={goToShop}>
              {t("Find your piece")} <ArrowRight size={17} />
            </button>
            <div className="story-signoff">{t("Made by hands, with heart.")}</div>
          </div>
        </section>

        <section className="maker-banner">
          <div>
            <span className="eyebrow">{t("GOOD CRAFT DESERVES A WIDER AUDIENCE")}</span>
            <h2>{t("For the makers.")}<br /><em>{t("For the love of handmade.")}</em></h2>
          </div>
          <p>{t("A thoughtful marketplace that helps handmade work find the people who will cherish it.")}</p>
          <button className="button button-light" onClick={goToShop}>
            {t("Browse handmade")} <ArrowUpRight size={17} />
          </button>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand-block">
            <Brand onClick={goHome} />
            <p>{t("Celebrating the hands and heritage behind handmade Karnataka.")}</p>
            <span className="footer-location"><MapPin size={14} /> {t("Coastal Karnataka, India")}</span>
          </div>
          <div className="footer-links">
            <strong>{t("Explore")}</strong>
            <button onClick={goToShop}>{t("Shop all")}</button>
            <button onClick={() => { setActiveCraft("Kasuti Embroidery"); goToShop(); }}>{t("Kasuti embroidery")}</button>
            <button onClick={() => { setActiveCraft("Basketry"); goToShop(); }}>{t("Basketry")}</button>
          </div>
          <div className="footer-links">
            <strong>{t("Our values")}</strong>
            <a href="#our-story">{t("Our story")}</a>
            <a href="#shop">{t("Made by hand")}</a>
            <a href="#shop">{t("Support local makers")}</a>
          </div>
          <div className="footer-social">
            <strong>{t("Keep in touch")}</strong>
            <p>{t("Good craft is always worth sharing.")}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} KAYAKA. {t("A handmade marketplace concept.")}</span>
          <span>{t("Made with care in Karnataka.")}</span>
        </div>
      </footer>

      {selectedProduct && (
        <ProductModal product={selectedProduct}
          onClose={() => setSelectedProduct(null)} onAdd={addToCart} />
      )}

      {showCart && (
        <CartDrawer cart={cart} onClose={() => setShowCart(false)}
          onChangeQuantity={changeQuantity}
          onCheckout={() => { setShowCart(false); setShowCheckout(true); }} />
      )}

      {showCheckout && (
        <CheckoutModal cart={cart} onClose={() => setShowCheckout(false)}
          onComplete={completeOrder} />
      )}

      {orderConfirmation && !showCheckout && (
        <div className="toast-message" role="status">
          <Check size={17} /> Demo order saved: {orderConfirmation.id}
          <button onClick={() => setOrderConfirmation(null)} aria-label="Dismiss">
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
