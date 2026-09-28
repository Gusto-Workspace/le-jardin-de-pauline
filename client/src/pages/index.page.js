import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SiteShell from "@/components/site-shell.component";
import { useScrollReveal } from "@/components/shared.component";

const revealProps = (reveal) => ({ ref: reveal.ref, style: reveal.style, className: reveal.className });

function TitleLine({ as: Element = "span", delay = 0, children }) {
  return <Element className="home-title-line" style={{ "--line-delay": `${delay}ms` }}><span className="home-title-line__inner">{children}</span></Element>;
}

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Salon de thé & brunch à Montauban · Le Jardin de Pauline</title>
        <meta name="description" content="Le Jardin de Pauline, salon de thé, déjeuner, brunch et goûter au cœur de Montauban." />
      </Head>
      <SiteShell>
        <div className="home-redesign">
          <HomeHero />
          <HomeBand />
          <HomeStory />
          <HomeMoments />
          <HomeCraft />
          <HomeDoor />
          <HomeDrinks />
          <HomeFinal />
        </div>
      </SiteShell>
    </>
  );
}

function HomeHero() {
  const copy = useScrollReveal({ delay: 40, threshold: 0.05 });
  const visual = useScrollReveal({ delay: 160, threshold: 0.05 });

  return (
    <section className="home-hero home-section">
      <div className="home-hero__inner container">
        <div {...revealProps(copy)} className={`home-hero__copy home-title-host ${copy.className}`}>
          <p className="eyebrow">Le Jardin de Pauline · Montauban</p>
          <h1><TitleLine>Un jardin secret.</TitleLine><TitleLine delay={85}>Une pause</TitleLine><TitleLine as="em" delay={170}>gourmande.</TitleLine></h1>
          <p className="home-hero__lead">Au détour d’un passage, une cour fleurie, des douceurs maison et le plaisir de prendre le temps.</p>
          <div className="home-actions">
            <Link className="btn" href="/reservation">Réserver une table <span>↗</span></Link>
            <Link className="btn home-secondary-btn" href="/carte-menus">Découvrir la carte <span>→</span></Link>
          </div>
        </div>
        <div {...revealProps(visual)} className={`home-hero__visual ${visual.className}`}>
          <div className="home-hero__main-image home-image-frame">
            <Image src="/img/home-hero.jpg" alt="L'entrée fleurie du Jardin de Pauline sous une arche de briques" fill priority sizes="(max-width: 800px) 100vw, 58vw" />
          </div>
          <div className="home-hero__detail home-image-frame">
            <Image src="/img/home-hero-detail.jpg" alt="Une assiette gourmande servie au Jardin de Pauline" fill sizes="(max-width: 800px) 48vw, 19vw" />
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeBand() {
  return (
    <div className="home-band" aria-label="Les rendez-vous du Jardin de Pauline">
      <Image className="home-band__branch" src="/img/home-band-branch.png" alt="" aria-hidden="true" width={1254} height={1254} sizes="58px" />
      <div className="home-band__track">
        <span>Pâtisseries maison</span><b>•</b><span>Déjeuner</span><b>•</b><span>Brunch du samedi</span><b>•</b><span>Salon de thé</span><b>•</b><span>Montauban</span>
      </div>
      <Image className="home-band__branch home-band__branch--right" src="/img/home-band-branch.png" alt="" aria-hidden="true" width={1254} height={1254} sizes="58px" />
    </div>
  );
}

function HomeStory() {
  const story = useStoryPlacement();
  const copy = useScrollReveal({ delay: 120, threshold: 0.16 });

  return (
    <section ref={story.ref} className={`home-story home-section container${story.placed ? " is-placed" : ""}`}>
      <div className="home-story__collage">
        <div className="home-story__main home-image-frame"><Image src="/img/home-story.jpg" alt="La cour fleurie et les tables du Jardin de Pauline" fill sizes="(max-width: 800px) 100vw, 47vw" /></div>
        <div className="home-story__interior home-image-frame"><Image src="/img/home-story-interior.jpg" alt="Le décor intérieur chaleureux du salon de thé" fill sizes="(max-width: 800px) 58vw, 23vw" /></div>
        <div className="home-story__tea home-image-frame"><Image src="/img/home-story-tea.jpg" alt="Théières fleuries et vaisselle délicate" fill sizes="(max-width: 800px) 52vw, 18vw" /></div>
      </div>
      <div {...revealProps(copy)} className={`home-story__copy home-title-host ${copy.className}`}>
        <p className="eyebrow">Une adresse un peu cachée</p>
        <h2><TitleLine>Comme à la maison.</TitleLine><TitleLine as="em" delay={95}>Le jardin en plus.</TitleLine></h2>
        <p>Entrez dans le Passage du Vieux Palais. Derrière les arches de briques, Pauline vous accueille dans un salon de thé à l’esprit délicat et convivial.</p>
        <p>Une assiette salée, une pâtisserie maison, un thé servi dans une jolie tasse… Ici, la gourmandise accompagne chaque moment de la journée.</p>
        <Link className="text-link" href="/contact">Trouver le jardin <span>→</span></Link>
      </div>
      <Image className="home-story__botanical" src="/img/home-botanical-branch.png" alt="" aria-hidden="true" width={1024} height={1536} sizes="(max-width: 800px) 60vw, 45vw" />
    </section>
  );
}

function useStoryPlacement() {
  const ref = useRef(null);
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaced(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= 0.16) setPlaced(true);
      else if (!entry.isIntersecting && entry.boundingClientRect.top >= (entry.rootBounds?.bottom ?? window.innerHeight)) setPlaced(false);
    }, { threshold: [0, 0.16] });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, placed };
}

