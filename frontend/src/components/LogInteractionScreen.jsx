import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHCPs } from '../store/interactionSlice';
import InteractionForm from './InteractionForm';
import ChatInterface from './ChatInterface';

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    background: '#fff',
    borderBottom: '1px solid #dadce0',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '56px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #1a73e8, #0d47a1)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: '14px',
  },
  logoText: {
    fontWeight: '600',
    fontSize: '16px',
    color: '#202124',
  },
  logoSub: {
    fontSize: '12px',
    color: '#5f6368',
    fontWeight: '400',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  badge: {
    background: '#e8f0fe',
    color: '#1a73e8',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
  avatar: {
    width: '32px',
    height: '32px',
    background: '#1a73e8',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: '13px',
  },
  content: {
    flex: 1,
    padding: '20px 24px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
  },
  pageTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  titleLeft: {},
  h1: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#202124',
    marginBottom: '2px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#5f6368',
  },
  tabBar: {
    display: 'flex',
    gap: '4px',
    background: '#f1f3f4',
    padding: '4px',
    borderRadius: '10px',
    marginBottom: '20px',
    width: 'fit-content',
  },
  tab: (active) => ({
    padding: '8px 20px',
    borderRadius: '8px',
    border: 'none',
    background: active ? '#fff' : 'transparent',
    color: active ? '#1a73e8' : '#5f6368',
    fontWeight: active ? '600' : '400',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: active ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  }),
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
  },
};

export default function LogInteractionScreen() {
  const [activeTab, setActiveTab] = useState('form');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchHCPs());
  }, [dispatch]);

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>A</div>
          <div>
            <div style={styles.logoText}>AIVOA.AI <span style={{ color: '#5f6368', fontWeight: 400 }}>CRM</span></div>
          </div>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.badge}>HCP Module</span>
          <div style={styles.avatar}>RS</div>
        </div>
      </header>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.pageTitle}>
          <div style={styles.titleLeft}>
            <h1 style={styles.h1}>Log HCP Interaction</h1>
            <p style={styles.subtitle}>Record a new interaction with a Healthcare Professional</p>
          </div>
        </div>

        {/* Tab Bar */}
        <div style={styles.tabBar}>
          <button style={styles.tab(activeTab === 'form')} onClick={() => setActiveTab('form')}>
            <span>📋</span> Structured Form
          </button>
          <button style={styles.tab(activeTab === 'chat')} onClick={() => setActiveTab('chat')}>
            <span>🤖</span> AI Chat
          </button>
        </div>

        {/* Tab Content */}
        <div style={styles.mainGrid}>
          {activeTab === 'form' ? <InteractionForm /> : <ChatInterface />}
        </div>
      </div>
    </div>
  );
}
