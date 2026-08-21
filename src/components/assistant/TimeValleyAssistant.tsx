"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface ActionLink {
  label: string;
  url: string;
  icon?: string;
}

interface Message {
  id: string;
  sender: "assistant" | "user";
  text: string;
  category?: string;
  actionLinks?: ActionLink[];
  suggestedFaqs?: string[];
  timestamp: string;
}

const QUICK_TOPICS = {
  ar: [
    {
      id: "diploma",
      label: "🎓 دبلومة 120 ساعة",
      query: "ما هي دبلومة Venture Architect المعتمدة (120 ساعة)؟",
    },
    {
      id: "cofounder",
      label: "🤝 مطابقة المؤسسين",
      query: "كيف يعمل نظام مطابقة الشركاء المؤسسين والـ CTO؟",
    },
    {
      id: "investment",
      label: "💰 تمويل Pre-Seed",
      query: "كيف يمكنني التقديم على الاستثمار المبدئي (Pre-Seed)؟",
    },
    {
      id: "advisory",
      label: "💬 استشارات د. وائل",
      query: "ما هي الاستشارات الريادية التي تقدمها TimeValley؟",
    },
    {
      id: "verify",
      label: "📜 توثيق الشهادات",
      query: "كيف يتم التحقق من الشهادات الصادرة من المنصة؟",
    },
    {
      id: "ideation",
      label: "💡 دراسة السوق والأفكار",
      query: "كيف تعمل أدوات توليد الأفكار ودراسة السوق؟",
    },
    {
      id: "contact",
      label: "✉️ تواصل معنا",
      query: "كيف يمكنني التواصل مع إدارة TimeValley وإرسال استفسار؟",
    },
  ],
  en: [
    {
      id: "diploma",
      label: "🎓 120h Diploma",
      query: "What is the Venture Architect & Founder Diploma?",
    },
    {
      id: "cofounder",
      label: "🤝 Co-Founders & CTOs",
      query: "How does Co-Founder & CTO Matching work?",
    },
    {
      id: "investment",
      label: "💰 Pre-Seed Funding",
      query: "How do I apply for Pre-Seed Investment?",
    },
    {
      id: "advisory",
      label: "💬 Dr. Wael Advisory",
      query: "What Strategic Advisory services do you offer?",
    },
    {
      id: "verify",
      label: "📜 Verify Credentials",
      query: "How do employers verify TimeValley Certificates?",
    },
    {
      id: "ideation",
      label: "💡 Market & Ideation",
      query: "How does the Ideation & Market Research Engine work?",
    },
    {
      id: "contact",
      label: "✉️ Contact Us",
      query: "How do I contact TimeValley and submit an inquiry?",
    },
  ],
};

const LOCAL_FALLBACK_ANSWERS: Record<
  string,
  Record<
    string,
    {
      reply: string;
      links: ActionLink[];
      category: string;
      keywords: string[];
      followUps?: string[];
    }
  >
