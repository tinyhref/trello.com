function capitalize(str: string) {
  return `${str.slice(0, 1).toUpperCase()}${str.substr(1).toLowerCase()}`;
}

export function languageParts(locale: string) {
  const pattern =
    /^([a-zA-Z]{2,3})(?:[_-]+([a-zA-Z]{3})(?=$|[_-]+))?(?:[_-]+([a-zA-Z]{4})(?=$|[_-]+))?(?:[_-]+([a-zA-Z]{2}|[0-9]{3})(?=$|[_-]+))?/;
  const [, language = '', extlang = '', script = '', region = ''] =
    locale.match(pattern) || [];

  return {
    language: language.toLowerCase(),
    extlang: extlang.toLowerCase(),
    script: capitalize(script),
    region: region.toUpperCase(),
  };
}
