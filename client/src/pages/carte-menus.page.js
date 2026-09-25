import Head from "next/head";
import Image from "next/image";
import { useContext } from "react";
import SiteShell from "@/components/site-shell.component";
import { ApiState, Invite, PageIntro, Reveal } from "@/components/shared.component";
import { GlobalContext } from "@/contexts/global.context";
import { formatPrice, getDishSections, getMenus } from "@/utils/restaurant";

export default function MenusPage() {
  const { restaurantContext } = useContext(GlobalContext);
  const restaurant = restaurantContext?.restaurantData;
  const sections = getDishSections(restaurant);
  const menus = getMenus(restaurant);

  return <><Head><title>Carte & menus · Le Jardin de Pauline</title><meta name="description" content="Découvrez les assiettes et menus du Jardin de Pauline." /></Head><SiteShell>
    <PageIntro eyebrow="La cuisine du jardin" title="De belles assiettes." italic="De petites douceurs.">Une cuisine maison qui suit les envies et les semaines. À partager à deux, en famille, ou simplement pour se faire plaisir.</PageIntro>
    <ApiState loading={restaurantContext.dataLoading} error={restaurantContext.dataError} empty={!sections.length && !menus.length}>
      <div className="menu-layout container"><aside className="menu-aside"><Image src="/img/brunch.jpg" alt="Une table de brunch au Jardin de Pauline" width={1360} height={910} /><p className="caption">À la table du Jardin de Pauline.</p></aside><div>
        <nav className="section-nav" aria-label="Catégories de la carte">{sections.map((section) => <a key={section.id} href={`#dish-${section.id}`}>{section.name}</a>)}{menus.length ? <a href="#menus">Menus</a> : null}</nav>
        {sections.map((section, index) => <DishSection key={section.id} section={section} index={index} />)}
        {menus.length ? <section className="menu-block" id="menus"><p className="eyebrow">Les formules du jardin</p><h2>Les menus</h2>{menus.map((menu, index) => <MenuOffer key={menu._id || index} menu={menu} index={index} />)}</section> : null}
        <div className="note"><p>Une allergie ou une préférence alimentaire ? Parlez-en à l’équipe avant de commander.</p></div>
      </div></div>
    </ApiState>
    <Invite />
  </SiteShell></>;
}

function DishSection({ section, index = 0 }) {
  return <Reveal as="section" className="menu-block" id={`dish-${section.id}`} delay={Math.min(index * 80, 240)} threshold={0.08}><p className="eyebrow">La sélection du moment</p><h2>{section.name}</h2>{section.description ? <p>{section.description}</p> : null}{section.items.map((item) => <MenuItem key={item.id} item={item} />)}{section.subCategories.map((sub) => <div className="sub-category" key={sub.id}><h3>{sub.name}</h3>{sub.items.map((item) => <MenuItem key={item.id} item={item} />)}</div>)}</Reveal>;
}

function MenuItem({ item }) { return <article className="menu-item"><div><h3>{item.name}{item.bio ? <small> BIO</small> : null}</h3>{item.description ? <p>{item.description}</p> : null}</div>{item.price ? <strong>{item.price}</strong> : null}</article>; }

function MenuDish({ dish }) {
  const description = String(dish?.description || "").trim();
  return <p>{dish.name || dish}{description ? <small style={{ display: "block", color: "var(--muted)" }}>{description}</small> : null}</p>;
}

function MenuOffer({ menu, index }) {
  const groups = menu.type === "custom" ? (menu.customGroups || []) : (menu.combinations || []);
  return <article className="menu-offer"><div className="menu-offer__title"><h3>{menu.name || `Menu ${index + 1}`}</h3>{formatPrice(menu.price) ? <strong>{formatPrice(menu.price)}</strong> : null}</div>{menu.description ? <p>{menu.description}</p> : null}{groups.map((group, groupIndex) => <div className="menu-offer__group" key={group._id || groupIndex}><div><b>{group.categoryName || (group.categories || []).join(" + ")}</b>{formatPrice(group.price) ? <strong>{formatPrice(group.price)}</strong> : null}</div>{(group.dishes || []).map((dish, dishIndex) => <MenuDish key={dish._id || dishIndex} dish={dish} />)}</div>)}</article>;
}
