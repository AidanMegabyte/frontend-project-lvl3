function ParserError(message) {
  this.name = 'ParserError';
  this.message = message;
  this.stack = (new Error()).stack;
}
ParserError.prototype = Object.create(Error.prototype);
ParserError.prototype.constructor = ParserError;

// Парсер RSS
export default function parseRss(xmlString) {
  const xml = new DOMParser().parseFromString(xmlString, 'application/xml');
  const error = xml.querySelector('parsererror');
  if (error) {
    throw new ParserError(error.textContent);
  }
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
