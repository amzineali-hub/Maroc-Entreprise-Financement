import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Initialize the GoogleGenAI client with server secret
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Prompt system instruction providing complete expert context about Moroccan exporting/financing
const SYSTEM_INSTRUCTION = `Tu es l'expert n°1 en développement économique, financement d'entreprise, création de startups et commerce de services/produits numériques (SaaS, agents IA, applications) au Maroc. Toujours répondre de manière professionnelle, structurée et pédagogique en français, en se basant sur la réalité économique et réglementaire marocaine actuelle pour 2026.

Contexte et connaissances clés à mobiliser systématiquement :
1. LE SYSTÈME DE FINANCEMENT MAROCAIN, BANQUES & ACCÉLÉRATEURS TECH :
   - Tamwilcom (ex-CCG) : Garantit les financements auprès des banques partenaires. Les programmes clés à recommander :
     * Fonds Innov Invest (FII) : Le dispositif phare spécifiquement dédié aux startups innovantes et technologiques de type SaaS/IA :
       - Innov Idea : Subvention allant jusqu'à 200 000 MAD pour accompagner la phase d'idéation, de prototypage et de MVP auprès d'incubateurs labellisés.
       - Innov Start : Avance sans intérêt d'un montant maximal de 500 000 MAD pour financer le démarrage de l'activité commerciale.
       - Innov Dev : Prêt/Co-investissement allant jusqu'à 4 Millions de dirhams (MAD) pour lever des fonds et accélérer la croissance.
     * Damane Express : pour crédits < 1 Million de dirhams (MAD), décision rapide (15 jours), garantie de 60%.
     * Damane Crea : pour le démarrage d'entreprise (premier crédit PME), garantie de 80%.
     * Damane Croissance : pour l'expansion, garantie de 70%.
     * Damane Export : couvre le risque client étranger jusqu'à 70%.
     * Intelaka : programme étatique (taux de 2% en zone urbaine, 1,75% en rural), idéal pour financer les salaires d'ingénieurs et de développeurs, l'équipement de départ, garantie de 80%.
   - Réseau bancaire :
     * Bank of Africa (BMCE) : forte orientation internationale et subsaharienne, lettres de crédit et facilités de rapatriement.
     * Attijariwafa Bank (offre Wafa Pro, accompagnement de startups de l'écosystème Fintech, leader du marché).
     * CIH Bank & Banque Populaire (solutions e-commerce, Najahi Pro).

2. CAS DU SAAS, APPLICATIONS ET AGENTS IA (EXPORTATION NUMÉRIQUE / E-EXPORT) :
   - Une startup technologique n'est pas obligée de relier son programme à l'exportation physique classique (pas de transit terrestre par El Guerguerat ni conteneur Tanger Med). L'exportation s'effectue sous forme d'e-exportation de services en ligne à l'échelle mondiale ou vers l'Afrique subsaharienne via Internet.
   - Les enjeux prioritaires du SaaS & Digital au Maroc :
     * Dotation Technologique / Startup de l'Office des Changes : Permet d'obtenir une allocation en devises allant jusqu'à 1 Million de dirhams (MAD) par an pour les startups labellisées par l'ADD (Agence de Développement Digital) ou ayant le statut d'entreprise innovante. Cette dotation est essentielle pour payer l'infrastructure cloud étrangère (AWS, Azure, Vercel, Google Cloud), les API d'intelligence artificielle (apis Gemini de Google, OpenAI, etc.), ou les campagnes publicitaires de croissance mondiale (Google Ads, Meta).
     * Plateformes de paiement en ligne (Passerelles de paiement) : Utilisation de solutions locales comme le CMI (Centre Monétique Interbancaire) / PayZone, ou configurations internationales éprouvées par les fondateurs marocains (comme passer par une filiale Stripe Atlas internationale reliée à un compte en devises au Maroc, ou collecteurs globaux tels que Paddle gérant la TVA internationale automatiquement).
     * Rapatriement de devises à l'export de services et SaaS : La réglementation des changes impose un rapatriement mais permet de conserver jusqu'à 70% voire 100% de ses recettes d'exportation sur un compte professionnel en devises ou en dirhams convertibles pour financer directement ses développements et technologies globales sans frottement administratif.
     * Acteurs de l'accompagnement : ADD (Agence de Développement Digital), l'APEBI (Fédération des Technologies de l'Information, des Télécommunications et de l'Offshoring), les Technoparks (Casablanca, Rabat, Tanger, Agadir, Oujda) qui offrent des espaces de coworking, de la domiciliation à coût réduit et un écosystème de mentors.

3. LES DÉMARCHES PRIORITAIRES POUR L'EXPORT CONVENTIONNEL (AGRO, INDUSTRIE, TEXTILE) :
   - Étape 1 : Diagnostic & Accompagnement (S'adresser à l'AMDIE et à l'ASMEX).
   - Étape 2 : Conformité Douanière & Réglementation (Immatriculation d'exportateur ADII, EUR.1, accords bilatéraux, ZLECAF).
   - Étape 3 : Contrôle des Changes (Office des Changes : rapatriement de 150 jours).
   - Étape 4 : Logistique & Expédition (Tanger Med maritime, axe terrestre d'El Guerguerat).
   - Étape 5 : Sécurisation (Damane Export, affacturage international [Wafa Affacturage, BMCE Capital Affacturage]).

Analyse l'entreprise de l'utilisateur sur la base de ses saisies et propose un rapport hautement personnalisé et concret. Si l'entreprise propose des services SaaS, applications ou agents IA, oriente TOUTES les explications sur l'e-exportation numérique, la dotation technologique de l'Office des Changes, le financement de Tamwilcom (Fonds Innov Invest), la facturation cloud, et les solutions CMI/Paddle/Stripe, en évitant les aspects logistiques physiques (El Guerguerat, transit douanier physique). Reste extrêmement rigoureux et professionnel au format Markdown, avec les sections suivantes :
1. **Évaluation Synthétique** de l'éligibilité et du profil (BFR estimé ou Cash-runway, structure adaptée).
2. **Recommandations de Financement et Prêts** (Spécifier le programme : par exemple, Fonds Innov Invest [Innov Start / Innov Idea] pour le SaaS/Tech, ou Intelaka/Damane Express, taux TAEG espéré, banque ou réseau d'accompagnement à prioriser).
3. **Parcours Digital ou Douanier sur mesure** (Dotation technologique, configuration de paiement Stripe/Paddle/CMI, conformité Office des Changes).
4. **Feuille de Route Chronologique (4 Étapes prioritaires)**.`;

