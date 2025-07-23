// src/pages/VitaminInfo.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vitaminData } from '../data/vitaminDetails';
import { ArrowLeft } from '@carbon/icons-react';
import { Button, Grid, Column } from '@carbon/react';
import './VitaminInfo.css';

// Normalization function to support variations like "b12", "B6", "Vitamin C"
const normalizeVitaminKey = (vitamin) => {
  const lower = vitamin.toLowerCase();
  if (lower.includes('a')) return 'a';
  if (lower.includes('b')) return 'b'; // b1, b6, b12 → b
  if (lower.includes('c')) return 'c';
  if (lower.includes('d')) return 'd';
  if (lower.includes('e')) return 'e';
  return null;
};

const VitaminInfo = () => {
  const { vitaminName } = useParams();
  const navigate = useNavigate();

  const key = normalizeVitaminKey(vitaminName || '');
  const info = vitaminData[key];

  if (!info) {
    return (
      <div className="vitamin-info-error">
        <h3>Vitamin info not found</h3>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="vitamin-info-container">
      <Grid fullWidth>
        <Column sm={4} md={8} lg={12}>
          <Button kind="ghost" onClick={() => navigate(-1)} iconDescription="Back">
            <ArrowLeft /> Back
          </Button>
          <h1>{info.title}</h1>
          <p className="subtitle">{info.subtitle}</p>

          <section>
            <h3>🧬 What is {info.name}?</h3>
            <p>{info.description}</p>
          </section>

          <section>
            <h3>🔍 Deficiency Symptoms</h3>
            <ul>
              {info.symptoms.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </section>

          <section>
            <h3>🍎 Dietary Sources</h3>
            <ul>
              {info.sources.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </section>

          <section>
            <h3>💊 Supplements & Dosage</h3>
            <p>{info.supplements}</p>
          </section>

          <section>
            <h3>⚠️ Overdose Risks</h3>
            <p>{info.overdose}</p>
          </section>

          <section className="disclaimer">
            <h4>📝 Disclaimer</h4>
            <p>This information is for educational purposes only. Consult a healthcare provider for medical advice.</p>
          </section>
        </Column>
      </Grid>
    </div>
  );
};

export default VitaminInfo;
