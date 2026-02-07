import { Link } from 'react-router-dom';
import App from '../App';

export function ToolPage() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        background: '#2c3e50', 
        padding: '8px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <Link 
          to="/" 
          style={{ 
            color: 'white', 
            textDecoration: 'none',
            fontSize: '14px',
            opacity: 0.9
          }}
        >
          ← Back to Home
        </Link>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <App />
      </div>
    </div>
  );
}
