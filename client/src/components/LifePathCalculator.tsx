import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Sparkles, Calendar, Heart, Users } from "lucide-react";

const lifePathDefinitions: Record<number, string> = {
  1: "Le Leader — Vous êtes né(e) pour diriger, innover et ouvrir de nouvelles voies. Indépendant(e) et déterminé(e), vous avez le courage de suivre votre propre chemin. En couple, vous devez apprendre à partager le pouvoir et à écouter l'autre.",
  2: "Le Médiateur — Vous êtes fait(e) pour la coopération, la diplomatie et l'harmonie. Sensible et intuitif(ve), vous excellez dans les relations et la construction de ponts entre les personnes. Votre force réside dans l'écoute et la patience.",
  3: "Le Communicant — Vous portez la joie, la créativité et l'expression de soi. Votre nature enthousiaste inspire les autres. En relation, vous apportez légèreté et optimisme, mais devez veiller à ne pas fuir les sujets profonds.",
  4: "Le Bâtisseur — Vous incarnez la stabilité, l'ordre et le travail méthodique. Fiable et persévérant(e), vous construisez des fondations solides pour votre famille. Votre défi : accepter l'imprévu et lâcher prise sur le contrôle.",
  5: "L'Aventurier — Vous êtes animé(e) par la liberté, le changement et l'expérience. Curieux(se) et adaptable, vous avez besoin de mouvement. En couple, le défi est de concilier votre besoin d'indépendance avec l'engagement.",
  6: "Le Responsable — Vous êtes le pilier de la famille et des relations. Aimant(e), protecteur(trice) et dévoué(e), vous cherchez l'harmonie au foyer. Attention à ne pas vous oublier en voulant trop prendre soin des autres.",
  7: "Le Chercheur — Vous êtes guidé(e) par la réflexion, l'analyse et la quête de sens. Introspectif(ve) et spirituel(le), vous cherchez à comprendre les mystères de la vie. En relation, apprenez à ouvrir votre monde intérieur.",
  8: "Le Réalisateur — Vous êtes fait(e) pour le pouvoir, l'abondance et la réussite matérielle. Ambitieux(se) et stratégique, vous savez mener des projets à bien. En famille, équilibrez ambition professionnelle et présence affective.",
  9: "L'Humaniste — Vous portez la compassion, la générosité et l'idéal. Altruiste et sage, vous aspirez à un monde meilleur. En couple, apprenez à recevoir autant que vous donnez et à poser vos limites.",
  11: "Le Maître Inspirateur — Nombre Maître. Vous possédez une intuition exceptionnelle et une sensibilité élevée. Vous êtes fait(e) pour inspirer et élever les autres par votre vision. Votre défi est de gérer l'intensité émotionnelle dans vos relations.",
  22: "Le Maître Bâtisseur — Nombre Maître. Vous avez la capacité de concrétiser de grands projets et de transformer vos rêves en réalité. Votre vision est vaste. En famille, vous êtes un pilier, mais devez apprendre à déléguer.",
  33: "Le Maître Enseignant — Nombre Maître. Vous incarnez l'amour inconditionnel et le dévouement absolu. Votre mission est de guérir, enseigner et élever la conscience. Votre défi : ne pas porter le poids du monde sur vos épaules.",
};

const personalYearDefinitions: Record<number, string> = {
  1: "Année de Nouveaux Départs — C'est le moment d'initier de nouveaux projets, de prendre des décisions importantes et de poser les bases de votre avenir. En couple, c'est le temps du renouveau et des nouvelles résolutions à deux.",
  2: "Année de Patience et Coopération — Une période de gestation où les choses mûrissent doucement. Privilégiez l'écoute, la diplomatie et le travail d'équipe dans votre couple. Les résultats viendront avec le temps.",
  3: "Année d'Expression et Créativité — L'heure est à la communication, aux sorties et à la joie de vivre. Exprimez vos sentiments, partagez des moments légers en couple. Une année favorable aux projets créatifs communs.",
  4: "Année de Construction et Effort — Il faut bâtir, organiser, structurer. C'est le moment de consolider les bases de votre relation ou de votre famille. Travail, discipline et persévérance sont les mots clés.",
  5: "Année de Changement et Liberté — Attendez-vous à des bouleversements, des voyages ou des prises de conscience. En couple, c'est le moment de casser la routine et de retrouver la flamme. Restez flexible.",
  6: "Année de Responsabilité et Famille — Les questions de foyer, d'engagement et de responsabilité sont au centre. C'est une année idéale pour renforcer les liens familiaux, se marier ou fonder un foyer.",
  7: "Année de Réflexion et Introspection — Prenez du recul, analysez votre parcours et vos relations. C'est le moment de la spiritualité, de la méditation et de la compréhension profonde de soi et de l'autre.",
  8: "Année de Récolte et Abondance — Les efforts des années précédentes portent leurs fruits. C'est une période de réalisations concrètes. En couple, les projets matériels communs avancent. Gérez bien le pouvoir.",
  9: "Année de Bilan et Achèvement — Un cycle se termine. C'est le moment de faire le tri, de pardonner et de lâcher ce qui ne sert plus votre évolution. Préparez-vous à un nouveau cycle. En couple, la sincérité est essentielle.",
};

