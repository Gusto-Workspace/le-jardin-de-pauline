import Image from "next/image";
import Link from "next/link";
import { Fragment, useContext } from "react";
import { Clock3, MapPin, Phone } from "lucide-react";
import SiteShell from "@/components/site-shell.component";
import { ApiState, Reveal, useScrollReveal } from "@/components/shared.component";
import { HomeBand, HomeDoor } from "@/components/home-banners.component";
import { GlobalContext } from "@/contexts/global.context";
import { formatPrice, getAddress, getDishSections, getHours, getMenus } from "@/utils/restaurant";
import SeoHead from "@/components/seo-head.component";

const featuredCategories = [
  {
    label: "Salades",
    matches: (name) => /salade/.test(name),
  },
  {
    label: "Burgers",
    matches: (name) => /burger/.test(name),
  },
  {
    label: "Brioches perdues",
    matches: (name) => /brioche/.test(name) && /perdue/.test(name),
  },
  {
    label: "Suggestions",
    matches: (name) => /suggestion/.test(name),
  },
];

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getMenuGroups(menu) {
  if (!menu) return [];
  return menu.type === "custom" ? (menu.customGroups || []) : (menu.combinations || []);
}

export default function MenusPage() {
  const { restaurantContext } = useContext(GlobalContext);
  const heroCopyReveal = useScrollReveal({ delay: 40, threshold: 0.05 });
  const heroVisualReveal = useScrollReveal({ delay: 160, threshold: 0.05 });
  const restaurant = restaurantContext?.restaurantData;
  const sections = getDishSections(restaurant);
  const menus = getMenus(restaurant);

  const matchedCategories = featuredCategories.map((definition) => ({
    ...definition,
    section: sections.find((section) => definition.matches(normalize(section.name))),
  }));
  const brunchMenu = menus.find((menu) => /brunch/.test(normalize(menu.name)));
  const miniBossMenu = menus.find((menu) => /mini\s*boss|menu enfant/.test(normalize(menu.name)));
  const brunchSection = sections.find((section) => /brunch/.test(normalize(section.name)));
  const miniBossSection = sections.find((section) => /mini\s*boss|menu enfant/.test(normalize(section.name)));
  const featuredIds = new Set([
    ...matchedCategories.map(({ section }) => section?.id),
    brunchSection?.id,
    miniBossSection?.id,
  ].filter(Boolean));
  const extraSections = sections.filter((section) => !featuredIds.has(section.id));
  const featuredMenus = new Set([brunchMenu, miniBossMenu].filter(Boolean));
  const otherMenus = menus.filter((menu) => !featuredMenus.has(menu));

  return (
    <>
      <SeoHead title="Carte & menus · Le Jardin de Pauline" description="Découvrez les assiettes, suggestions et formules du Jardin de Pauline à Montauban." path="/carte-menus" image="/img/carte-menus/hero-plate.webp" />
      <SiteShell>
        <div className="carte-page">
          <section className="carte-hero">
            <div className="carte-hero__plate" aria-hidden="true">
              <Image src="/img/carte-menus/hero-plate.webp" alt="" fill sizes="(max-width: 800px) 54vw, 380px" />
            </div>
            <div className="carte-hero__inner home-hero__inner container">
              <div ref={heroCopyReveal.ref} style={heroCopyReveal.style} className={`carte-hero__copy home-hero__copy home-title-host ${heroCopyReveal.className}`}>
                <p className="eyebrow">Notre carte</p>
                <h1><span className="home-title-line"><span className="home-title-line__inner">Carte &amp; Menus</span></span></h1>
                <p className="carte-hero__italic"><span className="home-title-line"><span className="home-title-line__inner" style={{ "--line-delay": "85ms" }}>Une cuisine généreuse</span></span><em className="home-title-line"><span className="home-title-line__inner" style={{ "--line-delay": "170ms" }}>au fil des saisons.</span></em></p>
                <p className="carte-hero__description home-hero__lead">Des assiettes gourmandes, créatives et de saison, à savourer sur place ou à emporter. Notre carte évolue au gré des produits frais et de nos inspirations.</p>
                <div className="home-actions">
                  <Link className="btn" href="/reservation">Réserver une table <span>↗</span></Link>
                  <Link className="btn home-secondary-btn" href="/carte-menus">Découvrir la carte <span>→</span></Link>
                </div>
              </div>
              <div ref={heroVisualReveal.ref} style={heroVisualReveal.style} className={`carte-hero__visual home-hero__visual carte-hero__visual--animated carte-hero__visual--carte ${heroVisualReveal.className}`} role="img" aria-label="Collage de pâtisseries et de douceurs maison">
                <div className="carte-hero__photo carte-hero__photo--bao" aria-hidden="true">
                  <Image src="/img/carte-menus/hero-bao.webp" alt="" fill sizes="(max-width: 800px) 42vw, 240px" />
                </div>
                <div className="carte-hero__photo carte-hero__photo--pastries" aria-hidden="true">
                  <Image src="/img/carte-menus/hero-pastries.webp" alt="" fill priority sizes="(max-width: 800px) 48vw, 290px" />
                </div>
                <div className="carte-hero__photo carte-hero__photo--tart" aria-hidden="true">
                  <Image src="/img/carte-menus/hero-tart.webp" alt="" fill sizes="(max-width: 800px) 42vw, 250px" />
                </div>
              </div>
            </div>
          </section>

          <HomeBand />

          <ApiState loading={restaurantContext.dataLoading} error={restaurantContext.dataError} empty={!sections.length && !menus.length}>
            <div className="carte-categories">
              {matchedCategories.map(({ section, ...category }, index) => section ? (
                <DishCategory key={section.id} section={section} category={category} index={index} />
              ) : null)}

              {(brunchMenu || brunchSection) ? <BrunchFeature menu={brunchMenu} section={brunchSection} /> : null}
              {(miniBossMenu || miniBossSection) ? <MiniBossFeature menu={miniBossMenu} section={miniBossSection} /> : null}

              {extraSections.map((section, index) => (
                <ExtraDishCategory key={section.id} section={section} index={index} />
              ))}

              {otherMenus.length ? <>
                <Reveal as="section" className="carte-quote-band" aria-label="L’esprit du Jardin de Pauline" threshold={0.08}>
                  <Image className="carte-quote-band__leaves" src="/img/home/craft-branch-b.webp" alt="" aria-hidden="true" width={1254} height={1254} sizes="(max-width: 800px) 220px, 370px" />
                  <div className="carte-quote-band__inner container">
                    <blockquote>
                      <span className="carte-quote-band__mark carte-quote-band__mark--open" aria-hidden="true">“</span>
                      <p>Ici,<br />on prend le temps<br />de bien manger.</p>
                      <span className="carte-quote-band__mark carte-quote-band__mark--close" aria-hidden="true">”</span>
                    </blockquote>
                  </div>
                </Reveal>
                <section className="carte-extra-menus container" aria-label="Autres formules">
                  <div className="carte-menus-heading">
                    <div className="carte-menus-heading__ornament" aria-hidden="true">
                      <span />
                      <Image src="/img/home/band-branch.webp" alt="" width={1254} height={1254} />
                      <span />
                    </div>
                    <h2>Nos menus</h2>
                    <p>Des formules de saison et des moments d’exception à partager tout au long de l’année.</p>
                  </div>
                  {otherMenus.map((menu, index) => <MenuOffer key={menu._id || index} menu={menu} index={index} />)}
                </section>
              </> : null}
            </div>
          </ApiState>

          <HomeDoor />
          <PracticalInfo restaurant={restaurant} />
        </div>
      </SiteShell>
    </>
  );
}