> = {
  ar: {
    diploma: {
      category: "الدبلومات والأكاديمية",
      reply:
        "دبلومة Venture Architect & Founder هي برنامج تدريبي مكثف واحترافي يمتد لـ 120 ساعة موزعة على 40 وحدة تعليمية عبر 5 مراحل رئيسية:\n\n• **مراحل المساق**: التحقق من الفكرة، هندسة وتصميم المنتجات الرقمية، المالية وهياكل الملكية (Cap Tables)، النمو السريع، والتوسع.\n• **شهادة معتمدة وموثقة رقمياً**: إتمام أكثر من 90% يمنحك شهادة معتمدة بكود تحقق تشفيري عالمي.\n• **مخرجات عملية حقيقية**: إعداد العرض التقديمي (Pitch Deck)، النماذج المالية، وبناء النموذج الأولي (MVP).\n• **منصة LMS متطورة**: مشغل فيديو HLS عالي السرعة، اختبارات تفاعلية، ومتابعة دقيقة لمسار تقدمك.",
      links: [
        { label: "استعراض مساق الدبلومة", url: "/diplomas", icon: "🎓" },
        { label: "بدء التعلم والتسجيل", url: "/register", icon: "🚀" },
      ],
      keywords: [
        "دبلوم", "دبلومة", "كورس", "كورسات", "تعليم", "دراسة", "وحدات", "مراحل",
        "120", "ساعة", "منهج", "شهادة", "lms", "فيديو", "محاضرات", "اختبار"
      ],
      followUps: [
        "كيف يتم التحقق من صحة الشهادات المعتمدة؟",
        "كيف أقدم على تمويل واستثمار Pre-Seed؟",
        "كيف يعمل نظام مطابقة الشركاء والـ CTO؟",
      ],
    },
    cofounder: {
      category: "مطابقة المؤسسين",
      reply:
        "يقوم نظام TimeValley لمطابقة المؤسسين بربط الرؤساء التنفيذيين للتقنية (CTOs) وخبراء المنتجات وقادة النمو قبل تأسيس الشركات رسمياً.\n\n• **خوارزميات التوافق الريادي**: مطابقة الكفاءات بناءً على تكامل المهارات التقنية والريادية والخبرات السوقية.\n• **هيكلة الحصص والملكية العادلة**: نماذج قانونية قياسية لعقود التأسيس وجداول التملك (Cap Tables) وحصص الاستحقاق (Vesting).\n• **كفاءات معتمدة ومفحوصة**: نخبة من أفضل المطورين وقادة المنتجات في الشرق الأوسط والعالم.",
      links: [
        { label: "استكشاف مطابقة الشركاء", url: "/teams", icon: "🤝" },
        { label: "كوّن فريقك الريادي", url: "/#founder-matching", icon: "🚀" },
      ],
      keywords: [
        "شريك", "مؤسس", "مؤسسين", "cto", "تقني", "مطابقة", "فريق", "كوادر",
        "حصص", "ملكية", "عقود", "مبرمج", "مطور", "شراكة"
      ],
      followUps: [
        "كيف تقدم على تمويل Pre-Seed للشركات الناشئة؟",
        "ما هي دبلومة Venture Architect المعتمدة؟",
        "كيف تحجز جلسة استشارية مع د. وائل؟",
      ],
    },
    investment: {
      category: "الاستثمار المبدئي",
      reply:
        "توفر TimeValley جولات استثمار مبدئي تتراوح بين 50,000$ إلى 250,000$ للشركات التقنية الواعدة المنطلقة من منظومتنا.\n\n• **شبكة استثمارية واسعة**: ربط مباشر مع صناديق رأس المال الجريء (VCs) والمستثمرين الملائكيين لجولات Series A.\n• **دعم متكامل (Venture Builder)**: دعم تقني، قانوني، تسويقي، واستراتيجي مرافق لضخ رأس المال.\n• **تقييم سريع**: مراجعة خطة العمل وأطروحة المشروع خلال 5 أيام عمل فقط.",
      links: [
        { label: "تقديم عرض المشروع", url: "/founder", icon: "💰" },
        { label: "قصص النجاح والمحفظة", url: "/#portfolio", icon: "📊" },
      ],
      keywords: [
        "استثمار", "تمويل", "فلوس", "رأس مال", "مستثمر", "مستثمرين", "pre-seed",
        "عرض", "pitch", "صناديق", "vc", "دولار", "50000", "250000"
      ],
      followUps: [
        "ما هي جلسات الاستشارة الاستراتيجية مع د. وائل؟",
        "كيف يعمل نظام مطابقة الشركاء والـ CTO؟",
        "كيف أحسب حجم السوق TAM SAM SOM؟",
      ],
    },
    advisory: {
      category: "الاستشارات الاستراتيجية",
      reply:
        "نقدم جلسات استشارية استراتيجية متخصصة ومباشرة بقيادة د. وائل ونخبة من مهندسي المشاريع:\n\n• **مواضيع الاستشارات**: التحقق من ملاءمة المنتج للسوق (Product-Market Fit)، تسعير الخدمات، هندسة استراتيجيات الانطلاق (GTM).\n• **جلسات 1-on-1 مخصصة**: تدقيق عروض المستثمرين، خطط التمويل، وهندسة الحصص وجداول التملك.\n• **حجز مرن وفوري**: اختيار موعد الاستشارة المناسب وتأكيده عبر التقويم المباشر.",
      links: [
        { label: "حجز جلسة استشارية", url: "/consultations", icon: "💬" },
        { label: "نبذة عن المؤسس د. وائل", url: "/founder", icon: "👔" },
      ],
      keywords: [
        "استشارة", "استشارات", "وائل", "دكتور وائل", "جلسة", "توجيه", "ارشاد",
        "اجتماع", "نصيحة", "استراتيجي", "حجز استشارة"
      ],
      followUps: [
        "كيف أقدم على تمويل واستثمار Pre-Seed؟",
        "كيف تعمل مصفوفة الأفكار الذكية؟",
        "ما هي دبلومة الـ 120 ساعة؟",
      ],
    },
    ideation: {
      category: "أدوات ريادة الأعمال",
      reply:
        "مصفوفة الأفكار هي أداة ذكية متطورة من TimeValley لتوليد أطروحات المشاريع والتحقق من جدواها:\n\n• **التحقق من المشكلة والحل**: تحليل الفرضيات مقابل احتياجات السوق وسلوك العملاء الفعلي.\n• **تحليل الميزة التنافسية**: تقييم قوة الحصانة الدفاعية (Moat) واقتصاديات الوحدة.\n• **تصدير الأطروحة**: تحويل الفكرة إلى وثيقة تنفيذية جاهزة للبدء في البناء.",
      links: [
        { label: "تشغيل مصفوفة الأفكار", url: "/ideation", icon: "💡" },
        { label: "حاسبة حجم السوق", url: "/market-research", icon: "📊" },
      ],
      keywords: [
        "فكرة", "افكار", "مصفوفة", "اطروحة", "تحقق", "توليد", "ذكاء اصطناعي",
        "مشروع", "ابتكار", "ادوات", "matrix"
      ],
      followUps: [
        "كيف أحسب حجم السوق TAM / SAM / SOM؟",
        "ما هي دبلومة Venture Architect المعتمدة؟",
        "كيف يعمل نظام مطابقة الشركاء؟",
      ],
    },
    market: {
      category: "أدوات ريادة الأعمال",
      reply:
        "توفر TimeValley محركاً تفاعلياً لدراسة السوق ونمذجة حجم الفرصة الاستثمارية:\n\n• **TAM (إجمالي السوق المحتمل)**: احتساب الحد الأقصى لحجم السوق عالمياً وإقليمياً.\n• **SAM (السوق المتاح للخدمة)**: الشريحة المستهدفة القابلة للوصول الجغرافي والقطاعي.\n• **SOM (السوق القابل للاستحواذ)**: الحصة السوقية الواقعية المتوقع الاستحواذ عليها خلال 3–5 سنوات.\n• **مؤشرات قطاعية**: بيانات مقارنة للتقنية المالية، SaaS، والتعليم الرقمي.",
      links: [
        { label: "فتح حاسبة حجم السوق", url: "/market-research", icon: "📊" },
        { label: "مصفوفة الأفكار", url: "/ideation", icon: "💡" },
      ],
      keywords: [
        "سوق", "حجم السوق", "tam", "sam", "som", "حاسبة", "دراسة", "مالية",
        "احصائيات", "تحليل", "تقييم"
      ],
      followUps: [
        "كيف أقدم على تمويل واستثمار Pre-Seed؟",
        "كيف تعمل مصفوفة الأفكار الذكية؟",
        "ما هي جلسات الاستشارة مع د. وائل؟",
      ],
    },
    verify: {
      category: "التحقق من الشهادات",
      reply:
        "تحتوي كل شهادة تخرج على كود تسلسلي مشفر فريد (مثل `TV-DIP-2026-XXXXXX`).\n\n• **تحقق فوري**: أدخل الكود في سجل التحقق المعتمد لعرض بيانات الخريج وتاريخ الإصدار والمهارات المعتمدة فوراً.\n• **موثوقية تامة**: حماية مشفرة تمنع أي تلاعب أو تزوير.\n• **اعتراف واسع**: معتمدة لدى صناديق الاستثمار الجريء والشركات التقنية الشريكة.",
      links: [
        { label: "سجل التحقق من الشهادات", url: "/our-certificates", icon: "📜" },
        { label: "استعراض الدبلومة", url: "/diplomas", icon: "🎓" },
      ],
      keywords: [
        "شهادة", "شهادات", "توثيق", "تحقق", "كود", "تسلسلي", "سجل", "باركود",
        "تشفير", "خريج", "معتمدة"
      ],
      followUps: [
        "ما هي دبلومة Venture Architect المعتمدة؟",
        "كيف يعمل نظام مطابقة الشركاء؟",
        "كيف أحجز استشارة مع د. وائل؟",
      ],
    },
    resources: {
      category: "مكتبة المحتوى",
      reply:
        "توفر مكتبة المحتوى أدلة ونماذج قانونية ومالية جاهزة للتحميل والاستخدام الفوري:\n\n• **عقود SAFE القياسية**: اتفاقيات الاستثمار البسيط للحصص المستقبلية.\n• **نماذج جداول التملك (Cap-Table Excel)**: ملفات إكسل ديناميكية لإدارة جولات التمويل وتوزيع الحصص.\n• **عروض المستثمرين (Pitch Decks)**: قوالب عرض احترافية معتمدة من أفضل صناديق الـ VC.\n• **أدلة إطلاق المنتجات (GTM)**: خطط تنفيذية متكاملة للانطلاق في السوق.",
      links: [
        { label: "تصفح مكتبة المحتوى", url: "/content-library", icon: "📚" },
        { label: "استعراض الدبلومات", url: "/diplomas", icon: "🎓" },
      ],
      keywords: [
        "مكتبة", "نماذج", "قوالب", "safe", "ملفات", "تحميل", "اكسل", "عقد",
        "عرض تقديمي", "pitch deck", "موارد", "ادلة"
      ],
      followUps: [
        "كيف أقدم على تمويل واستثمار Pre-Seed؟",
        "كيف يعمل نظام مطابقة الشركاء؟",
        "كيف تعمل مصفوفة الأفكار الذكية؟",
      ],
    },
    community: {
      category: "المجتمع والفعاليات",
      reply:
        "تربط TimeValley أكثر من 144 مركزاً بيئياً عالمياً بشبكة حصرية من المؤسسين والخبراء:\n\n• **حلقة المؤسسين (Founders Circle)**: قنوات تواصل خاصة لتبادل الخبرات والشراكات.\n• **أيام العروض (Demo Days)**: فعاليات دورية لعرض المشاريع أمام كبرى صناديق رأس المال الجريء.\n• **جلسات الماسترمايند**: لقاءات أسبوعية لحل التحديات التقنية والتشغيلية.\n• **مراكز عالمية**: شبكة تغطي الرياض، دبي، القاهرة، لندن، ووادي السيليكون.",
      links: [
        { label: "الانضمام لمجتمع المؤسسين", url: "/community", icon: "🌐" },
        { label: "استعراض الفعاليات الحية", url: "/events", icon: "📅" },
      ],
      keywords: [
        "مجتمع", "فعاليات", "فعالية", "لقاءات", "شبكة", "demo day", "مراكز",
        "مؤسسين", "اعضاء", "شبكة المؤسسين", "webinar"
      ],
      followUps: [
        "كيف يعمل نظام مطابقة الشركاء والـ CTO؟",
        "ما هي جلسات الاستشارة مع د. وائل؟",
        "كيف أقدم على تمويل Pre-Seed؟",
      ],
    },
    about: {
      category: "عن المنصة والمؤسس",
      reply:
        "TimeValley هي استوديو بناء شركات (Venture Studio) وأكاديمية متقدمة أسسها د. وائل لتغيير طريقة إطلاق وتوسيع الشركات التقنية:\n\n• **نموذج استوديو بناء الشركات**: تختلف TimeValley عن الحاضنات التقليدية بتقديم شراكة فعلية، بناء تقني مشترك، وضخ مالي مباشر.\n• **خبرة د. وائل**: رائد أعمال ومهندس مشاريع قاد العديد من الصفقات الاستثمارية وبرامج الاستشارات التنفيذية في المنطقة.",
      links: [
        { label: "نبذة عن المؤسس د. وائل", url: "/founder", icon: "👔" },
        { label: "عن منصة TimeValley", url: "/about", icon: "🏛️" },
      ],
      keywords: [
        "عن", "من نحن", "وائل", "دكتور وائل", "المؤسس", "فلسفة", "رؤية",
        "استوديو", "قصة", "من هو"
      ],
      followUps: [
        "ما هي جلسات الاستشارة مع د. وائل؟",
        "كيف أقدم على تمويل واستثمار Pre-Seed؟",
        "ما هي دبلومة الـ 120 ساعة؟",
      ],
    },
    pricing_account: {
      category: "الحسابات والتسجيل",
      reply:
        "التسجيل في TimeValley سلس ومباشر عبر بوابات آمنة ومساحات عمل مخصصة:\n\n• **دفع آمن**: دعم كامل للبطاقات الائتمانية، التحويلات البنكية، وأكواد الخصم والمنح.\n• **مساحة الطالب (Workspace)**: لوحة تحكم متطورة لمتابعة المحاضرات، حل الواجبات، ومراقبة مستوى الإنجاز.\n• **كوبونات ومنح دراسية**: إمكانية تطبيق كوبونات الخصم للمجموعات وبرامج الشراكات مباشرة في صفحة الدفع.",
      links: [
        { label: "إنشاء حساب جديد", url: "/register", icon: "🚀" },
        { label: "تسجيل الدخول", url: "/login", icon: "🔑" },
      ],
      keywords: [
        "تسجيل", "دخول", "حساب", "دفع", "سعر", "اسعار", "تكلفة", "شراء",
        "كوبون", "خصم", "مساحة", "workspace", "بطاقة", "checkout"
      ],
      followUps: [
        "ما هي دبلومة Venture Architect المعتمدة؟",
        "كيف يتم التحقق من الشهادات؟",
        "ما هي جلسات الاستشارة مع د. وائل؟",
      ],
    },
    contact: {
      category: "التواصل والدعم الفني",
      reply:
        "يمكنك التواصل مباشرة مع فريق إدارة TimeValley وقسم القبول عبر القنوات المعتمدة التالية:\n\n• **نموذج التواصل السريع**: إرسال استفسارك أو طلب الشراكة مباشرة عبر نموذج التواصل في الموقع الرسمي.\n• **البريد الإلكتروني المعتمد**: contact@timevalley.com (الرد خلال 24 ساعة عمل).\n• **حجز الاستشارات المباشرة**: حجز جلسة استراتيجية 1-on-1 مع د. وائل أو مهندسي المشاريع.\n• **المراكز الإقليمية**: شبكة مراكز بيئية تدعم رواد الأعمال في الرياض، دبي، القاهرة، ولندن.",
      links: [
        { label: "نموذج التواصل السريع", url: "/#contact", icon: "✉️" },
        { label: "حجز استشارة مباشرة", url: "/consultations", icon: "💬" },
        { label: "نبذة عن المؤسس د. وائل", url: "/founder", icon: "👔" },
      ],
      keywords: [
        "تواصل", "اتواصل", "اتصال", "تواصل معنا", "ارسال استفسار", "ارسال", "ارسل", "رسالة", "رساله",
        "ايميل", "بريد", "هاتف", "رقم", "دعم", "فني", "خدمة العملاء", "شكوى", "مساعدة", "استفسار",
        "ارسال رسالة", "مقر", "عنوان", "مكتب", "نموذج التواصل", "الادارة", "ادارة", "contact", "email"
      ],
      followUps: [
        "كيف أحجز استشارة 1-on-1 مع د. وائل؟",
        "كيف أقدم على تمويل واستثمار Pre-Seed؟",
        "ما هي دبلومة Venture Architect المعتمدة؟",
      ],
    },
    unknown: {
      category: "تنويه استفسار",
      reply:
        "عذراً، هذه المعلومة غير متوفرة حالياً في دليل منصة TimeValley.\n\nأنا متخصص في إرشادك حول جميع برامج وخدمات المنصة:\n• **الدبلومات المعتمدة (120 ساعة)**: برامج Venture Architect المعتمدة والموثقة.\n• **مطابقة المؤسسين والـ CTOs**: ربط الشركاء التقنيين والتنفيذيين قبل التأسيس.\n• **الاستثمار والتمويل الأولي**: تذاكر تمويل Pre-Seed من 50,000$ إلى 250,000$.\n• **الاستشارات الريادية وأدوات السوق**: جلسات استراتيجية مع د. وائل وحاسبات TAM/SAM ومصفوفة الأفكار.\n\nإذا كنت بحاجة لمعلومات مخصصة أو ترغب في التحدث مع فريق العمل، يسعدنا حجز استشارة مباشرة أو اختيار أحد الموضوعات أدناه.",
      links: [
        { label: "حجز استشارة ريادية", url: "/consultations", icon: "💬" },
        { label: "استكشاف الدبلومات", url: "/diplomas", icon: "🎓" },
        { label: "مطابقة الشركاء", url: "/teams", icon: "🤝" },
      ],
      keywords: [],
    },
  },
  en: {
    diploma: {
      category: "LMS & 120h Diploma",
      reply:
        "Our flagship 120h Diploma is an intensive masterclass curriculum designed alongside tier-1 venture partners.\n\n• **40 Comprehensive Units across 5 Phases**: Day-Zero Validation, Product Architecture, Venture Finance & Cap-Tables, Growth Engineering, and Scale.\n• **Accredited Verification**: Completing over 90% issues an officially accredited credential with cryptographic verification.\n• **Interactive Deliverables**: Build investor pitch decks, financial models, and functional MVPs.\n• **High-Performance LMS**: Integrated HLS video lectures, interactive unit quizzes, and student progress gating.",
      links: [
        { label: "Explore Diploma Curriculum", url: "/diplomas", icon: "🎓" },
        { label: "Enroll & Register", url: "/register", icon: "🚀" },
      ],
      keywords: [
        "diploma", "curriculum", "course", "courses", "learn", "study", "units", "phases",
        "lms", "120h", "120 hours", "syllabus", "lecture", "student", "video", "quiz"
      ],
      followUps: [
        "How do employers verify TimeValley Certificates?",
        "What topics are covered in the 5 Phases?",
        "How do I apply for Pre-Seed Investment?",
      ],
    },
    cofounder: {
      category: "Co-Founder Matching",
      reply:
        "TimeValley's Day-Zero Co-Founder Matching connects technical CTOs, domain product experts, and growth leads before company formation.\n\n• **Algorithmic Cohort Matching**: Pairs talent based on complementary skills, domain mastery, and shared vision.\n• **Equitable Cap-Table Frameworks**: Standardized vesting, dynamic founder equity splits, and reverse vesting terms.\n• **Vetted Talent Pool**: Deeply screened engineers and operators across MENA and global markets.\n• **Role Specializations**: Match with Chief Technology Officers, Product Heads, and Growth Strategists.",
      links: [
        { label: "Find Co-Founders & CTOs", url: "/teams", icon: "🤝" },
        { label: "Build Your Team", url: "/#founder-matching", icon: "🚀" },
      ],
      keywords: [
        "co-founder", "cofounder", "cto", "match", "matching", "team", "founder", "partner",
        "equity", "cap table", "vesting", "hire", "engineers", "developers"
      ],
      followUps: [
        "How do equity splits and vesting work?",
        "How do I apply for Pre-Seed Investment?",
        "What is the Venture Architect Diploma?",
      ],
    },
    investment: {
      category: "Pre-Seed Investment",
      reply:
        "TimeValley provides pre-seed capital equity checks ranging from $50,000 to $250,000 for high-potential tech ventures built within our ecosystem.\n\n• **Direct Access**: Direct syndication with regional Series A VCs and angel networks.\n• **Venture Builder Support**: Full product, legal, financial, and go-to-market backing alongside capital.\n• **Fast Evaluation**: Submissions undergo rapid thesis review within 5 business days.\n• **Co-Investment**: Seamless co-investment syndicate structures with top institutional investors.",
      links: [
        { label: "Submit Venture Pitch", url: "/founder", icon: "💰" },
        { label: "View Portfolio Cases", url: "/#portfolio", icon: "📊" },
      ],
      keywords: [
        "invest", "investment", "fund", "funding", "capital", "pre-seed", "seed", "pitch",
        "venture capital", "vc", "angel", "$50k", "$250k", "equity check", "money"
      ],
      followUps: [
        "What Strategic Advisory services do you offer?",
        "How does Co-Founder Matching work?",
        "How do I calculate market size (TAM/SAM)?",
      ],
    },
    advisory: {
      category: "Strategic Advisory",
      reply:
        "We provide bespoke advisory for founders and startups led by Dr. Wael and senior venture architects.\n\n• **Strategy Sessions**: ICP validation, Unit Economics & pricing modeling, Go-to-Market sprint execution.\n• **1-on-1 Consultations**: Direct tactical advisory on fundraising strategy, pitch deck audits, and tech architecture.\n• **Flexible Scheduling**: Book direct 30m or 60m private strategy slots with integrated calendar booking.",
      links: [
        { label: "Book 1-on-1 Consultation", url: "/consultations", icon: "💬" },
        { label: "Meet Founder Dr. Wael", url: "/founder", icon: "👔" },
      ],
      keywords: [
        "advisory", "consultation", "consult", "consulting", "wael", "dr wael", "meeting",
        "mentor", "mentorship", "strategy", "tactical", "advice", "book consultation"
      ],
      followUps: [
        "How do I apply for Pre-Seed Investment?",
        "What is the Ideation Matrix tool?",
        "What is the Venture Architect Diploma?",
      ],
    },
    ideation: {
      category: "Venture Tools",
      reply:
        "The Ideation Matrix is TimeValley's proprietary AI-assisted thesis generation and problem-validation engine.\n\n• **Problem-Solution Validator**: Analyzes startup hypotheses against market trends and customer friction points.\n• **Defensibility Analysis**: Evaluates moat strength, network effects, and unit economics feasibility.\n• **Instant Thesis Export**: Converts generated venture ideas into structured executive concept briefs.",
      links: [
        { label: "Launch Ideation Matrix", url: "/ideation", icon: "💡" },
        { label: "TAM/SAM/SOM Calculator", url: "/market-research", icon: "📊" },
      ],
      keywords: [
        "idea", "ideation", "matrix", "thesis", "validate", "validation", "generator",
        "problem solution", "concept", "tools", "ai tool"
      ],
      followUps: [
        "How do I calculate TAM / SAM / SOM market size?",
        "What is the 120h Venture Architect Diploma?",
        "How does Co-Founder Matching work?",
      ],
    },
    market: {
      category: "Venture Tools",
      reply:
        "TimeValley provides an interactive Market Research Engine with bottom-up and top-down market sizing calculators:\n\n• **TAM (Total Addressable Market)**: Global market ceiling calculation.\n• **SAM (Serviceable Addressable Market)**: Regional and segment targeted volume.\n• **SOM (Serviceable Obtainable Market)**: Realistic capture share within 3–5 years.\n• **Sector Telemetry**: Real-time benchmarks for FinTech, SaaS, EdTech, and HealthTech.",
      links: [
        { label: "Open Market Sizing Tool", url: "/market-research", icon: "📊" },
        { label: "Ideation Matrix", url: "/ideation", icon: "💡" },
      ],
      keywords: [
        "market", "tam", "sam", "som", "calculator", "research", "sizing", "market size",
        "financial model", "telemetry", "benchmarks", "analysis"
      ],
      followUps: [
        "How do I apply for Pre-Seed Investment?",
        "How does the AI Ideation Matrix work?",
        "What Strategic Advisory services do you offer?",
      ],
    },
    verify: {
      category: "Credential Verification",
      reply:
        "Every graduate certificate carries a unique cryptographic serial code (e.g., `TV-DIP-2026-XXXXXX`).\n\n• **Instant Verification**: Enter the code into our public registry to inspect student name, issue date, credential authenticity, and validated skills.\n• **Tamper-Proof**: Backed by secure cryptographic hash generation that cannot be forged.\n• **Global Recognition**: Accepted by partner venture funds, tech enterprises, and accelerator networks.",
      links: [
        { label: "Verify Certificate Registry", url: "/our-certificates", icon: "📜" },
        { label: "Explore Diplomas", url: "/diplomas", icon: "🎓" },
      ],
      keywords: [
        "verify", "verification", "certificate", "credential", "serial", "code", "tv-dip",
        "blockchain", "authenticated", "check certificate", "employer"
      ],
      followUps: [
        "What is the Venture Architect Diploma?",
        "How does Co-Founder Matching work?",
        "How to book a consultation with Dr. Wael?",
      ],
    },
    resources: {
      category: "Content Library",
      reply:
        "The Content Library provides verified venture playbooks and legal blueprints ready for immediate use:\n\n• **Legal Blueprint SAFEs**: Standardized Simple Agreements for Future Equity & Term Sheets.\n• **Cap-Table Financial Models**: Dynamic Excel spreadsheets for multi-round founder equity dilution.\n• **Investor Pitch Decks**: Tier-1 VC pitch frameworks with high-conversion slide layouts.\n• **Go-to-Market Checklists**: Step-by-step launch protocols for B2B & B2C startups.",
      links: [
        { label: "Explore Content Library", url: "/content-library", icon: "📚" },
        { label: "Explore Diplomas", url: "/diplomas", icon: "🎓" },
      ],
      keywords: [
        "resource", "resources", "library", "content", "template", "templates", "safe",
        "pitch deck", "excel", "playbook", "legal", "download", "guide"
      ],
      followUps: [
        "How do I apply for Pre-Seed Investment?",
        "How does Co-Founder Matching work?",
        "What is the Ideation Matrix tool?",
      ],
    },
    community: {
      category: "Community & Events",
      reply:
        "TimeValley connects over 144+ global ecosystem hubs with an elite private founders network:\n\n• **Founders Circle**: Private community channels for technical founders and CEOs.\n• **Demo Days & Pitch Sprints**: Quarterly live pitch events showcasing top portfolio ventures to active VCs.\n• **Peer Masterminds**: Weekly problem-solving pods for founders navigating early scale.\n• **Global Hubs**: Network footprints spanning Riyadh, Dubai, Cairo, London, and Silicon Valley.",
      links: [
        { label: "Join Community Circle", url: "/community", icon: "🌐" },
        { label: "Browse Live Events", url: "/events", icon: "📅" },
      ],
      keywords: [
        "community", "events", "founders circle", "network", "networking", "demo day",
        "pitch sprint", "mastermind", "hubs", "ecosystem", "webinar", "meetup"
      ],
      followUps: [
        "How does Co-Founder Matching work?",
        "What Strategic Advisory services do you offer?",
        "How do I apply for Pre-Seed Investment?",
      ],
    },
    about: {
      category: "About & Leadership",
      reply:
        "TimeValley is a modern Venture Studio and Academy founded by Dr. Wael to transform how high-impact tech ventures are conceived, funded, and scaled.\n\n• **Venture Studio Model**: Unlike traditional passive incubators, TimeValley provides active hands-on co-building, talent pairing, and direct capital deployment.\n• **Dr. Wael's Track Record**: Serial venture architect with decades of experience steering institutional VC syndication, ecosystem building, and executive advisory.",
      links: [
        { label: "Meet Founder Dr. Wael", url: "/founder", icon: "👔" },
        { label: "About TimeValley", url: "/about", icon: "🏛️" },
      ],
      keywords: [
        "about", "dr wael", "wael", "founder", "mission", "vision", "philosophy",
        "story", "team", "venture studio", "accelerator", "who is"
      ],
      followUps: [
        "What Strategic Advisory services do you offer?",
        "How do I apply for Pre-Seed Investment?",
        "What is the 120h Venture Architect Diploma?",
      ],
    },
    pricing_account: {
      category: "Account & Enrollment",
      reply:
        "Getting started on TimeValley is frictionless with dedicated student and founder workspaces:\n\n• **Secure Checkout**: Supports credit/debit cards, bank wire transfers, and verified promo codes.\n• **Student Workspace**: Personalized LMS dashboard tracking progress, video lecture units, and assignment grades.\n• **Scholarships & Vouchers**: Cohort scholarship grants and partnership discount codes can be applied at checkout.",
      links: [
        { label: "Create Account & Register", url: "/register", icon: "🚀" },
        { label: "Student Login", url: "/login", icon: "🔑" },
      ],
      keywords: [
        "price", "pricing", "cost", "enroll", "enrollment", "pay", "payment", "checkout",
        "card", "account", "login", "register", "workspace", "dashboard", "coupon", "discount"
      ],
      followUps: [
        "What is the Venture Architect Diploma?",
        "How do employers verify TimeValley Certificates?",
        "What Strategic Advisory services do you offer?",
      ],
    },
    contact: {
      category: "Contact & Direct Support",
      reply:
        "You can connect directly with the TimeValley executive and admissions team through our official channels:\n\n• **Interactive Contact Form**: Submit your inquiry or partnership proposal directly through our web form.\n• **Official Inquiries Email**: contact@timevalley.com (Response within 24 business hours).\n• **1-on-1 Strategic Consultations**: Direct advisory sessions with Dr. Wael & venture architects.\n• **Global Hubs**: Ecosystem locations in Riyadh, Dubai, Cairo, and London.",
      links: [
        { label: "Open Contact Form", url: "/#contact", icon: "✉️" },
        { label: "Book 1-on-1 Consultation", url: "/consultations", icon: "💬" },
        { label: "Meet Founder Dr. Wael", url: "/founder", icon: "👔" },
      ],
      keywords: [
        "contact", "reach", "email", "support", "phone", "call", "helpdesk", "ticket",
        "message", "office", "address", "location", "headquarters", "customer service", "inquiry", "form"
      ],
      followUps: [
        "How to book a 1-on-1 Consultation with Dr. Wael?",
        "How do I apply for Pre-Seed Investment?",
        "What is the 120h Venture Architect Diploma?",
      ],
    },
    unknown: {
      category: "Information Notice",
      reply:
        "I apologize, but I don't have information regarding that specific inquiry in the TimeValley directory yet.\n\nI specialize in TimeValley ecosystem services, including:\n• **120h Accredited Diplomas**: Comprehensive Venture Architect masterclass.\n• **Co-Founder & CTO Matching**: Algorithmic pairing for technical & product leaders.\n• **Pre-Seed Capital**: Direct startup funding from $50,000 to $250,000.\n• **Strategic Advisory & Tools**: 1-on-1 sessions with Dr. Wael, Ideation Matrix & TAM/SAM calculators.\n\nIf you need direct assistance from our team or have custom inquiries, feel free to book a consultation below.",
      links: [
        { label: "Book Consultation", url: "/consultations", icon: "💬" },
        { label: "Explore Diplomas", url: "/diplomas", icon: "🎓" },
        { label: "Find Co-Founders", url: "/teams", icon: "🤝" },
      ],
      keywords: [],
    },
  },
};