function getCompatibilityKey(a: number, b: number): string {
  const sorted = [a, b].sort((x, y) => x - y);
  return `${sorted[0]}-${sorted[1]}`;
}

const compatibilityDefinitions: Record<string, { score: number; title: string; description: string }> = {
  "1-1": { score: 65, title: "Deux Leaders", description: "Deux personnalités fortes et indépendantes. Vous partagez ambition et détermination, mais la compétition peut s'installer. Le défi : apprendre à diriger ensemble plutôt que l'un contre l'autre. Quand vous unissez vos forces, rien ne vous arrête." },
  "1-2": { score: 85, title: "L'Équilibre Parfait", description: "Une complémentarité naturelle. Le 1 apporte la direction et l'initiative, le 2 apporte la douceur et la diplomatie. Ensemble, vous formez une équipe équilibrée où chacun comble les manques de l'autre." },
  "1-3": { score: 80, title: "Énergie Créative", description: "Une combinaison dynamique et stimulante. Le 1 apporte la structure et l'ambition, le 3 apporte la créativité et la joie. Attention à ne pas négliger les moments de profondeur émotionnelle." },
  "1-4": { score: 70, title: "Vision et Structure", description: "Le 1 a la vision, le 4 a la méthode pour la concrétiser. Ensemble, vous bâtissez du solide. Le risque : que le 1 trouve le 4 trop rigide, et que le 4 trouve le 1 trop impulsif. La patience est la clé." },
  "1-5": { score: 75, title: "Aventure Partagée", description: "Deux esprits indépendants qui aiment la liberté. L'excitation ne manque pas, mais l'engagement peut être un défi. Si vous trouvez un projet commun qui vous passionne, votre couple sera inarrêtable." },
  "1-6": { score: 75, title: "Protection et Ambition", description: "Le 6 offre un foyer chaleureux pendant que le 1 conquiert le monde. L'harmonie est possible si le 1 reconnaît les sacrifices du 6 et si le 6 accepte le besoin d'indépendance du 1." },
  "1-7": { score: 60, title: "Action et Réflexion", description: "Le 1 agit, le 7 réfléchit. Cette différence peut créer de la frustration ou un enrichissement mutuel. Le 7 aide le 1 à approfondir, le 1 aide le 7 à passer à l'action. Le respect du rythme de l'autre est essentiel." },
  "1-8": { score: 80, title: "Puissance Partagée", description: "Deux forces ambitieuses qui peuvent construire un empire ensemble. Le pouvoir et la réussite vous animent. Le danger : la rivalité. Si vous canalisez cette énergie vers un objectif commun, vous êtes imbattables." },
  "1-9": { score: 70, title: "Visionnaire et Humaniste", description: "Le 1 veut réussir, le 9 veut aider le monde. Vos motivations diffèrent mais se complètent. Le 9 ouvre le cœur du 1, le 1 donne une direction concrète aux idéaux du 9." },
  "2-2": { score: 80, title: "Harmonie Sensible", description: "Deux âmes sensibles et intuitives. La compréhension mutuelle est profonde, mais attention à l'excès de passivité. L'un de vous doit oser prendre des initiatives pour que le couple avance." },
  "2-3": { score: 85, title: "Douceur et Joie", description: "Le 2 apporte la profondeur émotionnelle, le 3 apporte la légèreté. Ensemble, vous créez une relation à la fois tendre et joyeuse. Le 3 aide le 2 à sortir de sa coquille, le 2 ancre le 3 dans l'authenticité." },
  "2-4": { score: 75, title: "Sécurité Affective", description: "Le 4 offre la stabilité que le 2 recherche. C'est une relation rassurante et fiable. Le défi : éviter la routine. Le 2 peut aider le 4 à exprimer ses émotions plus librement." },
  "2-5": { score: 55, title: "Stabilité contre Liberté", description: "Le 2 cherche la fusion, le 5 cherche la liberté. Cette tension peut être source de souffrance ou de croissance intense. La clé : respecter les besoins fondamentaux de l'autre sans se renier." },
  "2-6": { score: 90, title: "L'Union Harmonieuse", description: "Une des meilleures compatibilités. Le 2 et le 6 partagent le même besoin d'harmonie, de famille et d'amour. Ensemble, vous créez un foyer chaleureux et accueillant. Veillez à ne pas trop vous isoler du monde." },
  "2-7": { score: 70, title: "Intuition Partagée", description: "Deux êtres intuitifs et sensibles. Le 7 apporte la profondeur intellectuelle, le 2 apporte la chaleur émotionnelle. Ensemble, vous explorez les dimensions subtiles de la vie. Le risque : trop d'introspection." },
  "2-8": { score: 65, title: "Cœur et Ambition", description: "Le 8 est tourné vers la réussite matérielle, le 2 vers l'harmonie relationnelle. Si le 8 apprend à écouter et le 2 à s'affirmer, vous pouvez construire une vie riche à tous les niveaux." },
  "2-9": { score: 75, title: "Sensibilité et Compassion", description: "Deux êtres au grand cœur. Le 9 porte des idéaux élevés, le 2 offre un soutien inconditionnel. Ensemble, vous pouvez accomplir de belles choses pour les autres. Attention à ne pas vous oublier en chemin." },
  "3-3": { score: 75, title: "Double Créativité", description: "Beaucoup de joie, de rires et de créativité dans cette union. Le risque : rester en surface et éviter les sujets difficiles. Si vous osez la profondeur émotionnelle, votre couple rayonnera." },
  "3-4": { score: 60, title: "Créativité et Discipline", description: "Le 3 est spontané et léger, le 4 est méthodique et sérieux. Ces différences peuvent être complémentaires ou source de frustration. Le 3 apporte de la fantaisie au 4, le 4 apporte de la structure au 3." },
  "3-5": { score: 85, title: "Aventure Joyeuse", description: "Une combinaison pleine de vie, d'aventures et de rires. Vous ne vous ennuyez jamais ensemble. Le défi : construire quelque chose de durable au-delà du plaisir immédiat. Ancrez votre relation dans des projets concrets." },
  "3-6": { score: 80, title: "Art et Famille", description: "Le 3 apporte la créativité, le 6 apporte l'amour du foyer. Ensemble, vous créez un environnement beau et harmonieux. Le 6 donne des racines au 3, le 3 apporte de la couleur à la vie du 6." },
  "3-7": { score: 55, title: "Surface et Profondeur", description: "Le 3 vit en société, le 7 vit dans son monde intérieur. Cette différence peut enrichir ou éloigner. Si le 3 apprend à apprécier le silence et le 7 à apprécier la légèreté, la magie opère." },
  "3-8": { score: 70, title: "Expression et Pouvoir", description: "Le 3 charme, le 8 impressionne. Ensemble, vous brillez en société. Le défi : au-delà des apparences, construire une intimité sincère. Le 3 adoucit le 8, le 8 donne de l'ambition au 3." },
  "3-9": { score: 85, title: "Inspiration Mutuelle", description: "Deux créatifs au grand cœur. Le 3 et le 9 partagent un amour de l'art, de la beauté et de l'humanité. Ensemble, vous inspirez les autres. Veillez à rester ancrés dans le quotidien." },
  "4-4": { score: 70, title: "Double Stabilité", description: "Une relation solide comme le roc. Fiabilité, loyauté et sens du devoir définissent votre couple. Le risque : trop de rigidité et pas assez de spontanéité. Accordez-vous des moments de fantaisie." },
  "4-5": { score: 50, title: "Sécurité contre Aventure", description: "Le 4 veut de la stabilité, le 5 veut du changement. C'est l'une des combinaisons les plus difficiles. Mais si vous acceptez vos différences, le 4 ancre le 5 et le 5 libère le 4 de ses rigidités." },
  "4-6": { score: 85, title: "Famille Solide", description: "Le 4 et le 6 partagent l'amour de la famille et de la stabilité. Ensemble, vous construisez un foyer solide et aimant. C'est une combinaison très favorable au mariage et à la parentalité." },
  "4-7": { score: 65, title: "Méthode et Sagesse", description: "Le 4 construit dans le monde matériel, le 7 explore le monde spirituel. Si vous respectez les univers de l'autre, cette union apporte profondeur et solidité. Le risque : vivre dans des mondes parallèles." },
  "4-8": { score: 80, title: "Bâtisseurs Unis", description: "Deux forces concrètes et ambitieuses. Ensemble, vous pouvez construire un patrimoine impressionnant. Votre relation est basée sur le respect mutuel et les objectifs partagés. N'oubliez pas la tendresse." },
  "4-9": { score: 55, title: "Terre et Idéal", description: "Le 4 est pragmatique, le 9 est idéaliste. Le 4 peut trouver le 9 trop rêveur, le 9 peut trouver le 4 trop terre-à-terre. La clé : apprécier ce que l'autre apporte de différent à votre vie." },
  "5-5": { score: 70, title: "Double Liberté", description: "Deux esprits libres et aventuriers. L'excitation est constante, mais la stabilité fait défaut. Si vous partagez un goût commun pour l'aventure tout en créant un point d'ancrage, votre relation sera extraordinaire." },
  "5-6": { score: 55, title: "Liberté et Responsabilité", description: "Le 5 cherche l'aventure, le 6 cherche la stabilité familiale. Le compromis est essentiel. Le 5 apporte du piment à la vie du 6, le 6 offre un port d'attache au 5. Beaucoup de négociation nécessaire." },
  "5-7": { score: 65, title: "Curiosité Partagée", description: "Le 5 explore le monde extérieur, le 7 explore le monde intérieur. Tous deux sont des chercheurs à leur manière. Si vous partagez vos découvertes, vous enrichissez mutuellement votre vision du monde." },
  "5-8": { score: 75, title: "Dynamisme et Puissance", description: "Le 5 apporte la flexibilité, le 8 apporte la direction. Ensemble, vous formez un duo dynamique et ambitieux. Le défi : le 5 doit accepter une certaine structure, le 8 doit accepter l'imprévu." },
  "5-9": { score: 80, title: "Liberté et Humanisme", description: "Le 5 et le 9 partagent un esprit ouvert et un amour de la liberté. Vous voyagez, explorez et grandissez ensemble. Le risque : aucun des deux ne veut se poser. Trouvez un ancrage commun." },
  "6-6": { score: 80, title: "Double Harmonie", description: "Deux âmes aimantes et dévouées au foyer. L'amour et la famille sont au cœur de votre union. Le risque : trop de sacrifice et pas assez de limites personnelles. Prenez soin de vous aussi." },
  "6-7": { score: 60, title: "Cœur et Esprit", description: "Le 6 vit par le cœur, le 7 vit par l'esprit. Le 6 peut trouver le 7 trop distant, le 7 peut trouver le 6 trop envahissant. Si vous trouvez l'équilibre, votre relation allie profondeur intellectuelle et chaleur affective." },
  "6-8": { score: 75, title: "Foyer et Réussite", description: "Le 6 crée l'harmonie à la maison, le 8 assure la prospérité. Une combinaison classique et efficace. Le défi : que le 8 soit suffisamment présent émotionnellement et que le 6 respecte l'ambition du 8." },
  "6-9": { score: 85, title: "Amour Universel", description: "Le 6 et le 9 partagent un amour profond pour l'humanité. Votre couple est tourné vers les autres autant que vers vous-mêmes. Une relation riche de sens et de compassion. Veillez à préserver votre intimité." },
  "7-7": { score: 65, title: "Double Introspection", description: "Deux chercheurs de vérité. Vous partagez une vie intérieure riche et des conversations profondes. Le risque : trop d'isolement et pas assez de légèreté. Sortez de votre monde intérieur ensemble." },
  "7-8": { score: 55, title: "Spirituel et Matériel", description: "Le 7 cherche le sens, le 8 cherche le succès. Ces priorités divergentes demandent beaucoup de tolérance. Si le 7 apporte la sagesse au 8 et le 8 apporte la sécurité au 7, l'équilibre est possible." },
  "7-9": { score: 80, title: "Sagesse et Compassion", description: "Le 7 et le 9 partagent une quête de sens et une vision élevée de la vie. Votre relation est profonde, spirituelle et engagée. Ensemble, vous cherchez à comprendre les grands mystères de l'existence." },
  "8-8": { score: 70, title: "Double Puissance", description: "Deux forces de la nature. Ambition, pouvoir et détermination définissent votre couple. Le risque majeur : la lutte pour le contrôle. Si vous dirigez cette énergie vers des projets communs, vous êtes invincibles." },
  "8-9": { score: 60, title: "Matériel et Idéal", description: "Le 8 vise la réussite matérielle, le 9 vise l'accomplissement spirituel. Le 8 peut trouver le 9 trop détaché de l'argent, le 9 peut trouver le 8 trop matérialiste. Le respect mutuel est la clé." },
  "9-9": { score: 75, title: "Double Idéalisme", description: "Deux humanistes au grand cœur. Vous partagez des valeurs élevées et un désir de contribuer au monde. Le défi : rester ancrés dans le quotidien et ne pas vous perdre dans des idéaux inaccessibles." },
  "1-11": { score: 75, title: "Leader et Inspirateur", description: "Le 1 agit avec force, le 11 inspire avec intuition. Une dynamique puissante si le 1 respecte la sensibilité du 11 et si le 11 accepte le pragmatisme du 1." },
  "1-22": { score: 80, title: "Pionnier et Visionnaire", description: "Le 1 ouvre la voie, le 22 bâtit des empires. Ensemble, vous avez le potentiel de réaliser de grandes choses. Le défi : la patience et l'écoute mutuelle." },
  "2-11": { score: 85, title: "Sensibilité Élevée", description: "Le 2 et le 11 partagent une sensibilité exceptionnelle. Votre connexion émotionnelle est profonde et intuitive. Veillez à ne pas absorber les émotions de l'autre." },
  "2-22": { score: 75, title: "Soutien et Grande Vision", description: "Le 2 apporte le soutien émotionnel dont le 22 a besoin pour concrétiser sa grande vision. Une relation basée sur la complémentarité et la confiance." },
  "3-11": { score: 80, title: "Créativité Inspirée", description: "Le 3 exprime, le 11 inspire. Ensemble, vous créez quelque chose de lumineux et d'original. Votre énergie créative combinée peut toucher beaucoup de personnes." },
  "3-22": { score: 70, title: "Art et Construction", description: "Le 3 apporte la créativité, le 22 apporte la capacité de concrétiser à grande échelle. Si vous alignez vos visions, votre potentiel est immense." },
  "4-11": { score: 60, title: "Structure et Intuition", description: "Le 4 est ancré dans la matière, le 11 dans l'esprit. Cette opposition peut enrichir ou frustrer. Le 4 aide le 11 à se concrétiser, le 11 ouvre les horizons du 4." },
  "4-22": { score: 85, title: "Les Grands Bâtisseurs", description: "Le 4 et le 22 partagent l'amour de la construction. Le 22 voit grand, le 4 exécute avec méthode. Ensemble, vous pouvez accomplir des projets remarquables." },
  "5-11": { score: 65, title: "Liberté et Vision", description: "Le 5 cherche l'aventure, le 11 cherche l'élévation. Si vous partagez un idéal commun, votre parcours ensemble sera riche en découvertes et en inspiration." },
  "5-22": { score: 60, title: "Mouvement et Construction", description: "Le 5 bouge sans cesse, le 22 construit avec méthode. Le défi est de trouver un rythme commun. Le 5 apporte la flexibilité, le 22 la vision à long terme." },
  "6-11": { score: 85, title: "Amour et Inspiration", description: "Le 6 nourrit avec amour, le 11 inspire avec lumière. Une combinaison profondément harmonieuse. Votre foyer est un lieu d'amour et d'élévation spirituelle." },
  "6-22": { score: 80, title: "Foyer et Grande Vision", description: "Le 6 crée l'harmonie familiale, le 22 porte une mission plus large. Ensemble, vous construisez un foyer qui rayonne bien au-delà de vos murs." },
  "7-11": { score: 85, title: "Quête Spirituelle", description: "Le 7 et le 11 partagent une profonde quête de sens. Votre connexion est intellectuelle et spirituelle. Ensemble, vous explorez les dimensions cachées de l'existence." },
  "7-22": { score: 70, title: "Sagesse et Réalisation", description: "Le 7 cherche la vérité, le 22 la matérialise. Si le 7 partage ses découvertes et le 22 ses projets, vous formez un duo aussi profond que productif." },
  "8-11": { score: 65, title: "Pouvoir et Intuition", description: "Le 8 maîtrise le monde matériel, le 11 perçoit le monde subtil. Si le 8 s'ouvre à l'intuition du 11 et le 11 valorise le pragmatisme du 8, l'alliance est puissante." },
  "8-22": { score: 85, title: "Empire et Vision", description: "Le 8 et le 22 partagent l'ambition et la capacité de réaliser à grande échelle. Ensemble, vous pouvez bâtir quelque chose d'exceptionnel. N'oubliez pas l'aspect humain." },
  "9-11": { score: 80, title: "Humanisme et Illumination", description: "Le 9 sert l'humanité, le 11 l'éclaire. Une combinaison altruiste et visionnaire. Votre couple porte un message qui dépasse votre seule relation." },
  "9-22": { score: 75, title: "Idéal et Construction", description: "Le 9 porte des idéaux élevés, le 22 a la capacité de les concrétiser. Ensemble, vous pouvez changer le monde à votre échelle." },
  "11-11": { score: 70, title: "Double Inspiration", description: "Deux êtres hautement intuitifs et sensibles. L'intensité émotionnelle est immense. Veillez à vous ancrer dans le quotidien et à ne pas vous perdre dans l'hypersensibilité." },
  "11-22": { score: 80, title: "Inspiration et Réalisation", description: "Le 11 inspire, le 22 concrétise. Une alliance puissante entre vision et action. Ensemble, vous donnez forme aux rêves les plus ambitieux." },
  "22-22": { score: 75, title: "Double Vision", description: "Deux grands bâtisseurs avec une vision immense. Le risque : la compétition. Si vous unifiez vos visions, votre potentiel de réalisation est hors du commun." },
  "1-33": { score: 75, title: "Action et Amour Universel", description: "Le 1 dirige, le 33 aime inconditionnellement. Si le 1 s'ouvre à la compassion du 33, cette union apporte force et bienveillance au monde." },
  "2-33": { score: 90, title: "Harmonie Suprême", description: "Le 2 et le 33 partagent une sensibilité et un amour profond. Votre connexion est presque télépathique. Une des combinaisons les plus harmonieuses et spirituelles." },
  "3-33": { score: 85, title: "Expression et Guérison", description: "Le 3 exprime avec art, le 33 guérit avec amour. Ensemble, votre créativité sert à élever et inspirer les autres. Une relation lumineuse." },
  "4-33": { score: 70, title: "Structure et Dévotion", description: "Le 4 construit avec méthode, le 33 sert avec dévotion. Si le 4 soutient la mission du 33, et le 33 apporte du sens au travail du 4, l'équilibre est beau." },
  "5-33": { score: 60, title: "Liberté et Service", description: "Le 5 cherche la liberté, le 33 se dévoue aux autres. Ces priorités s'opposent mais peuvent se compléter si chacun respecte la vocation de l'autre." },
  "6-33": { score: 90, title: "Amour Absolu", description: "Le 6 et le 33 partagent un amour profond de la famille et de l'humanité. Votre foyer est un sanctuaire de bienveillance. Une combinaison exceptionnellement harmonieuse." },
  "7-33": { score: 75, title: "Sagesse et Compassion", description: "Le 7 cherche la vérité, le 33 incarne l'amour. Ensemble, vous alliez profondeur intellectuelle et chaleur du cœur. Une relation qui nourrit l'âme." },
  "8-33": { score: 65, title: "Pouvoir et Guérison", description: "Le 8 maîtrise le matériel, le 33 maîtrise le spirituel. Si le 8 met son pouvoir au service de la mission du 33, votre impact sera considérable." },
  "9-33": { score: 85, title: "Service Universel", description: "Le 9 et le 33 partagent un dévouement absolu envers l'humanité. Votre couple est tourné vers le service et l'élévation. Veillez à préserver votre intimité." },
  "11-33": { score: 85, title: "Triple Maître", description: "Deux nombres maîtres d'une sensibilité et d'une vision exceptionnelles. L'intensité de cette union est extraordinaire. Ensemble, vous portez un message puissant pour le monde." },
  "22-33": { score: 80, title: "Construction et Amour Universel", description: "Le 22 bâtit à grande échelle, le 33 guérit avec amour. Ensemble, vous pouvez créer des structures au service de l'humanité." },
  "33-33": { score: 75, title: "Double Guérison", description: "Deux êtres portant l'amour inconditionnel. L'intensité émotionnelle est immense. Votre défi : ne pas vous consumer dans le don de soi. Apprenez à recevoir aussi." },
};

