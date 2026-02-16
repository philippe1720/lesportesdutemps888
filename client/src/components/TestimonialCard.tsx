import { Testimonial } from "@shared/schema";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

export default function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-card/40 backdrop-blur-sm border border-white/5 p-8 rounded-2xl relative"
    >
      <Quote className="absolute top-6 right-6 text-primary/20 w-12 h-12" />
      
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < testimonial.rating ? "text-primary fill-primary" : "text-muted"}`} 
          />
        ))}
      </div>
      
      <p className="text-muted-foreground leading-relaxed italic mb-6">
        "{testimonial.content}"
      </p>
      
      <div>
        <h4 className="font-serif text-lg font-semibold text-foreground">{testimonial.name}</h4>
        {testimonial.role && (
          <p className="text-xs text-primary/80 uppercase tracking-widest mt-1">{testimonial.role}</p>
        )}
      </div>
    </motion.div>
  );
}
