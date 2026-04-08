import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useOrganization() {
  const { user } = useAuth();
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase
      .from("profiles")
      .select("organization_id")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        setOrganizationId(data?.organization_id ?? null);
        setLoading(false);
      });
  }, [user]);

  return { organizationId, loading };
}
