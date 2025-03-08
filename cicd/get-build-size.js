const data = require(`../build/stats.json`);

const getBuildSize = () => {
  let buildSize = 0;
  const { assets = [] } = data;
  assets.forEach((chunk) => {
    if (
      (chunk.name?.startsWith('main.') ||
        chunk.name?.startsWith('vendor.') ||
        chunk.name?.startsWith('runtime.') ||
        chunk.name?.startsWith('src_apps_entity-details_index_ts')) && //previous check was taking rest of the entity details lazy loaded also which was causing build issue
      chunk.name?.endsWith('.js')
    ) {
      buildSize += chunk.size || 0;
    }
  });
  return buildSize;
};

console.log(getBuildSize());
