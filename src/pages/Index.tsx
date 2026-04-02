import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

// ─── Animated number counter ───────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return value;
}

// ─── Intersection observer hook ────────────────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Service card ──────────────────────────────────────────────────────────
interface ServiceCardProps {
  icon: string;
  number: string;
  title: string;
  desc: string;
  delay: string;
  inView: boolean;
}

function ServiceCard({ icon, number, title, desc, delay, inView }: ServiceCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`group relative border border-white/10 bg-coal-800 p-8 cursor-pointer transition-all duration-500
        ${inView ? `opacity-0 animate-fade-up` : "opacity-0"}
      `}
      style={{ animationDelay: delay, animationFillMode: "forwards" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Amber accent line */}
      <div
        className="absolute top-0 left-0 h-[2px] bg-amber-400 transition-all duration-500"
        style={{ width: hovered ? "100%" : "0%" }}
      />
      {/* Number */}
      <span className="font-display text-[11px] tracking-[0.3em] text-amber-400/60 uppercase mb-6 block">
        {number}
      </span>
      {/* Icon */}
      <div className="mb-5 w-12 h-12 rounded-full bg-coal-700 flex items-center justify-center group-hover:bg-amber-400/10 transition-colors duration-300">
        <Icon name={icon} size={22} className="text-amber-400" />
      </div>
      {/* Title */}
      <h3 className="font-display text-xl font-semibold text-white uppercase tracking-wide mb-3">
        {title}
      </h3>
      {/* Desc */}
      <p className="font-body text-sm text-white/50 leading-relaxed">
        {desc}
      </p>
      {/* Arrow */}
      <div className={`mt-6 flex items-center gap-2 transition-all duration-300 ${hovered ? "opacity-100 translate-x-1" : "opacity-0 translate-x-0"}`}>
        <span className="font-body text-xs text-amber-400 uppercase tracking-widest">Подробнее</span>
        <Icon name="ArrowRight" size={14} className="text-amber-400" />
      </div>
    </div>
  );
}

