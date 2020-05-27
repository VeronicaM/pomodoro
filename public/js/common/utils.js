
// swap values with keys
export function swap(json) {
  return Object.keys(json).reduce((acc, key) => {
    acc[json[key]] = key;
    return acc;
  }, {});
}

export function setSource(element, URL) {
  element.attr('src', URL);
}

export function updateText(element, text) {
  element.text(text);
}
