import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { services } from "@shared/schema";
import { eq } from "drizzle-orm";
import { api, tarotInputSchema } from "@shared/routes";
import { z } from "zod";
import { sendBookingNotification } from "./email";

const TAROT_CARDS = [
  {
    name: "Le Bateleur",
    image: "magician",
    upright: "Le Bateleur vous invite à prendre conscience de toutes les ressources que vous portez en vous. En matière de relations, cette carte révèle que vous avez la capacité d'initier un changement positif. Vous possédez l'intelligence émotionnelle et la créativité nécessaires pour transformer votre vie affective. C'est le moment d'oser exprimer ce que vous ressentez vraiment, car votre parole a un pouvoir de guérison dans vos liens.",
    reversed: "Le Bateleur inversé met en lumière un potentiel affectif que vous n'exploitez pas encore pleinement. Peut-être doutez-vous de votre capacité à être aimé(e) ou à aimer de la bonne manière. Cette hésitation est naturelle, mais elle vous empêche d'avancer vers la relation que vous méritez. Accordez-vous le droit de vous affirmer dans vos sentiments — votre authenticité est votre plus grande force."
  },
  {
    name: "La Papesse",
    image: "high_priestess",
    upright: "La Papesse vous murmure de faire confiance à votre intuition profonde. Dans vos relations, vous savez instinctivement ce qui est juste pour vous — même si votre mental essaie parfois de vous convaincre du contraire. Cette carte vous encourage à écouter cette petite voix intérieure qui connaît la vérité de votre cœur. La patience et la sagesse sont vos alliées : les réponses que vous cherchez sont déjà en vous.",
    reversed: "La Papesse inversée révèle que vous êtes peut-être coupé(e) de votre intuition en ce moment. Des non-dits ou des secrets pèsent sur vos relations et créent une distance émotionnelle. Il est important de vous reconnecter à vous-même avant de chercher des réponses à l'extérieur. Prenez le temps de la solitude bienveillante pour retrouver votre voix intérieure — elle vous guidera vers plus de clarté dans vos liens."
  },
  {
    name: "L'Impératrice",
    image: "empress",
    upright: "L'Impératrice est la carte de l'amour épanoui et de la générosité du cœur. Elle indique que vous êtes dans une période fertile émotionnellement, où vos relations peuvent s'approfondir et se nourrir mutuellement. Vous avez la capacité de créer un espace chaleureux et sécurisant pour ceux que vous aimez. Laissez votre tendresse naturelle s'exprimer — elle est un cadeau précieux pour votre entourage.",
    reversed: "L'Impératrice inversée met en lumière un déséquilibre dans le donner et le recevoir au sein de vos relations. Peut-être donnez-vous trop de vous-même au point de vous oublier, ou peut-être avez-vous besoin de retrouver votre autonomie affective. Cette carte vous rappelle qu'aimer l'autre commence par s'aimer soi-même. Prenez soin de vos propres besoins émotionnels — c'est la base d'une relation saine."
  },
  {
    name: "L'Empereur",
    image: "emperor",
    upright: "L'Empereur représente la stabilité et la solidité dans vos fondations relationnelles. Cette carte vous confirme que vous avez la capacité de construire des liens durables, basés sur la confiance et le respect mutuel. Votre sens de la responsabilité et votre fiabilité sont des qualités précieuses que vos proches reconnaissent. Continuez à incarner cette force tranquille — elle inspire la sécurité chez ceux qui vous entourent.",
    reversed: "L'Empereur inversé suggère une tendance au contrôle ou à la rigidité dans vos relations. Peut-être essayez-vous de tout maîtriser par peur de la vulnérabilité. Cette carte vous invite à relâcher la pression et à accepter que les relations vivantes sont faites de souplesse et d'imprévu. Apprendre à lâcher prise ne signifie pas perdre le contrôle — c'est ouvrir la porte à une connexion plus authentique."
  },
  {
    name: "Le Pape",
    image: "hierophant",
    upright: "Le Pape symbolise la transmission et les valeurs partagées. Dans vos relations, cette carte indique que vous avez besoin de sens et de profondeur. Vous recherchez des liens qui dépassent la surface, fondés sur des valeurs communes et un respect mutuel. Un guide, un conseil avisé ou une parole bienveillante peut éclairer votre chemin. Restez ouvert(e) aux enseignements que vos relations vous apportent — chaque rencontre est un miroir.",
    reversed: "Le Pape inversé vous invite à questionner les schémas relationnels hérités de votre éducation ou de votre passé. Certaines croyances sur l'amour ou la famille ne vous correspondent peut-être plus. C'est le moment de vous libérer des attentes des autres pour construire vos propres règles du jeu en amour. Votre chemin est unique — faites-vous confiance pour le tracer."
  },
  {
    name: "L'Amoureux",
    image: "lovers",
    upright: "L'Amoureux est la carte par excellence des choix du cœur. Elle indique qu'un moment décisif se présente dans votre vie sentimentale. Que ce soit un choix entre deux personnes, deux chemins de vie, ou simplement le choix de s'engager plus profondément, cette carte vous confirme que votre cœur connaît déjà la réponse. Faites confiance à vos sentiments — l'harmonie naît lorsqu'on écoute la voix de l'amour.",
    reversed: "L'Amoureux inversé révèle un conflit intérieur en matière de sentiments. Vous êtes peut-être tiraillé(e) entre raison et passion, entre sécurité et désir. Cette indécision crée une souffrance silencieuse. La carte vous encourage à clarifier vos véritables désirs sans culpabilité. Chaque choix, même difficile, vous rapproche de votre vérité. Accordez-vous le droit de choisir ce qui vous rend vraiment heureux(se)."
  },
  {
    name: "Le Chariot",
    image: "chariot",
    upright: "Le Chariot annonce une avancée déterminante dans votre vie relationnelle. Vous avez traversé des épreuves et votre persévérance porte enfin ses fruits. Cette carte vous encourage à avancer avec confiance vers vos objectifs sentimentaux. Les obstacles que vous avez surmontés vous ont rendu(e) plus fort(e) et plus clair(e) sur ce que vous voulez. Gardez le cap — la victoire du cœur est à portée de main.",
    reversed: "Le Chariot inversé indique une dispersion de vos énergies émotionnelles. Vous courez peut-être dans plusieurs directions à la fois sans avancer véritablement. Cette carte vous invite à faire le point sur vos priorités affectives et à recentrer votre attention sur ce qui compte vraiment. Parfois, ralentir n'est pas reculer — c'est se donner la chance de mieux choisir sa direction."
  },
  {
    name: "La Justice",
    image: "justice",
    upright: "La Justice apporte la clarté et l'équilibre dans vos relations. Cette carte indique que la vérité est en train de se faire jour dans votre vie sentimentale. Les déséquilibres passés se rééquilibrent naturellement. Vous êtes invité(e) à agir avec honnêteté et droiture dans vos échanges — la sincérité, même quand elle est difficile, est le fondement de relations durables et respectueuses.",
    reversed: "La Justice inversée pointe vers un déséquilibre ou un sentiment d'injustice dans vos relations. Vous avez peut-être l'impression de donner plus que ce que vous recevez, ou que la situation n'est pas équitable. Cette carte vous encourage à exprimer vos besoins avec calme et assertivité. Rétablir l'équilibre commence par reconnaître votre propre valeur et la communiquer à l'autre."
  },
  {
    name: "L'Hermite",
    image: "hermit",
    upright: "L'Hermite vous invite à un temps de réflexion bénéfique. Avant de chercher les réponses chez l'autre, tournez-vous vers vous-même. Cette période d'introspection est précieuse pour comprendre vos véritables besoins affectifs. La solitude choisie n'est pas un vide — c'est un espace fertile où vous pouvez vous reconnecter à votre essence. De cette clarté intérieure naîtront des relations plus authentiques.",
    reversed: "L'Hermite inversé révèle un isolement qui vous pèse. Vous vous êtes peut-être replié(e) sur vous-même par protection, mais cette solitude prolongée nourrit la tristesse plutôt que la sagesse. Il est temps de tendre la main vers les autres, d'accepter l'aide et la chaleur humaine. Vous n'avez pas à traverser cette période seul(e) — ouvrir votre cœur est un acte de courage, pas de faiblesse."
  },
  {
    name: "La Roue de Fortune",
    image: "wheel",
    upright: "La Roue de Fortune annonce un tournant positif dans votre vie sentimentale. Les cycles changent, et une nouvelle phase plus lumineuse s'amorce. Cette carte vous rassure : même si vous avez traversé des moments difficiles, la roue tourne toujours. Restez ouvert(e) aux opportunités qui se présentent — une rencontre, un renouveau dans votre couple, ou une réconciliation inattendue peut transformer votre quotidien.",
    reversed: "La Roue de Fortune inversée indique une résistance au changement qui vous maintient dans une situation insatisfaisante. Vous avez peut-être peur de l'inconnu ou du risque que représente un changement dans vos relations. Pourtant, la stagnation est plus douloureuse que le mouvement. Acceptez que certaines choses doivent évoluer pour que de nouvelles possibilités puissent émerger dans votre vie affective."
  },
  {
    name: "La Force",
    image: "strength",
    upright: "La Force vous rappelle que le véritable courage en amour réside dans la douceur et la patience. Vous avez en vous une puissance intérieure qui vous permet de traverser les tempêtes relationnelles avec grâce. Cette carte vous encourage à répondre aux conflits par la compréhension plutôt que par la confrontation. Votre bienveillance naturelle est votre plus grande arme — elle apaise et guérit les blessures du cœur.",
    reversed: "La Force inversée met en lumière un moment de doute et de vulnérabilité. Vous vous sentez peut-être épuisé(e) émotionnellement, comme si vous n'aviez plus la force de vous battre pour vos relations. C'est un signal important : il est temps de prendre soin de vous. Retrouvez votre puissance intérieure en vous accordant du repos et de la compassion. Vous êtes plus fort(e) que vous ne le pensez."
  },
  {
    name: "Le Pendu",
    image: "hanged_man",
    upright: "Le Pendu vous invite à changer radicalement de perspective sur votre situation sentimentale. Ce qui vous semble un blocage est en réalité une pause nécessaire pour voir les choses autrement. Parfois, c'est en cessant de se battre contre une situation qu'on trouve la solution. Acceptez ce temps de suspension — il prépare une transformation profonde dans votre manière d'aimer et d'être aimé(e).",
    reversed: "Le Pendu inversé révèle un sacrifice émotionnel que vous faites depuis trop longtemps. Vous vous oubliez peut-être au profit de l'autre, en mettant systématiquement vos besoins au second plan. Cette carte est un rappel bienveillant mais ferme : arrêtez de vous sacrifier. Votre bonheur compte autant que celui des autres. Remettre vos besoins au centre n'est pas de l'égoïsme — c'est de la survie émotionnelle."
  },
  {
    name: "L'Arcane Sans Nom",
    image: "death",
    upright: "L'Arcane Sans Nom annonce une transformation profonde — non pas une fin, mais une renaissance. Un ancien schéma relationnel touche à sa fin pour laisser place à quelque chose de plus authentique. Ce passage peut être inconfortable, mais il est nécessaire pour votre évolution. Faites confiance au processus : de cette chrysalide émergera une version plus libre et plus épanouie de vous-même dans vos relations.",
    reversed: "L'Arcane Sans Nom inversé indique une résistance à laisser partir ce qui ne vous sert plus. Vous vous accrochez peut-être à une relation, un souvenir ou un espoir qui vous empêche d'avancer. Cette carte vous encourage avec douceur à accepter la fin d'un cycle. Ce n'est pas un échec — c'est un acte de sagesse. En libérant le passé, vous ouvrez vos bras à un avenir affectif plus lumineux."
  },
  {
    name: "Tempérance",
    image: "temperance",
    upright: "Tempérance apporte un message d'harmonie et de patience dans vos relations. Cette carte vous invite à trouver le juste milieu entre donner et recevoir, entre passion et raison. L'équilibre émotionnel que vous cultivez en ce moment rayonne autour de vous et apaise vos proches. Continuez sur cette voie de modération et de bienveillance — la paix intérieure est le plus beau cadeau que vous puissiez offrir à vos relations.",
    reversed: "Tempérance inversée signale un excès ou un déséquilibre dans vos relations. Peut-être vivez-vous tout avec trop d'intensité, ou au contraire, vous retenez trop vos émotions. Cette carte vous invite à retrouver la mesure. Les relations les plus belles sont celles où chacun peut exprimer ses émotions sans débordement ni censure. Cherchez ce point d'équilibre — il existe, et il vous apportera la sérénité."
  },
  {
    name: "Le Diable",
    image: "devil",
    upright: "Le Diable met en lumière les passions et les attachements qui influencent vos relations. Cette carte n'est pas négative en soi — elle vous invite simplement à prendre conscience des schémas répétitifs ou des dépendances qui limitent votre liberté affective. Quels sont les liens qui vous élèvent, et lesquels vous enchaînent ? Cette prise de conscience est le premier pas vers une relation plus saine et plus libre.",
    reversed: "Le Diable inversé est une carte de libération. Vous êtes en train de vous affranchir de schémas toxiques, de dépendances affectives ou de relations qui ne vous respectent pas. C'est un moment de grande force intérieure. Félicitez-vous de ce courage — se libérer de ce qui nous fait du mal demande une immense bravoure. Vous êtes sur le chemin d'une vie relationnelle plus authentique et respectueuse de qui vous êtes."
  },
  {
    name: "La Maison Dieu",
    image: "tower",
    upright: "La Maison Dieu annonce un bouleversement qui, bien que déstabilisant, est profondément libérateur. Une vérité éclate, une situation se clarifie brutalement. Même si ce moment peut être douloureux, il vous libère d'illusions qui vous empêchaient d'avancer. C'est sur les ruines de l'ancien que se construit le nouveau. Faites-vous confiance : vous avez la force de reconstruire quelque chose de plus solide et de plus vrai.",
    reversed: "La Maison Dieu inversée suggère que vous pressentez un changement majeur mais que vous essayez de l'éviter. La peur de la confrontation ou de la vérité vous pousse à maintenir un statu quo qui ne vous convient plus. Cette carte vous rappelle qu'un choc évité n'est que reporté. Mieux vaut affronter la réalité avec courage maintenant que de la subir plus tard. Vous méritez des relations fondées sur la vérité."
  },
  {
    name: "L'Étoile",
    image: "star",
    upright: "L'Étoile est un magnifique présage pour votre vie sentimentale. Elle annonce une période de sérénité, d'espoir renouvelé et d'ouverture du cœur. Après les épreuves traversées, une lumière douce et durable éclaire votre chemin. Vos relations se nourrissent de cette énergie apaisante que vous dégagez. Laissez-vous porter par cette vague positive — l'amour, sous toutes ses formes, se rapproche de vous.",
    reversed: "L'Étoile inversée révèle un découragement passager en matière de sentiments. Vous avez peut-être perdu foi en l'amour ou en votre capacité à vivre des relations épanouissantes. Cette carte vous dit avec tendresse : ne perdez pas espoir. Les étoiles ne disparaissent pas — elles se cachent parfois derrière les nuages. Votre lumière intérieure brille toujours, même quand vous ne la voyez plus. Elle reviendra éclairer votre chemin."
  },
  {
    name: "La Lune",
    image: "moon",
    upright: "La Lune vous invite à explorer le monde riche et complexe de vos émotions profondes. En matière de sentiments, cette carte révèle qu'il y a des courants souterrains que vous n'avez pas encore explorés. Vos rêves, vos intuitions et vos ressentis non-dits contiennent des clés précieuses pour comprendre vos relations. Accordez-vous la permission de ressentir pleinement — vos émotions sont des messagères, pas des ennemies.",
    reversed: "La Lune inversée indique une période de confusion sentimentale où illusions et réalité se mélangent. Vous avez peut-être du mal à distinguer ce que vous ressentez vraiment de ce que vous aimeriez ressentir. Des peurs inconscientes peuvent influencer vos choix relationnels. Cette carte vous encourage à chercher la clarté avec bienveillance envers vous-même. La vérité, même quand elle est inconfortable, est toujours libératrice."
  },
  {
    name: "Le Soleil",
    image: "sun",
    upright: "Le Soleil illumine votre tirage d'une énergie magnifique de joie et d'épanouissement. En matière de relations, cette carte annonce une période de bonheur partagé, de complicité retrouvée et de chaleur humaine. Vos liens se renforcent dans la lumière de l'authenticité et de la joie simple d'être ensemble. Profitez pleinement de cette belle énergie — vous la méritez. Laissez rayonner votre bonheur autour de vous.",
    reversed: "Le Soleil inversé suggère que votre joie est voilée par des inquiétudes ou un optimisme de façade. Derrière le sourire, quelque chose vous préoccupe dans vos relations. Cette carte vous invite à être honnête avec vous-même sur ce que vous ressentez vraiment. La vraie joie ne se force pas — elle naît de l'acceptation de qui vous êtes, avec vos forces et vos fragilités. Autorisez-vous à être vulnérable."
  },
  {
    name: "Le Jugement",
    image: "judgement",
    upright: "Le Jugement annonce un renouveau profond dans votre vie sentimentale. C'est l'heure du bilan, du pardon et de la renaissance. Un appel intérieur vous pousse à vous libérer des rancœurs et des regrets pour ouvrir un nouveau chapitre. Que ce soit une réconciliation, un pardon accordé ou reçu, ou un nouveau départ — cette carte confirme que vous êtes prêt(e) à écrire une nouvelle page de votre histoire d'amour.",
    reversed: "Le Jugement inversé révèle une difficulté à tourner la page et à pardonner — que ce soit aux autres ou à vous-même. Des regrets et des blessures non cicatrisées vous retiennent dans le passé. Cette carte vous invite avec compassion à vous libérer de ce poids. Le pardon n'est pas oublier — c'est choisir de ne plus porter la douleur. Vous méritez cette liberté intérieure."
  },
  {
    name: "Le Monde",
    image: "world",
    upright: "Le Monde est la carte de l'accomplissement et de la plénitude. Dans vos relations, elle indique que vous approchez d'un aboutissement, d'un cycle qui se complète avec grâce. Vos efforts pour construire des liens authentiques portent leurs fruits. Cette carte célèbre votre parcours et vous confirme que vous êtes sur le bon chemin. Savourez ce sentiment de complétude — vous avez travaillé dur pour en arriver là.",
    reversed: "Le Monde inversé indique un sentiment d'inachèvement dans votre vie sentimentale. Vous sentez peut-être qu'il manque quelque chose pour être pleinement épanoui(e) dans vos relations. Cette carte vous encourage à ne pas abandonner si près du but. Les derniers pas sont souvent les plus difficiles, mais aussi les plus transformateurs. Persévérez avec patience — la plénitude que vous recherchez est à votre portée."
  },
  {
    name: "Le Mat",
    image: "fool",
    upright: "Le Mat vous invite à un saut de foi en matière de sentiments. C'est la carte du nouveau départ, de l'aventure et de la spontanéité. Osez sortir de votre zone de confort relationnelle et laissez-vous surprendre par la vie. Que ce soit une nouvelle rencontre, une déclaration d'amour ou un changement radical — cette carte vous dit que le moment est venu d'oser. L'amour récompense les cœurs audacieux.",
    reversed: "Le Mat inversé met en garde contre une impulsivité en matière de sentiments. Vous êtes peut-être tenté(e) d'agir sur un coup de tête sans mesurer les conséquences pour vous et pour les autres. Cette carte vous invite à garder votre enthousiasme tout en cultivant la réflexion. L'audace est belle quand elle est accompagnée de conscience. Prenez le temps de réfléchir avant de faire un pas décisif dans vos relations."
  },
];

