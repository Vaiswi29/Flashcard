'use client';

import { useUser } from "@clerk/nextjs";
import { Container, Box, Typography, TextField, Paper, Button, Grid, CardActionArea, CardContent, DialogTitle, DialogContent, DialogActions, Dialog, DialogContentText, Card } from "@mui/material";
import { writeBatch, collection, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { db } from "@/firebase";

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const [paid, setPaid] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkUserPaymentStatus = async () => {
            if (!isLoaded || !isSignedIn) return;
            const userDocRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists() && docSnap.data().paid) {
                setPaid(true);
            }
        };
        checkUserPaymentStatus();
    }, [isLoaded, isSignedIn, user]);

    const handleSubmit = async () => {
        fetch('api/generate', {
            method: 'POST',
            body: text,
        })
            .then((res) => res.json())
            .then(data => setFlashcards(data));
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name for your deck');
            return;
        }

        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);

        if (!paid && docSnap.exists() && docSnap.data().flashcards?.length >= 1) {
            alert('You need to buy a plan to save more than one flashcard collection.');
            router.push('/');  // Redirect to the main page
            return;
        }

        const batch = writeBatch(db);

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || [];
            if (collections.find((f) => f.name === name)) {
                alert('Flashcard collection with the same name already exists.');
                return;
            } else {
                collections.push({ name });
                batch.set(userDocRef, { flashcards: collections }, { merge: true });
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] });
        }

        const colRef = collection(userDocRef, name);
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef);
            batch.set(cardDocRef, flashcard);
        });

        await batch.commit();
        handleClose();
        router.push('/flashcards');
    }

    return (
        <Container sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #00aaff, #ff66cc)', // Corrected blue to pink gradient
            padding: 4,
            maxWidth: "100%",
        }}>
            <Box sx={{
                mt: 4,
                mb: 6,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: '#fff'
            }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#fff' }}>
                    Generate Flashcards
                </Typography>
                <Paper sx={{ p: 4, width: '100%', background: 'rgba(255, 255, 255, 0.8)' }}>
                    <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        label="Enter text"
                        fullWidth
                        multiline
                        rows={8}  // Number of rows; this helps make the textbox taller
                        variant="outlined"
                        sx={{
                            mb: 2,
                            background: '#fff',
                            fontSize: '1.1rem',
                            width: '100%',        // Ensures the TextField is full width within its container
                            height: '200px',      // Sets a specific height to make the TextField larger
                            '& .MuiInputBase-root': {
                                fontSize: '1.2rem',  // Adjusts the font size inside the TextField
                                padding: '12px',     // Increases padding for a more spacious look
                            },
                        }}
                    />

                    <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth sx={{ fontWeight: 'bold', py: 1.5 }}>
                        Submit
                    </Button>
                </Paper>
            </Box>
            {flashcards.length > 0 && (
                <Box sx={{ mt: 4, width: '100%', maxWidth: '1200px' }}>
                    <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold', mb: 3 }}>
                        Flashcards Preview
                    </Typography>
                    <Grid container spacing={4}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{
                                    height: '300px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    backgroundColor: '#ffffff',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        transition: 'transform 0.3s ease-in-out'
                                    }
                                }}>
                                    <CardActionArea onClick={() => handleCardClick(index)}>
                                        <CardContent sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: '16px',
                                        }}>
                                            <Box sx={{
                                                perspective: '1000px',
                                                width: '100%',
                                                height: '200px',
                                                '& > div': {
                                                    transition: 'transform 0.6s',
                                                    transformStyle: 'preserve-3d',
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: '100%',
                                                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                },
                                                '& > div > div': {
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: 2,
                                                    boxSizing: 'border-box',
                                                    fontSize: '1.2rem',
                                                    color: '#333',
                                                },
                                                '& > div > div:nth-of-type(2)': {
                                                    transform: 'rotateY(180deg)',
                                                },
                                            }}>
                                                <div>
                                                    <div>
                                                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                                            {flashcard.front}
                                                        </Typography>
                                                    </div>
                                                    <div>
                                                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                                            {flashcard.back}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" color="secondary" onClick={handleOpen} sx={{ fontWeight: 'bold', py: 1.5 }}>
                            Save
                        </Button>
                    </Box>
                </Box>
            )}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcard</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please enter a name for your flashcard collection</DialogContentText>
                    <TextField autoFocus margin="dense" label='Collection Name' type="text" fullWidth value={name} onChange={(e) => setName(e.target.value)} variant="outlined" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
