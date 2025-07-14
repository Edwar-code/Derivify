'use client';

import { useState, useEffect } from 'react';

export default function TermsAndConditionsPage() {
    const [date, setDate] = useState('');

    useEffect(() => {
        setDate(new Date().toLocaleDateString());
    }, []);

    return (
        <div>
            <h1>Terms and Conditions</h1>
            <p>Last updated: {date || '...'}</p>

            <h2>Introduction</h2>
            <p>Welcome to Derivify. By accessing our services, you agree to comply with these Terms and Conditions.</p>

            <h2>Use of Our Services</h2>
            <p>You must be at least 18 years old to use our services...</p>

            <h2>User Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account information...</p>

            <h2>Limitation of Liability</h2>
            <p>Derivify shall not be liable for any indirect, incidental, or consequential damages...</p>

            <h2>Changes to Terms</h2>
            <p>We may update these Terms from time to time...</p>

            <h2>Contact Us</h2>
            <p>If you have any questions about these Terms and Conditions, please contact us at: support@derivify.example.com</p>
        </div>
    );
}