function drawThreeCards() {
  const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);
  return selected.map(card => {
    const reversed = Math.random() < 0.3;
    return {
      name: card.name + (reversed ? " (Inversée)" : ""),
      image: card.image,
      meaning: reversed ? card.reversed : card.upright,
      reversed,
    };
  });
}

function detectTheme(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("couple") || q.includes("mari") || q.includes("femme") || q.includes("conjoint") || q.includes("partenaire") || q.includes("amour") || q.includes("relation") || q.includes("amoure") || q.includes("sentiment") || q.includes("cœur") || q.includes("coeur"))
    return "sentimental";
  if (q.includes("famille") || q.includes("enfant") || q.includes("parent") || q.includes("frère") || q.includes("sœur") || q.includes("mère") || q.includes("père"))
    return "familial";
  if (q.includes("travail") || q.includes("professi") || q.includes("carrière") || q.includes("emploi") || q.includes("collègue"))
    return "professionnel";
  if (q.includes("sépar") || q.includes("rupture") || q.includes("divorc") || q.includes("quitt"))
    return "rupture";
  if (q.includes("confiance") || q.includes("estime") || q.includes("doute") || q.includes("peur"))
    return "confiance";
  return "sentimental";
}

function generateInterpretation(question: string, cards: { name: string; meaning: string; reversed: boolean }[]) {
  const positions = ["Le Passé / La Situation", "Le Présent / Le Défi", "L'Avenir / Le Conseil"];
  const theme = detectTheme(question);
  let interpretation = `Votre question : "${question}"\n\n`;

  const positionIntros = [
    "Cette première carte éclaire ce qui a construit votre situation actuelle — les fondations émotionnelles sur lesquelles vous vous tenez aujourd'hui.\n\n",
    "Cette deuxième carte révèle l'énergie qui traverse votre vie en ce moment — le défi ou l'opportunité qui se présente à vous.\n\n",
    "Cette troisième carte vous offre une direction, un conseil pour avancer avec sagesse et confiance vers l'avenir.\n\n"
  ];

  cards.forEach((card, i) => {
    interpretation += `${positions[i]} — ${card.name}\n`;
    interpretation += positionIntros[i];
    interpretation += `${card.meaning}\n\n`;
  });

  interpretation += "---\n\n";
  interpretation += "Synthèse de votre tirage\n\n";

  const reversedCount = cards.filter(c => c.reversed).length;

  if (reversedCount === 0) {
    interpretation += "Les trois cartes sont à l'endroit, ce qui est un signe très encourageant. L'énergie qui circule dans votre vie est globalement positive et harmonieuse. ";
    if (theme === "sentimental") {
      interpretation += "Sur le plan sentimental, ce tirage confirme que vous êtes dans un mouvement juste. Vos sentiments sont clairs, votre cœur est ouvert, et les conditions sont réunies pour que l'amour se renforce ou se manifeste dans votre vie. Faites confiance à cette belle dynamique — vous méritez pleinement le bonheur qui se dessine.";
    } else if (theme === "rupture") {
      interpretation += "Même si vous traversez une période difficile, ce tirage montre que les énergies sont alignées pour une guérison et un renouveau. La douleur que vous ressentez est légitime, mais elle n'est pas une fin — c'est le terreau d'une nouvelle version de vous-même, plus forte et plus libre.";
    } else if (theme === "familial") {
      interpretation += "Votre vie familiale bénéficie d'une énergie positive. Les liens qui vous unissent à vos proches sont nourris par de bonnes intentions et une envie sincère d'harmonie. Continuez à cultiver cette communication ouverte et bienveillante — elle est votre plus grande richesse.";
    } else {
      interpretation += "Votre situation évolue dans le bon sens. Les trois cartes à l'endroit confirment que vous êtes sur la bonne voie. Continuez à écouter votre intuition et à agir avec authenticité dans toutes vos relations.";
    }
  } else if (reversedCount === 1) {
    interpretation += "Deux cartes à l'endroit et une carte inversée dessinent un tableau globalement positif, avec un point d'attention important. ";
    if (theme === "sentimental") {
      interpretation += "Sur le plan amoureux, l'essentiel est là : de l'élan, de la sincérité et un vrai potentiel. La carte inversée met simplement en lumière un aspect de votre vie sentimentale qui mérite d'être exploré plus en profondeur — un blocage ancien, une peur non exprimée, ou un besoin que vous n'osez pas formuler. C'est justement en éclairant cette zone d'ombre que vous pourrez débloquer une énergie positive considérable dans votre vie amoureuse.";
    } else if (theme === "rupture") {
      interpretation += "Votre processus de guérison avance, mais un aspect spécifique demande encore de l'attention. La carte inversée pointe vers une blessure ou une croyance qui vous retient. En l'identifiant et en la travaillant, vous accélérerez considérablement votre renaissance sentimentale.";
    } else {
      interpretation += "La carte inversée signale un point d'attention qui mérite d'être exploré avec bienveillance. C'est une invitation à approfondir votre compréhension de cette dynamique spécifique — elle contient une clé importante pour votre épanouissement.";
    }
  } else if (reversedCount === 2) {
    interpretation += "Deux cartes inversées révèlent des tensions intérieures ou des résistances qui influencent vos relations. Mais ne vous découragez pas : cette configuration est avant tout une invitation à l'introspection. ";
    if (theme === "sentimental") {
      interpretation += "En matière de sentiments, ces tensions cachent souvent des blessures anciennes qui se rejouent dans le présent. Des schémas relationnels hérités de votre histoire personnelle — peut-être même de votre enfance — influencent inconsciemment vos choix amoureux. La bonne nouvelle, c'est que cette prise de conscience est le premier pas vers la guérison. En comprenant ces mécanismes, vous vous donnez les moyens de construire des relations plus saines et plus épanouissantes.";
    } else if (theme === "rupture") {
      interpretation += "Cette période de turbulence est intense, mais elle porte en elle les graines d'une transformation profonde. Chaque épreuve relationnelle est une opportunité de mieux vous connaître et de redéfinir ce que vous voulez vraiment dans votre vie affective.";
    } else {
      interpretation += "Ces résistances sont une invitation à l'introspection et au dialogue. Des ajustements dans votre manière de communiquer et d'interagir sont nécessaires pour retrouver l'harmonie. Chaque défi est une opportunité de croissance.";
    }
  } else {
    interpretation += "Les trois cartes inversées indiquent une période de profonde remise en question. C'est un moment charnière dans votre vie, qui demande du courage et beaucoup de bienveillance envers vous-même. ";
    if (theme === "sentimental") {
      interpretation += "Sur le plan sentimental, vous traversez peut-être une nuit obscure de l'âme — un moment où tout semble bloqué ou douloureux. Mais rappelez-vous : c'est dans les moments les plus sombres que la lumière se prépare. Cette période de questionnement intense est en réalité le signe que vous êtes prêt(e) pour un changement majeur dans votre vie amoureuse. Vous ne restez pas bloqué(e) — vous êtes en pleine transformation.";
    } else if (theme === "rupture") {
      interpretation += "La douleur que vous traversez est réelle et mérite d'être pleinement reconnue. Mais ce tirage montre aussi que derrière cette souffrance se cache une transformation puissante. Vous êtes en train de vous reconstruire, même si vous ne le sentez pas encore. Un jour prochain, vous regarderez en arrière et vous comprendrez que cette épreuve était nécessaire pour devenir la personne que vous êtes destiné(e) à être.";
    } else {
      interpretation += "Cette configuration demande un accompagnement plus approfondi pour dénouer les fils de votre situation. Les cartes inversées ne sont jamais une condamnation — elles sont une invitation à creuser plus profondément pour trouver les clés de votre épanouissement.";
    }
  }

  interpretation += "\n\n---\n\n";
  interpretation += "Ce tirage vous donne un premier éclairage, mais les cartes ont encore beaucoup à révéler. Chaque tirage est une porte d'entrée vers une compréhension plus profonde de vous-même et de vos relations. ";
  interpretation += "Pour une interprétation complète et personnalisée — en croisant la cartomancie avec votre profil numérologique — une consultation privée avec Philippe Niard vous apportera des réponses bien plus précises et adaptées à votre situation unique.";

  return interpretation;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Services
  app.get(api.services.list.path, async (_req, res) => {
    const services = await storage.getServices();
    res.json(services);
  });

  app.get(api.services.get.path, async (req, res) => {
    const id = Number(req.params.id);
    const service = await storage.getService(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  });

  // Testimonials
  app.get(api.testimonials.list.path, async (_req, res) => {
    const testimonials = await storage.getTestimonials();
    res.json(testimonials);
  });

  // Inquiries
  app.post(api.inquiries.create.path, async (req, res) => {
    try {
      const input = api.inquiries.create.input.parse(req.body);
      await storage.createInquiry(input);
      res.status(201).json({ success: true, message: "Inquiry received" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Tarot
  app.post(api.tarot.draw.path, async (req, res) => {
    try {
      const input = tarotInputSchema.parse(req.body);
      const count = await storage.getTarotReadingCountByEmail(input.email);
      
      if (count >= 3) {
        return res.status(429).json({
          message: "Vous avez atteint la limite de 3 tirages gratuits. Réservez une consultation privée pour aller plus loin.",
        });
      }
      
      const cards = drawThreeCards();
      const interpretation = generateInterpretation(input.question, cards);
      
      await storage.createTarotReading({
        email: input.email,
        question: input.question,
        cards: cards.map(c => c.name),
        interpretation,
      });
      
      const newCount = count + 1;
      
      res.json({
        cards,
        interpretation,
        readingCount: newCount,
        showConsultationLink: newCount >= 3,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get("/api/tarot/count/:email", async (req, res) => {
    const email = decodeURIComponent(req.params.email);
    const count = await storage.getTarotReadingCountByEmail(email);
    res.json({ count });
  });

  app.get("/api/availability", async (req, res) => {
    try {
      const dateStr = req.query.date as string;
      const serviceIdStr = req.query.serviceId as string;
      if (!dateStr || !serviceIdStr) {
        return res.status(400).json({ message: "Les paramètres date et serviceId sont requis" });
      }

      const serviceId = Number(serviceIdStr);
      const service = await storage.getService(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service introuvable" });
      }

      const requestedDate = new Date(dateStr + "T00:00:00");
      const dayOfWeek = requestedDate.getDay();

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (requestedDate < today) {
        return res.json({ slots: [] });
      }

      const rules = await storage.getAvailabilityRules();
      const dayRules = rules.filter(r => r.dayOfWeek === dayOfWeek);

      if (dayRules.length === 0) {
        return res.json({ slots: [] });
      }

      const serviceDurationMinutes = parseDurationToMinutes(service.duration);
      const BUFFER_MINUTES = 15;

      const existingBookings = await storage.getBookingsByDate(dateStr);

      const slots: { startTime: string; endTime: string }[] = [];

      for (const rule of dayRules) {
        const [startH, startM] = rule.startTime.split(":").map(Number);
        const [endH, endM] = rule.endTime.split(":").map(Number);
        const ruleStartMinutes = startH * 60 + startM;
        const ruleEndMinutes = endH * 60 + endM;

        let cursor = ruleStartMinutes;
        while (cursor + serviceDurationMinutes <= ruleEndMinutes) {
          const slotStart = `${String(Math.floor(cursor / 60)).padStart(2, "0")}:${String(cursor % 60).padStart(2, "0")}`;
          const slotEnd = `${String(Math.floor((cursor + serviceDurationMinutes) / 60)).padStart(2, "0")}:${String((cursor + serviceDurationMinutes) % 60).padStart(2, "0")}`;

          const isBooked = existingBookings.some(b => {
            const bStart = timeToMinutes(b.startTime);
            const bEnd = timeToMinutes(b.endTime);
            return cursor < bEnd + BUFFER_MINUTES && cursor + serviceDurationMinutes > bStart - BUFFER_MINUTES;
          });

          if (!isBooked) {
            slots.push({ startTime: slotStart, endTime: slotEnd });
          }

          cursor += rule.slotDurationMinutes;
        }
      }

      res.json({ slots, service: { id: service.id, title: service.title, price: service.price, duration: service.duration } });
    } catch (err) {
      console.error("Error fetching availability:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const { serviceId, clientName, clientEmail, bookingDate, startTime, endTime } = req.body;

      if (!serviceId || !clientName || !clientEmail || !bookingDate || !startTime || !endTime) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
      }

      const service = await storage.getService(Number(serviceId));
      if (!service) {
        return res.status(404).json({ message: "Service introuvable" });
      }

      const existingBookings = await storage.getBookingsByDate(bookingDate);
      const newStart = timeToMinutes(startTime);
      const newEnd = timeToMinutes(endTime);
      const BUFFER_MINUTES = 15;
      const conflict = existingBookings.some(b => {
        const bStart = timeToMinutes(b.startTime);
        const bEnd = timeToMinutes(b.endTime);
        return newStart < bEnd + BUFFER_MINUTES && newEnd > bStart - BUFFER_MINUTES;
      });

      if (conflict) {
        return res.status(409).json({ message: "Ce créneau n'est plus disponible. Veuillez en choisir un autre." });
      }

      const booking = await storage.createBooking({
        serviceId: Number(serviceId),
        clientName,
        clientEmail,
        bookingDate,
        startTime,
        endTime,
      });

      sendBookingNotification({
        clientName,
        clientEmail,
        serviceName: service.title,
        servicePrice: service.price,
        bookingDate,
        startTime,
        endTime,
      }).catch(err => console.error("Email notification error:", err));

      res.status(201).json({
        booking,
        stripePaymentLink: service.stripePaymentLink,
      });
    } catch (err) {
      console.error("Error creating booking:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.get("/api/admin/export-emails", async (_req, res) => {
    try {
      const results = await db.execute(`
        SELECT DISTINCT ON (email) email, name, source, created_at FROM (
          SELECT email, NULL as name, 'Cartomancie' as source, created_at FROM tarot_readings
          UNION ALL
          SELECT email, name, 'Contact' as source, created_at FROM inquiries
          UNION ALL
          SELECT client_email as email, client_name as name, 'Réservation' as source, created_at FROM bookings
        ) all_emails
        ORDER BY email, created_at ASC
      `);

      const rows = results.rows as Array<{ email: string; name: string | null; source: string; created_at: string }>;

      let csv = "\uFEFFEmail,Nom,Source,Date d'inscription\n";
      for (const row of rows) {
        const email = (row.email || "").replace(/"/g, '""');
        const name = (row.name || "").replace(/"/g, '""');
        const source = row.source || "";
        const date = row.created_at ? new Date(row.created_at).toLocaleDateString("fr-FR") : "";
        csv += `"${email}","${name}","${source}","${date}"\n`;
      }

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", "attachment; filename=clients-les-portes-du-temps-888.csv");
      res.send(csv);
    } catch (err) {
      console.error("Error exporting emails:", err);
      res.status(500).json({ message: "Erreur lors de l'export" });
    }
  });

  await seedDatabase();

  return httpServer;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function parseDurationToMinutes(duration: string): number {
  const hourMatch = duration.match(/(\d+)\s*h/i);
  const minMatch = duration.match(/(\d+)\s*min/i);
  let total = 0;
  if (hourMatch) total += parseInt(hourMatch[1]) * 60;
  if (minMatch) total += parseInt(minMatch[1]);
  if (total === 0) {
    const numOnly = duration.match(/(\d+)/);
    total = numOnly ? parseInt(numOnly[1]) : 60;
  }
  return total;
}

async function seedDatabase() {
  const existingServices = await storage.getServices();
  if (existingServices.length === 0) {
    await storage.createService({
      title: "Coaching Conjugal",
      description: "Un accompagnement personnalisé pour les couples. Grâce à la numérologie humaniste, nous analysons vos chemins de vie respectifs, vos compatibilités et vos zones de friction pour construire une relation plus harmonieuse et épanouissante.",
      price: "120 \u20ac",
      duration: "90 min",
      category: "coaching",
      imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80",
      stripePaymentLink: "https://buy.stripe.com/aFadR9bz27rfgKNdXves008",
    });

    await storage.createService({
      title: "Coaching Familial Numérologique",
      description: "Explorez les dynamiques de votre famille à travers la lecture des nombres de chaque membre. Comprenez les rôles, les tensions et les forces de votre cellule familiale pour favoriser une communication plus fluide et des liens plus forts.",
      price: "140 \u20ac",
      duration: "2h",
      category: "coaching",
      imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80",
      stripePaymentLink: "https://buy.stripe.com/7sYcN5cD6fXLfGJ2eNes009",
    });

    await storage.createService({
      title: "Thème Numérologique Complet",
      description: "Découvrez votre chemin de vie, votre année personnelle, vos défis et vos potentiels cachés. La numérologie humaniste, avec sa dimension psychologique, révèle vos mécanismes profonds et vous donne les clés pour mieux vous comprendre.",
      price: "120 \u20ac",
      duration: "75 min",
      category: "numerology",
      imageUrl: "https://images.unsplash.com/photo-1515511856132-758f69165150?auto=format&fit=crop&q=80",
      stripePaymentLink: "https://buy.stripe.com/3cscO86FFfDEapG7sv",
    });

    await storage.createService({
      title: "Numérologie Personnalisée",
      description: "Un accompagnement sur mesure qui explore en profondeur votre profil numérologique. Chemin de vie, année personnelle et cycles : tous les aspects sont analysés pour vous donner des clés concrètes de compréhension et d'évolution.",
      price: "50 \u20ac",
      duration: "60 min",
      category: "numerology",
      imageUrl: "https://images.unsplash.com/photo-1620215984620-8c2900976269?auto=format&fit=crop&q=80",
      stripePaymentLink: "https://buy.stripe.com/6oEdSc1ll0IK0P628a",
    });

    await storage.createService({
      title: "Consultation Cartomancie 60 min",
      description: "Une consultation complète de cartomancie pour éclairer une situation spécifique, une question ou un choix important. Un outil intuitif au service de votre réflexion et de votre cheminement personnel.",
      price: "50 \u20ac",
      duration: "60 min",
      category: "cartomancy",
      imageUrl: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&q=80",
      stripePaymentLink: "https://buy.stripe.com/00g3dy1llbnoeFW3cd",
    });

    await storage.createService({
      title: "Consultation Cartomancie 30 min",
      description: "Une consultation express de cartomancie pour une question précise. Idéal pour un éclairage rapide sur une situation ou un choix à faire.",
      price: "30 \u20ac",
      duration: "30 min",
      category: "cartomancy",
      imageUrl: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&q=80",
      stripePaymentLink: "https://buy.stripe.com/8wM4hCe871MO9lC000",
    });
  } else {
    const priceCorrections: Record<string, string> = {
      "Thème Numérologique Complet": "120 \u20ac",
      "Numérologie Personnalisée": "50 \u20ac",
      "Consultation Cartomancie 60 min": "50 \u20ac",
      "Consultation Cartomancie 30 min": "30 \u20ac",
    };
    for (const service of existingServices) {
      const correctPrice = priceCorrections[service.title];
      if (correctPrice && service.price !== correctPrice) {
        await db.update(services).set({ price: correctPrice }).where(eq(services.id, service.id));
        console.log(`Price corrected: ${service.title} ${service.price} -> ${correctPrice}`);
      }
    }
  }

  const existingRules = await storage.getAvailabilityRules();
  if (existingRules.length === 0) {
    const defaultSchedule = [
      { dayOfWeek: 1, startTime: "10:00", endTime: "12:00", slotDurationMinutes: 60 },
      { dayOfWeek: 1, startTime: "14:00", endTime: "18:00", slotDurationMinutes: 60 },
      { dayOfWeek: 2, startTime: "10:00", endTime: "12:00", slotDurationMinutes: 60 },
      { dayOfWeek: 2, startTime: "14:00", endTime: "18:00", slotDurationMinutes: 60 },
      { dayOfWeek: 3, startTime: "10:00", endTime: "12:00", slotDurationMinutes: 60 },
      { dayOfWeek: 3, startTime: "14:00", endTime: "18:00", slotDurationMinutes: 60 },
      { dayOfWeek: 4, startTime: "10:00", endTime: "12:00", slotDurationMinutes: 60 },
      { dayOfWeek: 4, startTime: "14:00", endTime: "18:00", slotDurationMinutes: 60 },
      { dayOfWeek: 5, startTime: "10:00", endTime: "12:00", slotDurationMinutes: 60 },
      { dayOfWeek: 5, startTime: "14:00", endTime: "18:00", slotDurationMinutes: 60 },
    ];
    for (const rule of defaultSchedule) {
      await storage.createAvailabilityRule(rule);
    }
  }

  const existingTestimonials = await storage.getTestimonials();
  if (existingTestimonials.length === 0) {
    await storage.createTestimonial({
      name: "Sophie et Marc L.",
      content: "Philippe a su mettre des mots sur ce que nous ressentions sans pouvoir l'exprimer. La lecture de nos chemins de vie respectifs nous a permis de comprendre pourquoi nous bloquions sur certains sujets. Depuis, notre communication a complètement changé.",
      rating: 5,
      role: "Coaching Conjugal"
    });

    await storage.createTestimonial({
      name: "Catherine D.",
      content: "J'étais sceptique sur la numérologie, mais l'approche de Philippe est tellement ancrée dans la psychologie que c'est devenu un véritable outil de compréhension de ma famille. Les dynamiques entre mes enfants et moi sont bien plus claires maintenant.",
      rating: 5,
      role: "Coaching Familial"
    });

    await storage.createTestimonial({
      name: "Laurent et Nathalie B.",
      content: "Nous étions au bord de la séparation. Le thème numérologique de couple que Philippe a réalisé nous a ouvert les yeux sur nos modes de fonctionnement complémentaires. Un grand merci pour cette approche bienveillante et éclairante.",
      rating: 5,
      role: "Compatibilité de Couple"
    });
  }
}
