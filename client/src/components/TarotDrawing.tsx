import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mail, HelpCircle, RotateCcw, ArrowRight, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";

interface TarotCard {
  name: string;
  image: string;
  meaning: string;
  reversed: boolean;
}

interface TarotResult {
  cards: TarotCard[];
  interpretation: string;
  readingCount: number;
  showConsultationLink: boolean;
}

const CARD_SYMBOLS: Record<string, string> = {
  magician: "I",
  high_priestess: "II",
  empress: "III",
  emperor: "IV",
  hierophant: "V",
  lovers: "VI",
  chariot: "VII",
  justice: "VIII",
  hermit: "IX",
  wheel: "X",
  strength: "XI",
  hanged_man: "XII",
  death: "XIII",
  temperance: "XIV",
  devil: "XV",
  tower: "XVI",
  star: "XVII",
  moon: "XVIII",
  sun: "XIX",
  judgement: "XX",
  world: "XXI",
  fool: "0",
};

const POSITION_LABELS = ["Passé", "Présent", "Avenir"];

export default function TarotDrawing() {
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<TarotResult | null>(null);
  const [revealedCards, setRevealedCards] = useState<boolean[]>([false, false, false]);
  const [allRevealed, setAllRevealed] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [questionError, setQuestionError] = useState("");
  const [limitReached, setLimitReached] = useState(false);

  const drawMutation = useMutation({
    mutationFn: async (data: { email: string; question: string }) => {
      const res = await fetch("/api/tarot/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 429) {
        setLimitReached(true);
        throw new Error("limit_reached");
      }
      if (!res.ok) throw new Error("Erreur lors du tirage");
      return (await res.json()) as TarotResult;
    },
    onSuccess: (data) => {
      setResult(data);
      setRevealedCards([false, false, false]);
      setAllRevealed(false);
      setTimeout(() => setRevealedCards([true, false, false]), 600);
      setTimeout(() => setRevealedCards([true, true, false]), 1200);
      setTimeout(() => {
        setRevealedCards([true, true, true]);
        setAllRevealed(true);
      }, 1800);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setQuestionError("");

    let hasError = false;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Veuillez entrer une adresse email valide.");
      hasError = true;
    }
    if (!question || question.length < 5) {
      setQuestionError("Veuillez poser une question (minimum 5 caractères).");
      hasError = true;
    }
    if (hasError) return;

    drawMutation.mutate({ email, question });
  };

  const handleReset = () => {
    setResult(null);
    setQuestion("");
    setRevealedCards([false, false, false]);
    setAllRevealed(false);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary mb-4">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium" data-testid="text-tarot-badge">Tirage Gratuit</span>
        </div>
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="text-tarot-heading">
          Tirage de <span className="text-primary">3 Cartes</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-tarot-description">
          Posez votre question et découvrez ce que les cartes révèlent sur votre situation. Passé, présent, avenir : trois cartes pour éclairer votre chemin.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {limitReached && !result ? (
          <motion.div
            key="limit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-lg mx-auto text-center"
            data-testid="section-limit-reached"
          >
            <div className="bg-primary/10 border border-primary/30 rounded-2xl p-8">
              <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold mb-3" data-testid="text-limit-heading">Vos 3 tirages gratuits sont utilisés</h3>
              <p className="text-muted-foreground text-sm mb-6" data-testid="text-limit-message">
                Pour une interprétation approfondie et personnalisée, réservez une consultation privée avec Philippe Niard.
              </p>
              <Link href="/contact">
                <Button data-testid="button-book-consultation-limit" className="rounded-full">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Réserver une consultation privée
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : !result ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-lg mx-auto"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label className="mb-2 inline-flex items-center gap-2" data-testid="label-tarot-email">
                  <Mail className="w-4 h-4" />
                  Votre adresse email
                </Label>
                <Input
                  data-testid="input-tarot-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  placeholder="votre@email.com"
                  className="bg-white/5 border-white/10"
                />
                {emailError && <p className="text-red-400 text-sm mt-1" data-testid="text-email-error">{emailError}</p>}
              </div>

              <div>
                <Label className="mb-2 inline-flex items-center gap-2" data-testid="label-tarot-question">
                  <HelpCircle className="w-4 h-4" />
                  Votre question
                </Label>
                <Textarea
                  data-testid="input-tarot-question"
                  value={question}
                  onChange={(e) => { setQuestion(e.target.value); setQuestionError(""); }}
                  placeholder="Que souhaitez-vous savoir ? (ex: Comment améliorer ma relation de couple ?)"
                  rows={3}
                  className="bg-white/5 border-white/10 resize-none"
                />
                {questionError && <p className="text-red-400 text-sm mt-1" data-testid="text-question-error">{questionError}</p>}
              </div>

              <Button
                data-testid="button-tarot-draw"
                type="submit"
                disabled={drawMutation.isPending}
                className="w-full rounded-xl"
                size="lg"
              >
                {drawMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Les cartes se mélangent...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Tirer les cartes
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8 mb-10">
              {result.cards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, rotateY: 180, scale: 0.8 }}
                  animate={revealedCards[index] ? {
                    opacity: 1,
                    rotateY: 0,
                    scale: 1,
                  } : {
                    opacity: 0.5,
                    rotateY: 180,
                    scale: 0.8,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex flex-col items-center"
                  data-testid={`card-tarot-${index}`}
                >
                  <span className="text-xs uppercase tracking-widest text-primary mb-3 font-semibold" data-testid={`text-position-${index}`}>
                    {POSITION_LABELS[index]}
                  </span>
                  <div className={`relative w-40 h-60 md:w-48 md:h-72 rounded-xl border-2 ${card.reversed ? 'border-red-400/50' : 'border-primary/50'} bg-gradient-to-br ${card.reversed ? 'from-red-950/40 to-purple-950/60' : 'from-indigo-950/40 to-purple-950/60'} shadow-lg shadow-primary/10 flex flex-col items-center justify-center p-4 ${card.reversed ? 'rotate-180' : ''}`}>
                    <div className={card.reversed ? 'rotate-180' : ''}>
                      <span className="text-3xl md:text-4xl font-serif font-bold text-primary/80 mb-2 block text-center" data-testid={`text-card-numeral-${index}`}>
                        {CARD_SYMBOLS[card.image] || "?"}
                      </span>
                      <div className="w-12 h-[1px] bg-primary/30 mx-auto my-2" />
                      <p className="text-xs text-center text-foreground/80 font-medium leading-tight" data-testid={`text-card-name-${index}`}>
                        {card.name.replace(" (Inversée)", "")}
                      </p>
                    </div>
                  </div>
                  {revealedCards[index] && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-3 text-center max-w-48"
                    >
                      <p className="text-sm font-semibold text-foreground mb-1" data-testid={`text-card-label-${index}`}>
                        {card.name}
                      </p>
                      {card.reversed && (
                        <span className="inline-block text-[10px] uppercase tracking-wider text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full mb-1" data-testid={`badge-reversed-${index}`}>
                          Inversée
                        </span>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {allRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-2xl mx-auto"
              >
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-6">
                  <h3 className="font-serif text-xl font-bold mb-4 text-primary" data-testid="text-interpretation-heading">Interprétation de votre tirage</h3>
                  {result.cards.map((card, i) => {
                    const fullText = result.interpretation;
                    const posLabel = ["Le Passé / La Situation", "Le Présent / Le Défi", "L'Avenir / Le Conseil"][i];
                    const sectionStart = fullText.indexOf(`${posLabel} — ${card.name}`);
                    let cardInterpretation = card.meaning;
                    if (sectionStart !== -1) {
                      const afterHeader = fullText.substring(sectionStart);
                      const introMatch = afterHeader.match(/\n\n(Cette (?:première|deuxième|troisième) carte[^\n]+)\n\n/);
                      const intro = introMatch ? introMatch[1] : "";
                      cardInterpretation = intro ? `${intro}\n\n${card.meaning}` : card.meaning;
                    }
                    return (
                      <div key={i} className="mb-6 last:mb-0" data-testid={`text-card-meaning-${i}`}>
                        <p className="text-sm font-semibold text-primary/80 mb-1 uppercase tracking-wider">
                          {POSITION_LABELS[i]}
                        </p>
                        <p className="text-sm font-bold text-foreground mb-2">
                          {card.name}
                        </p>
                        {cardInterpretation.split("\n\n").map((paragraph, pi) => (
                          <p key={pi} className="text-muted-foreground text-sm leading-relaxed mb-2 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    );
                  })}

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-sm font-semibold text-primary/80 mb-3 uppercase tracking-wider" data-testid="text-synthesis-label">Synthèse de votre tirage</p>
                    {(() => {
                      const parts = result.interpretation.split("Synthèse de votre tirage");
                      const afterSynthesis = parts[1] || "";
                      const ctaSplit = afterSynthesis.split("Ce tirage vous donne un premier éclairage");
                      const synthesisText = ctaSplit[0]?.replace(/^[\s\n-]+/, "").trim() || "";
                      const ctaText = ctaSplit[1] ? "Ce tirage vous donne un premier éclairage" + ctaSplit[1].replace(/^[\s\n-]+/, "") : "";
                      return (
                        <>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4" data-testid="text-tarot-synthesis">
                            {synthesisText}
                          </p>
                          {ctaText && (
                            <p className="text-foreground/80 text-sm leading-relaxed italic" data-testid="text-tarot-cta-message">
                              {ctaText}
                            </p>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-primary/10 border border-primary/30 rounded-2xl p-6 text-center mb-6"
                  data-testid="section-consultation-link"
                >
                  <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-serif text-lg font-bold mb-2" data-testid="text-consultation-heading">Envie d'aller plus loin ?</h4>
                  <p className="text-muted-foreground text-sm mb-2" data-testid="text-consultation-message">
                    Ce tirage gratuit vous offre un premier aperçu. Pour une interprétation approfondie, croisant cartomancie et numérologie, Philippe Niard vous propose un accompagnement personnalisé et bienveillant.
                  </p>
                  <p className="text-muted-foreground text-xs mb-4">
                    Chaque situation est unique — une consultation privée vous apportera des réponses précises, adaptées à votre histoire et à vos besoins.
                  </p>
                  <Link href="/booking">
                    <Button
                      data-testid="button-book-consultation"
                      className="rounded-full"
                    >
                      Réserver ma consultation privée
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </motion.div>

                <div className="text-center">
                  <p className="text-muted-foreground text-xs mb-4" data-testid="text-reading-count">
                    Tirage {result.readingCount}/3 gratuit{result.readingCount > 1 ? "s" : ""}
                    {!result.showConsultationLink && ` — ${3 - result.readingCount} restant${3 - result.readingCount > 1 ? "s" : ""}`}
                  </p>
                  <Button
                    data-testid="button-tarot-reset"
                    onClick={handleReset}
                    variant="outline"
                    className="rounded-full"
                    size="sm"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Nouveau tirage
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}