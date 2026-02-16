export function updateSEO(title: string, description: string, ogTitle?: string, ogDescription?: string) {
  document.title = title;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute("content", description);
  } else {
    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content = description;
    document.head.appendChild(meta);
  }

  const ogTitleEl = document.querySelector('meta[property="og:title"]') || document.createElement("meta");
  ogTitleEl.setAttribute("property", "og:title");
  ogTitleEl.setAttribute("content", ogTitle || title);
  if (!ogTitleEl.parentNode) document.head.appendChild(ogTitleEl);

  const ogDescEl = document.querySelector('meta[property="og:description"]') || document.createElement("meta");
  ogDescEl.setAttribute("property", "og:description");
  ogDescEl.setAttribute("content", ogDescription || description);
  if (!ogDescEl.parentNode) document.head.appendChild(ogDescEl);

  const ogType = document.querySelector('meta[property="og:type"]') || document.createElement("meta");
  ogType.setAttribute("property", "og:type");
  ogType.setAttribute("content", "website");
  if (!ogType.parentNode) document.head.appendChild(ogType);

  const ogLocale = document.querySelector('meta[property="og:locale"]') || document.createElement("meta");
  ogLocale.setAttribute("property", "og:locale");
  ogLocale.setAttribute("content", "fr_FR");
  if (!ogLocale.parentNode) document.head.appendChild(ogLocale);
}