function reduceToSingleDigit(num: number): number {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    const digits = String(num).split("").map(Number);
    num = digits.reduce((a, b) => a + b, 0);
  }
  return num;
}

function calculateLifePathNumber(dateStr: string): number {
  const digits = dateStr.replace(/-/g, "").split("").map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  return reduceToSingleDigit(sum);
}

function calculatePersonalYear(dateStr: string): number {
  const [year, month, day] = dateStr.split("-").map(Number);
  const currentYear = new Date().getFullYear();
  const currentYearDigits = String(currentYear).split("").map(Number);
  const dayDigits = String(day).split("").map(Number);
  const monthDigits = String(month).split("").map(Number);
  const sum = [...dayDigits, ...monthDigits, ...currentYearDigits].reduce((a, b) => a + b, 0);
  return reduceToSingleDigit(sum);
}

function getCompatibilityScoreColor(score: number): string {
  if (score >= 85) return "text-green-400";
  if (score >= 70) return "text-yellow-400";
  if (score >= 55) return "text-orange-400";
  return "text-red-400";
}

function getCompatibilityScoreLabel(score: number): string {
  if (score >= 85) return "Excellente";
  if (score >= 70) return "Bonne";
  if (score >= 55) return "Modérée";
  return "Difficile";
}

type Mode = "personal" | "compatibility";

