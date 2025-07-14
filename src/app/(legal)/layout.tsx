'use client';

import { useState, useEffect } from 'react';
import styles from './TermsAndConditions.module.css'; // Importing CSS module for styling

export default function TermsAndConditionsPage() {
    const [date, setDate] = useState('');

    useEffect(() => {
        setDate(new Date().toLocaleDateString());
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Terms and Conditions</h1>
            <p className={styles.date}>Last updated: {date || '...'}</p>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Introduction</h2>
                <p>Welcome to Derivify. By accessing our services, you agree to comply with these Terms and Conditions.</p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Use of Our Services</h2>
                <p>You must be at least 18 years old to use our services. By using our services, you confirm that you meet this requirement.</p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>User Responsibilities</h2>
                <p>You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Limitation of Liability</h2>
                <p>Derivify shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.</p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Changes to Terms</h2>
                <p>We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on this page.</p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Contact Us</h2>
                <p>If you have any questions about these Terms and Conditions, please contact us at: <a href="mailto:support@derivify.example.com">support@derivify.example.com</a></p>
            </section>
        </div>
    );
}
