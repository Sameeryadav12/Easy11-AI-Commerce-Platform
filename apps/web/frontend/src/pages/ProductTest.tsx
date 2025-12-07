export default function ProductTest() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#000154', fontSize: '48px', marginBottom: '20px' }}>
        Product Detail Test Page
      </h1>
      <div style={{ backgroundColor: '#31EE88', padding: '20px', borderRadius: '12px', color: 'white', marginBottom: '20px' }}>
        <p style={{ fontSize: '24px', margin: 0 }}>
          ✅ React is working on this route!
        </p>
      </div>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
        <h2>Product ID from URL:</h2>
        <p style={{ fontSize: '32px', color: '#1A58D3' }}>
          {window.location.pathname}
        </p>
      </div>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
        <p>If you can see this, the route is working correctly.</p>
        <p>The issue is with the complex components.</p>
      </div>
    </div>
  );
}

