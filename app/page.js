'use client';
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography, Alert } from "@mui/material";
import Head from "next/head";
import { keyframes } from '@emotion/react';
import { useRouter } from 'next/navigation';
import { FaUser, FaLightbulb, FaMobileAlt } from 'react-icons/fa';
import { useState } from 'react';

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
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [error, setError] = useState('');

  // handleSubmit function as defined before
  const handleSubmit = async (plan) => {
    if (!isSignedIn) {
      setError('You need to log in to choose a plan.');
      return;
    }

    // Plan pricing mapping
    const planPricing = {
      basic: { productName: 'Basic Subscription', amount: 5 },
      pro: { productName: 'Pro Subscription', amount: 15 },
      premium: { productName: 'Premium Subscription', amount: 30 },
    };

    const { productName, amount } = planPricing[plan];

    try {
      const response = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName, amount }),
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
        <title>STUDY BUDDY GPT</title>
        <meta name="description" content="Create flashcards from your text with ease using our AI-powered platform." />
      </Head>

      <AppBar position="static" sx={{ backgroundColor: '#1C1C1E' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: 'Montserrat, sans-serif', color: '#fff' }}>
            STUDY BUDDY GPT
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
          STUDY BUDDY GPT
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
        >
          Get Started
        </Button>
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
          <Grid container spacing={4}>
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
      </Box>

      <Box sx={{ py: 10, backgroundColor: '#1F1F1F' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', color: '#FF4081', fontFamily: 'Montserrat, sans-serif', mb: 6 }}>
            Pricing
          </Typography>
          <Grid container spacing={6} justifyContent="center">
            {[
              { title: "Basic Plan", price: "$5 / month", description: "Access to basic features to get started with flashcards.", planType: 'basic' },
              { title: "Pro Plan", price: "$15 / month", description: "Advanced features including smart flashcards and more storage.", planType: 'pro' },
              { title: "Premium Plan", price: "$30 / month", description: "All features plus priority support and exclusive content.", planType: 'premium' },
            ].map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box
                  sx={{
                    p: 4,
                    backgroundColor: '#333',
                    borderRadius: 2,
                    textAlign: 'center',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#51BFDA', fontFamily: 'Montserrat, sans-serif', mb: 2 }}>
                    {plan.title}
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#FF4081', mb: 4 }}>
                    {plan.price}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 4 }}>
                    {plan.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      backgroundColor: '#FF4081',
                      fontWeight: 'bold',
                      fontFamily: 'Montserrat, sans-serif',
                      '&:hover': {
                        backgroundColor: '#ff6584',
                      },
                    }}
                    onClick={() => handleSubmit(plan.planType)}
                  >
                    Choose Plan
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Container>
  );
}

