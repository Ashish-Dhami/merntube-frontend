export const formatNumber = (number) => {
  if (number < 1000) return number.toString();

  const formatter = new Intl.NumberFormat('en', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  });

  return formatter.format(number);
};
