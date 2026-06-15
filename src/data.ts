export interface SimulationPreset {
  name: string;
  description: string;
  companyName: string;
  industry: string;
  currentRevenue: string;
  region: string;
  targetAfricanRegion: string;
  exportProduct: string;
  fundingNeeded: string;
  hasPriorExportExperience: boolean;
}

export const PRESETS: SimulationPreset[] = [
  {
    name: "🍞 Boulangerie Artisanale (Casablanca)",
    description: "Besoin de 400k MAD pour nouveaux fours et cellule de surgélation.",
    companyName: "Boulangerie Pâtisserie de l'Anfa",
    industry: "Agroalimentaire",
    currentRevenue: "1M - 5M MAD (Petite PME)",
    region: "Casablanca-Settat",
    targetAfricanRegion: "Afrique de l'Ouest (Sénégal, Côte d'Ivoire, Mali, etc.)",
    exportProduct: "Biscuits secs artisanaux et viennoiseries de longue conservation",
    fundingNeeded: "Crédit d'équipement (Achat de machines, outillage)",
    hasPriorExportExperience: false,
  },
  {
    name: "💻 Startup Tech (Rabat)",
    description: "Besoin de 800k MAD de trésorerie pour étendre l'équipe offshore.",
    companyName: "Zenith Software Systems",
    industry: "Technologies & Offshoring",
    currentRevenue: "1M - 5M MAD (Petite PME)",
    region: "Rabat-Salé-Kénitra",
    targetAfricanRegion: "Sénégal, Côte d'Ivoire",
    exportProduct: "Logiciels de gestion SaaS et services de développement informatique",
    fundingNeeded: "Crédit fonds de roulement BFR (Achat matières, salaires)",
    hasPriorExportExperience: false,
  },
  {
    name: "🏭 Textile Industriel (Tanger)",
    description: "Besoin de 12M MAD pour l'extension d'un hangar logistique et des machines.",
    companyName: "Tanger Industrial Fabrics",
    industry: "Textile & Habillement",
    currentRevenue: "20M - 50M MAD (Grande PME)",
    region: "Tanger-Tétouan-Al Hoceïma",
    targetAfricanRegion: "Afrique de l'Ouest (Sénégal, Côte d'Ivoire, Mali, etc.)",
    exportProduct: "Tissus techniques de protection et prêt-à-porter",
    fundingNeeded: "Crédit d'investissement export (Installation, promotion)",
    hasPriorExportExperience: true,
  },
];

export const INDUSTRIES = [
  "Agroalimentaire",
  "Textile & Habillement",
  "Automobile & Pièces",
  "Aéronautique",
  "Chimie & Parachimie",
  "Technologies & Offshoring",
  "Services aux entreprises B2B",
  "Artisanat d'art & Luxe",
  "Énergies renouvelables & Cleantech",
  "Matériaux de construction & BTP",
];

export const REVENUE_OPTIONS = [
  { value: "< 1M MAD (Très petite entreprise)", label: "Très petite (< 1 Million MAD)" },
  { value: "1M - 5M MAD (Petite PME)", label: "Petite PME (1M à 5M MAD)" },
  { value: "5M - 20M MAD (Moyenne PME)", label: "Moyenne PME (5M à 20M MAD)" },
  { value: "20M - 50M MAD (Grande PME)", label: "Grande PME (20M à 50M MAD)" },
  { value: "> 50M MAD (Établie / ETI)", label: "Grande Entreprise (Supérieur à 50 Millions MAD)" },
];

export const REGIONS = [
  "Casablanca-Settat",
  "Rabat-Salé-Kénitra",
  "Tanger-Tétouan-Al Hoceïma",
  "Fès-Meknès",
  "Marrakech-Safi",
  "Souss-Massa",
  "Oriental",
  "Béni Mellal-Khénifra",
  "Drâa-Tafilalet",
  "Guelmim-Oued Noun",
  "Laâyoune-Sakia El Hamra",
  "Dakhla-Oued Ed-Dahab",
];

export const AFRICAN_REGIONS = [
  "Afrique de l'Ouest (Sénégal, Côte d'Ivoire, Mali, etc.)",
  "Afrique Centrale (Cameroun, Gabon, Congo, etc.)",
  "Afrique de l'Est (Kenya, Rwanda, Éthiopie)",
  "Afrique Australe (Afrique du Sud, Angola, etc.)",
];

export const FUNDING_NEEDS = [
  "Crédit fonds de roulement BFR (Achat matières, salaires)",
  "Crédit d'équipement (Achat de machines, outillage)",
  "Crédit d'investissement export (Installation, promotion)",
  "Démarrage & Amorçage (Startup / Intelaka)",
];

export interface BankMatch {
  name: string;
  share: string;
  logoColor: string;
  rating: number;
  reason: string;
  program: string;
}

