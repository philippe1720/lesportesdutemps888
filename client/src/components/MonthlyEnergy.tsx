import { motion } from "framer-motion";
import { Calendar, Sun, Sparkles, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

function reduceToSingle(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    let sum = 0;
    while (n > 0) {
      sum += n % 10;
      n = Math.floor(n / 10);
    }
    n = sum;
  }
  return n;
}

function sumDigits(n: number): number {
  let sum = 0;
  while (n > 0) {
    sum += n % 10;
    n = Math.floor(n / 10);
  }
  return sum;
}

function getUniversalYear(year: number): number {
  return reduceToSingle(sumDigits(year));
}

function getUniversalDay(day: number, month: number, year: number): number {
  const total = sumDigits(day) + sumDigits(month) + sumDigits(year);
  return reduceToSingle(total);
}

const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

interface MonthArticle {
  number: number;
  title: string;
  description: string;
  keywords: string;
}

const MONTHLY_ARTICLES_2026: MonthArticle[] = [
  {
    number: 2,
    title: "Coopération et Patience",
    description: "Janvier 2026 vibre sous l'énergie du 2 — le nombre de la diplomatie, de l'écoute et de la coopération. Après le démarrage de l'Année Universelle 1, ce premier mois invite à tisser des liens authentiques. C'est le moment idéal pour renforcer votre relation de couple en pratiquant l'écoute active. Les tensions familiales trouvent leur résolution dans le dialogue plutôt que dans l'affrontement. Laissez la douceur guider vos échanges et cultivez la patience : les graines plantées ce mois porteront leurs fruits.",
    keywords: "écoute, diplomatie, partenariat, patience, sensibilité"
  },
  {
    number: 3,
    title: "Expression et Créativité",
    description: "Février 2026 porte la vibration du 3 — nombre de l'expression, de la joie et de la créativité. L'énergie de ce mois vous pousse à communiquer vos sentiments avec plus de liberté. En couple, osez exprimer ce que vous ressentez vraiment : vos besoins, vos envies, vos rêves. La créativité est votre alliée pour réinventer votre quotidien à deux. Organisez des sorties, surprenez votre partenaire, laissez l'enfant intérieur s'exprimer. Les familles bénéficient de moments de partage ludiques et légers.",
    keywords: "expression, communication, joie, créativité, optimisme"
  },
  {
    number: 4,
    title: "Structure et Fondations",
    description: "Mars 2026 résonne avec l'énergie du 4 — le nombre de la construction, de la stabilité et du travail concret. Ce mois demande de poser des fondations solides dans vos relations. C'est le moment de définir ensemble des objectifs clairs pour votre couple ou votre famille : projets communs, organisation du quotidien, règles de vie. La rigueur et la discipline sont vos atouts. Attention cependant à ne pas devenir trop rigide — la structure doit servir l'harmonie, pas l'étouffer.",
    keywords: "structure, stabilité, organisation, travail, discipline"
  },
  {
    number: 5,
    title: "Changement et Liberté",
    description: "Avril 2026 vibre sur la fréquence du 5 — nombre du mouvement, du changement et de la liberté. L'énergie est dynamique et parfois imprévisible. En couple, c'est le moment d'accueillir le changement plutôt que de le fuir. Voyagez ensemble, explorez de nouvelles façons d'être à deux, brisez la routine. Les familles traversent des ajustements : déménagement, nouvelle activité, évolution des rôles. Gardez votre souplesse et votre ouverture d'esprit. L'adaptabilité est la clé de ce mois.",
    keywords: "changement, liberté, aventure, adaptabilité, mouvement"
  },
  {
    number: 6,
    title: "Amour et Responsabilité",
    description: "Mai 2026 baigne dans la vibration du 6 — le nombre de l'amour, du foyer et de la responsabilité familiale. C'est le mois le plus favorable pour les relations de couple et la vie de famille en 2026. L'énergie vous invite à prendre soin de votre nid, à embellir votre lieu de vie, à nourrir les liens affectifs. Les décisions familiales importantes sont favorisées. En amour, l'engagement sincère et la tendresse sont au rendez-vous. Attention à ne pas tomber dans le sacrifice excessif — prenez soin de vous aussi.",
    keywords: "amour, famille, harmonie, responsabilité, beauté"
  },
  {
    number: 7,
    title: "Introspection et Sagesse",
    description: "Juin 2026 porte l'énergie du 7 — nombre de la réflexion, de la spiritualité et de l'analyse intérieure. Ce mois invite à la pause et à l'introspection. Prenez du recul sur vos relations : qu'avez-vous appris depuis le début de l'année ? Quels schémas répétitifs observez-vous ? Le 7 favorise la compréhension profonde de vos dynamiques relationnelles. C'est un excellent mois pour entamer un travail de numérologie humaniste ou de coaching. Le silence et la solitude choisie sont ressourçants.",
    keywords: "introspection, analyse, spiritualité, méditation, sagesse"
  },
  {
    number: 8,
    title: "Pouvoir et Équilibre",
    description: "Juillet 2026 résonne avec la puissance du 8 — nombre de la manifestation, du pouvoir personnel et de l'abondance. L'énergie est forte et demande de l'équilibre. Dans vos relations, examinez la dynamique de pouvoir : qui décide ? Qui s'efface ? Le 8 vous invite à trouver un équilibre juste entre donner et recevoir. C'est aussi un mois propice pour concrétiser des projets de couple ambitieux. En famille, les questions matérielles et d'organisation trouvent des solutions concrètes.",
    keywords: "pouvoir, abondance, équilibre, manifestation, ambition"
  },
  {
    number: 9,
    title: "Bilan et Compassion",
    description: "Août 2026 vibre sous l'énergie du 9 — nombre de l'achèvement, de la compassion et de l'humanisme. Ce mois marque un temps de bilan dans vos relations. Qu'est-ce qui ne vous sert plus ? Quels liens ou habitudes êtes-vous prêt(e) à lâcher ? Le 9 demande de la générosité et du pardon. C'est le moment de guérir les blessures anciennes, de faire la paix avec le passé familial. La compassion — envers vous-même et envers vos proches — est la vibration maîtresse de ce mois.",
    keywords: "achèvement, compassion, pardon, générosité, universalité"
  },
  {
    number: 1,
    title: "Nouveau Départ",
    description: "Septembre 2026 revient à l'énergie du 1 — nombre du commencement, de l'initiative et de l'indépendance. Après le bilan du 9 en août, un nouveau cycle débute. C'est le moment d'oser de nouvelles approches dans votre couple : nouvelles habitudes de communication, nouveaux rituels à deux. En famille, encouragez l'autonomie de chacun tout en maintenant la cohésion du groupe. L'affirmation de soi est essentielle ce mois-ci — exprimez vos besoins clairement sans culpabilité.",
    keywords: "initiative, nouveauté, leadership, indépendance, courage"
  },
  {
    number: 11,
    title: "Illumination et Intuition",
    description: "Octobre 2026 porte la vibration exceptionnelle du 11 — nombre maître de l'illumination, de l'intuition et de l'inspiration. C'est un mois spirituellement très puissant. Vos perceptions sont amplifiées : écoutez votre intuition dans vos relations. Le 11 apporte des révélations sur la nature profonde de vos liens conjugaux et familiaux. Des rencontres significatives ou des prises de conscience majeures sont possibles. L'énergie est intense — canalisez-la par la méditation ou un accompagnement en numérologie.",
    keywords: "intuition, illumination, inspiration, vision, maîtrise spirituelle"
  },
  {
    number: 3,
    title: "Communication et Joie Retrouvée",
    description: "Novembre 2026 retrouve la vibration du 3 — expression, communication et optimisme. Après l'intensité du 11 en octobre, ce mois apporte de la légèreté. L'humour et la spontanéité reviennent dans vos échanges de couple. Les réunions familiales sont favorisées : fêtes, retrouvailles, moments de rire partagé. Profitez de cette énergie pour résoudre les malentendus en parlant avec le cœur. L'art et la culture sont d'excellents vecteurs de reconnexion avec votre partenaire.",
    keywords: "communication, joie, légèreté, expression, sociabilité"
  },
  {
    number: 4,
    title: "Consolidation et Bilan de l'Année",
    description: "Décembre 2026 clôture l'année sous l'énergie du 4 — structure, consolidation et ancrage. Ce dernier mois est fait pour solidifier les acquis relationnels de l'année. Faites le bilan de vos progrès en couple et en famille. Quelles fondations avez-vous posées ? Qu'avez-vous construit ensemble ? Le 4 invite à célébrer le concret : les petites victoires du quotidien, les habitudes positives installées. Préparez la transition vers 2027 (Année Universelle 2) en cultivant la gratitude et en posant des intentions claires.",
    keywords: "consolidation, bilan, gratitude, ancrage, préparation"
  }
];

