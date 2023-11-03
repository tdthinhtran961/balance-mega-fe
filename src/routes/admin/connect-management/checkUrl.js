const isURL = (str) => {
  if (!str) return false;
  const a = document.createElement('a');
  a.href = str;
  return a.host && a.host !== window.location.host;
};

export default isURL;
