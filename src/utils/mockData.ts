import {
  PlatformStats,
  VentureTrack,
  PortfolioStartup,
  TeamCard,
  EcosystemMember,
  Testimonial,
  FAQItem,
} from "../types";

export const platformStats: PlatformStats = {
  venturesBuilt: 258,
  capitalRaised: "$52M+",
  foundersNetwork: "12,400+",
  diplomaHours: "120 ساعات",
};

export const ventureTracks: VentureTrack[] = [
  {
    id: "ideation",
    title: "01. أطروحة اليوم صفر وتوافق الشركاء المؤسسين",
    desc: "تشكيل ثنائيات مؤسسين عالية الأداء، والتحقق من فرص التكنولوجيا العميقة والسوق، وتشكيل أطروحات المشاريع الابتكارية.",
    icon: "Lightbulb",
    badge: "المرحلة 01",
    status: "الدفعة نشطة",
  },
  {
    id: "validation",
    title: "02. المنتج الأولي والتحقق من العملاء",
    desc: "بناء نماذج أولية وظيفية، وتنفيذ عقود التجربة الأولى، والتكرار بناءً على حلقات تغذية راجعة حقيقية من العملاء.",
    icon: "Rocket",
    badge: "المرحلة 02",
    status: "نموذج المسرّع",
  },
  {
    id: "investment",
    title: "03. الاستثمار الأولي وتوفير رأس المال",
    desc: "تأمين شيك حصة أولي بقيمة 250,000$+ من TimeValley Capital مع وصول مباشر لشركاء رأس المال الجريء العالمي.",
    icon: "TrendingUp",
    badge: "المرحلة 03",
    status: "جاهز للتمويل",
  },
];

export const portfolioStartups: PortfolioStartup[] = [
  {
    name: "AetherAI Engine",
    category: "الذكاء الاصطناعي للمؤسسات",
    desc: "منصة تجميع الوكلاء المستقلين لنماذج تقييم مخاطر رأس المال الجريء.",
    raised: "$3.2M جولة أولية",
    valuation: "$18M تقييم",
    logo: "Brain",
  },
  {
    name: "OmniChain Logistics",
    category: "التكنولوجيا المالية / سلاسل الإمداد",
    desc: "منصة تمويل تجاري غير مركزية تخفض زمن التسوية عبر الحدود بنسبة 90%.",
    raised: "$1.8M تمويل ما قبل الأولي",
    valuation: "$12M تقييم",
    logo: "Layers",
  },
  {
    name: "Verdant Energy Matrix",
    category: "تكنولوجيا المناخ والطاقة",
    desc: "برمجيات موازنة الشبكات الكهربائية الذكية باستخدام أصول البطاريات الشمسية الموزعة.",
    raised: "$4.5M جولة أولية",
    valuation: "$24M تقييم",
    logo: "Leaf",
  },
];

export const recruitingTeams: TeamCard[] = [
  {
    id: "team-1",
    name: "Project Chronos AI",
    sector: "التكنولوجيا المالية وتقييم المخاطر",
    founder: "د. فاطمة الحسن",
    openRoles: ["شريك مؤسس تقني / CTO", "تسويق النمو"],
    equity: "25% - 40% حصة الملكية",
    desc: "بناء محرك تقييم المخاطر المستقل لتقييم الائتمان عبر الحدود.",
    status: "التوظيف نشط",
  },
  {
    id: "team-2",
    name: "BioPulse Longevity",
    sector: "التكنولوجيا الحيوية والطبية",
    founder: "طارق المنصور",
    openRoles: ["مطور مطور شامل (Full-Stack)", "مسؤول التشريعات"],
    equity: "20% - 35% حصة الملكية",
    desc: "منصة للتحقق من بيانات التجارب السريرية مدعومة من TimeValley Studio.",
    status: "التوظيف نشط",
  },
];

