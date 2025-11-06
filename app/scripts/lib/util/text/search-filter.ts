export const searchFilter = (search: string) => {
  const searchTerms = search.toLowerCase().split(/[\s,]+/);

  const tests = searchTerms.map((term, index) => {
    if (term.length === 0) {
      return (s: string) => true;
    } else if (index === searchTerms.length - 1) {
      // Assume the last term is a partial
      return (s: string) => s.toLowerCase().indexOf(term) === 0;
    } else {
      return (s: string) => s.toLowerCase() === term;
    }
  });

  return (word: string[] | string) => {
    if (Array.isArray(word)) {
      word = word.join(' ');
    }

    const terms = word.toLowerCase().split(/\s+/);
    // We've got to have a match for every search term
    return tests.every((fn) => terms.some((term) => fn(term)));
  };
};