/**
 * Arabic NLP string normalizer (strips diacritics, unifies alef, taa, yaa, and common punctuation)
 */
function normalizeArabicText(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, "") // strip tashkeel
    .replace(/[إأآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[\.,\/#!$%\^&\*;:{}=\-_`~()؟?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * English NLP normalizer
 */
function normalizeEnglishText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\.,\/#!$%\^&\*;:{}=\-_`~()?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Text formatter to render markdown bolding, bullet points, and code tags cleanly
 */
function FormattedMessageText({ text, isUser = false }: { text: string; isUser?: boolean }) {
  const lines = text.split("\n");

  return (
    <div className={`space-y-2 text-sm sm:text-[14.5px] leading-relaxed ${isUser ? "text-white font-medium" : "text-gray-800 font-normal"}`}>
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lIdx} className="h-1.5" />;
        }

        // Bullet point line
        if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
          const content = trimmed.replace(/^[•\-]\s*/, "");
          return (
            <div key={lIdx} className="flex items-start gap-2 pr-1">
              <span className={`${isUser ? "text-white" : "text-[#0E6875]"} font-black text-sm shrink-0 mt-0.5`}>•</span>
              <span className="flex-1">{renderFormattedSegments(content, isUser)}</span>
            </div>
          );
        }

        return <p key={lIdx} className={isUser ? "text-white" : ""}>{renderFormattedSegments(trimmed, isUser)}</p>;
      })}
    </div>
  );
}

