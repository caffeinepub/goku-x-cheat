import { Toaster } from "@/components/ui/sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  Plus,
  Save,
  Settings,
  Shield,
  ShoppingCart,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SiDiscord } from "react-icons/si";
import { toast } from "sonner";
import type { Product } from "./backend.d";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useActiveProducts,
  useAddProduct,
  useAllProducts,
  useIsAdmin,
  useUpdateProduct,
  useVisitCount,
} from "./hooks/useQueries";

type View = "login" | "register" | "products" | "admin";

function ParticlesBackground() {
  return (
    <div className="particles-container">
      {Array.from({ length: 12 }, (_, i) => `p${i}`).map((key) => (
        <div key={key} className="particle" />
      ))}
    </div>
  );
}

function LoginForm({
  onSwitch,
  onLogin,
}: { onSwitch: () => void; onLogin: () => void }) {
  const { login, loginStatus } = useInternetIdentity();
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (loginStatus === "success") {
      onLogin();
    }
  }, [loginStatus, onLogin]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className="goku-card rounded-lg p-8 w-full max-w-md mx-auto"
      data-ocid="login.panel"
    >
      <div className="text-center mb-8">
        <img
          src="/assets/generated/goku-x-cheat-logo-transparent.dim_400x400.png"
          alt="Goku X Cheat"
          className="w-24 h-24 mx-auto mb-4 object-contain"
          style={{ filter: "drop-shadow(0 0 20px rgba(204,0,0,0.8))" }}
        />
        <h1 className="goku-title text-3xl mb-1">GOKU X CHEAT</h1>
        <p className="text-red-400 font-rajdhani text-sm tracking-widest uppercase">
          FREE FIRE PANEL STORE
        </p>
      </div>

      <div className="goku-divider" />

      <div className="space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="block text-red-300 font-rajdhani font-semibold mb-1 uppercase text-sm tracking-wider"
          >
            Email
          </label>
          <input
            id="login-email"
            className="goku-input w-full px-4 py-3 rounded"
            type="email"
            placeholder="your@email.com"
            data-ocid="login.input"
          />
        </div>
        <div>
          <label
            htmlFor="login-password"
            className="block text-red-300 font-rajdhani font-semibold mb-1 uppercase text-sm tracking-wider"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              className="goku-input w-full px-4 py-3 rounded pr-12"
              type={showPass ? "text" : "password"}
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              data-ocid="login.input"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-300"
              onClick={() => setShowPass((p) => !p)}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="button"
          className="goku-btn w-full py-3 rounded mt-2 flex items-center justify-center gap-2"
          disabled={loginStatus === "logging-in"}
          onClick={() => login()}
          data-ocid="login.submit_button"
        >
          {loginStatus === "logging-in" ? (
            <>
              <Loader2 size={18} className="animate-spin" /> CONNECTING...
            </>
          ) : (
            <>
              <Zap size={18} /> LOGIN
            </>
          )}
        </button>
      </div>

      <div className="goku-divider" />

      <p className="text-center text-gray-500 font-rajdhani">
        No account?{" "}
        <button
          type="button"
          className="text-red-400 hover:text-red-300 font-semibold transition-colors"
          onClick={onSwitch}
          data-ocid="login.link"
        >
          REGISTER HERE
        </button>
      </p>
    </motion.div>
  );
}

