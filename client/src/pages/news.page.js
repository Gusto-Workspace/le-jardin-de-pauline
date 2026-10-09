import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import SiteShell from "@/components/site-shell.component";
import { Reveal } from "@/components/shared.component";
import { HomeBand } from "@/components/home-banners.component";
import { GlobalContext } from "@/contexts/global.context";
import { formatNewsDate, getVisibleNews } from "@/utils/news";
import SeoHead from "@/components/seo-head.component";

export default function NewsPage() {
  const router = useRouter();
  const { restaurantContext } = useContext(GlobalContext);
  const restaurant = restaurantContext?.restaurantData;
  const news = useMemo(() => getVisibleNews(restaurant), [restaurant]);
  const [selected, setSelected] = useState(null);
  const requestedArticleId = Array.isArray(router.query.article) ? router.query.article[0] : router.query.article;

  const closeArticle = useCallback(() => {
    setSelected(null);
    if (!requestedArticleId) return;
    const query = { ...router.query };
    delete query.article;
    router.replace({ pathname: router.pathname, query }, undefined, { shallow: true, scroll: false });
  }, [requestedArticleId, router]);

  useEffect(() => {
    if (!router.isReady || restaurantContext?.dataLoading || !requestedArticleId) return;
    const article = news.find((item) => String(item?._id) === String(requestedArticleId));
    setSelected(article || null);
  }, [news, requestedArticleId, router.isReady, restaurantContext?.dataLoading]);

  useEffect(() => {
    if (!selected) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    const onKeyDown = (event) => { if (event.key === "Escape") closeArticle(); };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeArticle, selected]);

  return <>
    <SeoHead title="Actualités · Le Jardin de Pauline" description="Les nouvelles et les moments à partager au Jardin de Pauline, salon de thé à Montauban." path="/news" />
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
            const published = formatNewsDate(item?.published_at);
            return <Reveal as="article" className={`news-card${index === 0 ? " news-card--featured" : ""}`} key={item?._id || `${item?.title}-${index}`} delay={Math.min(index * 70, 280)} threshold={0.08}>
              <div className="news-card__image">
                <Image src={item?.image || "/img/home/hero-detail.webp"} alt={item?.title ? `Illustration : ${item.title}` : "Une gourmandise du Jardin de Pauline"} fill sizes="(max-width: 800px) 100vw, 48vw" unoptimized loading="lazy" />
              </div>
              <div className="news-card__copy">
                <p className="eyebrow">Au fil des saisons</p>
                {published ? <time dateTime={item.published_at}>{published}</time> : null}
                <h2>{item?.title || "Une nouvelle du jardin"}</h2>
                {item?.description ? <div className="news-card__preview news-richtext" dangerouslySetInnerHTML={{ __html: item.description }} /> : null}
                <button type="button" className="news-card__read" onClick={() => setSelected(item)}>Lire l’article <ArrowRight size={18} strokeWidth={1.5} /></button>
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
      {selected ? <div className="news-modal" role="dialog" aria-modal="true" aria-labelledby="news-modal-title">
        <button type="button" className="news-modal__backdrop" onClick={closeArticle} aria-label="Fermer l’article" />
        <article>
          <button type="button" className="news-modal__close" onClick={closeArticle} aria-label="Fermer l’article"><X size={24} strokeWidth={1.4} /></button>
          <p className="eyebrow">Le Jardin de Pauline · {formatNewsDate(selected.published_at) || "Actualité"}</p>
          <h2 id="news-modal-title">{selected.title}</h2>
          <div className="news-modal__image"><Image src={selected.image || "/img/home/hero-detail.webp"} alt={selected.title || "Actualité du Jardin de Pauline"} fill sizes="(max-width: 800px) 100vw, 720px" unoptimized /></div>
          {selected.description ? <div className="news-modal__body news-richtext" dangerouslySetInnerHTML={{ __html: selected.description }} /> : null}
        </article>
      </div> : null}
    </SiteShell>
  </>;
}
