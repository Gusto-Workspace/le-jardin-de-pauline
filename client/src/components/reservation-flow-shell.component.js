import { useRouter } from "next/router";
import SiteShell from "@/components/site-shell.component";
import SeoHead from "@/components/seo-head.component";

export default function ReservationFlowShell({ title, children }) {
  const router = useRouter();
  const path = router.asPath.split("?")[0].split("#")[0];
  return <><SeoHead title={`${title} · Le Jardin de Pauline`} description={`${title} pour votre réservation au Jardin de Pauline.`} path={path} noIndex /><SiteShell><main className="flow-page"><section className="flow-panel"><p className="eyebrow">Réservation</p><h1>{title}</h1><span className="garden-ornament" aria-hidden="true"><i />✦<i /></span>{children}</section></main></SiteShell></>;
}