function RegisterForm({
  onSwitch,
  onRegister,
}: { onSwitch: () => void; onRegister: () => void }) {
  const { login, loginStatus } = useInternetIdentity();
  const { actor } = useActor();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [step, setStep] = useState<"form" | "verify">("form");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loginStatus === "success") {
      onRegister();
    }
  }, [loginStatus, onRegister]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Fill in all fields");
      return;
    }
    if (!actor) {
      toast.error("Not connected");
      return;
    }
    setLoading(true);
    try {
      const receivedCode = await actor.generateVerificationCode(email);
      setGeneratedCode(receivedCode);
      setStep("verify");
      toast.success("Verification code generated!");
    } catch {
      toast.error("Failed to generate code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setLoading(true);
    try {
      const valid = await actor.verifyCode(email, code);
      if (valid) {
        // Register as regular user (empty token = user role)
        await actor._initializeAccessControlWithSecret("");
        await actor.saveCallerUserProfile({ name });
        toast.success("Registration successful! Logging in...");
        login();
      } else {
        toast.error("Invalid code. Try again.");
      }
    } catch {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className="goku-card rounded-lg p-8 w-full max-w-md mx-auto"
      data-ocid="register.panel"
    >
      <div className="text-center mb-8">
        <img
          src="/assets/generated/goku-x-cheat-logo-transparent.dim_400x400.png"
          alt="Goku X Cheat"
          className="w-20 h-20 mx-auto mb-3 object-contain"
          style={{ filter: "drop-shadow(0 0 20px rgba(204,0,0,0.8))" }}
        />
        <h1 className="goku-title text-2xl mb-1">CREATE ACCOUNT</h1>
        <p className="text-red-500 font-rajdhani text-sm tracking-widest uppercase">
          JOIN THE POWER
        </p>
      </div>

      <div className="goku-divider" />

      <AnimatePresence mode="wait">
        {step === "form" ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleSendCode}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="reg-name"
                className="block text-red-300 font-rajdhani font-semibold mb-1 uppercase text-sm tracking-wider"
              >
                Name
              </label>
              <input
                id="reg-name"
                className="goku-input w-full px-4 py-3 rounded"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-ocid="register.input"
              />
            </div>
            <div>
              <label
                htmlFor="reg-email"
                className="block text-red-300 font-rajdhani font-semibold mb-1 uppercase text-sm tracking-wider"
              >
                Email
              </label>
              <input
                id="reg-email"
                className="goku-input w-full px-4 py-3 rounded"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-ocid="register.input"
              />
            </div>
            <button
              type="submit"
              className="goku-btn w-full py-3 rounded flex items-center justify-center gap-2"
              disabled={loading}
              data-ocid="register.submit_button"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> GENERATING...
                </>
              ) : (
                <>
                  <Zap size={18} /> GET VERIFICATION CODE
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="verify"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center">
              <p className="text-red-300 font-rajdhani mb-3 text-sm">
                YOUR VERIFICATION CODE:
              </p>
              <div className="code-box" data-ocid="register.panel">
                {generatedCode}
              </div>
              <p className="text-gray-500 text-xs mt-2 font-rajdhani">
                Enter this code below to complete registration
              </p>
            </div>
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label
                  htmlFor="verify-code"
                  className="block text-red-300 font-rajdhani font-semibold mb-1 uppercase text-sm tracking-wider"
                >
                  Verification Code
                </label>
                <input
                  id="verify-code"
                  className="goku-input w-full px-4 py-3 rounded text-center font-orbitron tracking-widest"
                  placeholder="ENTER CODE"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  data-ocid="register.input"
                />
              </div>
              <button
                type="submit"
                className="goku-btn w-full py-3 rounded flex items-center justify-center gap-2"
                disabled={loading}
                data-ocid="register.submit_button"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> VERIFYING...
                  </>
                ) : (
                  <>
                    <Shield size={18} /> VERIFY & REGISTER
                  </>
                )}
              </button>
              <button
                type="button"
                className="w-full text-red-500 hover:text-red-300 text-sm font-rajdhani transition-colors"
                onClick={() => setStep("form")}
              >
                \u2190 Back
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="goku-divider" />

      <p className="text-center text-gray-500 font-rajdhani">
        Have an account?{" "}
        <button
          type="button"
          className="text-red-400 hover:text-red-300 font-semibold transition-colors"
          onClick={onSwitch}
          data-ocid="register.link"
        >
          LOGIN HERE
        </button>
      </p>
    </motion.div>
  );
}

function VideoModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
      data-ocid="video.modal"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="relative w-full max-w-3xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="goku-card rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-red-900">
            <span className="goku-red-title text-sm">PREVIEW</span>
            <button
              type="button"
              className="text-red-500 hover:text-red-300 transition-colors"
              onClick={onClose}
              data-ocid="video.close_button"
            >
              <X size={20} />
            </button>
          </div>
          <video
            src={url}
            controls
            autoPlay
            className="w-full max-h-[60vh]"
            style={{ background: "#0a0a0a" }}
          >
            <track kind="captions" />
          </video>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.15, duration: 0.5 }}
        className="product-card rounded-lg p-6 flex flex-col gap-4"
        data-ocid={`product.item.${index + 1}`}
      >
        <div>
          <h3 className="goku-title text-xl mb-3">{product.name}</h3>
          <div className="goku-divider" style={{ margin: "0.5rem 0" }} />
          <ul className="space-y-2">
            {product.features.map((feat) => (
              <li
                key={feat}
                className="flex items-start gap-2 text-gray-300 font-rajdhani"
              >
                <span className="text-red-500 mt-0.5 flex-shrink-0">
                  \u2756
                </span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2 mt-auto">
          {product.videoUrl && (
            <button
              type="button"
              className="goku-btn py-2 px-4 rounded flex items-center justify-center gap-2 text-sm"
              onClick={() => setVideoOpen(true)}
              data-ocid={`product.item.${index + 1}`}
            >
              <Video size={16} /> PREVIEW VIDEO
            </button>
          )}
          <a
            href="https://discord.gg/fHhsEQkY49"
            target="_blank"
            rel="noopener noreferrer"
            className="goku-btn-gold py-2 px-4 rounded flex items-center justify-center gap-2 text-sm"
            data-ocid={`product.item.${index + 1}`}
          >
            <ShoppingCart size={16} /> BUY NOW
          </a>
        </div>
      </motion.div>

      <AnimatePresence>
        {videoOpen && (
          <VideoModal
            url={product.videoUrl}
            onClose={() => setVideoOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function AdminTokenModal({
  onClose,
  onSuccess,
}: { onClose: () => void; onSuccess: () => void }) {
  const { actor } = useActor();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setLoading(true);
    try {
      await actor._initializeAccessControlWithSecret(token);
      const isAdmin = await actor.isCallerAdmin();
      if (isAdmin) {
        toast.success("Admin access granted!");
        onSuccess();
      } else {
        toast.error("Invalid token or admin already assigned");
      }
    } catch {
      toast.error("Failed to verify token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.85 }}
        className="goku-card rounded-lg p-8 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
        data-ocid="admin.panel"
      >
        <div className="flex items-center gap-3 mb-6">
          <Shield size={24} className="text-red-500" />
          <h2 className="goku-title text-lg">ADMIN ACCESS</h2>
        </div>
        <p className="text-gray-400 font-rajdhani text-sm mb-4">
          Enter your admin token to claim administrator privileges.
        </p>
        <form onSubmit={handleClaim} className="space-y-4">
          <input
            className="goku-input w-full px-4 py-3 rounded font-orbitron tracking-widest"
            type="password"
            placeholder="ADMIN TOKEN"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            data-ocid="admin.input"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="goku-btn flex-1 py-2 rounded flex items-center justify-center gap-2 text-sm"
              disabled={loading}
              data-ocid="admin.save_button"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Shield size={16} />
              )}{" "}
              CLAIM
            </button>
            <button
              type="button"
              className="goku-btn px-4 py-2 rounded text-sm"
              onClick={onClose}
              data-ocid="admin.cancel_button"
            >
              CANCEL
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function ProductsPage({
  onAdminOpen,
  onLogout,
}: { onAdminOpen: () => void; onLogout: () => void }) {
  const { data: products, isLoading } = useActiveProducts();
  const { data: visitCount } = useVisitCount();
  const { data: isAdmin } = useIsAdmin();
  const [secretInput, setSecretInput] = useState("");
  const [showTokenModal, setShowTokenModal] = useState(false);
  const secretRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (secretInput.toLowerCase() === "goku cheat") {
      setSecretInput("");
      if (isAdmin) {
        onAdminOpen();
      } else {
        setShowTokenModal(true);
      }
    }
  }, [secretInput, onAdminOpen, isAdmin]);

  return (
    <div className="min-h-screen goku-bg relative">
      <ParticlesBackground />
      <div className="relative z-10">
        <header className="border-b border-red-900/50 bg-black/60 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/assets/generated/goku-x-cheat-logo-transparent.dim_400x400.png"
                alt="Goku X Cheat"
                className="w-12 h-12 object-contain"
                style={{ filter: "drop-shadow(0 0 10px rgba(204,0,0,0.8))" }}
              />
              <div>
                <h1 className="goku-title text-xl leading-none">
                  GOKU X CHEAT
                </h1>
                <p className="text-red-500/70 text-xs font-rajdhani tracking-widest uppercase">
                  FREE FIRE PANEL
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="visit-counter px-4 py-2 rounded flex items-center gap-2">
                <Users size={16} className="text-red-500" />
                <span className="font-orbitron text-red-400 text-sm">
                  {visitCount !== undefined ? visitCount.toString() : "..."}
                </span>
                <span className="text-gray-500 text-xs font-rajdhani uppercase">
                  visits
                </span>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  className="goku-btn px-3 py-2 rounded text-xs flex items-center gap-1"
                  onClick={onAdminOpen}
                  data-ocid="nav.button"
                >
                  <Settings size={14} /> ADMIN
                </button>
              )}
              <button
                type="button"
                className="goku-btn px-3 py-2 rounded text-xs flex items-center gap-1"
                onClick={onLogout}
                data-ocid="nav.button"
              >
                <LogOut size={14} /> LOGOUT
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="discord-banner rounded-lg p-8 mb-10 text-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <SiDiscord size={40} className="text-red-400" />
                <div>
                  <h2 className="goku-title text-2xl">JOIN OUR DISCORD</h2>
                  <p className="text-red-300/70 font-rajdhani tracking-widest text-sm">
                    GET ACCESS TO ALL CHEATS & SUPPORT
                  </p>
                </div>
              </div>
              <a
                href="https://discord.gg/fHhsEQkY49"
                target="_blank"
                rel="noopener noreferrer"
                className="goku-btn-gold px-8 py-3 rounded-full inline-flex items-center gap-2 text-base"
                data-ocid="discord.button"
              >
                <SiDiscord size={20} /> discord.gg/fHhsEQkY49
              </a>
            </div>
          </motion.section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="goku-red-title text-2xl">OUR PRODUCTS</h2>
              <div className="flex-1 goku-divider" style={{ margin: 0 }} />
            </div>

            {isLoading ? (
              <div
                className="flex justify-center py-16"
                data-ocid="products.loading_state"
              >
                <div className="goku-loading" />
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {products.map((p, i) => (
                  <ProductCard key={p.id.toString()} product={p} index={i} />
                ))}
              </div>
            ) : (
              <div
                className="text-center py-16 text-gray-500 font-rajdhani"
                data-ocid="products.empty_state"
              >
                <Zap size={40} className="mx-auto mb-4 text-red-900" />
                <p className="text-lg">No products available yet</p>
                <p className="text-sm">Check Discord for updates</p>
              </div>
            )}
          </section>
        </main>

        <footer className="border-t border-red-900/30 mt-12 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/generated/goku-x-cheat-logo-transparent.dim_400x400.png"
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                  style={{ filter: "drop-shadow(0 0 6px rgba(204,0,0,0.6))" }}
                />
                <span className="goku-red-title text-sm">GOKU X CHEAT</span>
              </div>
              <a
                href="https://discord.gg/fHhsEQkY49"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-red-400 hover:text-red-300 font-rajdhani text-sm transition-colors"
                data-ocid="footer.link"
              >
                <SiDiscord size={16} /> discord.gg/fHhsEQkY49
              </a>
              <div className="flex items-center gap-4">
                <p className="text-gray-600 text-xs font-rajdhani">
                  \u00a9 Goku X Cheat 2026
                </p>
                <div className="relative">
                  <input
                    ref={secretRef}
                    className="opacity-0 w-1 h-1 absolute"
                    value={secretInput}
                    onChange={(e) => setSecretInput(e.target.value)}
                    aria-label="admin access"
                  />
                  <button
                    type="button"
                    className="text-gray-800 hover:text-gray-700 text-xs transition-colors"
                    onClick={() => secretRef.current?.focus()}
                    title="Admin"
                    data-ocid="admin.button"
                  >
                    <Settings size={12} />
                  </button>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-600 text-xs font-rajdhani transition-colors"
              >
                \u00a9 {new Date().getFullYear()}. Built with \u2764\ufe0f using
                caffeine.ai
              </a>
            </div>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {showTokenModal && (
          <AdminTokenModal
            onClose={() => setShowTokenModal(false)}
            onSuccess={() => {
              setShowTokenModal(false);
              onAdminOpen();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AdminPanel({ onBack }: { onBack: () => void }) {
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: products, isLoading } = useAllProducts();
  const updateProduct = useUpdateProduct();
  const addProduct = useAddProduct();
  const [editStates, setEditStates] = useState<
    Record<
      string,
      { name: string; features: string; videoUrl: string; isActive: boolean }
    >
  >({});
  const [newProduct, setNewProduct] = useState({
    name: "",
    features: "",
    videoUrl: "",
    isActive: true,
  });
  const [showAdd, setShowAdd] = useState(false);

  const getEdit = (p: Product) =>
    editStates[p.id.toString()] ?? {
      name: p.name,
      features: p.features.join("\n"),
      videoUrl: p.videoUrl,
      isActive: p.isActive,
    };

  const setEdit = (id: bigint, field: string, value: string | boolean) => {
    const current = editStates[id.toString()] ?? {
      name: "",
      features: "",
      videoUrl: "",
      isActive: true,
    };
    setEditStates((prev) => ({
      ...prev,
      [id.toString()]: { ...current, ...prev[id.toString()], [field]: value },
    }));
  };

  const handleSave = async (p: Product) => {
    const ed = getEdit(p);
    await updateProduct.mutateAsync({
      id: p.id,
      product: {
        id: p.id,
        name: ed.name,
        features: ed.features.split("\n").filter(Boolean),
        videoUrl: ed.videoUrl,
        isActive: ed.isActive,
      },
    });
    toast.success("Product updated!");
  };

  const handleAdd = async () => {
    if (!newProduct.name) {
      toast.error("Name required");
      return;
    }
    await addProduct.mutateAsync({
      id: BigInt(0),
      name: newProduct.name,
      features: newProduct.features.split("\n").filter(Boolean),
      videoUrl: newProduct.videoUrl,
      isActive: newProduct.isActive,
    });
    toast.success("Product added!");
    setNewProduct({ name: "", features: "", videoUrl: "", isActive: true });
    setShowAdd(false);
  };

  if (checkingAdmin) {
    return (
      <div
        className="min-h-screen goku-bg flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <div className="goku-loading" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen goku-bg flex items-center justify-center">
        <div
          className="goku-card rounded-lg p-8 text-center"
          data-ocid="admin.panel"
        >
          <Shield size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="goku-red-title text-2xl mb-2">ACCESS DENIED</h2>
          <p className="text-gray-400 font-rajdhani mb-6">
            You do not have admin privileges
          </p>
          <button
            type="button"
            className="goku-btn px-6 py-2 rounded"
            onClick={onBack}
            data-ocid="admin.cancel_button"
          >
            GO BACK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen goku-bg relative">
      <ParticlesBackground />
      <div className="relative z-10">
        <header className="border-b border-red-900/50 bg-black/60 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={24} className="text-red-500" />
              <h1 className="goku-title text-xl">ADMIN PANEL</h1>
            </div>
            <button
              type="button"
              className="goku-btn px-4 py-2 rounded flex items-center gap-2 text-sm"
              onClick={onBack}
              data-ocid="admin.cancel_button"
            >
              <X size={16} /> EXIT ADMIN
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8" data-ocid="admin.panel">
          <div className="flex items-center justify-between mb-6">
            <h2 className="goku-red-title text-xl">MANAGE PRODUCTS</h2>
            <button
              type="button"
              className="goku-btn-gold px-4 py-2 rounded flex items-center gap-2 text-sm"
              onClick={() => setShowAdd((v) => !v)}
              data-ocid="admin.open_modal_button"
            >
              <Plus size={16} /> ADD PRODUCT
            </button>
          </div>

          <AnimatePresence>
            {showAdd && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="admin-card rounded-lg p-6 mb-6 overflow-hidden"
                data-ocid="admin.dialog"
              >
                <h3
                  style={{
                    fontFamily: "Orbitron",
                    color: "#ffd700",
                    textTransform: "uppercase",
                    fontSize: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  NEW PRODUCT
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="new-name"
                      className="block text-red-300 text-xs font-rajdhani uppercase mb-1"
                    >
                      Name
                    </label>
                    <input
                      id="new-name"
                      className="goku-input w-full px-3 py-2 rounded"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct((p) => ({ ...p, name: e.target.value }))
                      }
                      data-ocid="admin.input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="new-video"
                      className="block text-red-300 text-xs font-rajdhani uppercase mb-1"
                    >
                      Video URL
                    </label>
                    <input
                      id="new-video"
                      className="goku-input w-full px-3 py-2 rounded"
                      value={newProduct.videoUrl}
                      onChange={(e) =>
                        setNewProduct((p) => ({
                          ...p,
                          videoUrl: e.target.value,
                        }))
                      }
                      data-ocid="admin.input"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="new-features"
                      className="block text-red-300 text-xs font-rajdhani uppercase mb-1"
                    >
                      Features (one per line)
                    </label>
                    <textarea
                      id="new-features"
                      className="goku-input w-full px-3 py-2 rounded h-28 resize-none"
                      value={newProduct.features}
                      onChange={(e) =>
                        setNewProduct((p) => ({
                          ...p,
                          features: e.target.value,
                        }))
                      }
                      data-ocid="admin.textarea"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-red-300 text-xs font-rajdhani uppercase">
                      Active
                    </span>
                    <button
                      type="button"
                      className={`w-10 h-6 rounded-full transition-colors ${
                        newProduct.isActive ? "bg-red-600" : "bg-gray-700"
                      }`}
                      onClick={() =>
                        setNewProduct((p) => ({ ...p, isActive: !p.isActive }))
                      }
                      data-ocid="admin.switch"
                    >
                      <span
                        className={`block w-4 h-4 bg-white rounded-full transition-transform mx-1 ${
                          newProduct.isActive
                            ? "translate-x-4"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    className="goku-btn-gold px-5 py-2 rounded flex items-center gap-2 text-sm"
                    onClick={handleAdd}
                    disabled={addProduct.isPending}
                    data-ocid="admin.save_button"
                  >
                    {addProduct.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Plus size={16} />
                    )}{" "}
                    ADD
                  </button>
                  <button
                    type="button"
                    className="goku-btn px-4 py-2 rounded text-sm"
                    onClick={() => setShowAdd(false)}
                    data-ocid="admin.cancel_button"
                  >
                    CANCEL
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading ? (
            <div
              className="flex justify-center py-12"
              data-ocid="admin.loading_state"
            >
              <div className="goku-loading" />
            </div>
          ) : products && products.length > 0 ? (
            <div className="space-y-4" data-ocid="admin.table">
              {products.map((p, i) => {
                const ed = getEdit(p);
                return (
                  <motion.div
                    key={p.id.toString()}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="admin-card rounded-lg p-5"
                    data-ocid={`admin.item.${i + 1}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="goku-red-title text-sm">
                        PRODUCT #{i + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-rajdhani">
                          Active
                        </span>
                        <button
                          type="button"
                          className={`w-10 h-6 rounded-full transition-colors ${
                            ed.isActive ? "bg-red-600" : "bg-gray-700"
                          }`}
                          onClick={() =>
                            setEdit(p.id, "isActive", !ed.isActive)
                          }
                          data-ocid="admin.switch"
                        >
                          <span
                            className={`block w-4 h-4 bg-white rounded-full transition-transform mx-1 ${
                              ed.isActive ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor={`edit-name-${i}`}
                          className="block text-red-300 text-xs font-rajdhani uppercase mb-1"
                        >
                          Name
                        </label>
                        <input
                          id={`edit-name-${i}`}
                          className="goku-input w-full px-3 py-2 rounded text-sm"
                          value={ed.name}
                          onChange={(e) =>
                            setEdit(p.id, "name", e.target.value)
                          }
                          data-ocid="admin.input"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`edit-video-${i}`}
                          className="block text-red-300 text-xs font-rajdhani uppercase mb-1"
                        >
                          Video URL
                        </label>
                        <input
                          id={`edit-video-${i}`}
                          className="goku-input w-full px-3 py-2 rounded text-sm"
                          value={ed.videoUrl}
                          onChange={(e) =>
                            setEdit(p.id, "videoUrl", e.target.value)
                          }
                          data-ocid="admin.input"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label
                          htmlFor={`edit-features-${i}`}
                          className="block text-red-300 text-xs font-rajdhani uppercase mb-1"
                        >
                          Features (one per line)
                        </label>
                        <textarea
                          id={`edit-features-${i}`}
                          className="goku-input w-full px-3 py-2 rounded h-24 resize-none text-sm"
                          value={ed.features}
                          onChange={(e) =>
                            setEdit(p.id, "features", e.target.value)
                          }
                          data-ocid="admin.textarea"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="goku-btn mt-3 px-5 py-2 rounded flex items-center gap-2 text-sm"
                      onClick={() => handleSave(p)}
                      disabled={updateProduct.isPending}
                      data-ocid="admin.save_button"
                    >
                      {updateProduct.isPending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Save size={14} />
                      )}{" "}
                      SAVE
                    </button>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div
              className="text-center py-12 text-gray-500 font-rajdhani"
              data-ocid="admin.empty_state"
            >
              No products found. Add one above.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const { identity, clear, isInitializing } = useInternetIdentity();
  const [view, setView] = useState<View>("login");

  useEffect(() => {
    if (!isInitializing && identity) {
      setView("products");
    }
  }, [identity, isInitializing]);

  if (isInitializing) {
    return (
      <div className="min-h-screen goku-bg flex items-center justify-center">
        <ParticlesBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="goku-loading" />
          <p className="goku-red-title text-sm">LOADING...</p>
        </div>
      </div>
    );
  }

  if (!identity && view === "register") {
    return (
      <div className="min-h-screen goku-bg flex items-center justify-center px-4 py-8">
        <ParticlesBackground />
        <div className="relative z-10 w-full max-w-md">
          <RegisterForm
            onSwitch={() => setView("login")}
            onRegister={() => setView("products")}
          />
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="min-h-screen goku-bg flex items-center justify-center px-4 py-8">
        <ParticlesBackground />
        <div className="relative z-10 w-full max-w-md">
          <LoginForm
            onSwitch={() => setView("register")}
            onLogin={() => setView("products")}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster theme="dark" position="top-right" />
      <AnimatePresence mode="wait">
        {view === "admin" ? (
          <AdminPanel key="admin" onBack={() => setView("products")} />
        ) : (
          <ProductsPage
            key="products"
            onAdminOpen={() => setView("admin")}
            onLogout={() => {
              clear();
              setView("login");
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
