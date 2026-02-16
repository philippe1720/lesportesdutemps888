import { useState } from "react";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminExport() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/admin/export-emails");
      if (!response.ok) throw new Error("Erreur lors du téléchargement");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "clients-les-portes-du-temps-888.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 text-center" data-testid="card-admin-export">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
          <FileSpreadsheet className="w-8 h-8 text-primary" />
        </div>

        <h1 className="font-serif text-2xl font-bold mb-2" data-testid="text-admin-title">
          Export Clients
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Téléchargez la liste complète de tous les emails enregistrés (cartomancie, contact, réservations).
        </p>

        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          size="lg"
          className="w-full"
          data-testid="button-download-csv"
        >
          {isDownloading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Download className="w-5 h-5 mr-2" />
          )}
          Télécharger la liste Clients (CSV)
        </Button>

        <p className="text-xs text-muted-foreground mt-6">
          Le fichier CSV est compatible Excel, Google Sheets et tous les tableurs.
        </p>
      </Card>
    </div>
  );
}