app.post("/api/analyze", async (req, res) => {
  try {
    const {
      companyName,
      industry,
      currentRevenue,
      region,
      targetAfricanRegion,
      hasPriorExportExperience,
      exportProduct,
      fundingNeeded,
      lang,
    } = req.body;

    // Validate request
    if (!industry || !currentRevenue || !region) {
      return res.status(400).json({ error: "Les champs Secteur, Chiffre d'Affaires et Région sont requis." });
    }

    const nameStr = companyName ? `de l'entreprise "${companyName}"` : "de l'entreprise";
    const prompt = `Voici les caractéristiques ${nameStr} :
- Secteur d'activité : ${industry}
- Chiffre d'affaires annuel : ${currentRevenue}
- Région d'origine au Maroc : ${region}
- Produit proposé à l'exportation : ${exportProduct || "Non spécifié"}
- Pays/Zone ciblé en Afrique subsaharienne : ${targetAfricanRegion || "Non spécifié"}
- Type de besoin de financement identifié : ${fundingNeeded || "Besoin d'exploitation ou d'amorçage export"}
- Expérience préalable à l'export : ${hasPriorExportExperience ? "Oui, dispose d'une première expérience" : "Non, est novice en matière d'exportation"}

Rédige un rapport stratégique et d'ingénierie financière ciblé selon ces paramètres. Reste aligné sur la réalité économique marocaine de l'année 2026. ${lang === 'ar' ? 'Veuillez rédiger le rapport final INTÉGRALEMENT ET EXCLUSIVEMENT EN ARABE (العربية).' : 'Veuillez rédiger le rapport final EN FRANÇAIS.'}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      analysis: response.text,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Erreur d'analyse Gemini:", error);
    res.status(500).json({
      error: "Une erreur est survenue lors de la génération de l'analyse.",
      details: error.message || error,
    });
  }
});

// New endpoint to generate full Moroccan SARL Bylaws templates using AI
app.post("/api/generate-bylaws", async (req, res) => {
  try {
    const { companyName, capital, managerName, region, industry, sharesCount, lang } = req.body;
    
    const company = companyName || "NOM_DE_LA_SOCIETE";
    const capValue = capital || "100 000";
    const manager = managerName || "NOM_DU_GERANT";
    const city = region || "Casablanca";
    const businessField = industry || "Commerce et Exportation";
    const sharesNum = sharesCount || "1 000";
    const shareFaceValue = Math.floor(parseInt(capValue.replace(/\s/g, "")) / parseInt(sharesNum)) || "100";

    const prompt = `Génère des statuts officiels types, très complets et juridiquement précis, pour une Société à Responsabilité Limitée (SARL) de droit marocain (Loi n° 5-96).
    
    Détails à insérer :
    - Dénomination sociale : SARL "${company}"
    - Capital social : ${capValue} dirhams (MAD) divisé en ${sharesNum} parts de ${shareFaceValue} MAD chacune.
    - Gérant Unique nommé : Monsieur/Madame ${manager}
    - Siège social : ${city}, Maroc
    - Objet social de l'entreprise : ${businessField} et activités de commerce d'import-export connexes.
    
    Rédige l'intégralité des articles indispensables (de l'Article 1 à l'Article 15 au moins) avec des clauses de libération du capital, cession de parts, gérance, et dissolution, adaptées à la loi marocaine de manière exhaustive et réaliste pour l'année 2026. Reste neutre et extrêmement structuré au format Markdown. ${lang === 'ar' ? 'Veuillez rédiger les statuts INTÉGRALEMENT ET EXCLUSIVEMENT EN ARABE (العربية).' : 'Veuillez rédiger les statuts EN FRANÇAIS.'}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Tu es un éminent avocat d'affaires et conseiller juridique marocain spécialisé dans la création d'entreprises. Rédige des modèles de statuts juridiques officiels et rigoureux en français.",
        temperature: 0.6,
      },
    });

    res.json({
      success: true,
      bylaws: response.text,
    });
  } catch (error: any) {
    console.error("Erreur lors de la génération de statuts:", error);
    res.status(500).json({ error: "Impossible de générer le modèle de statuts pour la SARL." });
  }
});

