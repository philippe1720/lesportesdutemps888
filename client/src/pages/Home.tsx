import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Heart, Users, Brain } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import TestimonialCard from "@/components/TestimonialCard";
import LifePathCalculator from "@/components/LifePathCalculator";
import TarotDrawing from "@/components/TarotDrawing";
import MonthlyEnergy from "@/components/MonthlyEnergy";
import { useServices } from "@/hooks/use-services";
import { useTestimonials } from "@/hooks/use-testimonials";
import { updateSEO } from "@/lib/seo";

export default function Home() {
  useEffect(() => {
    updateSEO(
      "Les Portes du Temps - Coaching Relationnel & Numérologie Stratégique par Philippe Niard",
      "Coaching familial et conjugal basé sur les neurosciences, la PNL et la Numérologie. Comprenez vos blocages et améliorez votre communication (CNV). Une approche psychologique et concrète, loin de la voyance."
    );
  }, []);
  const { data: services, isLoading: isLoadingServices } = useServices();
  const { data: testimonials } = useTestimonials();
  
  const featuredServices = services?.slice(0, 3) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&q=80')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary mb-8 backdrop-blur-sm">
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">Coaching Relationnel & Numérologie Stratégique</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              Retrouvez l'harmonie dans votre foyer grâce au <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-200 to-primary">profilage numérologique</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Je suis Philippe Niard, coach professionnel spécialisé en relations conjugales et familiales. J'utilise la numérologie, la PNL et les neurosciences comme outils de profilage psychologique pour identifier vos blocages inconscients et améliorer concrètement votre communication.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/services">
                <button data-testid="button-explore-services" className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transform hover:-translate-y-1">
                  Découvrir mes services
                </button>
              </Link>
              <Link href="/about">
                <button data-testid="button-learn-more" className="px-8 py-4 bg-transparent border border-white/20 text-foreground font-medium rounded-full hover:bg-white/5 transition-all flex items-center gap-2">
                  En savoir plus <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-primary to-transparent mx-auto mb-2" />
          <span className="text-xs uppercase tracking-widest opacity-60">Défiler</span>
        </motion.div>
      </section>
      
      {/* Monthly & Daily Energy */}
      <MonthlyEnergy />

      {/* Intro / Calculator Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                Identifiez vos <span className="text-primary">blocages relationnels</span> grâce aux nombres
              </h2>
              <div className="w-20 h-1 bg-primary mb-8" />
              
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  La numérologie humaniste n'est pas de la voyance : c'est un outil de profilage psychologique concret. En analysant votre date de naissance, nous identifions vos schémas de fonctionnement, vos besoins profonds et les mécanismes inconscients qui influencent vos relations.
                </p>
                <p>
                  Combinée aux techniques de PNL et de Communication Non Violente (CNV), cette approche vous donne des clés concrètes pour désamorcer les conflits, comprendre les réactions de votre partenaire et construire une communication plus fluide au sein de votre couple et de votre famille.
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/5">
                  <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
                  <span className="text-sm font-medium">Coaching Couple</span>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/5">
                  <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                  <span className="text-sm font-medium">Coaching Familial</span>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/5">
                  <Brain className="w-8 h-8 text-primary mx-auto mb-3" />
                  <span className="text-sm font-medium">PNL & Neurosciences</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <LifePathCalculator />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured Services */}
      <section className="py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary text-sm uppercase tracking-widest font-semibold">Mes Prestations</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-6">Un accompagnement concret et structuré</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chaque séance est un espace d'écoute professionnelle. J'utilise la numérologie, le tarot psychologique et la PNL comme outils de diagnostic pour vous aider à identifier vos blocages et mettre en place des stratégies concrètes d'amélioration.
            </p>
          </div>
          
          {isLoadingServices ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/services">
              <button data-testid="button-view-all-services" className="px-8 py-3 rounded-full border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium">
                Voir tous les services
              </button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Tarot Drawing Section */}
      <section className="py-24 relative overflow-hidden" id="tarot">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/10 rounded-[100%] blur-3xl -z-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <TarotDrawing />
        </div>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Témoignages</h2>
              <div className="w-20 h-1 bg-primary mx-auto" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-6xl font-bold mb-8">Prêt(e) à débloquer votre situation ?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Grâce au profilage numérologique et aux techniques de coaching, identifions ensemble les mécanismes qui freinent vos relations et mettons en place des solutions concrètes.
          </p>
          <Link href="/contact">
            <button data-testid="button-book-session-cta" className="px-10 py-5 bg-primary text-primary-foreground text-lg font-bold rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-105">
              Réserver votre séance
            </button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
