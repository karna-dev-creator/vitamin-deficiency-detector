import React, { useState } from 'react';
import {
  Grid,
  Column,
  FileUploader,
  NumberInput,
  Button,
  InlineNotification,
  Loading,
} from '@carbon/react';
import { Download, Reset } from '@carbon/icons-react';
import './FeatureExtractor.css'; // You can style it separately

const FeatureExtractor = () => {
  const [file, setFile] = useState(null);
  const [cluster, setCluster] = useState('');
  const [segmentedImageUrl, setSegmentedImageUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
    if (!file || !cluster || cluster < 2) {
      setError('Please upload an image and set clusters (min 2).');
      return;
    }

    setError('');
    setSegmentedImageUrl(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('cluster', cluster);

    try {
      const response = await fetch('http://127.0.0.1:5000/success', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.status === 'success') {
        const segmentedUrl = `http://127.0.0.1:5000/static/images/${result.segmented_image}`;
        setSegmentedImageUrl(segmentedUrl);
      } else {
        setError(result.message || 'Extraction failed. Try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error during feature extraction.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setCluster('');
    setSegmentedImageUrl(null);
    setError('');
  };

  return (
    <section className="feature-extract-section">
      <Grid fullWidth>
        <Column sm={4} md={8} lg={12} className="feature-extract-wrapper">
          <h3> Extract Features (Clustering)</h3>


          <FileUploader
            labelTitle="Upload your image"
            labelDescription="Only JPG or PNG allowed"
            buttonLabel="Choose File"
            filenameStatus={file ? 'edit' : 'upload'}
            accept={['.jpg', '.jpeg', '.png']}
            onChange={(e) => setFile(e.target.files[0])}
            multiple={false}
          />

          <NumberInput
            id="cluster-input"
            label="Number of Clusters"
            min={2}
            max={10}
            value={cluster}
            onChange={(evt, { value }) => setCluster(value)}
            style={{ marginTop: '1rem' }}
          />
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <Button kind="primary" onClick={handleExtract} disabled={loading}>
              {loading ? 'Processing...' : 'Extract Features'}
            </Button>
            <Button kind="secondary" onClick={handleReset} disabled={loading}>
              <Reset size={16} style={{ marginRight: '0.5rem' }} />
              Reset
            </Button>
          </div>

          {error && (
            <InlineNotification
              kind="error"
              title="Error"
              subtitle={error}
              lowContrast
              style={{ marginTop: '1.5rem' }}
              onCloseButtonClick={() => setError('')}
            />
          )}

          {loading && <Loading description="Extracting features..." withOverlay small style={{ marginTop: '1.5rem' }} />}

          {segmentedImageUrl && (
            <div className="segmented-result">
              <h5 style={{ marginTop: '2rem' }}>Segmented Image:</h5>
              <img
                src={segmentedImageUrl}
                alt="Segmented Result"
                className="segmented-image"
              />
              <div style={{ marginTop: '1rem' }}>
                <a href={segmentedImageUrl} download>
                  <Button kind="tertiary" renderIcon={Download}>
                    Download Segmented Image
                  </Button>
                </a>
              </div>
            </div>
          )}
        </Column>
      </Grid>
    </section>
  );
};

export default FeatureExtractor;
