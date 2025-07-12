
'use client';

import { useState, useEffect } from 'react';

export default function TermsOfServicePage() {
    const [date, setDate] = useState('');

    useEffect(() => {
        setDate(new Date().toLocaleDateString());
    }, []);

    return (
        <div>
            <h1>Terms of Service</h1>
            <p>Last updated: {date || '...'}</p>
            
            <h2>1. Agreement to Terms</h2>
            <p>By using our services, you agree to be bound by these Terms. If you don’t agree to be bound by these Terms, do not use the Services.</p>

            <h2>2. Description of Service</h2>
            <p>Derivify provides document generation services for proof of address verification. The documents are intended for use as specified and should not be used for illegal purposes. We are not responsible for the misuse of our documents.</p>
            
            <h2>3. Payments</h2>
            <p>We accept payments through Paystack. By making a purchase, you agree to the terms and conditions of our payment processor. All payments are final and non-refundable except as required by law.</p>
            
            <h2>4. User Conduct</h2>
            <p>You agree not to use the Service for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the Service in any way that could damage the Service, the services of Derivify, or the general business of Derivify.</p>

            <h2>5. Disclaimer of Warranties</h2>
            <p>The Service is provided on an "as is" and "as available" basis. Derivify makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            
            <h2>6. Limitation of Liability</h2>
            <p>In no event shall Derivify or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Derivify's website, even if Derivify or a Derivify authorized representative has been notified orally or in writing of the possibility of such damage.</p>

            <h2>7. Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws of Kenya and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
            
            <h2>Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at: support@derivify.example.com</p>
        </div>
    );
}
