import React, { useMemo } from 'react';
import { lookupCountryCode } from '../utils/countryCodes';
import { AlertCircle } from 'lucide-react';

export default function PhoneCountryInput({
  countryCode,
  setCountryCode,
  phoneNumber,
  setPhoneNumber,
  required = true,
}) {
  // Validate dial code and fetch country flag
  const countryInfo = useMemo(() => {
    return lookupCountryCode(countryCode);
  }, [countryCode]);

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2 items-center">

        {/* Country Code Input with Live Flag Badge */}
        <div className="relative shrink-0">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm select-none pointer-events-none">
            {countryInfo.flag}
          </div>

          <input
            type="text"
            placeholder="+91"
            maxLength={5}
            value={countryCode}
            onChange={(e) => {
              let val = e.target.value;
              if (!val.startsWith('+') && val.length > 0) val = '+' + val.replace(/\D/g, '');
              setCountryCode(val.slice(0, 5));
            }}
            className={`w-24 pl-8 pr-5 py-3 bg-[#F8F5F0] border rounded-2xl text-slate-900 focus:outline-none text-xs font-bold text-center transition-colors ${countryCode && !countryInfo.valid
              ? 'border-red-500 bg-red-50/50 text-red-900 focus:border-red-600'
              : 'border-[#E5D7CD] focus:border-[#B17F59]'
              }`}
            title={countryInfo.valid ? `${countryInfo.country} (${countryInfo.code})` : 'Type country calling code e.g. +91, +1'}
          />
        </div>

        {/* Mobile Number Input */}
        <input
          type="tel"
          required={required}
          maxLength={10}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder="7984663563"
          className="w-full px-4 py-3 bg-[#F8F5F0] border border-[#E5D7CD] rounded-2xl text-slate-900 focus:outline-none focus:border-[#B17F59] text-xs font-medium font-mono transition-colors"
        />
      </div>

      {/* Invalid Country Code Warning Message */}
      {countryCode && !countryInfo.valid && (
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-600 animate-fadeIn pl-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Invalid country code.</span>
        </div>
      )}
    </div>
  );
}
