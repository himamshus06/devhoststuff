import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin, ShoppingBag } from "lucide-react";
import "./index.css";
import { LanguageToggle, useLanguage } from "./i18n.jsx";

const BASKET_IMAGE = "https://amritkalash.shop/wp-content/uploads/2024/03/Handmade_Bamboo_Storage_Basket_.png";

const makers = {
  "savitri-hegde": {
    name: "Savitri Hegde", craft: "Kasuti Embroidery", location: "North Karnataka", initials: "SH",
    story: "Explore textiles inspired by Karnataka's intricate Kasuti embroidery tradition, where every stitch reflects patience, precision, and generations of craft knowledge.",
    products: [
      { name: "Kasuti Embroidered Wall Textile", price: 1450, image: "https://images.livemint.com/img/2021/08/06/1140x641/kasuti_1_1628239231619_1628239246101.jpg" },
      { name: "Lotus Kasuti Cushion Cover", price: 780, image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=85" },
    ],
  },
  "basketry-artisan": {
    name: "Local Basketry Artisan", craft: "Basketry", location: "Coastal Karnataka", initials: "BA",
    story: "Discover useful, timeless woven pieces inspired by traditional basketry and the beauty of natural materials.",
    products: [
      { name: "Handwoven Bamboo Basket", price: 850, image: BASKET_IMAGE },
      { name: "Little Market Carry Basket", price: 620, image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85" },
    ],
  },
  "coastal-clay-artisan": {
    name: "Coastal Clay Artisan", craft: "Terracotta", location: "Coastal Karnataka", initials: "CA",
    story: "Earthy handmade vessels celebrate the natural textures of clay and the enduring tradition of pottery.",
    products: [
      { name: "Traditional Terracotta Pot", price: 690, image: "https://images.jdmagicbox.com/quickquotes/images_main/traditional-terracotta-planters-weather-resistant-outdoor-grade-nan-atth-e4zelpwl.jpg" },
      { name: "Monsoon Blue Clay Tumbler Set", price: 980, image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=85" },
    ],
  },
  "coastal-craft-collective": {
    name: "Coastal Craft Collective", craft: "Coastal Crafts", location: "Dakshina Kannada", initials: "CC",
    story: "Handmade pieces inspired by coastal materials and resourceful craft traditions.",
    products: [
      { name: "Handcrafted Coconut Shell Bowl", price: 420, image: "https://m.media-amazon.com/images/I/71OdGBGU6OL._AC_UF350,350_QL80_.jpg" },
      { name: "Coconut Wood Serving Spoon", price: 340, image: "https://images.unsplash.com/photo-1584990347449-a9b9e4f3e4c4?auto=format&fit=crop&w=900&q=85" },
    ],
  },
  "palm-leaf-artisan": {
    name: "Local Palm Leaf Artisan", craft: "Palm Leaf Craft", location: "Coastal Karnataka", initials: "PA",
    story: "Natural-textured woven pieces that bring a warm, handmade feel to everyday spaces.",
    products: [
      { name: "Palm Leaf Woven Mat", price: 580, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqy2PidbDvId627czlf_6MER8Lt3ABVYhMz6PCXg1LPBy23nzrhz3N8Z8&s=10" },
      { name: "Sunrise Palm Leaf Placemats", price: 720, image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=900&q=85" },
    ],
  },
  "regional-folk-artist": {
    name: "Regional Folk Artist", craft: "Folk Art", location: "Karnataka", initials: "FA",
    story: "Explore artwork inspired by the colors and visual storytelling of Indian folk-art traditions.",
    products: [
      { name: "Hand-painted Folk Art", price: 1100, image: "https://cdn.vaaree.com/catalog/assets/ast_b6a04ebe32255b846c43c331edb48b59/variants/product_gallery_1200x1200_webp.webp" },
      { name: "Karnataka Village Print", price: 890, image: "https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=900&q=85" },
    ],
  },
};

const money = (amount) => new Intl.NumberFormat(document.documentElement.lang === "kn" ? "kn-IN" : "en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export default function ArtisanPage() {
  const { t } = useLanguage();
  const { slug } = useParams();
  const maker = makers[slug];

  async function shareShop() {
    const shareData = { title: `${maker.name} | KAYAKA.`, text: `Discover handmade ${maker.craft} from ${maker.location}.`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(window.location.href); window.alert(t("Shop link copied!")); }
    } catch (error) {
      if (error?.name !== "AbortError") window.alert(t("Copy the shop URL from your browser to share it."));
    }
  }

  if (!maker) return (
    <main className="artisan-not-found">
      <LanguageToggle />
      <span className="eyebrow">{t("MAKER NOT FOUND")}</span>
      <h1>{t("This artisan shop isn't available yet.")}</h1>
      <Link className="button button-dark" to="/"><ArrowLeft size={17} /> {t("Back to the marketplace")}</Link>
    </main>
  );

  return (
    <main className="artisan-page">
      <header className="artisan-topbar">
        <Link className="artisan-back" to="/"><ArrowLeft size={17} /> {t("Back to KAYAKA.")}</Link>
        <span className="eyebrow">{t("A MAKER'S LITTLE CORNER")}</span>
        <LanguageToggle />
      </header>
      <section className="artisan-profile">
        <div className="artisan-avatar" aria-hidden="true">{maker.initials}</div>
        <div className="artisan-profile-copy">
          <span className="eyebrow">{t(maker.craft)}</span>
          <h1>{t(maker.name)}</h1>
          <p className="artisan-location"><MapPin size={15} /> {t(maker.location)}</p>
          <p className="artisan-story">{t(maker.story)}</p>
          <button className="button button-dark" onClick={shareShop}>{t("Share this shop")} <ArrowUpRight size={17} /></button>
        </div>
      </section>
      <section className="artisan-products">
        <div className="section-heading">
          <div><span className="eyebrow">{t("MADE WITH CARE")}</span><h2>{t("Shop this ")}<em>{t("maker.")}</em></h2><p>{t("Explore pieces in this artisan's collection.")}</p></div>
          <span className="result-count">{maker.products.length} {t(maker.products.length === 1 ? "piece" : "pieces")}</span>
        </div>
        <div className="product-grid artisan-product-grid">
          {maker.products.map((product) => (
            <article className="product-card" key={product.name}>
              <div className="product-image-wrap"><img className="product-image" src={product.image} alt={t(product.name)} loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.parentElement.classList.add("image-fallback"); }} /></div>
              <div className="product-info"><div className="product-craft">{t(maker.craft)}</div><h3 className="product-name">{t(product.name)}</h3><div className="product-bottom"><span className="product-price">{money(product.price)}</span><ShoppingBag size={18} /></div></div>
            </article>
          ))}
        </div>
        <p className="artisan-demo-note">{t("Prototype profile: artisan details and listings are sample data for demonstration.")}</p>
        <Link className="button button-outline artisan-back-to-shop" to="/"><ArrowRight size={16} /> {t("Explore the full collection")}</Link>
      </section>
      <footer className="artisan-footer"><span className="brand-word">KAYAKA<span>.</span></span><p>{t("Made by hands, with heart.")}</p><Link to="/">{t("Explore all crafts")} <ArrowUpRight size={15} /></Link></footer>
    </main>
  );
}
