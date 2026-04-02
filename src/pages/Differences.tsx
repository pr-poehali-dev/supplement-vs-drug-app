import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

// ─── Intersection observer hook ────────────────────────────────────────────
function useInView(threshold = 0.15) {
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

// ─── Types ──────────────────────────────────────────────────────────────────
interface CompareRow {
  criterion: string;
  icon: string;
  bad: string;
  drug: string;
  badNegative?: boolean; // true = красный для БАД, false = зелёный
}

interface ExampleCard {
  name: string;
  type: "bad" | "drug";
  description: string;
  marker: string;
  claim: string;
  verdict: string;
}

// ─── Compare table row ──────────────────────────────────────────────────────
function CompareItem({
  row,
  index,
  inView,
}: {
  row: CompareRow;
  index: number;
  inView: boolean;
}) {
  const delay = `${index * 0.08}s`;
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1.5fr] gap-0 border-b border-white/5 last:border-0 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{ transitionDelay: delay }}
    >
      {/* Criterion */}
      <div className="flex items-center gap-3 py-5 px-6 bg-coal-800 border-b md:border-b-0 md:border-r border-white/5">
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
          <Icon name={row.icon} size={15} className="text-white/50" />
        </div>
        <span className="font-display text-sm font-semibold uppercase tracking-wide text-white/70">
          {row.criterion}
        </span>
      </div>

      {/* БАД */}
      <div className={`py-5 px-6 border-b md:border-b-0 md:border-r border-white/5 ${row.badNegative ? "bg-red-500/5" : "bg-green-500/5"}`}>
        <div className="flex items-start gap-2">
          <Icon
            name={row.badNegative ? "X" : "Check"}
            size={14}
            className={`mt-0.5 flex-shrink-0 ${row.badNegative ? "text-red-400" : "text-green-400"}`}
          />
          <span className="font-body text-sm text-white/70 leading-relaxed">{row.bad}</span>
        </div>
      </div>

      {/* Лекарство */}
      <div className={`py-5 px-6 ${!row.badNegative ? "bg-red-500/5" : "bg-green-500/5"}`}>
        <div className="flex items-start gap-2">
          <Icon
            name={!row.badNegative ? "X" : "Check"}
            size={14}
            className={`mt-0.5 flex-shrink-0 ${!row.badNegative ? "text-red-400" : "text-green-400"}`}
          />
          <span className="font-body text-sm text-white/70 leading-relaxed">{row.drug}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Example card ───────────────────────────────────────────────────────────
