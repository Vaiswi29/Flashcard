// 'use client';

// import { useUser } from "@clerk/nextjs";
// import { Container, Box, Typography, TextField, Paper, Button, Grid, CardActionArea, CardContent, DialogTitle, DialogContent, DialogActions, Dialog, DialogContentText, Card } from "@mui/material";
// import { writeBatch, collection, doc, getDoc } from "firebase/firestore";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { db } from "@/firebase";

// export default function Generate() {
//     const { isLoaded, isSignedIn, user } = useUser();
//     const [flashcards, setFlashcards] = useState([]);
//     const [flipped, setFlipped] = useState([]);
//     const [text, setText] = useState('');
//     const [name, setName] = useState('');
//     const [open, setOpen] = useState(false);
//     const router = useRouter();

//     const handleSubmit = async () => {
//         fetch('api/generate', {
//             method: 'POST',
//             body: text,
//         })
//             .then((res) => res.json())
//             .then(data => setFlashcards(data));
//     }

//     const handleCardClick = (id) => {
//         setFlipped((prev) => ({
//             ...prev,
//             [id]: !prev[id],
//         }));
//     }

//     const handleOpen = () => {
//         setOpen(true);
//     }
//     const handleClose = () => {
//         setOpen(false);
//     }

//     const saveFlashcards = async () => {
//         if (!name) {
//             alert('Please enter a name for your deck');
//             return;
//         }

//         const batch = writeBatch(db);
//         const userDocRef = doc(collection(db, 'users'), user.id);
//         const docSnap = await getDoc(userDocRef);

//         if (docSnap.exists()) {
//             const collections = docSnap.data().flashcards || [];
//             if (collections.find((f) => f.name === name)) {
//                 alert('Flashcard collection with the same name already exists.');
//                 return;
//             } else {
//                 collections.push({ name });
//                 batch.set(userDocRef, { flashcards: collections }, { merge: true });
//             }
//         }
//         else {
//             batch.set(userDocRef, { flashcards: [{ name }] });
//         }

//         const colRef = collection(userDocRef, name);
//         flashcards.forEach((flashcard) => {
//             const cardDocRef = doc(colRef);
//             batch.set(cardDocRef, flashcard);
//         });

//         await batch.commit();
//         handleClose();
//         router.push('/flashcards');
//     }

//     return (
//         <Container maxWidth="md">
//             <Box
//                 sx={{
//                     mt: 4,
//                     mb: 6,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     background: 'linear-gradient(135deg, #a3c2f7 30%, #f9a9b6 90%)',
//                     padding: '40px',
//                     borderRadius: '15px',
//                     boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
//                 }}
//             >
//                 <Typography
//                     variant="h3"
//                     sx={{
//                         color: '#333',
//                         fontWeight: 'bold',
//                         textAlign: 'center',
//                         mb: 3,
//                         textShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)'
//                     }}
//                 >
//                     Generate Flashcards
//                 </Typography>
//                 <Paper
//                     sx={{
//                         p: 4,
//                         width: '100%',
//                         borderRadius: '10px',
//                         boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)',
//                         backgroundColor: 'rgba(255, 255, 255, 0.95)',
//                         backdropFilter: 'blur(10px)'
//                     }}
//                 >
//                     <TextField
//                         value={text}
//                         onChange={(e) => setText(e.target.value)}
//                         label="Enter Text"
//                         fullWidth
//                         multiline
//                         rows={4}
//                         variant="outlined"
//                         sx={{ mb: 2, backgroundColor: '#f5f5f5', borderRadius: '5px' }}
//                     />
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={handleSubmit}
//                         fullWidth
//                         sx={{
//                             backgroundColor: '#5B1455', // Change this to the color you prefer
//                             fontWeight: 'bold',
//                             '&:hover': {
//                                 backgroundColor: '#143E5B', // Adjust the hover color accordingly
//                             }
//                         }}
//                     >
//                         Generate
//                     </Button>

