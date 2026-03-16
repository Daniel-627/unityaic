export default function Loading() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', backgroundColor: '#ffffff',
      gap: '16px',
    }}>
      <img src="/aiclogo.png" alt="Unity AIC" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
      <p style={{ fontWeight: '700', color: '#1B3A6B', fontSize: '15px', letterSpacing: '0.05em' }}>
        Unity AIC
      </p>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        border: '3px solid #E5E7EB', borderTopColor: '#1B3A6B',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}