export default function LifePathCalculator() {
  const [mode, setMode] = useState<Mode>("personal");
  const [date, setDate] = useState("");
  const [date2, setDate2] = useState("");
  const [lifePathResult, setLifePathResult] = useState<number | null>(null);
  const [personalYearResult, setPersonalYearResult] = useState<number | null>(null);
  const [lifePath2Result, setLifePath2Result] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleCalculatePersonal = () => {
    if (!date) return;
    const lifePath = calculateLifePathNumber(date);
    const personalYear = calculatePersonalYear(date);
    setLifePathResult(lifePath);
    setPersonalYearResult(personalYear);
    setShowResults(true);
  };

  const handleCalculateCompatibility = () => {
    if (!date || !date2) return;
    const lifePath1 = calculateLifePathNumber(date);
    const lifePath2 = calculateLifePathNumber(date2);
    setLifePathResult(lifePath1);
    setLifePath2Result(lifePath2);
    setShowResults(true);
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setShowResults(false);
    setLifePathResult(null);
    setPersonalYearResult(null);
    setLifePath2Result(null);
  };

  const compatInfo = lifePathResult !== null && lifePath2Result !== null
    ? compatibilityDefinitions[getCompatibilityKey(lifePathResult, lifePath2Result)]
    : null;

  return (
    <div className="bg-card border border-primary/20 rounded-md p-8 max-w-lg mx-auto shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -z-10" />

      <div className="text-center mb-6">
        <h3 className="font-serif text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Calculateur Numérologique
        </h3>
        <p className="text-sm text-muted-foreground">
          {mode === "personal"
            ? "Découvrez votre Chemin de Vie et votre Année Personnelle."
            : "Analysez la compatibilité de vos chemins de vie."}
        </p>
      </div>

      <div className="flex gap-1 mb-6 bg-background/50 rounded-md p-1 border border-white/10">
        <button
          data-testid="button-mode-personal"
          onClick={() => handleModeChange("personal")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
            mode === "personal"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calculator className="w-4 h-4" />
          Analyse Personnelle
        </button>
        <button
          data-testid="button-mode-compatibility"
          onClick={() => handleModeChange("compatibility")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
            mode === "compatibility"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Heart className="w-4 h-4" />
          Compatibilité
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {mode === "personal" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Date de naissance
                </label>
                <input
                  data-testid="input-birthdate"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-md px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                />
              </div>

              <button
                data-testid="button-calculate"
                onClick={handleCalculatePersonal}
                disabled={!date}
                className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Révéler mes nombres
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  <Users className="w-3 h-3 inline mr-1" />
                  Date de naissance — Personne 1
                </label>
                <input
                  data-testid="input-birthdate-1"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-md px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  <Users className="w-3 h-3 inline mr-1" />
                  Date de naissance — Personne 2
                </label>
                <input
                  data-testid="input-birthdate-2"
                  type="date"
                  value={date2}
                  onChange={(e) => setDate2(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-md px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                />
              </div>

              <button
                data-testid="button-calculate-compatibility"
                onClick={handleCalculateCompatibility}
                disabled={!date || !date2}
                className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Analyser la compatibilité
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {showResults && mode === "personal" && lifePathResult !== null && personalYearResult !== null && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-6 pt-6 border-t border-white/10 space-y-8"
        >
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <Calculator className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Chemin de Vie</span>
            </div>
            <div data-testid="text-life-path-number" className="text-6xl font-serif font-bold text-primary mb-3 glow-text">
              {lifePathResult}
            </div>
            <p data-testid="text-life-path-definition" className="text-sm text-muted-foreground leading-relaxed text-left bg-white/5 rounded-md p-4 border border-white/5">
              {lifePathDefinitions[lifePathResult] || "Ce nombre révèle votre parcours, vos talents et vos défis dans cette vie."}
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Année Personnelle {new Date().getFullYear()}</span>
            </div>
            <div data-testid="text-personal-year-number" className="text-6xl font-serif font-bold text-primary mb-3 glow-text">
              {personalYearResult}
            </div>
            <p data-testid="text-personal-year-definition" className="text-sm text-muted-foreground leading-relaxed text-left bg-white/5 rounded-md p-4 border border-white/5">
              {personalYearDefinitions[personalYearResult] || "Cette année personnelle influence vos énergies et vos opportunités pour l'année en cours."}
            </p>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground italic">
              Pour une analyse approfondie de vos nombres et de vos dynamiques relationnelles, n'hésitez pas à prendre rendez-vous.
            </p>
          </div>
        </motion.div>
      )}

      {showResults && mode === "compatibility" && lifePathResult !== null && lifePath2Result !== null && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-6 pt-6 border-t border-white/10 space-y-6"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Personne 1</span>
              <div data-testid="text-compatibility-path-1" className="text-5xl font-serif font-bold text-primary glow-text">
                {lifePathResult}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {lifePathDefinitions[lifePathResult]?.split("—")[0]?.replace(/^Le |^L'|^La /, "") || ""}
              </p>
            </div>

            <div className="flex flex-col items-center gap-1">
              <Heart className="w-6 h-6 text-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">&</span>
            </div>

            <div className="text-center">
              <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Personne 2</span>
              <div data-testid="text-compatibility-path-2" className="text-5xl font-serif font-bold text-primary glow-text">
                {lifePath2Result}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {lifePathDefinitions[lifePath2Result]?.split("—")[0]?.replace(/^Le |^L'|^La /, "") || ""}
              </p>
            </div>
          </div>

          {compatInfo ? (
            <div className="space-y-4">
              <div className="text-center">
                <h4 data-testid="text-compatibility-title" className="font-serif text-xl font-bold text-foreground mb-2">
                  {compatInfo.title}
                </h4>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Compatibilité :</span>
                  <span data-testid="text-compatibility-score" className={`text-2xl font-bold ${getCompatibilityScoreColor(compatInfo.score)}`}>
                    {compatInfo.score}%
                  </span>
                  <span className={`text-sm font-medium ${getCompatibilityScoreColor(compatInfo.score)}`}>
                    ({getCompatibilityScoreLabel(compatInfo.score)})
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${compatInfo.score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-2 rounded-full ${
                      compatInfo.score >= 85 ? "bg-green-400" :
                      compatInfo.score >= 70 ? "bg-yellow-400" :
                      compatInfo.score >= 55 ? "bg-orange-400" : "bg-red-400"
                    }`}
                  />
                </div>
              </div>

              <p data-testid="text-compatibility-description" className="text-sm text-muted-foreground leading-relaxed text-left bg-white/5 rounded-md p-4 border border-white/5">
                {compatInfo.description}
              </p>
            </div>
          ) : (
            <div className="text-center bg-white/5 rounded-md p-4 border border-white/5">
              <p className="text-sm text-muted-foreground">
                Vos chemins de vie révèlent une combinaison unique. Pour une analyse détaillée de votre compatibilité, prenez rendez-vous pour une consultation personnalisée.
              </p>
            </div>
          )}

          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground italic mb-3">
              Pour une analyse complète de votre compatibilité de couple avec des conseils personnalisés, prenez rendez-vous pour un coaching conjugal.
            </p>
            <a
              href="/booking"
              data-testid="link-book-compatibility"
              className="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/30 transition-colors"
            >
              <Heart className="w-4 h-4" />
              Réserver un coaching conjugal
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
}
