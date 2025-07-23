import React, { useState } from 'react';
import {
  Grid, Column, FileUploaderDropContainer, Button, TextArea,
  InlineNotification, InlineLoading, Form, Stack
} from '@carbon/react';
import { useNavigate } from 'react-router-dom';
import './Predict.css';
import { motion } from 'framer-motion';
import { Information } from '@carbon/icons-react';

export default function Predict() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showKnowMore, setShowKnowMore] = useState(false);
  const navigate = useNavigate();

console.log("showKnowMore:", showKnowMore);
console.log("result:", result);
console.log("result?.deficiency:", result?.deficiency);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult('');
      setNotification(null);
      setShowKnowMore(false);
    }
  };

  const handlePredict = async () => {
    if (!file) return alert('Please select an image.');
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const email = user?.email || '';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.status === 'success') {
      // 👇 Save result as an object instead of plain string
      setResult({
        deficiency: data.deficiency,
        description: data.description,
      });

      setNotification({
        kind: 'success',
        title: 'Prediction Successful',
        subtitle: `Deficiency Detected: ${data.deficiency}`,
      });

      setShowKnowMore(true);
    }
       else {
        setNotification({
          kind: 'error',
          title: 'Prediction Failed',
          subtitle: data.message || 'Unexpected error occurred.',
        });
      }
    } catch (error) {
      console.error(error);
      setNotification({
        kind: 'error',
        title: 'Server Error',
        subtitle: 'Prediction failed. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setResult('');
    setNotification(null);
    setShowKnowMore(false);
  };

  const handleKnowMore = () => {
    const deficiency = result.match(/Deficiency: ([^\n]+)/)?.[1];
    if (deficiency) navigate(`/vitamin-info/${deficiency.toLowerCase()}`);
  };

  return (
    <div className="predict-wrapper">
     {loading && (
      <div className="spinner-overlay">
        <div className="spinner-box">
          <InlineLoading description="Analyzing..." />
          <p className="spinner-text">Analyzing Image...</p>
        </div>
      </div>
    )}
      <Grid fullWidth className="predict-container">
        <Column lg={{ span: 8, offset: 4 }} md={{ span: 6, offset: 1 }} sm={4} className="predict-content">
          <h1 className="title">Vitamin Deficiency Detector</h1>
          <p className="subtitle">
            Upload a facial image to detect vitamin deficiencies using AI.
          </p>

          <div className="step-indicator">
            <span className={file ? 'active' : ''}>1. Upload</span>
            <span className={loading ? 'active' : ''}>2. Predicting</span>
            <span className={notification ? 'active' : ''}>3. Result</span>
          </div>

          {notification && (
            <InlineNotification
              kind={notification.kind}
              title={notification.title}
              subtitle={notification.subtitle}
              onClose={() => setNotification(null)}
              className="predict-notification"
            />
          )}

          <Form className="upload-form">
            <Stack gap={5}>
              <p className="upload-instruction">
                📸 Upload a well-lit, unfiltered face image. Avoid sunglasses or heavy makeup.
              </p>

              <div className="uploader-container">
                <FileUploaderDropContainer
                  labelText="Drag and drop an image or click to browse"
                  accept={['.jpg', '.jpeg', '.png']}
                  multiple={false}
                  onAddFiles={handleFileChange}
                  name="file"
                />
              </div>
              {file && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="image-preview"
                />
              )}

              <div className="button-row">
                <Button onClick={handlePredict} disabled={!file}>
                  Predict
                </Button>
                <Button kind="ghost" onClick={handleClear}>
                  Clear
                </Button>
              </div>

              {result && (
              <TextArea
                labelText="Prediction Result"
                value={`Deficiency: ${result.deficiency}\n\n${result.description}`}
                readOnly
                rows={6}
                className="result-box"
              />
            )}
              {showKnowMore && result?.deficiency && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="know-more-wrapper"
              >
                <Button
                  kind="tertiary"
                  onClick={() => {
                    let deficiency = result.deficiency.trim().toLowerCase(); // e.g., "vitamin d" or "d"

                    if (deficiency.startsWith("vitamin ")) {
                      deficiency = deficiency.split(" ")[1]; // get "d"
                    } else if (deficiency.startsWith("vitamin")) {
                      deficiency = deficiency.replace("vitamin", ""); // get "d"
                    }

                    navigate(`/vitamin-info/${deficiency}`); // Navigate to /vitamin-info/d
                  }}
                  renderIcon={Information}
                  iconDescription="Know more about the detected deficiency"
                >
                  Know More
                </Button>
              </motion.div>
            )}
            </Stack>
          </Form>
        </Column>
      </Grid>
    </div>
  );
}