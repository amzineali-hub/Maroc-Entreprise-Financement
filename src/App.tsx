import React, { useState, useMemo, useEffect } from "react";
import { 
  PRESETS, 
  INDUSTRIES, 
  REVENUE_OPTIONS, 
  REGIONS, 
  AFRICAN_REGIONS, 
  FUNDING_NEEDS, 
  getBankMatches, 
  getChecklist,
  SimulationPreset
} from "./data";
import { 
  Building2, 
  Coins, 
  TrendingUp, 
  Ship, 
  FileCheck, 
  ChevronRight, 
  CheckCircle2, 
  Globe2, 
  Layers, 
  DollarSign, 
  MapPin, 
  Bookmark, 
  Flame, 
  Users, 
  ArrowRight,
  Download,
  AlertCircle,
  Clock,
  Briefcase,
  HelpCircle,
  CheckSquare,
  Square,
  MessageSquare,
  X,
  Send,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";

const translations: Record<string, {ar: string, fr: string}> = {
  "Maroc 2026-2030": { ar: "المغرب 2026-2030", fr: "Maroc 2026-2030" },
  "Expert IA Génération Augmentée": { ar: "خبير معزز بالذكاء الاصطناعي", fr: "Expert IA Génération Augmentée" },
  "Maroc Entreprise Financement": { ar: "تمويل ومقاولات المغرب", fr: "Maroc Entreprise Financement" },
  "Pour une stratégie de la croissance": { ar: "من أجل استراتيجية النمو", fr: "Pour une stratégie de la croissance" },
  "Réinitialiser": { ar: "إعادة ضبط", fr: "Réinitialiser" },
  "Conforme": { ar: "مطابق لـ", fr: "Conforme" },
  "Nouveau Dossier": { ar: "ملف جديد", fr: "Nouveau Dossier" },
  "Profil de la PME & Projet d'Export": { ar: "ملف الشركة ومشروع التصدير", fr: "Profil de la PME & Projet d'Export" },
  "Nom de l'entreprise ou Marque": { ar: "اسم الشركة أو العلامة التجارية", fr: "Nom de l'entreprise ou Marque" },
  "Secteur d'activité": { ar: "قطاع النشاط", fr: "Secteur d'activité" },
  "Région d'origine au Maroc": { ar: "جهة المنشأ بالمغرب", fr: "Région d'origine au Maroc" },
  "Générer l'Analyse Bancaire": { ar: "توليد التحليل البنكي", fr: "Générer l'Analyse Bancaire" },
  "Télécharger le Dossier": { ar: "تحميل الملف", fr: "Télécharger le Dossier" },
  "Rapport IA": { ar: "تقرير الذكاء الاصطناعي", fr: "Rapport IA" },
  "Checklist CRI": { ar: "قائمة المركز الجهوي للإستثمار", fr: "Checklist CRI" },
  "Outils & Formulaires": { ar: "أدوات ونماذج", fr: "Outils & Formulaires" },
  "Options de financement bancaire et subventions": { ar: "خيارات التمويل البنكي والدعم", fr: "Options de financement bancaire et subventions" },
  "Un Copilote intelligent, moderne, synthétique et pratique. Orienté entrepreneur pour :": { ar: "مساعد ذكي وعصري وعملي موجه للمقاول من أجل:", fr: "Un Copilote intelligent, moderne, synthétique et pratique. Orienté entrepreneur pour :" },
  "L’Ingénierie financière :": { ar: "الهندسة المالية:", fr: "L’Ingénierie financière :" },
  "Identifier les garanties et solutions de co-financement Tamwilcom adaptées à votre activité.": { ar: "تحديد الضمانات وحلول التمويل المشترك من تمويلكم الملائمة لنشاطك.", fr: "Identifier les garanties et solutions de co-financement Tamwilcom adaptées à votre activité." },
  "L’Accompagnement Export :": { ar: "المواكبة في التصدير:", fr: "L’Accompagnement Export :" },
  "Structurer votre développement en conformité avec la réglementation des changes et de la douane.": { ar: "هيكلة تطورك وفقاً لقوانين الصرف والجمارك.", fr: "Structurer votre développement en conformité avec la réglementation des changes et de la douane." },
  "La Simplification Administrative :": { ar: "التبسيط الإداري:", fr: "La Simplification Administrative :" },
  "Générer vos statuts de SARL personnalisés et préparer votre dossier unique pour le Centre Régional d'Investissement (CRI).": { ar: "إعداد نظامك الأساسي للشركة (SARL) وتحضير الملف الموحد للمركز الجهوي للاستثمار.", fr: "Générer vos statuts de SARL personnalisés et préparer votre dossier unique pour le Centre Régional d'Investissement (CRI)." },
  "Le Business Plan :": { ar: "مخطط الأعمال:", fr: "Le Business Plan :" },
  "Rédiger des synthèses financières solides prêtes pour les banques partenaires.": { ar: "صياغة ملخصات مالية قوية جاهزة للأبناك الشريكة.", fr: "Rédiger des synthèses financières solides prêtes pour les banques partenaires." },
  "⚡ Charger un profil type pour tester instantanément :": { ar: "⚡ اختر نموذجاً جاهزاً للتجربة الفورية:", fr: "⚡ Charger un profil type pour tester instantanément :" },
  "Simuler": { ar: "محاكاة", fr: "Simuler" },
  "Chiffre d'affaires annuel": { ar: "رقم المعاملات السنوي", fr: "Chiffre d'affaires annuel" },
  "Besoin clé de financement": { ar: "الاحتياج الأساسي للتمويل", fr: "Besoin clé de financement" },
  "Zone ciblée & Expérience": { ar: "المنطقة المستهدفة والخبرة", fr: "Zone ciblée & Expérience" },
  "Produit ou service exporté": { ar: "المنتج أو الخدمة المصدرة", fr: "Produit ou service exporté" },
  "Avez-vous déjà exporté auparavant ?": { ar: "هل سبق لك التصدير من قبل؟", fr: "Avez-vous déjà exporté auparavant ?" },
  "Oui, j'ai une première expérience": { ar: "نعم، لدي تجربة أولية", fr: "Oui, j'ai une première expérience" },
  "Non, je suis primo-exportateur": { ar: "لا، أنا مصدر لأول مرة", fr: "Non, je suis primo-exportateur" },
  "Marché africain ciblé": { ar: "السوق الإفريقية المستهدفة", fr: "Marché africain ciblé" },
  "Zone d'exportation cible en Afrique subsaharienne": { ar: "منطقة التصدير المستهدفة في إفريقيا جنوب الصحراء", fr: "Zone d'exportation cible en Afrique subsaharienne" },
  "Produit ou Service à exporter": { ar: "المنتج أو الخدمة المراد تصديرها", fr: "Produit ou Service à exporter" },
  "Expérience antérieure à l'exportation ?": { ar: "هل لديك خبرة سابقة في التصدير؟", fr: "Expérience antérieure à l'exportation ?" },
  "Oui, au moins une fois": { ar: "نعم، على الأقل مرة واحدة", fr: "Oui, au moins une fois" },
  "Aucune (Novice)": { ar: "لا توجد (مبتدئ)", fr: "Aucune (Novice)" },
  "Avis Conseiller :": { ar: "رأي المستشار:", fr: "Avis Conseiller :" },
  "Calcul de l'Expérience en cours...": { ar: "جارٍ حساب التجربة...", fr: "Calcul de l'Expérience en cours..." },
  "Lancer l'Analyse d'Ingénierie Export": { ar: "إطلاق التحليل الهندسي للتصدير", fr: "Lancer l'Analyse d'Ingénierie Export" },
  "Taux d'Intérêt Estimé": { ar: "معدل الفائدة التقديري", fr: "Taux d'Intérêt Estimé" },
  "Potentiel Douanier": { ar: "القدرة الجمركية", fr: "Potentiel Douanier" },
  "Score Tamwilcom": { ar: "نقاط تمويلكم", fr: "Score Tamwilcom" },
  "Garanties Recommandées (Accès Express)": { ar: "الضمانات الموصى بها (ولوج سريع)", fr: "Garanties Recommandées (Accès Express)" },
  "Options de Banques (Réseau TPE/PME)": { ar: "خيارات الأبناك (شبكة المقاولات الصغيرة جدا /المتوسطة)", fr: "Options de Banques (Réseau TPE/PME)" },
  "Télécharger en PDF": { ar: "تحميل بصيغة PDF", fr: "Télécharger en PDF" },
  "Garantie Souveraine": { ar: "الضمان السيادي", fr: "Garantie Souveraine" },
  "Match Banque Idéal": { ar: "البنك المثالي المطابق", fr: "Match Banque Idéal" },
  "Rapport Financier Prêt": { ar: "التقرير المالي جاهز", fr: "Rapport Financier Prêt" },
  "Créer une Nouvelle Fiche": { ar: "إنشاء بطاقة جديدة", fr: "Créer une Nouvelle Fiche" },
  "Dépôt Physique & Guichet CRI (2026)": { ar: "الإيداع المادي وشباك المركز الجهوي للاستثمار (2026)", fr: "Dépôt Physique & Guichet CRI (2026)" },
  "Générateur de Dossier National d'Investissement & Création PDF": { ar: "مُنشئ ملف الاستثمار الوطني وإنشاء PDF", fr: "Générateur de Dossier National d'Investissement & Création PDF" },
  "Téléchargez l'intégralité de vos documents d'évaluation validés par l'expert IA compilés sous format certifié pour accélérer l'analyse auprès des banques d'affaires et faciliter le dépôt direct.": { ar: "قم بتنزيل كافة وثائق التقييم الخاصة بك المُصادق عليها من قبل خبير الذكاء الاصطناعي والمجمعة في صيغة معتمدة لتسريع التحليل لدى بنوك الأعمال وتسهيل الإيداع المباشر.", fr: "Téléchargez l'intégralité de vos documents d'évaluation validés par l'expert IA compilés sous format certifié pour accélérer l'analyse auprès des banques d'affaires et faciliter le dépôt direct." },
  "1. Diagnostic Expert": { ar: "1. تشخيص الخبير", fr: "1. Diagnostic Expert" },
  "Prêt (IA)": { ar: "جاهز (ذكاء اصطناعي)", fr: "Prêt (IA)" },
  "2. Statuts de la SARL": { ar: "2. النظام الأساسي للشركة (SARL)", fr: "2. Statuts de la SARL" },
  "Rédigé (IA)": { ar: "صُيغ (ذكاء اصطناعي)", fr: "Rédigé (IA)" },
  "+ Rédiger": { ar: "+ صياغة", fr: "+ Rédiger" },
  "3. Business Plan": { ar: "3. مخطط الأعمال", fr: "3. Business Plan" },
  "+ Préparer": { ar: "+ إعداد", fr: "+ Préparer" },
  "Télécharger le Dossier Complet Consolidé (PDF)": { ar: "تحميل الملف الكامل الموحد (PDF)", fr: "Télécharger le Dossier Complet Consolidé (PDF)" },
  "Export Données Financières (CSV)": { ar: "تصدير البيانات المالية (CSV)", fr: "Export Données Financières (CSV)" },
  "Exporter Metrics (CSV)": { ar: "تصدير المقاييس (CSV)", fr: "Exporter Metrics (CSV)" }
};

export const t = (key: string, lang: 'fr'|'ar', defaultVal?: string) => {
  if (lang === 'fr') return defaultVal || key;
  return translations[key]?.[lang] || defaultVal || key;
};

// Utility component to parse and pretty-render simple markdown strings
function MarkdownViewer({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split("\n");
  return (
    <div className="prose max-w-none text-slate-700 space-y-3">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Headers
        if (trimmed.startsWith("###")) {
          return (
            <h3 key={idx} className="text-lg font-bold text-emerald-800 mt-5 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-500 rounded-sm"></span>
              {trimmed.replace(/###/g, "").trim()}
            </h3>
          );
        }
        if (trimmed.startsWith("##")) {
          return (
            <h2 key={idx} className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-1 mt-6 mb-3">
              {trimmed.replace(/##/g, "").trim()}
            </h2>
          );
        }
        if (trimmed.startsWith("#")) {
          return (
            <h1 key={idx} className="text-2xl font-extrabold text-slate-900 mt-8 mb-4">
              {trimmed.replace(/#/g, "").trim()}
            </h1>
          );
        }

        // Bullet point lists
        if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
          const content = trimmed.substring(1).trim();
          // parse simple bold markers like **text**
          const parts = content.split(/\*\*(.*?)\*\*/g);
          return (
            <li key={idx} className="ml-5 list-disc text-slate-600 pl-1 py-0.5">
              {parts.map((part, pIdx) => {
                if (pIdx % 2 === 1) {
                  return <strong key={pIdx} className="font-semibold text-slate-900">{part}</strong>;
                }
                return part;
              })}
            </li>
          );
        }

        // Numbered lists
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          const content = numMatch[2];
          const parts = content.split(/\*\*(.*?)\*\*/g);
          return (
            <div key={idx} className="ml-5 pl-1 py-1 flex gap-2">
              <span className="font-bold text-emerald-600 font-mono">{numMatch[1]}.</span>
              <p className="text-slate-600 flex-1">
                {parts.map((part, pIdx) => {
                  if (pIdx % 2 === 1) {
                    return <strong key={pIdx} className="font-semibold text-slate-900">{part}</strong>;
                  }
                  return part;
                })}
              </p>
            </div>
          );
        }

        // Warning or note cards
        if (trimmed.startsWith(">")) {
          return (
            <div key={idx} className="bg-amber-50/70 border-l-4 border-amber-500 p-3 rounded-r-lg text-amber-900 my-4 text-sm font-sans flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="italic">{trimmed.substring(1).trim()}</p>
            </div>
          );
        }

        // Empty line
        if (trimmed === "") {
          return <div key={idx} className="h-2"></div>;
        }

        // Generic text with bold highlighting
        const parts = trimmed.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={idx} className="text-slate-600 leading-relaxed">
            {parts.map((part, pIdx) => {
              if (pIdx % 2 === 1) {
                return <strong key={pIdx} className="font-semibold text-slate-900">{part}</strong>;
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function App() {
  // Load initial states from localStorage or use defaults
  const [formData, setFormData] = useState<Omit<SimulationPreset, 'name' | 'description'>>(() => {
    const saved = localStorage.getItem("rabona_formData");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      companyName: "Atlas Agro Maroc",
      industry: "Agroalimentaire",
      currentRevenue: "5M - 20M MAD (Moyenne PME)",
      region: "Casablanca-Settat",
      targetAfricanRegion: "Afrique de l'Ouest (Sénégal, Côte d'Ivoire, Mali, etc.)",
      exportProduct: "Agrumes conditionnés en box fraîcheur & huiles aromatisées",
      fundingNeeded: "Crédit d'investissement export (Installation, promotion)",
      hasPriorExportExperience: false,
    };
  });

  // Active tab selection for the analysis results side (extended with SARL statuts, CRI unique form and Business Plan)
  const [activeTab, setActiveTab] = useState<"rapport" | "dossier" | "banques" | "statuts" | "cri" | "business-plan">("rapport");

  // Loading, API response state, and error logging
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState("");
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    analysis: string;
    timestamp: string;
  } | null>(() => {
    const saved = localStorage.getItem("rabona_apiResponse");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return null;
  });
  const [error, setError] = useState<string | null>(null);

  // States for Regulatory Docs & Tools Tab
  const [sarlInputs, setSarlInputs] = useState(() => {
    const saved = localStorage.getItem("rabona_sarlInputs");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      companyName: "Atlas Agro Maroc",
      capital: "100 000",
      managerName: "Ali Amzine",
      region: "Casablanca-Settat",
      industry: "Agroalimentaire",
      sharesCount: "1 000"
    };
  });
  const [bylawsResponse, setBylawsResponse] = useState<string | null>(() => {
    return localStorage.getItem("rabona_bylawsResponse") || null;
  });
  const [bylawsLoading, setBylawsLoading] = useState(false);

  const [bpInputs, setBpInputs] = useState(() => {
    const saved = localStorage.getItem("rabona_bpInputs");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      investmentDescription: "Achat de camions frigorifiques et d'un entrepôt de stockage à la douane, prospection commerciale sur place.",
      expectedMargins: "25% de marge brute moyenne"
    };
  });
  const [bpResponse, setBpResponse] = useState<string | null>(() => {
    return localStorage.getItem("rabona_bpResponse") || null;
  });
  const [bpLoading, setBpLoading] = useState(false);

  // States for document copying feedback
  const [bylawsCopied, setBylawsCopied] = useState(false);
  const [bpCopied, setBpCopied] = useState(false);

  // User checking off requirements checklist state
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("rabona_checkedDocs");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {};
  });

  // CRI form submission simulation states
  const [criFormData, setCriFormData] = useState(() => {
    const saved = localStorage.getItem("rabona_criFormData");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      negativeCertNumber: "OMPIC-2026-98765",
      legalForm: "SARL",
      capital: "100 000",
      managerFullName: "Ali Amzine",
      managerCin: "BK765432",
      companyAddress: "Quartier Industriel Sidi Maarouf, Casablanca-Settat",
      partnersListCount: "2",
      customsRegimen: "Admission Temporaire pour Perfectionnement Actif (ATPA)"
    };
  });
  const [criCompletedSteps, setCriCompletedSteps] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("rabona_criCompletedSteps");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      certifNom: true,
      statutsSignes: false,
      patente: false,
      cnss: false
    };
  });

  // State to track auto-save visual feedback "Enregistré"
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Chatbot states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: string, text: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatLang, setChatLang] = useState<'fr'|'ar'>('fr');
  const [appLang, setAppLang] = useState<'fr'|'ar'>('fr');

  // Write variables inside localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("rabona_formData", JSON.stringify(formData));
    localStorage.setItem("rabona_sarlInputs", JSON.stringify(sarlInputs));
    localStorage.setItem("rabona_bpInputs", JSON.stringify(bpInputs));
    localStorage.setItem("rabona_criFormData", JSON.stringify(criFormData));
    localStorage.setItem("rabona_checkedDocs", JSON.stringify(checkedDocs));
    localStorage.setItem("rabona_criCompletedSteps", JSON.stringify(criCompletedSteps));
    
    if (apiResponse) {
      localStorage.setItem("rabona_apiResponse", JSON.stringify(apiResponse));
    } else {
      localStorage.removeItem("rabona_apiResponse");
    }

    if (bylawsResponse) {
      localStorage.setItem("rabona_bylawsResponse", bylawsResponse);
    } else {
      localStorage.removeItem("rabona_bylawsResponse");
    }

    if (bpResponse) {
      localStorage.setItem("rabona_bpResponse", bpResponse);
    } else {
      localStorage.removeItem("rabona_bpResponse");
    }

    // Capture precise last saved timestamp for elegant UI notification
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastSavedTime(timeStr);
  }, [formData, sarlInputs, bpInputs, criFormData, checkedDocs, criCompletedSteps, apiResponse, bylawsResponse, bpResponse]);

  // Handle manual dynamic reset of state to default values
  const handleResetData = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser l'ensemble des formulaires et des documents simulés ?")) {
      localStorage.removeItem("rabona_formData");
      localStorage.removeItem("rabona_sarlInputs");
      localStorage.removeItem("rabona_bpInputs");
      localStorage.removeItem("rabona_criFormData");
      localStorage.removeItem("rabona_checkedDocs");
      localStorage.removeItem("rabona_criCompletedSteps");
      localStorage.removeItem("rabona_apiResponse");
      localStorage.removeItem("rabona_bylawsResponse");
      localStorage.removeItem("rabona_bpResponse");

      setFormData({
        companyName: "Atlas Agro Maroc",
        industry: "Agroalimentaire",
        currentRevenue: "5M - 20M MAD (Moyenne PME)",
        region: "Casablanca-Settat",
        targetAfricanRegion: "Afrique de l'Ouest (Sénégal, Côte d'Ivoire, Mali, etc.)",
        exportProduct: "Agrumes conditionnés en box fraîcheur & huiles aromatisées",
        fundingNeeded: "Crédit d'investissement export (Installation, promotion)",
        hasPriorExportExperience: false,
      });
      setSarlInputs({
        companyName: "Atlas Agro Maroc",
        capital: "100 000",
        managerName: "Ali Amzine",
        region: "Casablanca-Settat",
        industry: "Agroalimentaire",
        sharesCount: "1 000"
      });
      setBpInputs({
        investmentDescription: "Achat de camions frigorifiques et d'un entrepôt de stockage à la douane, prospection commerciale sur place.",
        expectedMargins: "25% de marge brute moyenne"
      });
      setBpResponse(null);
      setBylawsResponse(null);
      setApiResponse(null);
      setCheckedDocs({});
      setCriCompletedSteps({
        certifNom: true,
        statutsSignes: false,
        patente: false,
        cnss: false
      });
      setCriFormData({
        negativeCertNumber: "OMPIC-2026-98765",
        legalForm: "SARL",
        capital: "100 000",
        managerFullName: "Ali Amzine",
        managerCin: "BK765432",
        companyAddress: "Quartier Industriel Sidi Maarouf, Casablanca-Settat",
        partnersListCount: "2",
        customsRegimen: "Admission Temporaire pour Perfectionnement Actif (ATPA)"
      });
      setActiveTab("rapport");
    }
  };

  // Call API for SARL bylaws generation
  const handleGenerateBylaws = async () => {
    setBylawsLoading(true);
    setBylawsResponse(null);
    try {
      const res = await fetch("/api/generate-bylaws", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: sarlInputs.companyName,
          capital: sarlInputs.capital,
          managerName: sarlInputs.managerName,
          region: sarlInputs.region,
          industry: sarlInputs.industry,
          sharesCount: sarlInputs.sharesCount,
          lang: appLang
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBylawsResponse(data.bylaws);
      } else {
        setBylawsResponse("Impossible de rédiger les statuts. Veuillez vous assurer que les champs sont remplis.");
      }
    } catch (e) {
      console.error(e);
      setBylawsResponse("Une erreur réseau s'est produite lors de la génération avec le conseiller juridique.");
    } finally {
      setBylawsLoading(false);
    }
  };

  // Call API for business plan creation
  const handleGenerateBusinessPlan = async () => {
    setBpLoading(true);
    setBpResponse(null);
    try {
      const res = await fetch("/api/generate-business-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.companyName,
          industry: formData.industry,
          currentRevenue: formData.currentRevenue,
          region: formData.region,
          targetAfricanRegion: formData.targetAfricanRegion,
          exportProduct: formData.exportProduct,
          fundingNeeded: formData.fundingNeeded,
          investmentDescription: bpInputs.investmentDescription,
          expectedMargins: bpInputs.expectedMargins,
          lang: appLang
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBpResponse(data.businessPlan);
      } else {
        setBpResponse("Erreur lors de la rédaction du business plan. Réessayez s'il vous plaît.");
      }
    } catch (e) {
      console.error(e);
      setBpResponse("Erreur de connexion avec le service d'évaluation financière.");
    } finally {
      setBpLoading(false);
    }
  };

  // Compute recommendations and bank matrices dynamically based on inputs
  const matchedBanks = useMemo(() => {
    return getBankMatches(formData.industry, formData.currentRevenue);
  }, [formData.industry, formData.currentRevenue]);

  const docChecklist = useMemo(() => {
    return getChecklist(formData.currentRevenue, formData.fundingNeeded);
  }, [formData.currentRevenue, formData.fundingNeeded]);

  // Calculate dynamic summary heuristics to show instant scorecard ratings
  const dynamicMetrics = useMemo(() => {
    let optimalProgram = "Damane Export";
    let guaranteeRate = "70%";
    let estimatedTaeg = "5.8% - 7.5%";

    if (formData.fundingNeeded.toLowerCase().includes("intelaka") || formData.currentRevenue.includes("< 1M")) {
      optimalProgram = "Intelaka Jeunes";
      guaranteeRate = "80% de garantie";
      estimatedTaeg = "2.0% TAEG (Urbain)";
    } else if (formData.fundingNeeded.toLowerCase().includes("équipement")) {
      optimalProgram = "Damane Express";
      guaranteeRate = "60% de garantie";
      estimatedTaeg = "5.8% - 6.5% TAEG";
    } else if (formData.fundingNeeded.toLowerCase().includes("bfr") && formData.currentRevenue.includes("1M - 5M")) {
      optimalProgram = "Damane Croissance";
      guaranteeRate = "70% de garantie";
      estimatedTaeg = "6.0% - 7.0%";
    }

    return { optimalProgram, guaranteeRate, estimatedTaeg };
  }, [formData.fundingNeeded, formData.currentRevenue]);

  // Handle preset loading simulation with beautiful values
  const handleLoadPreset = (preset: SimulationPreset) => {
    setFormData({
      companyName: preset.companyName,
      industry: preset.industry,
      currentRevenue: preset.currentRevenue,
      region: preset.region,
      targetAfricanRegion: preset.targetAfricanRegion,
      exportProduct: preset.exportProduct,
      fundingNeeded: preset.fundingNeeded,
      hasPriorExportExperience: preset.hasPriorExportExperience,
    });
    // Reset checked items when loading preset
    setCheckedDocs({});
    setApiResponse(null);
    setError(null);
  };

  // Submit company parameters to server-side Gemini router
  const calculateAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiResponse(null);
    setError(null);

    // Dynamic phase transitions to make experience very interactive and clear
    const phases = [
      "Vérification des critères d'éligibilité légale...",
      "Calcul des coefficients d'allocation Tamwilcom...",
      "Modélisation des correspondants bancaires subsahariens...",
      "Génération du diagnostic réglementaire sous l'égide de l'Office des Changes et l'ADII..."
    ];

    let currentPhase = 0;
    setLoadingPhase(phases[0]);
    const interval = setInterval(() => {
      currentPhase++;
      if (currentPhase < phases.length) {
        setLoadingPhase(phases[currentPhase]);
      }
    }, 900);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...formData, lang: appLang}),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Une erreur non identifiée s'est produite.");
      }

      setApiResponse(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Impossible de joindre le service de conseil. Veuillez réessayer.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const toggleDocCheck = (docName: string) => {
    setCheckedDocs(prev => ({ ...prev, [docName]: !prev[docName] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const renderMarkdownToPDF = (doc: jsPDF, markdownText: string, sectionTitle: string, startPageNum: number) => {
    const pageHeight = 297;
    const pageWidth = 210;
    const bottomMargin = 22;
    const lineSpacing = 5.5;
    let currentY = 25;
    let pageNum = startPageNum;

    // Helper to draw clean header and footer decoration
    const drawDecoration = (pNum: number) => {
      // Draw a subtle border or top accent
      doc.setFillColor(4, 120, 87); // emerald
      doc.rect(20, 15, pageWidth - 40, 1.5, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(4, 120, 87); // emerald
      doc.text("DOSSIER NATIONAL D'INVESTISSEMENT ET CRÉATION", 20, 12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(`Section: ${sectionTitle.substring(0, 45)}...`, 105, 12, { align: "center" });
      doc.text(`Page ${pNum}`, pageWidth - 30, 12);
      
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(0.5);
      doc.line(20, 20, pageWidth - 20, 20);

      // Footer
      doc.line(20, pageHeight - 14, pageWidth - 20, pageHeight - 14);
      doc.text("Généré par l'Expert Maroc Entreprise Financement - IA Génération Augmentée", 20, pageHeight - 10);
      doc.text("Confidentiel - Destiné aux Banques et au Centre Régional d'Investissement", pageWidth - 110, pageHeight - 10);
    };

    // Draw initial decorations
    drawDecoration(pageNum);
    currentY = 30;

    // Render title for the beginning of the section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(4, 120, 87); // Emerald
    doc.text(sectionTitle, 20, currentY);
    doc.setDrawColor(4, 120, 87);
    doc.setLineWidth(0.75);
    doc.line(20, currentY + 3, pageWidth - 20, currentY + 3);
    
    currentY += 12;

    const lines = markdownText.split("\n");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42); // slate-900

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      if (trimmed === "") {
        currentY += 3;
        continue;
      }

      // Check pagination budget
      if (currentY + 12 > pageHeight - bottomMargin) {
        doc.addPage();
        pageNum++;
        currentY = 30;
        drawDecoration(pageNum);
      }

      // Headers inside markdown
      if (trimmed.startsWith("###")) {
        currentY += 3;
        const headerText = trimmed.replace(/^###\s*/, "").replace(/\*\*/g, "");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(4, 120, 87); // emerald
        doc.text(headerText, 20, currentY);
        currentY += 6;
        continue;
      }
      if (trimmed.startsWith("##")) {
        currentY += 5;
        const headerText = trimmed.replace(/^##\s*/, "").replace(/\*\*/g, "");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11.5);
        doc.setTextColor(15, 23, 42); // slate 900
        doc.text(headerText, 20, currentY);
        currentY += 7;
        continue;
      }
      if (trimmed.startsWith("#")) {
        currentY += 7;
        const headerText = trimmed.replace(/^#\s*/, "").replace(/\*\*/g, "");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12.5);
        doc.setTextColor(15, 23, 42);
        doc.text(headerText, 20, currentY);
        currentY += 9;
        continue;
      }

      // Bullet list or blockquote
      let isBullet = false;
      let isQuote = false;
      let cleanText = trimmed;
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        isBullet = true;
        cleanText = trimmed.substring(1).trim();
      } else if (trimmed.startsWith(">")) {
        isQuote = true;
        cleanText = trimmed.substring(1).trim();
      }

      // Strip out double asterisks from line
      cleanText = cleanText.replace(/\*\*/g, "");

      // Setup styles based on content type
      doc.setFont("helvetica", isQuote ? "italic" : "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(isQuote ? 80 : 15, isQuote ? 80 : 23, isQuote ? 100 : 42);

      const xPos = isBullet ? 25 : 20;
      const bulletSymbol = isBullet ? "• " : "";
      const textToDivide = isBullet ? bulletSymbol + cleanText : cleanText;
      const maxWidth = isBullet ? 165 : 170;

      const wrapped = doc.splitTextToSize(textToDivide, maxWidth);
      for (let j = 0; j < wrapped.length; j++) {
        if (currentY + lineSpacing > pageHeight - bottomMargin) {
          doc.addPage();
          pageNum++;
          currentY = 30;
          drawDecoration(pageNum);
          doc.setFont("helvetica", isQuote ? "italic" : "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(isQuote ? 80 : 15, isQuote ? 80 : 23, isQuote ? 100 : 42);
        }
        doc.text(wrapped[j], xPos, currentY);
        currentY += lineSpacing;
      }
    }
    return pageNum;
  };

  const handleExportPDF = (type: "all" | "rapport" | "statuts" | "bp") => {
    const doc = new jsPDF();
    const pageWidth = 210;
    const pageHeight = 297;

    if (type === "all") {
      // COVER PAGE / PAGE DE GARDE
      // Top header band (Sovereign Emerald)
      doc.setFillColor(4, 120, 87); // emerald-700
      doc.rect(0, 0, pageWidth, 24, "F");

      // Moroccan state inspiration - tiny colored accents
      doc.setFillColor(194, 65, 12); // Orange / Red
      doc.rect(20, 38, 5, 5, "F");
      doc.setFillColor(4, 120, 87); // Emerald Green
      doc.rect(26, 38, 5, 5, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text("DOSSIER NATIONAL D'INVESTISSEMENT\nET D'EXPORTATION", 20, 58);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text("DOSSIER INTÉGRAL DE CONFORMATION BANCAIRE & ADMINISTRATIVE (CRI / TAMWILCOM)", 20, 80);

      // Horizontal separator rule
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(1);
      doc.line(20, 86, pageWidth - 20, 86);

      // Table section: Identification
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(4, 120, 87); // Emerald Green
      doc.text("ÉLÉMENTS D'IDENTIFICATION & DE CONFORMATION SOCIALE", 21, 98);

      // Outer border box for information grid
      doc.setFillColor(248, 250, 252); // slate-50 background
      doc.rect(20, 104, pageWidth - 40, 84, "F");
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(0.5);
      doc.rect(20, 104, pageWidth - 40, 84, "S");

      let checkY = 114;
      const writeMetaRow = (label: string, value: string) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(71, 85, 105); // slate-600
        doc.text(label, 25, checkY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text(value || "Non spécifié", 75, checkY);
        
        doc.setDrawColor(241, 245, 249);
        doc.line(25, checkY + 2.5, pageWidth - 25, checkY + 2.5);
        checkY += 10.5;
      };

      writeMetaRow("Nom du Projet (Maroc)", sarlInputs.companyName || formData.companyName);
      writeMetaRow("Secteur d'Activité", sarlInputs.industry || formData.industry);
      writeMetaRow("Capital Prévu (MAD)", `${sarlInputs.capital || "100 000"} MAD`);
      writeMetaRow("Région d'Implantation", sarlInputs.region || formData.region);
      writeMetaRow("Mandataire Gérant", sarlInputs.managerName || "Ali Amzine");
      writeMetaRow("Dispositifs Prévus", "Dotation Technologique (500k-1M MAD) + Co-financement");
      writeMetaRow("Pays d'Exportation", formData.targetAfricanRegion || "Afrique de l'Ouest / Global");

      // Scorecard box
      doc.setFillColor(240, 253, 250); // emerald-50
      doc.rect(20, 198, pageWidth - 40, 36, "F");
      doc.setDrawColor(4, 120, 87); // emerald-700
      doc.setLineWidth(1);
      doc.rect(20, 198, pageWidth - 40, 36, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(4, 120, 87); // emerald-700
      doc.text("ÉLÉGIBILITÉ ET SYNTHÈSE DES DIRECTIVES BANCAIRES (2026)", 26, 207);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(`• Taux prévisionnel d'intérêt de crédit (TAEG) : ${dynamicMetrics.estimatedTaeg}`, 26, 214);
      doc.text(`• Caution souveraine optimisée (Tamwilcom) : ${dynamicMetrics.optimalProgram}`, 26, 221);
      doc.text(`• Ligne de Financement d'Investissement conseillée : Fonds Innov Invest (FII - Innov Start / Innov Idea)`, 26, 228);

      // Warning text
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text("Avertissement administratif : Ce dossier est compilé à des fins de conformation en vue de dépôt physique ou en ligne\nauprès du CRI (Centre Régional d'Investissement) ou des banques d'affaires accréditées marocaines.", 20, 245);

      // Footer brand
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text("PORTAIL CONSOLIDE D'EXPORTATION ET FINANCEMENT - ROYAUME DU MAROC", 20, 273);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text("Dossier de dépôt direct. Les pièces d'éligibilité complémentaires comme l'Attestation CNSS doivent être annexées.", 20, 278);

      let lastPage = 1;

      // Section I: Rapport Export
      if (apiResponse && apiResponse.analysis) {
        doc.addPage();
        lastPage++;
        lastPage = renderMarkdownToPDF(doc, apiResponse.analysis, "SECTION I : DIAGNOSTIC DANS LE CADRE DU MATCHING BANCAIRE", lastPage);
      }

      // Section II: Statuts de la SARL
      if (bylawsResponse) {
        doc.addPage();
        lastPage++;
        lastPage = renderMarkdownToPDF(doc, bylawsResponse, "SECTION II : STATUTS DE LA SOCIETE SARL (CONFORMES LOI 5-96)", lastPage);
      }

      // Section III: Business Plan à 3 ans
      if (bpResponse) {
        doc.addPage();
        lastPage++;
        lastPage = renderMarkdownToPDF(doc, bpResponse, "SECTION III : BUSINESS PLAN PREVISIONNEL D'EXPORTATION ET TRÉSORERIE", lastPage);
      }

      // Save complete folder
      doc.save(`Dossier_National_Investissement_${(sarlInputs.companyName || formData.companyName).replace(/\s+/g, "_")}.pdf`);
    } else {
      let runPage = 1;
      
      if (type === "rapport" && apiResponse?.analysis) {
        renderMarkdownToPDF(doc, apiResponse.analysis, "RAPPORT DE DIAGNOSTIC FINANCIER & EXPORT", runPage);
        doc.save(`Rapport_Diagnostic_${(formData.companyName).replace(/\s+/g, "_")}.pdf`);
      } 
      else if (type === "statuts" && bylawsResponse) {
        renderMarkdownToPDF(doc, bylawsResponse, "STATUTS DE LA SARL (CONFORMES LOI 5-96)", runPage);
        doc.save(`Statuts_SARL_${(sarlInputs.companyName).replace(/\s+/g, "_")}.pdf`);
      } 
      else if (type === "bp" && bpResponse) {
        renderMarkdownToPDF(doc, bpResponse, "BUSINESS PLAN PREVISIONNEL D'INVESTISSEMENT", runPage);
        doc.save(`Business_Plan_${(formData.companyName).replace(/\s+/g, "_")}.pdf`);
      }
    }
  };

  const handleExportCSV = () => {
    const dataToExport = {
      "Nom de l'Entreprise": formData.companyName,
      "Secteur d'activité": formData.industry,
      "Chiffre d'affaires": formData.currentRevenue,
      "Région": formData.region,
      "Région cible en Afrique": formData.targetAfricanRegion,
      "Produit exporté": formData.exportProduct,
      "Besoin de financement": formData.fundingNeeded,
      "Expérience export préalable": formData.hasPriorExportExperience ? "Oui" : "Non",
      "Programme de Garantie Optimal (Tamwilcom)": dynamicMetrics.optimalProgram,
      "Taux de Couverture": dynamicMetrics.guaranteeRate,
      "TAEG Estimé": dynamicMetrics.estimatedTaeg,
    };
    const headers = Object.keys(dataToExport);
    const values = Object.values(dataToExport).map(val => {
       const strVal = String(val);
       return strVal.includes(',') || strVal.includes('"') || strVal.includes('\n') ? `"${strVal.replace(/"/g, '""')}"` : strVal;
    });
    const csvContent = "\uFEFF" + headers.join(",") + "\n" + values.join(",");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `maroc_entreprise_metrics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setChatLoading(true);

    try {
      const formattedHistory = chatMessages.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: formattedHistory,
          message: userMessage,
          lang: chatLang
        }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setChatMessages((prev) => [...prev, { role: "model", text: data.text }]);
      } else {
        const errorMsg = chatLang === 'ar' ? "عذراً، لم أتمكن من الرد عليك في الوقت الحالي." : "Je suis désolé, je n'ai pas pu vous répondre en ce moment.";
        setChatMessages((prev) => [...prev, { role: "model", text: errorMsg }]);
      }
    } catch (e) {
      console.error(e);
      const connErrorMsg = chatLang === 'ar' ? "خطأ في الاتصال. يرجى المحاولة مرة أخرى." : "Erreur de connexion. Veuillez réessayer.";
      setChatMessages((prev) => [...prev, { role: "model", text: connErrorMsg }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col antialiased">
      {/* Premium Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="mt-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#1e3a8a" />
                  </linearGradient>
                </defs>
                <path d="M100 20 L100 115" stroke="url(#mt-grad)" strokeWidth="4" strokeLinecap="round" />
                <path d="M85 45 L85 100 L100 115" stroke="url(#mt-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M115 45 L115 100 L100 115" stroke="url(#mt-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M70 70 L70 115 L90 135" stroke="url(#mt-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M130 70 L130 115 L110 135" stroke="url(#mt-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                
                <path d="M55 95 L55 130 L80 155" stroke="url(#mt-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M145 95 L145 130 L120 155" stroke="url(#mt-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                <circle cx="100" cy="20" r="3" fill="#0ea5e9" />
                <circle cx="85" cy="45" r="2.5" fill="#0ea5e9" />
                <circle cx="115" cy="45" r="2.5" fill="#0ea5e9" />
                <circle cx="70" cy="70" r="2" fill="#0ea5e9" />
                <circle cx="130" cy="70" r="2" fill="#0ea5e9" />
                <circle cx="55" cy="95" r="1.5" fill="#0ea5e9" />
                <circle cx="145" cy="95" r="1.5" fill="#0ea5e9" />
                
                <text x="100" y="145" fontFamily="sans-serif" fontSize="24" fontWeight="800" fill="url(#mt-grad)" textAnchor="middle" letterSpacing="1">MT</text>
                <text x="100" y="170" fontFamily="sans-serif" fontSize="22" fontWeight="900" fill="#1e3a8a" textAnchor="middle" letterSpacing="1">MEDIATOWER</text>
                <text x="100" y="185" fontFamily="sans-serif" fontSize="6.5" fontWeight="700" fill="#0ea5e9" textAnchor="middle" letterSpacing="0.5">CONNECTING YOUR DIGITAL WORLD</text>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                  {t("Maroc 2026-2030", appLang)}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-xs text-slate-500 font-mono">{t("Expert IA Génération Augmentée", appLang)}</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {t("Maroc Entreprise Financement", appLang)}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAppLang(appLang === 'fr' ? 'ar' : 'fr')}
              className="text-xs font-bold w-10 h-7 flex items-center justify-center bg-emerald-900 hover:bg-emerald-800 border border-emerald-700/50 rounded-md text-emerald-50 transition"
              title="Changer de langue pour les documents générés / تغيير لغة المستندات"
            >
              {appLang === 'fr' ? 'AR' : 'FR'}
            </button>
            {lastSavedTime && (
              <div className="hidden md:flex items-center gap-1.5 bg-emerald-50/50 border border-emerald-100/80 rounded-lg px-2.5 py-1 text-[11px] font-medium text-emerald-800 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span>{appLang === 'ar' ? `تم الحفظ (${lastSavedTime})` : `Enregistré (${lastSavedTime})`}</span>
              </div>
            )}

            <button
              onClick={handleResetData}
              type="button"
              title="Réinitialiser l'ensemble des données des formulaires"
              className="hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-700 font-semibold py-1.5 px-3 rounded-xl text-xs transition duration-200 flex items-center gap-1.5 cursor-pointer bg-white"
            >
              {t("Réinitialiser", appLang)}
            </button>

            <div className="h-8 w-px bg-slate-200 mx-1 hidden lg:block"></div>

            <p className="text-xs text-right hidden lg:block text-slate-500 select-none">
              {t("Conforme", appLang)} <br />
              <strong>Tamwilcom / Douane</strong>
            </p>
            <div className="h-8 w-px bg-slate-200 mx-1 hidden lg:block"></div>
            <a 
              href="#generate-section"
              className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-xl text-xs transition duration-200 flex items-center gap-2"
            >
              <Briefcase className="w-3.5 h-3.5" />
              {t("Nouveau Dossier", appLang)}
            </a>
          </div>
        </div>
      </header>

      {/* Hero Intro Banner Section */}
      <section className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white py-12 px-4 relative overflow-hidden print:hidden" dir={appLang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none mb-2">
              {t("Maroc Entreprise Financement", appLang)}
            </h2>
            <p className="text-lg text-emerald-400 font-medium mb-5 tracking-wide">
              {t("Pour une stratégie de la croissance", appLang)}
            </p>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-5">
              {appLang === 'ar' ? "مستشارك الاستراتيجي المدعوم بالذكاء الاصطناعي... مصمم للفترة 2026-2030 لتبسيط الإجراءات الإدارية والمالية للمقاولين بالمغرب." : "Votre conseiller stratégique propulsé par l'Intelligence Artificielle de Génération Augmentée. Conçu pour la période 2026-2030, il simplifie les démarches administratives et financières des entrepreneurs au Maroc : de la création et des formulaires CRI, jusqu'à la conformité avec l'Office des Changes et des douanes."}
            </p>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-white/10 mb-8 shadow-lg">
              <p className="font-semibold text-emerald-300 mb-3 text-sm">
                {t("Un Copilote intelligent, moderne, synthétique et pratique. Orienté entrepreneur pour :", appLang)}
              </p>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-2 mt-0.5">•</span>
                  <span><strong className="text-white font-semibold">{t("L’Ingénierie financière :", appLang)}</strong> {t("Identifier les garanties et solutions de co-financement Tamwilcom adaptées à votre activité.", appLang)}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-2 mt-0.5">•</span>
                  <span><strong className="text-white font-semibold">{t("L’Accompagnement Export :", appLang)}</strong> {t("Structurer votre développement en conformité avec la réglementation des changes et de la douane.", appLang)}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-2 mt-0.5">•</span>
                  <span><strong className="text-white font-semibold">{t("La Simplification Administrative :", appLang)}</strong> {t("Générer vos statuts de SARL personnalisés et préparer votre dossier unique pour le Centre Régional d'Investissement (CRI).", appLang)}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-2 mt-0.5">•</span>
                  <span><strong className="text-white font-semibold">{t("Le Business Plan :", appLang)}</strong> {t("Rédiger des synthèses financières solides prêtes pour les banques partenaires.", appLang)}</span>
                </li>
              </ul>
            </div>

            {/* Quick Demo cases */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2.5">
                {t("⚡ Charger un profil type pour tester instantanément :", appLang)}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadPreset(p)}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 rounded-xl p-3 text-left transition duration-200 flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-emerald-400 font-sans transition" dir="auto">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2" dir="auto">
                        {p.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-2 pt-2 border-t border-white/5 w-full">
                      <span>{t("Simuler", appLang)}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition duration-200" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Main Grid Application space */}
      <main id="generate-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" dir={appLang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel form setup */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm shadow-slate-100 print:hidden">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">
                {t("Profil de la PME & Projet d'Export", appLang)}
              </h3>
            </div>

            <form onSubmit={calculateAnalysis} className="space-y-4">
              {/* Company details */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t("Nom de l'entreprise ou Marque", appLang)}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Ex. Atlas Industrial Co."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Grid 2x2 for parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t("Secteur d'activité", appLang)}
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  >
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t("Région d'origine au Maroc", appLang)}
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  >
                    {REGIONS.map((reg) => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t("Chiffre d'affaires annuel", appLang)}
                </label>
                <select
                  value={formData.currentRevenue}
                  onChange={(e) => setFormData({ ...formData, currentRevenue: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                >
                  {REVENUE_OPTIONS.map((rev) => (
                    <option key={rev.value} value={rev.value}>{rev.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t("Besoin clé de financement", appLang)}
                </label>
                <select
                  value={formData.fundingNeeded}
                  onChange={(e) => setFormData({ ...formData, fundingNeeded: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                >
                  {FUNDING_NEEDS.map((fund) => (
                    <option key={fund} value={fund}>{fund}</option>
                  ))}
                </select>
              </div>

              {/* Destination & Export experience details */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t("Zone d'exportation cible en Afrique subsaharienne", appLang)}
                </label>
                <select
                  value={formData.targetAfricanRegion}
                  onChange={(e) => setFormData({ ...formData, targetAfricanRegion: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                >
                  {AFRICAN_REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                  <option value="Sénégal, Côte d'Ivoire">Sénégal, Côte d'Ivoire (Marché direct dynamique)</option>
                  <option value="Afrique Centrale active (Cameroun, Gabon)">Afrique Centrale (Cameroun, Gabon)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t("Produit ou Service à exporter", appLang)}
                </label>
                <input
                  type="text"
                  required
                  value={formData.exportProduct}
                  onChange={(e) => setFormData({ ...formData, exportProduct: e.target.value })}
                  placeholder="Ex : Fruits conditionnés, pièces mécaniques, logiciels..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>

              {/* Export experience toggle with beautiful switches */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {t("Expérience antérieure à l'exportation ?", appLang)}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasPriorExportExperience: true })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      formData.hasPriorExportExperience 
                        ? "bg-emerald-600 text-white shadow-sm" 
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t("Oui, au moins une fois", appLang)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasPriorExportExperience: false })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      !formData.hasPriorExportExperience 
                        ? "bg-emerald-600 text-white shadow-sm" 
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {t("Aucune (Novice)", appLang)}
                  </button>
                </div>
              </div>

              {/* Notice and advice from regulations */}
              <div className="bg-emerald-50 border-l-4 border-emerald-600 p-3.5 rounded-xl text-[11px] text-emerald-950 flex gap-2.5">
                <Bookmark className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong>{t("Avis Conseiller :", appLang)}</strong> {appLang === 'ar' ? "الشركات المغربية التي يقل رقم معاملاتها عن 200 مليون درهم وأقل من 200 موظف مؤهلة بنسبة 100٪ لصندوق الضمان التلقائي لضمانكم (ضمان تصدير، ضمان إكسبريس، إلخ)." : "Les entreprises marocaines de moins de 200M MAD de chiffre d'affaires et de moins de 200 salariés sont 100% éligibles au fond de garantie automatic de Tamwilcom (Damane Export, Damane Express, etc.)."}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold tracking-wide text-white transition duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  loading 
                    ? "bg-slate-400 cursor-not-allowed" 
                    : "bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-700/20"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>{t("Calcul de l'Expérience en cours...", appLang)}</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    <span>{t("Lancer l'Analyse d'Ingénierie Export", appLang)}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right panel analysis results */}
          <div className="lg:col-span-7 space-y-6">

            {/* Simulated Scorecard Header Bar */}
            <div className="bg-slate-950 text-white rounded-3xl p-5 border border-slate-800 shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-white/5 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center font-bold">
                  %
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t("Taux d'Intérêt Estimé", appLang)}</p>
                  <p className="text-sm font-bold text-orange-300 font-mono">{dynamicMetrics.estimatedTaeg}</p>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t("Garantie Souveraine", appLang)}</p>
                  <p className="text-sm font-bold text-emerald-300 font-sans">{dynamicMetrics.optimalProgram}</p>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Ship className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t("Match Banque Idéal", appLang)}</p>
                  <p className="text-sm font-bold text-blue-300">{matchedBanks[0].name}</p>
                </div>
              </div>
            </div>

            {/* Custom PDF Export & Incorporation Centre */}
            {apiResponse && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50/45 border-2 border-emerald-600/25 rounded-3xl p-5 shadow-sm shadow-emerald-50/40"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 uppercase px-2 py-0.5 rounded-full mb-1.5 font-mono">
                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse"></span>
                      {t("Dépôt Physique & Guichet CRI (2026)", appLang)}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                      <FileCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                      {t("Générateur de Dossier National d'Investissement & Création PDF", appLang)}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      {t("Téléchargez l'intégralité de vos documents d'évaluation validés par l'expert IA compilés sous format certifié pour accélérer l'analyse auprès des banques d'affaires et faciliter le dépôt direct.", appLang)}
                    </p>
                  </div>
                </div>

                {/* Checklist with status indicator badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="bg-white rounded-2xl p-3 border border-slate-200/60 flex items-center justify-between shadow-sm">
                    <span className="text-xs font-semibold text-slate-700">{t("1. Diagnostic Expert", appLang)}</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">{t("Prêt (IA)", appLang)}</span>
                  </div>
                  <div className="bg-white rounded-2xl p-3 border border-slate-200/60 flex items-center justify-between shadow-sm">
                    <span className="text-xs font-semibold text-slate-700">{t("2. Statuts de la SARL", appLang)}</span>
                    {bylawsResponse ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">{t("Rédigé (IA)", appLang)}</span>
                    ) : (
                      <button 
                        type="button"
                        onClick={() => {
                          setActiveTab("statuts");
                        }}
                        className="text-[9px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-full cursor-pointer transition hover:bg-indigo-100"
                      >
                        {t("+ Rédiger", appLang)}
                      </button>
                    )}
                  </div>
                  <div className="bg-white rounded-2xl p-3 border border-slate-200/60 flex items-center justify-between shadow-sm">
                    <span className="text-xs font-semibold text-slate-700">{t("3. Business Plan", appLang)}</span>
                    {bpResponse ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">{t("Rédigé (IA)", appLang)}</span>
                    ) : (
                      <button 
                        type="button"
                        onClick={() => {
                          setActiveTab("business-plan");
                        }}
                        className="text-[9px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-full cursor-pointer transition hover:bg-indigo-100"
                      >
                        {t("+ Préparer", appLang)}
                      </button>
                    )}
                  </div>
                </div>

                {/* Primary Export Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => handleExportPDF("all")}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-700/10 cursor-pointer"
                  >
                    <Download className="w-4 h-4 shrink-0" />
                    {t("Télécharger le Dossier Complet Consolidé (PDF)", appLang)}
                  </button>

                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-blue-600/10 cursor-pointer"
                  >
                    <Download className="w-4 h-4 shrink-0" />
                    {t("Exporter Metrics (CSV)", appLang)}
                  </button>

                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleExportPDF("rapport")}
                      title="Télécharger seulement le Rapport de Diagnostic"
                      className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-3 py-3 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Rapport seul
                    </button>
                    {bylawsResponse && (
                      <button
                        type="button"
                        onClick={() => handleExportPDF("statuts")}
                        title="Télécharger seulement les Statuts rédigés"
                        className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-3 py-3 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Statuts
                      </button>
                    )}
                    {bpResponse && (
                      <button
                        type="button"
                        onClick={() => handleExportPDF("bp")}
                        title="Télécharger seulement le Business Plan rédigé"
                        className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-3 py-3 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Plan
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Results interactive display tabs */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm shadow-slate-100 flex flex-col min-h-[500px]">
              
              {/* Tab Category Header */}
              <div className="bg-slate-900 text-slate-300 py-1.5 px-4 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Ingénierie Export & Garanties</span>
                <span className="text-slate-500">•</span>
              </div>
              
              {/* Core Tabs row 1 */}
              <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 p-2 gap-2 print:hidden select-none">
                <button
                  onClick={() => setActiveTab("rapport")}
                  className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-[11px] sm:text-xs transition relative cursor-pointer ${
                    activeTab === "rapport" 
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                      : "text-slate-500 hover:text-slate-950"
                  }`}
                >
                  <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
                  Rapport Expert
                </button>
                <button
                  onClick={() => setActiveTab("banques")}
                  className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-[11px] sm:text-xs transition relative cursor-pointer ${
                    activeTab === "banques" 
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                      : "text-slate-500 hover:text-slate-950"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  Match Banque
                </button>
                <button
                  onClick={() => setActiveTab("dossier")}
                  className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-[11px] sm:text-xs transition relative cursor-pointer ${
                    activeTab === "dossier" 
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                      : "text-slate-500 hover:text-slate-950"
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
                  Dossier ({docChecklist.filter(d => checkedDocs[d.name]).length}/{docChecklist.length})
                </button>
              </div>

              {/* Tab Category 2 Header */}
              <div className="bg-emerald-950 text-emerald-400 py-1.5 px-4 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between border-t border-slate-200 text-left">
                <span>Création d'Entreprise & Livrables Business Plan (Dossier CRI)</span>
                <span className="text-emerald-500 text-[9px] bg-emerald-900/50 px-1.5 py-0.2 rounded-full font-mono uppercase">Nouveau</span>
              </div>

              {/* Core Tabs row 2 */}
              <div className="flex flex-wrap border-b border-slate-200 bg-emerald-50/20 p-2 gap-2 print:hidden select-none">
                <button
                  type="button"
                  onClick={() => setActiveTab("statuts")}
                  className={`flex-1 min-w-[125px] flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-[11px] sm:text-xs transition relative cursor-pointer ${
                    activeTab === "statuts" 
                      ? "bg-white text-emerald-950 shadow-sm border border-emerald-200/50" 
                      : "text-slate-500 hover:text-emerald-900"
                  }`}
                >
                  <Coins className="w-3.5 h-3.5 text-emerald-700" />
                  Statuts SARL (IA)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("cri")}
                  className={`flex-1 min-w-[125px] flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-[11px] sm:text-xs transition relative cursor-pointer ${
                    activeTab === "cri" 
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5 text-orange-600" />
                  Formulaire CRI
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("business-plan")}
                  className={`flex-1 min-w-[125px] flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-[11px] sm:text-xs transition relative cursor-pointer ${
                    activeTab === "business-plan" 
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                  Business Plan (IA)
                </button>
              </div>

              {/* Dynamic Content viewport */}
              <div className="p-6 flex-1">
                <AnimatePresence mode="wait">
                  
                  {/* Phase 1: Not computed / Loading state */}
                  {loading && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="h-full flex flex-col items-center justify-center py-20 text-center"
                    >
                      <div className="relative mb-6">
                        <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-emerald-600 animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Clock className="w-6 h-6 text-emerald-600 animate-pulse" />
                        </div>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-1">
                        Conseiller IA en cours de rédaction du rapport...
                      </h4>
                      <p className="text-xs text-slate-500 font-mono max-w-sm">
                        {loadingPhase}
                      </p>
                      
                      <div className="mt-8 bg-emerald-50 text-emerald-900 p-4 rounded-2xl text-xs max-w-md border border-emerald-100 text-left">
                        <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-800 block mb-1">Renseignements assimilés :</span>
                        Notre modèle Flash structure un diagnostic sur-mesure combinant l'historique d'implantation africaine de la BMCE et les barrières douanières du couloir logistique d'El Guerguerat.
                      </div>
                    </motion.div>
                  )}

                  {/* Phase 2: Error state */}
                  {!loading && error && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-8 text-center"
                    >
                      <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
                      <h4 className="text-lg font-bold text-rose-950 mb-1">Échec de la consultation</h4>
                      <p className="text-sm text-rose-700 max-w-md mx-auto mb-4">{error}</p>
                      <button
                        onClick={calculateAnalysis}
                        className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-4 py-2 rounded-xl text-xs transition"
                      >
                        Réessayer l'analyse
                      </button>
                    </motion.div>
                  )}

                  {/* Phase 3: Empty State */}
                  {!loading && !apiResponse && !error && ["rapport", "dossier", "banques"].includes(activeTab) && (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center text-center py-16"
                    >
                      <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4 shadow-sm">
                        <Layers className="w-8 h-8 text-emerald-600/70" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">
                        Prêt pour votre diagnostic export marocain
                      </h4>
                      <p className="text-sm text-slate-500 max-w-md leading-relaxed mb-6">
                        Sélectionnez l'un de nos profils pré-configurés ci-dessus ou ajustez les paramètres de votre entreprise marocaine dans le volet de gauche, puis cliquez sur <strong>"Lancer l'Analyse"</strong>.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg w-full text-left">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs mb-1 uppercase font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Garantie étatique
                          </div>
                          <p className="text-[11px] text-slate-500 leading-normal">
                            Intégration automatique des critères de garantie souveraine Tamwilcom allant jusqu'à 80%.
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs mb-1 uppercase font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                            Match de correspondants
                          </div>
                          <p className="text-[11px] text-slate-500 leading-normal">
                            Sélection de la banque marocaine ideale (Attijariwafa, BOA, BCP) en fonction de sa capillarité en Afrique de l'Ouest ou Centrale.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Phase 4: Active Output rendering */}
                  {!loading && apiResponse && (
                    <motion.div
                      key="output"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      {/* Active Report Tab content */}
                      {activeTab === "rapport" && (
                        <div>
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
                            <div>
                              <h4 className="text-lg font-extrabold text-slate-900">
                                Rapport de Diagnostic Souverain
                              </h4>
                              <p className="text-[10px] text-slate-400 font-mono uppercase">
                                Rédigé le {new Date(apiResponse.timestamp).toLocaleString("fr-FR")}
                              </p>
                            </div>
                            <button
                              onClick={handlePrint}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-950 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Imprimer Rapport
                            </button>
                          </div>

                          <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/60 mb-6 flex items-start gap-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                            <p className="text-xs text-emerald-950 leading-relaxed">
                              <strong>Note à la Direction :</strong> Ce rapport analyse en priorité l'optimisation des flux de devises conformément aux règlementations de l'Office des Changes et l'utilisation optimale du fond <strong>Tamwilcom</strong>.
                            </p>
                          </div>

                          {/* Markdown formatted text output */}
                          <MarkdownViewer text={apiResponse.analysis} />
                        </div>
                      )}

                      {/* Active Checklist Tab content */}
                      {activeTab === "dossier" && (
                        <div>
                          <div className="border-b border-slate-100 pb-3 mb-5 flex items-center justify-between">
                            <div>
                              <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
                                <CheckSquare className="w-5 h-5 text-amber-500" />
                                Préparation du Dossier Bancaire
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Prédicteur de succès : {Math.round((docChecklist.filter(d => checkedDocs[d.name]).length / docChecklist.length) * 100)}% d'avancement.
                              </p>
                            </div>
                          </div>

                          <div className="bg-amber-50/70 text-amber-950 p-4 rounded-2xl text-xs border border-amber-100 flex gap-2.5 mb-6">
                            <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                            <div>
                              <strong>Critères de conformité importants :</strong> Présenter un dossier 100% complet dès le premier dépôt réduit le délai d'instruction bancaire de près de 30 jours au Maroc. Cochez les documents d'éligibilité au fur et à mesure.
                            </div>
                          </div>

                          {/* The Dynamic Checklist checkboxes group */}
                          <div className="space-y-3">
                            {docChecklist.map((doc, dIdx) => {
                              const isChecked = !!checkedDocs[doc.name];
                              return (
                                <div
                                  key={dIdx}
                                  onClick={() => toggleDocCheck(doc.name)}
                                  className={`p-3.5 rounded-2xl border transition duration-150 cursor-pointer flex gap-3 items-start select-none ${
                                    isChecked 
                                      ? "bg-slate-50 border-emerald-500/30 text-slate-800" 
                                      : "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700"
                                  }`}
                                >
                                  <div className="shrink-0 mt-0.5">
                                    {isChecked ? (
                                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-md border border-slate-300 bg-white"></div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-semibold">{doc.name}</span>
                                      {doc.required ? (
                                        <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">Obligatoire</span>
                                      ) : (
                                        <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">Optionnel</span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                                      {doc.desc}
                                    </p>
                                    <span className="text-[9px] font-bold tracking-wider text-emerald-800 bg-emerald-50/50 px-2 py-0.5 rounded-full mt-2 inline-block">
                                      {doc.category}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Active Banks Matchmaking tab */}
                      {activeTab === "banques" && (
                        <div>
                          <div className="border-b border-slate-100 pb-3 mb-5">
                            <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
                              <Building2 className="w-5 h-5 text-blue-600" />
                              Classement d'Éligibilité Bancaire
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Taux de matching calculé par rapport à l'implantation en {formData.targetAfricanRegion} et votre besoin principal.
                            </p>
                          </div>

                          <div className="space-y-4">
                            {matchedBanks.map((bank, bIdx) => {
                              return (
                                <div 
                                  key={bIdx}
                                  className="border border-slate-200/80 rounded-2xl p-4 bg-white/50 backdrop-blur-sm shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-2xl ${bank.logoColor} text-white flex flex-col items-center justify-center font-bold font-mono text-center shrink-0`}>
                                      <span className="text-xs leading-none">MA</span>
                                      <span className="text-[10px] opacity-70 mt-0.5 font-sans">2026</span>
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <h5 className="font-bold text-slate-900 text-sm">{bank.name}</h5>
                                        <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 rounded px-1.5 font-medium">{bank.share}</span>
                                      </div>
                                      <p className="text-xs text-slate-600 mt-1">
                                        {bank.reason}
                                      </p>
                                      <div className="text-[10px] text-emerald-800 font-bold bg-emerald-50 rounded-full px-2.5 py-0.5 mt-2 inline-block">
                                        Solution conseillée : {bank.program}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-end shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                                    <span className="text-xs text-slate-400 font-semibold mb-0.5">Indice d'Adéquation</span>
                                    <span className="text-2xl font-black text-slate-900 font-mono">
                                      {bank.rating}%
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    </motion.div>
                  )}

                  {/* Active Statuts SARL Tab */}
                  {activeTab === "statuts" && (
                    <motion.div
                      key="statuts"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 text-left"
                    >
                      <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
                            <Coins className="w-5 h-5 text-emerald-700" />
                            Générateur de Statuts de SARL (Maroc)
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Conforme aux directives de la loi n° 5-96 instituant les statuts de SARL au Maroc.
                          </p>
                        </div>
                        {bylawsResponse && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(bylawsResponse);
                              setBylawsCopied(true);
                              setTimeout(() => setBylawsCopied(false), 2000);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-slate-950 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
                          >
                            <Download className="w-3.5 h-3.5" />
                            {bylawsCopied ? "Copié !" : "Copier les statuts"}
                          </button>
                        )}
                      </div>

                      <div className="bg-emerald-50 text-emerald-950 p-4 rounded-2xl text-xs border border-emerald-100/60 leading-relaxed">
                        <strong>Réglementation Maroc :</strong> Dans votre mandat de création d'entreprise par le guichet unique du CRI, l'élaboration des statuts de SARL est obligatoire. Complétez ou ajustez les variables d'enregistrement ci-dessous avant d'activer le rédacteur intelligent.
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Dénomination de la SARL</label>
                          <input 
                            type="text"
                            value={sarlInputs.companyName}
                            onChange={(e) => setSarlInputs({...sarlInputs, companyName: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Capital Social (MAD)</label>
                          <input 
                            type="text"
                            value={sarlInputs.capital}
                            onChange={(e) => setSarlInputs({...sarlInputs, capital: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Gérant Statutaire Unique</label>
                          <input 
                            type="text"
                            value={sarlInputs.managerName}
                            onChange={(e) => setSarlInputs({...sarlInputs, managerName: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Nombre de Parts Sociales</label>
                          <input 
                            type="text"
                            value={sarlInputs.sharesCount}
                            onChange={(e) => setSarlInputs({...sarlInputs, sharesCount: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Siège social (Ville ou Région)</label>
                          <input 
                            type="text"
                            value={sarlInputs.region}
                            onChange={(e) => setSarlInputs({...sarlInputs, region: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Secteur / Objet d'Activité</label>
                          <input 
                            type="text"
                            value={sarlInputs.industry}
                            onChange={(e) => setSarlInputs({...sarlInputs, industry: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGenerateBylaws}
                        disabled={bylawsLoading}
                        className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-white transition duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                          bylawsLoading ? "bg-slate-400 cursor-not-allowed animate-pulse" : "bg-emerald-700 hover:bg-emerald-800"
                        }`}
                      >
                        {bylawsLoading ? (
                          <span>Génération de la rédaction des articles de statuts...</span>
                        ) : (
                          <span>Rédiger l'Intégralité des Statuts de la SARL</span>
                        )}
                      </button>

                      {bylawsResponse && (
                        <div className="border border-slate-200 bg-white p-5 rounded-2xl shadow-inner max-h-[500px] overflow-y-auto mt-4">
                          <MarkdownViewer text={bylawsResponse} />
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Active Formulaire CRI Tab */}
                  {activeTab === "cri" && (
                    <motion.div
                      key="cri"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 text-left"
                    >
                      <div className="border-b border-slate-100 pb-3">
                        <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
                          <FileCheck className="w-5 h-5 text-orange-600" />
                          Formulaire Unique de Création d'Entreprise (Guichet National CRI)
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Modélisation et validation des formulaires d'enregistrement consolidés d'affaires.
                        </p>
                      </div>

                      <div className="bg-amber-50 text-amber-950 p-4 rounded-2xl text-[11px] border border-amber-100/60 leading-relaxed space-y-2">
                        <p>
                          <strong>Centre Régional d'Investissement :</strong> Au Maroc, toutes les démarches de création se font via le CRI (plateforme numérique Direct-CRI). Le Formulaire Unique rassemble l'OMPIC, l'Enregistrement Fiscal, la déclaration d'impôt Patente, le Registre du Commerce (RC), et la CNSS.
                        </p>
                        <p className="font-semibold text-amber-800">
                          * Renseignez vos données réelles de création ci-dessous pour vérifier la bonne conformité de votre dossier fiscal d'immatriculation.
                        </p>
                      </div>

                      {/* Interactive checklist progression for the CRI office */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => setCriCompletedSteps({...criCompletedSteps, certifNom: !criCompletedSteps.certifNom})}
                          className={`p-2.5 rounded-lg border text-center transition cursor-pointer select-none ${
                            criCompletedSteps.certifNom 
                              ? "bg-emerald-50 border-emerald-500/40 text-emerald-900" 
                              : "bg-white border-slate-200 text-slate-600"
                          }`}
                        >
                          <p className="text-[10px] font-bold">Étape 1</p>
                          <p className="text-[11px] mt-0.5 font-semibold">Certificat OMPIC</p>
                          <span className="text-[9px] block text-emerald-600 font-bold">{criCompletedSteps.certifNom ? "✓ Validé" : "À Faire"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCriCompletedSteps({...criCompletedSteps, statutsSignes: !criCompletedSteps.statutsSignes})}
                          className={`p-2.5 rounded-lg border text-center transition cursor-pointer select-none ${
                            criCompletedSteps.statutsSignes 
                              ? "bg-emerald-50 border-emerald-500/40 text-emerald-900" 
                              : "bg-white border-slate-200 text-slate-600"
                          }`}
                        >
                          <p className="text-[10px] font-bold">Étape 2</p>
                          <p className="text-[11px] mt-0.5 font-semibold">Statuts Signés</p>
                          <span className="text-[9px] block text-slate-400">{criCompletedSteps.statutsSignes ? "✓ Validé" : "À Faire"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCriCompletedSteps({...criCompletedSteps, patente: !criCompletedSteps.patente})}
                          className={`p-2.5 rounded-lg border text-center transition cursor-pointer select-none ${
                            criCompletedSteps.patente 
                              ? "bg-emerald-50 border-emerald-500/40 text-emerald-900" 
                              : "bg-white border-slate-200 text-slate-600"
                          }`}
                        >
                          <p className="text-[10px] font-bold">Étape 3</p>
                          <p className="text-[11px] mt-0.5 font-semibold">Impôt Patente</p>
                          <span className="text-[9px] block text-slate-400">{criCompletedSteps.patente ? "✓ Validé" : "À Faire"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCriCompletedSteps({...criCompletedSteps, cnss: !criCompletedSteps.cnss})}
                          className={`p-2.5 rounded-lg border text-center transition cursor-pointer select-none ${
                            criCompletedSteps.cnss 
                              ? "bg-emerald-50 border-emerald-500/40 text-emerald-900" 
                              : "bg-white border-slate-200 text-slate-600"
                          }`}
                        >
                          <p className="text-[10px] font-bold">Étape 4</p>
                          <p className="text-[11px] mt-0.5 font-semibold">CNSS & RC</p>
                          <span className="text-[9px] block text-slate-400">{criCompletedSteps.cnss ? "✓ Validé" : "À Faire"}</span>
                        </button>
                      </div>

                      {/* Explicit simulation Form */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider block border-b border-slate-200 pb-1.5">
                          📄 FICHE UNIQUE D'ENREGISTREMENT (CRI)
                        </span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Référence Certificat Négatif</label>
                            <input 
                              type="text" 
                              value={criFormData.negativeCertNumber} 
                              onChange={(e) => setCriFormData({...criFormData, negativeCertNumber: e.target.value})}
                              className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Forme d'Entreprise</label>
                            <select 
                              value={criFormData.legalForm} 
                              onChange={(e) => setCriFormData({...criFormData, legalForm: e.target.value})}
                              className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                            >
                              <option value="SARL">SARL (Société à Responsabilité Limitée)</option>
                              <option value="SARL-AU">SARL Associé Unique</option>
                              <option value="SA">SA (Société Anonyme de droit public)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Montant du Capital Social</label>
                            <input 
                              type="text" 
                              value={`${criFormData.capital} MAD`} 
                              onChange={(e) => setCriFormData({...criFormData, capital: e.target.value})}
                              className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Nom complet du Fondateur / Gérant</label>
                            <input 
                              type="text" 
                              value={criFormData.managerFullName} 
                              onChange={(e) => setCriFormData({...criFormData, managerFullName: e.target.value})}
                              className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">CIN Nationale / N° de Séjour</label>
                            <input 
                              type="text" 
                              value={criFormData.managerCin} 
                              onChange={(e) => setCriFormData({...criFormData, managerCin: e.target.value})}
                              className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Nombre total d'associés</label>
                            <input 
                              type="number" 
                              value={criFormData.partnersListCount} 
                              onChange={(e) => setCriFormData({...criFormData, partnersListCount: e.target.value})}
                              className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Adresse de domiciliation (Siège social officiel au Maroc)</label>
                          <input 
                            type="text" 
                            value={criFormData.companyAddress} 
                            onChange={(e) => setCriFormData({...criFormData, companyAddress: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Régime Douanier d'Exportation sollicité</label>
                          <input 
                            type="text" 
                            value={criFormData.customsRegimen} 
                            onChange={(e) => setCriFormData({...criFormData, customsRegimen: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs"
                          />
                        </div>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-2.5 text-xs text-emerald-950">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <strong>Validation Guichet CRI :</strong> Les informations fournies sont conformes aux dispositions OMPIC. Veuillez soumettre ces informations consolidées directement sur le portail d'immatriculation du CRI régional compétent pour obtenir votre Identifiant Commun de l'Entreprise (ICE) sous 48h.
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Active Business Plan Tab */}
                  {activeTab === "business-plan" && (
                    <motion.div
                      key="business-plan"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 text-left"
                    >
                      <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                            Rédacteur de Business Plan d'Exportation & Investissement
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Modélisation des projections de financement et BFR exportateur présentable aux banques de la place marocaine.
                          </p>
                        </div>
                        {bpResponse && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(bpResponse);
                              setBpCopied(true);
                              setTimeout(() => setBpCopied(false), 2000);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-slate-950 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
                          >
                            <Download className="w-3.5 h-3.5" />
                            {bpCopied ? "Copié !" : "Copier le Business Plan"}
                          </button>
                        )}
                      </div>

                      <div className="bg-purple-50 text-purple-950 p-4 rounded-2xl text-xs border border-purple-100/60 leading-relaxed">
                        <strong>Importance Bancaire du Business Plan :</strong> Les banques nationales marocaines partenaires de Tamwilcom (comme Bank of Africa, Attijariwafa, BCP) analysent le plan d'investissement initial, le calcul précis du Besoin en Fonds de Roulement (BFR) lié aux délais de rapatriement de 150 jours, avant de formaliser l'éligibilité au crédit.
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Description détaillée du programme d'investissement
                          </label>
                          <textarea 
                            value={bpInputs.investmentDescription}
                            onChange={(e) => setBpInputs({...bpInputs, investmentDescription: e.target.value})}
                            rows={3}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            placeholder="Détaillez par exemple : achat de camions frigorifiques, caution douanière, prospection subsaharienne..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Objectif de Marges Commerciales Prévisionnelles
                          </label>
                          <input 
                            type="text"
                            value={bpInputs.expectedMargins}
                            onChange={(e) => setBpInputs({...bpInputs, expectedMargins: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            placeholder="Ex. 25% de marge brute récurrente"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGenerateBusinessPlan}
                        disabled={bpLoading}
                        className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-white transition duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                          bpLoading ? "bg-slate-400 cursor-not-allowed animate-pulse" : "bg-purple-700 hover:bg-purple-800"
                        }`}
                      >
                        {bpLoading ? (
                          <span>Réalisation de la modélisation à 3 ans par l'IA financière...</span>
                        ) : (
                          <span>Générer le Business Plan Complet (IA)</span>
                        )}
                      </button>

                      {bpResponse && (
                        <div className="border border-slate-200 bg-white p-5 rounded-2xl shadow-inner max-h-[500px] overflow-y-auto mt-4">
                          <MarkdownViewer text={bpResponse} />
                        </div>
                      )}
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>

            {/* Custom Interactive informational credit simulator */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm shadow-slate-100 print:hidden">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                <Coins className="w-4 h-4 text-emerald-600" />
                Dépôt des demandes de garantie de crédit
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Rappel de conformité de l'État : l'entreprise n'interagit pas directement avec <strong>Tamwilcom</strong>. 
                Toutes les démarches s'effectuent par le guichet de votre banque marocaine partenaire de choix. 
                Si admissible, le système de modélisation bancaire déclenche la signature de garantie instantanément en ligne sous 7 à 15 jours.
              </p>
            </div>

          </div>

        </div>
      </main>

      {/* Structured informational footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800 mt-12 print:hidden select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Globe2 className="w-4 h-4 text-white" />
                </div>
                <h5 className="font-bold">Maroc Entreprise Financement</h5>
              </div>
              <p className="text-slate-400 text-xs leading-normal">
                Dispositif consultatif d'intelligence réglementaire et d'ingénierie financière pour les entreprises marocaines. Il consolide les guides officiels, les lois de change et les mécanismes d'appui de Tamwilcom pour structurer vos projets d'investissement.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-slate-200 mb-4 uppercase text-xs tracking-wider">Références Réglementaires</h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>• Administration des Douanes et Impôt Directs (ADII)</li>
                <li>• Office des Changes - Directive Exportation Maroc</li>
                <li>• Tamwilcom - Fonds de Garantie National d'Exportation</li>
                <li>• Charte Marocaine de l'Investissement 2026</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-slate-200 mb-4 uppercase text-xs tracking-wider">Logistique Routière Subsaharienne</h5>
              <p className="text-xs text-slate-400 leading-normal mb-3">
                Transit sécurisé au passage frontalier d'El Guerguerat pour les convois terrestres reliant Tanger Med et Casablanca à Dakar, Nouakchott, Bamako et Abidjan.
              </p>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                Axe Casablanca - Dakar : Transit routier optimal ~ 5-7 Jours
              </span>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-xs text-white">
            © 2026 Maroc Entreprise Financement. Propulsé par Media Tower. Tous droits réservés.
          </div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[350px] sm:w-[400px] flex flex-col overflow-hidden mb-4"
              style={{ maxHeight: '600px', height: 'calc(100vh - 120px)' }}
            >
              <div className="bg-emerald-900 text-white p-4 flex items-center justify-between shadow-md z-10 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center border border-emerald-700">
                    <Bot className="w-4 h-4 text-emerald-100" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Expert Économie Marocaine</h3>
                    <p className="text-[10px] text-emerald-300">Consultant IA - 2026-2030</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setChatLang(chatLang === 'fr' ? 'ar' : 'fr')}
                    className="text-xs font-bold w-8 h-6 flex items-center justify-center bg-emerald-800 hover:bg-emerald-700 border border-emerald-600 rounded text-emerald-100 transition"
                    title="Changer de langue / تغيير اللغة"
                  >
                    {chatLang === 'fr' ? 'AR' : 'FR'}
                  </button>
                  <button 
                    onClick={() => setChatOpen(false)}
                    className="text-emerald-300 hover:text-white transition p-1 hover:bg-emerald-800 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 flex flex-col">
                {chatMessages.length === 0 && (
                  <div className="text-center text-slate-500 text-xs my-auto italic p-4 bg-white rounded-xl border border-slate-100 shadow-sm" dir={chatLang === 'ar' ? 'rtl' : 'ltr'}>
                    {chatLang === 'ar' 
                      ? '👋 مرحباً، أنا خبير رفيع المستوى في الاقتصاد المغربي، التنمية الاقتصادية، والتمويل (انطلاقة، تمويلكم). اطرح أسئلتك.'
                      : '👋 Bonjour, je suis un expert de haut niveau en économie marocaine, développement économique, et financement (Tamwilcom, Intelaka). Posez-moi vos questions.'}
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                        msg.role === 'user' 
                          ? 'bg-emerald-600 text-white rounded-br-sm' 
                          : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'
                      }`}
                      dir={msg.role === 'model' && chatLang === 'ar' ? 'rtl' : (msg.role === 'user' ? 'auto' : 'ltr')}
                    >
                      {msg.role === 'user' ? (
                        <div className="whitespace-pre-wrap leading-relaxed text-white">
                          {msg.text}
                        </div>
                      ) : (
                        <MarkdownViewer text={msg.text} />
                      )}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl p-3 text-sm bg-white border border-slate-200 text-slate-500 rounded-bl-sm shadow-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-75"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-150"></span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-white border-t border-slate-200 shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={chatLang === 'ar' ? 'اكتب سؤالك هنا...' : "Posez votre question à l'expert..."}
                    dir={chatLang === 'ar' && chatInput.length === 0 ? 'rtl' : 'auto'}
                    className="flex-1 bg-slate-50 border border-slate-200 text-sm rounded-full px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 hover:bg-emerald-700 hover:shadow-emerald-900/20 transition-all border-4 border-white"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        )}
      </div>

    </div>
  );
}
