const getUrl = (value: string | undefined): string => {
  if (!value) return '';
  return value?.startsWith('http') || value?.startsWith('https') ? value : `https://${value}`;
};

export { getUrl };
