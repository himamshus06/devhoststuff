const KEYS = { users: "kayaka-users-v1", session: "kayaka-session-v1", products: "kayaka-seller-products-v1", orders: "kayaka-orders" };
function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } }
function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
export const getUsers = () => read(KEYS.users, []);
export const getSession = () => read(KEYS.session, null);
export const getSellerProducts = () => read(KEYS.products, []).filter((product) => product && typeof product === "object");
export const getOrders = () => read(KEYS.orders, []);
export const saveOrders = (orders) => write(KEYS.orders, orders);
export const saveSession = (user) => write(KEYS.session, user);
export const clearSession = () => localStorage.removeItem(KEYS.session);
async function hash(value) { const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)); return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join(""); }
export async function registerUser({ role, name, email, pin, aadhaar }) {
  const users = getUsers(), normalizedEmail = email.trim().toLowerCase();
  if (users.some((user) => user.email === normalizedEmail)) throw new Error("An account already uses this email.");
  const user = { id: crypto.randomUUID(), role, name: name.trim(), email: normalizedEmail, pin };
  if (role === "seller") { const digits = aadhaar.replace(/\s/g, ""); if (!/^\d{12}$/.test(digits) || !/^[2-9]/.test(digits)) throw new Error("Enter a valid 12-digit Aadhaar number."); const aadhaarHash = await hash(digits); if (users.some((item) => item.aadhaarHash === aadhaarHash)) throw new Error("This Aadhaar is already linked to a seller account."); Object.assign(user, { aadhaarHash, aadhaarLast4: digits.slice(-4) }); }
  users.push(user); write(KEYS.users, users); saveSession(user); return user;
}
export function loginUser({ role, email, pin }) { const user = getUsers().find((item) => item.role === role && item.email === email.trim().toLowerCase() && item.pin === pin); if (!user) throw new Error("No matching account was found. Check the role, email, and PIN."); saveSession(user); return user; }
export function publishProduct({ seller, listing }) { const images = listing.images || []; const product = { id: `seller-${crypto.randomUUID()}`, slug: seller.id, sellerId: seller.id, artisan: seller.name, location: listing.location || "Karnataka", name: listing.name, craft: listing.customCraft.trim() || listing.craft, price: Number(listing.price), quantity: Number(listing.quantity), description: listing.description, images, image: images[0] || "", color: "#dcc6a4", tag: "Direct from maker", createdAt: new Date().toISOString() }; write(KEYS.products, [product, ...getSellerProducts()]); return product; }
