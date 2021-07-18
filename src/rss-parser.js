// Парсер RSS
export default function parseRss(xmlString) {
  const xml = new DOMParser().parseFromString(xmlString, 'application/xml');
  const feed = {
    title: xml.querySelector('title').textContent,
    description: xml.querySelector('description').textContent,
    link: xml.querySelector('link').textContent,
  };
  const posts = Array.from(xml.querySelectorAll('item')).map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }));
  return { feed, posts };
}