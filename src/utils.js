export const waLink = (number, text) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