const DAY_ENERGY_DESCRIPTIONS: Record<number, { title: string; message: string }> = {
  1: { title: "Initiative", message: "Journée idéale pour prendre des décisions, affirmer vos besoins et initier de nouvelles conversations avec votre partenaire." },
  2: { title: "Harmonie", message: "Favorisez l'écoute et la coopération aujourd'hui. Les compromis et la douceur renforcent vos liens affectifs." },
  3: { title: "Expression", message: "Exprimez vos émotions librement. La créativité et la communication ouverte enrichissent vos relations." },
  4: { title: "Stabilité", message: "Concentrez-vous sur les aspects concrets de votre vie à deux. Organisation et fiabilité sont vos atouts du jour." },
  5: { title: "Mouvement", message: "Accueillez l'imprévu avec souplesse. Une surprise ou un changement de programme peut dynamiser votre couple." },
  6: { title: "Amour", message: "La vibration la plus douce. Prenez soin de votre foyer, offrez de la tendresse et accueillez les besoins de vos proches." },
  7: { title: "Réflexion", message: "Prenez un temps de recul et d'introspection. Le silence et la méditation éclairent vos dynamiques relationnelles." },
  8: { title: "Réalisation", message: "Énergie puissante pour concrétiser vos projets à deux. Équilibrez donner et recevoir dans vos échanges." },
  9: { title: "Compassion", message: "Journée de compréhension et de pardon. Libérez les rancœurs et ouvrez votre cœur à la bienveillance." },
  11: { title: "Intuition", message: "Votre sensibilité est décuplée. Fiez-vous à vos ressentis dans vos relations — votre intuition vous guide juste." },
  22: { title: "Vision", message: "Énergie de bâtisseur. Pensez grand pour votre couple et votre famille — les projets ambitieux sont favorisés." },
  33: { title: "Guidance", message: "Vibration de compassion universelle. Soyez un pilier pour vos proches et rayonnez votre sagesse relationnelle." }
};

