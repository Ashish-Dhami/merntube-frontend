export const useMaskedEmail = (email) => {
  if (!email) return '';
  const [localPart, domain] = email.split('@');
  const maskedLocal = localPart[0] + '*****';
  return `${maskedLocal}@${domain}`;
};