// ─── Stat item ─────────────────────────────────────────────────────────────
function StatItem({ value, suffix, label, inView }: { value: number; suffix: string; label: string; inView: boolean }) {
  const count = useCountUp(value, 1800, inView);
  return (
    <div className="text-center">
      <div className="font-display text-5xl md:text-6xl font-bold text-white">
        {count}<span className="text-amber-400">{suffix}</span>
      </div>
      <div className="font-body text-sm text-white/40 mt-2 uppercase tracking-widest">{label}</div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────
export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const statsSection = useInView(0.3);
  const servicesSection = useInView(0.1);
  const ctaSection = useInView(0.3);

  const services = [
    {
      icon: "Globe",
      number: "01",
      title: "Веб-разработка",
      desc: "Создаём быстрые, адаптивные сайты и веб-приложения с современным стеком технологий.",
    },
    {
      icon: "Smartphone",
      number: "02",
      title: "Мобильные приложения",
      desc: "Нативные и кроссплатформенные решения для iOS и Android с фокусом на UX.",
    },
    {
      icon: "Layers",
      number: "03",
      title: "Дизайн-системы",
      desc: "Строим масштабируемые дизайн-системы, которые ускоряют разработку вашего продукта.",
    },
  ];

  return (
    <div
      className="min-h-screen font-body"
      style={{ background: "#0A0A0A", color: "#fff" }}
    >
      {/* ── Noise texture overlay ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5"
        style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0.95) 0%, transparent 100%)" }}
      >
        <a href="#" className="font-display text-xl font-bold tracking-[0.15em] text-white uppercase">
          Studio<span className="text-amber-400">.</span>
        </a>
        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {["Услуги", "Работы", "О нас", "Контакты"].map((item) => (
            <a
              key={item}
              href="#"
              className="font-body text-sm text-white/50 hover:text-white transition-colors duration-200 tracking-wide"
            >
              {item}
            </a>
          ))}
        </div>
        <button
          className="hidden md:flex items-center gap-2 bg-amber-400 text-black font-display text-sm font-semibold uppercase tracking-wider px-5 py-2.5 hover:bg-amber-300 transition-colors duration-200"
        >
          Обсудить проект
          <Icon name="ArrowRight" size={14} />
        </button>
        {/* Mobile burger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? "X" : "Menu"} size={24} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-coal-900 flex flex-col items-center justify-center gap-8">
          {["Услуги", "Работы", "О нас", "Контакты"].map((item) => (
            <a
              key={item}
              href="#"
              className="font-display text-3xl font-bold text-white uppercase tracking-widest"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <button className="mt-4 bg-amber-400 text-black font-display text-sm font-semibold uppercase tracking-widest px-8 py-4">
            Обсудить проект
          </button>
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-24 pb-16 overflow-hidden">
        {/* Diagonal accent line */}
        <div
          className="absolute right-0 top-0 w-px h-full opacity-20"
          style={{ background: "linear-gradient(to bottom, transparent, #FBBF24 40%, transparent)" }}
        />
        <div
          className="absolute left-0 bottom-0 h-px opacity-10"
          style={{ background: "linear-gradient(to right, transparent, #FBBF24 60%, transparent)", width: "100%" }}
        />

        {/* Glowing orb */}
        <div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)",
            transform: "translate(50%, -50%)",
          }}
        />

        {/* Tag */}
        <div className="opacity-0 animate-fade-up flex items-center gap-3 mb-10">
          <div className="w-8 h-px bg-amber-400" />
          <span className="font-body text-xs text-amber-400/80 uppercase tracking-[0.3em]">
            Цифровая студия · 2024
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="opacity-0 animate-fade-up-delay-1 font-display font-bold uppercase leading-[0.9] mb-8"
          style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)", letterSpacing: "-0.01em" }}
        >
          Создаём
          <br />
          <span className="text-amber-400">цифровые</span>
          <br />
          продукты
        </h1>

        {/* Sub */}
        <p className="opacity-0 animate-fade-up-delay-2 font-body text-white/50 text-lg max-w-md leading-relaxed mb-12">
          Превращаем идеи в работающие сайты и приложения.
          Быстро, чисто, по-настоящему.
        </p>

        {/* CTA row */}
        <div className="opacity-0 animate-fade-up-delay-3 flex flex-wrap items-center gap-5">
          <button className="group flex items-center gap-3 bg-amber-400 text-black font-display font-semibold uppercase tracking-widest text-sm px-8 py-4 hover:bg-amber-300 transition-all duration-200">
            Начать проект
            <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          <button className="flex items-center gap-3 border border-white/20 text-white font-display font-medium uppercase tracking-widest text-sm px-8 py-4 hover:border-white/50 transition-all duration-200">
            Наши работы
          </button>
        </div>

        {/* Scroll hint */}
        <div className="opacity-0 animate-fade-in-slow absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
          <span className="font-body text-[10px] text-white/30 uppercase tracking-[0.3em]">Scroll</span>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <div ref={statsSection.ref}>
        <section
          className="px-6 md:px-12 py-20 border-t border-white/5"
          style={{ background: "#111111" }}
        >
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
            <StatItem value={120} suffix="+" label="Проектов" inView={statsSection.inView} />
            <StatItem value={8} suffix="" label="Лет опыта" inView={statsSection.inView} />
            <StatItem value={98} suffix="%" label="Довольных клиентов" inView={statsSection.inView} />
            <StatItem value={40} suffix="+" label="Команда" inView={statsSection.inView} />
          </div>
        </section>
      </div>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <div ref={servicesSection.ref}>
        <section className="px-6 md:px-12 py-24 relative overflow-hidden">
          {/* Section header */}
          <div className="max-w-6xl mx-auto mb-16">
            <div
              className={`flex items-center gap-3 mb-6 transition-all duration-700 ${servicesSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <div className="w-8 h-px bg-amber-400" />
              <span className="font-body text-xs text-amber-400/80 uppercase tracking-[0.3em]">Что мы делаем</span>
            </div>
            <h2
              className={`font-display font-bold text-5xl md:text-6xl uppercase text-white transition-all duration-700 delay-100 ${servicesSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              Наши<br /><span className="text-amber-400">услуги</span>
            </h2>
          </div>

          {/* Cards */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {services.map((s, i) => (
              <ServiceCard
                key={s.number}
                {...s}
                delay={`${i * 0.15}s`}
                inView={servicesSection.inView}
              />
            ))}
          </div>
        </section>
      </div>

      {/* ── MARQUEE ──────────────────────────────────────────────────────── */}
      <div className="py-8 overflow-hidden border-t border-b border-white/5 bg-amber-400">
        <div
          className="flex gap-12 whitespace-nowrap"
          style={{
            animation: "marquee 18s linear infinite",
          }}
        >
          {Array(3).fill(["Дизайн", "Разработка", "Брендинг", "Мобайл", "Запуск", "Результат"]).flat().map((word, i) => (
            <span key={i} className="font-display font-semibold uppercase tracking-[0.2em] text-black text-sm">
              {word} <span className="text-black/40 mx-3">·</span>
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.33%); }
        }
      `}</style>

      {/* ── PROCESS ──────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-24" style={{ background: "#0f0f0f" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-amber-400" />
                <span className="font-body text-xs text-amber-400/80 uppercase tracking-[0.3em]">Как мы работаем</span>
              </div>
              <h2 className="font-display font-bold text-5xl uppercase text-white mb-8 leading-tight">
                Процесс <br /><span className="text-amber-400">без</span> воды
              </h2>
              <p className="font-body text-white/50 leading-relaxed text-base mb-10">
                Никаких бесконечных правок и переносов дедлайнов. Чёткий процесс — чёткий результат.
              </p>
              <button className="group flex items-center gap-3 font-display text-sm font-semibold uppercase tracking-widest text-amber-400 border-b border-amber-400/30 pb-1 hover:border-amber-400 transition-colors duration-200">
                Подробнее о процессе
                <Icon name="ArrowRight" size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right — steps */}
            <div className="flex flex-col gap-0">
              {[
                { n: "01", label: "Бриф и анализ", desc: "Изучаем задачу, конкурентов, аудиторию" },
                { n: "02", label: "Дизайн и прототип", desc: "Создаём визуальную концепцию и UX-сценарии" },
                { n: "03", label: "Разработка", desc: "Пишем чистый, масштабируемый код" },
                { n: "04", label: "Запуск и поддержка", desc: "Деплоим, тестируем, сопровождаем" },
              ].map((step, i) => (
                <div
                  key={step.n}
                  className="group flex items-start gap-6 py-6 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors px-2 cursor-default"
                >
                  <span className="font-display text-xs text-amber-400/50 tracking-widest mt-1 min-w-[2rem]">{step.n}</span>
                  <div>
                    <div className="font-display text-lg font-semibold uppercase text-white tracking-wide mb-1 group-hover:text-amber-400 transition-colors">
                      {step.label}
                    </div>
                    <div className="font-body text-sm text-white/40">{step.desc}</div>
                  </div>
                  <Icon name="ChevronRight" size={16} className="ml-auto text-white/20 group-hover:text-amber-400 transition-colors mt-1 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <div ref={ctaSection.ref}>
        <section
          className="relative px-6 md:px-12 py-28 overflow-hidden"
          style={{ background: "#111111" }}
        >
          {/* Big bg text */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            aria-hidden
          >
            <span
              className="font-display font-bold uppercase text-white/[0.025] whitespace-nowrap"
              style={{ fontSize: "clamp(6rem, 20vw, 18rem)" }}
            >
              СТАРТ
            </span>
          </div>

          <div className="relative max-w-3xl mx-auto text-center">
            <div
              className={`flex items-center justify-center gap-3 mb-8 transition-all duration-700 ${ctaSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <div className="w-8 h-px bg-amber-400" />
              <span className="font-body text-xs text-amber-400/80 uppercase tracking-[0.3em]">Готовы начать?</span>
              <div className="w-8 h-px bg-amber-400" />
            </div>

            <h2
              className={`font-display font-bold uppercase text-white transition-all duration-700 delay-100 mb-6 ${ctaSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", lineHeight: 1 }}
            >
              Давайте создадим <span className="text-amber-400">что-то крутое</span>
            </h2>

            <p
              className={`font-body text-white/40 text-lg mb-12 max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${ctaSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              Расскажите нам о вашей идее — и мы вернёмся с предложением в течение 24 часов.
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${ctaSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              {/* Email input row */}
              <div className="flex flex-1 max-w-md border border-white/20 bg-white/5 focus-within:border-amber-400/50 transition-colors">
                <input
                  type="email"
                  placeholder="ваш@email.ru"
                  className="flex-1 bg-transparent font-body text-sm text-white placeholder-white/30 px-5 py-4 outline-none"
                />
                <button className="bg-amber-400 text-black font-display font-semibold text-sm uppercase tracking-widest px-6 py-4 hover:bg-amber-300 transition-colors duration-200 whitespace-nowrap">
                  Отправить
                </button>
              </div>
            </div>

            <p className="mt-4 font-body text-xs text-white/25 text-center">
              Без спама. Только по делу.
            </p>
          </div>
        </section>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="px-6 md:px-12 py-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ background: "#0A0A0A" }}
      >
        <a href="#" className="font-display text-lg font-bold tracking-[0.15em] text-white uppercase">
          Studio<span className="text-amber-400">.</span>
        </a>
        <div className="flex items-center gap-8">
          {["Telegram", "VK", "Behance"].map((s) => (
            <a key={s} href="#" className="font-body text-xs text-white/30 hover:text-white/70 transition-colors uppercase tracking-widest">
              {s}
            </a>
          ))}
        </div>
        <span className="font-body text-xs text-white/20">© 2024 Studio. Все права защищены.</span>
      </footer>
    </div>
  );
}