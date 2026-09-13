import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, ExternalLink, Compass, AlertCircle } from 'lucide-react';

export default function OSMMapView({
  pickupLocation = null,
  vendors = [],
  collectionPoints = [],
  selectedDestination = null,
  onSelectDestination = null,
  height = '420px'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const polylineRef = useRef(null);

  const [isLeafletReady, setIsLeafletReady] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);

  const pickupLat = pickupLocation?.latitude || 30.2672;
  const pickupLng = pickupLocation?.longitude || -97.7431;

  // Load Leaflet JS & CSS dynamically from CDN
  useEffect(() => {
    if (window.L) {
      setIsLeafletReady(true);
      return;
    }

    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(cssLink);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => setIsLeafletReady(true);
    document.head.appendChild(script);
  }, []);

  // Initialize Leaflet Map Instance
  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current) return;
    const L = window.L;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [pickupLat, pickupLng],
        zoom: 12,
        zoomControl: true
      });

      // CARTO Voyager Tile Layer (OpenStreetMap vector base with 3D buildings & modern UI)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }
  }, [isLeafletReady]);

  // Update Markers & OSRM Driving Route
  useEffect(() => {
    if (!isLeafletReady || !mapInstanceRef.current || !layerGroupRef.current) return;
    const L = window.L;
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;

    layerGroup.clearLayers();
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    const bounds = [];

    // Custom Icon Helper
    const createCustomIcon = (color, symbol) => {
      return L.divIcon({
        className: 'custom-osm-marker',
        html: `<div style="
          background-color: ${color};
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 13px;
          font-weight: bold;
        ">${symbol}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
    };

    // 1. Pickup Location Marker
    if (pickupLat && pickupLng) {
      const pickupIcon = createCustomIcon('#2563EB', '📍');
      const pickupMarker = L.marker([pickupLat, pickupLng], { icon: pickupIcon }).addTo(layerGroup);
      pickupMarker.bindPopup(`
        <div style="font-family:sans-serif; padding:4px;">
          <strong style="color:#2563EB;">📍 Pickup Location</strong><br/>
          <span style="font-size:12px; color:#4B5563;">${pickupLocation?.address || 'Selected location'}</span>
        </div>
      `);
      bounds.push([pickupLat, pickupLng]);
    }

    // 2. Vendor Markers
    vendors.forEach(vendor => {
      const lat = vendor.latitude || vendor.location?.coordinates?.[1];
      const lng = vendor.longitude || vendor.location?.coordinates?.[0];
      if (!lat || !lng) return;

      const isSelected = selectedDestination && (selectedDestination._id === vendor._id || selectedDestination.name === vendor.name);
      const icon = createCustomIcon(isSelected ? '#059669' : '#10B981', '🏭');
      const marker = L.marker([lat, lng], { icon }).addTo(layerGroup);

      const navUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${pickupLat},${pickupLng};${lat},${lng}`;
      const popupHtml = `
        <div style="font-family:sans-serif; padding:4px; max-width:220px;">
          <strong style="color:#059669; font-size:14px;">🏭 ${vendor.name}</strong><br/>
          <div style="font-size:12px; color:#4B5563; margin-top:4px;">
            <span>📍 ${vendor.address || vendor.location || 'Location'}</span><br/>
            <span>🧵 ${(vendor.acceptedMaterials || []).join(', ') || 'All Materials'}</span><br/>
            <span>📦 Capacity: ${vendor.availableCapacityKg ?? vendor.capacityKg ?? 'N/A'} kg</span>
          </div>
          <div style="margin-top:8px;">
            <a href="${navUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block; background:#059669; color:white; padding:4px 8px; border-radius:4px; text-decoration:none; font-size:11px; font-weight:bold;">
              📍 Open OSM Directions
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        if (onSelectDestination) onSelectDestination(vendor);
      });

      bounds.push([lat, lng]);
    });

    // 3. Collection Point Markers
    collectionPoints.forEach(cp => {
      const lat = cp.latitude;
      const lng = cp.longitude;
      if (!lat || !lng) return;

      const icon = createCustomIcon('#8B5CF6', '📦');
      const marker = L.marker([lat, lng], { icon }).addTo(layerGroup);

      const navUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${pickupLat},${pickupLng};${lat},${lng}`;
      const popupHtml = `
        <div style="font-family:sans-serif; padding:4px; max-width:220px;">
          <strong style="color:#8B5CF6; font-size:14px;">📦 ${cp.name}</strong><br/>
          <div style="font-size:12px; color:#4B5563; margin-top:4px;">
            <span>📍 ${cp.address || 'Collection Hub'}</span><br/>
            <span>🧵 ${(cp.acceptedMaterials || []).join(', ') || 'All Textiles'}</span>
          </div>
          <div style="margin-top:8px;">
            <a href="${navUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block; background:#8B5CF6; color:white; padding:4px 8px; border-radius:4px; text-decoration:none; font-size:11px; font-weight:bold;">
              📍 Open OSM Directions
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        if (onSelectDestination) onSelectDestination(cp);
      });

      bounds.push([lat, lng]);
    });

    // 4. Calculate Driving Route using Open Source Routing Machine (OSRM)
    if (selectedDestination) {
      const destLat = selectedDestination.latitude || selectedDestination.location?.coordinates?.[1];
      const destLng = selectedDestination.longitude || selectedDestination.location?.coordinates?.[0];

      if (destLat && destLng) {
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${destLng},${destLat}?overview=full&geometries=geojson`;

        fetch(osrmUrl)
          .then(res => res.json())
          .then(data => {
            if (data.routes && data.routes[0]) {
              const route = data.routes[0];
              const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

              const polyline = L.polyline(coordinates, {
                color: '#059669',
                weight: 5,
                opacity: 0.85,
                lineJoin: 'round'
              }).addTo(map);

              polylineRef.current = polyline;

              const distKm = (route.distance / 1000).toFixed(1);
              const durationMins = Math.round(route.duration / 60);

              setRouteInfo({
                distance: `${distKm} km`,
                duration: `${durationMins} mins`
              });

              map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
            }
          })
          .catch(err => {
            console.warn('OSRM routing fetch failed:', err);
            // Straight line polyline fallback
            const polyline = L.polyline([[pickupLat, pickupLng], [destLat, destLng]], {
              color: '#059669',
              weight: 4,
              dashArray: '8, 8',
              opacity: 0.8
            }).addTo(map);

            polylineRef.current = polyline;
            setRouteInfo({
              distance: `${selectedDestination.distance || 'Regional'}`,
              duration: 'Est. Driving'
            });
          });
      }
    } else {
      setRouteInfo(null);
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [30, 30] });
      }
    }
  }, [isLeafletReady, pickupLat, pickupLng, vendors, collectionPoints, selectedDestination]);

  // Construct OpenStreetMap Directions Link
  const getOsmDirectionsUrl = () => {
    if (!selectedDestination) return null;
    const destLat = selectedDestination.latitude || selectedDestination.location?.coordinates?.[1];
    const destLng = selectedDestination.longitude || selectedDestination.location?.coordinates?.[0];
    if (destLat && destLng) {
      return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${pickupLat},${pickupLng};${destLat},${destLng}`;
    }
    return `https://www.openstreetmap.org/search?query=${encodeURIComponent(selectedDestination.address || selectedDestination.name || '')}`;
  };

  const navUrl = getOsmDirectionsUrl();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%' }}>
      {/* Map Container */}
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height, 
          borderRadius: 'var(--radius-lg)', 
          overflow: 'hidden', 
          border: '1px solid var(--color-border)', 
          backgroundColor: '#e5e7eb' 
        }}
      >
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />
      </div>

      {/* Route Info & External Navigate Bar */}
      {selectedDestination && (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ padding: '8px', backgroundColor: '#10B981', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Navigation size={18} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: '#065F46' }}>
                OpenStreetMap Route to {selectedDestination.name || 'Selected Destination'}
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: '#047857', display: 'flex', gap: 'var(--space-3)', marginTop: '2px' }}>
                <span><strong>OSRM Driving Distance:</strong> {routeInfo?.distance || 'Calculating...'}</span>
                <span>•</span>
                <span><strong>Est. ETA:</strong> {routeInfo?.duration || 'Calculating...'}</span>
              </div>
            </div>
          </div>

          {navUrl && (
            <a
              href={navUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--font-size-sm)' }}
            >
              <ExternalLink size={16} />
              <span>Navigate in OpenStreetMap</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