function DishCategory({ section, category, index }) {
  return (
    <Reveal as="section" className={`carte-category ${index % 2 ? "carte-category--warm" : ""}`} delay={Math.min(index * 70, 210)} threshold={0.08}>
      <div className="carte-category__inner container">
        <div className="carte-category__heading">
          <h2>{section.name || category.label}</h2>
          {section.description ? <p className="carte-category__tagline">{section.description}</p> : null}
        </div>
        <DishList section={section} />
      </div>
    </Reveal>
  );
}

function ExtraDishCategory({ section, index }) {
  return (
    <Reveal as="section" className={`carte-category ${index % 2 ? "carte-category--warm" : ""}`} delay={Math.min(index * 60, 180)} threshold={0.08}>
      <div className="carte-category__inner container">
        <div className="carte-category__heading">
          <h2>{section.name}</h2>
          {section.description ? <p className="carte-category__tagline">{section.description}</p> : null}
        </div>
        <DishList section={section} />
      </div>
    </Reveal>
  );
}

function DishList({ section, showAlternatives = false }) {
  return (
    <div className="carte-dishes">
      {section.items.map((item, index) => <Fragment key={item.id}>
        <DishRow item={item} />
        {showAlternatives && index < section.items.length - 1 ? <span className="carte-dishes__or">ou</span> : null}
      </Fragment>)}
      {section.subCategories.map((sub) => <div className="carte-dishes__sub" key={sub.id}>
        <h3>{sub.name}</h3>
        {sub.items.map((item, index) => <Fragment key={item.id}>
          <DishRow item={item} />
          {showAlternatives && index < sub.items.length - 1 ? <span className="carte-dishes__or">ou</span> : null}
        </Fragment>)}
      </div>)}
    </div>
  );
}

