import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
} from '@mui/material';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const validateEmail = (value: string): string => {
    if (!value) {
      return 'Email is required.';
    }

    // Regular expression for a simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      return 'Invalid email format.';
    }

    return '';
  };

  const validatePassword = (value: string): string => {
    if (!value) {
      return 'Password is required.';
    }

    // Add your custom password validation logic here

    return '';
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const emailValidationResult = validateEmail(email);
    const passwordValidationResult = validatePassword(password);

    // If both email and password are provided and valid, you can proceed with your logic
    if (!emailValidationResult && !passwordValidationResult) {
      console.log('Email:', email);
      console.log('Password:', password);

      // Add your logic for form submission or API call here
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div>
        <Typography component="h1" variant="h5" align="center">
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
                error={!!emailError}
                helperText={emailError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                variant="outlined"
                value={password}
                onChange={handlePasswordChange}
                error={!!passwordError}
                helperText={passwordError}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Submit
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default LoginForm;
