import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import { Instagram as InstagramIcon, Menu, X } from "lucide-react";
import { GlobalContext } from "@/contexts/global.context";
import { getAddress, getHours, getSocialUrl, groupHours } from "@/utils/restaurant";

const links = [
  ["Accueil", "/"],
  ["Carte & menus", "/carte-menus"],
  ["Boissons", "/boissons"],
  ["Contact", "/contact"],
];

function Brand({ logo = false }) {
  if (logo) return <Image className="brand-logo" src="/logo-transaprent.png" alt="Le Jardin de Pauline" width={1536} height={1024} priority />;
  return (
    <span className="brand">
      <small>Le Jardin de</small>
      <strong>Pauline</strong>
      <span>SALON DE THÉ · MONTAUBAN</span>
    </span>
  );
}

export function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { restaurantContext } = useContext(GlobalContext);
  const address = getAddress(restaurantContext?.restaurantData);

  useEffect(() => setOpen(false), [router.asPath]);
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <>
      <a className="skip" href="#contenu">Aller au contenu</a>
      <div className="topbar">DÉJEUNER · BRUNCH · GOÛTER</div>
      <header className="header container">
        <Link href="/" aria-label="Le Jardin de Pauline, accueil"><Brand logo /></Link>
        <nav className="desktop-nav" aria-label="Navigation principale">
          {links.map(([label, href]) => (
            <Link key={href} href={href} aria-current={router.pathname === href ? "page" : undefined}>{label}</Link>
          ))}
          <Link className="btn" href="/reservation">Réserver une table</Link>
        </nav>
        <button className={`menu-toggle ${open ? "is-open" : ""}`} type="button" aria-label="Ouvrir le menu" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}>
          <Menu size={23} strokeWidth={1.4} />
        </button>
      </header>
      <button className={`mobile-overlay ${open ? "is-open" : ""}`} aria-label="Fermer le menu" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} />
      <aside id="mobile-navigation" className={`mobile-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="mobile-drawer__top"><Brand logo /><button type="button" aria-label="Fermer le menu" onClick={() => setOpen(false)}><X /></button></div>
        <nav aria-label="Navigation mobile">
          {links.map(([label, href], index) => <Link key={href} href={href} tabIndex={open ? 0 : -1}><small>0{index + 1}</small><span>{label}</span></Link>)}
        </nav>
        <Link className="btn" href="/reservation" tabIndex={open ? 0 : -1}>Réserver une table <span>↗</span></Link>
        <p>{address.length ? address.map((line) => <span key={line}>{line}<br /></span>) : <>Passage du Vieux Palais<br />Montauban</>}</p>
      </aside>
    </>
  );
}

export function Footer() {
  const { restaurantContext } = useContext(GlobalContext);
  const restaurant = restaurantContext?.restaurantData;
  const address = getAddress(restaurant);
  const hours = useMemo(() => groupHours(getHours(restaurant)), [restaurant]);
  const instagram = getSocialUrl(restaurant, "instagram");

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div><Link href="/"><Brand /></Link><p>Une pause gourmande,<br />au cœur de Montauban.</p>{instagram ? <a className="instagram-link" href={instagram} target="_blank" rel="noreferrer"><InstagramIcon size={17} strokeWidth={1.5} aria-hidden="true" /><span>Instagram</span></a> : null}</div>
        <div><h3>Poussez la porte</h3><address>{address.length ? address.map((line) => <span key={line}>{line}<br /></span>) : <span>Adresse momentanément indisponible</span>}</address>{restaurant?.phone ? <a href={`tel:${restaurant.phone.replace(/[^\d+]/g, "")}`}>{restaurant.phone}</a> : null}<Link href="/contact">Contact & itinéraire</Link></div>
        <div><h3>Les heures du jardin</h3>{restaurantContext?.dataLoading ? <p>Chargement des horaires…</p> : hours.map((group) => <p className="hours" key={`${group.labels.join("-")}-${group.value}`}><span>{group.labels.length > 1 ? `${group.labels[0]} — ${group.labels.at(-1)}` : group.labels[0]}</span><strong>{group.value.split(" · ").map((slot) => <span key={slot}>{slot}</span>)}</strong></p>)}</div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Le Jardin de Pauline · Montauban</span><span>Photographies © Le Jardin de Pauline · Montauban Tourisme</span></div>
    </footer>
  );
}

export default function SiteShell({ children }) {
  return <><Header /><main id="contenu">{children}</main><Footer /></>;
}
