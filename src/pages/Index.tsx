import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

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

// ─── Card component ─────────────────────────────────────────────────────────
function InfoCard({
  icon,
  label,
  title,
  description,
  items,
  color,
  delay,
  inView,
}: {
  icon: string;
  label: string;
  title: string;
  description: string;
  items: string[];
  color: "amber" | "blue";
  delay: string;
  inView: boolean;
}) {
  const isAmber = color === "amber";
  return (
    <div
      className={`relative border bg-coal-800 p-8 md:p-10 transition-all duration-700
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        ${isAmber ? "border-amber-400/20" : "border-blue-400/20"}
      `}
      style={{ transitionDelay: delay }}
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${isAmber ? "bg-amber-400" : "bg-blue-400"}`} />

      {/* Label */}
      <div className={`flex items-center gap-3 mb-6`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAmber ? "bg-amber-400/10" : "bg-blue-400/10"}`}>
          <Icon name={icon} size={20} className={isAmber ? "text-amber-400" : "text-blue-400"} />
        </div>
        <span className={`font-body text-xs uppercase tracking-[0.3em] ${isAmber ? "text-amber-400/80" : "text-blue-400/80"}`}>
          {label}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display font-bold text-3xl md:text-4xl uppercase text-white mb-4">
        {title}
      </h3>

      {/* Description */}
      <p className="font-body text-white/55 leading-relaxed text-base mb-8">
        {description}
      </p>

      {/* Items */}
      <ul className="flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isAmber ? "bg-amber-400" : "bg-blue-400"}`} />
            <span className="font-body text-sm text-white/60 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Problem block ──────────────────────────────────────────────────────────
function ProblemItem({ icon, text, delay, inView }: { icon: string; text: string; delay: string; inView: boolean }) {
  return (
    <div
      className={`flex items-start gap-4 transition-all duration-700 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}
      style={{ transitionDelay: delay }}
    >
      <div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon name={icon} size={16} className="text-red-400" />
      </div>
      <p className="font-body text-white/60 leading-relaxed text-base">{text}</p>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────
export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const heroSection = useInView(0.1);
  const definitionsSection = useInView(0.1);
  const problemSection = useInView(0.15);
  const ctaSection = useInView(0.2);

  return (
    <div className="min-h-screen font-body" style={{ background: "#0A0A0A", color: "#fff" }}>

      {/* ── Noise texture overlay ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5"
        style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0.96) 0%, transparent 100%)" }}
      >
        <a href="/" className="font-display text-xl font-bold tracking-[0.15em] text-white uppercase">
          БАД<span className="text-amber-400"> vs </span>Лекарство
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          <a href="/" className="font-body text-sm text-white hover:text-amber-400 transition-colors duration-200 tracking-wide border-b border-amber-400/40 pb-0.5">
            Главная
          </a>
          <button
            onClick={() => navigate("/differences")}
            className="font-body text-sm text-white/50 hover:text-white transition-colors duration-200 tracking-wide"
          >
            Отличия
          </button>
        </div>

        <button
          onClick={() => navigate("/differences")}
          className="hidden md:flex items-center gap-2 bg-amber-400 text-black font-display text-sm font-semibold uppercase tracking-wider px-5 py-2.5 hover:bg-amber-300 transition-colors duration-200"
        >
          Сравнить
          <Icon name="ArrowRight" size={14} />
        </button>

        {/* Mobile burger */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "X" : "Menu"} size={24} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-coal-900 flex flex-col items-center justify-center gap-8">
          <a href="/" className="font-display text-3xl font-bold text-amber-400 uppercase tracking-widest" onClick={() => setMenuOpen(false)}>
            Главная
          </a>
          <button
            className="font-display text-3xl font-bold text-white uppercase tracking-widest"
            onClick={() => { navigate("/differences"); setMenuOpen(false); }}
          >
            Отличия
          </button>
          <button
            className="mt-4 bg-amber-400 text-black font-display text-sm font-semibold uppercase tracking-widest px-8 py-4"
            onClick={() => { navigate("/differences"); setMenuOpen(false); }}
          >
            Сравнить
          </button>
        </div>
      )}

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <div ref={heroSection.ref}>
        <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-28 pb-20 overflow-hidden">

          {/* Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 65%)" }}
          />
          {/* Accent lines */}
          <div className="absolute right-0 top-0 w-px h-full opacity-20"
            style={{ background: "linear-gradient(to bottom, transparent, #FBBF24 40%, transparent)" }} />

          <div className="relative max-w-5xl">
            {/* Tag */}
            <div
              className={`flex items-center gap-3 mb-8 transition-all duration-700 ${heroSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <div className="w-8 h-px bg-amber-400" />
              <span className="font-body text-xs text-amber-400/80 uppercase tracking-[0.3em]">Разбираемся вместе</span>
            </div>

            {/* Headline */}
            <h1
              className={`font-display font-black uppercase leading-[0.9] transition-all duration-700 delay-100 ${heroSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)" }}
            >
              БАД или<br />
              <span className="text-amber-400">лекарство?</span>
            </h1>

            {/* Subheadline */}
            <p
              className={`font-body mt-8 text-white/55 max-w-2xl leading-relaxed transition-all duration-700 delay-200 ${heroSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}
            >
              Многие путают биологически активные добавки с лекарственными препаратами — и это может стоить здоровья. 
              Разберёмся, что есть что, почему граница размыта и как не ошибиться при выборе.
            </p>

            {/* CTA buttons */}
            <div
              className={`mt-10 flex flex-wrap items-center gap-5 transition-all duration-700 delay-300 ${heroSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <button
                onClick={() => navigate("/differences")}
                className="group flex items-center gap-3 bg-amber-400 text-black font-display font-semibold uppercase tracking-widest text-sm px-8 py-4 hover:bg-amber-300 transition-all duration-200"
              >
                Смотреть отличия
                <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <a
                href="#definitions"
                className="flex items-center gap-3 border border-white/20 text-white font-display font-medium uppercase tracking-widest text-sm px-8 py-4 hover:border-white/50 transition-all duration-200"
              >
                Читать ниже
              </a>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
            <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
            <span className="font-body text-[10px] text-white/50 uppercase tracking-[0.3em]">Scroll</span>
          </div>
        </section>
      </div>

      {/* ── DEFINITIONS ─────────────────────────────────────────────────── */}
      <div id="definitions" ref={definitionsSection.ref}>
        <section className="px-6 md:px-12 py-24" style={{ background: "#111111" }}>
          <div className="max-w-6xl mx-auto">

            {/* Section header */}
            <div
              className={`mb-14 transition-all duration-700 ${definitionsSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-amber-400" />
                <span className="font-body text-xs text-amber-400/80 uppercase tracking-[0.3em]">Что есть что</span>
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl uppercase text-white">
                Определения
              </h2>
            </div>

            {/* Two cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard
                icon="Leaf"
                label="Биологически активная добавка"
                title="БАД"
                description="БАД — это концентрат природных или идентичных природным биологически активных веществ. Он предназначен для непосредственного приёма с пищей или введения в состав пищевых продуктов."
                items={[
                  "Не является лекарством по закону",
                  "Не требует клинических испытаний",
                  "Регистрируется как пищевой продукт",
                  "Не может лечить — только дополнять питание",
                  "Продаётся без рецепта, часто в продуктовых магазинах",
                ]}
                color="amber"
                delay="0s"
                inView={definitionsSection.inView}
              />
              <InfoCard
                icon="Pill"
                label="Лекарственный препарат"
                title="Лекарство"
                description="Лекарственный препарат — вещество или комбинация веществ, предназначенных для лечения, профилактики или диагностики заболеваний. Применяется по медицинским показаниям."
                items={[
                  "Проходит клинические испытания (I–III фазы)",
                  "Имеет доказанную эффективность и безопасность",
                  "Регистрируется Минздравом как препарат",
                  "Чётко описанные показания и противопоказания",
                  "Может продаваться только по рецепту или без — по решению регулятора",
                ]}
                color="blue"
                delay="0.15s"
                inView={definitionsSection.inView}
              />
            </div>
          </div>
        </section>
      </div>

      {/* ── PROBLEM ─────────────────────────────────────────────────────── */}
      <div ref={problemSection.ref}>
        <section className="px-6 md:px-12 py-24 relative overflow-hidden">

          {/* Big bg text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
            <span
              className="font-display font-black uppercase text-white/[0.025] whitespace-nowrap"
              style={{ fontSize: "clamp(5rem, 18vw, 16rem)" }}
            >
              ПРОБЛЕМА
            </span>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Header */}
            <div
              className={`mb-14 transition-all duration-700 ${problemSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-red-400" />
                <span className="font-body text-xs text-red-400/80 uppercase tracking-[0.3em]">Почему это важно</span>
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl uppercase text-white">
                В чём <span className="text-red-400">проблема</span>?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-start">
              {/* Left: problems list */}
              <div className="flex flex-col gap-7">
                <ProblemItem
                  icon="AlertTriangle"
                  text="Производители БАДов используют медицинские термины («лечит», «восстанавливает», «устраняет») в рекламе, хотя это законодательно запрещено. Покупатели принимают добавку за лекарство."
                  delay="0s"
                  inView={problemSection.inView}
                />
                <ProblemItem
                  icon="Package"
                  text="Упаковка БАДов часто выглядит как у лекарств: те же капсулы, блистеры, инструкции с «показаниями». Визуально отличить без знания закона почти невозможно."
                  delay="0.1s"
                  inView={problemSection.inView}
                />
                <ProblemItem
                  icon="FlaskConical"
                  text="БАД не обязан проходить клинические испытания. Его состав и реальное действие никем не проверяются так же строго, как у лекарства. Эффективность может быть не доказана."
                  delay="0.2s"
                  inView={problemSection.inView}
                />
                <ProblemItem
                  icon="HeartPulse"
                  text="Люди заменяют назначенные врачом лекарства БАДами, считая их «натуральными и безвредными». Это приводит к ухудшению состояния и запущенным болезням."
                  delay="0.3s"
                  inView={problemSection.inView}
                />
                <ProblemItem
                  icon="ShoppingCart"
                  text="Рынок БАДов в России — сотни миллиардов рублей в год. Часть продуктов продаётся под видом лекарств через аптеки, что усиливает путаницу у потребителей."
                  delay="0.4s"
                  inView={problemSection.inView}
                />
              </div>

              {/* Right: key insight card */}
              <div
                className={`transition-all duration-700 delay-300 ${problemSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <div className="border border-red-400/20 bg-red-500/5 p-8 md:p-10 relative">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-400 to-transparent" />

                  <div className="flex items-center gap-3 mb-6">
                    <Icon name="Info" size={18} className="text-red-400" />
                    <span className="font-body text-xs text-red-400/80 uppercase tracking-[0.3em]">Главное различие</span>
                  </div>

                  <p className="font-body text-white/80 leading-relaxed text-base mb-6">
                    Ключевое юридическое различие: <span className="text-white font-semibold">лекарство обязано доказать эффективность</span>, 
                    прежде чем попасть на прилавок. БАД — нет.
                  </p>

                  <div className="border-t border-white/10 pt-6">
                    <p className="font-body text-white/50 text-sm leading-relaxed">
                      Это не значит, что все БАДы бесполезны. Некоторые добавки (витамин D, омега-3, фолиевая кислота) 
                      имеют хорошую доказательную базу. Но их эффективность подтверждена независимыми исследованиями, 
                      а не только производителем.
                    </p>
                  </div>

                  <div className="mt-8 border-t border-white/10 pt-6">
                    <p className="font-body text-xs text-white/30 uppercase tracking-widest mb-3">Запомните правило</p>
                    <p className="font-display text-xl font-bold text-white uppercase">
                      «Натуральный» <span className="text-red-400">≠</span> безопасный
                    </p>
                    <p className="font-display text-xl font-bold text-white uppercase mt-1">
                      «Без рецепта» <span className="text-red-400">≠</span> лекарство
                    </p>
                  </div>
                </div>

                {/* Статистика */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="border border-white/10 bg-coal-800 p-5 text-center">
                    <div className="font-display text-4xl font-bold text-amber-400">70%</div>
                    <div className="font-body text-xs text-white/40 mt-1 uppercase tracking-wider">россиян принимают<br />БАДы регулярно</div>
                  </div>
                  <div className="border border-white/10 bg-coal-800 p-5 text-center">
                    <div className="font-display text-4xl font-bold text-red-400">~40%</div>
                    <div className="font-body text-xs text-white/40 mt-1 uppercase tracking-wider">из них думают,<br />что это лекарства</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <div ref={ctaSection.ref}>
        <section className="relative px-6 md:px-12 py-28 overflow-hidden" style={{ background: "#111111" }}>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
            <span
              className="font-display font-bold uppercase text-white/[0.02] whitespace-nowrap"
              style={{ fontSize: "clamp(6rem, 20vw, 18rem)" }}
            >
              ДАЛЬШЕ
            </span>
          </div>

          <div className="relative max-w-3xl mx-auto text-center">
            <div
              className={`flex items-center justify-center gap-3 mb-8 transition-all duration-700 ${ctaSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <div className="w-8 h-px bg-amber-400" />
              <span className="font-body text-xs text-amber-400/80 uppercase tracking-[0.3em]">Хочу знать больше</span>
              <div className="w-8 h-px bg-amber-400" />
            </div>

            <h2
              className={`font-display font-bold uppercase text-white transition-all duration-700 delay-100 mb-6 ${ctaSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)", lineHeight: 1 }}
            >
              Посмотрите <span className="text-amber-400">конкретные</span><br />отличия
            </h2>

            <p
              className={`font-body text-white/50 text-base leading-relaxed mb-10 transition-all duration-700 delay-200 ${ctaSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              На следующей странице — подробное сравнение по ключевым критериям: 
              регистрация, контроль качества, состав, реклама и реальные примеры.
            </p>

            <button
              onClick={() => navigate("/differences")}
              className={`group flex items-center gap-3 bg-amber-400 text-black font-display font-semibold uppercase tracking-widest text-sm px-10 py-5 hover:bg-amber-300 transition-all duration-200 mx-auto ${ctaSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} transition-all duration-700 delay-300`}
            >
              Перейти к отличиям
              <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </section>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="px-6 md:px-12 py-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-display text-sm text-white/20 uppercase tracking-widest">
          БАД<span className="text-amber-400/40"> vs </span>Лекарство
        </span>
        <span className="font-body text-xs text-white/20">
          Информационный ресурс — не медицинская консультация
        </span>
      </footer>
    </div>
  );
}