export default function MonthlyEnergy() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentDay = now.getDate();

  const universalYear = getUniversalYear(currentYear);
  const monthArticle = MONTHLY_ARTICLES_2026[currentMonth];
  const dayNumber = getUniversalDay(currentDay, currentMonth + 1, currentYear);
  const dayEnergy = DAY_ENERGY_DESCRIPTIONS[dayNumber] || DAY_ENERGY_DESCRIPTIONS[reduceToSingle(dayNumber)] || { title: "Énergie", message: "Accueillez cette journée avec conscience et ouverture." };

  const formattedDate = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-purple-600/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary mb-6" data-testid="badge-universal-year">
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">2026 — Année Universelle {universalYear}</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Vibrations <span className="text-primary">Numériologiques</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez l'énergie qui influence vos relations ce mois-ci et aujourd'hui, calculée selon la numérologie humaniste.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/10" data-testid="card-monthly-energy">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary font-medium uppercase tracking-wider">
                    Énergie du mois — {MONTH_NAMES[currentMonth]} {currentYear}
                  </p>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold mt-1">
                    Vibration {monthArticle.number} : {monthArticle.title}
                  </h3>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed text-base mb-6" data-testid="text-monthly-description">
                {monthArticle.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {monthArticle.keywords.split(", ").map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/10 h-full flex flex-col" data-testid="card-daily-energy">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Sun className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-amber-400 font-medium uppercase tracking-wider">
                    Énergie du jour
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-4 capitalize">{formattedDate}</p>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-amber-500/30 border border-primary/30 flex items-center justify-center">
                  <span className="font-serif text-2xl font-bold text-primary" data-testid="text-day-number">{dayNumber}</span>
                </div>
                <h4 className="font-serif text-xl font-bold" data-testid="text-day-title">{dayEnergy.title}</h4>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed flex-1" data-testid="text-day-message">
                {dayEnergy.message}
              </p>

              <div className="mt-6 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>Calcul : jour ({currentDay}) + mois ({currentMonth + 1}) + année ({currentYear})</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