export const ecosystemMembers: EcosystemMember[] = [
  {
    name: "فاطمة الحسن",
    role: "مؤسسة متسلسلة وباحثة ذكاء اصطناعي",
    location: "مركز دبي",
    expertise: ["تعلم الآلة", "إستراتيجية المنتج", "تجهيز الجولة أ"],
    avatar: "/images/arabic-woman-1.png",
    badge: "موجه خبير",
  },
  {
    name: "طارق المنصور",
    role: "CTO سابق في شركة تكنولوجيا مالية",
    location: "مركز الرياض",
    expertise: ["الأنظمة الموزعة", "معمارية السحابة", "الأمان الرقمي"],
    avatar: "/images/arabic-man-1.png",
    badge: "مؤسس",
  },
  {
    name: "عائشة المنصور",
    role: "شريكة استثمار في TimeValley Capital",
    location: "مركز دبي",
    expertise: ["صفقات المراحل الأولى", "إستراتيجية السوق", "التوسع الخليجي"],
    avatar: "/images/arabic-woman-2.png",
    badge: "مستثمر",
  },
  {
    name: "عمر الفارسي",
    role: "رئيس قسم الهندسة في Cloud Scale",
    location: "مركز أبوظبي",
    expertise: ["الأنظمة الموحدة", "DevOps", "البلوكشين"],
    avatar: "/images/arabic-man-2.png",
    badge: "مهندس",
  },
  {
    name: "ليلى الكعبي",
    role: "مديرة تسريع المشاريع الناشئة",
    location: "مركز الدوحة",
    expertise: ["حلقات النمو", "إدارة جدول الملكية", "تدريب العروض"],
    avatar: "/images/arabic-woman-3.png",
    badge: "قائدة المسرّع",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "جون ميشيل",
    role: "الرئيس التنفيذي والشريك المؤسس، FinPay AI",
    img: "/images/arabic-man-1.png",
    quote:
      '"الانضمام إلى TimeValley كان التحول الحقيقي لشركتنا الناشئة. من المطابقة الذكية للشركاء المؤسسين إلى بناء هيكل الملكية والوصول المباشر للمستثمرين، حققنا في 3 أشهر ما يستغرق عامين."',
  },
  {
    name: "د. ليلى هاشم",
    role: "الشريكة المؤسسة والمديرة الطبية، HealthPulse AI",
    img: "/images/arabic-woman-1.png",
    quote:
      '"كانت دورات التعاقد المستشفي تستغرق أكثر من 9 أشهر. من خلال أدلة تسريع السوق وشبكة الشركاء في TimeValley، نشرنا نظامنا في 45 مركزًا صحيًا في وقت قياسي."',
  },
  {
    name: "عمر فاروق",
    role: "المستشار التقني والمؤسس المشارك، LogiTrack SaaS",
    img: "/images/arabic-man-2.png",
    quote:
      '"من اليوم صفر وحتى إغلاق الجولة الاستثمارية الأولى، وفرت لنا TimeValley الرافعة الإستراتيجية والدعم الفني اللازم للتوسع الإقليمي."',
  },
];

export const faqs: FAQItem[] = [
  {
    q: "ما هي مدة والالتزام المطلوب لدبلومة TimeValley؟",
    a: "تتكون دبلومة رئيس مهندسي المشاريع Flagship من 120 ساعة من التعلم التطبيقي، تشمل جلسات توجيه حية، وسباقات التحقق من الفرضيات، ومراجعات العروض أمام المستثمرين.",
  },
  {
    q: "كيف تحمي منصة التشغيل المرئي Bunny Stream المحتوى التعليمي؟",
    a: "تتم حماية جميع الدروس عبر تشفير شبكة توصيل المحتوى (CDN)، وتحديد عدد الأجهزة المسموح بها، وسرعات تشغيل متكيفة، واستئناف التشغيل التلقائي من آخر نقطة.",
  },
  {
    q: "كيف تعمل ميزة بناء فريقك الخاص (Build Your Own Team)؟",
    a: "يمكن للمؤسسين نشر الوظائف المتاحة للشركاء المؤسسين، وتحديد نسب حصص الملكية (مثلاً 20%-40%)، وفحص المتقدمين مباشرة من خلال شبكة مجتمع TimeValley الموثوقة.",
  },
  {
    q: "ما هي طرق الدفع المدعومة للاشتراك في الدبلومة؟",
    a: "ندعم فيزا، ماستركارد، فوري (مصر)، مدى (السعودية)، والمحافظ الإلكترونية المحلية عبر تكاملات الدفع الرقمية الأحدث.",
  },
];
