import Link from "next/link";
import SiteShell from "@/components/site-shell.component";
import SeoHead from "@/components/seo-head.component";

export default function NotFoundPage() {
  return <><SeoHead title="Page introuvable · Le Jardin de Pauline" description="La page demandée est introuvable." path="/404" noIndex /><SiteShell><section className="not-found container"><p className="eyebrow">Le chemin s’arrête ici</p><h1>Cette page<br /><em>n’est pas au jardin.</em></h1><Link className="btn" href="/">Retour à l’accueil</Link></section></SiteShell></>;
}