function renderFormattedSegments(text: string, isUser = false) {
  // Parse **bold** and `code` tags
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, pIdx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={pIdx} className={isUser ? "text-white font-black" : "font-extrabold text-[#0B4E58]"}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={pIdx}
          className={`${isUser ? "bg-white/20 text-white border-white/30" : "bg-slate-100 text-[#0E6875] border-slate-200"} px-2 py-0.5 rounded text-xs font-mono border`}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function GlobeIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function RotateIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}

function CloseIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SendIcon({ className = "w-3.5 h-3.5", isRtl = false }: { className?: string; isRtl?: boolean }) {
  return (
    <svg className={`${className} ${isRtl ? "scale-x-[-1]" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

function ExternalLinkIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

/**
 * Ultra-crisp Vector Emblem Icon for TimeValley AI Assistant
 */
export function TimeValleyAIIcon({
  className = "",
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="tvAiOrbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="60%" stopColor="#0E6875" />
          <stop offset="100%" stopColor="#073B43" />
        </linearGradient>
        <linearGradient id="tvAiGlowRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#2DD4BF" />
        </linearGradient>
      </defs>

      {/* Outer subtle orbital ring */}
      <circle
        cx="24"
        cy="24"
        r="21"
        stroke="url(#tvAiGlowRing)"
        strokeWidth="1.2"
        strokeDasharray="3 3"
        opacity="0.6"
      />

      {/* Inner background orb with deep teal gradient */}
      <circle cx="24" cy="24" r="18" fill="url(#tvAiOrbGrad)" />

      {/* Angled Energy Orbit */}
      <ellipse
        cx="24"
        cy="24"
        rx="16"
        ry="6"
        stroke="#38BDF8"
        strokeWidth="1.5"
        transform="rotate(-28 24 24)"
        opacity="0.8"
      />

      {/* Central Glowing AI Sparkle Core */}
      <g>
        {/* Outer White Sparkle */}
        <path
          d="M24 14C24 18.5 28.5 24 33.5 24C28.5 24 24 29.5 24 34C24 29.5 19.5 24 14.5 24C19.5 24 24 18.5 24 14Z"
          fill="#FFFFFF"
        />
        {/* Core Center Pulse */}
        <circle cx="24" cy="24" r="2.5" fill="#38BDF8" />
      </g>
    </svg>
  );
}

export default function TimeValleyAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasLanguageChosen, setHasLanguageChosen] = useState<boolean | null>(null);
  const [language, setLanguage] = useState<"en" | "ar">("ar");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isArabic = language === "ar";

  // STRICT HOMEPAGE ONLY VISIBILITY
  if (pathname !== "/") {
    return null;
  }

  // Check saved language on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("tv_assistant_lang") as "en" | "ar" | null;
      if (savedLang) {
        setLanguage(savedLang);
        setHasLanguageChosen(true);
      } else {
        setHasLanguageChosen(false);
      }

      // Show tooltip after 3.5 seconds if assistant hasn't been opened
      const tooltipTimer = setTimeout(() => {
        if (!isOpen) {
          setShowTooltip(true);
        }
      }, 3500);

      return () => clearTimeout(tooltipTimer);
    } catch {
      setHasLanguageChosen(false);
    }
  }, [isOpen]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Initialize initial message when language is selected or changed
  const initializeChatForLanguage = (lang: "en" | "ar") => {
    const welcomeText =
      lang === "ar"
        ? "أهلاً بك في TimeValley! أنا دليلك الذكي لمساعدتك في استكشاف جميع خدمات المنصة: مطابقة المؤسسين، دبلوماتنا المعتمدة (120 ساعة)، استثمارات Pre-Seed، والاستشارات الريادية.\n\nكيف يمكنني مساعدتك اليوم؟ يمكنك الاختيار من الموضوعات المقترحة أو كتابة سؤالك مباشرة."
        : "Welcome to TimeValley! I am your interactive AI Guide. I can help you navigate our venture studio, 120h diplomas, co-founder matching, pre-seed funding ($50k–$250k), and expert advisory.\n\nWhat would you like to explore today?";

    const initialMsg: Message = {
      id: "welcome-" + Date.now(),
      sender: "assistant",
      text: welcomeText,
      category: lang === "ar" ? "دليل المنصة الذكي" : "Ecosystem Guide",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([initialMsg]);
  };

  // Handle language selection from onboarding
  const handleSelectLanguage = (lang: "en" | "ar") => {
    setLanguage(lang);
    setHasLanguageChosen(true);
    try {
      localStorage.setItem("tv_assistant_lang", lang);
    } catch {
      // ignore
    }
    initializeChatForLanguage(lang);
  };

  // Toggle language from header
  const handleToggleLanguage = () => {
    const newLang = language === "en" ? "ar" : "en";
    handleSelectLanguage(newLang);
  };

  // Reset conversation and start fresh
  const handleResetChat = () => {
    setIsResetting(true);
    setInputMessage("");
    setIsLoading(false);
    setMessages([]);
    initializeChatForLanguage(language);

    setTimeout(() => {
      setIsResetting(false);
    }, 450);
  };

  // Dispatch Query to Backend with Local Fallback
  const handleSendMessage = async (customQuery?: string) => {
    const queryToSend = (customQuery || inputMessage).trim();
    if (!queryToSend || isLoading) return;

    const userMsg: Message = {
      id: "user-" + Date.now(),
      sender: "user",
      text: queryToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customQuery) setInputMessage("");
    setIsLoading(true);

    const startTime = Date.now();
    const minTypingDelay = 650; // smooth natural thinking window for dynamic typing animation

    try {
      // 1. Try Backend Assistant Endpoint
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${backendUrl}/api/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryToSend,
          language,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const elapsed = Date.now() - startTime;
        if (elapsed < minTypingDelay) {
          await new Promise((resolve) => setTimeout(resolve, minTypingDelay - elapsed));
        }

        const assistantMsg: Message = {
          id: "assistant-" + Date.now(),
          sender: "assistant",
          text: data.reply,
          category: data.category,
          suggestedFaqs: data.suggestedFaqs,
          actionLinks: data.actionLinks,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsLoading(false);
        return;
      }
    } catch {
      // fallback to local engine if backend network request is unreachable
    }

    // 2. Client-Side Instant Knowledge Resolution Fallback (Weighted NLP Matcher)
    const rawQuery = queryToSend.trim();
    const isArabicQuery = language === "ar" || /[\u0600-\u06FF]/.test(rawQuery);
    const activeLang = isArabicQuery ? "ar" : "en";
    const fallbackDb = LOCAL_FALLBACK_ANSWERS[activeLang] || LOCAL_FALLBACK_ANSWERS.en;

    const normalizedQuery = isArabicQuery
      ? normalizeArabicText(rawQuery)
      : normalizeEnglishText(rawQuery);
    const queryTokens = normalizedQuery.split(" ").filter((t) => t.length > 1);

    let bestMatchedKey: string | null = null;
    let highestScore = 0;

    for (const [key, item] of Object.entries(fallbackDb)) {
      if (key === "unknown") continue;

      let score = 0;
      const normCategory = isArabicQuery
        ? normalizeArabicText(item.category)
        : normalizeEnglishText(item.category);

      // 1. Direct Key match
      if (normalizedQuery.includes(key)) {
        score += 60;
      }

      // 2. Keyword Scoring
      for (const kw of item.keywords) {
        const normKw = isArabicQuery ? normalizeArabicText(kw) : normalizeEnglishText(kw);
        if (normalizedQuery.includes(normKw)) {
          score += 35;
        } else {
          const kwTokens = normKw.split(" ");
          for (const token of queryTokens) {
            if (kwTokens.includes(token)) {
              score += 15;
            }
          }
        }
      }

      // 3. Category relevance
      if (normCategory.includes(normalizedQuery) || normalizedQuery.includes(normCategory)) {
        score += 25;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatchedKey = key;
      }
    }

    const answerData =
      bestMatchedKey && highestScore >= 20
        ? fallbackDb[bestMatchedKey]
        : fallbackDb.unknown;

    const elapsed = Date.now() - startTime;
    if (elapsed < minTypingDelay) {
      await new Promise((resolve) => setTimeout(resolve, minTypingDelay - elapsed));
    }

    const fallbackMsg: Message = {
      id: "assistant-" + Date.now(),
      sender: "assistant",
      text: answerData.reply,
      category: answerData.category,
      suggestedFaqs: answerData.followUps,
      actionLinks: answerData.links,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, fallbackMsg]);
    setIsLoading(false);
  };

  const currentTopics = QUICK_TOPICS[language] || QUICK_TOPICS.ar;

  return (
    <aside
      aria-label="TimeValley AI Assistant"
      className={`pointer-events-auto select-none ${isArabic ? "tv-assistant-arabic" : "font-sans"}`}
    >
      {/* 1. FLOATING LAUNCHER (ANIMATED WITH FRAMER MOTION) */}
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.div
            key="tv-launcher"
            initial={{ scale: 0, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: 12 }}
            transition={{ type: "spring", damping: 22, stiffness: 320 }}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 flex items-center gap-3 z-9999"
          >
            {/* Dismissable Interactive Greeting Tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 4 }}
                  className={`hidden sm:flex items-center gap-2.5 bg-[#0E6875] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md ${
                    isArabic ? "flex-row-reverse tv-assistant-arabic" : "flex-row font-sans"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {isArabic
                      ? "تحتاج مساعدة؟ تحدث مع مستشارك الذكي"
                      : "Need guidance? Chat with TimeValley AI"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTooltip(false);
                    }}
                    className="text-white/70 hover:text-white text-xs ml-1 cursor-pointer transition-colors"
                    aria-label="Dismiss tooltip"
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trigger Capsule Button with 3D Avatar & Glowing Ring */}
            <motion.button
              id="tv-assistant-trigger"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                setIsOpen(true);
                setShowTooltip(false);
                if (hasLanguageChosen && messages.length === 0) {
                  initializeChatForLanguage(language);
                }
              }}
              className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0E6875] shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex items-center justify-center text-white"
              aria-label="Open TimeValley AI Assistant"
            >
              {/* Outer Glowing Pulse Effect */}
              <span className="absolute -inset-1 rounded-full bg-[#0E6875] opacity-40 assistant-pulse-ring pointer-events-none" />

              {/* Inner Icon Container */}
              <div className="relative w-full h-full rounded-full flex items-center justify-center">
                <TimeValleyAIIcon size={36} className="group-hover:scale-110 transition-transform duration-300" />
                {/* Online Green Status Beacon */}
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-xs z-10" />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CHAT MODAL WINDOW (ANIMATED SPRING BLOOM FROM BOTTOM-RIGHT ORIGIN) */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="tv-modal"
            id="tv-assistant-window"
            initial={{ opacity: 0, scale: 0.82, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.85, y: 18, filter: "blur(4px)" }}
            transition={{ type: "spring", damping: 26, stiffness: 320, mass: 0.75 }}
            style={{ transformOrigin: isArabic ? "bottom left" : "bottom right" }}
            className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-99999 w-[94vw] sm:w-105 h-152.5 max-h-[90vh] rounded-3xl overflow-hidden flex flex-col bg-white shadow-2xl border border-gray-200/80 ${
              isArabic ? "tv-assistant-arabic" : "font-sans"
            }`}
            dir={isArabic ? "rtl" : "ltr"}
          >
            {/* CLEAN REFINED HEADER */}
            <header className="bg-[#0E6875] text-white px-4.5 py-3.5 flex items-center justify-between border-b border-[#0B4E58]/50 shrink-0">
              {/* Left: Avatar & Identity */}
              <div className="flex items-center gap-3">
                {/* Luxury Circular Avatar with anchored status dot */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
                    <TimeValleyAIIcon size={28} />
                  </div>
                  {/* Online Status Beacon */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#0E6875] rounded-full" />
                </div>

                <div className="flex flex-col">
                  <h3 className="font-bold text-[14.5px] leading-tight text-white tracking-tight">
                    {isArabic ? "مساعد TimeValley الذكي" : "TimeValley AI Guide"}
                  </h3>
                  <p className="text-[11px] text-teal-100/80 font-normal mt-0.5">
                    {isArabic ? "دليل المنظومة وريادة الأعمال" : "Ecosystem & Venture Specialist"}
                  </p>
                </div>
              </div>

              {/* Right: Header Control Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Language Switcher Pill with Globe Icon */}
                <button
                  onClick={handleToggleLanguage}
                  className="h-8 px-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/15 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title={isArabic ? "Switch to English" : "التبديل إلى العربية"}
                  aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
                >
                  <GlobeIcon className="w-3.5 h-3.5 text-teal-200" />
                  <span className="text-[11px] font-bold tracking-wider uppercase">
                    {language === "en" ? "AR" : "EN"}
                  </span>
                </button>

                {/* Reset Conversation / New Chat */}
                <button
                  onClick={handleResetChat}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 hover:text-white flex items-center justify-center border border-white/15 transition-all cursor-pointer shadow-2xs"
                  title={isArabic ? "مسح المحادثة وبدء محادثة جديدة" : "Clear History & Start New Chat"}
                  aria-label={isArabic ? "بدء محادثة جديدة" : "Start New Chat"}
                >
                  <RotateIcon className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
                </button>

                {/* Close / Minimize */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500/80 active:scale-95 text-white flex items-center justify-center border border-white/15 transition-all cursor-pointer shadow-2xs ml-0.5"
                  title={isArabic ? "إغلاق" : "Close"}
                  aria-label="Close"
                >
                  <CloseIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </header>

            {/* CHAT MESSAGES BODY WITH DATA-LENIS-PREVENT FOR SMOOTH NESTED SCROLLING */}
            <div
              data-lenis-prevent="true"
              className="flex-1 overflow-y-auto overscroll-contain touch-auto p-4 space-y-3.5 bg-slate-50/60 assistant-scrollbar"
            >
              {/* 1. ONBOARDING LANGUAGE SELECTION (First Time Users) */}
              {!hasLanguageChosen ? (
                <div className="py-6 space-y-5 text-center animate-in fade-in duration-300">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0E6875] shadow-md flex items-center justify-center">
                    <TimeValleyAIIcon size={40} />
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-base sm:text-lg text-gray-900">
                      Welcome to TimeValley!
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                      مرحباً بك في منصة TimeValley للحلول الريادية
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-3">
                    <p className="text-xs sm:text-sm font-bold text-gray-700">
                      Please select your preferred language:
                    </p>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => handleSelectLanguage("ar")}
                        className="py-3 px-3 rounded-xl border border-gray-200 hover:border-[#0E6875] bg-white hover:bg-teal-50/50 text-center transition-all group cursor-pointer shadow-2xs hover:shadow-xs"
                      >
                        <div className="text-2xl mb-1">🇸🇦</div>
                        <div className="font-extrabold text-xs sm:text-sm text-gray-900 group-hover:text-[#0E6875]">
                          اللغة العربية
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-400 font-semibold">
                          المتابعة بالعربية
                        </div>
                      </button>

                      <button
                        onClick={() => handleSelectLanguage("en")}
                        className="py-3 px-3 rounded-xl border border-gray-200 hover:border-[#0E6875] bg-white hover:bg-teal-50/50 text-center transition-all group cursor-pointer shadow-2xs hover:shadow-xs"
                      >
                        <div className="text-2xl mb-1">🇬🇧</div>
                        <div className="font-extrabold text-xs sm:text-sm text-gray-900 group-hover:text-[#0E6875]">
                          English
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-400 font-semibold">
                          Continue in EN
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* 2. CONVERSATION STREAM */}
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{
                        opacity: 0,
                        y: 16,
                        scale: 0.95,
                        x: msg.sender === "user" ? (isArabic ? -12 : 12) : 0,
                      }}
                      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 350,
                      }}
                      className={`flex flex-col ${
                        msg.sender === "user" ? "items-end" : "items-start"
                      } space-y-1`}
                    >
                      {/* Message Card */}
                      <div
                        className={`max-w-[92%] rounded-2xl p-3.5 sm:p-4 text-sm sm:text-[14.5px] ${
                          msg.sender === "user"
                            ? "bg-[#0E6875] text-white font-medium rounded-tr-xs shadow-xs"
                            : "bg-white border border-gray-200/80 text-gray-800 rounded-bl-xs shadow-xs"
                        }`}
                      >
                        {/* Assistant Category Tag */}
                        {msg.sender === "assistant" && msg.category && (
                          <div className="mb-2 flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1.5 bg-[#E6F3F5] text-[#0E6875] text-xs font-bold px-2.5 py-1 rounded-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0E6875]" />
                              {msg.category}
                            </span>
                          </div>
                        )}

                        {/* Formatted Text Content */}
                        <FormattedMessageText text={msg.text} isUser={msg.sender === "user"} />

                        {/* In-Stream Direct Quick Topics Suggestions (Inside Welcome Message) */}
                        {msg.id.startsWith("welcome-") && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.25 }}
                            className="mt-3.5 pt-3 border-t border-gray-100 space-y-2"
                          >
                            <p className="text-[11.5px] font-bold text-gray-500 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0E6875]" />
                              <span>{isArabic ? "موضوعات مقترحة للبدء:" : "Suggested topics to explore:"}</span>
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {currentTopics.map((topic) => (
                                <button
                                  key={topic.id}
                                  disabled={isLoading}
                                  onClick={() => handleSendMessage(topic.query)}
                                  className="text-xs sm:text-[12.5px] font-semibold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-[#E6F3F5] text-gray-700 hover:text-[#0E6875] border border-slate-200/70 transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
                                >
                                  {topic.label}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {/* In-Stream Suggested FAQs for Assistant Query Answers */}
                        {msg.suggestedFaqs && msg.suggestedFaqs.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.12, duration: 0.22 }}
                            className="mt-3.5 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5"
                          >
                            {msg.suggestedFaqs.map((faq, idx) => (
                              <button
                                key={idx}
                                disabled={isLoading}
                                onClick={() => handleSendMessage(faq)}
                                className="text-xs sm:text-[12.5px] font-semibold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-[#E6F3F5] text-gray-700 hover:text-[#0E6875] border border-slate-200/70 transition-all cursor-pointer shadow-2xs active:scale-95"
                              >
                                💬 {faq}
                              </button>
                            ))}
                          </motion.div>
                        )}

                        {/* Rich Action Buttons / CTAs */}
                        {msg.actionLinks && msg.actionLinks.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.25 }}
                            className="mt-3.5 pt-3 border-t border-gray-100 flex flex-wrap gap-2"
                          >
                            {msg.actionLinks.map((link, idx) => (
                              <Link
                                key={idx}
                                href={link.url}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1.5 bg-[#0E6875] hover:bg-[#0B4E58] active:scale-95 text-white text-xs sm:text-[13px] font-bold px-3.5 py-2 rounded-lg shadow-2xs transition-all cursor-pointer"
                              >
                                <span>{link.icon || "🚀"}</span>
                                <span>{link.label}</span>
                                <ExternalLinkIcon className="w-2.5 h-2.5 opacity-80" />
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <span className="text-xs text-gray-400 px-1 font-medium">
                        {msg.timestamp}
                      </span>
                    </motion.div>
                  ))}

                  {/* Dynamic Interactive Thinking & Typing Indicator */}
                  <AnimatePresence>
                    {isLoading && (
                      <motion.div
                        key="assistant-typing-indicator"
                        initial={{ opacity: 0, y: 12, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.94, transition: { duration: 0.18 } }}
                        transition={{ type: "spring", damping: 24, stiffness: 350 }}
                        className="flex items-start gap-2 max-w-[85%] self-start"
                      >
                        <div className="w-7 h-7 rounded-full bg-[#0E6875] flex items-center justify-center text-white shrink-0 shadow-xs mt-0.5">
                          <TimeValleyAIIcon size={18} />
                        </div>
                        <div className="bg-white border border-gray-200/90 px-3.5 py-2.5 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-2.5">
                          <div className="flex items-center gap-1">
                            <motion.span
                              animate={{ scale: [1, 1.45, 1], opacity: [0.35, 1, 0.35] }}
                              transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
                              className="w-2 h-2 rounded-full bg-[#0E6875]"
                            />
                            <motion.span
                              animate={{ scale: [1, 1.45, 1], opacity: [0.35, 1, 0.35] }}
                              transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut", delay: 0.2 }}
                              className="w-2 h-2 rounded-full bg-[#0E6875]"
                            />
                            <motion.span
                              animate={{ scale: [1, 1.45, 1], opacity: [0.35, 1, 0.35] }}
                              transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut", delay: 0.4 }}
                              className="w-2 h-2 rounded-full bg-[#0E6875]"
                            />
                          </div>
                          <span className="text-[12px] text-gray-500 font-semibold">
                            {isArabic ? "المساعد يحلل ويكتب..." : "Assistant is thinking..."}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* 3. UNIFIED INPUT DOCK */}
            {hasLanguageChosen && (
              <footer className="p-3 bg-white border-t border-gray-100 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="relative flex items-center bg-slate-100 rounded-xl p-1.5 border border-slate-200"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={
                      isArabic
                        ? "اسأل عن أي خدمة أو استشارة في TimeValley..."
                        : "Ask anything about TimeValley services..."
                    }
                    className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 placeholder:opacity-50 focus:outline-none"
                    disabled={isLoading}
                  />

                  {/* Embedded Send Button */}
                  <motion.button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    whileHover={inputMessage.trim() && !isLoading ? { scale: 1.06 } : {}}
                    whileTap={inputMessage.trim() && !isLoading ? { scale: 0.94 } : {}}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      inputMessage.trim() && !isLoading
                        ? "bg-[#0E6875] hover:bg-[#0B4E58] text-white shadow-xs"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                    }`}
                    aria-label="Send Message"
                  >
                    {isLoading ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <SendIcon className="w-3.5 h-3.5" isRtl={isArabic} />
                    )}
                  </motion.button>
                </form>
              </footer>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