function DishRow({ item }) {
  const { title, subtitle } = splitDishName(item.name);
  return (
    <article className="carte-dish">
      <div>
        <h3>{title}{item.bio ? <small> BIO</small> : null}</h3>
        {subtitle ? <p className="carte-dish__subtitle">{subtitle}</p> : null}
        {item.description ? <p>{item.description}</p> : null}
      </div>
      {item.price ? <strong>{item.price}</strong> : null}
    </article>
  );
}

function MenuGroups({ menu, section, numbered = false, showAlternatives = false }) {
  const groups = getMenuGroups(menu);
  if (groups.length) {
    return <div className={`carte-menu-groups ${numbered ? "carte-menu-groups--numbered" : ""}`}>
      {groups.map((group, index) => {
        const dishes = group.dishes || [];
        return <div className={`carte-menu-group ${dishes.length ? "" : "carte-menu-group--title-only"}`} key={group._id || index}>
          {numbered ? <span className="carte-menu-group__number" aria-hidden="true"><span>{index + 1}</span></span> : null}
          <div className="carte-menu-group__content">
            <div className="carte-menu-group__title">
              <h3>{group.categoryName || (group.categories || []).join(" + ") || `Étape ${index + 1}`}</h3>
              {formatPrice(group.price) ? <strong>{formatPrice(group.price)}</strong> : null}
            </div>
            {dishes.map((dish, dishIndex) => <Fragment key={dish?._id || dishIndex}>
              <MenuDish dish={dish} />
              {showAlternatives && dishIndex < dishes.length - 1 ? <span className="carte-menu-dish__or">ou</span> : null}
            </Fragment>)}
          </div>
        </div>;
      })}
    </div>;
  }
  return section ? <DishList section={section} /> : null;
}

function MenuDish({ dish }) {
  const name = typeof dish === "string" ? dish : (dish?.name || "");
  const description = typeof dish === "object" ? String(dish?.description || "").trim() : "";
  const { title, subtitle } = splitDishName(name);
  return <p className="carte-menu-dish">{title}{subtitle ? <small className="carte-menu-dish__subtitle">{subtitle}</small> : null}{description ? <small>{description}</small> : null}</p>;
}

function splitDishName(name) {
  const [title, ...subtitleParts] = String(name || "").split(":");
  return { title: title.trim(), subtitle: subtitleParts.join(":").trim() };
}

function BrunchFeature({ menu, section }) {
  return (
    <Reveal as="section" className="carte-brunch" threshold={0.08}>
      <div className="carte-brunch__inner">
        <div className="carte-brunch__intro">
          <p className="eyebrow">Notre formule signature</p>
          <h2>Brunch</h2>
          <p className="carte-brunch__tagline">Un moment gourmand<br />à partager sans modération.</p>
          {formatPrice(menu?.price) ? <strong className="carte-brunch__price">{formatPrice(menu.price)}</strong> : null}
        </div>
        <div className="carte-brunch__photo">
          <Image src="/img/home/brunch.webp" alt="Brunch gourmand servi au Jardin de Pauline" width={2400} height={3600} sizes="(max-width: 800px) 78vw, 34vw" />
        </div>
        <div className="carte-brunch__formula">
          <p className="carte-brunch__description">
            {String(menu?.description || "Il ne se prend pas au sérieux, mais il cartonne.")
              .split(/\r?\n/)
              .map((line) => line.trim())
              .filter(Boolean)
              .map((line, index) => <span className="carte-brunch__description-line" key={index}>{line}</span>)}
          </p>
          <MenuGroups menu={menu} section={section} numbered />
          {menu && getMenuGroups(menu).length && section ? <div className="carte-brunch__extra-dishes"><DishList section={section} /></div> : null}
        </div>
      </div>
    </Reveal>
  );
}