function HomeMoments() {
  const heading = useScrollReveal({ threshold: 0.14 });
  const moments = useMomentsFanReveal();
  return (
    <section className="home-moments home-section">
      <Image className="home-moments__flower" src="/img/home-moments-flower.png" alt="" aria-hidden="true" width={1254} height={1254} />
      <div className="container">
        <div {...revealProps(heading)} className={`home-moments__heading home-title-host ${heading.className}`}>
          <p className="eyebrow">Nos temps gourmands</p>
          <h2><TitleLine>Du premier thé</TitleLine><TitleLine as="em" delay={90}>à la dernière bouchée.</TitleLine></h2>
          <p className="home-moments__intro">Trois façons de se régaler au jardin, au fil de la journée.</p>
        </div>
        <div ref={moments.ref} className={`home-moments__grid${moments.open ? " is-open" : ""}`}>
          <HomeMoment number="01" label="Déjeuner" title="Frais, simple, gourmand." image="/img/home-lunch.jpg" href="/carte-menus#dejeuner">Des produits frais, de saison, inspirés et faits maison, à savourer dans notre cour ou en salle.</HomeMoment>
          <HomeMoment number="02" label="Le brunch du samedi" title="Le goût du week-end." image="/img/home-brunch.jpg" href="/carte-menus#menus">Chaque samedi, un brunch généreux et gourmand pour bien commencer le week-end.</HomeMoment>
          <HomeMoment number="03" label="L’heure du goûter" title="Encore un peu de douceur." image="/img/home-tea.jpg" href="/boissons">Thés d’exception, boissons maison et pâtisseries artisanales pour une pause tout en douceur.</HomeMoment>
        </div>
      </div>
    </section>
  );
}

function useMomentsFanReveal() {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(true);
      return undefined;
    }

    let isOpen = false;
    let previousScrollY = window.scrollY;
    let scrollDirection = 1;
    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      scrollDirection = currentScrollY > previousScrollY ? 1 : currentScrollY < previousScrollY ? -1 : 0;
      previousScrollY = currentScrollY;
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!isOpen && scrollDirection > 0 && entry.intersectionRatio >= 0.9) {
          isOpen = true;
          setOpen(true);
        } else if (
          isOpen
          && scrollDirection < 0
          && entry.intersectionRatio <= 0.5
          && entry.boundingClientRect.bottom > (entry.rootBounds?.bottom ?? window.innerHeight)
        ) {
          isOpen = false;
          setOpen(false);
        }
      });
    }, { threshold: [0, 0.5, 0.9] });
    observer.observe(node);
    window.addEventListener("scroll", updateScrollDirection, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, []);

  return { ref, open };
}

