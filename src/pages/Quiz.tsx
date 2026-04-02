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
interface QuizProduct {
  id: number;
  name: string;
  type: "bad" | "drug";
  short_description: string;
  composition: string;
  hint: string;
  image_url: string;
  category: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────
const PRODUCTS: QuizProduct[] = [
  {
    id: 1,
    name: "Омега-3 «Турбофиш»",
    type: "bad",
    short_description: "Капсулы рыбьего жира в красивой упаковке с рисунком сердца. Продаётся в аптеке рядом с лекарствами. Обещает улучшить работу сердца и снизить холестерин.",
    composition: "Рыбий жир (ЭПК 180 мг, ДГК 120 мг), желатин, глицерин, вода. 60 капсул по 1000 мг.",
    hint: "На обороте мелким шрифтом: «БАД. Не является лекарством». Регистрационный номер начинается с «RU.», а не с «ЛП-».",
    image_url: "https://cdn.poehali.dev/projects/6e5b068a-931e-4599-9770-086a9e438d5a/files/f4df5fc5-0d31-4d85-b913-162569d3903d.jpg",
    category: "Сердечно-сосудистое",
  },
  {
    id: 2,
    name: "Розувастатин 10 мг",
    type: "drug",
    short_description: "Таблетки для снижения холестерина. Отпускается строго по рецепту врача. Снижает уровень «плохого» холестерина ЛПНП на 45–55%.",
    composition: "Розувастатин кальция 10,4 мг (эквивалентно розувастатину 10 мг), микрокристаллическая целлюлоза, лактозы моногидрат, повидон К30.",
    hint: "Регистрационный номер ЛП-002012. Отпускается по рецепту. Есть QR-код «Честного знака» и подробная инструкция с противопоказаниями.",
    image_url: "https://cdn.poehali.dev/projects/6e5b068a-931e-4599-9770-086a9e438d5a/files/3a6800ca-3aa8-414d-ace0-01140e3b50d5.jpg",
    category: "Сердечно-сосудистое",
  },
  {
    id: 3,
    name: "Иммунал Плюс",
    type: "bad",
    short_description: "Таблетки с эхинацеей и витаминами «для поддержки иммунитета». Яркая упаковка с щитом и звёздочками. Продаётся без рецепта.",
    composition: "Экстракт эхинацеи пурпурной 80 мг, витамин С 60 мг, цинк 5 мг, вспомогательные вещества.",
    hint: "На упаковке есть «Свидетельство о государственной регистрации» — это регистрация БАД в Роспотребнадзоре, не лекарства в Минздраве.",
    image_url: "https://cdn.poehali.dev/projects/6e5b068a-931e-4599-9770-086a9e438d5a/files/52d98dba-98db-45ea-9d59-916f4183d75f.jpg",
    category: "Иммунитет",
  },
  {
    id: 4,
    name: "Осельтамивир (Тамифлю)",
    type: "drug",
    short_description: "Противовирусный препарат для лечения и профилактики гриппа типов A и B. Сокращает длительность болезни при приёме в первые 48 часов.",
    composition: "Осельтамивира фосфат 98,5 мг (эквивалентно осельтамивиру 75 мг), прежелатинизированный крахмал, повидон, кросскармеллоза натрия.",
    hint: "Регистрационный номер ЛП-002209. Рецептурный препарат. Включён в перечень ЖНВЛП РФ и список основных лекарств ВОЗ.",
    image_url: "https://cdn.poehali.dev/projects/6e5b068a-931e-4599-9770-086a9e438d5a/files/3656def8-6462-45b5-b87e-ba2d2fd032e0.jpg",
    category: "Противовирусное",
  },
  {
    id: 5,
    name: "Коллаген «Молодость»",
    type: "bad",
    short_description: "Порошок с морским коллагеном, биотином и витамином С. Позиционируется как средство «для красоты кожи изнутри».",
    composition: "Гидролизат коллагена морского 5000 мг, биотин 50 мкг, витамин С 80 мг, ароматизатор «Лесные ягоды».",
    hint: "Регистрация по СанПиН как пищевой продукт. Нет номера ЛП. Продаётся в косметических и продуктовых магазинах, не только в аптеках.",
    image_url: "https://cdn.poehali.dev/projects/6e5b068a-931e-4599-9770-086a9e438d5a/files/3bb3135c-bec4-4593-b135-82e2e31c3f7d.jpg",
    category: "Красота и кожа",
  },
  {
    id: 6,
    name: "Третиноин 0,025% крем",
    type: "drug",
    short_description: "Местный ретиноид для лечения акне и фотостарения. «Золотой стандарт» дерматологии. Отпускается только по рецепту дерматолога.",
    composition: "Третиноин 0,025%, полисорбат 80, стеариловый спирт, цетиловый спирт, стеарат глицерина, вазелиновое масло.",
    hint: "Регистрационный номер. Рецептурный препарат (Rx). Инструкция содержит противопоказания: беременность, кормление грудью, фотосенсибилизация.",
    image_url: "https://cdn.poehali.dev/projects/6e5b068a-931e-4599-9770-086a9e438d5a/files/721b9d09-b35a-4c1a-b119-6a4753524bea.jpg",
    category: "Дерматология",
  },
  {
    id: 7,
    name: "Магний B6",
    type: "bad",
    short_description: "Таблетки с магнием и витамином B6 «для нервной системы и снятия стресса». Один из самых популярных БАД в аптеках.",
    composition: "Магния оксид 400 мг (эквивалентно Mg 240 мг), витамин B6 (пиридоксина гидрохлорид) 2 мг, стеарат кальция.",
    hint: "Несмотря на то что продаётся в аптеке — это БАД. Нет регистрационного номера ЛП. Производитель не обязан доказывать эффективность клинически.",
    image_url: "https://cdn.poehali.dev/projects/6e5b068a-931e-4599-9770-086a9e438d5a/files/94f30296-27e0-4aa2-963a-7fe62c6e98d6.jpg",
    category: "Нервная система",
  },
  {
    id: 8,
    name: "Мексидол 125 мг",
    type: "drug",
    short_description: "Таблетки с антиоксидантным и ноотропным действием. Назначается неврологами при нарушениях мозгового кровообращения.",
    composition: "Этилметилгидроксипиридина сукцинат 125 мг, лактоза, повидон, магния стеарат, гипромеллоза, полисорбат.",
    hint: "Регистрационный номер ЛП-001053. Рецептурный препарат. В инструкции указаны показания, дозировки и список нежелательных реакций.",
    image_url: "https://cdn.poehali.dev/projects/6e5b068a-931e-4599-9770-086a9e438d5a/files/64310a3c-e066-4291-894c-cf54611742ca.jpg",
    category: "Нервная система",
  },
  {
    id: 9,
    name: "Витамин D3 2000 МЕ",
    type: "bad",
    short_description: "Масляные капли или капсулы с витамином D3. Широко рекламируются для «укрепления иммунитета, костей и настроения».",
    composition: "Холекальциферол (витамин D3) 2000 МЕ, масло оливковое рафинированное, желатин, глицерин.",
    hint: "Большинство форм витамина D3 — БАД. Исключение: препараты с номером ЛП (например, Аквадетрим) — это уже лекарства. Разница в требованиях к качеству.",
    image_url: "https://cdn.poehali.dev/projects/6e5b068a-931e-4599-9770-086a9e438d5a/files/e0e81d5c-0870-4030-b023-0c42933ac945.jpg",
    category: "Витамины",
  },
  {
    id: 10,
    name: "Аквадетрим (Витамин D3)",
    type: "drug",
    short_description: "Водный раствор витамина D3 для лечения рахита, остеопороза и гипопаратиреоза. Назначается по анализу крови.",
    composition: "Холекальциферол 15000 МЕ/мл (500 МЕ/капля), макрогола глицерилрицинолеат, сахароза, лимонная кислота, анисовый ароматизатор.",
    hint: "Регистрационный номер ЛП-000792. Продаётся без рецепта, но является лекарством. Имеет чёткие показания и противопоказания в инструкции.",
    image_url: "https://cdn.poehali.dev/projects/6e5b068a-931e-4599-9770-086a9e438d5a/files/c1978c22-fe0a-4c19-8594-0779f3ac7af3.jpg",
    category: "Витамины",
  },
];

// ─── Shuffle array ───────────────────────────────────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Result screen ───────────────────────────────────────────────────────────
function ResultScreen({
  score,
  total,
  onRestart,
}: {
  score: number;
  total: number;
  onRestart: () => void;
}) {
  const pct = Math.round((score / total) * 100);
  const isExpert = pct >= 80;
  const isGood = pct >= 60;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="w-24 h-24 rounded-full flex items-center justify-center mb-8 border-2"
        style={{
          borderColor: isExpert ? "#4ade80" : isGood ? "#fbbf24" : "#f87171",
          background: isExpert ? "rgba(74,222,128,0.1)" : isGood ? "rgba(251,191,36,0.1)" : "rgba(248,113,113,0.1)"
        }}>
        <Icon
          name={isExpert ? "Trophy" : isGood ? "Star" : "RefreshCw"}
          size={40}
          className={isExpert ? "text-green-400" : isGood ? "text-amber-400" : "text-red-400"}
        />
      </div>

      <div className="font-display font-black uppercase text-6xl mb-2" style={{
        color: isExpert ? "#4ade80" : isGood ? "#fbbf24" : "#f87171"
      }}>
        {score}/{total}
      </div>
      <div className="font-body text-white/40 text-sm uppercase tracking-widest mb-6">{pct}% правильных ответов</div>

      <h2 className="font-display font-bold text-2xl uppercase text-white mb-3">
        {isExpert ? "Вы настоящий эксперт!" : isGood ? "Хороший результат!" : "Есть куда расти"}
      </h2>
      <p className="font-body text-white/50 max-w-sm leading-relaxed mb-10">
        {isExpert
          ? "Вы отлично разбираетесь в отличиях БАД от лекарств. Поделитесь знаниями с близкими!"
          : isGood
          ? "Вы неплохо знаете тему. Изучите страницу с подробными отличиями, чтобы узнать больше."
          : "Не расстраивайтесь! Прочитайте раздел с отличиями — это важно для здоровья."}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 border border-amber-400/40 text-amber-400 font-display text-sm font-semibold uppercase tracking-wider px-6 py-3 hover:border-amber-400 hover:bg-amber-400/10 transition-all duration-200"
        >
          <Icon name="RefreshCw" size={14} />
          Пройти ещё раз
        </button>
        <a
          href="/differences"
          className="flex items-center justify-center gap-2 border border-white/20 text-white font-display text-sm font-semibold uppercase tracking-wider px-6 py-3 hover:border-white/50 transition-all duration-200"
        >
          <Icon name="BookOpen" size={14} />
          Читать про отличия
        </a>
      </div>
    </div>
  );
}

