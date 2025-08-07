import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();
    
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #fff 0%, #f5f5f5 100%)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '20px',
            textAlign: 'center'
        }}>
            <div style={{
                fontSize: '120px',
                fontWeight: '700',
                color: '#2c3e50',
                marginBottom: '0',
                lineHeight: '1',
                letterSpacing: '-2px'
            }}>
                404
            </div>
            <h2 style={{
                fontSize: '24px',
                color: '#34495e',
                marginTop: '8px',
                marginBottom: '24px',
                fontWeight: '500'
            }}>
                Page Not Found
            </h2>
            <p style={{
                color: '#7f8c8d',
                fontSize: '16px',
                maxWidth: '400px',
                marginBottom: '32px',
                lineHeight: '1.6'
            }}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <button 
                onClick={() => navigate('/')}
                style={{
                    background: '#2c3e50',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 32px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    fontWeight: '500',
                    boxShadow: '0 2px 8px rgba(44,62,80,0.15)'
                }}
                onMouseOver={(e) => e.target.style.background = '#34495e'}
                onMouseOut={(e) => e.target.style.background = '#2c3e50'}
            >
                Return Home
            </button>
        </div>
    );
}