// New endpoint to generate professional Business Plans for exporters
app.post("/api/generate-business-plan", async (req, res) => {
  try {
    const { 
      companyName, 
      industry, 
      currentRevenue, 
      region, 
      targetAfricanRegion, 
      exportProduct,
      fundingNeeded,
      investmentDescription,
      expectedMargins,
      lang
    } = req.body;

    const company = companyName || "Atlas Agro";
    const product = exportProduct || "Agrumes de grande qualité";
    const market = targetAfricanRegion || "Sénégal & Côte d'Ivoire";
    const capitalNeed = fundingNeeded || "1 000 000 MAD";
    const desc = investmentDescription || "Financement des infrastructures de stockage frigorifique";
    const margins = expectedMargins || "20%";

    const isDigital = /tech|soft|logiciel|saas|ia|digit|computer|offsh|réseaux|intel/i.test(industry || "") || 
                      /saas|application|agent|ia|digital|software/i.test(exportProduct || "") ||
                      /saas|application|agent|ia|digital|software/i.test(investmentDescription || "");

    let prompt = "";
    let bpSystemInstruction = "";

    if (isDigital) {
      prompt = `Construis un Business Plan de Startup SaaS et Services Digitaux (E-Exportation) hautement crédible, complet et structuré en français pour l'année 2026, conçu pour être présenté à des banques marocaines (comme Attijariwafa Bank, Bank of Africa) et à Tamwilcom (dans le cadre du Fonds Innov Invest ou de prêts d'amorçage).
      
      Paramètres fondamentaux :
      - Nom de la Startup : ${company}
      - Solution SaaS / Services Numériques : ${product}
      - Secteur d'activité : ${industry}
      - Région de développement (Maroc) : ${region}
      - Marché(s) cible(s) d'exportation en ligne : ${market}
      - Montant & Type de besoin : ${capitalNeed}
      - Utilisation des fonds (R&D, serveurs, salaires, cloud, marketing) : ${desc}
      - Marge brute prévisionnelle visée : ${margins}
      
      Le document généré doit comprendre les sections standard suivantes en Markdown rigoureux, riche en détails réalistes pour l'économie numérique du Maroc :
      1. EXÉCUTIF SUMMARY (La vision stratégique du SaaS/IA, la scalabilité du modèle par rapport à de l'exportation physique classique, opportunité d'e-export globale)
      2. ANALYSE DU PRODUIT ET MARCHÉ CIBLE (Description de la stack technologique, MVP, avantage concurrentiel de la tech marocaine, de l'acquisition client en ligne B2B/B2C, et gestion du churn/LTV [Customer Lifetime Value])
      3. PLAN TECHNIQUE & MODÈLE FINANCIER SAAS (Tarification par abonnement MRR/ARR, passerelle de paiement [CMI/Paddle/Stripe], conformité douanière logicielle avec l'Office des Changes en mobilisant la Dotation Technologique de 500k-1M MAD pour financer les serveurs cloud AWS/Vercel/API Gemini et le compte de devises d'exportateur)
      4. PLAN FINANCIER PRÉVISIONNEL (Tableau de l'investissement initial, Tableau du besoin en fonds de roulement BFR de développement [salaires des dev, serveurs], et tableau prévisionnel d'amortissement / rentabilité à 3 ans avec marge de ${margins}).
      
      Reste très rigoureux, chiffré et réaliste sur les coûts d'infrastructure, de serveurs de calcul IA, et taux de croissance d'un SaaS en 2026. ${lang === 'ar' ? 'Veuillez rédiger le Business Plan INTÉGRALEMENT ET EXCLUSIVEMENT EN ARABE (العربية).' : 'Veuillez rédiger le Business Plan EN FRANÇAIS.'}`;

      bpSystemInstruction = "Tu es un directeur de cabinet-conseil en capital-risque (VC) de premier ordre au Maroc, spécialisé dans la structuration financière et la levée de fonds (Tamwilcom Fonds Innov Invest, Seed Rounds) pour startups technologiques SaaS, IA et e-commerce. Rédige un Business Plan SaaS impeccable au format financier professionnel.";
    } else {
      prompt = `Construis un Business Plan d'Exportation classique hautement crédible, complet et structuré en français, conçu pour être présenté à des banques marocaines (comme Bank of Africa ou Attijariwafa Bank) et à Tamwilcom pour l'année 2026.
      
      Paramètres fondamentaux :
      - Nom du Projet : ${company}
      - Produit / Service : ${product}
      - Secteur d'activité : ${industry}
      - Région d'origine (Maroc) : ${region}
      - Zone d'expansion visée : ${market}
      - Montant & Type de besoin : ${capitalNeed}
      - Utilisation des fonds : ${desc}
      - Marge prévisionnelle visée : ${margins}
      
      Le document généré doit comprendre les sections standard suivantes en Markdown rigoureux, riche en détails réalistes :
      1. EXÉCUTIF SUMMARY (La vision stratégique du projet d'export, opportunité subsaharienne dans le cadre de la ZLECAF)
      2. ANALYSE DU MARCHÉ & PRODUIT (Description de l'avantage compétitif du produit marocain, barrières tarifaires et régulations douanières de destination)
      3. PLAN LOGISTIQUE & DISTRIBUTION (Axe terrestre via El Guerguerat ou maritime Tanger Med vers les ports subsahariens)
      4. PLAN FINANCIER PRÉVISIONNEL (Tableau d'investissement initial, Tableau du besoin en fonds de roulement BFR à l'export, et Tableau des prévisions d'amortissement / rentabilité à 3 ans avec marge de ${margins}).
      
      Reste très rigoureux et réaliste sur les coûts, taux et régulations d'export en 2026. ${lang === 'ar' ? 'Veuillez rédiger le Business Plan INTÉGRALEMENT ET EXCLUSIVEMENT EN ARABE (العربية).' : 'Veuillez rédiger le Business Plan EN FRANÇAIS.'}`;

      bpSystemInstruction = "Tu es un directeur de cabinet-conseil de premier ordre au Maroc, spécialisé dans la levée de fonds pour PME et les investissements à l'export vers l'Afrique subsaharienne. Rédige un Business Plan de premier choix sous format financier professionnel.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: bpSystemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      businessPlan: response.text,
    });
  } catch (error: any) {
    console.error("Erreur lors de la génération du Business Plan:", error);
    res.status(500).json({ error: "Impossible de générer le Business Plan d'exportation pour l'instant." });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { history, message, lang } = req.body;
    
    const contents = history ? [...history] : [];
    contents.push({ role: "user", parts: [{ text: message }] });

    const langInstruction = lang === 'ar' 
      ? "\n\nTu es maintenant dans un mode Chat conversationnel. Réponds DIRECTEMENT ET EXCLUSIVEMENT EN ARABE (العربية). Sois concis et professionnel."
      : "\n\nTu es maintenant dans un mode Chat conversationnel. Réponds DIRECTEMENT ET EXCLUSIVEMENT EN FRANÇAIS. Sois concis et professionnel.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + langInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      text: response.text,
    });
  } catch (error: any) {
    console.error("Erreur d'analyse Gemini Chat:", error);
    res.status(500).json({
      error: "Une erreur est survenue lors de la conversation.",
      details: error.message || error,
    });
  }
});

// Serve client assets in dev or production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Dans l'environnement Vercel, on ne sert pas les statiques via express 
    // car Vercel's Edge/Static routing le fait déjà. On ajoute un fallback classique au besoin.
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      if (!req.url.startsWith('/api')) {
         res.sendFile(path.join(distPath, "index.html"));
      }
    });
  }

  // Ne démarrer le serveur (app.listen) que si on n'est pas sur Vercel
  // Vercel utilise le module exporté pour son infrastructure Serverless.
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

export default app;
