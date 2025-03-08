export const getRevenue = (note: string): string => {
  try {
    let Start = note.indexOf('Currency{=}') + 11;
    let End = note.indexOf('{next}', Start);
    const currencyStr = note.substring(Start, End);

    Start = note.indexOf('Revenue{=}') + 10;
    End = note.indexOf('{next}', Start);
    const revenue = parseFloat(note.substring(Start, End));
    const currency = currencyStr == null ? '' : currencyStr.split('|')[0] + revenue;
    if (!revenue) {
      return '';
    }
    return currency;
  } catch (e) {
    return '';
  }
};

export const roundOffRevenue = (num: number): number | string => {
  try {
    if (!num) return '';
    if (num < 1000) return num;
    const newNum = parseFloat(num.toString().replace(/[^0-9.]/g, ''));
    const si = [
      { v: 1e3, s: 'K' },
      { v: 1e6, s: 'M' },
      { v: 1e9, s: 'B' },
      { v: 1e12, s: 'T' },
      { v: 1e15, s: 'P' },
      { v: 1e18, s: 'E' }
    ];
    let index;
    for (index = si.length - 1; index > 0; index -= 1) {
      if (newNum >= si[index].v) {
        break;
      }
    }
    return (
      (newNum / si[index].v).toFixed(1).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[index].s
    );
  } catch (e) {
    return num;
  }
};
