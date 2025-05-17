import React from 'react';
import { Link } from 'react-router-dom';
import PublicTemplate from '../templates/PublicTemplate';
import useLinks from '../hooks/useLinks';

const TermsPage: React.FC = () => {
    // Auto-scroll to top on page load
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Get links from hook for the privacy policy link
    const { footerColumns } = useLinks();
    const privacyLink = footerColumns
        .find(column => column.title === "Legal")
        ?.links?.find(link => link.text === "Privacy Policy")?.href || "/privacy";

    const contactEmail = footerColumns
        .find(column => column.title === "Community")
        ?.links?.find(link => link.text === "Contact Us")?.href.replace("mailto:", "") || "privacy@whispr.app";

    return (
        <PublicTemplate>
            <div className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-3xl md:text-4xl font-bold text-text-bright mb-8">Terms of Service</h1>

                <div className="space-y-8 text-text-normal">
                    <section>
                        <p className="mb-4">Last Updated: May 17, 2025</p>
                        <p>
                            Welcome to Whispr. Please read these Terms of Service ("Terms") carefully as they contain important information about your legal rights, remedies, and obligations. By accessing or using the Whispr platform, you agree to comply with and be bound by these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-text-bright mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our services. We may update these Terms from time to time, and your continued use constitutes acceptance of those changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-text-bright mb-4">2. Service Description</h2>
                        <p className="mb-4">
                            Whispr provides a platform for users to receive anonymous messages from others through unique, shareable links. Our service allows users to create an account, generate a personal link, and receive messages from people who choose to remain anonymous.
                        </p>
                        <p>
                            While we strive to provide a positive environment, please understand that the anonymous nature of the messages means we cannot guarantee that all content will be appropriate or positive.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-text-bright mb-4">3. User Accounts</h2>
                        <p className="mb-4">
                            To use certain features of our service, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                        </p>
                        <p className="mb-4">
                            You agree to provide accurate and complete information when creating an account and to update your information to keep it accurate and current. We reserve the right to suspend or terminate accounts that contain false or outdated information.
                        </p>
                        <p>
                            Users must be at least 13 years of age to create an account and use our service. If you are under the age of 18, you must have parental consent to use the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-text-bright mb-4">4. Acceptable Use Policy</h2>
                        <p className="mb-4">You agree not to use the service to:</p>
                        <ul className="pl-8 space-y-2">
                            <li>Send or promote content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, invasive of privacy, or otherwise objectionable</li>
                            <li>Impersonate any person or entity or falsely state or misrepresent your affiliation with a person or entity</li>
                            <li>Engage in any activity that could disable, overburden, or impair the proper functioning of the service</li>
                            <li>Attempt to access any other user's account or personal information</li>
                            <li>Use the service for any illegal purpose or in violation of any local, state, national, or international law</li>
                            <li>Collect or store personal data about other users without their explicit consent</li>
                            <li>Engage in bullying, harassment, or any form of harmful behavior towards other users</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-text-bright mb-4">5. Content Moderation</h2>
                        <p className="mb-4">
                            We may, but are not obligated to, monitor or review content posted through our service. We reserve the right to remove any content that violates these Terms or that we find objectionable for any reason, without prior notice.
                        </p>
                        <p>
                            Users can report inappropriate content, and we will review such reports and take appropriate action, which may include removing content and suspending or terminating accounts.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-text-bright mb-4">6. Intellectual Property</h2>
                        <p className="mb-4">
                            The service and its original content, features, and functionality are owned by Whispr and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                        </p>
                        <p>
                            By submitting content to the service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your content in any existing or future media.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-text-bright mb-4">7. Privacy</h2>
                        <p className="mb-4">
                            Your privacy is important to us. Our <Link to={privacyLink} className="text-accent-blue hover:underline">Privacy Policy</Link> explains how we collect, use, and protect your personal information. By using our service, you consent to our collection and use of personal data as explained in our Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-text-bright mb-4">8. Termination</h2>
                        <p className="mb-4">
                            We reserve the right to terminate or suspend your account and access to our service immediately, without prior notice or liability, for any reason, including, without limitation, if you breach these Terms.
                        </p>
                        <p>
                            Upon termination, your right to use the service will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-text-bright mb-4">9. Disclaimer of Warranties</h2>
                        <p className="mb-4">
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                        </p>
                        <p>
                            We do not guarantee that the service will be uninterrupted, secure, or error-free, or that defects will be corrected. We are not responsible for the content, accuracy, or opinions expressed in any user-generated content.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-text-bright mb-4">10. Limitation of Liability</h2>
                        <p>
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WHISPR, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, THAT RESULT FROM THE USE OF, OR INABILITY TO USE, THE SERVICE.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-text-bright mb-4">11. Contact Us</h2>
                        <p>
                            If you have any questions about these Terms, please contact us at <a href={`mailto:${contactEmail}`} className="text-accent-blue hover:underline">{contactEmail}</a>.
                        </p>
                    </section>
                </div>

                <div className="mt-12 text-center">
                    <Link
                        to="/"
                        className="px-6 py-3 bg-gradient-primary rounded-full text-white hover:shadow-glow transition-all"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </PublicTemplate>
    );
};

export default TermsPage;