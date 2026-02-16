import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { fr } from "date-fns/locale";
import { format, addDays, startOfDay } from "date-fns";
import { CalendarDays, Clock, User, Loader2, CheckCircle, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useServices } from "@/hooks/use-services";
import { updateSEO } from "@/lib/seo";

type TimeSlot = { startTime: string; endTime: string };

export default function Booking() {
  useEffect(() => {
    updateSEO(
      "Réservation — Coaching Relationnel & Profilage Numérologique | Les Portes du Temps",
      "Réservez votre séance de coaching conjugal, familial ou profilage numérologique avec Philippe Niard. Choisissez votre créneau pour un accompagnement professionnel et concret."
    );
  }, []);
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const serviceIdParam = params.get("serviceId");

  const { data: allServices, isLoading: servicesLoading } = useServices();
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    serviceIdParam ? Number(serviceIdParam) : null
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [bookingComplete, setBookingComplete] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");

  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;

  const { data: availabilityData, isLoading: slotsLoading } = useQuery<{
    slots: TimeSlot[];
    service: { id: number; title: string; price: string; duration: string };
  }>({
    queryKey: ["/api/availability", dateStr, selectedServiceId],
    queryFn: async () => {
      const res = await fetch(`/api/availability?date=${dateStr}&serviceId=${selectedServiceId}`);
      if (!res.ok) throw new Error("Erreur lors du chargement des créneaux");
      return res.json();
    },
    enabled: !!dateStr && !!selectedServiceId,
  });

  const bookingMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/bookings", {
        serviceId: selectedServiceId,
        clientName,
        clientEmail,
        bookingDate: dateStr,
        startTime: selectedSlot!.startTime,
        endTime: selectedSlot!.endTime,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setPaymentLink(data.stripePaymentLink);
      setBookingComplete(true);
    },
  });

  const selectedService = allServices?.find(s => s.id === selectedServiceId);
  const today = startOfDay(new Date());
  const isDateDisabled = (date: Date) => {
    const day = date.getDay();
    return date < addDays(today, 1) || day === 0 || day === 6;
  };

  const canSubmit = selectedServiceId && selectedDate && selectedSlot && clientName.trim() && clientEmail.trim() && clientEmail.includes("@");

  if (bookingComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full text-center"
          >
            <Card className="p-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h2 className="font-serif text-2xl font-bold mb-4">Réservation confirmée</h2>
              <p className="text-muted-foreground mb-2">
                {selectedService?.title}
              </p>
              <p className="text-muted-foreground mb-2">
                {selectedDate && format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
              </p>
              <p className="text-muted-foreground mb-6">
                {selectedSlot?.startTime} - {selectedSlot?.endTime}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Finalisez votre réservation en effectuant le paiement ci-dessous.
              </p>
              <a
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-payment-redirect"
              >
                <Button className="w-full" size="lg">
                  Payer {selectedService?.price}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </Card>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className="pt-32 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-[100%] blur-3xl -z-10" />
        <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6" data-testid="text-booking-title">
          Prendre rendez-vous
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Choisissez votre prestation, sélectionnez une date et un créneau horaire, puis finalisez votre réservation.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">1</span>
                Choisissez une prestation
              </h2>
              {servicesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-2">
                  {allServices?.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => {
                        setSelectedServiceId(service.id);
                        setSelectedSlot(null);
                      }}
                      data-testid={`button-select-service-${service.id}`}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                        selectedServiceId === service.id
                          ? "border-primary bg-primary/10"
                          : "border-white/10 hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          <p className="font-medium text-foreground">{service.title}</p>
                          <p className="text-sm text-muted-foreground">{service.duration}</p>
                        </div>
                        <span className="text-primary font-serif font-bold">{service.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">2</span>
                <CalendarDays className="w-5 h-5" />
                Choisissez une date
              </h2>
              <Card className="p-4 flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedSlot(null);
                  }}
                  disabled={isDateDisabled}
                  locale={fr}
                  className="rounded-md"
                  data-testid="calendar-picker"
                />
              </Card>
            </motion.div>
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">3</span>
                <Clock className="w-5 h-5" />
                Choisissez un créneau
              </h2>

              {!selectedServiceId || !selectedDate ? (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground text-sm">
                    Sélectionnez d'abord une prestation et une date pour voir les créneaux disponibles.
                  </p>
                </Card>
              ) : slotsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : availabilityData?.slots && availabilityData.slots.length > 0 ? (
                <div className="grid grid-cols-2 gap-2" data-testid="slots-container">
                  {availabilityData.slots.map((slot) => (
                    <button
                      key={slot.startTime}
                      onClick={() => setSelectedSlot(slot)}
                      data-testid={`button-slot-${slot.startTime}`}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                        selectedSlot?.startTime === slot.startTime
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-white/10 text-foreground hover:border-primary/30"
                      }`}
                    >
                      {slot.startTime} - {slot.endTime}
                    </button>
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground text-sm">
                    Aucun créneau disponible pour cette date. Essayez une autre date.
                  </p>
                </Card>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">4</span>
                <User className="w-5 h-5" />
                Vos informations
              </h2>
              <Card className="p-6 space-y-4">
                <div>
                  <Label htmlFor="clientName">Nom complet</Label>
                  <Input
                    id="clientName"
                    placeholder="Votre nom"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    data-testid="input-client-name"
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="votre@email.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    data-testid="input-client-email"
                  />
                </div>
              </Card>
            </motion.div>

            {selectedService && selectedDate && selectedSlot && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 border-primary/30 bg-primary/5">
                  <h3 className="font-serif text-lg font-semibold mb-3">Récapitulatif</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4 flex-wrap">
                      <span className="text-muted-foreground">Prestation</span>
                      <span className="text-foreground font-medium">{selectedService.title}</span>
                    </div>
                    <div className="flex justify-between gap-4 flex-wrap">
                      <span className="text-muted-foreground">Date</span>
                      <span className="text-foreground font-medium">
                        {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 flex-wrap">
                      <span className="text-muted-foreground">Horaire</span>
                      <span className="text-foreground font-medium">
                        {selectedSlot.startTime} - {selectedSlot.endTime}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 flex-wrap border-t border-white/10 pt-2 mt-2">
                      <span className="text-muted-foreground">Tarif</span>
                      <span className="text-primary font-serif font-bold text-lg">{selectedService.price}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            <Button
              onClick={() => bookingMutation.mutate()}
              disabled={!canSubmit || bookingMutation.isPending}
              className="w-full"
              size="lg"
              data-testid="button-confirm-booking"
            >
              {bookingMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Réservation en cours...
                </>
              ) : (
                <>
                  Confirmer et payer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            {bookingMutation.isError && (
              <p className="text-red-400 text-sm text-center" data-testid="text-booking-error">
                {(bookingMutation.error as any)?.message || "Une erreur est survenue. Veuillez réessayer."}
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
