import { SignUp } from "@clerk/nextjs";
import { AppBar, Toolbar, Typography, Button, Link, Box, Container, Grid } from "@mui/material";

export default function SignUpPage() {
    return (
        <Box
            sx={{
                background: 'linear-gradient(135deg, #a3c2f7 30%, #f9a9b6 90%)', // Lightened gradient
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <AppBar position="static" sx={{ backgroundColor: "#3f51b5" }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Left Side */}
                    <Button color="inherit">
                        <Link href="/" underline="none" color="inherit" sx={{ fontSize: '1.5rem' }}>
                            STUDY BUDDY GPT
                        </Link>
                    </Button>

                    {/* Right Side */}
                    <Box sx={{ display: 'flex' }}>
                        <Button color="inherit">
                            <Link href="/sign-in" underline="none" color="inherit">
                                Login
                            </Link>
                        </Button>
                        <Button color="inherit">
                            <Link href="/sign-up" underline="none" color="inherit">
                                Sign Up
                            </Link>
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Grid container sx={{ flex: 1 }} alignItems="center" justifyContent="center">
                <Grid item xs={12} sm={8} md={6} lg={4}>
                    <Container>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 3.5,
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly transparent white background
                                boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)', // Enhanced shadow
                                maxWidth: '100%', // Ensure it fits within the container
                                mx: 'auto', // Center horizontally
                                width: '100%',
                                minHeight: '60vh', // Ensure enough space for centering
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography variant="h4" sx={{ color: '#3f51b5', textAlign: 'center' }}>
                                Join Us!
                            </Typography>
                            <Box
                                sx={{
                                    padding: 4,
                                    borderRadius: 2,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent', // No background color
                                    boxShadow: 'none', // No shadow
                                    width: '100%',
                                    maxWidth: 400, // Ensure it doesn’t stretch too much
                                }}
                            >
                                <SignUp />
                            </Box>
                        </Box>
                    </Container>
                </Grid>
            </Grid>
        </Box>
    );
}