function HomeMoment({ number, label, title, image, href, children }) {
  return (
    <article className="home-moment">
      <div className="home-moment__image home-image-frame"><Image src={image} alt={`${label} au Jardin de Pauline`} fill sizes="(max-width: 800px) 100vw, 31vw" /></div>
      <div className="home-moment__body">
        <p className="home-moment__number">{number} <span>/ {label}</span></p>
        <h3>{title}</h3>
        <p>{children}</p>
        <Link className="text-link" href={href}>Découvrir <span>→</span></Link>
      </div>
    </article>
  );
}

function HomeCraft() {
  const copy = useScrollReveal({ threshold: 0.14 });
  const collage = useScrollReveal({ delay: 130, threshold: 0.14 });
  const parallaxRef = useCraftParallax();
  const floralMotifs = [
    ["flower-open", "01"], ["branch-a", "02"], ["branch-b", "03"], ["flower-full", "04"],
    ["branch-a", "05"], ["flower-full", "06"], ["flower-open", "07"], ["branch-b", "08"],
    ["flower-open", "09"], ["branch-a", "10"], ["flower-full", "11"], ["branch-b", "12"],
    ["flower-open", "13"], ["branch-a", "14"],
  ];
  return (
    <section ref={parallaxRef} className="home-craft home-section">
      <div className="home-craft__floral-background" aria-hidden="true">
        {floralMotifs.map(([asset, index]) => <Image key={index} className={`home-craft__motif home-craft__motif--${index}`} src={`/img/home-craft-${asset}.png`} alt="" width={1254} height={1254} sizes="(max-width: 800px) 32vw, 22vw" />)}
      </div>
      <div className="container home-craft__inner">
        <div {...revealProps(copy)} className={`home-craft__copy home-title-host ${copy.className}`}>
          <p className="eyebrow">Notre savoir-faire</p>
          <h2><TitleLine>Fait ici.</TitleLine><TitleLine delay={90}>Mangé ici.</TitleLine></h2>
          <p className="home-craft__tagline">Pâtisser. Dresser. Partager.</p>
          <p>Des pâtisseries maison, des produits de qualité et beaucoup d’amour dans chaque assiette. Une cuisine sincère, gourmande et de saison, à déguster sur place ou à emporter.</p>
          <Link className="btn" href="/carte-menus">Découvrir la carte <span>↗</span></Link>
        </div>
        <div {...revealProps(collage)} className={`home-craft__collage ${collage.className}`}>
          <div className="home-craft__main home-image-frame"><Image src="/img/home-craft-main.jpg" alt="Dessert maison aux agrumes et romarin" fill sizes="(max-width: 800px) 78vw, 32vw" /></div>
          <div className="home-craft__detail home-image-frame"><Image src="/img/home-craft-detail.jpg" alt="Petites tartelettes au chocolat et fleurs séchées" fill sizes="(max-width: 800px) 48vw, 20vw" /></div>
          <div className="home-craft__drink home-image-frame"><Image src="/img/home-craft-drink.jpg" alt="Boisson rose maison avec fleurs fraîches" fill sizes="(max-width: 800px) 53vw, 21vw" /></div>
        </div>
      </div>
    </section>
  );
}

function useCraftParallax() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) return undefined;
    const motionDisabled = window.matchMedia("(max-width: 800px), (prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const progress = motionDisabled.matches ? 0 : Math.max(-1, Math.min(1,
        (window.innerHeight / 2 - rect.top - rect.height / 2) / ((window.innerHeight + rect.height) / 2)
      ));
      node.style.setProperty("--craft-parallax-main", `${(progress * 7.5).toFixed(2)}px`);
      node.style.setProperty("--craft-parallax-detail", `${(progress * 10).toFixed(2)}px`);
      node.style.setProperty("--craft-parallax-drink", `${(progress * 14).toFixed(2)}px`);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        schedule();
      } else {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
      }
    });
    observer.observe(node);
    motionDisabled.addEventListener("change", schedule);
    return () => {
      observer.disconnect();
      motionDisabled.removeEventListener("change", schedule);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}

