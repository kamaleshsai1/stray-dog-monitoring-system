import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  Sparkles,
  Award
} from 'lucide-react';

export default function AnalyticsDashboard({ stats, dogs }) {
  const summary = stats?.summary || {
    totalMonitoredDogs: 15,
    vaccinatedCount: 14,
    vaccinationRate: 93,
    sterilizedCount: 13,
    sterilizationRate: 87,
    pendingSterilization: 2,
    activeGPSCollars: 15,
    activeRescueOperations: 3,
    openCitizenReports: 1
  };

  const zoneBreakdown = [
    { name: 'GITAM University Main Building', count: 2, percent: 18, color: 'var(--cyan-400)', sterilized: '100%', risk: 'Low Risk' },
    { name: 'South Block (SBH Hostel)', count: 3, percent: 27, color: 'var(--emerald-400)', sterilized: '100%', risk: 'Low Risk' },
    { name: 'North Block (NBH Hostel)', count: 3, percent: 27, color: 'var(--amber-400)', sterilized: '100%', risk: 'Low Risk' },
    { name: 'Staff Quarters & Faculty Housing', count: 2, percent: 18, color: 'var(--rose-400)', sterilized: '100%', risk: 'Low Risk' },
    { name: 'Central Lawn (SBH-NBH Lawn)', count: 1, percent: 10, color: 'var(--indigo-400)', sterilized: '100%', risk: 'Low Risk' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Executive Header */}
      <div className="glass-panel" style={{ padding: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={22} color="var(--cyan-400)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>
              Municipal stray dog Population & Health Intelligence
            </h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            Automated demographic analytics, vaccination herd immunity tracking, and sterilization gap metrics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge badge-emerald" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
            <ShieldCheck size={14} /> WHO Rabies Safe Threshold Met (&gt;70%)
          </span>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
        
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
            <span>TOTAL MONITORED DOGS</span>
            <Users size={16} color="var(--cyan-400)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginTop: '6px' }}>
            {summary.totalMonitoredDogs}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--emerald-400)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} /> 100% Digitally Identified (D1-D15)
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
            <span>VACCINATION COVERAGE</span>
            <ShieldCheck size={16} color="var(--emerald-400)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--emerald-400)', marginTop: '6px' }}>
            {summary.vaccinationRate}%
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {summary.vaccinatedCount} of {summary.totalMonitoredDogs} vaccinated against Rabies
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
            <span>ABC STERILIZATION RATE</span>
            <Award size={16} color="var(--amber-400)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--amber-400)', marginTop: '6px' }}>
            {summary.sterilizationRate}%
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {summary.sterilizedCount} neutered & ear-notched ({summary.pendingSterilization} pending)
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
            <span>ACTIVE IoT COLLARS</span>
            <Cpu size={16} color="var(--indigo-400)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--indigo-400)', marginTop: '6px' }}>
            {summary.activeGPSCollars}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Live Satellite GPS Collar Telemetry
          </div>
        </div>

      </div>

      {/* Main Charts & Visualizations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        
        {/* Zone Distribution Breakdown */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'white', marginBottom: '14px' }}>
            Campus Population Density by Sector
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {zoneBreakdown.map((z, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '600', color: 'white' }}>{z.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--text-dim)' }}>{z.count} Dogs</span>
                    <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>{z.sterilized} ABC</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${z.percent * 3}%`, height: '100%', background: z.color, borderRadius: '999px', transition: 'width 0.8s ease' }}></div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.76rem', color: 'var(--text-dim)' }}>
            ?? <strong>Resource Recommendation:</strong> NBH sector currently hosts 2 unsterilized dogs (Bruno D08 & Milo D09). A targeted ABC capture drive next week will elevate campus sterilization compliance to 100%.
          </div>
        </div>

        {/* Behavioral & Health Distribution */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'white', marginBottom: '14px' }}>
            Canine Welfare & Behavioral Analytics
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            
            <div style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--emerald-400)', fontWeight: '700', textTransform: 'uppercase' }}>Optimal Health Index</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white', marginTop: '6px' }}>
                73.3%
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                11 Dogs with Body Condition Score &ge; 90 and zero clinical injuries.
              </p>
            </div>

            <div style={{ background: 'rgba(6, 182, 212, 0.06)', border: '1px solid rgba(6, 182, 212, 0.2)', padding: '16px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--cyan-400)', fontWeight: '700', textTransform: 'uppercase' }}>Docility & Calm Index</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white', marginTop: '6px' }}>
                93.8%
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                AI vision behavior classifier shows near-zero unprovoked aggression.
              </p>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '16px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--amber-400)', fontWeight: '700', textTransform: 'uppercase' }}>Monitored Observation</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white', marginTop: '6px' }}>
                4 Dogs
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Minor paw abrasion (D03 Brownie) & mild coat allergy (D06 Spotty) being treated.
              </p>
            </div>

            <div style={{ background: 'rgba(99, 102, 241, 0.06)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '16px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--indigo-400)', fontWeight: '700', textTransform: 'uppercase' }}>Territorial Fidelity</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white', marginTop: '6px' }}>
                96.4%
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Dogs consistently remain within registered home micro-sectors.
              </p>
            </div>

          </div>

          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>Campus Anti-Rabies Immunity Duration:</span>
            <strong style={{ color: 'var(--emerald-400)' }}>Active Through Q2 2027</strong>
          </div>
        </div>

      </div>

    </div>
  );
}
