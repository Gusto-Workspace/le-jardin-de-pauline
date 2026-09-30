import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import SiteShell from "@/components/site-shell.component";
import { ApiState, Reveal, useScrollReveal } from "@/components/shared.component";
import { HomeBand } from "@/components/home-banners.component";
import { GlobalContext } from "@/contexts/global.context";
import { getDrinkSections, getWineSections } from "@/utils/restaurant";

export default function DrinksPage() {
  const { restaurantContext } = useContext(GlobalContext);
  const heroCopyReveal = useScrollReveal({ delay: 40, threshold: 0.05 });
  const heroVisualReveal = useScrollReveal({ delay: 160, threshold: 0.05 });
  const drinks = getDrinkSections(restaurantContext.restaurantData);
  const wines = getWineSections(restaurantContext.restaurantData);
  return <><Head><title>Les boissons · Le Jardin de Pauline</title><meta name="description" content="Thés, cafés, boissons fraîches et vins au Jardin de Pauline." /></Head><SiteShell>
    <section className="carte-hero boissons-hero">
      <div className="carte-hero__plate" aria-hidden="true">
        <Image src="/img/boissons/hero-verre.webp" alt="" fill sizes="(max-width: 800px) 54vw, 380px" />
      </div>
      <div className="carte-hero__inner home-hero__inner container">
        <div ref={heroCopyReveal.ref} style={heroCopyReveal.style} className={`carte-hero__copy home-hero__copy home-title-host ${heroCopyReveal.className}`}>
          <p className="eyebrow">Le salon de thé &amp; co</p>
          <h1><span className="home-title-line"><span className="home-title-line__inner">Boissons</span></span></h1>
          <p className="carte-hero__italic"><span className="home-title-line"><span className="home-title-line__inner" style={{ "--line-delay": "85ms" }}>Un instant de douceur,</span></span><em className="home-title-line"><span className="home-title-line__inner" style={{ "--line-delay": "170ms" }}>un moment à soi.</span></em></p>
          <p className="carte-hero__description home-hero__lead">Du thé fumant au jus de fruits bien frais, chaque pause a sa boisson. Il ne reste qu’à choisir la vôtre.</p>
          <div className="home-actions">
            <Link className="btn" href="/reservation">Réserver une table <span>↗</span></Link>
            <Link className="btn home-secondary-btn" href="/carte-menus">Découvrir la carte <span>→</span></Link>
          </div>
        </div>
        <div ref={heroVisualReveal.ref} style={heroVisualReveal.style} className={`carte-hero__visual home-hero__visual carte-hero__visual--animated boissons-hero__visual ${heroVisualReveal.className}`} role="img" aria-label="Collage de boissons fraîches et gourmandes">
          <div className="carte-hero__photo carte-hero__photo--bao" aria-hidden="true">
            <Image src="/img/boissons/hero-4191.webp" alt="" fill sizes="(max-width: 800px) 42vw, 240px" />
          </div>
          <div className="carte-hero__photo carte-hero__photo--pastries" aria-hidden="true">
            <Image src="/img/boissons/hero-5182.webp" alt="" fill priority sizes="(max-width: 800px) 48vw, 290px" />
          </div>
          <div className="carte-hero__photo carte-hero__photo--tart" aria-hidden="true">
            <Image src="/img/boissons/hero-3897.webp" alt="" fill sizes="(max-width: 800px) 42vw, 250px" />
          </div>
        </div>
      </div>
    </section>
    <HomeBand />
    <ApiState loading={restaurantContext.dataLoading} error={restaurantContext.dataError} empty={!drinks.length && !wines.length}>
      <div className="boissons-categories">
        {drinks.map((section, index) => <DrinkSection key={section.id} section={section} index={index} />)}
        {wines.length ? <WineSection sections={wines} delay={Math.min(drinks.length * 80, 240)} /> : null}
      </div>
    </ApiState>
    <Reveal as="section" className="invite boissons-invite" threshold={0.2}><p className="eyebrow">La pause n’est pas finie</p><h2>Une douceur <em>avec ça ?</em></h2><p>Les pâtisseries maison n’attendent que votre tasse de thé.</p><Link className="btn" href="/carte-menus">Découvrir <span>↗</span></Link></Reveal>
  </SiteShell></>;
}

function DrinkSection({ section, index = 0 }) {
  return <Reveal as="section" className={`carte-category boissons-category ${index % 2 ? "carte-category--warm" : ""}`} delay={Math.min(index * 70, 210)} threshold={0.08}>
    <div className="carte-category__inner container">
      <div className="carte-category__heading">
        <p className="eyebrow">La sélection du jardin</p>
        <h2>{section.name}</h2>
        {section.description ? <p className="carte-category__tagline">{section.description}</p> : null}
      </div>
      <DrinkItems section={section} />
    </div>
  </Reveal>;
}

function WineSection({ sections, delay }) {
  return <Reveal as="section" className="carte-category carte-category--warm boissons-category boissons-category--wines" delay={delay} threshold={0.08}>
    <div className="carte-category__inner container">
      <div className="carte-category__heading">
        <p className="eyebrow">À partager</p>
        <h2>Les vins du jardin</h2>
      </div>
      <div className="carte-dishes">
        {sections.map((section) => <div className="carte-dishes__sub boissons-wine-section" key={section.id}>
          <h3>{section.name}</h3>
          <DrinkItems section={section} wines />
        </div>)}
        <p className="alcohol">L’abus d’alcool est dangereux pour la santé. À consommer avec modération.</p>
      </div>
    </div>
  </Reveal>;
}

function DrinkItems({ section, wines = false }) {
  return <div className="carte-dishes boissons-dishes">
    {section.items.map((item) => <DrinkItem key={item.id} item={item} wines={wines} />)}
    {section.subCategories.map((sub) => <div className="carte-dishes__sub boissons-sub-category" key={sub.id}>
      <h3>{sub.name}</h3>
      {sub.description ? <p className="carte-category__tagline">{sub.description}</p> : null}
      {sub.items.map((item) => <DrinkItem key={item.id} item={item} wines={wines} />)}
    </div>)}
  </div>;
}

function DrinkItem({ item, wines }) {
  return <article className="carte-dish boissons-dish">
    <div>
      <h3>{item.name}{item.bio ? <small> BIO</small> : null}</h3>
      {item.description ? <p>{item.description}</p> : null}
    </div>
    {wines ? <div className="boissons-wine-prices">{item.prices.map((price) => <span key={price.label}><small>{price.label}</small><strong>{price.price}</strong></span>)}</div> : item.price ? <strong>{item.price}</strong> : null}
  </article>;
}
