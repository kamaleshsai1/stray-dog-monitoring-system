import React from 'react';
import { 
  Activity, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Ambulance, 
  FileText, 
  BarChart3, 
  Bell, 
  Volume2, 
  VolumeX, 
  PlusCircle
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenReportModal, 
  onOpenRegisterModal,
  soundEnabled,
  setSoundEnabled,
  stats
}) {
  const tabs = [
    { id: 'map', label: 'GIS Live Tracking', icon: MapPin },
    { id: 'ai-vision', label: 'Face & Emotion Recognition', icon: Sparkles, badge: 'AI' },
    { id: 'registry', label: 'Digital Dog Registry (D1-D15)', icon: ShieldCheck },
    { id: 'rescues', label: 'Rescues & ABC Drives', icon: Ambulance, count: stats?.summary?.activeRescueOperations || 3 },
    { id: 'reports', label: 'Public Incident Portal', icon: FileText },
    { id: 'analytics', label: 'Population Analytics', icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel" style={{ borderRadius: '0 0 16px 16px', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
      {/* Top Banner Alert Bar */}
      <div style={{ background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.12), rgba(16, 185, 129, 0.15))', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', padding: '6px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--emerald-400)', fontWeight: '600' }}>
            <span className="pulse-circle" style={{ background: 'var(--emerald-400)' }}></span>
            SYSTEM OPERATIONAL: Real-Time IoT GPS Telemetry Active
          </span>
          <span style={{ color: 'var(--text-dark)' }}>|</span>
          <span style={{ color: 'var(--text-dim)' }}>
            GITAM Bengaluru Campus & Municipal Stray Dog Monitoring Cell
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: 'var(--cyan-400)' }}>
            Vaccination Coverage: <strong style={{ color: 'white' }}>{stats?.summary?.vaccinationRate || 93}%</strong>
          </span>
          <span style={{ color: 'var(--emerald-400)' }}>
            Sterilization Rate: <strong style={{ color: 'white' }}>{stats?.summary?.sterilizationRate || 87}%</strong>
          </span>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{ background: 'transparent', border: 'none', color: soundEnabled ? 'var(--emerald-400)' : 'var(--text-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
            title={soundEnabled ? 'Mute Alert Chimes' : 'Enable Alert Chimes'}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span>{soundEnabled ? 'Audio Chimes On' : 'Audio Muted'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--glow-emerald)' }}>
            <Activity size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff 30%, #34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                CanineAI
              </h1>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>AI & GPS Telemetry</span>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
              Stray Dogs Real-Time Tracking, Behavior & Welfare System
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="btn btn-secondary"
            onClick={onOpenRegisterModal}
            style={{ fontSize: '0.8rem', padding: '7px 12px' }}
          >
            <PlusCircle size={15} color="var(--emerald-400)" />
            <span>Register Dog</span>
          </button>

          <button 
            className="btn btn-danger"
            onClick={onOpenReportModal}
            style={{ fontSize: '0.8rem', padding: '7px 14px' }}
          >
            <Bell size={15} />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={{ display: 'flex', gap: '4px', padding: '0 24px 8px 24px', overflowX: 'auto' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: isActive ? '600' : '500',
                cursor: 'pointer',
                border: 'none',
                background: isActive ? 'rgba(16, 185, 129, 0.18)' : 'transparent',
                color: isActive ? 'var(--emerald-400)' : 'var(--text-dim)',
                borderBottom: isActive ? '2px solid var(--emerald-400)' : '2px solid transparent',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span style={{ fontSize: '0.62rem', background: 'var(--emerald-500)', color: 'white', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                  {tab.badge}
                </span>
              )}
              {tab.count !== undefined && (
                <span style={{ fontSize: '0.65rem', background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-main)', padding: '1px 6px', borderRadius: '999px' }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
