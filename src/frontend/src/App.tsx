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
  User,
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
  useUpdateProduct,
  useVisitCount,
} from "./hooks/useQueries";

type View = "login" | "register" | "products" | "admin" | "profile";

// Count-up animation hook
function useCountUp(target: number | undefined, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === undefined) return;
    if (target === 0) {
      setCount(0);
      return;
    }
    let current = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function ParticlesBackground() {
  return (
    <>
      <div className="kamehameha-beam" />
      <div className="screen-flash" />
      <div className="particles-container">
        {Array.from({ length: 20 }, (_, i) => `p${i}`).map((key) => (
          <div key={key} className="particle" />
        ))}
        <div className="energy-orb orb-1" />
        <div className="energy-orb orb-2" />
        <div className="energy-orb orb-3" />
        <div className="energy-orb orb-4" />
        <div className="energy-lines" />
      </div>
    </>
  );
}

// Typing text effect component
function TypingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const iv = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(iv);
      }
    }, 60);
    return () => clearInterval(iv);
  }, [text]);

  return (
    <p className="text-gray-500 font-rajdhani tracking-widest text-xs mt-1 uppercase relative z-10 min-h-[1.2em]">
      {displayed}
      <span className="inline-block w-0.5 h-3 bg-red-500 ml-0.5 animate-pulse" />
    </p>
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
        <motion.img
          src="/assets/generated/goku-x-cheat-logo.dim_400x400.png"
          alt="Goku X Cheat"
          className="w-24 h-24 mx-auto mb-4 object-contain cursor-pointer"
          style={{ filter: "drop-shadow(0 0 20px rgba(204,0,0,0.8))" }}
          whileHover={{ rotate: 12, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
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
  const [awaitingProfile, setAwaitingProfile] = useState(false);
  const pendingNameRef = useRef("");
  const [captchaA, setCaptchaA] = useState(
    () => Math.floor(Math.random() * 9) + 1,
  );
  const [captchaB, setCaptchaB] = useState(
    () => Math.floor(Math.random() * 9) + 1,
  );
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const regenerateCaptcha = () => {
    setCaptchaA(Math.floor(Math.random() * 9) + 1);
    setCaptchaB(Math.floor(Math.random() * 9) + 1);
    setCaptchaAnswer("");
  };

  useEffect(() => {
    if (awaitingProfile && actor && loginStatus === "success") {
      setAwaitingProfile(false);
      (async () => {
        try {
          await actor._initializeAccessControlWithSecret("");
          await actor.saveCallerUserProfile({ name: pendingNameRef.current });
          toast.success("Registration successful!");
          onRegister();
        } catch {
          toast.error("Failed to save profile");
        }
      })();
    }
  }, [awaitingProfile, actor, loginStatus, onRegister]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Fill in all fields");
      return;
    }
    if (Number.parseInt(captchaAnswer) !== captchaA + captchaB) {
      toast.error("Incorrect answer, try again");
      regenerateCaptcha();
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
        pendingNameRef.current = name;
        setAwaitingProfile(true);
        toast.success("Code verified! Opening login...");
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
        <motion.img
          src="/assets/generated/goku-x-cheat-logo.dim_400x400.png"
          alt="Goku X Cheat"
          className="w-20 h-20 mx-auto mb-3 object-contain cursor-pointer"
          style={{ filter: "drop-shadow(0 0 20px rgba(204,0,0,0.8))" }}
          whileHover={{ rotate: 12, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
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
            <div
              className="rounded p-4 space-y-3"
              style={{
                background: "rgba(204,0,0,0.07)",
                border: "1px solid rgba(204,0,0,0.4)",
                boxShadow: "0 0 12px rgba(204,0,0,0.2)",
              }}
            >
              <label
                htmlFor="captcha-answer"
                className="block text-red-300 font-rajdhani font-semibold uppercase text-sm tracking-wider"
              >
                Human Verification
              </label>
              <p
                className="text-center font-orbitron tracking-widest"
                style={{
                  fontSize: "1.4rem",
                  color: "#ff3333",
                  textShadow: "0 0 10px rgba(255,51,51,0.6)",
                }}
              >
                What is {captchaA} + {captchaB}?
              </p>
              <input
                className="goku-input w-full px-4 py-2 rounded text-center font-orbitron tracking-widest text-lg"
                type="number"
                placeholder="?"
                id="captcha-answer"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                data-ocid="register.input"
              />
              <p className="text-gray-600 text-xs font-rajdhani text-center">
                Solve the equation above
              </p>
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
        initial={{ opacity: 0, y: 60, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{
          delay: index * 0.15,
          duration: 0.6,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        whileHover={{ scale: 1.04, y: -10 }}
        className="product-card rounded-lg p-6 flex flex-col gap-4"
        data-ocid={`product.item.${index + 1}`}
      >
        <div className="relative">
          {index === 0 && (
            <span className="new-badge absolute -top-3 -right-3 z-10 font-orbitron text-xs px-2 py-0.5 rounded">
              NEW
            </span>
          )}
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

function AdminLoginScreen({
  onSuccess,
  onBack,
}: { onSuccess: () => void; onBack: () => void }) {
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().toLowerCase() !== "goku cheat") {
      toast.error("Wrong password");
      return;
    }
    toast.success("Admin access granted! 🔥");
    onSuccess();
  };

  return (
    <div className="min-h-screen goku-bg flex items-center justify-center px-4 py-8">
      <ParticlesBackground />
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4 }}
          className="goku-card rounded-lg p-8 w-full"
          data-ocid="admin.panel"
        >
          <div className="text-center mb-8">
            <motion.div
              className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full"
              style={{
                background: "rgba(204,0,0,0.15)",
                border: "2px solid rgba(204,0,0,0.5)",
                boxShadow: "0 0 30px rgba(204,0,0,0.4)",
              }}
              animate={{
                boxShadow: [
                  "0 0 30px rgba(204,0,0,0.4)",
                  "0 0 60px rgba(255,0,0,0.7)",
                  "0 0 30px rgba(204,0,0,0.4)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Shield size={40} className="text-red-500" />
            </motion.div>
            <h1 className="goku-title text-3xl mb-1">ADMIN PANEL</h1>
            <p className="text-red-400 font-rajdhani text-sm tracking-widest uppercase">
              Enter the secret code
            </p>
          </div>

          <div className="goku-divider" />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-secret-code"
                className="block text-red-300 font-rajdhani font-semibold mb-1 uppercase text-sm tracking-wider"
              >
                Secret Code
              </label>
              <div className="relative">
                <input
                  id="admin-secret-code"
                  className="goku-input w-full px-4 py-3 rounded pr-12 font-orbitron tracking-widest"
                  type={showCode ? "text" : "password"}
                  placeholder="ENTER CODE"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  data-ocid="admin.input"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-300 transition-colors"
                  onClick={() => setShowCode((v) => !v)}
                >
                  {showCode ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="goku-btn w-full py-3 rounded flex items-center justify-center gap-2"
              data-ocid="admin.submit_button"
            >
              <Shield size={18} /> ENTER ADMIN
            </button>
          </form>

          <div className="goku-divider" />

          <div className="text-center">
            <button
              type="button"
              className="text-red-500 hover:text-red-300 font-rajdhani text-sm transition-colors"
              onClick={onBack}
              data-ocid="admin.cancel_button"
            >
              \u2190 Back to Store
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ProductsPage({
  onAdminOpen,
  onLogout,
  onProfileOpen,
}: {
  onAdminOpen: () => void;
  onLogout: () => void;
  onProfileOpen: () => void;
}) {
  const { data: products, isLoading } = useActiveProducts();
  const { data: visitCount } = useVisitCount();
  const animatedCount = useCountUp(
    visitCount !== undefined ? Number(visitCount) : undefined,
  );
  const [secretInput, setSecretInput] = useState("");
  const secretRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (secretInput.toLowerCase() === "goku cheat") {
      setSecretInput("");
      onAdminOpen();
    }
  }, [secretInput, onAdminOpen]);

  return (
    <div className="min-h-screen goku-bg relative">
      <ParticlesBackground />
      <div className="relative z-10">
        <motion.header
          className="border-b border-red-900/50 bg-black/60 backdrop-blur-sm sticky top-0 z-20"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.img
                src="/assets/generated/goku-x-cheat-logo.dim_400x400.png"
                alt="Goku X Cheat"
                className="w-12 h-12 object-contain cursor-pointer"
                style={{ filter: "drop-shadow(0 0 10px rgba(204,0,0,0.8))" }}
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                whileHover={{ rotate: 12, scale: 1.15 }}
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
                  {visitCount !== undefined ? animatedCount.toString() : "..."}
                </span>
                <span className="text-gray-500 text-xs font-rajdhani uppercase">
                  visits
                </span>
              </div>
              <button
                type="button"
                className="goku-btn-gold px-3 py-2 rounded text-xs flex items-center gap-1"
                onClick={onProfileOpen}
                data-ocid="profile.open_modal_button"
              >
                <User size={14} /> PROFILE
              </button>
              <button
                type="button"
                className="goku-btn px-3 py-2 rounded text-xs flex items-center gap-1"
                onClick={onAdminOpen}
                data-ocid="nav.button"
              >
                <Settings size={14} /> ADMIN
              </button>
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
        </motion.header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* HERO BANNER */}
          <div className="hero-banner relative overflow-hidden rounded-xl mb-8 flex flex-col items-center justify-center py-12 text-center">
            <div className="scan-line" />
            <span className="lightning-bolt bolt-1" />
            <span className="lightning-bolt bolt-2" />
            <span className="lightning-bolt bolt-3" />
            <span className="lightning-bolt bolt-4" />
            <span className="lightning-bolt bolt-5" />
            <span className="lightning-bolt bolt-6" />
            <div className="shockwave-container">
              <div className="shockwave-ring" />
              <div className="shockwave-ring" />
              <div className="shockwave-ring" />
            </div>
            <div className="relative z-10">
              <div className="aura-ring" />
              <div className="aura-ring" />
              <div className="aura-ring" />
              <motion.img
                src="/assets/generated/goku-x-cheat-logo.dim_400x400.png"
                alt="Goku X Cheat"
                className="w-32 h-32 object-contain logo-pulse-glow logo-spin-hover relative z-10"
                initial={{ scale: 0, rotate: 0 }}
                animate={{
                  scale: [0, 1.25, 1],
                  rotate: [0, 720, 720],
                  y: [0, 0, 0, -10, 0],
                }}
                transition={{
                  scale: { duration: 1, ease: "backOut", times: [0, 0.7, 1] },
                  rotate: { duration: 1, ease: "easeInOut" },
                  y: {
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1,
                  },
                }}
              />
              <div className="power-level-particles">
                <span className="power-particle">+9000</span>
                <span className="power-particle">+9000</span>
                <span className="power-particle">POWER!</span>
              </div>
            </div>
            <motion.h2
              className="goku-title text-3xl md:text-5xl mt-4 relative z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.8,
                duration: 0.5,
                type: "spring",
                stiffness: 300,
              }}
            >
              GOKU X CHEAT
            </motion.h2>
            <p
              className="glitch-text font-orbitron text-red-400 text-sm md:text-base tracking-[0.3em] mt-2 relative z-10"
              data-text="POWER LEVEL: OVER 9000"
            >
              POWER LEVEL: OVER 9000
            </p>
            <TypingText text="FREE FIRE DOMINATION PANEL" />
          </div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="discord-banner rounded-lg p-8 mb-10 text-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <SiDiscord size={40} className="text-red-400" />
                </motion.div>
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
            <motion.div
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="goku-red-title text-2xl">OUR PRODUCTS</h2>
              <div className="flex-1 goku-divider" style={{ margin: 0 }} />
            </motion.div>

            {isLoading ? (
              <div
                className="flex justify-center py-16"
                data-ocid="products.loading_state"
              >
                <div className="goku-loading" />
              </div>
            ) : products && products.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.12 } },
                }}
              >
                {products.map((p, i) => (
                  <ProductCard key={p.id.toString()} product={p} index={i} />
                ))}
              </motion.div>
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
                  src="/assets/generated/goku-x-cheat-logo.dim_400x400.png"
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
    </div>
  );
}

function AdminPanel({ onBack }: { onBack: () => void }) {
  const { actor } = useActor();
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
  const [showSettings, setShowSettings] = useState(false);
  const [siteSettings, setSiteSettings] = useState({
    siteName: "GOKU X CHEAT",
    logoUrl: "",
    themeAccent: "red",
    discordUrl: "https://discord.gg/fHhsEQkY49",
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    if (!actor) return;
    (async () => {
      try {
        const result = await (actor as any).getSiteSettings();
        if (result && result.length > 0 && result[0]) {
          const s = result[0];
          setSiteSettings({
            siteName: s.siteName || "GOKU X CHEAT",
            logoUrl: s.logoUrl || "",
            themeAccent: s.themeAccent || "red",
            discordUrl: s.discordUrl || "https://discord.gg/fHhsEQkY49",
          });
        }
      } catch {
        // ignore
      }
    })();
  }, [actor]);

  const handleSaveSettings = async () => {
    if (!actor) return;
    setSavingSettings(true);
    try {
      await (actor as any).updateSiteSettings(siteSettings);
      // Apply theme
      const colorMap: Record<string, string> = {
        red: "#cc0000",
        blue: "#0066cc",
        purple: "#7700cc",
        green: "#00aa44",
        gold: "#ffd700",
      };
      document.documentElement.style.setProperty(
        "--goku-accent",
        colorMap[siteSettings.themeAccent] || "#cc0000",
      );
      toast.success("Site settings saved!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

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

  return (
    <motion.div
      className="min-h-screen goku-bg relative"
      initial={{ backgroundColor: "rgba(204,0,0,0.4)" }}
      animate={{ backgroundColor: "rgba(0,0,0,0)" }}
      transition={{ duration: 0.5 }}
    >
      <ParticlesBackground />
      <div className="relative z-10">
        <motion.header
          className="border-b border-red-900/50 bg-black/60 backdrop-blur-sm sticky top-0 z-20"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Shield size={24} className="text-red-500" />
              </motion.div>
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
        </motion.header>

        <main className="max-w-5xl mx-auto px-4 py-8" data-ocid="admin.panel">
          {/* Site Settings Section */}
          <div className="mb-8">
            <button
              type="button"
              className="w-full flex items-center justify-between goku-card rounded-xl px-6 py-4 mb-2"
              onClick={() => setShowSettings((v) => !v)}
              data-ocid="admin.settings.toggle"
            >
              <h2 className="goku-red-title text-xl flex items-center gap-2">
                <Settings size={18} className="text-red-500" /> SITE SETTINGS
              </h2>
              <span className="text-red-500 font-orbitron text-xs">
                {showSettings ? "▲ COLLAPSE" : "▼ EXPAND"}
              </span>
            </button>
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="admin-card rounded-xl p-6 overflow-hidden"
                  data-ocid="admin.settings.panel"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="s-sitename"
                        className="block text-red-300 font-rajdhani font-semibold mb-2 uppercase text-xs tracking-widest"
                      >
                        Site Name
                      </label>
                      <input
                        id="s-sitename"
                        className="goku-input w-full px-3 py-2 rounded text-sm"
                        value={siteSettings.siteName}
                        onChange={(e) =>
                          setSiteSettings((p) => ({
                            ...p,
                            siteName: e.target.value,
                          }))
                        }
                        placeholder="GOKU X CHEAT"
                        data-ocid="admin.settings.input"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="s-logo"
                        className="block text-red-300 font-rajdhani font-semibold mb-2 uppercase text-xs tracking-widest"
                      >
                        Logo URL
                      </label>
                      <input
                        id="s-logo"
                        className="goku-input w-full px-3 py-2 rounded text-sm"
                        value={siteSettings.logoUrl}
                        onChange={(e) =>
                          setSiteSettings((p) => ({
                            ...p,
                            logoUrl: e.target.value,
                          }))
                        }
                        placeholder="https://example.com/logo.png"
                        data-ocid="admin.settings.input"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="s-theme"
                        className="block text-red-300 font-rajdhani font-semibold mb-2 uppercase text-xs tracking-widest"
                      >
                        Theme Accent
                      </label>
                      <select
                        id="s-theme"
                        className="goku-input w-full px-3 py-2 rounded text-sm bg-black"
                        value={siteSettings.themeAccent}
                        onChange={(e) =>
                          setSiteSettings((p) => ({
                            ...p,
                            themeAccent: e.target.value,
                          }))
                        }
                        data-ocid="admin.settings.select"
                      >
                        <option value="red">🔴 Red (Default)</option>
                        <option value="blue">🔵 Blue</option>
                        <option value="purple">🟣 Purple</option>
                        <option value="green">🟢 Green</option>
                        <option value="gold">🟡 Gold</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="s-discord"
                        className="block text-red-300 font-rajdhani font-semibold mb-2 uppercase text-xs tracking-widest"
                      >
                        Discord URL
                      </label>
                      <input
                        id="s-discord"
                        className="goku-input w-full px-3 py-2 rounded text-sm"
                        value={siteSettings.discordUrl}
                        onChange={(e) =>
                          setSiteSettings((p) => ({
                            ...p,
                            discordUrl: e.target.value,
                          }))
                        }
                        placeholder="https://discord.gg/..."
                        data-ocid="admin.settings.input"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="goku-btn mt-5 px-6 py-2 rounded flex items-center gap-2 text-sm"
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    data-ocid="admin.settings.save_button"
                  >
                    {savingSettings ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> SAVING...
                      </>
                    ) : (
                      <>
                        <Save size={14} /> SAVE SETTINGS
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
    </motion.div>
  );
}

function ProfilePage({ onBack }: { onBack: () => void }) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const principal = identity?.getPrincipal().toString() ?? "";
  const shortPrincipal =
    principal.length > 12
      ? `${principal.slice(0, 8)}...${principal.slice(-4)}`
      : principal;

  useEffect(() => {
    if (!actor) return;
    (async () => {
      try {
        const profile = await actor.getCallerUserProfile();
        if (profile) setName(profile.name);
      } catch {
        // ignore
      } finally {
        setFetching(false);
      }
    })();
  }, [actor]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setLoading(true);
    try {
      await actor.saveCallerUserProfile({ name });
      toast.success("Profile saved! Power level rising...");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen goku-bg relative"
    >
      <ParticlesBackground />
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-red-900/50 bg-black/60 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.img
                src="/assets/generated/goku-x-cheat-logo.dim_400x400.png"
                alt="Goku X Cheat"
                className="w-12 h-12 object-contain"
                style={{ filter: "drop-shadow(0 0 10px rgba(204,0,0,0.8))" }}
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <div>
                <h1 className="goku-title text-xl leading-none">
                  GOKU X CHEAT
                </h1>
                <p className="text-red-500/70 text-xs font-rajdhani tracking-widest uppercase">
                  PLAYER PROFILE
                </p>
              </div>
            </div>
            <button
              type="button"
              className="goku-btn px-4 py-2 rounded text-xs flex items-center gap-2"
              onClick={onBack}
              data-ocid="profile.close_button"
            >
              ← BACK TO STORE
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-12">
          {/* Logo + Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="relative inline-block mb-4">
              <motion.img
                src="/assets/generated/goku-x-cheat-profile-logo-transparent.dim_200x200.png"
                alt="Profile Avatar"
                className="w-20 h-20 mx-auto rounded-full object-cover"
                style={{
                  border: "2px solid #cc0000",
                  boxShadow:
                    "0 0 24px rgba(204,0,0,0.7), 0 0 48px rgba(204,0,0,0.3)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 24px rgba(204,0,0,0.7), 0 0 48px rgba(204,0,0,0.3)",
                    "0 0 36px rgba(255,51,51,0.9), 0 0 64px rgba(255,51,51,0.5)",
                    "0 0 24px rgba(204,0,0,0.7), 0 0 48px rgba(204,0,0,0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              />
              {/* Ring animation */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: "2px solid rgba(255,215,0,0.6)" }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>
            <h2 className="goku-title text-3xl">MY PROFILE</h2>
            <p className="text-red-500/70 font-rajdhani tracking-widest text-sm mt-1">
              WARRIOR IDENTITY
            </p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="goku-card rounded-xl p-8 mb-6"
          >
            <div className="goku-divider mb-6" />

            {/* Identity field */}
            <div className="mb-5">
              <label
                htmlFor="profile-identity"
                className="block text-red-300 font-rajdhani font-semibold mb-2 uppercase text-sm tracking-widest"
              >
                🔐 IDENTITY
              </label>
              <div
                id="profile-identity"
                className="goku-input w-full px-4 py-3 rounded font-orbitron text-xs text-gray-400 cursor-not-allowed select-all"
                style={{ opacity: 0.7 }}
              >
                {shortPrincipal || "—"}
              </div>
              <p className="text-gray-600 text-xs font-rajdhani mt-1">
                Your Internet Identity Principal (read-only)
              </p>
            </div>

            {/* Name field */}
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label
                  htmlFor="profile-name"
                  className="block text-red-300 font-rajdhani font-semibold mb-2 uppercase text-sm tracking-widest"
                >
                  ⚡ WARRIOR NAME
                </label>
                {fetching ? (
                  <div className="goku-input w-full px-4 py-3 rounded flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-red-500" />
                    <span className="text-gray-500 text-sm font-rajdhani">
                      Loading...
                    </span>
                  </div>
                ) : (
                  <input
                    id="profile-name"
                    className="goku-input w-full px-4 py-3 rounded"
                    placeholder="Enter your warrior name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    data-ocid="profile.input"
                  />
                )}
              </div>

              <button
                type="submit"
                className="goku-btn w-full py-3 rounded flex items-center justify-center gap-2 font-orbitron tracking-widest"
                disabled={loading || fetching}
                data-ocid="profile.submit_button"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> SAVING...
                  </>
                ) : (
                  <>
                    <Save size={18} /> SAVE CHANGES
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Footer */}
          <div className="text-center mt-10 text-gray-700 text-xs font-rajdhani">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-900 hover:text-red-600 transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </main>
      </div>
    </motion.div>
  );
}

export default function App() {
  const { identity, clear, isInitializing } = useInternetIdentity();
  const { actor } = useActor();
  const [view, setView] = useState<View>("login");
  const [showAdminLogin, setShowAdminLogin] = useState(true);

  useEffect(() => {
    if (!isInitializing && identity) {
      setView("products");
    }
  }, [identity, isInitializing]);

  // Load and apply site settings on mount
  useEffect(() => {
    if (!actor) return;
    (async () => {
      try {
        const result = await (actor as any).getSiteSettings();
        if (result && result.length > 0 && result[0]) {
          const s = result[0];
          const colorMap: Record<string, string> = {
            red: "#cc0000",
            blue: "#0066cc",
            purple: "#7700cc",
            green: "#00aa44",
            gold: "#ffd700",
          };
          if (s.themeAccent) {
            document.documentElement.style.setProperty(
              "--goku-accent",
              colorMap[s.themeAccent] || "#cc0000",
            );
          }
        }
      } catch {
        // ignore
      }
    })();
  }, [actor]);

  // Reset admin login gate when switching to admin view
  const handleAdminOpen = () => {
    setShowAdminLogin(true);
    setView("admin");
  };

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
        {view === "admin" && showAdminLogin ? (
          <AdminLoginScreen
            key="admin-login"
            onSuccess={() => setShowAdminLogin(false)}
            onBack={() => setView("products")}
          />
        ) : view === "admin" ? (
          <AdminPanel key="admin" onBack={() => setView("products")} />
        ) : view === "profile" ? (
          <ProfilePage key="profile" onBack={() => setView("products")} />
        ) : (
          <ProductsPage
            key="products"
            onAdminOpen={handleAdminOpen}
            onProfileOpen={() => setView("profile")}
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
