import Link from "next/link";
import SiteShell from "@/components/site-shell.component";

export default function NotFoundPage() {
  return <SiteShell><section className="not-found container"><p className="eyebrow">Le chemin s’arrête ici</p><h1>Cette page<br /><em>n’est pas au jardin.</em></h1><Link className="btn" href="/">Retour à l’accueil</Link></section></SiteShell>;
}
