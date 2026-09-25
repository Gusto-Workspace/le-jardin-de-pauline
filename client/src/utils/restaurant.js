const days = [
  ["Lundi", ["monday", "lundi", "hours.days.monday"]],
  ["Mardi", ["tuesday", "mardi", "hours.days.tuesday"]],
  ["Mercredi", ["wednesday", "mercredi", "hours.days.wednesday"]],
  ["Jeudi", ["thursday", "jeudi", "hours.days.thursday"]],
  ["Vendredi", ["friday", "vendredi", "hours.days.friday"]],
  ["Samedi", ["saturday", "samedi", "hours.days.saturday"]],
  ["Dimanche", ["sunday", "dimanche", "hours.days.sunday"]],
];

export function formatPrice(value) {
  const price = Number(value);
  return Number.isFinite(price) && price > 0
    ? `${price.toFixed(2).replace(".00", "").replace(".", ",")} €`
    : "";
}

export function getAddress(restaurant) {
  const address = restaurant?.address || {};
  const locality = [String(address.zipCode || "").trim(), address.city]
    .filter(Boolean)
    .join(" ");
  return [address.line1, locality].filter(Boolean);
}

export function getSocialUrl(restaurant, network) {
  const value = String(restaurant?.social_media?.[network] || "").trim();
  if (!value) return "";
  return /^(https?:)?\/\//i.test(value) ? value : `https://${value}`;
}

function formatRanges(day) {
  if (!day || day.isClosed || !day.hours?.length) return "Fermé";
  return day.hours
    .map(({ open, close }) => `${open?.replace(":", "h")} — ${close?.replace(":", "h")}`)
    .join(" · ");
}

export function getHours(restaurant) {
  const source = Array.isArray(restaurant?.opening_hours)
    ? restaurant.opening_hours
    : [];
  return days.map(([label, aliases], index) => {
    const found = source.find((item) => aliases.includes(String(item?.day || "").toLowerCase())) || source[index];
    return { label, value: formatRanges(found) };
  });
}

export function groupHours(items) {
  return items.reduce((groups, item) => {
    const last = groups.at(-1);
    if (last?.value === item.value) last.labels.push(item.label);
    else groups.push({ labels: [item.label], value: item.value });
    return groups;
  }, []);
}

export function getDishSections(restaurant) {
  return (restaurant?.dish_categories || [])
    .filter((category) => category?.visible !== false)
    .map((category, index) => ({
      id: category?._id || `dish-${index}`,
      name: category?.name || "La carte",
      description: category?.description || "",
      items: (category?.dishes || [])
        .filter((item) => item?.showOnWebsite)
        .map(mapItem),
      subCategories: (category?.subCategories || [])
        .filter((sub) => sub?.visible !== false)
        .map((sub, subIndex) => ({
          id: sub?._id || `sub-${subIndex}`,
          name: sub?.name || "",
          items: (sub?.dishes || []).filter((item) => item?.showOnWebsite).map(mapItem),
        }))
        .filter((sub) => sub.items.length),
    }))
    .filter((category) => category.items.length || category.subCategories.length);
}

function mapItem(item) {
  return {
    id: item?._id || item?.name,
    name: item?.name || "",
    description: item?.description || "",
    price: formatPrice(item?.price),
    bio: Boolean(item?.bio),
  };
}

export function getMenus(restaurant) {
  return (restaurant?.menus || []).filter((menu) => menu?.visible !== false);
}

export function getDrinkSections(restaurant) {
  return (restaurant?.drink_categories || [])
    .filter((category) => category?.visible !== false)
    .map((category, index) => ({
      id: category?._id || `drink-${index}`,
      name: category?.name || "Boissons",
      items: (category?.drinks || []).filter((item) => item?.showOnWebsite).map(mapItem),
      subCategories: (category?.subCategories || [])
        .filter((sub) => sub?.visible !== false)
        .map((sub, subIndex) => ({
          id: sub?._id || `drink-sub-${subIndex}`,
          name: sub?.name || "",
          items: (sub?.drinks || []).filter((item) => item?.showOnWebsite).map(mapItem),
        }))
        .filter((sub) => sub.items.length),
    }))
    .filter((category) => category.items.length || category.subCategories.length);
}

export function getWineSections(restaurant) {
  const mapWine = (wine) => ({
    id: wine?._id || wine?.name,
    name: wine?.name || "",
    description: [wine?.appellation, wine?.year].filter(Boolean).join(" · "),
    prices: (wine?.volumes || []).map((volume) => ({
      label: volume?.volume || "",
      price: formatPrice(volume?.price),
    })),
    bio: Boolean(wine?.bio),
  });

  return (restaurant?.wine_categories || [])
    .filter((category) => category?.visible !== false)
    .map((category, index) => ({
      id: category?._id || `wine-${index}`,
      name: category?.name || "Vins",
      items: (category?.wines || []).filter((wine) => wine?.showOnWebsite).map(mapWine),
      subCategories: (category?.subCategories || [])
        .filter((sub) => sub?.visible !== false)
        .map((sub, subIndex) => ({
          id: sub?._id || `wine-sub-${subIndex}`,
          name: sub?.name || "",
          items: (sub?.wines || []).filter((wine) => wine?.showOnWebsite).map(mapWine),
        }))
        .filter((sub) => sub.items.length),
    }))
    .filter((category) => category.items.length || category.subCategories.length);
}
