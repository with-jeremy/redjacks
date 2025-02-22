'use client';

import React from 'react';

const PaymentSuccess = () => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
      <p className="mb-4">Thank you for your purchase! Your payment was successful.</p>
      <a href="/" className="text-blue-500 underline">Go to your ticket dashboard.</a>
    </div>
  );
};

export default PaymentSuccess;