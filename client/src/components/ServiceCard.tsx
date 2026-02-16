import { Link } from "wouter";
import { Service } from "@shared/schema";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

const categoryLabels: Record<string, string> = {
  numerology: "Numérologie",
  cartomancy: "Cartomancie",
  coaching: "Coaching",
};

interface ServiceCardProps {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className="group relative flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-colors duration-300"
      data-testid={`card-service-${service.id}`}
    >
      <div className="h-48 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60 z-10" />
        <img 
          src={service.imageUrl} 
          alt={service.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 z-20 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-primary border border-primary/20 uppercase tracking-wider">
          {categoryLabels[service.category] || service.category}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow relative z-20">
        <h3 className="font-serif text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
          {service.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/5 pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Durée</span>
            <span className="text-sm font-medium text-foreground">{service.duration}</span>
          </div>
          
          <div className="flex flex-col text-right">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Tarif</span>
            <span className="text-lg font-serif font-bold text-primary">{service.price}</span>
          </div>
        </div>
        
        <div className="mt-6">
          <Link href={`/booking?serviceId=${service.id}`}>
            <Button className="w-full" data-testid={`button-book-${service.id}`}>
              <CalendarDays className="w-4 h-4" />
              Prendre rendez-vous
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
