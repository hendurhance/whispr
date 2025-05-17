import React from 'react';
import { Link } from 'react-router-dom';
import PublicTemplate from '../templates/PublicTemplate';
import useLinks from '../hooks/useLinks';

const PrivacyPage: React.FC = () => {
  // Auto-scroll to top on page load
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get links from hook for the terms of service link
  const { footerColumns } = useLinks();
  const termsLink = footerColumns
    .find(column => column.title === "Legal")
    ?.links?.find(link => link.text === "Terms of Use")?.href || "/terms";

  // Get contact email from the hook
  const contactEmail = footerColumns
    .find(column => column.title === "Community")
    ?.links?.find(link => link.text === "Contact Us")?.href.replace("mailto:", "") || "privacy@whispr.app";

  return (
    <PublicTemplate>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-text-bright mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-text-normal">
          <section>
            <p className="mb-4">Last Updated: May 17, 2025</p>
            <p>
              At Whispr, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-bright mb-4">1. Collection of Your Information</h2>
            <p className="mb-4">We may collect information about you in a variety of ways. The information we may collect via the Whispr platform includes:</p>
            
            <h3 className="text-xl font-medium text-text-bright mt-6 mb-3">1.1 Personal Data</h3>
            <p className="mb-4">When you register with us, we collect:</p>
            <ul className="pl-8 space-y-2">
              <li>Email address</li>
              <li>Username</li>
              <li>Display name</li>
              <li>Profile picture (optional)</li>
            </ul>
            
            <h3 className="text-xl font-medium text-text-bright mt-6 mb-3">1.2 Derivative Data</h3>
            <p className="mb-4">
              Information our servers automatically collect when you access the platform, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the application.
            </p>
            
            <h3 className="text-xl font-medium text-text-bright mt-6 mb-3">1.3 Message Content</h3>
            <p className="mb-4">
              The content of anonymous messages you receive through the platform is stored in our database. While senders remain anonymous to you, we maintain certain identifiers in our system for moderation and safety purposes.
            </p>
            
            <h3 className="text-xl font-medium text-text-bright mt-6 mb-3">1.4 Mobile Device Data</h3>
            <p>
              Device information such as your mobile device ID, model, manufacturer, and information about the location of your device, if you access the platform from a mobile device.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-bright mb-4">2. Use of Your Information</h2>
            <p className="mb-4">Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the platform to:</p>
            <ul className="pl-8 space-y-2">
              <li>Create and manage your account</li>
              <li>Compile anonymous statistical data and analysis for use internally</li>
              <li>Deliver targeted advertising, newsletters, and other information regarding promotions and the platform to you</li>
              <li>Email you regarding your account</li>
              <li>Enable user-to-user communications (while maintaining anonymity for senders)</li>
              <li>Fulfill and manage your account and any orders or requests for services</li>
              <li>Generate a personal profile about you to make future visits to the platform more personalized</li>
              <li>Increase the efficiency and operation of the platform</li>
              <li>Monitor and analyze usage and trends to improve your experience with the platform</li>
              <li>Notify you of updates to the platform</li>
              <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity</li>
              <li>Process payments and refunds</li>
              <li>Resolve disputes and troubleshoot problems</li>
              <li>Respond to product and customer service requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-bright mb-4">3. Disclosure of Your Information</h2>
            <p className="mb-4">We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
            
            <h3 className="text-xl font-medium text-text-bright mt-6 mb-3">3.1 By Law or to Protect Rights</h3>
            <p className="mb-4">
              If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
            </p>
            
            <h3 className="text-xl font-medium text-text-bright mt-6 mb-3">3.2 Third-Party Service Providers</h3>
            <p className="mb-4">
              We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
            </p>
            
            <h3 className="text-xl font-medium text-text-bright mt-6 mb-3">3.3 Marketing Communications</h3>
            <p className="mb-4">
              With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes.
            </p>
            
            <h3 className="text-xl font-medium text-text-bright mt-6 mb-3">3.4 Interactions with Other Users</h3>
            <p className="mb-4">
              If you interact with other users of the platform, those users may see your username, profile photo, and descriptions of your activity.
            </p>
            
            <h3 className="text-xl font-medium text-text-bright mt-6 mb-3">3.5 Business Transfers</h3>
            <p>
              If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction. We will notify you via email and/or a prominent notice on our website of any change in ownership or uses of your personal information, as well as any choices you may have regarding your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-bright mb-4">4. Anonymity on the Platform</h2>
            <p className="mb-4">
              Whispr is designed to allow users to receive messages from anonymous senders. While the platform maintains anonymity for message senders, please be aware of the following:
            </p>
            <ul className="pl-8 space-y-2">
              <li>We maintain certain technical identifiers that can link messages to their senders in our database for safety, security, and moderation purposes</li>
              <li>In cases of illegal activities, harassment, or threats, we may be legally required to identify senders to law enforcement</li>
              <li>We have automated and manual moderation systems to prevent abuse of the platform</li>
              <li>We cannot guarantee that anonymity will never be compromised due to legal requirements, technical issues, or other unforeseen circumstances</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-bright mb-4">5. Security of Your Information</h2>
            <p className="mb-4">
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
            <p>
              Any information disclosed online is vulnerable to interception and misuse by unauthorized parties. Therefore, we cannot guarantee complete security if you provide personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-bright mb-4">6. Policy for Children</h2>
            <p className="mb-4">
              We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-bright mb-4">7. Data Retention</h2>
            <p className="mb-4">
              We will retain your information for as long as your account is active or as needed to provide you services. If you wish to cancel your account or request that we no longer use your information to provide you services, contact us at the email address below. We will retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-bright mb-4">8. Options Regarding Your Information</h2>
            <h3 className="text-xl font-medium text-text-bright mt-6 mb-3">8.1 Account Information</h3>
            <p className="mb-4">
              You may at any time review or change the information in your account or terminate your account by:
            </p>
            <ul className="pl-8 space-y-2">
              <li>Logging into your account settings and updating your account</li>
              <li>Contacting us using the contact information provided below</li>
            </ul>
            <p className="mt-4 mb-4">
              Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our <Link to={termsLink} className="text-accent-blue hover:underline">Terms of Use</Link> and/or comply with legal requirements.
            </p>
            
            <h3 className="text-xl font-medium text-text-bright mt-6 mb-3">8.2 Emails and Communications</h3>
            <p className="mb-4">
              If you no longer wish to receive correspondence, emails, or other communications from us, you may opt-out by:
            </p>
            <ul className="pl-8 space-y-2">
              <li>Noting your preferences at the time you register your account with the platform</li>
              <li>Logging into your account settings and updating your preferences</li>
              <li>Contacting us using the contact information provided below</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-bright mb-4">9. California Privacy Rights</h2>
            <p className="mb-4">
              California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year.
            </p>
            <p>
              If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-bright mb-4">10. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
              <br /><br />
              Whispr, Inc.<br />
              <a href={`mailto:${contactEmail}`} className="text-accent-blue hover:underline">{contactEmail}</a>
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

export default PrivacyPage;