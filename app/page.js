'use client'
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography, Alert } from "@mui/material";
import Head from "next/head";
import { keyframes } from '@emotion/react';
import { useRouter } from 'next/navigation';
import { FaUser, FaLightbulb, FaMobileAlt } from 'react-icons/fa'; // FontAwesome icons
import { useState } from 'react'; // Import useState

// Gradient animation keyframes
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Animation for feature box hover effect
const featureHoverAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export default function Home() {
  const router = useRouter();  // Define useRouter here
  const { isSignedIn } = useUser(); // Use the useAuth hook to get the authentication status
  const [error, setError] = useState(''); // State to manage error message


  
  
  const handleSubmit = async (plan) => {
    if (!isSignedIn) {
      setError('You need to log in to choose a plan.');
      return;
    }

    try {
      const response = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      const checkoutSession = await response.json();

      if (response.status !== 200) {
        console.error(`Error: ${checkoutSession.error}`);
        return;
      }

      const stripe = await getStripe();
      if (!stripe) {
        console.error("Stripe instance not found");
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSession.id,
      });

      if (error) {
        console.warn(`Stripe error: ${error.message}`);
      }
    } catch (err) {
      console.error("An error occurred during checkout:", err.message);
    }
  };

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/generate');
    } else {
      setError('You need to log in to get started.');
    }
  };

  return (
    <Container maxWidth="100vw" disableGutters>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from your text with ease using our AI-powered platform." />
      </Head>

      <AppBar position="static" sx={{ backgroundColor: '#1C1C1E' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: 'Montserrat, sans-serif', color: '#fff' }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          height: '100vh',
          background: 'linear-gradient(-45deg, #FF4081, #4A90E2)',
          backgroundSize: '400% 400%',
          animation: `${gradientAnimation} 15s ease infinite`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', fontSize: '4rem' }}>
          Flashcard SaaS
        </Typography>
        <Typography variant="h5" sx={{ maxWidth: '800px', mt: 2, fontSize: '1.2rem' }}>
          Create flashcards from your text with ease using our AI-powered platform.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{
            mt: 4,
            backgroundColor: '#fff',
            color: '#FF4081',
            fontWeight: 'bold',
            px: 4,
            py: 2,
            fontSize: '1.2rem',
            borderRadius: 3,
            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: '#FF4081',
              color: '#fff',
              transform: 'translateY(-5px)',
            },
            transition: 'all 0.3s ease',
          }}
          onClick={handleGetStarted}
        // onClick={() => router.push('/generate')}  // Now this will work
        >
          Get Started
        </Button>
        {/* Display error message if not signed in */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      <Box sx={{ py: 10, px: 2, backgroundColor: '#1F1F1F' }}>
        <Container>
          <Typography variant="h3" textAlign="center" sx={{ fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', mb: 6, color: '#51BFDA' }}>
            Features
          </Typography>
          <Grid container spacing={4} >
            {[
              { title: "Easy Text Input", description: "Simply input your text and let our software do the rest.", icon: <FaUser size={30} color='#ABD4F1' /> },
              { title: "Smart Flashcards", description: "Our AI breaks down your text into concise flashcards perfect for studying.", icon: <FaLightbulb size={30} color='#ABD4F1' /> },
              { title: "Accessible Anywhere", description: "Access your flashcards from any device, at any time. Study on the go with ease.", icon: <FaMobileAlt size={30} color='#ABD4F1' /> },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box
                  sx={{
                    p: 3,
                    height: '250px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: '#333',
                    borderRadius: 2,
                    textAlign: 'center',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    animation: `${featureHoverAnimation} 2s infinite`,
                    '&:hover': {
                      transform: 'scale(1.05)',
                      backgroundColor: '#4A4A4A',
                      boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ mb: 1 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', color: '#51BFDA', mb: 1, fontSize: '1.75rem' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
        {/* Add space before the pricing section */}
        <Box sx={{ py: 10, backgroundColor: '#1F1F1F' }}>
          <Container maxWidth="lg">
            <Typography variant="h3" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', color: '#FF4081', fontFamily: 'Montserrat, sans-serif', mb: 6 }}>
              Pricing
            </Typography>
            <Grid container spacing={6} justifyContent="center">
              {[
                { title: "Basic Plan", price: "$5 / month", description: "Access to basic features and functionalities to get started with flashcards.", planType: 'basic' },
                { title: "Pro Plan", price: "$15 / month", description: "Unlock advanced features including personalized flashcards and analytics.", planType: 'pro' },
                { title: "Premium Plan", price: "$30 / month", description: "Get the full suite of features, including premium support and exclusive tools.", planType: 'premium' },
              ].map((plan, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Box
                    sx={{
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      backgroundColor: '#333',
                      color: '#FFF',
                      borderRadius: 2,
                      boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
                        backgroundColor: '#4A4A4A',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif' }}>{plan.title}</Typography>
                      <Typography variant="h4" sx={{ color: '#FF4081', my: 2, fontWeight: 'bold' }}>{plan.price}</Typography>
                      <Typography variant="body1" gutterBottom>{plan.description}</Typography>
                    </div>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleSubmit(plan.planType)}
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        color: '#FF4081',
                        borderColor: '#FF4081',
                        '&:hover': {
                          backgroundColor: '#FF4081',
                          color: '#fff',
                        },
                      }}
                    >
                      Choose Plan
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
            {/* Display error message if not signed in below pricing */}
            {error && (
              <Alert severity="error" sx={{ mt: 4, textAlign: 'center' }}>
                {error}
              </Alert>
            )}

          </Container>
        </Box>
      </Box>
    </Container>
  );
}
