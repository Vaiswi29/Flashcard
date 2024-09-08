// import { NextResponse } from "next/server";
// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const formatAmountForStripe = (amount) => {
//     return Math.round(amount * 100);
// }

// export async function GET(req) {
//     const searchParams = req.nextUrl.searchParams;
//     const session_id = searchParams.get('session_id');

//     try {
//         const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
//         return NextResponse.json(checkoutSession);
//     } catch (error) {
//         console.error('Error retrieving checkout session:', error);
//         return NextResponse.json({ error: { message: error.message } }, { status: 500 });
//     }
// }

// export async function POST(req) {
//     const { productName, amount } = await req.json(); // Get productName and amount from the request body
//     const origin = req.headers.get("origin");

//     const params = {
//         mode: 'payment', // 'subscription' if you want recurring payments
//         payment_method_types: ['card'],
//         line_items: [
//             {
//                 price_data: {
//                     currency: 'usd',
//                     product_data: {
//                         name: productName,
//                     },
//                     unit_amount: formatAmountForStripe(amount),
//                 },
//                 quantity: 1,
//             },
//         ],
//         success_url: `${origin}/result?session_id={CHECKOUT_SESSION_ID}`,
//         cancel_url: `${origin}/result?session_id={CHECKOUT_SESSION_ID}`,
//     };

//     try {
//         const checkoutSession = await stripe.checkout.sessions.create(params);
//         return NextResponse.json(checkoutSession, { status: 200 });
//     } catch (error) {
//         console.error("Error creating checkout session:", error);
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const formatAmountForStripe = (amount) => {
    return Math.round(amount * 100);
};

// Setup Nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can change to your preferred email service
    auth: {
        user: process.env.EMAIL_USERNAME, // Your email address for sending the confirmation
        pass: process.env.EMAIL_PASSWORD  // Your email password or app-specific password
    }
});

export async function POST(req) {
    // Parsing product information and customer email from the request body
    const { productName, amount, customerEmail } = await req.json(); // customerEmail should be sent from the frontend
    const origin = req.headers.get("origin");

    const params = {
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: productName,
                    },
                    unit_amount: formatAmountForStripe(amount),
                },
                quantity: 1,
            },
        ],
        success_url: `${origin}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/result?session_id={CHECKOUT_SESSION_ID}`,
        customer_email: customerEmail // Optional: Use this to send email receipt via Stripe
    };

    try {
        // Create the Stripe checkout session
        const checkoutSession = await stripe.checkout.sessions.create(params);

        // Send a confirmation email after the session is created
        const mailOptions = {
            from: process.env.EMAIL_USERNAME, // Your sending email
            to: customerEmail, // Customer email address for the confirmation
            subject: 'Payment Confirmation',
            text: `Thank you for your payment of $${amount}. Your payment for ${productName} was successful.`,
        };

        await transporter.sendMail(mailOptions); // Send the email

        // Return the Stripe session object
        return NextResponse.json(checkoutSession, { status: 200 });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