function HomeDoor() {
  const reveal = useScrollReveal({ threshold: 0.12 });
  return (
    <section {...revealProps(reveal)} className={`home-door home-section home-title-host ${reveal.className}`}>
      <div className="home-door__image home-image-frame"><Image src="/img/home-door.jpg" alt="La cour ombragée du Jardin de Pauline" fill sizes="100vw" /></div>
      <div className="home-door__panel">
        <p className="eyebrow">Une cour pleine de charme</p>
        <h2><TitleLine>Poussez la porte.</TitleLine></h2>
        <p>Notre terrasse ombragée vous attend pour un moment hors du temps, en plein cœur de Montauban.</p>
        <Link className="btn" href="/reservation">Réserver une table <span>↗</span></Link>
      </div>
    </section>
  );
}

function HomeDrinks() {
  const copy = useScrollReveal({ threshold: 0.13 });
  const collage = useScrollReveal({ delay: 120, threshold: 0.13 });
  return (
    <section className="home-drinks home-section container">
      <div {...revealProps(copy)} className={`home-drinks__copy home-title-host ${copy.className}`}>
        <p className="eyebrow">Nos boissons</p>
        <h2><TitleLine>Une pause,</TitleLine><TitleLine as="em" delay={90}>à boire aussi.</TitleLine></h2>
        <p>Thés d’exception, créations maison, boissons fraîches et gourmandes… Il y en a pour tous les goûts et toutes les saisons.</p>
        <Link className="text-link" href="/boissons">Découvrir nos boissons <span>↗</span></Link>
      </div>
      <div {...revealProps(collage)} className={`home-drinks__collage ${collage.className}`}>
        <div className="home-drinks__pink home-image-frame"><Image src="/img/home-drink-pink.jpg" alt="Boisson rose fraîche avec tranche de citron" fill sizes="(max-width: 800px) 62vw, 25vw" /></div>
        <div className="home-drinks__clear home-image-frame"><Image src="/img/home-drink-clear.jpg" alt="Boisson pétillante aux agrumes" fill sizes="(max-width: 800px) 45vw, 18vw" /></div>
        <div className="home-drinks__latte home-image-frame"><Image src="/img/home-drink-latte.jpg" alt="Latte glacé servi au salon" fill sizes="(max-width: 800px) 48vw, 19vw" /></div>
        <div className="home-drinks__coffee home-image-frame"><Image src="/img/home-drink-coffee.jpg" alt="Café versé sur une glace" fill sizes="(max-width: 800px) 48vw, 17vw" /></div>
      </div>
    </section>
  );
}

function HomeFinal() {
  const reveal = useScrollReveal({ threshold: 0.16 });
  return (
    <section {...revealProps(reveal)} className={`home-final home-section home-title-host ${reveal.className}`}>
      <Image className="home-final__divider" src="/img/home-section-divider.png" alt="" aria-hidden="true" width={2172} height={724} sizes="(max-width: 480px) 98vw, (max-width: 800px) 96vw, 92vw" />
      <p className="eyebrow">On vous garde une place ?</p>
      <h2><TitleLine>Le bonheur est aussi</TitleLine><TitleLine as="em" delay={90}>dans les petites pauses.</TitleLine></h2>
      <p>Un déjeuner à deux, un brunch entre amis, ou juste l’envie de prendre le temps.</p>
      <div className="home-final__actions">
        <Link className="btn" href="/reservation">Réserver une table <span>↗</span></Link>
        <Link className="btn home-secondary-btn" href="/contact">Nous trouver <span>→</span></Link>
      </div>
    </section>
  );
}