function ExCard({ card, delay, inView }: { card: ExampleCard; delay: string; inView: boolean }) {
  const isBad = card.type === "bad";
  return (
    <div
      className={`relative border p-6 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        ${isBad ? "border-amber-400/20 bg-amber-400/5" : "border-blue-400/20 bg-blue-400/5"}`}
      style={{ transitionDelay: delay }}
    >
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${isBad ? "bg-amber-400" : "bg-blue-400"}`} />

      {/* Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`font-body text-[10px] uppercase tracking-[0.25em] px-2.5 py-1 font-medium
          ${isBad ? "bg-amber-400/15 text-amber-400" : "bg-blue-400/15 text-blue-400"}`}>
          {isBad ? "БАД" : "Лекарство"}
        </span>
      </div>

      {/* Name */}
      <h4 className="font-display font-bold text-xl uppercase text-white mb-2">{card.name}</h4>

      {/* Description */}
      <p className="font-body text-sm text-white/55 leading-relaxed mb-5">{card.description}</p>

      {/* Marker */}
      <div className="border-t border-white/10 pt-4 mb-3">
        <div className="flex items-start gap-2 mb-2">
          <Icon name="Tag" size={13} className="text-white/30 mt-0.5 flex-shrink-0" />
          <span className="font-body text-xs text-white/40 uppercase tracking-wider">Как определить на упаковке</span>
        </div>
        <p className="font-body text-sm text-white/65">{card.marker}</p>
      </div>

      {/* Claim */}
      <div className="flex items-start gap-2 mb-4">
        <Icon name="MessageSquare" size={13} className="text-white/30 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-body text-xs text-white/40 uppercase tracking-wider">Типичный рекламный посыл: </span>
          <span className="font-body text-sm text-white/65 italic">«{card.claim}»</span>
        </div>
      </div>

      {/* Verdict */}
      <div className={`flex items-start gap-2 p-3 rounded-sm ${isBad ? "bg-amber-400/10" : "bg-blue-400/10"}`}>
        <Icon name="Info" size={13} className={`mt-0.5 flex-shrink-0 ${isBad ? "text-amber-400" : "text-blue-400"}`} />
        <span className="font-body text-xs text-white/60 leading-relaxed">{card.verdict}</span>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────
export default function Differences() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const headerSection = useInView(0.1);
  const tableSection = useInView(0.05);
  const examplesSection = useInView(0.05);
  const tipsSection = useInView(0.1);

  const compareRows: CompareRow[] = [
    {
      criterion: "Регистрация",
      icon: "FileText",
      bad: "Регистрируется как пищевой продукт в Роспотребнадзоре. Процедура упрощённая — декларирование состава.",
      drug: "Регистрируется как лекарственный препарат в Минздраве. Требует полного досье с данными испытаний.",
      badNegative: true,
    },
    {
      criterion: "Клинические испытания",
      icon: "FlaskConical",
      bad: "Не требуются. Производитель не обязан доказывать эффективность на пациентах.",
      drug: "Обязательны: I–III фазы испытаний на тысячах добровольцев. Занимают 7–15 лет.",
      badNegative: true,
    },
    {
      criterion: "Контроль качества",
      icon: "ShieldCheck",
      bad: "Проверяется состав на безопасность, но не на эффективность. Содержание активных веществ может варьироваться.",
      drug: "Строгий фармацевтический контроль: каждая серия проверяется на соответствие стандарту качества GMP.",
      badNegative: true,
    },
    {
      criterion: "Показания",
      icon: "Stethoscope",
      bad: "Нет медицинских показаний. Только «для дополнительного обогащения рациона».",
      drug: "Чёткие показания: при каком диагнозе, в какой дозировке, каким курсом.",
      badNegative: true,
    },
    {
      criterion: "Противопоказания",
      icon: "Ban",
      bad: "Могут быть указаны минимально или отсутствовать. Это не означает полную безопасность.",
      drug: "Подробный список: беременность, возраст, сопутствующие болезни, лекарственные взаимодействия.",
      badNegative: true,
    },
    {
      criterion: "Реклама",
      icon: "Megaphone",
      bad: "Запрещено говорить «лечит», но часто используют обходные формулировки: «поддерживает», «нормализует».",
      drug: "Реклама строго регулируется: обязателен текст «есть противопоказания, проконсультируйтесь с врачом».",
      badNegative: true,
    },
    {
      criterion: "Дозировка",
      icon: "Syringe",
      bad: "Доза условная. Производитель сам определяет «рекомендуемое количество» без клинического обоснования.",
      drug: "Терапевтическая доза рассчитана в ходе испытаний и является частью медицинской инструкции.",
      badNegative: true,
    },
    {
      criterion: "Маркировка",
      icon: "Tag",
      bad: "На упаковке должно быть написано «Не является лекарственным средством» — но мелким шрифтом.",
      drug: "Обязателен регистрационный номер ЛП (лекарственного препарата) и штрих-код маркировки «Честный знак».",
      badNegative: true,
    },
    {
      criterion: "Ответственность",
      icon: "Scale",
      bad: "Производитель отвечает только за безопасность состава, но не за заявленное действие.",
      drug: "Производитель несёт полную ответственность за эффективность и безопасность, указанные в инструкции.",
      badNegative: true,
    },
  ];

  const examples: ExampleCard[] = [
    {
      name: "Омега-3 «Турбофиш»",
      type: "bad",
      description: "Капсулы рыбьего жира в красивой упаковке с рисунком сердца. Продаётся в аптеке рядом с лекарствами.",
      marker: "На обороте мелким шрифтом: «БАД. Не является лекарством». Регистрационный номер начинается с «RU.»",
      claim: "Улучшает работу сердца, снижает холестерин, защищает сосуды",
      verdict: "Омега-3 может быть полезна, но конкретный продукт не обязан доказывать эти эффекты. Клинически доказана польза только рецептурных препаратов омега-3 в высоких дозах.",
    },
    {
      name: "Розувастатин 10 мг",
      type: "drug",
      description: "Таблетки для снижения холестерина. Отпускается по рецепту врача.",
      marker: "На упаковке: регистрационный номер ЛП-000000, QR-код «Честного знака», инструкция с показаниями.",
      claim: "Снижает уровень «плохого» холестерина ЛПНП на 45–55%",
      verdict: "Эффект подтверждён в крупных рандомизированных исследованиях (JUPITER, ASTEROID). Назначается кардиологом по показаниям анализов.",
    },
    {
      name: "Иммунал Плюс",
      type: "bad",
      description: "Таблетки с эхинацеей и витаминами «для поддержки иммунитета». Яркая упаковка с щитом и звёздочками.",
      marker: "На упаковке нет регистрационного номера ЛП. Есть плашка «Свидетельство о государственной регистрации» — это регистрация БАД, не лекарства.",
      claim: "Повышает иммунитет, защищает от простуды и гриппа, восстанавливает защитные силы",
      verdict: "Эхинацея имеет ограниченные данные по снижению длительности ОРВИ, но «повышение иммунитета» — не медицинский термин. БАД не может заменить вакцинацию или лечение.",
    },
    {
      name: "Осельтамивир (Тамифлю)",
      type: "drug",
      description: "Противовирусный препарат для лечения и профилактики гриппа типов A и B.",
      marker: "Регистрационный номер ЛП-002209. Отпускается по рецепту. Полная инструкция с противопоказаниями.",
      claim: "Сокращает длительность гриппа на 1–2 дня при приёме в первые 48 часов",
      verdict: "Зарегистрирован ВОЗ как препарат для лечения гриппа. Включён в перечень жизненно необходимых и важнейших лекарственных препаратов РФ.",
    },
    {
      name: "Коллаген «Молодость»",
      type: "bad",
      description: "Порошок или капсулы с морским коллагеном, биотином и витамином С. Позиционируется как средство для кожи.",
      marker: "Регистрация по СанПиН как пищевой продукт. Нет номера ЛП. Продаётся в косметических и продуктовых магазинах.",
      claim: "Восстанавливает кожу изнутри, разглаживает морщины, укрепляет суставы и волосы",
      verdict: "Коллаген из пищи расщепляется до аминокислот и не встраивается в кожу целиком. Клинических доказательств системного эффекта у большинства таких добавок нет.",
    },
    {
      name: "Третиноин 0,025% крем",
      type: "drug",
      description: "Местный ретиноид для лечения акне и фотостарения. Отпускается по рецепту дерматолога.",
      marker: "Регистрационный номер. Рецептурный препарат. Инструкция с указанием противопоказаний (беременность, чувствительная кожа).",
      claim: "Уменьшает морщины и улучшает текстуру кожи",
      verdict: "Доказанная эффективность в десятках рандомизированных исследований. Является «золотым стандартом» в дерматологии для лечения акне и фотостарения.",
    },
  ];

  const tips = [
    {
      icon: "Search",
      title: "Найдите регистрационный номер",
      text: "Лекарство имеет номер вида «ЛП-XXXXXX» или «ЛС-XXXXXX». БАД — «RU.XXXXX» или другой формат. Проверьте на grls.rosminzdrav.ru",
    },
    {
      icon: "FileText",
      title: "Прочитайте мелкий шрифт",
      text: "По закону на упаковке БАД должно быть написано «Не является лекарственным средством». Ищите эту фразу, даже если упаковка выглядит как у лекарства.",
    },
    {
      icon: "Stethoscope",
      title: "Спросите врача",
      text: "Если вам что-то рекомендуют «вместо» прописанного лекарства — это повод насторожиться. Хороший специалист объяснит, зачем именно этот препарат.",
    },
    {
      icon: "ShieldAlert",
      title: "Не заменяйте лечение добавками",
      text: "Приём БАД не отменяет необходимость лечения диагностированного заболевания. Добавка дополняет рацион, но не лечит болезнь.",
    },
  ];

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
          <button
            onClick={() => navigate("/")}
            className="font-body text-sm text-white/50 hover:text-white transition-colors duration-200 tracking-wide"
          >
            Главная
          </button>
          <a href="/differences" className="font-body text-sm text-white hover:text-amber-400 transition-colors duration-200 tracking-wide border-b border-amber-400/40 pb-0.5">
            Отличия
          </a>
        </div>

        <button
          onClick={() => navigate("/")}
          className="hidden md:flex items-center gap-2 border border-white/20 text-white font-display text-sm font-semibold uppercase tracking-wider px-5 py-2.5 hover:border-white/50 transition-colors duration-200"
        >
          <Icon name="ArrowLeft" size={14} />
          Назад
        </button>

        {/* Mobile burger */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "X" : "Menu"} size={24} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-coal-900 flex flex-col items-center justify-center gap-8">
          <button
            className="font-display text-3xl font-bold text-white uppercase tracking-widest"
            onClick={() => { navigate("/"); setMenuOpen(false); }}
          >
            Главная
          </button>
          <a href="/differences" className="font-display text-3xl font-bold text-amber-400 uppercase tracking-widest" onClick={() => setMenuOpen(false)}>
            Отличия
          </a>
        </div>
      )}

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div ref={headerSection.ref}>
        <section className="relative px-6 md:px-12 pt-32 pb-20 overflow-hidden">

          {/* Glow */}
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 65%)", transform: "translate(30%, -30%)" }}
          />

          <div className="max-w-5xl relative">
            <div className={`flex items-center gap-3 mb-6 transition-all duration-700 ${headerSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <div className="w-8 h-px bg-amber-400" />
              <span className="font-body text-xs text-amber-400/80 uppercase tracking-[0.3em]">Подробный разбор</span>
            </div>
            <h1
              className={`font-display font-black uppercase leading-[0.9] mb-8 transition-all duration-700 delay-100 ${headerSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ fontSize: "clamp(2.5rem, 8vw, 6.5rem)" }}
            >
              Отличия <span className="text-amber-400">БАД</span><br />от <span className="text-blue-400">лекарства</span>
            </h1>
            <p className={`font-body text-white/50 max-w-2xl leading-relaxed text-base transition-all duration-700 delay-200 ${headerSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              Девять ключевых критериев, по которым биологически активные добавки 
              принципиально отличаются от лекарственных препаратов, — и реальные примеры из аптек.
            </p>
          </div>
        </section>
      </div>

      {/* ── COMPARISON TABLE ─────────────────────────────────────────────── */}
      <div ref={tableSection.ref}>
        <section className="px-6 md:px-12 py-20" style={{ background: "#111111" }}>
          <div className="max-w-6xl mx-auto">

            {/* Table header */}
            <div
              className={`grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1.5fr] gap-0 mb-1 transition-all duration-700 ${tableSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <div className="hidden md:flex items-center px-6 py-4 bg-white/5">
                <span className="font-body text-xs text-white/30 uppercase tracking-[0.3em]">Критерий</span>
              </div>
              <div className="hidden md:flex items-center gap-2 px-6 py-4 bg-amber-400/10 border-l border-white/5">
                <Icon name="Leaf" size={14} className="text-amber-400" />
                <span className="font-body text-xs text-amber-400 uppercase tracking-[0.3em] font-medium">БАД</span>
              </div>
              <div className="hidden md:flex items-center gap-2 px-6 py-4 bg-blue-400/10 border-l border-white/5">
                <Icon name="Pill" size={14} className="text-blue-400" />
                <span className="font-body text-xs text-blue-400 uppercase tracking-[0.3em] font-medium">Лекарство</span>
              </div>
            </div>

            {/* Rows */}
            <div className="border border-white/5">
              {compareRows.map((row, i) => (
                <CompareItem key={row.criterion} row={row} index={i} inView={tableSection.inView} />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── EXAMPLES ────────────────────────────────────────────────────── */}
      <div ref={examplesSection.ref}>
        <section className="px-6 md:px-12 py-24">
          <div className="max-w-6xl mx-auto">

            <div className={`mb-14 transition-all duration-700 ${examplesSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-amber-400" />
                <span className="font-body text-xs text-amber-400/80 uppercase tracking-[0.3em]">Реальные примеры</span>
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl uppercase text-white mb-4">
                Что есть в аптеке
              </h2>
              <p className="font-body text-white/50 text-base max-w-2xl leading-relaxed">
                Рассмотрим конкретные продукты из аптек — как отличить БАД от лекарства по упаковке 
                и что на самом деле говорит наука об их эффективности.
              </p>
            </div>

            {/* Cards grid: alternating bad/drug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {examples.map((card, i) => (
                <ExCard key={card.name} card={card} delay={`${(i % 2) * 0.12}s`} inView={examplesSection.inView} />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── TIPS ────────────────────────────────────────────────────────── */}
      <div ref={tipsSection.ref}>
        <section className="px-6 md:px-12 py-24" style={{ background: "#111111" }}>
          <div className="max-w-6xl mx-auto">

            <div className={`mb-14 transition-all duration-700 ${tipsSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-green-400" />
                <span className="font-body text-xs text-green-400/80 uppercase tracking-[0.3em]">Как не ошибиться</span>
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl uppercase text-white">
                Практические <span className="text-green-400">советы</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tips.map((tip, i) => (
                <div
                  key={tip.title}
                  className={`border border-white/10 bg-coal-800 p-7 transition-all duration-700 ${tipsSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-400/10 flex items-center justify-center flex-shrink-0">
                      <Icon name={tip.icon} size={18} className="text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-base uppercase tracking-wide text-white mb-2">
                        {tip.title}
                      </h4>
                      <p className="font-body text-sm text-white/55 leading-relaxed">{tip.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom disclaimer */}
            <div
              className={`mt-10 border border-white/10 p-6 flex items-start gap-4 transition-all duration-700 delay-500 ${tipsSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <Icon name="AlertCircle" size={18} className="text-white/30 flex-shrink-0 mt-0.5" />
              <p className="font-body text-sm text-white/35 leading-relaxed">
                <strong className="text-white/50">Дисклеймер:</strong> Этот сайт носит исключительно информационный характер и не является медицинской консультацией. 
                Перед применением любых препаратов или добавок проконсультируйтесь с врачом.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ── BACK BUTTON ─────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-16 text-center">
        <button
          onClick={() => navigate("/")}
          className="group inline-flex items-center gap-3 border border-white/15 text-white/60 font-display text-sm font-semibold uppercase tracking-widest px-8 py-4 hover:border-white/40 hover:text-white transition-all duration-200"
        >
          <Icon name="ArrowLeft" size={14} className="group-hover:-translate-x-1 transition-transform duration-200" />
          Вернуться на главную
        </button>
      </section>

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
