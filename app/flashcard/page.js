// 'use client'

// import { useUser } from "@clerk/nextjs";
// import { useEffect, useState } from "react";
// import { collection, doc, getDocs } from "firebase/firestore";
// import { db } from "@/firebase";
// import { useSearchParams } from "next/navigation";
// import { Box, Container, Typography, Grid, Card, CardActionArea, CardContent } from "@mui/material";

// export default function Flashcard() {
//     const { isLoaded, isSignedIn, user } = useUser();
//     const [flashcards, setFlashcards] = useState([]);
//     const [flipped, setFlipped] = useState([]);

//     // Extract name from URL query parameters
//     const searchParams = useSearchParams();
//     const search = searchParams.get('id');  // Get the flashcard set name

//     useEffect(() => {
//         async function getFlashcard() {
//             if (!search || !user) return;
//             const colRef = collection(doc(collection(db, 'users'), user.id), search);
//             const docs = await getDocs(colRef);
//             const flashcards = [];

//             docs.forEach((doc) => {
//                 flashcards.push({ id: doc.id, ...doc.data() });
//             });
//             setFlashcards(flashcards);
//         }
//         getFlashcard();
//     }, [user, search]);

//     const handleCardClick = (id) => {
//         setFlipped((prev) => ({
//             ...prev,
//             [id]: !prev[id],
//         }));
//     };

//     if (!isLoaded || !isSignedIn) {
//         return <></>;
//     }

//     return (
//         <Container maxWidth="100vw">
//             {/* Flashcard Set Title */}
//             <Typography
//                 variant="h4"
//                 sx={{
//                     mt: 4,
//                     mb: 2,
//                     textAlign: 'center',
//                     color: '#333',
//                     fontWeight: 'bold'
//                 }}
//             >
//                 {search || "Untitled"} {/* Display the flashcard set name as the title */}
//             </Typography>

//             <Grid container spacing={3} sx={{ mt: 4 }}>
//                 {flashcards.map((flashcard, index) => (
//                     <Grid item xs={12} sm={6} md={4} key={index}>
//                         <Card>
//                             <CardActionArea onClick={() => handleCardClick(index)}>
//                                 <CardContent>
//                                     <Box sx={{
//                                         perspective: '1000px',
//                                         '& > div': {
//                                             transition: 'transform 0.6s',
//                                             transformStyle: 'preserve-3d',
//                                             position: 'relative',
//                                             width: '100%',
//                                             height: '200px',
//                                             boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
//                                             transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
//                                         },
//                                         '& > div > div': {
//                                             position: 'absolute',
//                                             width: '100%',
//                                             height: '100%',
//                                             backfaceVisibility: 'hidden',
//                                             display: 'flex',
//                                             justifyContent: 'center',
//                                             alignItems: 'center',
//                                             padding: 2,
//                                             boxSizing: 'border-box',
//                                         },
//                                         '& > div > div:nth-of-type(2)': {
//                                             transform: 'rotateY(180deg)',
//                                         },
//                                     }}>
//                                         <div>
//                                             <div>
//                                                 <Typography variant="h5" component="div">
//                                                     {flashcard.front}
//                                                 </Typography>
//                                             </div>
//                                             <div>
//                                                 <Typography variant="h5" component="div">
//                                                     {flashcard.back}
//                                                 </Typography>
//                                             </div>
//                                         </div>
//                                     </Box>
//                                 </CardContent>
//                             </CardActionArea>
//                         </Card>
//                     </Grid>
//                 ))}
//             </Grid>
//         </Container>
//     );
// }


'use client'

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useSearchParams } from "next/navigation";
import { Box, Container, Typography, Grid, Card, CardActionArea, CardContent } from "@mui/material";
import { styled } from '@mui/material/styles';

const GradientContainer = styled(Container)(({ theme }) => ({
  background: 'linear-gradient(to right, #ff6ec4, #7873f5)',
  borderRadius: '10px',
  padding: theme.spacing(4),
  minHeight: '100vh',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
  },
  overflow: 'hidden',
}));

const FlashcardContainer = styled(Box)(({ theme }) => ({
  perspective: '1000px',
  height: '100%',
}));

const StyledFlashcard = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '200px',
  position: 'relative',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.6s',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  backgroundColor: '#ffffff',
}));

const FlashcardSide = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  textAlign: 'center',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  borderRadius: '12px',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const FlashcardFront = styled(FlashcardSide)(({ theme }) => ({
  backgroundColor: '#f9f9f9',
}));

const FlashcardBack = styled(FlashcardSide)(({ theme }) => ({
  backgroundColor: '#e0e0e0',
  transform: 'rotateY(180deg)',
}));

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);

    const searchParams = useSearchParams();
    const search = searchParams.get('id');  // Get the flashcard set name

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return;
            const colRef = collection(doc(collection(db, 'users'), user.id), search);
            const docs = await getDocs(colRef);
            const flashcards = [];

            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() });
            });
            setFlashcards(flashcards);
        }
        getFlashcard();
    }, [user, search]);

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    if (!isLoaded || !isSignedIn) {
        return <></>;
    }

    return (
        <GradientContainer maxWidth="100vw">
            {/* Flashcard Set Title */}
            <Typography
                variant="h4"
                sx={{
                    mt: 4,
                    mb: 2,
                    textAlign: 'center',
                    color: '#fff',
                    fontWeight: 'bold'
                }}
            >
                {search || "Untitled"} {/* Display the flashcard set name as the title */}
            </Typography>

            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <StyledCard>
                            <CardActionArea onClick={() => handleCardClick(index)}>
                                <CardContent>
                                    <FlashcardContainer>
                                        <StyledFlashcard
                                            sx={{
                                                transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                            }}
                                        >
                                            <FlashcardFront>
                                                <Typography variant="h5">
                                                    {flashcard.front}
                                                </Typography>
                                            </FlashcardFront>
                                            <FlashcardBack>
                                                <Typography variant="h5">
                                                    {flashcard.back}
                                                </Typography>
                                            </FlashcardBack>
                                        </StyledFlashcard>
                                    </FlashcardContainer>
                                </CardContent>
                            </CardActionArea>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
        </GradientContainer>
    );
}
