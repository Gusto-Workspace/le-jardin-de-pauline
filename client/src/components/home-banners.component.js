import Image from "next/image";
import Link from "next/link";
import { useScrollReveal } from "@/components/shared.component";

function HomeTitleLine({ as: Element = "span", delay = 0, children }) {
  return <Element className="home-title-line" style={{ "--line-delay": `${delay}ms` }}><span className="home-title-line__inner">{children}</span></Element>;
}

export function HomeBand() {
  return (
    <div className="home-band" aria-label="Les rendez-vous du Jardin de Pauline">
      <Image className="home-band__branch" src="/img/home/band-branch.webp" alt="" aria-hidden="true" width={1254} height={1254} sizes="58px" />
      <div className="home-band__track">
        <div className="home-band__ticker">
          <div className="home-band__items">
            <span>Pâtisseries maison</span><b>•</b><span>Déjeuner</span><b>•</b><span>Brunch</span><b>•</b><span>Salon de thé</span><b>•</b><span>Montauban</span>
          </div>
          <div className="home-band__items home-band__items--duplicate" aria-hidden="true">
            <span>Pâtisseries maison</span><b>•</b><span>Déjeuner</span><b>•</b><span>Brunch</span><b>•</b><span>Salon de thé</span><b>•</b><span>Montauban</span>
          </div>
        </div>
      </div>
      <Image className="home-band__branch home-band__branch--right" src="/img/home/band-branch.webp" alt="" aria-hidden="true" width={1254} height={1254} sizes="58px" />
    </div>
  );
}

export function HomeDoor({ className = "" }) {
  const reveal = useScrollReveal({ threshold: 0.12 });
  return (
    <section ref={reveal.ref} style={reveal.style} className={`home-door home-section home-title-host ${className} ${reveal.className}`.trim()}>
      <div className="home-door__image home-image-frame"><Image src="/img/home/door.webp" alt="La cour ombragée du Jardin de Pauline" fill sizes="100vw" /></div>
      <div className="home-door__panel">
        <p className="eyebrow">Une cour pleine de charme</p>
        <h2><HomeTitleLine>Poussez la porte.</HomeTitleLine></h2>
        <p>Notre terrasse ombragée vous attend pour un moment hors du temps, en plein cœur de Montauban.</p>
        <Link className="btn" href="/reservation">Réserver une table <span>↗</span></Link>
      </div>
    </section>
  );
}
