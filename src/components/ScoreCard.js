import React from 'react';

export default function ScoreCard({ data }) {
  return (
    <div style={{ border: '1px solid green', borderRadius: 5, padding: 10, backgroundColor: '#e6ffe6' }}>
      <p><strong>Set:</strong> {data.set}</p>
      <p><strong>{data.playerA}:</strong> {data.games.A} games</p>
      <p><strong>{data.playerB}:</strong> {data.games.B} games</p>
      <p><strong>Next Serve:</strong> {data.nextServer}</p>
      <p><strong>Breaks:</strong> {data.serveBreaks.join(', ')}</p>
    </div>
  );
}
