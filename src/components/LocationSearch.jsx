import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Loader2, Search } from 'lucide-react';

export default function LocationSearch({
  locationValue = '',
  onLocationSelect,
  placeholder = 'Enter pickup address or search location...'
}) {
  const [inputValue, setInputValue] = useState(locationValue || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const debounceTimeoutRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setInputValue(locationValue || '');
  }, [locationValue]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch OpenStreetMap Nominatim Suggestions
  const fetchNominatimSuggestions = (query) => {
    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`)
      .then(res => res.json())
      .then(data => {
        setIsSearching(false);
        if (Array.isArray(data) && data.length > 0) {
          setSuggestions(data);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      })
      .catch(err => {
        console.warn('Nominatim search error:', err);
        setIsSearching(false);
        setSuggestions([]);
      });
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchNominatimSuggestions(val);
    }, 300);

    if (onLocationSelect) {
      onLocationSelect({
        address: val,
        latitude: 30.2672,
        longitude: -97.7431
      });
    }
  };

  const handleSelectSuggestion = (place) => {
    const address = place.display_name;
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);

    setInputValue(address);
    setShowDropdown(false);
    setStatusMessage(null);

    if (onLocationSelect) {
      onLocationSelect({
        address,
        latitude: lat,
        longitude: lng,
        placeId: place.place_id ? String(place.place_id) : 'osm-place'
      });
    }
  };

  // "Use My Location" via Browser Geolocation + OpenStreetMap Reverse Geocoding
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setStatusMessage({ type: 'error', text: 'Geolocation is not supported by your browser.' });
      return;
    }

    setIsLocating(true);
    setStatusMessage({ type: 'info', text: 'Detecting your position...' });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        let address = `Coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

        // Reverse Geocode using OpenStreetMap Nominatim
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          if (data && data.display_name) {
            address = data.display_name;
          }
        } catch (e) {
          console.warn('Nominatim reverse geocode error:', e);
        }

        setInputValue(address);
        setIsLocating(false);
        setStatusMessage({ type: 'success', text: 'Current location detected via OpenStreetMap.' });

        if (onLocationSelect) {
          onLocationSelect({
            address,
            latitude: lat,
            longitude: lng,
            placeId: 'current-location'
          });
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setStatusMessage({
            type: 'warning',
            text: 'Location access was not allowed. You can search for your location manually.'
          });
        } else {
          setStatusMessage({
            type: 'error',
            text: 'Unable to retrieve location. Please search manually.'
          });
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', width: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', gap: 'var(--space-2)', width: '100%', position: 'relative' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)', opacity: 0.8 }} />
          <input
            type="text"
            className="input"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            style={{ paddingLeft: '38px', width: '100%' }}
          />
          {isSearching && (
            <Loader2 size={16} className="spin" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          )}
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleUseMyLocation}
          disabled={isLocating}
          title="Detect my current location"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', whiteSpace: 'nowrap' }}
        >
          {isLocating ? <Loader2 size={16} className="spin" /> : <Navigation size={16} />}
          <span>Use My Location</span>
        </button>
      </div>

      {/* Nominatim Suggestions Dropdown Overlay */}
      {showDropdown && suggestions.length > 0 && (
        <div 
          style={{ 
            position: 'absolute', 
            top: '46px', 
            left: 0, 
            right: 0, 
            backgroundColor: 'var(--color-surface)', 
            border: '1px solid var(--color-border)', 
            borderRadius: 'var(--radius-md)', 
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)', 
            zIndex: 99, 
            maxHeight: '220px', 
            overflowY: 'auto' 
          }}
        >
          {suggestions.map((place, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectSuggestion(place)}
              style={{
                padding: 'var(--space-3) var(--space-4)',
                borderBottom: idx < suggestions.length - 1 ? '1px solid var(--color-border)' : 'none',
                cursor: 'pointer',
                fontSize: 'var(--font-size-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                transition: 'background var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(232, 240, 234, 0.6)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Search size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place.display_name}</span>
            </div>
          ))}
        </div>
      )}

      {statusMessage && (
        <div style={{
          fontSize: 'var(--font-size-xs)',
          padding: 'var(--space-2) var(--space-3)',
          borderRadius: 'var(--radius-sm)',
          background: statusMessage.type === 'warning' ? '#FEF3C7' : statusMessage.type === 'success' ? '#D1FAE5' : '#F3F4F6',
          color: statusMessage.type === 'warning' ? '#92400E' : statusMessage.type === 'success' ? '#065F46' : '#374151',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          {statusMessage.text}
        </div>
      )}
    </div>
  );
}
