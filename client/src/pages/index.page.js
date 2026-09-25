import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/site-shell.component";
import { Invite, useScrollReveal } from "@/components/shared.component";

export default function HomePage() {
  const heroCopyReveal = useScrollReveal({ delay: 40, threshold: 0.05 });
  const heroMediaReveal = useScrollReveal({ delay: 160, threshold: 0.05 });
  const storyImageReveal = useScrollReveal({ threshold: 0.2 });
  const storyCopyReveal = useScrollReveal({ delay: 120, threshold: 0.2 });
  const momentsHeadingReveal = useScrollReveal({ threshold: 0.2 });
  return (
    <>
      <Head><title>Salon de thé & brunch à Montauban · Le Jardin de Pauline</title><meta name="description" content="Le Jardin de Pauline, salon de thé, déjeuner, brunch et goûter au cœur de Montauban." /></Head>
      <SiteShell>
        <section className="hero container">
          <div ref={heroCopyReveal.ref} style={heroCopyReveal.style} className={`hero-copy ${heroCopyReveal.className}`}><p className="eyebrow">Le Jardin de Pauline · Montauban</p><h1><span className="hero-line">Un jardin secret.</span><span className="hero-line">Une pause</span><em>gourmande.</em></h1><p>Au détour d’un passage, une cour fleurie, des douceurs maison et le plaisir de prendre le temps.</p><div className="hero-actions"><Link className="btn" href="/reservation">Réserver une table <span>↗</span></Link><Link className="text-link" href="/carte-menus">Découvrir la carte</Link></div></div>
          <div ref={heroMediaReveal.ref} style={heroMediaReveal.style} className={`hero-media ${heroMediaReveal.className}`}><Image src="/img/cour.jpg" alt="La terrasse fleurie du Jardin de Pauline, ses chaises vertes et les arches du Passage du Vieux Palais" fill priority sizes="(max-width: 800px) 100vw, 50vw" /><div className="roundel"><span>UNE PAUSE</span><strong>au jardin</strong><span>MONTAUBAN</span></div></div>
        </section>
        <div className="quick-strip container"><span><b>✦</b> Cuisine & pâtisseries maison</span><span><b>✦</b> Brunch le samedi</span><span><b>✦</b> Une terrasse à l’abri de l’agitation</span></div>
        <section className="story section container"><div ref={storyImageReveal.ref} style={storyImageReveal.style} className={`story-image ${storyImageReveal.className}`}><Image src="/img/brunch.jpg" alt="Le brunch du Jardin de Pauline, toasts, viennoiseries et thé dans une vaisselle fleurie" fill quality={95} sizes="(max-width: 800px) 100vw, 45vw" /></div><div ref={storyCopyReveal.ref} style={storyCopyReveal.style} className={`story-copy ${storyCopyReveal.className}`}><p className="eyebrow">Une adresse un peu cachée</p><h2><span className="story-heading-line">Comme à la maison.</span><em className="story-heading-line">Le jardin en plus.</em></h2><p>Entrez dans le Passage du Vieux Palais. Derrière les arches de briques, Pauline vous accueille dans un salon de thé à l’esprit délicat et convivial.</p><p>Une assiette salée, une pâtisserie maison, un thé servi dans une jolie tasse… Ici, la gourmandise accompagne chaque moment de la journée.</p><Link className="text-link" href="/contact">Trouver le jardin <span>↗</span></Link></div></section>
        <section className="moments section"><div className="container"><div ref={momentsHeadingReveal.ref} style={momentsHeadingReveal.style} className={`section-heading ${momentsHeadingReveal.className}`}><div><p className="eyebrow">À chaque envie, son moment</p><h2 className="moments-heading-title"><span>Du premier thé</span><em>à la dernière bouchée.</em></h2></div><Link className="text-link" href="/carte-menus">La carte & les menus <span>↗</span></Link></div><div className="moments-grid"><Moment number="01" label="LE DÉJEUNER" title="Frais, simple, gourmand." image="/img/brunch.jpg" href="/carte-menus#dejeuner" link="À table" delay={80}>Trois assiettes salées imaginées chaque semaine. Toasts, salades, buns ou croques : les envies changent, le plaisir reste.</Moment><Moment number="02" label="LE BRUNCH DU SAMEDI" title="Le goût du week-end." image="/img/cour.jpg" href="/carte-menus#menus" link="Le rendez-vous du samedi" delay={180}>Après le marché, on s’installe. Du salé, du sucré et le bonheur de prolonger la matinée autour d’un brunch gourmand.</Moment><Moment number="03" label="L’HEURE DU GOÛTER" title="Encore un peu de douceur." image="/img/brunch.jpg" href="/boissons" link="Choisir sa tasse" delay={280}>Pâtisseries maison, matcha, chai ou café latte. Une petite pause qui donne envie de rester un peu plus longtemps.</Moment></div></div></section>
        <Invite />
      </SiteShell>
    </>
  );
}

function Moment({ number, label, title, image, href, link, children, delay = 0 }) {
  const reveal = useScrollReveal({ delay, threshold: 0.18 });
  return <article ref={reveal.ref} style={reveal.style} className={`moment ${reveal.className}`}><p className="number">{number} / {label}</p><div className="moment-image"><Image src={image} alt="Une table gourmande au Jardin de Pauline" fill sizes="(max-width: 800px) 100vw, 33vw" /></div><h3>{title}</h3><p>{children}</p><Link className="text-link" href={href}>{link} <span>↗</span></Link></article>;
}
