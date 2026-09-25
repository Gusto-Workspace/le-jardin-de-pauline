import Head from "next/head";
import SiteShell from "@/components/site-shell.component";

export default function ReservationFlowShell({ title, children }) {
  return <><Head><title>{title} · Le Jardin de Pauline</title><meta name="robots" content="noindex,nofollow" /></Head><SiteShell><main className="flow-page"><section className="flow-panel"><p className="eyebrow">Réservation</p><h1>{title}</h1><span className="garden-ornament" aria-hidden="true"><i />✦<i /></span>{children}</section></main></SiteShell></>;
}
