import { Cookies } from '@trello/cookies';

export const logoutUser = (returnUrl?: string): void => {
  const form = document.createElement('form');
  form.method = 'post';
  form.action = '/logout';
  form.name = 'logout';
  form.style.display = 'none';

  const dscInput = document.createElement('input');
  dscInput.name = 'dsc';
  dscInput.value = Cookies.get('dsc') ?? '';

  form.appendChild(dscInput);

  if (returnUrl) {
    const returnUrlInput = document.createElement('input');
    returnUrlInput.name = 'returnUrl';
    returnUrlInput.value = returnUrl;

    form.appendChild(returnUrlInput);
  }

  // A cookie alone is not enough, because that leaves us
  // vulnerable to CSRF.
  return document.body.appendChild(form).submit();
};
