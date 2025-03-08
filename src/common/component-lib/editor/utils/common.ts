const getNewURL = (url: string): string => {
  if (url.startsWith('http:/')) return url.replace('http:/', '');
  return url;
};

export { getNewURL };
