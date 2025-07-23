// src/components/Profile.jsx
import React, { useEffect, useState } from 'react';
import {
  TextInput,
  Button,
  InlineNotification,
  Loading,
  Select,
  SelectItem,
  RadioButtonGroup,
  RadioButton
} from '@carbon/react';
import { Save } from '@carbon/icons-react';
import './Profile.css';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '', phone: '', age: '', email: '',
    height: '', weight: '', gender: '', diet_type: '',
    medical_conditions: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFormData(user);
    }
    setFadeIn(true);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setError('');
    setMessage('');
    setUpdating(true);

    try {
      const res = await fetch('http://127.0.0.1:5000/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setUpdating(false);

      if (res.ok) {
        setMessage(data.message);
        localStorage.setItem('user', JSON.stringify(formData)); // ✅ sync update
      } else {
        setError(data.message);
      }
    } catch (err) {
      setUpdating(false);
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className={`profile-container ${fadeIn ? 'fade-in' : ''}`}>
      <h2 style={{ color: '#0f62fe', marginBottom: '1.5rem' }}>Update Profile</h2>

      <TextInput
        id="name"
        labelText="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <TextInput
        id="email"
        labelText="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <TextInput
        id="phone"
        labelText="Phone Number"
        name="phone"
        value={formData.phone}
        readOnly
        disabled
      />
      <div className="form-row">
        <TextInput
          id="age"
          labelText="Age"
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />
        <TextInput
          id="height"
          labelText="Height (cm)"
          type="number"
          name="height"
          value={formData.height}
          onChange={handleChange}
        />
        <TextInput
          id="weight"
          labelText="Weight (kg)"
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
        />
      </div>

      <RadioButtonGroup
        legendText="Gender"
        name="gender"
        valueSelected={formData.gender}
        onChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
      >
        <RadioButton labelText="Male" value="Male" id="male" />
        <RadioButton labelText="Female" value="Female" id="female" />
        <RadioButton labelText="Other" value="Other" id="other" />
      </RadioButtonGroup>

      <Select
        id="diet_type"
        labelText="Diet Type"
        name="diet_type"
        value={formData.diet_type}
        onChange={handleChange}
      >
        <SelectItem value="" text="Choose Diet Type" />
        <SelectItem value="Vegetarian" text="Vegetarian" />
        <SelectItem value="Non-Vegetarian" text="Non-Vegetarian" />
        <SelectItem value="Vegan" text="Vegan" />
      </Select>

      <TextInput
        id="medical_conditions"
        labelText="Medical Conditions"
        name="medical_conditions"
        value={formData.medical_conditions}
        onChange={handleChange}
      />

      <Button
        kind="primary"
        onClick={handleUpdate}
        size="lg"
        style={{ marginTop: '2rem', position: 'relative' }}
        disabled={updating}
      >
        {updating ? (
          <>
            <Loading small withOverlay={false} description="Updating..." className="login-spinner" />
            <span style={{ marginLeft: '0.5rem' }}>Updating...</span>
          </>
        ) : (
          <>
            <Save size={16} style={{ marginRight: '0.5rem' }} />
            Update Profile
          </>
        )}
      </Button>

      {message && (
        <InlineNotification
          kind="success"
          title="Success"
          subtitle={message}
          lowContrast
          style={{ marginTop: '1.5rem' }}
        />
      )}
      {error && (
        <InlineNotification
          kind="error"
          title="Error"
          subtitle={error}
          lowContrast
          style={{ marginTop: '1.5rem' }}
        />
      )}
    </div>
  );
};

export default Profile;