export function getBankMatches(industry: string, revenue: string): BankMatch[] {
  // Return tailored bank advice list
  return [
    {
      name: "Bank of Africa (BMCE)",
      share: "18% PDM",
      logoColor: "bg-blue-600",
      rating: industry === "Agricultural" || industry === "Agroalimentaire" ? 92 : 98,
      reason: "Réseau panafricain majeur présent dans plus de 20 pays subsahariens. Experts incontournables des transactions d'export vers l'Afrique.",
      program: "Gamme BMCE Pro & Financements Structurés à l'Export",
    },
    {
      name: "Attijariwafa Bank",
      share: "28% PDM",
      logoColor: "bg-amber-500",
      rating: 94,
      reason: "Leader national du financement des PME, solutions d'affacturage international de premier ordre et forte couverture ouest-africaine.",
      program: "Offre Wafa Pro Export & Wafa Affacturage",
    },
    {
      name: "Banque Populaire (BCP)",
      share: "24% PDM",
      logoColor: "bg-orange-600",
      rating: 88,
      reason: "Excellente force de frappe régionale et provinciale au Maroc, Idéal pour financer les extensions locales destinées à l'export.",
      program: "Lignes Najahi Pro et Crédit d'Amortissement",
    },
    {
      name: "Crédit Agricole du Maroc",
      share: "Leader Rural",
      logoColor: "bg-emerald-600",
      rating: industry === "Agroalimentaire" ? 96 : 70,
      reason: industry === "Agroalimentaire" 
        ? "Le partenaire stratégique pour l'amont et l'aval agricole et agroalimentaire, facilitant les crédits avec subventions du Ministère."
        : "Spécialiste du domaine vert et agricole. Moins de connexions subsahariennes pour les autres industries.",
      program: "Ligne verte et Financement de Campagne",
    },
    {
      name: "CIH Bank",
      share: "12% PDM",
      logoColor: "bg-amber-600",
      rating: revenue.includes("< 1M") || revenue.includes("1M - 5M") ? 85 : 78,
      reason: "Processus d'octroi de crédit rapide et 100% digital pour les montants inférieurs à 1 Million de dirhams.",
      program: "Offre CIH Pro en ligne",
    },
  ].sort((a, b) => b.rating - a.rating);
}

export interface DocChecklistItem {
  category: string;
  name: string;
  desc: string;
  required: boolean;
}

export function getChecklist(revenue: string, fundingNeeded: string): DocChecklistItem[] {
  const items: DocChecklistItem[] = [
    {
      category: "Documents juridiques (Obligatoires)",
      name: "Statuts de l'entreprise à jour",
      desc: "Statuts SARL, SARL-AU ou SAS signés et conformes.",
      required: true,
    },
    {
      category: "Documents juridiques (Obligatoires)",
      name: "Extrait du Registre de Commerce (RC)",
      desc: "Doit être daté de moins de 3 mois pour être accepté par le comité de crédit.",
      required: true,
    },
    {
      category: "Documents juridiques (Obligatoires)",
      name: "Identifiant Fiscal (IF) et ICE",
      desc: "Numéros uniques obligatoires pour prouver l'existence formelle de la structure.",
      required: true,
    },
    {
      category: "Documents juridiques (Obligatoires)",
      name: "Procès-Verbal de l'Assemblée Générale (PV d'AG)",
      desc: "PV autorisant formellement l'emprunt financier et l'engagement des cautions.",
      required: true,
    },
  ];

  if (revenue.includes("< 1M") || revenue.includes("1M - 5M")) {
    items.push({
      category: "Documents financiers (Évaluation risque)",
      name: "Prévisionnel financier sur 3 ans (P&L, BFR, Trésorerie)",
      desc: "Requis pour les jeunes PME ou celles n'ayant pas 3 bilans certifiés.",
      required: true,
    });
  } else {
    items.push({
      category: "Documents financiers (Évaluation risque)",
      name: "Bilans comptables certifiés des 3 derniers exercices",
      desc: "Liasse fiscale complète certifiée par expert-comptable + Comptes de résultat.",
      required: true,
    });
  }

  items.push(
    {
      category: "Documents financiers (Évaluation risque)",
      name: "Attestation de régularité fiscale (DGI) et CNSS",
      desc: "Prouve que la PME est formellement enregistrée et à jour de ses cotisations.",
      required: true,
    },
    {
      category: "Documents financiers (Évaluation risque)",
      name: "Relevés de comptes d'autres banques (6 derniers mois)",
      desc: "Permet d'analyser les flux de trésorerie réels si vous sollicitez une nouvelle banque.",
      required: false,
    }
  );

  if (fundingNeeded.includes("équipement")) {
    items.push({
      category: "Documents projet",
      name: "Factures proforma du matériel + Spécifications",
      desc: "Facture détaillée prouvant la destination de l'investissement de crédit équipement.",
      required: true,
    });
  } else if (fundingNeeded.includes("BFR")) {
    items.push({
      category: "Documents projet",
      name: "Business plan d'exportation détaillé (Projections BFR)",
      desc: "Document décrivant le cycle d'exploitation, les délais clients, et le besoin en fond de roulement.",
      required: true,
    });
  } else {
    items.push({
      category: "Documents projet",
      name: "Plan d'affaires stratégique d'investissement (3 à 5 ans)",
      desc: "Prédicteur clé de l'acceptation bancaire (analyse marché, ROI, projections financières).",
      required: true,
    });
  }

  items.push({
    category: "Garanties & Dirigeants",
    name: "CIN des dirigeants & Justificatifs de domicile",
    desc: "Pièces d'identité valides et facture de services publics de moins de 3 mois.",
    required: true,
  });

  if (fundingNeeded.includes("Intelaka")) {
    items.push({
      category: "Garanties & Dirigeants",
      name: "Avis d'imposition IR des 3 dernières années",
      desc: "Pour évaluer la solvabilité personnelle des dirigeants en cas de cautionnement requis.",
      required: true,
    });
  }

  return items;
}
