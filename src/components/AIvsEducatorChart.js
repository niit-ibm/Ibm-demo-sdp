import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList
} from 'recharts';

const data = [
  { task: 'Lesson Planning', 'AI Coach': 38, 'Educator Coach': 62 },
  { task: 'Personalization', 'AI Coach': 43, 'Educator Coach': 57 },
  { task: 'Grading and Assessment', 'AI Coach': 41, 'Educator Coach': 59 },
  { task: 'Insights and Reporting', 'AI Coach': 65, 'Educator Coach': 35 },
];

const AIvsEducatorChart = () => {
  return (
    <div style={{
      width: '600px',
      height: '520px',
      margin: '40px auto',
      padding: '20px',
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      <h3 style={{
        textAlign: 'center',
        marginBottom: '20px',
        fontWeight: 600,
        color: '#333'
      }}>
        Comparison of AI Coach vs Educator Coach by Educational Task
      </h3>

      <ResponsiveContainer width="100%" height="90%">
  <BarChart
    data={data}
    margin={{ top: 20, right: 30, left: 40, bottom: 60 }} // Increased left margin
  >
    <XAxis 
      dataKey="task" 
      angle={-15} 
      textAnchor="end" 
      interval={0}
      tick={{ fontSize: 12 }}
    />
    <YAxis 
      label={{ 
        value: 'Percentage (%)', 
        angle: -90, 
        position: 'insideLeft', 
        offset: 20 // Less negative = more space
      }} 
      tick={{ fontSize: 12 }}
    />
    <Tooltip />
    <Legend verticalAlign="top" height={36} />
    <Bar dataKey="AI Coach" fill="#f5a623" barSize={22}>
      <LabelList dataKey="AI Coach" position="top" formatter={(v) => `${v}%`} />
    </Bar>
    <Bar dataKey="Educator Coach" fill="#4287f5" barSize={22}>
      <LabelList dataKey="Educator Coach" position="top" formatter={(v) => `${v}%`} />
    </Bar>
  </BarChart>
</ResponsiveContainer>

    </div>
  );
};

export default AIvsEducatorChart;
