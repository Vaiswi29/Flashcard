//  'use client'
// import { useUser } from "@clerk/nextjs";
// import { useEffect, useState } from "react";
// import { collection, doc, getDoc, setDoc } from "firebase/firestore";
// import { db } from "@/firebase";
// import { useRouter } from "next/navigation";
// import { CardActionArea, Container, Grid, Card, CardContent, Typography } from "@mui/material";
// import { styled } from '@mui/material/styles';

// const GradientContainer = styled(Container)(({ theme }) => ({
//   background: 'linear-gradient(to right, #ff6ec4, #7873f5)',
//   borderRadius: '10px',
//   padding: theme.spacing(4),
//   minHeight: '100vh',
// }));

// const GradientCard = styled(Card)(({ theme }) => ({
//   background: 'white',
//   borderRadius: '10px',
//   boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//   transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//   '&:hover': {
//     transform: 'scale(1.05)',
//     boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
//   }
// }));

// const Title = styled(Typography)(({ theme }) => ({
//   color: 'white',
//   textAlign: 'center',
//   marginBottom: theme.spacing(4),
//   fontWeight: 'bold',
//   fontSize: '2rem',
// }));

// export default function Flashcards() {
//     const { isLoaded, isSignedIn, user } = useUser();
//     const [flashcards, setFlashcards] = useState([]);
//     const router = useRouter();

//     useEffect(() => {
//         async function getFlashcards() {
//             if (!user) return;
//             const docRef = doc(collection(db, 'users'), user.id);
//             const docSnap = await getDoc(docRef);

//             if (docSnap.exists()) {
//                 const collections = docSnap.data().flashcards || [];
//                 setFlashcards(collections);
//             }
//             else {
//                 await setDoc(docRef, { flashcards: [] });
//             }
//         }
//         getFlashcards();
//     }, [user])

//     if (!isLoaded || !isSignedIn) {
//         return <></>;
//     }

//     const handleCardClick = (id) => {
//         router.push(`/flashcard?id=${id}`);
//     }

//     return (
//         <GradientContainer maxWidth="100vw">
//             <Title>MY FLASHCARDS</Title>
//             <Grid container spacing={3} sx={{ mt: 4 }}>
//                 {flashcards.map((flashcard, index) => {
//                     return (
//                         <Grid item xs={12} sm={6} md={4} key={index}>
//                             <GradientCard>
//                                 <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
//                                     <CardContent>
//                                         <Typography variant="h6" align="center">
//                                             {flashcard.name}
//                                         </Typography>
//                                     </CardContent>
//                                 </CardActionArea>
//                             </GradientCard>
//                         </Grid>
//                     );
//                 })}
//             </Grid>
//         </GradientContainer>
//     );
// }

'use client'
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { CardActionArea, Container, Grid, Card, CardContent, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { styled } from '@mui/material/styles';
import { FaTrash } from 'react-icons/fa'; // Import the trash icon from react-icons

const GradientContainer = styled(Container)(({ theme }) => ({
  background: 'linear-gradient(to right, #ff6ec4, #7873f5)',
  borderRadius: '10px',
  padding: theme.spacing(4),
  minHeight: '100vh',
}));

const GradientCard = styled(Card)(({ theme }) => ({
  background: 'white',
  borderRadius: '12px',
  boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  overflow: 'hidden',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
  },
}));

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
}));

const Title = styled(Typography)(({ theme }) => ({
  color: 'white',
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  fontWeight: 'bold',
  fontSize: '2rem',
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  color: theme.palette.error.main,
  transition: 'color 0.3s ease',
  '&:hover': {
    color: theme.palette.error.dark,
  }
}));

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFlashcard, setSelectedFlashcard] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return;
            const docRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || [];
                setFlashcards(collections);
            } else {
                await setDoc(docRef, { flashcards: [] });
            }
        }
        if (isLoaded && isSignedIn) {
            getFlashcards();
        }
    }, [isLoaded, isSignedIn, user]);

    if (!isLoaded || !isSignedIn) {
        return <></>;
    }

    const handleCardClick = (id) => {
        console.log('Navigating to flashcard with id:', id); // Log the id
        router.push(`/flashcard?id=${id}`);
    }
    

    const handleOpenDialog = (flashcardName) => {
        setSelectedFlashcard(flashcardName);
        setOpenDialog(true);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedFlashcard(null);
    }

    const handleDelete = async () => {
        if (!isLoaded || !isSignedIn || !user || !selectedFlashcard) return;
        const docRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || [];
            const updatedCollections = collections.filter((flashcard) => flashcard.name !== selectedFlashcard);
            await updateDoc(docRef, { flashcards: updatedCollections });
            setFlashcards(updatedCollections);
        }

        handleCloseDialog();
    };

    return (
        <GradientContainer maxWidth="100vw">
            <Title>MY FLASHCARDS</Title>
            <Button variant="contained" href="\generate"
            sx={{ backgroundColor: 'white', color: '#4A148C', '&:hover': { backgroundColor: '#B39DDB' } }}>
                    Generate new flashcards
            </Button>
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <GradientCard>
                            <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                <CardContentStyled>
                                    <Typography variant="h6" align="center">
                                        {flashcard.name}
                                    </Typography>
                                </CardContentStyled>
                            </CardActionArea>
                            <DeleteButton onClick={() => handleOpenDialog(flashcard.name)}>
                                <FaTrash />
                            </DeleteButton>
                        </GradientCard>
                    </Grid>
                ))}
            </Grid>

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this flashcard?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary" autoFocus>
                        Yes, Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </GradientContainer>
    );
}
