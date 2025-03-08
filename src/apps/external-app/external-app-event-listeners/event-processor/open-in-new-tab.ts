const openInNewTabProcessor = (event: MessageEvent): void => {
  if (event?.data?.payload) {
    const payload = event?.data?.payload as Record<string, unknown>;
    const route = `/ExternalApp?isExternalApp=true&url=${payload.url}`;
    if (payload?.openInSameTab) {
      window.location.assign(route);
    } else {
      window.open(route, '_blank');
    }
  }
};

export default openInNewTabProcessor;
