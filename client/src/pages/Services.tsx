import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { useServices } from "@/hooks/use-services";
import { Sparkles, Loader2 } from "lucide-react";
import { updateSEO } from "@/lib/seo";

const categoryLabels: Record<string, string> = {
  all: "Tous",
  numerology: "Numérologie",
  cartomancy: "Cartomancie",
  coaching: "Coaching",
};

export default function Services() {
  useEffect(() => {
    updateSEO(
      "Prestations — Coaching Relationnel, Numérologie & Tarologie Psychologique | Les Portes du Temps",
      "Découvrez nos prestations de coaching conjugal et familial : profilage numérologique, tarologie psychologique, PNL et gestion de conflits. Tarifs et détails avec Philippe Niard."
    );
  }, []);

  const { data: services, isLoading } = useServices();
  const [filter, setFilter] = useState<string>("all");
  
  const categories = ["all", "numerology", "cartomancy", "coaching"];
  
  const filteredServices = services?.filter(s => 
    filter === "all" || s.category.toLowerCase() === filter.toLowerCase()
  ) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <div className="pt-32 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-[100%] blur-3xl -z-10" />
        
        <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Mes Prestations</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Coaching conjugal et familial, thèmes numérologiques et tirage de tarot en option. Chaque accompagnement s'appuie sur la numérologie humaniste et ses fondements psychologiques.
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 w-full">
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              data-testid={`button-filter-${cat}`}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                filter === cat 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-transparent text-muted-foreground border-white/10 hover:border-primary/50 hover:text-primary"
              }`}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">Aucun service trouvé dans cette catégorie pour le moment.</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
