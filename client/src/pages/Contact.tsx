import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInquirySchema, type InsertInquiry } from "@shared/schema";
import { useCreateInquiry } from "@/hooks/use-inquiries";
import { Loader2, Mail, Send, MapPin, Phone } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { updateSEO } from "@/lib/seo";

export default function Contact() {
  useEffect(() => {
    updateSEO(
      "Contact — Coaching Relationnel & Numérologie Stratégique | Les Portes du Temps",
      "Contactez Philippe Niard pour un accompagnement en coaching conjugal, familial ou profilage numérologique. Approche professionnelle basée sur la PNL et les neurosciences."
    );
  }, []);

  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const preselectedService = searchParams.get("service") || "";
  
  const { mutate, isPending } = useCreateInquiry();
  const { toast } = useToast();
  
  const form = useForm<InsertInquiry>({
    resolver: zodResolver(insertInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      serviceInterest: preselectedService,
    },
  });

  function onSubmit(data: InsertInquiry) {
    mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <div className="pt-32 pb-12 text-center">
        <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Contactez-moi</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Vous souhaitez prendre rendez-vous ou en savoir plus sur mon accompagnement ? Envoyez-moi un message et je vous répondrai dans les meilleurs délais.
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-card/30 border border-white/5 rounded-2xl p-8 hover:border-primary/30 transition-colors">
              <h3 className="font-serif text-2xl font-bold mb-6">Me contacter directement</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground">Email</h5>
                    <p className="text-muted-foreground" data-testid="text-email">contact@lesportesdutemps888.fr</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground">Téléphone</h5>
                    <p className="text-muted-foreground" data-testid="text-phone">Sur rendez-vous</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground">Consultations</h5>
                    <p className="text-muted-foreground" data-testid="text-location">En ligne (visio) ou en présentiel</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-64 rounded-2xl overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80" 
                alt="Fond mystique" 
                className="w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <p className="text-white font-serif text-xl font-bold italic px-4 text-center">"Chaque nombre porte en lui une clé de compréhension."</p>
              </div>
            </div>
          </div>
          
          {/* Form */}
          <div className="bg-card border border-white/5 rounded-2xl p-8 md:p-10 shadow-xl">
            <h3 className="font-serif text-2xl font-bold mb-6">Envoyer un message</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input data-testid="input-name" placeholder="Votre nom complet" {...field} className="bg-background/50 border-white/10 focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input data-testid="input-email" type="email" placeholder="votre@email.com" {...field} className="bg-background/50 border-white/10 focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="serviceInterest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service souhaité (Optionnel)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger data-testid="select-service" className="bg-background/50 border-white/10 focus:border-primary">
                            <SelectValue placeholder="Choisir un service..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="coaching-conjugal">Coaching Conjugal</SelectItem>
                          <SelectItem value="coaching-familial">Coaching Familial</SelectItem>
                          <SelectItem value="numerologie">Thème Numérologique</SelectItem>
                          <SelectItem value="tarot">Tirage de Tarot</SelectItem>
                          <SelectItem value="other">Autre / Demande générale</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          data-testid="input-message"
                          placeholder="Décrivez votre situation ou votre demande..." 
                          className="min-h-[120px] bg-background/50 border-white/10 focus:border-primary"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <button
                  data-testid="button-submit"
                  type="submit"
                  disabled={isPending}
                  className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