function MiniBossFeature({ menu, section }) {
  return (
    <Reveal as="section" className="carte-mini-boss" threshold={0.08}>
      <div className="carte-mini-boss__inner container">
        <div className="carte-mini-boss__photo">
          <Image src="/img/home/lunch.webp" alt="Assiette gourmande préparée au Jardin de Pauline" width={2400} height={3600} sizes="(max-width: 800px) 78vw, 26vw" />
        </div>
        <div className="carte-mini-boss__intro">
          <p className="eyebrow">Pour les petits gourmands</p>
          <h2>Mini Boss</h2>
          <p className="carte-mini-boss__tagline">Enfant de moins de 10 ans</p>
          {formatPrice(menu?.price) ? <strong className="carte-mini-boss__price">{formatPrice(menu.price)}</strong> : null}
          {section ? <DishList section={section} showAlternatives /> : null}
          {menu ? <MenuGroups menu={menu} showAlternatives /> : null}
        </div>
        <aside className="carte-mini-boss__aside">
          <p>Les grandes gourmandises commencent aussi dès le plus jeune âge&nbsp;!</p>
        </aside>
      </div>
    </Reveal>
  );
}

function MenuOffer({ menu, index }) {
  const hasDishGroups = getMenuGroups(menu).length > 0;
  const isLunchOptions = hasDishGroups && /formule du midi/.test(normalize(menu.name));
  const isBambino = /bambino/.test(normalize(menu.name));

  return (
    <article className={`carte-extra-menu ${hasDishGroups ? "carte-extra-menu--grouped" : ""} ${isLunchOptions ? "carte-extra-menu--lunch-options" : ""} ${isBambino ? "carte-extra-menu--bambino" : ""}`}>
      {isLunchOptions ? (
        <>
          <div className="carte-extra-menu__intro">
            <p className="eyebrow">Découvrez</p>
            <h2>{menu.name}</h2>
            <p>Une cuisine de saison, simple et raffinée, pour une pause gourmande en semaine.</p>
          </div>
          <MenuGroups menu={menu} numbered />
        </>
      ) : (
        <>
          <div className="carte-extra-menu__title"><h2>{menu.name || `Menu ${index + 1}`}</h2>{formatPrice(menu.price) ? <strong>{formatPrice(menu.price)}</strong> : null}</div>
          {menu.description ? <p>{menu.description}</p> : null}
          <MenuGroups menu={menu} />
        </>
      )}
    </article>
  );
}

function PracticalInfo({ restaurant }) {
  const hours = getHours(restaurant);
  const openDays = hours.filter(({ value }) => value !== "Fermé").map(({ label }) => label);
  const address = getAddress(restaurant);
  const phone = String(restaurant?.phone || "").trim();
  const phoneHref = phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : "/contact";

  return (
    <section className="carte-practical" aria-label="Informations pratiques">
      <div className="carte-practical__inner container">
        <div className="carte-practical__item">
          <Clock3 aria-hidden="true" />
          <div><strong>Ouvert {openDays.length ? `du ${openDays[0]} au ${openDays[openDays.length - 1]}` : "selon les horaires"}</strong><span>Sur place ou à emporter</span></div>
        </div>
        <div className="carte-practical__item">
          <Phone aria-hidden="true" />
          <div><strong>Nous appeler</strong><a href={phoneHref}>{phone || "Contact & itinéraire"}</a></div>
        </div>
        <div className="carte-practical__item">
          <MapPin aria-hidden="true" />
          <div><strong>{address[0] || "Le Jardin de Pauline"}</strong><span>{address[1] || "Montauban"}</span></div>
        </div>
      </div>
    </section>
  );
}
