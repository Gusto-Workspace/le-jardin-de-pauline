import Image from "next/image";
import { Instagram as InstagramIcon } from "lucide-react";
import { useContext } from "react";
import SiteShell from "@/components/site-shell.component";
import { Reveal } from "@/components/shared.component";
import { HomeDoor } from "@/components/home-banners.component";
import ContactForm from "@/components/contact-form.component";
import { GlobalContext } from "@/contexts/global.context";
import { getAddress, getHours, getSocialUrl } from "@/utils/restaurant";
import SeoHead from "@/components/seo-head.component";

export default function ContactPage() {
  const { restaurantContext } = useContext(GlobalContext);
  const restaurant = restaurantContext.restaurantData;
  const address = getAddress(restaurant);
  const hours = getHours(restaurant);
  const instagram = getSocialUrl(restaurant, "instagram");
  const mapQuery = encodeURIComponent(address.join(" ") || "Le Jardin de Pauline Montauban");
  return <><SeoHead title="Contact & accès · Le Jardin de Pauline" description="Adresse, horaires et contact du Jardin de Pauline à Montauban." path="/contact" image="/img/home/hero.webp" /><SiteShell>
    <Reveal as="section" className="page-intro container contact-page-intro">
      <div className="reservation-intro__ornament" aria-hidden="true">✦ <span>un moment rien qu’à vous</span> ✦</div>
      <h1>Bien caché.<br /><em>Tout près de vous.</em></h1>
      <p>En plein cœur de Montauban, empruntez le Passage du Vieux Palais. Notre cour vous attend, à quelques pas de la rue de la République.</p>
    </Reveal>
    <div className="contact-layout container"><Reveal className="contact-info-column" threshold={0.1}><figure className="contact-photo-frame"><Image className="contact-photo" src="/img/home/hero.webp" alt="L’entrée du Jardin de Pauline au fond du Passage du Vieux Palais" width={2400} height={3600} /><figcaption className="caption">Passez sous les arches. Vous y êtes.</figcaption></figure><div className="contact-details">
      <section><h2>Nous trouver</h2>{restaurantContext.dataLoading ? <p>Chargement…</p> : address.length ? <><p>{address.map((line) => <span key={line}>{line}<br /></span>)}</p><a className="text-link" href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer">Ouvrir l’itinéraire <span>↗</span></a></> : <p>Adresse indisponible.</p>}</section>
      <section><h2>Nous contacter</h2>{restaurant?.phone ? <a href={`tel:${restaurant.phone.replace(/[^\d+]/g, "")}`}>{restaurant.phone}</a> : null}{restaurant?.email ? <a href={`mailto:${restaurant.email}`}>{restaurant.email}</a> : null}{instagram ? <a className="instagram-link text-link" href={instagram} target="_blank" rel="noreferrer"><InstagramIcon size={17} strokeWidth={1.5} aria-hidden="true" /><span>Instagram</span></a> : null}</section>
      <section className="full"><h2>Les heures du jardin</h2><div className="contact-hours">{restaurantContext.dataLoading ? <p>Chargement des horaires…</p> : hours.map((item) => <p className="hours" key={item.label}><span>{item.label}</span><strong>{item.value}</strong></p>)}</div><p>Pour les horaires exceptionnels, consultez nos actualités ou appelez-nous avant votre venue.</p></section>
    </div></Reveal><Reveal as="section" className="contact-form-card" delay={140} threshold={0.1}><p className="eyebrow">Une question, une envie</p><h2>Écrivez-nous.</h2><p className="contact-form-lead">Pour une réservation de groupe, une privatisation ou simplement nous dire bonjour, laissez-nous un message.</p><ContactForm /></Reveal></div>
    <HomeDoor className="home-door--contact" />
  </SiteShell></>;
}
