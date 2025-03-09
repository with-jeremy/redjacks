"use client";

import { useState, useCallback } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

const ScanPage = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = useCallback(async (result: string) => {
    setScanResult(result);
    setError(null);

    try {
      // Assuming the scanned result is the ticket ID
      const ticketId = result;

      // Call an API endpoint to invalidate the ticket
      const response = await fetch('/api/invalidate-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Failed to invalidate ticket: ${errorData.message || response.statusText}`);
        setScanResult(null);
        return;
      }

      // Optionally, show a success message
      alert(`Ticket ${ticketId} invalidated successfully!`);

    } catch (err: any) {
      setError(`Failed to invalidate ticket: ${err.message}`);
      setScanResult(null);
    }
  }, []);

  const handleError = useCallback((err: any) => {
    setError(err.message);
  }, []);

  return (
    <div>
      <h1>Scan Ticket QR Code</h1>
      <Scanner
        onResult={handleScan}
        onError={handleError}
        style={{ width: '300px' }}
      />
      {scanResult && <p>Scanned Ticket ID: {scanResult}</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default ScanPage;
