const toCamelCase = (str) => {
  return [].map.call(str, (char, i) => (i ? char : char.toUpperCase())).join('');
};

exports.toCamelCase = toCamelCase;
