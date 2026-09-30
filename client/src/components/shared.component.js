import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function useScrollReveal({ delay = 0, threshold = 0.14 } = {}) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setReady(true);
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.unobserve(node);
    }, { threshold, rootMargin: "0px 0px -8% 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return {
    ref,
    className: `reveal${ready ? ` ${visible ? "is-visible" : "is-hidden"}` : ""}`,
    style: { "--reveal-delay": `${delay}ms` },
  };
}

export function PageIntro({ eyebrow, title, italic, children, className = "" }) {
  const reveal = useScrollReveal();
  return <section ref={reveal.ref} style={reveal.style} className={`page-intro container ${reveal.className} ${className}`.trim()}><p className="eyebrow">{eyebrow}</p><h1>{title}<br /><em>{italic}</em></h1>{children ? <p>{children}</p> : null}</section>;
}

export function Reveal({ as: Component = "div", children, className = "", delay = 0, threshold = 0.14, ...props }) {
  const reveal = useScrollReveal({ delay, threshold });
  return <Component {...props} ref={reveal.ref} style={reveal.style} className={`${className} ${reveal.className}`.trim()}>{children}</Component>;
}

export function Invite({ title = "Le bonheur est aussi", italic = "dans les petites pauses.", text = "Un déjeuner à deux, un brunch entre amis, ou juste l’envie de prendre le temps." }) {
  const reveal = useScrollReveal({ threshold: 0.2 });
  return <section ref={reveal.ref} style={reveal.style} className={`invite ${reveal.className}`}><p className="eyebrow">On vous garde une place ?</p><h2><span className="invite-title-line">{title}</span><em className="invite-italic-line">{italic}</em></h2><p>{text}</p><Link className="btn" href="/reservation">Réserver une table <span>↗</span></Link></section>;
}

export function ApiState({ loading, error, empty, children }) {
  if (loading) return <div className="api-state">Le jardin prépare la sélection…</div>;
  if (error) return <div className="api-state api-state--error">La sélection n’est pas disponible pour le moment.</div>;
  if (empty) return <div className="api-state api-state--empty">La carte sera bientôt disponible</div>;
  return children;
}
