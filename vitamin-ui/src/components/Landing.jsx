import React, { useEffect, useState } from 'react';
import { Button, Tag } from '@carbon/react';
import { useNavigate, Link } from 'react-router-dom';
import './Landing.css';
import { useInView } from 'react-intersection-observer';
import {
  Information,
  UserAvatar,
  Warning,
  ViewFilled,
  Settings,
  ChartComboStacked
} from '@carbon/icons-react';

const sections = [
  { id: 'what-is-deficiency', label: 'What is Vitamin Deficiency?' },
  { id: 'who-should-test', label: 'Who Should Take the Test?' },
  { id: 'why-test', label: 'Why Should You Test?' },
  { id: 'common-symptoms', label: 'Common Symptoms' },
  { id: 'how-tool-works', label: 'How Our AI Tool Works' },
  { id: 'testing-tech', label: 'Our Testing Technology' },
];

// ✅ Animated wrapper component
const AnimatedSection = ({ id, children, className = '' }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      id={id}
      ref={ref}
      className={`info-section ${className} ${inView ? 'visible' : ''}`}
    >
      {children}
    </section>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      let closestSection = '';
      let minDistance = Infinity;

      sections.forEach(section => {
        const el = document.getElementById(section.id);
        if (el) {
          const distance = Math.abs(el.getBoundingClientRect().top);
          if (distance < minDistance) {
            minDistance = distance;
            closestSection = section.id;
          }
        }
      });

      setActiveSection(closestSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      <div className="layout">

        {/* Sidebar */}
        <aside className="sticky-sidebar">
          <h4>On this page</h4>
          <ul>
            <li className={activeSection === 'what-is-deficiency' ? 'active' : ''}>
              <a href="#what-is-deficiency"><Information size={16} /> What is Vitamin Deficiency?</a>
            </li>
            <li className={activeSection === 'who-should-test' ? 'active' : ''}>
              <a href="#who-should-test"><UserAvatar size={16} /> Who Should Take the Test?</a>
            </li>
            <li className={activeSection === 'why-test' ? 'active' : ''}>
              <a href="#why-test"><Warning size={16} /> Why Should You Test?</a>
            </li>
            <li className={activeSection === 'common-symptoms' ? 'active' : ''}>
              <a href="#common-symptoms"><ViewFilled size={16} /> Common Symptoms</a>
            </li>
            <li className={activeSection === 'how-tool-works' ? 'active' : ''}>
              <a href="#how-tool-works"><Settings size={16} /> How Our AI Tool Works</a>
            </li>
            <li className={activeSection === 'testing-tech' ? 'active' : ''}>
              <a href="#testing-tech"><ChartComboStacked size={16} /> Our Testing Technology</a>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <div className="main-content">

          {/* Hero Section */}
          <section className="hero">
            <div className="section-wrapper">
              <h1 className="hero-title">Vitamin Deficiency Detector</h1>
              <p className="hero-subtitle">
                AI-powered facial image analysis for early detection of vitamin deficiencies.
                No blood, no hassle — just upload your photo and know your health better.
              </p>
              <div className="hero-buttons">
                <Button kind="primary" onClick={() => navigate('/register')}>Register Now</Button>
                <Button kind="secondary" onClick={() => navigate('/login')}>Login</Button>
                <Button kind="ghost" onClick={() => navigate('/about')}>Learn More</Button>
              </div>
            </div>
          </section>

          {/* Info Sections with Animation */}

          <AnimatedSection id="what-is-deficiency" className="bg-light">
            <div className="section-wrapper">
              <h2>What is Vitamin Deficiency?</h2>
              <p>
                Vitamin deficiency occurs when your body doesn’t get enough essential vitamins.
                This can affect your energy, skin, immunity, bones, vision, and even mental health.
                Our modern diets and lifestyles make this more common than ever.
              </p>
              <p>
                The symptoms of a vitamin deficiency depend on which vitamin is lacking. Common symptoms include fatigue, lack of energy, weakness, and dizziness.
                Severe deficiencies can cause serious health issues such as poor physical and mental development in children, blindness, or vulnerability to disease.
              </p>
              <p>Many people experience deficiencies of:</p>
              <ul>
                <li>Vitamin A</li>
                <li>Vitamin B9 (Folate)</li>
                <li>Vitamin B12</li>
                <li>Vitamin D</li>
                <li>Vitamin E</li>
                <li>Vitamin K</li>
                <li>Iron</li>
                <li>Iodine</li>
                <li>Magnesium</li>
                <li>Selenium</li>
                <li>Zinc</li>
              </ul>
              <p>
                A lack of vitamin B12, iron, or folate can lead to <strong>anemia</strong>, which means low levels of healthy red blood cells.
                Red blood cells are essential for transporting oxygen throughout the body. People with too few red blood cells may experience:
              </p>
              <ul>
                <li>Tiredness</li>
                <li>Weakness</li>
                <li>Headache</li>
                <li>Pale or dry skin</li>
                <li>Dizziness</li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection id="who-should-test">
            <div className="section-wrapper">
              <h2>Who Should Take a Vitamin Deficiency Test?</h2>
              <p>
                A balanced diet usually provides most people with enough vitamins and minerals.
                However, some individuals are more likely to experience deficiencies and should
                consider vitamin deficiency testing.
              </p>
              <p>
                <strong>Pregnant women and small children</strong> are at high risk due to increased
                nutrient requirements essential for development and health.
              </p>
              <p>Other groups at higher risk include those with:</p>
              <ul>
                <li>Gastrointestinal disorders like Crohn’s or celiac disease</li>
                <li>Unbalanced or highly restrictive diets</li>
                <li>Vegan or vegetarian diets lacking supplements</li>
                <li>Excessive alcohol consumption</li>
                <li>Medications that reduce nutrient absorption (e.g., PPIs)</li>
                <li>Limited sun exposure leading to low vitamin D</li>
              </ul>
              <p>
                If you belong to any of these risk groups or notice symptoms like fatigue,
                dizziness, or weakness — a vitamin deficiency test may help you take control of your health.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection id="why-test">
            <div className="section-wrapper">
              <h2>Why Should You Test?</h2>
              <ul>
                <li>💡 Detect vitamin deficiencies before they lead to major health issues</li>
                <li>📊 Take control of your health through personalized insights</li>
                <li>🧠 Boost your energy, memory, and concentration</li>
                <li>👨‍⚕️ Prevent fatigue, mood swings, hair loss, and skin problems</li>
                <li>💊 Avoid over-supplementing by targeting only what you need</li>
                <li>⚕️ Make informed dietary and lifestyle adjustments</li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection id="common-symptoms" className="bg-light">
            <div className="section-wrapper">
              <h2>Common Symptoms</h2>
              <div className="tags-container">
                <Tag type="blue">Fatigue</Tag>
                <Tag type="cool-gray">Hair Loss</Tag>
                <Tag type="cyan">Weak Immunity</Tag>
                <Tag type="teal">Blurred Vision</Tag>
                <Tag type="green">Cracked Lips</Tag>
                <Tag type="purple">Numbness</Tag>
                <Tag type="red">Bone Pain</Tag>
                <Tag type="magenta">Poor Concentration</Tag>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection id="how-tool-works">
            <div className="section-wrapper">
              <h2>How Our AI Tool Works</h2>
              <p>
                Our tool uses advanced machine learning and deep neural networks trained on thousands of facial images.
                It identifies patterns, colors, and textures associated with key vitamin deficiencies.
                All you have to do is upload a clear photo of your face, and the tool does the rest.
              </p>
              <ol>
                <li>🖼 Upload your facial image</li>
                <li>⚙️ AI analyzes skin tone, texture, and color variation</li>
                <li>🤖 Neural network predicts likely deficiencies (A, B, C, D, E)</li>
                <li>📄 Get a downloadable report with dietary tips</li>
              </ol>
            </div>
          </AnimatedSection>

          <AnimatedSection id="testing-tech" className="bg-light">
            <div className="section-wrapper">
              <h2>Our Testing Technology</h2>
              <p>
                Our model leverages unsupervised clustering and image segmentation to isolate regions of your face.
                From these regions, we extract features like color balance, pigmentation, smoothness, and edge distribution.
                These features are passed to a deep learning classifier that predicts the deficiency class.
              </p>
              <ul>
                <li>🧪 No blood samples or lab visits</li>
                <li>📱 100% online and instant analysis</li>
                <li>🔐 End-to-end encrypted image processing</li>
                <li>⚙️ Based on state-of-the-art medical image processing techniques</li>
              </ul>
            </div>
          </AnimatedSection>

          {/* CTA */}
          <section className="cta-section">
            <div className="section-wrapper center-text">
              <h2>Start Your Health Journey Today</h2>
              <p>Sign up in under a minute and discover what your body needs most.</p>
              <Button
                        kind="ghost"
                        size="lg"
                        className="cta-register-btn"
                        onClick={() => navigate('/register')}
                        >
                        Register Now
                        </Button>
            </div>
          </section>

          {/* Footer */}
          <footer className="footer">
            <div className="section-wrapper center-text">
              <p>&copy; 2025 Vitamin Deficiency Detector. All rights reserved.</p>
              <Link to="/about">About</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Landing;