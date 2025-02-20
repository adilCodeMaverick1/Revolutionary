import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe("pk_test_51QudPP0552vXV384fRNMCm5CD9eAs4GMc8sOL5uOZ5agj6GSGsOLyeGELDx1zOKgPiYyQhWweRKJDL9xoVWJln9600MBzNgYpA");

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Get user token from localStorage (assuming authentication is handled)
        const token = localStorage.getItem("token"); 

        try {
            // Request Payment Intent from Laravel backend
            const { data } = await axios.post(
                "http://127.0.0.1:8000/api/payment-intent",
                { amount: 100 }, // Example amount
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const clientSecret = data.clientSecret;

            // Confirm payment using clientSecret
            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (error) {
                setMessage(`Payment Failed: ${error.message}`);
            } else if (paymentIntent.status === "succeeded") {
                setMessage("Payment Successful! 🎉");
            }
        } catch (err) {
            console.error(err);
            setMessage("Payment failed. Please try again.");
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe || loading}>
                {loading ? "Processing..." : "Pay"}
            </button>
            {message && <p>{message}</p>}
        </form>
    );
};

const Payment = () => (
    <Elements stripe={stripePromise}>
        <CheckoutForm />
    </Elements>
);

export default Payment;
