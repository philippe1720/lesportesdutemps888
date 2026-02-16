import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Quote, Heart, Brain, Users, BookOpen } from "lucide-react";

import { updateSEO } from "@/lib/seo";

export default function About() {
  useEffect(() => {
    updateSEO(
      "Philippe Niard — Coach Relationnel, Numérologie Stratégique & PNL | Les Portes du Temps",
      "Découvrez le parcours de Philippe Niard, coach professionnel spécialisé en relations conjugales et familiales. Approche basée sur la numérologie, les neurosciences et la PNL. Loin de la voyance."
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <div className="pt-32 pb-16 px-4 text-center">
        <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Philippe Niard</h1>
        <p className="text-primary text-lg tracking-wider uppercase font-medium">Coach en Relations Conjugales & Familiales</p>
        <div className="w-24 h-1 bg-primary mx-auto mt-6" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl">
              
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="font-serif text-2xl font-bold text-white">Philippe Niard</h3>
                <p className="text-primary/90 text-sm tracking-wider uppercase">Numérologue Humaniste & Coach Relationnel</p>
              </div>
            </div>
            <div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-2 border-r-2 border-primary/30 rounded-br-3xl" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 text-lg text-muted-foreground leading-relaxed"
          >
            <h2 className="font-serif text-3xl text-foreground font-semibold">Mon parcours et ma vision</h2>
            <p>
              Je suis Philippe Niard, coach spécialisé dans les relations conjugales et familiales. Mon outil principal est la <span className="text-primary font-medium">numérologie humaniste</span> — une approche qui se distingue clairement de la numérologie holistique ou ésotérique.
            </p>
            <p>
              La numérologie humaniste s'appuie sur une base psychologique solide. Elle ne prédit pas l'avenir : elle éclaire vos mécanismes profonds, vos besoins relationnels et vos schémas de fonctionnement. C'est un outil de compréhension de soi au service de la relation à l'autre.
            </p>
            <p>
              Mon accompagnement s'adresse aux couples qui souhaitent mieux se comprendre, aux familles en quête d'harmonie, et à toute personne désirant éclairer ses dynamiques relationnelles. Si vous le souhaitez, je peux également compléter nos séances par un <span className="text-primary font-medium">tirage de tarot</span>, pour apporter un éclairage supplémentaire.
            </p>
            
            <div className="pt-6 grid grid-cols-2 gap-6">
              <div className="bg-white/5 p-6 rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
                <Brain className="w-8 h-8 text-primary mb-3" />
                <h4 className="font-serif font-bold text-foreground mb-1">Approche Psychologique</h4>
                <p className="text-sm">La numérologie humaniste intègre la dimension psychologique pour une lecture en profondeur.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
                <Heart className="w-8 h-8 text-primary mb-3" />
                <h4 className="font-serif font-bold text-foreground mb-1">Écoute Bienveillante</h4>
                <p className="text-sm">Un espace de confiance pour explorer vos relations en toute sérénité.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Approach Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white/5 p-8 rounded-2xl border border-white/5 text-center"
          >
            <Users className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold mb-3 text-foreground">Coaching Conjugal</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Comprendre les dynamiques de votre couple, identifier les points de friction et découvrir les leviers d'harmonie grâce à la lecture de vos nombres respectifs.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white/5 p-8 rounded-2xl border border-white/5 text-center"
          >
            <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold mb-3 text-foreground">Coaching Familial</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Explorer les liens familiaux, comprendre les rôles de chacun et favoriser une communication plus fluide entre les membres de la famille.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/5 p-8 rounded-2xl border border-white/5 text-center"
          >
            <BookOpen className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold mb-3 text-foreground">Tarot (Optionnel)</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              En complément de la numérologie, le tarot peut offrir un éclairage supplémentaire sur une situation ou une question spécifique si vous le souhaitez.
            </p>
          </motion.div>
        </div>
        
        {/* Philosophy */}
        <div className="bg-card/30 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden border border-white/5">
          <Quote className="absolute top-10 left-10 text-primary/10 w-24 h-24" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8">Ma Philosophie</h2>
            <p className="text-xl md:text-2xl font-serif italic text-muted-foreground leading-relaxed mb-6">
              "La numérologie humaniste ne vous dit pas qui vous êtes — elle vous aide à comprendre comment vous fonctionnez, pour mieux vivre avec vous-même et avec les autres."
            </p>
            <p className="text-muted-foreground">— Philippe Niard</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
