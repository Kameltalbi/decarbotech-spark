import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building2, ArrowRight } from "lucide-react";
import logo from "@/assets/logo_decarbotech.png";

const SECTORS = [
  "Textile & Habillement", "Agroalimentaire", "Industrie manufacturière",
  "Bâtiment & Construction", "Commerce & Distribution", "Services & Conseil",
  "Tourisme & Hôtellerie", "Transport & Logistique", "Agriculture",
  "Santé & Pharmaceutique", "Technologie & Numérique", "Énergie",
  "Banque & Assurance", "Autre",
];

const SIZES = [
  { value: "micro", label: "Micro-entreprise", desc: "< 10 salariés" },
  { value: "pme", label: "PME", desc: "10 – 249 salariés" },
  { value: "eti", label: "ETI", desc: "250 – 4 999 salariés" },
  { value: "ge", label: "Grande entreprise", desc: "5 000+ salariés" },
];

export default function Onboarding() {
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // Create organization
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert({ name, sector, size })
        .select("id")
        .single();

      if (orgError) throw orgError;

      // Link profile to organization
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ organization_id: org.id, company: name })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      toast({ title: "Organisation créée !", description: "Bienvenue dans votre espace ESG." });
      navigate("/app");
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="DecarboTech" className="h-14" />
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl text-foreground">Configurez votre organisation</h1>
              <p className="text-xs text-muted-foreground">Ces informations permettent de personnaliser votre diagnostic ESG.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="orgName">Nom de l'entreprise *</Label>
              <Input
                id="orgName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ma société"
                required
              />
            </div>

            <div>
              <Label htmlFor="sector">Secteur d'activité *</Label>
              <select
                id="sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Sélectionnez un secteur</option>
                {SECTORS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Taille de l'entreprise *</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {SIZES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSize(s.value)}
                    className={`text-left px-4 py-3 rounded-lg border-2 transition-all ${
                      size === s.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <span className="text-sm font-semibold text-foreground">{s.label}</span>
                    <span className="block text-xs text-muted-foreground">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !name || !sector || !size}>
              {loading ? "Création..." : (
                <span className="inline-flex items-center gap-2">
                  Accéder à mon espace <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
