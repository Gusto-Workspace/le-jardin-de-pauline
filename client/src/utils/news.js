export function stripNewsHtml(value) {
  return String(value || "")
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function getVisibleNews(restaurant) {
  return [...(Array.isArray(restaurant?.news) ? restaurant.news : [])]
    .filter((item) => item?.visible !== false)
    .sort((a, b) => (new Date(b?.published_at).getTime() || 0) - (new Date(a?.published_at).getTime() || 0));
}

export function hasVisibleNews(restaurant) {
  return getVisibleNews(restaurant).length > 0;
}

export function formatNewsDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export function getNewsExcerpt(value, maxLength = 190) {
  const text = stripNewsHtml(value);
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}
