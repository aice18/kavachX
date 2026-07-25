import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// Specific points mapping to logs
const specificPoints = [
  { lat: 35.6892, lng: 139.6917, labelKey: 'attacker_ip', fallback: 'Attacker IP (High Risk)', type: 'critical' },
  { lat: 40.7128, lng: -74.0060, labelKey: 'corp_vpn', fallback: 'Corporate VPN', type: 'high' },
  { lat: 51.5074, lng: -0.1278, labelKey: 'finance_manager', fallback: 'Finance Manager', type: 'high' },
  { lat: 19.0760, lng: 72.8777, labelKey: 'db_export', fallback: 'Database (Export)', type: 'high' },
  { lat: 1.3521, lng: 103.8198, labelKey: 'beneficiaries', fallback: 'Beneficiaries', type: 'medium' },
  { lat: 28.6139, lng: 77.2090, labelKey: 'rtgs_system', fallback: 'RTGS System', type: 'critical' },
  { lat: 25.2048, lng: 55.2708, labelKey: 'mule_a', fallback: 'Mule A', type: 'high' },
  { lat: -33.8688, lng: 151.2093, labelKey: 'mule_b', fallback: 'Mule B', type: 'high' },
];

const N = 20;
const randomArcsData = [...Array(N).keys()].map(() => ({
  startLat: (Math.random() - 0.5) * 180,
  startLng: (Math.random() - 0.5) * 360,
  endLat: (Math.random() - 0.5) * 180,
  endLng: (Math.random() - 0.5) * 360,
  color: [['#ff0000', '#ff4b4b', '#ff4b4b', '#00ff00'][Math.floor(Math.random() * 4)], ['#ff0000', '#ff4b4b', '#ff4b4b', '#00ff00'][Math.floor(Math.random() * 4)]]
}));

// Links between specific points
const specificArcs = [
  { source: 0, target: 1 },
  { source: 1, target: 2 },
  { source: 2, target: 3 },
  { source: 2, target: 4 },
  { source: 2, target: 5 },
  { source: 5, target: 6 },
  { source: 5, target: 7 },
].map(link => ({
  startLat: specificPoints[link.source].lat,
  startLng: specificPoints[link.source].lng,
  endLat: specificPoints[link.target].lat,
  endLng: specificPoints[link.target].lng,
  color: ['#ef4444', '#f59e0b']
}));

const arcsData = [...randomArcsData, ...specificArcs];

const pointsData = arcsData.map(arc => ({
  lat: arc.endLat,
  lng: arc.endLng,
  size: Math.random() * 0.5 + 0.1,
  color: arc.color[1]
}));

const ringsData = arcsData.map(arc => ({
  lat: arc.endLat,
  lng: arc.endLng,
  color: arc.color[1],
  maxR: Math.random() * 5 + 3,
  propagationSpeed: (Math.random() - 0.5) * 2 + 1,
  repeatPeriod: Math.random() * 2000 + 1000
}));

export default function ThreatMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeEl = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { t } = useTranslation();

  const [GlobeComponent, setGlobeComponent] = useState<any>(null);
  
  useEffect(() => {
    import('react-globe.gl').then((mod) => {
      setGlobeComponent(() => mod.default);
    }).catch(err => {
      console.error("Failed to load globe", err);
    });
  }, []);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    // Auto-rotate the globe
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 1.5;
      globeEl.current.controls().enableZoom = false;
      globeEl.current.pointOfView({ altitude: 2.5 });
    }
  }, [dimensions]);

  if (dimensions.width === 0) return <div ref={containerRef} className="w-full h-full min-h-[300px] bg-slate-900 rounded-lg" />;

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px] bg-slate-900 rounded-lg overflow-hidden relative shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center">
      {/* Overlay gradient for styling */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-slate-900/50"></div>
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(15,23,42,0.8)_100%)]"></div>
      
      {GlobeComponent && (
        <GlobeComponent
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
          
          arcsData={arcsData}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={2}
          arcDashInitialGap={() => Math.random() * 5}
          arcDashAnimateTime={2000}
          arcStroke={0.5}
          
          pointsData={pointsData}
          pointColor="color"
          pointAltitude={0.01}
          pointRadius="size"
          pointsMerge={true}
          
          ringsData={ringsData}
          ringColor="color"
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"

          htmlElementsData={specificPoints}
          htmlElement={(d: any) => {
            const el = document.createElement('div');
            const color = d.type === 'critical' ? '#ef4444' : d.type === 'high' ? '#f59e0b' : '#3b82f6';
            el.innerHTML = `
              <div style="color: ${color}; background: rgba(15,23,42,0.8); border: 1px solid ${color}; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; white-space: nowrap; box-shadow: 0 0 10px ${color}40; backdrop-filter: blur(4px);">
                ${t(`threat.${d.labelKey}`, d.fallback)}
              </div>
            `;
            el.style.pointerEvents = 'none';
            return el;
          }}
        />
      )}
    </div>
  );
}
