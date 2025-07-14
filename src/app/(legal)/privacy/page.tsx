'use client';

import { useState, useEffect } from 'react';
import styles from './PrivacyPolicy.module.css'; // Importing CSS module for styling

export default function PrivacyPolicyPage() {
    const [date, setDate] = useState('');

    useEffect(() => {
        setDate(new Date().toLocaleDateString());
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.date}>Last updated: {date || '...'}</p>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Introduction</h2>
                <p>Welcome to Derivify. We are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your information.</p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Information We Collect</h2>
                <ul className={styles.list}>
                    <li>Personal Information: Name, email, etc.</li>
                    <li>Usage Data: Information on how you use our services.</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>How We Use Your Information</h2>
                <p>We use your information to provide and improve our services, communicate with you, and ensure compliance with legal obligations.</p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Your Rights</h2>
                <p>You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.</p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:support@derivify.example.com">support@derivify.example.com</a></p>
            </section>
        </div>
    );
}