//                 </Paper>
//             </Box>
//             {flashcards.length > 0 &&
//                 <Box sx={{ mt: 4 }}>
//                     <Typography
//                         variant="h5"
//                         sx={{
//                             mb: 3,
//                             color: '#333',
//                             textShadow: '1px 1px 5px rgba(0, 0, 0, 0.1)'
//                         }}
//                     >
//                         Flashcard Preview
//                     </Typography>
//                     <Grid container spacing={3}>
//                         {flashcards.map((flashcard, index) => (
//                             <Grid item xs={12} sm={6} md={4} key={index}>
//                                 <Card
//                                     sx={{
//                                         transition: 'transform 0.6s',
//                                         transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
//                                         perspective: '1000px',
//                                         '&:hover': {
//                                             transform: flipped[index] ? 'rotateY(180deg) scale(1.05)' : 'rotateY(0deg) scale(1.05)',
//                                             boxShadow: '0px 15px 25px rgba(0, 0, 0, 0.3)',
//                                         }
//                                     }}
//                                 >
//                                     <CardActionArea onClick={() => { handleCardClick(index) }}>
//                                         <CardContent>
//                                             <Box sx={{
//                                                 position: 'relative',
//                                                 height: '200px',
//                                                 width: '100%',
//                                                 display: 'flex',
//                                                 justifyContent: 'center',
//                                                 alignItems: 'center',
//                                                 backgroundColor: '#fff',
//                                                 borderRadius: '10px',
//                                                 boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
//                                                 transformStyle: 'preserve-3d',
//                                             }}>
//                                                 <Typography
//                                                     variant="h5"
//                                                     component="div"
//                                                     sx={{
//                                                         textAlign: 'center',
//                                                         color: '#333',
//                                                         fontWeight: 'bold',
//                                                         backfaceVisibility: 'hidden',
//                                                         position: 'absolute',
//                                                         width: '100%',
//                                                         height: '100%',
//                                                         display: 'flex',
//                                                         justifyContent: 'center',
//                                                         alignItems: 'center',
//                                                         padding: '20px',
//                                                         boxSizing: 'border-box',
//                                                         transform: 'rotateY(0deg)',
//                                                     }}
//                                                 >
//                                                     {flashcard.front}
//                                                 </Typography>
//                                                 <Typography
//                                                     variant="h5"
//                                                     component="div"
//                                                     sx={{
//                                                         textAlign: 'center',
//                                                         color: '#333',
//                                                         fontWeight: 'bold',
//                                                         backfaceVisibility: 'hidden',
//                                                         position: 'absolute',
//                                                         width: '100%',
//                                                         height: '100%',
//                                                         display: 'flex',
//                                                         justifyContent: 'center',
//                                                         alignItems: 'center',
//                                                         padding: '20px',
//                                                         boxSizing: 'border-box',
//                                                         transform: 'rotateY(180deg)',
//                                                     }}
//                                                 >
//                                                     {flashcard.back}
//                                                 </Typography>
//                                             </Box>
//                                         </CardContent>
//                                     </CardActionArea>
//                                 </Card>
//                             </Grid>
//                         ))}
//                     </Grid>
//                     <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
//                         <Button
//                             variant="contained"
//                             color="secondary"
//                             onClick={handleOpen}
//                             sx={{
//                                 padding: '10px 20px',
//                                 backgroundColor: '#e91e63',
//                                 fontWeight: 'bold',
//                                 borderRadius: '25px',
//                                 '&:hover': {
//                                     backgroundColor: '#d81b60',
//                                 }
//                             }}
//                         >
//                             Save
//                         </Button>
//                     </Box>
//                 </Box>
//             }
//             <Dialog open={open} onClose={handleClose}>
//                 <DialogTitle sx={{ fontWeight: 'bold' }}>Save Flashcards</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText sx={{ mb: 2 }}>
//                         Please enter the name of the deck you want to save the flashcards to.
//                     </DialogContentText>
//                     <TextField
//                         autoFocus
//                         margin="dense"
//                         label="Collection Name"
//                         type="text"
//                         fullWidth
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         variant="outlined"
//                         sx={{ mb: 2 }}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose} sx={{ fontWeight: 'bold' }}>Cancel</Button>
//                     <Button onClick={saveFlashcards} sx={{ fontWeight: 'bold' }}>Save</Button>
//                 </DialogActions>
//             </Dialog>
//         </Container>
//     );
// }

'use client'

import { useUser } from "@clerk/nextjs";
import { Box, Container, TextField, Typography, Paper, Button, Grid, Card, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { writeBatch, collection, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { db } from "@/firebase";

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        fetch('api/generate', {
            method: 'POST',
            body: text,
        })
            .then((res) => res.json())
            .then((data) => setFlashcards(data));
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name');
            return;
        }
        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || [];
            if (collections.find((f) => f.name === name)) {
                alert('Flashcard collection with the same name already exists');
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
        <Container>
            <Box sx={{
                mt: 4,
                mb: 6,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: 'linear-gradient(135deg, #a3c2f7 30%, #f9a9b6 90%)',
                padding: 4,
                borderRadius: 2,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
            }}>
                <Typography variant="h4" sx={{ mb: 4, color: '#333' }}>
                    Generate Flashcards
                </Typography>
                <Paper sx={{ p: 4, width: '100%' }}>
                    <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        label="Enter text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        fullWidth
                        sx={{
                            backgroundColor: '#62239e', // Dark purple color
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#9e2392', // Slightly darker purple for hover effect
                            }
                        }}
                    >
                        Generate
                    </Button>
                </Paper>
            </Box>
            {flashcards.length > 0 && <Box sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ mb: 3 }}>
                    Flashcards Preview
                </Typography>
                <Grid container spacing={3}>
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea onClick={() => handleCardClick(index)}>
                                    <CardContent>
                                        <Box sx={{
                                            perspective: '1000px',
                                            '& > div': {
                                                transition: 'transform 0.6s',
                                                transformStyle: 'preserve-3d',
                                                position: 'relative',
                                                width: '100%',
                                                height: '200px',
                                                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                                transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)'
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
                                            },
                                            '& > div > div:nth-of-type(2)': {
                                                transform: 'rotateY(180deg)'
                                            },
                                        }}>
                                            <div>
                                                <div>
                                                    <Typography variant="h5" component="div">
                                                        {flashcard.front}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="h5" component="div">
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
                    <Button variant="contained" color='secondary' onClick={handleOpen}>
                        Save
                    </Button>
                </Box>
            </Box>
            }
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
