// escapes (adds leading escape slash) every character inside the outer [ ]
// e.g: ? -> \?, } -> \}, ' ' -> \' '

export const escapeForRegex = (text: string): string =>
  text?.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&');
