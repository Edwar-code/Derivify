'use client';

import { useState, useEffect } from 'react';

export default function TermsAndConditionsPage() {
    const [date, setDate] = useState('');

    useEffect(() => {
        // Sets the date once the component mounts on the client
        setDate(new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }));
    }, []);

    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    Terms and Conditions
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Last updated: {date || 'Loading...'}
                </p>
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold text-primary mb-3">
                        Introduction
                    </h2>
                    <p className="text-foreground/80 leading-relaxed">
                        Welcome to Derivify. By accessing or using our website and services, you agree to be bound by the following terms and conditions. Please read them carefully.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-primary mb-3">
                        Use of Our Services
                    </h2>
                    <p className="text-foreground/80 leading-relaxed">
                        You must be at least 18 years old to create an account and use our services. By using our services, you represent and warrant that you meet this age requirement and have the legal capacity to enter into this agreement.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-primary mb-3">
                        User Responsibilities
                    </h2>
                    <p className="text-foreground/80 leading-relaxed">
                        You are solely responsible for maintaining the confidentiality of your account credentials, including your password. Furthermore, you are responsible for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-primary mb-3">
                        Limitation of Liability
                    </h2>
                    <p className="text-foreground/80 leading-relaxed">
                        To the fullest extent permitted by law, Derivify shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, arising from your use of our services.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-primary mb-3">
                        Changes to Terms
                    </h2>
                    <p className="text-foreground/80 leading-relaxed">
                        We reserve the right to modify these terms at any time. We will notify you of any material changes by posting the new terms on this page and updating the "Last updated" date. Your continued use of the services after such changes constitutes your acceptance of the new terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-primary mb-3">
                        Contact Us
                    </h2>
                    <p className="text-foreground/80 leading-relaxed">
                        If you have any questions about these Terms and Conditions, please contact us at: <a href="mailto:support@derivify.example.com" className="text-primary font-medium hover:underline">support@derivify.example.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
}