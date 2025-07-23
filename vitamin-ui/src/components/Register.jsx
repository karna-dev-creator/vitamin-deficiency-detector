import React, { useState } from 'react';
import {
  TextInput,
  Button,
  InlineNotification,
  Select,
  SelectItem,
  TextArea,
  RadioButton,
  RadioButtonGroup
} from '@carbon/react';
import './Register.css';
import { ViewOff, View } from '@carbon/icons-react';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    age: '',
    email: '',
    height: '',
    weight: '',
    gender: '',
    diet_type: '',
    medical_conditions: '',
  });

  const navigate = useNavigate();
  const [showRedirectMsg, setShowRedirectMsg] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email address';
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:"<>?[\]\\;',./`~\-]).{8,}$/.test(formData.password) ){ newErrors.password ='Password must be at least 8 characters and include one uppercase letter, one number, and one special character(Look like this Abcd123@)'}; 
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.age || isNaN(formData.age) || Number(formData.age) <= 0) newErrors.age = 'Valid age required';
    if (!formData.height || Number(formData.height) <= 0) newErrors.height = 'Enter a valid height';
    if (!formData.weight || Number(formData.weight) <= 0) newErrors.weight = 'Enter a valid weight';
    if (!formData.gender) newErrors.gender = 'Select your gender';
    if (!formData.diet_type) newErrors.diet_type = 'Choose a diet type';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };
    const handleRegister = async () => {
    setErrors({});
    setMessage('');
    setShowRedirectMsg(false);

    const isValid = validate();
    if (!isValid) return;

    try {
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message.includes('Phone')) {
          setErrors({ phone: data.message });
        } else if (data.message.includes('email')) {
          setErrors({ email: data.message });
        } else {
          setMessage(data.message || 'Registration failed.');
        }
        return;
      }

      setMessage(data.message || 'Registered successfully!');
      setFormData({
        name: '',
        phone: '',
        password: '',
        confirmPassword: '',
        age: '',
        email: '',
        height: '',
        weight: '',
        gender: '',
        diet_type: '',
        medical_conditions: '',
      });
      setShowRedirectMsg(true);
      setTimeout(() => navigate('/login'), 3000);

    } catch (error) {
      setMessage('Server error. Please try again.');
    }
  };



  return (
    <div className="register-container">
      <div className="register-form">
        <h2 style={{ color: '#0f62fe' }}>Create Your Account</h2>
        <p style={{ marginBottom: '2rem' }}>
          Fill in your personal details to register with the Vitamin Deficiency Detector.
        </p>

        <TextInput
          id="name"
          labelText="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          invalid={!!errors.name}
          invalidText={errors.name}
        />
        <div className="two-column">
          <TextInput
            id="phone"
            labelText="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            invalid={!!errors.phone}
            invalidText={errors.phone}
          />

          <TextInput
            id="email"
            labelText="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            invalid={!!errors.email}
            invalidText={errors.email}
          />
        </div>
        <div className="two-column">
          <div className="password-wrapper">
          <TextInput
              id="password"
              labelText="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              invalid={!!errors.password}
              invalidText={errors.password}
              //helperText="Minimum 8 characters, with 1 uppercase, 1 number & 1 special character"
          />
          <p style={{ fontSize: '0.75rem', color: '#525252', marginTop: '0.25rem' }}>
            Minimum 8 characters, with 1 uppercase, 1 number & 1 special character
          </p>
          <button
              type="button"
              className="icon-button"
              onClick={() => setShowPassword(prev => !prev)}
              aria-label="Toggle password visibility"
          >
              {showPassword ? <ViewOff size={16} /> : <View size={16} />}
          </button>
          </div>

          <div className="password-wrapper">
          <TextInput
              id="confirmPassword"
              labelText="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              invalid={!!errors.confirmPassword}
              invalidText={errors.confirmPassword}
          />
          <button
              type="button"
              className="icon-button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              aria-label="Toggle confirm password visibility"
          >
              {showConfirmPassword ? <ViewOff size={16} /> : <View size={16} />}
          </button>
          </div>
        </div>
        <div className="form-row">
          <TextInput
            id="age"
            labelText="Age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            invalid={!!errors.age}
            invalidText={errors.age}
          />
          <TextInput
            id="height"
            labelText="Height (cm)"
            name="height"
            type="number"
            value={formData.height}
            onChange={handleChange}
            invalid={!!errors.height}
            invalidText={errors.height}
          />
          <TextInput
            id="weight"
            labelText="Weight (kg)"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleChange}
            invalid={!!errors.weight}
            invalidText={errors.weight}
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
        {errors.gender && <div className="error-msg">{errors.gender}</div>}

        <Select
          id="diet_type"
          labelText="Diet Type"
          name="diet_type"
          value={formData.diet_type}
          onChange={handleChange}
          invalid={!!errors.diet_type}
          invalidText={errors.diet_type}
        >
          <SelectItem value="" text="Choose Diet Type" />
          <SelectItem value="Vegetarian" text="Vegetarian" />
          <SelectItem value="Non-Vegetarian" text="Non-Vegetarian" />
          <SelectItem value="Vegan" text="Vegan" />
        </Select>

        <TextArea
          id="medical_conditions"
          labelText="Medical Conditions (optional)"
          name="medical_conditions"
          value={formData.medical_conditions}
          onChange={handleChange}
          placeholder="E.g., Diabetes, Anemia, Thyroid..."
          rows={4}
        />

        <Button
          kind="primary"
          size="lg"
          onClick={handleRegister}
          style={{ marginTop: '2rem' }}
        >
          Register Now
        </Button>

        {message && (
          <InlineNotification
            kind={message.includes('success') ? 'success' : 'error'}
            title="Registration"
            subtitle={message}
            lowContrast
            style={{ marginTop: '1.5rem' }}
          />
        )}
      </div>
    </div>
  );
};

export default Register;