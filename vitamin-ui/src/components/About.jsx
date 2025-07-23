// src/pages/About.jsx
import React from 'react';
import { Grid, Column, Button } from '@carbon/react';
import { useNavigate } from 'react-router-dom';
import './About.css';
import heroImg from '../assets/hero.png';
import why from '../assets/why_it_matters.png';
// import feature from '../assets/features.png';
// import callTo from '../assets/call.png';
import journey from '../assets/journey.png';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">

      {/* Hero Section */}
      <section className="about-hero">
        <Grid fullWidth>
          <Column lg={8} md={6} sm={4} className="hero-text">
            <h1>Detect Vitamin Deficiencies with AI</h1>
            <p>
              Our platform uses cutting-edge AI technology to detect vitamin deficiencies through image analysis. 
              We aim to make preventive healthcare more accessible, accurate, and personalized.
            </p>
            <Button kind="primary" size="lg" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </Column>
          <Column lg={8} md={6} sm={4}>
            <img src={heroImg} alt="Health checkup" className="hero-image" />
          </Column>
        </Grid>
      </section>

      {/* Why It Matters */}
      <section className="about-section">
        <Grid fullWidth>
          <Column lg={8} md={6} sm={4}>
            <img src={why} alt="Why it matters" className="section-image" />
          </Column>
          <Column lg={8} md={6} sm={4} className="section-text">
            <h2>Why Vitamin Deficiency Detection Matters</h2>
            <p>
              Many people live with undiagnosed vitamin deficiencies, which can silently impair energy levels,
              immunity, and cognitive function. Often misattributed to stress or aging, these deficiencies
              can lead to long-term complications. Early detection empowers users to make informed
              lifestyle or dietary changes before health deteriorates. Our AI-powered tool bridges this
              gap by providing a fast, non-invasive, and accessible way to screen for nutritional imbalances—
              promoting proactive and personalized healthcare.
            </p>
          </Column>
        </Grid>
      </section>

      {/* Features */}
      <section className="about-features">
        <h2 className="section-title">Key Features</h2>
        <Grid fullWidth className="feature-grid">
          <Column lg={5} md={4} sm={4} className="feature-tile">
            <h3>AI-Powered Detection</h3>
            <p>
              Leverages advanced computer vision models to identify vitamin deficiency indicators
              from facial image patterns with high precision.
            </p>
          </Column>
          <Column lg={5} md={4} sm={4} className="feature-tile">
            <h3>Instant PDF Health Reports</h3>
            <p>
              Users receive a downloadable PDF report that includes deficiency type, explanation, and
              personalized food and lifestyle recommendations to improve health outcomes.
            </p>
          </Column>
          <Column lg={5} md={4} sm={4} className="feature-tile">
            <h3>Intuitive & Secure Platform</h3>
            <p>
              A clean, responsive interface designed for ease of use, with secure image handling and
              session-based user flow to ensure privacy and smooth interaction.
            </p>
          </Column>
          <Column lg={1} md={0} sm={0}>
            {/* <img src={feature} alt="Features" className="section-image right-aligned" /> */}
          </Column>
        </Grid>
      </section>

      {/* Our Journey */}
      <section className="about-section alternate">
        <Grid fullWidth>
          <Column lg={8} md={6} sm={4} className="section-text">
            <h2>Our Journey</h2>
            <p>
              What began as a university hackathon idea quickly evolved into a mission-driven platform.
              Motivated by the lack of accessible diagnostic tools in underserved areas, we fused our passion
              for AI and health sciences to develop an intuitive solution. Over several weeks, we integrated
              deep learning models, clinical research insights, and modern web frameworks into a seamless product.
              Today, our tool not only identifies deficiencies but also educates and empowers users to take
              control of their nutritional well-being.
            </p>
          </Column>
          <Column lg={8} md={6} sm={4}>
            <img src={journey} alt="Journey timeline" className="section-image" />
          </Column>
        </Grid>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <Grid fullWidth>
          <Column lg={{ span: 8, offset: 4 }} md={{ span: 6, offset: 1 }} sm={4} className="cta-text">
            <h2>Start Your Health Journey Today</h2>
            <p>
              Don’t wait for symptoms to show up—take control now. Upload a selfie, let our AI do the analysis,
              and receive a detailed report tailored to your nutritional needs. It’s fast, secure, and free to try.
            </p>
            <Button kind="secondary" size="lg" onClick={() => navigate('/predict')}>
              Predict Now
            </Button>
          </Column>
        </Grid>
      </section>
    </div>
  );
};

export default About;