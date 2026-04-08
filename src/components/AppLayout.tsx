import { useState, useEffect } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Leaf, Users, ShieldCheck, FileBarChart, Settings,
  Menu, X, ChevronDown, ChevronRight, LogOut, User, Sparkles, Scale,
} from "lucide-react";
import logo from "@/assets/logo_decarbotech.png";

const NAV_ITEMS = [
  { to: "/app",              label: "Dashboard",      icon: LayoutDashboard },
  { to: "/app/environnement", label: "Environnement", icon: Leaf },
  { to: "/app/social",        label: "Social",        icon: Users },
  { to: "/app/gouvernance",   label: "Gouvernance",   icon: ShieldCheck },
  { to: "/app/rapports",      label: "Rapports",      icon: FileBarChart },
  { to: "/app/conformite",    label: "Conformité",    icon: Scale },
  { to: "/app/plan-action",   label: "Plan d'Action (IA)", icon: Sparkles },
  { to: "/app/parametres",    label: "Paramètres",    icon: Settings },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orgChecked, setOrgChecked] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("organization_id")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (!data?.organization_id) {
          navigate("/onboarding", { replace: true });
        } else {
          setOrgChecked(true);
        }
      });
  }, [user, navigate]);

  const currentPage = NAV_ITEMS.find(
    (item) => item.to === pathname || (item.to !== "/app" && pathname.startsWith(item.to))
  ) ?? NAV_ITEMS[0];

  if (loading || (!orgChecked && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const initials = user.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="min-h-screen bg-background text-foreground font-body flex">

      {/* ── Sidebar (desktop: always visible, mobile: overlay) ── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 flex flex-col transition-transform duration-300
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="DecarboTech" className="h-10" />
          </Link>
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.to === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-4 border-t border-border space-y-2 shrink-0">
          <Link
            to="/rse"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
            Diagnostic ESG gratuit
          </Link>
          <button onClick={signOut} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-heading font-bold text-lg text-foreground leading-tight">
                {currentPage.label}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
