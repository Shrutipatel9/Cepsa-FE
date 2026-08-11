import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, Navigation } from 'lucide-react';

export default function LocationInput({
  value = '',
  onChange,
  placeholder = 'e.g. Mumbai, Maharashtra',
  label = '',
  inputClassName = '',
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [useCurrentLoc, setUseCurrentLoc] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [geoError, setGeoError] = useState('');
  
  const containerRef = useRef(null);
  const autocompleteService = useRef(null);
  const geocoder = useRef(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Load Google Maps SDK script dynamically if API key is provided
  useEffect(() => {
    if (!apiKey) return;

    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      geocoder.current = new window.google.maps.Geocoder();
      return;
    }

    const existingScript = document.getElementById('google-maps-sdk');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-maps-sdk';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=en`;
      script.async = true;
      script.onload = () => {
        if (window.google?.maps?.places) {
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
          geocoder.current = new window.google.maps.Geocoder();
        }
      };
      document.head.appendChild(script);
    }
  }, [apiKey]);

  // Handle clicking outside to close autocomplete dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const debounceTimer = useRef(null);

  // Fetch free search suggestions via OpenStreetMap Nominatim as fallback
  const fetchFallbackSuggestions = (query) => {
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&accept-language=en&addressdetails=1&q=${encodeURIComponent(
        query
      )}&limit=5`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const formattedList = data.map((item) => {
            const addr = item.address || {};
            const city =
              addr.city ||
              addr.town ||
              addr.village ||
              addr.suburb ||
              addr.county ||
              addr.state_district ||
              '';
            const state = addr.state || '';
            const country = addr.country || '';
            const parts = [city, state, country].filter(Boolean);
            return parts.length > 0 ? parts.join(', ') : item.display_name;
          });

          // Filter unique suggestions
          const uniqueList = Array.from(new Set(formattedList));
          setSuggestions(uniqueList);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      })
      .catch(() => {
        setSuggestions([]);
        setShowDropdown(false);
      });
  };

  // Fetch place predictions as user types
  const handleInputChange = (e) => {
    const query = e.target.value;
    onChange(query);
    setUseCurrentLoc(false);
    setGeoError('');

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      if (autocompleteService.current) {
        try {
          autocompleteService.current.getPlacePredictions(
            {
              input: query,
              types: ['(regions)'], // Regions, cities, administrative areas
              language: 'en',
            },
            (predictions, status) => {
              if (
                status === window.google.maps.places.PlacesServiceStatus.OK &&
                predictions &&
                predictions.length > 0
              ) {
                setSuggestions(predictions.map((p) => p.description));
                setShowDropdown(true);
              } else {
                // If Google Places returns zero results or error, try fallback
                fetchFallbackSuggestions(query);
              }
            }
          );
        } catch (err) {
          fetchFallbackSuggestions(query);
        }
      } else {
        // If Google Places SDK is not loaded (e.g. no API key provided), use free search fallback
        fetchFallbackSuggestions(query);
      }
    }, 200);
  };

  // Helper function for reverse geocoding fallback via OpenStreetMap Nominatim (enforced English)
  const reverseGeocodeFallback = (latitude, longitude) => {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&accept-language=en&lat=${latitude}&lon=${longitude}`)
      .then((res) => res.json())
      .then((data) => {
        setLoadingLocation(false);
        if (data && data.address) {
          const addr = data.address;
          const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || addr.state_district || '';
          const state = addr.state || '';
          const country = addr.country || '';

          const parts = [city, state, country].filter(Boolean);
          const formatted = parts.length > 0 ? parts.join(', ') : data.display_name;
          onChange(formatted);
        } else {
          setGeoError('Unable to resolve city name.');
          setUseCurrentLoc(false);
        }
      })
      .catch(() => {
        setLoadingLocation(false);
        setGeoError('Failed to retrieve location name.');
        setUseCurrentLoc(false);
      });
  };

  // Handle Current Location Checkbox Toggle
  const handleCurrentLocationToggle = (e) => {
    const isChecked = e.target.checked;
    setUseCurrentLoc(isChecked);
    setGeoError('');

    if (!isChecked) return;

    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      setUseCurrentLoc(false);
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (geocoder.current) {
          geocoder.current.geocode(
            { location: { lat: latitude, lng: longitude }, language: 'en' },
            (results, status) => {
              if (status === 'OK' && results && results[0]) {
                setLoadingLocation(false);
                const result = results[0];
                let cityComp = '';
                let stateComp = '';
                let countryComp = '';

                for (let comp of result.address_components) {
                  if (comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')) {
                    cityComp = comp.long_name;
                  }
                  if (comp.types.includes('administrative_area_level_1')) {
                    stateComp = comp.long_name;
                  }
                  if (comp.types.includes('country')) {
                    countryComp = comp.long_name;
                  }
                }

                const parts = [cityComp, stateComp, countryComp].filter(Boolean);
                const locationStr = parts.length > 0 ? parts.join(', ') : result.formatted_address;

                onChange(locationStr);
              } else {
                // Fallback if Google Geocoder fails
                reverseGeocodeFallback(latitude, longitude);
              }
            }
          );
        } else if (apiKey) {
          // Direct HTTP fallback if JS SDK loader is pending
          fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=en&key=${apiKey}`
          )
            .then((res) => res.json())
            .then((data) => {
              if (data.results && data.results[0]) {
                setLoadingLocation(false);
                onChange(data.results[0].formatted_address);
              } else {
                reverseGeocodeFallback(latitude, longitude);
              }
            })
            .catch(() => {
              reverseGeocodeFallback(latitude, longitude);
            });
        } else {
          // Free Nominatim reverse geocode fallback if no Google API Key
          reverseGeocodeFallback(latitude, longitude);
        }
      },
      (error) => {
        setLoadingLocation(false);
        setUseCurrentLoc(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError('Location access denied. Please allow browser location access.');
        } else {
          setGeoError('Unable to retrieve location.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectSuggestion = (suggestion) => {
    onChange(suggestion);
    setShowDropdown(false);
    setSuggestions([]);
  };

  return (
    <div ref={containerRef} className="relative space-y-1.5">
      {/* Label and Current Location Checkbox Flex Row */}
      <div className="flex items-center justify-between gap-2">
        {label ? (
          <label className="block text-xs font-semibold text-slate-700">
            {label}
          </label>
        ) : (
          <span />
        )}

        {/* Checkbox: Use Current Location */}
        <label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer select-none shrink-0">
          <input
            type="checkbox"
            checked={useCurrentLoc}
            onChange={handleCurrentLocationToggle}
            className="w-3.5 h-3.5 text-[#B17F59] rounded border-[#E5D7CD] focus:ring-[#B17F59] cursor-pointer accent-[#B17F59]"
          />
          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
            <Navigation className={`w-3 h-3 ${useCurrentLoc ? 'text-[#B17F59]' : 'text-slate-400'}`} />
            Use my current location
          </span>
        </label>
      </div>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          className={
            inputClassName ||
            'w-full px-4 py-3 bg-[#F8F5F0] border border-[#E5D7CD] rounded-2xl text-slate-900 focus:outline-none focus:border-[#B17F59] text-xs font-medium transition-colors pr-10'
          }
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[#B17F59]">
          {loadingLocation ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#B17F59]" />
          ) : (
            <MapPin className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown List */}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-1 bg-white border border-[#E5D7CD] rounded-2xl shadow-xl max-h-48 overflow-y-auto py-1.5 text-xs text-slate-800 animate-fadeIn">
          {suggestions.map((item, idx) => (
            <li
              key={idx}
              onClick={() => handleSelectSuggestion(item)}
              className="px-4 py-2.5 hover:bg-[#F0E8E1] hover:text-[#B17F59] transition-colors cursor-pointer flex items-center gap-2.5 text-xs font-medium"
            >
              <MapPin className="w-3.5 h-3.5 text-[#B17F59] shrink-0" />
              <span className="truncate">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Geolocation Error Message */}
      {geoError && (
        <p className="text-[11px] font-medium text-red-600 pl-0.5 animate-fadeIn">
          {geoError}
        </p>
      )}
    </div>
  );
}

