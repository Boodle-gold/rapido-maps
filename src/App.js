import React, { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import './App.css';

function CityDropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="custom-dropdown-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value} <span className="custom-dropdown-arrow">▼</span>
      </button>
      {open && (
        <ul className="custom-dropdown-list" role="listbox">
          {options.map((option) => (
            <li
              key={option}
              className={`custom-dropdown-option${option === value ? ' selected' : ''}`}
              role="option"
              aria-selected={option === value}
              tabIndex={0}
              onClick={() => { onChange(option); setOpen(false); }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onChange(option); setOpen(false);
                }
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TrafficButton({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`traffic-btn${checked ? ' on' : ''}`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
    >
      Show Traffic
    </button>
  );
}

function HamburgerMenu({ currentView, setView }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="hamburger-menu-container">
      <button className="hamburger-btn" onClick={() => setOpen(o => !o)} aria-label="Open menu">
        <span className="hamburger-icon">☰</span>
      </button>
      {open && (
        <div className="hamburger-dropdown">
          <div
            className={`hamburger-item${currentView === 'directions' ? ' selected' : ''}`}
            onClick={() => { setView('directions'); setOpen(false); }}
          >
            Directions
          </div>
          <div
            className={`hamburger-item${currentView === 'stats' ? ' selected' : ''}`}
            onClick={() => { setView('stats'); setOpen(false); }}
          >
            Directions Stats
          </div>
        </div>
      )}
    </div>
  );
}

function TierSummaryBox({ results }) {
  // Group by tier
  const grouped = {};
  results.forEach(r => {
    if (!grouped[r.tier]) grouped[r.tier] = [];
    grouped[r.tier].push(r);
  });
  // Compute averages for each tier using the correct fields
  const summary = ['Tier I','Tier II','Tier III'].map(tier => {
    const arr = grouped[tier] || [];
    if (!arr.length) return {tier, distance:'-', complex:'-', reference:'-', total:'-'};
    let sumDist=0, sumComp=0, sumRef=0, sumTot=0;
    arr.forEach(r => {
      sumDist += +r.avgDistance;
      sumComp += +r.avgComplex;
      sumRef += +r.avgReference;
      sumTot += +r.avgTotal;
    });
    return {
      tier,
      distance: (sumDist/arr.length).toFixed(2),
      complex: (sumComp/arr.length).toFixed(1),
      reference: (sumRef/arr.length).toFixed(1),
      total: (sumTot/arr.length).toFixed(1)
    };
  });
  return (
    <div style={{display:'flex', gap:32, margin:'24px 0', justifyContent:'center'}}>
      {summary.map(s => (
        <div key={s.tier} style={{background:'#111', border:'2px solid #fff', padding:'16px 32px', minWidth:180, color:'#fff', fontFamily:'monospace', fontSize:18, fontWeight:'bold', textAlign:'center'}}>
          <div style={{fontSize:22, marginBottom:8, color:'#ffff00'}}>{s.tier}</div>
          <div>Avg Distance: <span style={{color:'#ffff00'}}>{s.distance}</span> km</div>
          <div>Complex Steps: <span style={{color:'#ffff00'}}>{s.complex}</span></div>
          <div>Reference Steps: <span style={{color:'#ffff00'}}>{s.reference}</span></div>
          <div>Average Total Steps per City: <span style={{color:'#ffff00'}}>{s.total}</span></div>
        </div>
      ))}
    </div>
  );
}

function App() {
  const cityBounds = {
    // Tier I
    Bengaluru:   { minLat: 12.83, maxLat: 13.13, minLon: 77.45, maxLon: 77.75, tier: 'Tier I' },
    Delhi:       { minLat: 28.40, maxLat: 28.88, minLon: 76.84, maxLon: 77.35, tier: 'Tier I' },
    Chennai:     { minLat: 12.80, maxLat: 13.20, minLon: 80.10, maxLon: 80.30, tier: 'Tier I' },
    Hyderabad:   { minLat: 17.20, maxLat: 17.60, minLon: 78.30, maxLon: 78.60, tier: 'Tier I' },
    Mumbai:      { minLat: 18.89, maxLat: 19.35, minLon: 72.77, maxLon: 72.99, tier: 'Tier I' },
    Pune:        { minLat: 18.45, maxLat: 18.65, minLon: 73.75, maxLon: 73.95, tier: 'Tier I' },
    Kolkata:     { minLat: 22.45, maxLat: 22.70, minLon: 88.25, maxLon: 88.50, tier: 'Tier I' },
    Ahmedabad:   { minLat: 23.00, maxLat: 23.10, minLon: 72.50, maxLon: 72.70, tier: 'Tier I' },
    // Tier II
    Amritsar:    { minLat: 31.60, maxLat: 31.70, minLon: 74.80, maxLon: 74.95, tier: 'Tier II' },
    Bhopal:      { minLat: 23.20, maxLat: 23.35, minLon: 77.30, maxLon: 77.50, tier: 'Tier II' },
    Bhubaneswar: { minLat: 20.20, maxLat: 20.40, minLon: 85.75, maxLon: 85.90, tier: 'Tier II' },
    Chandigarh:  { minLat: 30.65, maxLat: 30.80, minLon: 76.70, maxLon: 76.90, tier: 'Tier II' },
    Faridabad:   { minLat: 28.35, maxLat: 28.50, minLon: 77.25, maxLon: 77.40, tier: 'Tier II' },
    Ghaziabad:   { minLat: 28.60, maxLat: 28.75, minLon: 77.35, maxLon: 77.55, tier: 'Tier II' },
    Jamshedpur:  { minLat: 22.75, maxLat: 22.85, minLon: 86.10, maxLon: 86.25, tier: 'Tier II' },
    Jaipur:      { minLat: 26.80, maxLat: 26.95, minLon: 75.75, maxLon: 75.95, tier: 'Tier II' },
    Kochi:       { minLat: 9.90, maxLat: 10.10, minLon: 76.20, maxLon: 76.35, tier: 'Tier II' },
    Lucknow:     { minLat: 26.75, maxLat: 27.00, minLon: 80.85, maxLon: 81.05, tier: 'Tier II' },
    Nagpur:      { minLat: 21.05, maxLat: 21.20, minLon: 79.00, maxLon: 79.20, tier: 'Tier II' },
    Patna:       { minLat: 25.55, maxLat: 25.65, minLon: 85.00, maxLon: 85.25, tier: 'Tier II' },
    Raipur:      { minLat: 21.20, maxLat: 21.30, minLon: 81.60, maxLon: 81.75, tier: 'Tier II' },
    Surat:       { minLat: 21.10, maxLat: 21.25, minLon: 72.75, maxLon: 72.95, tier: 'Tier II' },
    Visakhapatnam: { minLat: 17.65, maxLat: 17.80, minLon: 83.15, maxLon: 83.30, tier: 'Tier II' },
    Agra:        { minLat: 27.10, maxLat: 27.25, minLon: 77.85, maxLon: 78.05, tier: 'Tier II' },
    Ajmer:       { minLat: 26.40, maxLat: 26.50, minLon: 74.60, maxLon: 74.75, tier: 'Tier II' },
    Kanpur:      { minLat: 26.40, maxLat: 26.55, minLon: 80.25, maxLon: 80.45, tier: 'Tier II' },
    Mysuru:      { minLat: 12.20, maxLat: 12.40, minLon: 76.55, maxLon: 76.75, tier: 'Tier II' },
    Srinagar:    { minLat: 34.00, maxLat: 34.15, minLon: 74.75, maxLon: 74.90, tier: 'Tier II' },
    // Tier III
    Banswara:    { minLat: 23.50, maxLat: 23.60, minLon: 74.40, maxLon: 74.55, tier: 'Tier III' },
    Bhadreswar:  { minLat: 22.80, maxLat: 22.90, minLon: 88.30, maxLon: 88.40, tier: 'Tier III' },
    Chilakaluripet: { minLat: 16.05, maxLat: 16.15, minLon: 80.05, maxLon: 80.15, tier: 'Tier III' },
    Datia:       { minLat: 25.65, maxLat: 25.75, minLon: 78.40, maxLon: 78.55, tier: 'Tier III' },
    Gangtok:     { minLat: 27.30, maxLat: 27.35, minLon: 88.60, maxLon: 88.65, tier: 'Tier III' },
    Kalyani:     { minLat: 22.98, maxLat: 23.02, minLon: 88.42, maxLon: 88.46, tier: 'Tier III' },
    Kapurthala:  { minLat: 31.35, maxLat: 31.40, minLon: 75.35, maxLon: 75.40, tier: 'Tier III' },
    Kasganj:     { minLat: 27.78, maxLat: 27.82, minLon: 78.63, maxLon: 78.67, tier: 'Tier III' },
    Nagda:       { minLat: 23.43, maxLat: 23.47, minLon: 75.38, maxLon: 75.42, tier: 'Tier III' },
    Sujangarh:   { minLat: 27.68, maxLat: 27.72, minLon: 74.45, maxLon: 74.49, tier: 'Tier III' },
  };

  const tiers = ['Tier I', 'Tier II', 'Tier III'];

  const [selectedTier, setSelectedTier] = useState('Tier I');
  const [selectedCity, setSelectedCity] = useState('Bangalore');
  const [startLat, setStartLat] = useState('12.9716');
  const [startLon, setStartLon] = useState('77.5946');
  const [endLat, setEndLat] = useState('12.9789');
  const [endLon, setEndLon] = useState('77.5917');
  const [directions, setDirections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [google, setGoogle] = useState(null);
  const [trafficOn, setTrafficOn] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const trafficLayerRef = useRef(null);
  const [view, setView] = useState('directions');
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsResults, setStatsResults] = useState([]);

  // Filter cities by selected tier
  const filteredCities = Object.keys(cityBounds).filter(
    city => cityBounds[city].tier === selectedTier
  );

  // If selectedCity is not in filteredCities, auto-select the first
  useEffect(() => {
    if (!filteredCities.includes(selectedCity)) {
      setSelectedCity(filteredCities[0]);
    }
    // eslint-disable-next-line
  }, [selectedTier]);

  useEffect(() => {
    if (view !== 'directions') return;
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places']
      });
      try {
        const googleInstance = await loader.load();
        setGoogle(googleInstance);
        const map = new googleInstance.maps.Map(mapRef.current, {
          center: { lat: 12.9716, lng: 77.5946 },
          zoom: 12,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
            { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
            { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
            { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
            { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
            { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
            { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
            { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
            { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
            { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
          ],
        });
        mapInstanceRef.current = map;
        trafficLayerRef.current = new googleInstance.maps.TrafficLayer();
        if (trafficOn) {
          trafficLayerRef.current.setMap(map);
        }
        directionsRendererRef.current = new googleInstance.maps.DirectionsRenderer({
          map: map,
          suppressMarkers: false
        });
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setError('Failed to load Google Maps. Please check your API key.');
      }
    };
    if (process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
      initMap();
    } else {
      setError('Google Maps API key not found. Please set REACT_APP_GOOGLE_MAPS_API_KEY in your environment variables.');
    }
    // eslint-disable-next-line
  }, [view]);

  // Effect to toggle traffic layer on/off
  useEffect(() => {
    if (google && mapInstanceRef.current && trafficLayerRef.current) {
      if (trafficOn) {
        trafficLayerRef.current.setMap(mapInstanceRef.current);
      } else {
        trafficLayerRef.current.setMap(null);
      }
    }
  }, [trafficOn, google]);

  // Add a useEffect to recenter the map when selectedCity changes and view is 'directions'
  useEffect(() => {
    if (view !== 'directions') return;
    if (!mapInstanceRef.current) return;
    const bounds = getCityBounds(selectedCity);
    const centerLat = ((bounds.minLat + bounds.maxLat) / 2).toFixed(4);
    const centerLon = ((bounds.minLon + bounds.maxLon) / 2).toFixed(4);
    const zoom = bounds.tier === 'Tier III' ? 14 : 12;
    mapInstanceRef.current.setCenter({ lat: parseFloat(centerLat), lng: parseFloat(centerLon) });
    mapInstanceRef.current.setZoom(zoom);
  }, [selectedCity, view]);

  const getDirections = async () => {
    if (!startLat || !startLon || !endLat || !endLon) {
      setError('Please enter both start and end coordinates.');
      return;
    }

    if (!google) {
      setError('Google Maps is still loading. Please try again in a moment.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const requestBody = {
        origin: {
          location: {
            latLng: {
              latitude: parseFloat(startLat),
              longitude: parseFloat(startLon)
            }
          }
        },
        destination: {
          location: {
            latLng: {
              latitude: parseFloat(endLat),
              longitude: parseFloat(endLon)
            }
          }
        },
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE',
        computeAlternativeRoutes: false,
        routeModifiers: {
          avoidTolls: false,
          avoidHighways: false
        },
        languageCode: 'en-US',
        units: 'METRIC'
      };

      const response = await fetch(
        `https://routes.googleapis.com/directions/v2:computeRoutes?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.legs.steps,routes.legs.staticDuration,routes.legs.polyline,routes.polyline.encodedPolyline'
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get directions');
      }

      const result = await response.json();
      
      if (result.routes && result.routes.length > 0) {
        // Convert Routes API response to Directions API format for the renderer
        const directionsResult = {
          routes: [{
            legs: [{
              steps: result.routes[0].legs[0].steps.map(step => ({
                instructions: step.navigationInstruction?.instructions || 'Continue on road',
                distance: { text: `${(step.distanceMeters / 1000).toFixed(1)} km` },
                duration: { text: `${Math.round(parseInt(step.staticDuration, 10) / 60)} min` }
              })),
              distance: { text: `${(result.routes[0].distanceMeters / 1000).toFixed(1)} km` },
              duration: { text: `${Math.round(parseInt(result.routes[0].duration, 10) / 60)} min` }
            }],
            overview_polyline: {
              points: result.routes[0].polyline.encodedPolyline
            }
          }]
        };

        // Create a custom directions renderer for the Routes API response
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = directionsRendererRef.current;
        
        // Use the original request format for rendering
        const renderRequest = {
          origin: { lat: parseFloat(startLat), lng: parseFloat(startLon) },
          destination: { lat: parseFloat(endLat), lng: parseFloat(endLon) },
          travelMode: 'DRIVING'
        };

        try {
          const renderResult = await directionsService.route(renderRequest);
          directionsRenderer.setDirections(renderResult);
          setDirections(directionsResult);
        } catch (renderError) {
          // If Directions API fails, just show the route data without map rendering
          setDirections(directionsResult);
          setError('Route calculated successfully, but map rendering failed. Please enable Directions API for full functionality.');
        }
      } else {
        throw new Error('No routes found');
      }
    } catch (error) {
      console.error('Error getting directions:', error);
      setError(`Failed to get directions: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get (possibly shrunken) bounds for randomization/clear
  function getCityBounds(city) {
    const bounds = cityBounds[city];
    if (bounds.tier === 'Tier III') {
      // Shrink bounding box by 30% centered
      const latCenter = (bounds.minLat + bounds.maxLat) / 2;
      const lonCenter = (bounds.minLon + bounds.maxLon) / 2;
      const latHalf = (bounds.maxLat - bounds.minLat) * 0.35;
      const lonHalf = (bounds.maxLon - bounds.minLon) * 0.35;
      return {
        minLat: latCenter - latHalf,
        maxLat: latCenter + latHalf,
        minLon: lonCenter - lonHalf,
        maxLon: lonCenter + lonHalf,
        tier: bounds.tier
      };
    }
    return bounds;
  }

  const randomizeCoordinates = () => {
    const bounds = getCityBounds(selectedCity);
    const { minLat, maxLat, minLon, maxLon } = bounds;
    const randomLat1 = (Math.random() * (maxLat - minLat) + minLat).toFixed(4);
    const randomLon1 = (Math.random() * (maxLon - minLon) + minLon).toFixed(4);
    const randomLat2 = (Math.random() * (maxLat - minLat) + minLat).toFixed(4);
    const randomLon2 = (Math.random() * (maxLon - minLon) + minLon).toFixed(4);
    setStartLat(randomLat1);
    setStartLon(randomLon1);
    setEndLat(randomLat2);
    setEndLon(randomLon2);
    // Clear route and error, but do not reset fields
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setDirections({ routes: [] });
    }
    setDirections(null);
    setError('');
  };

  const clearDirections = () => {
    // Set lat/lon fields to empty
    setStartLat("");
    setStartLon("");
    setEndLat("");
    setEndLon("");
    // Recenter map with zoom depending on tier
    const bounds = getCityBounds(selectedCity);
    const centerLat = ((bounds.minLat + bounds.maxLat) / 2).toFixed(4);
    const centerLon = ((bounds.minLon + bounds.maxLon) / 2).toFixed(4);
    if (mapInstanceRef.current) {
      const zoom = bounds.tier === 'Tier III' ? 14 : 12;
      mapInstanceRef.current.setCenter({ lat: parseFloat(centerLat), lng: parseFloat(centerLon) });
      mapInstanceRef.current.setZoom(zoom);
    }
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setDirections({ routes: [] });
    }
    setDirections(null);
    setError('');
  };

  // Helper to count complex steps
  function countComplexSteps(steps) {
    if (!steps) return 0;
    // Define simple instructions (case-insensitive, trimmed)
    const simplePatterns = [
      /^turn left$/i,
      /^turn right$/i,
      /^go left$/i,
      /^go right$/i,
      /^go straight$/i,
      /^continue straight$/i,
      /^head (north|south|east|west|northwest|northeast|southwest|southeast)$/i,
      /^go (north|south|east|west|northwest|northeast|southwest|southeast)$/i,
      /^continue (north|south|east|west|northwest|northeast|southwest|southeast)$/i,
      /^slight left$/i,
      /^slight right$/i,
      /^make a u-turn$/i,
      /^u-turn$/i
    ];
    return steps.filter(step => {
      const instr = (step.instructions || '').trim();
      return instr && !simplePatterns.some(pat => pat.test(instr));
    }).length;
  }

  // Helper to count reference steps (instructions containing 'by' or 'toward')
  function countReferenceSteps(steps) {
    if (!steps) return 0;
    return steps.filter(step => {
      const instr = (step.instructions || '').toLowerCase();
      return instr.includes(' by ') || instr.includes(' toward ') || instr.includes(' at ');
    }).length;
  }

  // Helper to run a single experiment for a city
  async function runSingleTrial(city) {
    const bounds = getCityBounds(city);
    const { minLat, maxLat, minLon, maxLon } = bounds;
    const randomLat1 = (Math.random() * (maxLat - minLat) + minLat).toFixed(4);
    const randomLon1 = (Math.random() * (maxLon - minLon) + minLon).toFixed(4);
    const randomLat2 = (Math.random() * (maxLat - minLat) + minLat).toFixed(4);
    const randomLon2 = (Math.random() * (maxLon - minLon) + minLon).toFixed(4);
    // Use the same API logic as getDirections
    const requestBody = {
      origin: { location: { latLng: { latitude: parseFloat(randomLat1), longitude: parseFloat(randomLon1) } } },
      destination: { location: { latLng: { latitude: parseFloat(randomLat2), longitude: parseFloat(randomLon2) } } },
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_AWARE',
      computeAlternativeRoutes: false,
      routeModifiers: { avoidTolls: false, avoidHighways: false },
      languageCode: 'en-US',
      units: 'METRIC'
    };
    try {
      const response = await fetch(
        `https://routes.googleapis.com/directions/v2:computeRoutes?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.legs.steps,routes.legs.staticDuration,routes.legs.polyline,routes.polyline.encodedPolyline'
          },
          body: JSON.stringify(requestBody)
        }
      );
      if (!response.ok) return null;
      const result = await response.json();
      if (!result.routes || !result.routes.length) return null;
      const steps = result.routes[0].legs[0].steps.map(step => ({
        instructions: step.navigationInstruction?.instructions || '',
        distance: { text: `${(step.distanceMeters / 1000).toFixed(1)} km` },
        duration: { text: `${Math.round(parseInt(step.staticDuration, 10) / 60)} min` }
      }));
      return {
        distance: result.routes[0].distanceMeters / 1000,
        complexSteps: countComplexSteps(steps),
        referenceSteps: countReferenceSteps(steps),
        totalSteps: steps.length
      };
    } catch {
      return null;
    }
  }

  // Run all trials for all cities/tiers
  async function runAllTrials() {
    setStatsLoading(true);
    setStatsResults([]);
    const results = [];
    for (const tier of tiers) {
      for (const city of Object.keys(cityBounds).filter(c => cityBounds[c].tier === tier)) {
        const cityResults = [];
        for (let i = 0; i < 10; ++i) {
          const trial = await runSingleTrial(city);
          if (trial) cityResults.push(trial);
        }
        if (cityResults.length) {
          // Remove outliers using IQR on distance
          const distances = cityResults.map(r => r.distance).sort((a, b) => a - b);
          const q1 = distances[Math.floor((distances.length - 1) * 0.25)];
          const q3 = distances[Math.floor((distances.length - 1) * 0.75)];
          const iqr = q3 - q1;
          const lower = q1 - 1.5 * iqr;
          const upper = q3 + 1.5 * iqr;
          const filtered = cityResults.filter(r => r.distance >= lower && r.distance <= upper);
          const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
          results.push({
            city,
            tier,
            avgDistance: filtered.length ? avg(filtered.map(r => r.distance)).toFixed(2) : '-',
            avgComplex: filtered.length ? avg(filtered.map(r => r.complexSteps)).toFixed(1) : '-',
            avgReference: filtered.length ? avg(filtered.map(r => r.referenceSteps)).toFixed(1) : '-',
            avgTotal: filtered.length ? avg(filtered.map(r => r.totalSteps)).toFixed(1) : '-',
            trials: filtered
          });
        }
      }
    }
    setStatsResults(results);
    setStatsLoading(false);
  }

  // Find average total steps for all cities
  const avgTotalSteps = statsResults.length ? (statsResults.reduce((acc, r) => acc + (+r.avgTotal), 0) / statsResults.length).toFixed(1) : '-';

  return (
    <div className="app">
      <HamburgerMenu currentView={view} setView={setView} />
      <div className="container">
        {view === 'directions' && (
          <header className="header">
            <h1 className="title">Directions</h1>
            <p className="subtitle">Using Routes API</p>
          </header>
        )}
        {view === 'directions' ? (
          <React.Fragment>
            <div className="input-section">
              <div className="dropdown-row">
                <div style={{ marginBottom: 0, marginRight: 24 }}>
                  <label htmlFor="tier-select" style={{ fontWeight: 700, color: '#f0f0f0', fontSize: '1rem', marginRight: 8 }}>
                    Tier:
                  </label>
                  <CityDropdown
                    options={tiers}
                    value={selectedTier}
                    onChange={setSelectedTier}
                  />
                </div>
                <div style={{ marginBottom: 0 }}>
                  <label htmlFor="city-select" style={{ fontWeight: 700, color: '#f0f0f0', fontSize: '1rem', marginRight: 8 }}>
                    City:
                  </label>
                  <CityDropdown
                    options={filteredCities}
                    value={selectedCity}
                    onChange={setSelectedCity}
                  />
                </div>
              </div>
              <div className="input-group">
                <h3>Start Point</h3>
                <div className="input-row">
                  <input
                    type="number"
                    placeholder="Latitude"
                    value={startLat}
                    onChange={(e) => setStartLat(e.target.value)}
                    className="input-field"
                    step="any"
                  />
                  <input
                    type="number"
                    placeholder="Longitude"
                    value={startLon}
                    onChange={(e) => setStartLon(e.target.value)}
                    className="input-field"
                    step="any"
                  />
                </div>
              </div>
              <div className="input-group">
                <h3>End Point</h3>
                <div className="input-row">
                  <input
                    type="number"
                    placeholder="Latitude"
                    value={endLat}
                    onChange={(e) => setEndLat(e.target.value)}
                    className="input-field"
                    step="any"
                  />
                  <input
                    type="number"
                    placeholder="Longitude"
                    value={endLon}
                    onChange={(e) => setEndLon(e.target.value)}
                    className="input-field"
                    step="any"
                  />
                </div>
              </div>
              <div className="button-group">
                <button
                  onClick={getDirections}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Getting Directions...' : 'Get Directions'}
                </button>
                <button
                  onClick={randomizeCoordinates}
                  className="btn btn-secondary"
                >
                  Randomize
                </button>
                <button
                  onClick={clearDirections}
                  className="btn btn-secondary"
                >
                  Clear
                </button>
              </div>
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </div>
            <div className="map-container">
              <div ref={mapRef} className="map" />
            </div>
            {directions && (
              <div className="directions-panel">
                <h3>Directions</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <TrafficButton checked={trafficOn} onChange={setTrafficOn} />
                </div>
                <div className="route-summary" style={{display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative'}}>
                  <div style={{display:'flex', gap:30}}>
                    <div className="summary-item">
                      <span className="summary-label">Distance:</span>
                      <span className="summary-value">{directions.routes[0].legs[0].distance.text}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Steps:</span>
                      <span className="summary-value">{directions.routes[0].legs[0].steps.length}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Complex Steps:</span>
                      <span className="summary-value">{countComplexSteps(directions.routes[0].legs[0].steps)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Reference Steps:</span>
                      <span className="summary-value">{countReferenceSteps(directions.routes[0].legs[0].steps)}</span>
                    </div>
                  </div>
                  <div style={{marginLeft:'auto', minWidth:120, textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <span className="summary-label" style={{color:'#f0f0f0', fontWeight:400, fontSize:'0.9rem', marginRight:0}}>Duration:</span>
                    <span className="summary-value" style={{fontWeight:700, fontSize:'1.2rem', color:'#fff'}}>{directions.routes[0].legs[0].duration.text}</span>
                  </div>
                </div>
                <div className="directions-content">
                  {directions.routes[0]?.legs[0]?.steps?.map((step, index) => (
                    <div key={index} className="direction-step">
                      <div className="step-number">{index + 1}</div>
                      <div className="step-instruction">
                        {step.instructions}
                        {step.distance && <span className="step-distance"> ({step.distance.text})</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#9ca5b3', fontFamily: 'monospace' }}>
              Created by Ben Goldston
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="stats-placeholder">
              <h2>Directions Stats</h2>
              <button className="btn btn-primary" onClick={runAllTrials} disabled={statsLoading} style={{marginBottom: 32}}>
                {statsLoading ? 'Running Trials...' : 'Run Trials'}
              </button>
              {statsLoading && <div style={{color:'#ffff00', fontWeight:700, marginBottom:16}}>Running random routes for all cities and tiers...</div>}
              {statsResults.length > 0 && (
                <div className="stats-table-container">
                  <TierSummaryBox results={statsResults} />
                  <table className="stats-table">
                    <thead>
                      <tr>
                        <th>Tier</th>
                        <th>City</th>
                        <th>Avg Distance (km)</th>
                        <th>Avg Complex Steps</th>
                        <th>Avg Reference Steps</th>
                        <th>Avg Total Steps</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statsResults.map(r => (
                        <tr key={r.city}>
                          <td>{r.tier}</td>
                          <td>{r.city}</td>
                          <td>{r.avgDistance}</td>
                          <td>{r.avgComplex}</td>
                          <td>{r.avgReference}</td>
                          <td>{r.avgTotal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default App; 