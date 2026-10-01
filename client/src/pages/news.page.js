import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useContext, useMemo } from "react";
import SiteShell from "@/components/site-shell.component";
import { Reveal } from "@/components/shared.component";
import { HomeBand } from "@/components/home-banners.component";
import { GlobalContext } from "@/contexts/global.context";
import { formatNewsDate, getVisibleNews, stripNewsHtml } from "@/utils/news";

export default function NewsPage() {
  const { restaurantContext } = useContext(GlobalContext);
  const restaurant = restaurantContext?.restaurantData;
  const news = useMemo(() => getVisibleNews(restaurant), [restaurant]);

  return <>
    <Head>
      <title>Actualités · Le Jardin de Pauline</title>
      <meta name="description" content="Les nouvelles et les moments à partager au Jardin de Pauline, salon de thé à Montauban." />
    </Head>
    <SiteShell>
      <div className="news-page">
        <section className="news-hero container" aria-labelledby="news-title">
          <Image className="news-hero__branch" src="/img/home/botanical-branch.webp" alt="" aria-hidden="true" width={1024} height={1536} />
          <Reveal className="news-hero__copy home-title-host" threshold={0.05}>
            <p className="eyebrow">La vie du jardin · Montauban</p>
            <h1 id="news-title">Les nouvelles<br /><em>du jardin.</em></h1>
            <p>Les rendez-vous, les nouveautés et les petits instants gourmands que nous avons envie de partager avec vous.</p>
          </Reveal>
          <Reveal className="news-hero__photo home-image-frame" delay={140} threshold={0.05}>
            <Image src="/img/home/door.webp" alt="La cour fleurie du Jardin de Pauline" fill priority sizes="(max-width: 800px) 88vw, 43vw" />
          </Reveal>
        </section>

        <HomeBand />

        <section className="news-feed container" aria-label="Actualités du Jardin de Pauline" aria-live="polite">
          {restaurantContext?.dataLoading ? <p className="news-state" role="status">Le jardin prépare ses nouvelles…</p> : null}
          {!restaurantContext?.dataLoading && restaurantContext?.dataError ? <p className="news-state" role="alert">Les actualités sont momentanément indisponibles. Réessayez dans un instant.</p> : null}
          {!restaurantContext?.dataLoading && !restaurantContext?.dataError && news.length === 0 ? <p className="news-state">Aucune actualité pour le moment. Revenez bientôt nous voir.</p> : null}
          {news.map((item, index) => {
            const description = stripNewsHtml(item?.description);
            const published = formatNewsDate(item?.published_at);
            return <Reveal as="article" className={`news-card${index === 0 ? " news-card--featured" : ""}`} key={item?._id || `${item?.title}-${index}`} delay={Math.min(index * 70, 280)} threshold={0.08}>
              <div className="news-card__image">
                <Image src={item?.image || "/img/home/hero-detail.webp"} alt={item?.title ? `Illustration : ${item.title}` : "Une gourmandise du Jardin de Pauline"} fill sizes="(max-width: 800px) 100vw, 48vw" unoptimized loading="lazy" />
              </div>
              <div className="news-card__copy">
                <p className="eyebrow">Au fil des saisons</p>
                {published ? <time dateTime={item.published_at}>{published}</time> : null}
                <h2>{item?.title || "Une nouvelle du jardin"}</h2>
                {description ? <p className="news-card__description">{description}</p> : null}
              </div>
            </Reveal>;
          })}
        </section>

        <Reveal as="section" className="news-invite" threshold={0.12}>
          <Image className="news-invite__flower" src="/img/home/moments-flower.webp" alt="" aria-hidden="true" width={1254} height={1254} />
          <p className="eyebrow">À très bientôt</p>
          <h2>On vous garde<br /><em>une jolie place.</em></h2>
          <p>Une envie de déjeuner, de bruncher ou simplement de prendre le temps ?</p>
          <div className="home-actions"><Link className="btn" href="/reservation">Réserver une table <span>↗</span></Link><Link className="btn home-secondary-btn" href="/contact">Nous trouver <span>→</span></Link></div>
        </Reveal>
      </div>
    </SiteShell>
  </>;
}
