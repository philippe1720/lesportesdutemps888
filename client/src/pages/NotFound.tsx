import { Link } from "wouter";
import { AlertTriangle, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center max-w-md"
      >
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        
        <h1 className="font-serif text-6xl font-bold text-foreground mb-4">404</h1>
        <h2 className="font-serif text-2xl font-semibold text-primary mb-6">Page introuvable</h2>
        
        <p className="text-muted-foreground mb-8 leading-relaxed">
          La page que vous cherchez n'existe pas ou a ete deplacee. Revenons ensemble a l'accueil.
        </p>

        <Link href="/">
          <button data-testid="button-return-home" className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mx-auto">
            <Home className="w-4 h-4" />
            Retour a l'accueil
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
