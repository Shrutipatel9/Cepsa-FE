// Comprehensive International Dialing Codes and Flag Mapping

export const COUNTRY_DIAL_MAP = [
  { code: '+91', iso: 'IN', country: 'India', flag: '🇮🇳' },
  { code: '+1', iso: 'US', country: 'United States / Canada', flag: '🇺🇸' },
  { code: '+44', iso: 'GB', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', iso: 'AE', country: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+966', iso: 'SA', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+965', iso: 'KW', country: 'Kuwait', flag: '🇰🇼' },
  { code: '+974', iso: 'QA', country: 'Qatar', flag: '🇶🇦' },
  { code: '+968', iso: 'OM', country: 'Oman', flag: '🇴🇲' },
  { code: '+973', iso: 'BH', country: 'Bahrain', flag: '🇧🇭' },
  { code: '+61', iso: 'AU', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', iso: 'DE', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', iso: 'FR', country: 'France', flag: '🇫🇷' },
  { code: '+39', iso: 'IT', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', iso: 'ES', country: 'Spain', flag: '🇪🇸' },
  { code: '+81', iso: 'JP', country: 'Japan', flag: '🇯🇵' },
  { code: '+86', iso: 'CN', country: 'China', flag: '🇨🇳' },
  { code: '+65', iso: 'SG', country: 'Singapore', flag: '🇸🇬' },
  { code: '+60', iso: 'MY', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+62', iso: 'ID', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+66', iso: 'TH', country: 'Thailand', flag: '🇹🇭' },
  { code: '+84', iso: 'VN', country: 'Vietnam', flag: '🇻🇳' },
  { code: '+82', iso: 'KR', country: 'South Korea', flag: '🇰🇷' },
  { code: '+92', iso: 'PK', country: 'Pakistan', flag: '🇵🇰' },
  { code: '+880', iso: 'BD', country: 'Bangladesh', flag: '🇧🇩' },
  { code: '+94', iso: 'LK', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+977', iso: 'NP', country: 'Nepal', flag: '🇳🇵' },
  { code: '+20', iso: 'EG', country: 'Egypt', flag: '🇪🇬' },
  { code: '+27', iso: 'ZA', country: 'South Africa', flag: '🇿🇦' },
  { code: '+234', iso: 'NG', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+254', iso: 'KE', country: 'Kenya', flag: '🇰🇪' },
  { code: '+7', iso: 'RU', country: 'Russia / Kazakhstan', flag: '🇷🇺' },
  { code: '+90', iso: 'TR', country: 'Turkey', flag: '🇹🇷' },
  { code: '+31', iso: 'NL', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+32', iso: 'BE', country: 'Belgium', flag: '🇧🇪' },
  { code: '+41', iso: 'CH', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+43', iso: 'AT', country: 'Austria', flag: '🇦🇹' },
  { code: '+46', iso: 'SE', country: 'Sweden', flag: '🇸🇪' },
  { code: '+47', iso: 'NO', country: 'Norway', flag: '🇳🇴' },
  { code: '+45', iso: 'DK', country: 'Denmark', flag: '🇩🇰' },
  { code: '+358', iso: 'FI', country: 'Finland', flag: '🇫🇮' },
  { code: '+353', iso: 'IE', country: 'Ireland', flag: '🇮🇪' },
  { code: '+351', iso: 'PT', country: 'Portugal', flag: '🇵🇹' },
  { code: '+30', iso: 'GR', country: 'Greece', flag: '🇬🇷' },
  { code: '+48', iso: 'PL', country: 'Poland', flag: '🇵🇱' },
  { code: '+420', iso: 'CZ', country: 'Czech Republic', flag: '🇨🇿' },
  { code: '+36', iso: 'HU', country: 'Hungary', flag: '🇭🇺' },
  { code: '+40', iso: 'RO', country: 'Romania', flag: '🇷🇴' },
  { code: '+55', iso: 'BR', country: 'Brazil', flag: '🇧🇷' },
  { code: '+52', iso: 'MX', country: 'Mexico', flag: '🇲🇽' },
  { code: '+54', iso: 'AR', country: 'Argentina', flag: '🇦🇷' },
  { code: '+56', iso: 'CL', country: 'Chile', flag: '🇨🇱' },
  { code: '+57', iso: 'CO', country: 'Colombia', flag: '🇨🇴' },
  { code: '+51', iso: 'PE', country: 'Peru', flag: '🇵🇪' },
  { code: '+64', iso: 'NZ', country: 'New Zealand', flag: '🇳🇿' },
  { code: '+964', iso: 'IQ', country: 'Iraq', flag: '🇮🇶' },
  { code: '+963', iso: 'SY', country: 'Syria', flag: '🇸🇾' },
  { code: '+962', iso: 'JO', country: 'Jordan', flag: '🇯🇴' },
  { code: '+961', iso: 'LB', country: 'Lebanon', flag: '🇱🇧' },
  { code: '+967', iso: 'YE', country: 'Yemen', flag: '🇾🇪' },
];

/**
 * Validate and find country by user input dial code e.g. "+91" or "91"
 */
export function lookupCountryCode(inputCode) {
  if (!inputCode) return { valid: false, flag: '🌐', country: 'Unknown' };

  let clean = inputCode.trim();
  if (!clean.startsWith('+')) {
    clean = '+' + clean.replace(/\D/g, '');
  }

  // Exact match
  const found = COUNTRY_DIAL_MAP.find((c) => c.code === clean);
  if (found) {
    return { ...found, valid: true };
  }

  // Partial or 2-digit match fallback
  const partial = COUNTRY_DIAL_MAP.find((c) => clean.startsWith(c.code));
  if (partial) {
    return { ...partial, valid: true };
  }

  return { valid: false, flag: '⚠️', country: 'Invalid Country Code', code: clean };
}
