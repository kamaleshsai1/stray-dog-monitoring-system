import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  ShieldCheck, 
  Activity, 
  MapPin, 
  Layers, 
  Filter, 
  Info,
  Radio,
  Map as MapIcon,
  Globe
} from 'lucide-react';

export default function LiveMap({ dogs, telemetry, onSelectDog }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const tileLayerRef = useRef(null);
  
  const [mapMode, setMapMode] = useState('osm');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [activeDogInfo, setActiveDogInfo] = useState(null);

  // Exact real center between Main Building and the two Hostel Boxes
  const defaultCenter = [13.28830, 77.59710];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet Map
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 18,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Real Authentic OpenStreetMap Tiles
      const osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      tileLayerRef.current = osmLayer;

      // Real GITAM Bengaluru Campus Geofencing Sectors
      const zonesData = [
        {
          name: 'North Block (NBH Hostel - Top Box)',
          color: '#f59e0b',
          coords: [
            [13.28849, 77.59828],
            [13.28893, 77.59830],
            [13.28891, 77.59874],
            [13.28848, 77.59872]
          ]
        },
        {
          name: 'South Block (SBH Hostel - Bottom Box)',
          color: '#10b981',
          coords: [
            [13.28783, 77.59825],
            [13.28827, 77.59827],
            [13.28825, 77.59871],
            [13.28782, 77.59869]
          ]
        },
        {
          name: 'Central Lawn (SBH-NBH Connecting Lawn)',
          color: '#8b5cf6',
          coords: [
            [13.28775, 77.59720],
            [13.28895, 77.59720],
            [13.28895, 77.59818],
            [13.28775, 77.59818]
          ]
        },
        {
          name: 'GITAM University Main Academic Building',
          color: '#06b6d4',
          coords: [
            [13.28660, 77.59460],
            [13.28795, 77.59460],
            [13.28795, 77.59620],
            [13.28660, 77.59620]
          ]
        },
        {
          name: 'Staff Quarters & Faculty Housing',
          color: '#ec4899',
          coords: [
            [13.28820, 77.59600],
            [13.28915, 77.59600],
            [13.28915, 77.59690],
            [13.28820, 77.59690]
          ]
        }
      ];

      zonesData.forEach(z => {
        const polygon = L.polygon(z.coords, {
          color: z.color,
          fillColor: z.color,
          fillOpacity: 0.22,
          weight: 2,
          dashArray: '4, 4'
        }).addTo(map);

        polygon.bindTooltip(`<strong>${z.name}</strong><br><span style="font-size:11px">Designated Campus Zone</span>`, {
          sticky: true
        });
      });

      mapInstanceRef.current = map;
    }
  }, []);

  // Handle Layer Toggle (Real OSM vs Real Satellite)
  const toggleMapLayer = (mode) => {
    setMapMode(mode);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    if (mode === 'satellite') {
      tileLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri World Imagery',
        maxZoom: 19
      }).addTo(map);
    } else {
      tileLayerRef.current = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);
    }
  };

  // Update Dog Markers dynamically as telemetry arrives
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const currentTelemetry = telemetry.length > 0 ? telemetry : dogs.map(d => ({
      id: d.id,
      code: d.code,
      name: d.name,
      zone: d.zone,
      currentLat: d.latitude,
      currentLng: d.longitude,
      activity: 'Resting',
      healthStatus: d.healthStatus,
      vaccinationStatus: d.vaccinationStatus,
      sterilizationStatus: d.sterilizationStatus
    }));

    // Filter telemetry
    const filtered = currentTelemetry.filter(d => {
      if (selectedZone !== 'ALL' && d.zone !== selectedZone) return false;
      if (filterStatus === 'ALERT' && !d.healthStatus.toLowerCase().includes('minor') && !d.healthStatus.toLowerCase().includes('allergy')) return false;
      if (filterStatus === 'UNSTERILIZED' && d.sterilizationStatus.toLowerCase().includes('sterilized')) return false;
      return true;
    });

    // Remove old markers not in filtered list
    Object.keys(markersRef.current).forEach(id => {
      if (!filtered.some(f => f.id === id)) {
        map.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    });

    filtered.forEach(item => {
      const dogData = dogs.find(d => d.id === item.id) || item;
      const isHealthy = !item.healthStatus.toLowerCase().includes('minor') && !item.healthStatus.toLowerCase().includes('allergy');
      const isSterilized = item.sterilizationStatus.toLowerCase().includes('sterilized');
      
      const glowColor = !isHealthy ? '#f43f5e' : (!isSterilized ? '#f59e0b' : '#10b981');

      const customHtml = `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div style="position: absolute; inset: 0; border-radius: 50%; background: ${glowColor}; opacity: 0.28; animation: pulseGlow 1.8s infinite;"></div>
          <div style="position: relative; width: 34px; height: 34px; border-radius: 50%; border: 2px solid ${glowColor}; overflow: hidden; background: #0f172a; box-shadow: 0 0 14px ${glowColor};">
            <img src="${dogData.imageUrl || '/dogs/d1.jpg'}" style="width: 100%; height: 100%; object-fit: cover;" alt="${item.name}" />
          </div>
          <span style="position: absolute; bottom: -4px; right: -2px; background: #0f172a; color: white; border: 1px solid ${glowColor}; font-size: 9px; font-weight: 800; padding: 1px 4px; border-radius: 6px; font-family: monospace;">
            ${item.code}
          </span>
        </div>
      `;

      const icon = L.divIcon({
        html: customHtml,
        className: 'dog-marker-icon',
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      if (markersRef.current[item.id]) {
        markersRef.current[item.id].setLatLng([item.currentLat, item.currentLng]);
      } else {
        const marker = L.marker([item.currentLat, item.currentLng], { icon }).addTo(map);
        
        marker.on('click', () => {
          setActiveDogInfo(dogData);
        });

        markersRef.current[item.id] = marker;
      }
    });
  }, [telemetry, dogs, selectedZone, filterStatus]);

  const recenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(defaultCenter, 18, { animate: true });
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', height: 'calc(100vh - 165px)', minHeight: '620px', position: 'relative' }}>
      
      {/* Map Main Canvas */}
      <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        
        {/* Floating Controls Bar */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 400, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          
          {/* Sector Selector */}
          <div className="glass-panel" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.92)' }}>
            <Filter size={14} color="var(--emerald-400)" />
            <select 
              value={selectedZone} 
              onChange={e => setSelectedZone(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '0.82rem', outline: 'none', cursor: 'pointer' }}
            >
              <option value="ALL" style={{ background: '#0f172a' }}>All Campus Sectors</option>
              <option value="NBH" style={{ background: '#0f172a' }}>North Block (NBH - Top Box)</option>
              <option value="SBH" style={{ background: '#0f172a' }}>South Block (SBH - Bottom Box)</option>
              <option value="CENTRAL-LAWN" style={{ background: '#0f172a' }}>Central Lawn (SBH-NBH Lawn)</option>
              <option value="GITAM-MAIN" style={{ background: '#0f172a' }}>GITAM University Main Academic Building</option>
              <option value="STAFF" style={{ background: '#0f172a' }}>Staff Quarters & Faculty Housing</option>
            </select>
          </div>

          {/* Filter Pills */}
          <div className="glass-panel" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.92)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Filter:</span>
            <button 
              onClick={() => setFilterStatus('ALL')}
              style={{ background: filterStatus === 'ALL' ? 'var(--emerald-500)' : 'transparent', color: filterStatus === 'ALL' ? 'white' : 'var(--text-dim)', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              All
            </button>
            <button 
              onClick={() => setFilterStatus('UNSTERILIZED')}
              style={{ background: filterStatus === 'UNSTERILIZED' ? 'var(--amber-500)' : 'transparent', color: filterStatus === 'UNSTERILIZED' ? 'white' : 'var(--text-dim)', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              Unsterilized
            </button>
            <button 
              onClick={() => setFilterStatus('ALERT')}
              style={{ background: filterStatus === 'ALERT' ? 'var(--rose-500)' : 'transparent', color: filterStatus === 'ALERT' ? 'white' : 'var(--text-dim)', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              Medical Alert
            </button>
          </div>

          {/* Real Map Layer Switcher */}
          <div className="glass-panel" style={{ padding: '4px', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(15, 23, 42, 0.92)' }}>
            <button 
              onClick={() => toggleMapLayer('osm')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                background: mapMode === 'osm' ? 'var(--emerald-500)' : 'transparent',
                color: mapMode === 'osm' ? 'white' : 'var(--text-dim)',
                fontSize: '0.76rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <MapIcon size={13} />
              <span>Street Map</span>
            </button>

            <button 
              onClick={() => toggleMapLayer('satellite')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                background: mapMode === 'satellite' ? 'var(--cyan-500)' : 'transparent',
                color: mapMode === 'satellite' ? 'white' : 'var(--text-dim)',
                fontSize: '0.76rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Globe size={13} />
              <span>Real Satellite</span>
            </button>
          </div>

          <button 
            className="btn btn-secondary"
            onClick={recenter}
            style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'rgba(15, 23, 42, 0.92)' }}
          >
            <Navigation size={14} color="var(--cyan-400)" />
            <span>Recenter Blocks</span>
          </button>
        </div>

        {/* Live Tracking Status Pill */}
        <div style={{ position: 'absolute', bottom: '16px', left: '16px', zIndex: 400 }}>
          <div className="glass-panel" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(15, 23, 42, 0.94)' }}>
            <Radio size={16} color="var(--emerald-400)" className="animate-pulse" />
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'white' }}>
                IoT Satellite GPS Telemetry Active
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                North Block (Top Box) & South Block (Bottom Box) Tracked Live
              </div>
            </div>
          </div>
        </div>

        {/* Leaflet Map DOM Element */}
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />
      </div>

      {/* Right Telemetry & Dog Inspector Panel */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'white' }}>Live Collar Telemetry</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Instant GPS Location & Activity</p>
          </div>
          <span className="badge badge-emerald">Online</span>
        </div>

        {/* Selected Dog Detail Card */}
        {activeDogInfo ? (
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(16, 185, 129, 0.06)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
              <img 
                src={activeDogInfo.imageUrl} 
                alt={activeDogInfo.name} 
                style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', border: '2px solid var(--emerald-400)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'white' }}>{activeDogInfo.name}</h4>
                  <span className="badge badge-cyan">{activeDogInfo.code}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{activeDogInfo.breed} ? {activeDogInfo.age}</p>
                <span className="badge badge-emerald" style={{ marginTop: '4px' }}>
                  {activeDogInfo.zone}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem', marginBottom: '12px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '6px 10px', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-dark)', display: 'block', fontSize: '0.68rem' }}>VACCINATION</span>
                <strong style={{ color: 'var(--emerald-400)' }}>{activeDogInfo.vaccinationStatus}</strong>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '6px 10px', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-dark)', display: 'block', fontSize: '0.68rem' }}>STERILIZATION</span>
                <strong style={{ color: activeDogInfo.sterilizationStatus.includes('Sterilized') ? 'var(--emerald-400)' : 'var(--amber-400)' }}>
                  {activeDogInfo.sterilizationStatus.includes('Sterilized') ? 'Sterilized' : 'Pending ABC'}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-primary"
                onClick={() => onSelectDog(activeDogInfo)}
                style={{ flex: 1, fontSize: '0.78rem', padding: '6px 10px' }}
              >
                Inspect Medical Card
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setActiveDogInfo(null)}
                style={{ fontSize: '0.78rem', padding: '6px 10px' }}
              >
                Clear
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '14px 20px', background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={16} color="var(--cyan-400)" />
            <span>Click any map marker to view detailed telemetry and vaccine ledger.</span>
          </div>
        )}

        {/* Live Telemetry List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(telemetry.length > 0 ? telemetry : dogs).map(item => {
              const dog = dogs.find(d => d.id === item.id) || item;
              const isSelected = activeDogInfo?.id === item.id;
              
              return (
                <div 
                  key={item.id}
                  onClick={() => {
                    setActiveDogInfo(dog);
                    if (mapInstanceRef.current && item.currentLat) {
                      mapInstanceRef.current.panTo([item.currentLat, item.currentLng]);
                    }
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1px solid var(--emerald-500)' : '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={dog.imageUrl || '/dogs/d1.jpg'} 
                        alt={item.name} 
                        style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <span style={{ position: 'absolute', bottom: -2, right: -2, background: '#0f172a', color: 'var(--cyan-400)', fontSize: '8px', fontWeight: 'bold', padding: '0 2px', borderRadius: '3px', border: '1px solid var(--cyan-400)' }}>
                        {item.code}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: '600', color: 'white' }}>{item.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{dog.locationName || item.zone}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                    <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      GPS Active
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--cyan-400)', fontWeight: '500' }}>
                      {item.activity?.includes('Roaming') ? 'Roaming' : 'Resting'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
