'use client';

import { useState, useEffect } from 'react';

export default function PrivacyPolicyPage() {
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
                    Privacy Policy
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
                        Welcome to Derivify. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This policy outlines how we collect, use, and safeguard your data when you interact with our services.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-primary mb-3">
                        Information We Collect
                    </h2>
                    <p className="text-foreground/80 leading-relaxed mb-4">
                        To provide our services, we may collect the following types of information:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-foreground/80">
                        <li>
                            <span className="font-semibold text-foreground">Personal Information:</span> This includes your name, email address, and any other information you provide during account registration or in your profile.
                        </li>
                        <li>
                            <span className="font-semibold text-foreground">Usage Data:</span> We automatically collect information on how you interact with our services, such as your IP address, browser type, pages visited, and the time and date of your visits.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-primary mb-3">
                        How We Use Your Information
                    </h2>
                    <p className="text-foreground/80 leading-relaxed">
                        Your information is used to operate, maintain, and improve our services. This includes personalizing your experience, communicating with you about your account, and ensuring we comply with all applicable legal and regulatory obligations.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-primary mb-3">
                        Your Rights
                    </h2>
                    <p className="text-foreground/80 leading-relaxed">
                        You have the right to access, update, or request deletion of your personal information at any time. If you wish to exercise any of these rights, please get in touch with our support team.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-primary mb-3">
                        Contact Us
                    </h2>
                    <p className="text-foreground/80 leading-relaxed">
                        If you have any questions or concerns about this Privacy Policy or our data practices, please do not hesitate to contact us at: <a href="mailto:support@derivify.example.com" className="text-primary font-medium hover:underline">support@derivify.example.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
}