// ─── Quiz card ───────────────────────────────────────────────────────────────
function QuizCard({
  product,
  questionIndex,
  total,
  onAnswer,
}: {
  product: QuizProduct;
  questionIndex: number;
  total: number;
  onAnswer: (correct: boolean) => void;
}) {
  const [answered, setAnswered] = useState<"bad" | "drug" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const isCorrect = answered === product.type;

  const handleAnswer = (choice: "bad" | "drug") => {
    if (answered) return;
    setAnswered(choice);
  };

  const handleNext = () => {
    onAnswer(isCorrect);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${((questionIndex) / total) * 100}%` }}
          />
        </div>
        <span className="font-body text-xs text-white/40 uppercase tracking-widest whitespace-nowrap">
          {questionIndex + 1} / {total}
        </span>
      </div>

      {/* Card */}
      <div className="relative border border-white/10 bg-coal-800 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 via-blue-400 to-amber-400 opacity-40" />

        {/* Image */}
        <div className="relative h-64 overflow-hidden bg-coal-700">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {/* Category badge */}
          <div className="absolute top-4 right-4">
            <span className="font-body text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 bg-black/60 text-white/60 backdrop-blur-sm">
              {product.category}
            </span>
          </div>
          {/* Blur overlay if answered */}
          {!answered && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
          )}
          {answered && (
            <div className={`absolute inset-0 flex items-center justify-center ${isCorrect ? "bg-green-500/20" : "bg-red-500/20"}`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 ${isCorrect ? "border-green-400 bg-green-500/30" : "border-red-400 bg-red-500/30"}`}>
                <Icon name={isCorrect ? "Check" : "X"} size={36} className={isCorrect ? "text-green-400" : "text-red-400"} />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="font-display font-black text-2xl uppercase text-white mb-3">{product.name}</h2>

          {/* Description */}
          <p className="font-body text-sm text-white/60 leading-relaxed mb-5">{product.short_description}</p>

          {/* Composition */}
          <div className="border border-white/8 bg-white/3 p-4 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="FlaskConical" size={12} className="text-white/30" />
              <span className="font-body text-[10px] text-white/40 uppercase tracking-widest">Состав</span>
            </div>
            <p className="font-body text-sm text-white/55 leading-relaxed">{product.composition}</p>
          </div>

          {/* Hint button (only before answer) */}
          {!answered && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors duration-200 font-body text-xs uppercase tracking-wider mb-5"
            >
              <Icon name={showHint ? "EyeOff" : "Eye"} size={13} />
              {showHint ? "Скрыть подсказку" : "Показать подсказку"}
            </button>
          )}

          {showHint && !answered && (
            <div className="flex items-start gap-3 p-4 border border-amber-400/20 bg-amber-400/5 mb-5">
              <Icon name="Lightbulb" size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="font-body text-sm text-white/60 leading-relaxed">{product.hint}</p>
            </div>
          )}

          {/* Answer reveal */}
          {answered && (
            <div className={`p-4 mb-5 border ${isCorrect ? "border-green-400/30 bg-green-400/8" : "border-red-400/30 bg-red-400/8"}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon name={isCorrect ? "CheckCircle2" : "XCircle"} size={14} className={isCorrect ? "text-green-400" : "text-red-400"} />
                <span className={`font-body text-xs uppercase tracking-wider font-medium ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                  {isCorrect ? "Правильно!" : `Неверно — это ${product.type === "bad" ? "БАД" : "лекарство"}`}
                </span>
              </div>
              <p className="font-body text-sm text-white/60 leading-relaxed">{product.hint}</p>
            </div>
          )}

          {/* Buttons */}
          {!answered ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleAnswer("bad")}
                className="flex items-center justify-center gap-2 border border-amber-400/40 text-amber-400 font-display text-sm font-semibold uppercase tracking-wider px-4 py-4 hover:border-amber-400 hover:bg-amber-400/15 transition-all duration-200 active:scale-95"
              >
                <Icon name="Leaf" size={15} />
                БАД
              </button>
              <button
                onClick={() => handleAnswer("drug")}
                className="flex items-center justify-center gap-2 border border-blue-400/40 text-blue-400 font-display text-sm font-semibold uppercase tracking-wider px-4 py-4 hover:border-blue-400 hover:bg-blue-400/15 transition-all duration-200 active:scale-95"
              >
                <Icon name="Pill" size={15} />
                Лекарство
              </button>
            </div>
          ) : (
            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 border border-white/20 text-white font-display text-sm font-semibold uppercase tracking-wider px-4 py-4 hover:border-white/50 hover:bg-white/5 transition-all duration-200"
            >
              {questionIndex + 1 < total ? (
                <>
                  Следующий вопрос
                  <Icon name="ArrowRight" size={14} />
                </>
              ) : (
                <>
                  Посмотреть результат
                  <Icon name="Trophy" size={14} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────
export default function Quiz() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [gameState, setGameState] = useState<"start" | "playing" | "finished">("start");
  const [questions, setQuestions] = useState<QuizProduct[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  const headerSection = useInView(0.1);

  const startGame = () => {
    const shuffled = shuffleArray(PRODUCTS);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setGameState("playing");
  };

  const handleAnswer = (correct: boolean) => {
    const newScore = correct ? score + 1 : score;
    setScore(newScore);
    if (currentIndex + 1 >= questions.length) {
      setGameState("finished");
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRestart = () => {
    setGameState("start");
  };

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
          <a href="/differences" className="font-body text-sm text-white/50 hover:text-white transition-colors duration-200 tracking-wide">
            Отличия
          </a>
          <a href="/quiz" className="font-body text-sm text-white hover:text-amber-400 transition-colors duration-200 tracking-wide border-b border-amber-400/40 pb-0.5">
            Викторина
          </a>
        </div>

        <button
          onClick={() => navigate(-1)}
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
          <a href="/differences" className="font-display text-3xl font-bold text-white/60 uppercase tracking-widest" onClick={() => setMenuOpen(false)}>
            Отличия
          </a>
          <a href="/quiz" className="font-display text-3xl font-bold text-amber-400 uppercase tracking-widest" onClick={() => setMenuOpen(false)}>
            Викторина
          </a>
        </div>
      )}

      {/* ── CONTENT ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 px-6 md:px-12 pt-28 pb-20">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div ref={headerSection.ref}>
            {gameState === "start" && (
              <div className="text-center mb-16">
                <div className={`flex items-center justify-center gap-3 mb-6 transition-all duration-700 ${headerSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                  <div className="w-8 h-px bg-amber-400" />
                  <span className="font-body text-xs text-amber-400/80 uppercase tracking-[0.3em]">Тест на знания</span>
                  <div className="w-8 h-px bg-amber-400" />
                </div>
                <h1
                  className={`font-display font-black uppercase leading-[0.9] mb-8 transition-all duration-700 delay-100 ${headerSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
                >
                  Угадай:<br />
                  <span className="text-amber-400">БАД</span> или{" "}
                  <span className="text-blue-400">лекарство</span>?
                </h1>
                <p className={`font-body text-white/50 max-w-xl mx-auto leading-relaxed text-base mb-10 transition-all duration-700 delay-200 ${headerSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                  10 реальных препаратов из аптеки. Фото, описание и состав — определите по ним, что перед вами.
                </p>

                {/* Stats */}
                <div className={`flex items-center justify-center gap-8 mb-12 transition-all duration-700 delay-300 ${headerSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                  {[
                    { icon: "Package", value: "10", label: "Препаратов" },
                    { icon: "FlaskConical", value: "Состав", label: "Показан" },
                    { icon: "Trophy", value: "Счёт", label: "Итоговый" },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col items-center gap-1">
                      <Icon name={s.icon} size={18} className="text-amber-400 mb-1" />
                      <span className="font-display font-bold text-lg text-white uppercase">{s.value}</span>
                      <span className="font-body text-xs text-white/30 uppercase tracking-wider">{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Start button */}
                <button
                  onClick={startGame}
                  className={`inline-flex items-center gap-3 bg-amber-400 text-black font-display font-bold text-sm uppercase tracking-[0.15em] px-10 py-4 hover:bg-amber-300 transition-all duration-200 active:scale-95 transition-all duration-700 delay-400 ${headerSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                >
                  <Icon name="Play" size={16} />
                  Начать викторину
                </button>

                {/* Preview grid */}
                <div className={`mt-16 grid grid-cols-2 md:grid-cols-5 gap-3 transition-all duration-700 delay-500 ${headerSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                  {PRODUCTS.map((p) => (
                    <div key={p.id} className="relative aspect-square overflow-hidden border border-white/10 group">
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <span className={`inline-block font-body text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 ${p.type === "bad" ? "bg-amber-400/80 text-black" : "bg-blue-400/80 text-black"}`}>
                          ?
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Playing state */}
          {gameState === "playing" && questions.length > 0 && (
            <QuizCard
              key={currentIndex}
              product={questions[currentIndex]}
              questionIndex={currentIndex}
              total={questions.length}
              onAnswer={handleAnswer}
            />
          )}

          {/* Finished state */}
          {gameState === "finished" && (
            <ResultScreen
              score={score}
              total={questions.length}
              onRestart={handleRestart}
            />
          )}
        </div>
      </div>
    </div>
  );
}
