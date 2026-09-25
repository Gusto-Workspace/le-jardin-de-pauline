import Head from "next/head";
import BookingComponent from "@/components/booking.component";
import SiteShell from "@/components/site-shell.component";
import { useContext } from "react";
import { GlobalContext } from "@/contexts/global.context";
import { useScrollReveal } from "@/components/shared.component";

export default function ReservationPage() {
  const { restaurantContext } = useContext(GlobalContext);
  const introReveal = useScrollReveal({ threshold: 0.05 });
  return <><Head><title>Réserver une table · Le Jardin de Pauline</title><meta name="description" content="Réservez votre table au Jardin de Pauline." /></Head><SiteShell><main className="reservation-page-shell"><section ref={introReveal.ref} style={introReveal.style} className={`reservation-intro container ${introReveal.className}`}><div className="reservation-intro__ornament" aria-hidden="true">✦ <span>un moment rien qu’à vous</span> ✦</div><p className="eyebrow">Bienvenue au jardin</p><h1>Votre prochaine<br /><em>pause gourmande.</em></h1><p>Un déjeuner, le brunch du samedi ou une occasion de se retrouver ? Choisissez votre moment et réservez votre table.</p></section>{restaurantContext.dataError ? <div className="api-state api-state--error">La réservation en ligne est momentanément indisponible.</div> : <BookingComponent apiBaseUrl={process.env.NEXT_PUBLIC_API_URL} restaurant={restaurantContext.restaurantData} dataLoading={restaurantContext.dataLoading} />}</main></SiteShell></>;
}
