import { Link } from "wouter";
import { Clock, Instagram, Facebook, Mail, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <Clock className="w-5 h-5 text-primary" />
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-lg font-bold tracking-wider text-foreground">
                  Les Portes du Temps
                </span>
                <span className="text-primary text-xs font-bold tracking-[0.3em]">888</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Coaching en relations conjugales et familiales par la numérologie humaniste. Comprendre vos dynamiques relationnelles grâce à la puissance des nombres.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-foreground">Services</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/services" className="hover:text-primary transition-colors">Coaching Conjugal</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Coaching Familial</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Thème Numérologique</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Tirage de Tarot</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-foreground">Informations</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">À propos de Philippe</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Tarifs</Link></li>
              <li><Link href="/cgv" className="hover:text-primary transition-colors" data-testid="link-cgv">Conditions Générales de Vente</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-foreground">Me contacter</h4>
            <div className="flex flex-wrap gap-3 mb-6">
              <a href="https://www.youtube.com/@philippe8885" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all" data-testid="link-youtube">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all" data-testid="link-instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all" data-testid="link-facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="mailto:contact@lesportesdutemps888.fr" className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all" data-testid="link-email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 pb-8 text-center">
          <h4 className="font-serif text-lg font-semibold mb-3 text-foreground">Retrouvez-moi en vidéo</h4>
          <a
            href="https://www.youtube.com/@philippe8885"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            data-testid="link-youtube-footer"
          >
            <Youtube className="w-4 h-4" />
            Chaîne YouTube Officielle - Les Portes du Temps
          </a>
        </div>
        
        <div className="border-t border-white/5 pt-8 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Les Portes du Temps 888 - Philippe Niard. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
