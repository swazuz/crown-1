export const getCSRF = () => {
  const name = 'XSRF-TOKEN=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.startsWith(' ')) c = c.substring(1);
    if (c.includes(name)) return c.substring(name.length, c.length);
  }
  return '';
};
