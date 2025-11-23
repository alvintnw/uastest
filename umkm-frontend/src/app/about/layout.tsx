import React from 'react';

// Ini adalah layout HANYA untuk seksi /about
// Ini akan dibungkus secara otomatis oleh app/layout.tsx
export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 
  // JANGAN letakkan <html> atau <body> di sini. 
  // 
  
  // Cukup kembalikan children, atau bungkus dengan <section> jika perlu.
  return <>{children}</>;
}
