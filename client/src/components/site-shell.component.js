import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import { Instagram as InstagramIcon, Menu, X } from "lucide-react";
import { GlobalContext } from "@/contexts/global.context";
import { getAddress, getSocialUrl } from "@/utils/restaurant";
import { hasVisibleNews } from "@/utils/news";

const baseLinks = [
  ["Accueil", "/"],
  ["Carte & menus", "/carte-menus"],
  ["Boissons", "/boissons"],
  ["Contact", "/contact"],
];
let hasResolvedInitialNewsCheck = false;

function Brand({ logo = false }) {
  if (logo) return <Image className="brand-logo" src="/logo-transaprent.webp" alt="Le Jardin de Pauline" width={1536} height={1024} priority />;
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
  const [newsCheckResolved, setNewsCheckResolved] = useState(hasResolvedInitialNewsCheck);
  const { restaurantContext } = useContext(GlobalContext);
  const address = getAddress(restaurantContext?.restaurantData);
  const restaurant = restaurantContext?.restaurantData;
  const links = useMemo(() => {
    const items = [...baseLinks];
    if (newsCheckResolved && hasVisibleNews(restaurant)) items.splice(3, 0, ["Actualités", "/news"]);
    return items;
  }, [newsCheckResolved, restaurant]);

  useEffect(() => {
    if (newsCheckResolved) return undefined;
    if (restaurant || !restaurantContext?.dataLoading) {
      const frame = window.requestAnimationFrame(() => {
        hasResolvedInitialNewsCheck = true;
        setNewsCheckResolved(true);
      });
      return () => window.cancelAnimationFrame(frame);
    }
    const fallback = window.setTimeout(() => {
      hasResolvedInitialNewsCheck = true;
      setNewsCheckResolved(true);
    }, 500);
    return () => window.clearTimeout(fallback);
  }, [newsCheckResolved, restaurant, restaurantContext?.dataLoading]);

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
      <header className={`header container${newsCheckResolved ? "" : " header--news-pending"}`} aria-hidden={!newsCheckResolved}>
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
  const instagram = getSocialUrl(restaurant, "instagram");

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand"><Link href="/" aria-label="Le Jardin de Pauline, accueil"><Image className="footer-logo" src="/logo-couleur.webp" alt="Le Jardin de Pauline — Salon de thé & Co" width={1200} height={800} /></Link><p>Une pause gourmande,<br />au cœur de Montauban.</p></div>
        <div className="footer-contact"><h3>Poussez la porte</h3><address>{address.length ? address.map((line) => <span key={line}>{line}<br /></span>) : <span>Adresse momentanément indisponible</span>}</address>{restaurant?.phone ? <a href={`tel:${restaurant.phone.replace(/[^\d+]/g, "")}`}>{restaurant.phone}</a> : null}{instagram ? <a className="instagram-link" href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon size={19} strokeWidth={1.5} aria-hidden="true" /></a> : null}</div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Le Jardin de Pauline · Montauban</span>
        <div className="footer-bottom__credits">
          <span>Photographies © Le Jardin de Pauline · Montauban Tourisme</span>
          <a href="https://gusto-manager.com" target="_blank" rel="noreferrer">Créé et propulsé par Gusto Manager</a>
        </div>
      </div>
    </footer>
  );
}

export default function SiteShell({ children }) {
  return <><Header /><main id="contenu">{children}</main><Footer /></>;
}
