import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  Sun,
  Moon,
  Share2,
  Check,
  Gamepad2,
  Monitor,
  MonitorCog,
  Radio,
  Loader2,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { generateOptimalBuild, type BuildRecommendation } from "@/lib/pcBuilderAlgorithm";
import { formatPrice, usageDetails, usageOptions, type Usage } from "@/lib/builds";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "dzconfig — اختر تجميعتك حسب ميزانيتك" },
      {
        name: "description",
        content: "ابحث عن أفضل تجميعة كمبيوتر والألعاب التي تشغلها حسب ميزانيتك.",
      },
      { property: "og:title", content: "dzconfig — اختر تجميعتك حسب ميزانيتك" },
      {
        property: "og:description",
        content: "تسع قطع متوافقة مع تقدير أداء الألعاب حسب ميزانيتك.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const usageIcons: Record<Usage, typeof Monitor> = {
  g1080: Monitor,
  g1440: MonitorCog,
  stream: Radio,
};

function Index() {
  const [amount, setAmount] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [build, setBuild] = useState<BuildRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<Usage>("g1080");
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (window.localStorage.getItem("theme") === "dark") setTheme("dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedBudget = Number(amount.replace(/\D/g, ""));
    if (!Number.isFinite(parsedBudget) || parsedBudget <= 0) {
      setError("أدخل ميزانيتك بالدولار الأمريكي للبحث عن تجميعة.");
      setBuild(null);
      setSearched(false);
      return;
    }

    setCopied(false);
    setError(null);
    setSearched(true);
    setLoading(true);
    setBuild(null);

    try {
      const optimalBuild = await generateOptimalBuild(parsedBudget);
      setBuild(optimalBuild);
    } catch (cause) {
      console.error("تعذر إنشاء التجميعة من بيانات قاعدة البيانات:", cause);
      setError("تعذر تحميل بيانات القطع حالياً. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  async function handleShare() {
    if (!build) return;
    const lines = [
      "التجميعة المقترحة — dzconfig",
      `الميزانية: ${formatPrice(Number(amount.replace(/\D/g, "")))}`,
      "",
      ...build.parts.map((part) => `${part.name}: ${part.model} — ${formatPrice(part.price)}`),
      `الإجمالي: ${formatPrice(build.totalPrice)}`,
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-8 sm:py-16"
    >
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-soft">
              <span className="font-display text-lg font-bold">dz</span>
            </div>
            <h1 className="truncate font-display text-xl font-bold sm:text-2xl">dzconfig</h1>
          </div>
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-border bg-card text-foreground transition hover:border-primary/40 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </header>

        <div className="mt-12 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">ما هي ميزانيتك؟</h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            أدخل المبلغ لنقترح عليك أفضل تجميعة متوازنة من قاعدة البيانات
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-9 grid max-w-2xl grid-cols-[minmax(0,1fr)_auto] gap-2 rounded-xl border border-border bg-card p-2 shadow-soft"
        >
          <div className="flex min-w-0 items-center gap-3 px-3">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              inputMode="numeric"
              aria-label="الميزانية بالدولار الأمريكي"
              placeholder="مثال: 1,200 USD"
              className="h-12 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            type="submit"
            className="h-12 shrink-0 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:px-8"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "ابحث"}
          </button>
        </form>

        {loading && (
          <div className="mt-16 text-center text-muted-foreground">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-3">جاري البحث في قاعدة البيانات وتصفية القطع المتوافقة...</p>
          </div>
        )}

        {error && !loading && (
          <div role="alert" className="mt-16 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {searched && !loading && !error && !build && (
          <div className="mt-16 text-center text-muted-foreground">
            <p>
              عذراً، لم يتم العثور على تجميعة متوافقة بهذا المبلغ أو أن الميزانية منخفضة جداً للقطع
              المتوفرة حالياً.
            </p>
          </div>
        )}

        {build && !loading && (
          <div className="mt-12 animate-results">
            <div className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-accent">
                  التجميعة المقترحة بالذكاء الاصطناعي
                </p>
                <h3 className="mt-1 truncate font-display text-xl font-bold">
                  تجميعة متوافقة بميزانية {formatPrice(Number(amount.replace(/\D/g, "")))}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  الإجمالي الفعلي للقطع: {formatPrice(build.totalPrice)} | استهلاك الطاقة:{" "}
                  {build.totalPower}W
                </p>
              </div>
              <button
                type="button"
                onClick={handleShare}
                className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-xs font-semibold transition hover:border-primary/40 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" aria-hidden="true" />
                ) : (
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                )}
                {copied ? "تم النسخ ✓" : "مشاركة التجميعة"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {build.parts.map((part) => (
                <article
                  key={part.name}
                  className="rounded-lg border border-border bg-card p-3 transition hover:border-primary/40 hover:shadow-soft"
                >
                  <p className="mt-1 truncate text-[11px] font-bold text-primary">{part.name}</p>
                  <h4 className="mt-2 text-xs font-semibold leading-5 text-foreground">
                    {part.model}
                  </h4>
                  <p className="mt-3 font-mono text-xs font-semibold text-accent">
                    {formatPrice(part.price)}
                  </p>
                </article>
              ))}
            </div>

            <p className="mt-10 border-t border-border pt-4 text-center text-xs text-muted-foreground">
              تم التحقق من توافق المقبس والذاكرة وتوازن أداء المعالج وكرت الشاشة وقدرة مزود الطاقة.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
