import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import SiteShell from "@/components/site-shell.component";
import { ApiState, PageIntro, Reveal } from "@/components/shared.component";
import { GlobalContext } from "@/contexts/global.context";
import { getDrinkSections, getWineSections } from "@/utils/restaurant";

export default function DrinksPage() {
  const { restaurantContext } = useContext(GlobalContext);
  const drinks = getDrinkSections(restaurantContext.restaurantData);
  const wines = getWineSections(restaurantContext.restaurantData);
  return <><Head><title>Les boissons · Le Jardin de Pauline</title><meta name="description" content="Thés, cafés, boissons fraîches et vins au Jardin de Pauline." /></Head><SiteShell>
    <PageIntro eyebrow="Le salon de thé & co" title="Une jolie tasse." italic="Un moment à soi.">Du thé fumant au jus de fruits bien frais, chaque pause a sa boisson. Il ne reste qu’à choisir la vôtre.</PageIntro>
    <ApiState loading={restaurantContext.dataLoading} error={restaurantContext.dataError} empty={!drinks.length && !wines.length}>
      <div className="menu-layout container drinks-layout"><aside className="menu-aside"><Image src="/img/brunch.jpg" alt="Thé et boissons servis dans les tasses fleuries du Jardin de Pauline" width={1360} height={910} /><p className="caption">De la vaisselle fleurie et le plaisir de prendre le temps.</p></aside><div>
        {drinks.map((section, index) => <DrinkSection key={section.id} section={section} index={index} />)}
        {wines.length ? <Reveal as="section" className="menu-block" delay={Math.min(drinks.length * 80, 240)} threshold={0.08}><p className="eyebrow">À partager</p><h2>Les vins du jardin</h2>{wines.map((section, index) => <DrinkSection key={section.id} section={section} wines index={index} />)}<p className="alcohol">L’abus d’alcool est dangereux pour la santé. À consommer avec modération.</p></Reveal> : null}
      </div></div>
    </ApiState>
    <Reveal as="section" className="invite" threshold={0.2}><p className="eyebrow">La pause n’est pas finie</p><h2>Une douceur <em>avec ça ?</em></h2><p>Les pâtisseries maison n’attendent que votre tasse de thé.</p><Link className="btn" href="/carte-menus">Découvrir le goûter <span>↗</span></Link></Reveal>
  </SiteShell></>;
}

function DrinkSection({ section, wines = false, index = 0 }) {
  return <Reveal as="section" className="menu-block" delay={Math.min(index * 80, 240)} threshold={0.08}><p className="eyebrow">La sélection du jardin</p><h2>{section.name}</h2>{section.items.map((item) => <DrinkItem key={item.id} item={item} wines={wines} />)}{section.subCategories.map((sub) => <div className="sub-category" key={sub.id}><h3>{sub.name}</h3>{sub.items.map((item) => <DrinkItem key={item.id} item={item} wines={wines} />)}</div>)}</Reveal>;
}

function DrinkItem({ item, wines }) { return <article className="menu-item"><div><h3>{item.name}{item.bio ? <small> BIO</small> : null}</h3>{item.description ? <p>{item.description}</p> : null}</div>{wines ? <div className="wine-prices">{item.prices.map((price) => <span key={price.label}><small>{price.label}</small><strong>{price.price}</strong></span>)}</div> : item.price ? <strong>{item.price}</strong> : null}</article>; }
