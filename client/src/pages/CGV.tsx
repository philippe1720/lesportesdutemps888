import { useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { updateSEO } from "@/lib/seo";

export default function CGV() {
  useEffect(() => {
    updateSEO(
      "Conditions Générales de Vente — Coaching & Numérologie | Les Portes du Temps",
      "Consultez les conditions générales de vente de Les Portes du Temps. Informations sur le coaching conjugal et familial, le profilage numérologique, les tarifs et la politique d'annulation."
    );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32"
      >
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8" data-testid="text-cgv-title">
          Conditions Générales de Vente
        </h1>
        <p className="text-muted-foreground text-sm mb-12">
          En vigueur au {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        <div className="space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Article 1 — Objet</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre Philippe Niard, 
              exerçant sous le nom commercial « Les Portes du Temps 888 », et toute personne physique souhaitant 
              bénéficier de ses prestations de coaching en relations conjugales et familiales, de numérologie humaniste 
              et de cartomancie (ci-après « le Client »).
            </p>
            <p className="mt-2">
              Toute réservation implique l'acceptation sans réserve des présentes CGV.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Article 2 — Prestations proposées</h2>
            <p>Les prestations proposées sont les suivantes :</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Coaching Conjugal — 120 euros (90 min)</li>
              <li>Coaching Familial Numérologique — 140 euros (2h)</li>
              <li>Thème Numérologique Complet — 120 euros (75 min)</li>
              <li>Numérologie Personnalisée — 50 euros (60 min)</li>
              <li>Consultation Cartomancie 60 min — 50 euros</li>
              <li>Consultation Cartomancie 30 min — 30 euros</li>
            </ul>
            <p className="mt-2">
              Les consultations se déroulent en visioconférence ou en présentiel, selon les disponibilités et la localisation du Client.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Article 3 — Tarifs et paiement</h2>
            <p>
              Les prix des prestations sont indiqués en euros TTC. Le paiement s'effectue en ligne via la plateforme 
              sécurisée Stripe au moment de la réservation. Le paiement intégral est dû avant la réalisation de la prestation.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Article 4 — Réservation et prise de rendez-vous</h2>
            <p>
              La réservation s'effectue en ligne via le site internet. Le Client choisit le service souhaité, 
              la date et le créneau horaire, puis procède au paiement. Une confirmation de réservation 
              est envoyée par email.
            </p>
            <p className="mt-2">
              La réservation n'est définitive qu'après réception du paiement intégral.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Article 5 — Annulation et report</h2>
            <p>
              Toute annulation doit être notifiée par email à loulouniard17@gmail.com.
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Annulation plus de 48h avant le rendez-vous : remboursement intégral.</li>
              <li>Annulation entre 24h et 48h avant le rendez-vous : remboursement de 50% du montant.</li>
              <li>Annulation moins de 24h avant le rendez-vous ou absence sans prévenir : aucun remboursement.</li>
            </ul>
            <p className="mt-2">
              Le praticien se réserve le droit de reporter un rendez-vous en cas de force majeure, 
              en proposant un nouveau créneau au Client.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Article 6 — Droit de rétractation</h2>
            <p>
              Conformément à l'article L.221-28 du Code de la consommation, le droit de rétractation 
              ne s'applique pas aux prestations de services pleinement exécutées avant la fin du délai 
              de rétractation et dont l'exécution a commencé avec l'accord du consommateur.
            </p>
            <p className="mt-2">
              Pour toute réservation dont la date est au-delà du délai de rétractation de 14 jours, 
              le Client peut exercer son droit de rétractation dans ce délai par email.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Article 7 — Responsabilité</h2>
            <p>
              Les prestations de coaching, de numérologie et de cartomancie ont une vocation 
              d'accompagnement personnel et de développement. Elles ne se substituent en aucun cas 
              à un suivi médical, psychologique ou juridique.
            </p>
            <p className="mt-2">
              Philippe Niard ne saurait être tenu responsable de l'usage que le Client fait des informations 
              et conseils délivrés lors des consultations.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Article 8 — Confidentialité</h2>
            <p>
              Le praticien s'engage à respecter la confidentialité de toutes les informations partagées 
              par le Client lors des séances. Aucune information personnelle ne sera divulguée à des tiers 
              sans le consentement préalable du Client, sauf obligation légale.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Article 9 — Protection des données personnelles</h2>
            <p>
              Les données personnelles collectées (nom, email, téléphone) sont utilisées exclusivement 
              pour la gestion des rendez-vous et la communication avec le Client. Elles ne sont ni cédées, 
              ni vendues à des tiers.
            </p>
            <p className="mt-2">
              Conformément au Règlement Général sur la Protection des Données (RGPD), le Client dispose 
              d'un droit d'accès, de rectification et de suppression de ses données personnelles. 
              Pour exercer ce droit, contactez : loulouniard17@gmail.com.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Article 10 — Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu du site (textes, images, graphismes, logo) est la propriété exclusive 
              de Philippe Niard / Les Portes du Temps 888 et est protégé par les lois relatives à la propriété 
              intellectuelle. Toute reproduction non autorisée est interdite.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Article 11 — Droit applicable et litiges</h2>
            <p>
              Les présentes CGV sont soumises au droit français. En cas de litige, les parties 
              s'engagent à rechercher une solution amiable avant tout recours contentieux. 
              À défaut, les tribunaux compétents seront ceux du lieu de domicile du praticien.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Article 12 — Contact</h2>
            <p>
              Pour toute question relative aux présentes CGV, vous pouvez contacter :
            </p>
            <div className="mt-2 space-y-1">
              <p>Philippe Niard — Les Portes du Temps 888</p>
              <p>Email : loulouniard17@gmail.com</p>
              <p>Téléphone : 06 59 74 70 88</p>
            </div>
          </section>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}
