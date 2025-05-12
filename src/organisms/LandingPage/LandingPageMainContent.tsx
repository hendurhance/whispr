import React, { useState } from 'react';
import Button from '../../atoms/Button';
import FeatureCard from '../../molecules/FeatureCard';
import StepCard from '../../molecules/StepCard';
import PrivacyCard from '../../molecules/PrivacyCard';
import SectionTitle from '../../molecules/SectionTitle';
import PhoneMockup from '../../atoms/PhoneMockup';
import MessagesView from '../Shared/MessageView';
import ProfileView from '../Shared/ProfileView';
import FloatingShapes, { Shape } from '../../molecules/FloatingShapes';
import IconButton from '../../atoms/IconButton';
import FloatingMessagesContainer from '../../molecules/FloatingMessagesContainer';


const DownloadIcon = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" fill="currentColor">
    <g>
      <path d="M407,0H105C47.103,0,0,47.103,0,105v302c0,57.897,47.103,105,105,105h302c57.897,0,105-47.103,105-105V105 C512,47.103,464.897,0,407,0z M482,407c0,41.355-33.645,75-75,75H105c-41.355,0-75-33.645-75-75V105c0-41.355,33.645-75,75-75h302 c41.355,0,75,33.645,75,75V407z"/>
      <path d="M305.646,123.531c-1.729-6.45-5.865-11.842-11.648-15.18c-11.936-6.892-27.256-2.789-34.15,9.151L256,124.166 l-3.848-6.665c-6.893-11.937-22.212-16.042-34.15-9.151h-0.001c-11.938,6.893-16.042,22.212-9.15,34.151l18.281,31.664 L159.678,291H110.5c-13.785,0-25,11.215-25,25c0,13.785,11.215,25,25,25h189.86l-28.868-50h-54.079l85.735-148.498 C306.487,136.719,307.375,129.981,305.646,123.531z"/>
      <path d="M401.5,291h-49.178l-55.907-96.834l-28.867,50l86.804,150.348c3.339,5.784,8.729,9.921,15.181,11.65 c2.154,0.577,4.339,0.863,6.511,0.863c4.332,0,8.608-1.136,12.461-3.361c11.938-6.893,16.042-22.213,9.149-34.15L381.189,341 H401.5c13.785,0,25-11.215,25-25C426.5,302.215,415.285,291,401.5,291z"/>
      <path d="M119.264,361l-4.917,8.516c-6.892,11.938-2.787,27.258,9.151,34.15c3.927,2.267,8.219,3.345,12.458,3.344 c8.646,0,17.067-4.484,21.693-12.495L176.999,361H119.264z"/>
    </g>
  </svg>
);

const WebAccessIcon = () => (
  <svg clipRule="evenodd" fillRule="evenodd" height="20" width="20" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" fill="currentColor">
    <g>
      <circle cx="5.25" cy="5" r=".75"></circle>
      <circle cx="7.75" cy="5" r=".75"></circle>
      <circle cx="10.25" cy="5" r=".75"></circle>
      <path d="m22.75 13v-8.5c0-1.795-1.455-3.25-3.25-3.25-3.842 0-11.158 0-15 0-1.795 0-3.25 1.455-3.25 3.25v15c0 1.795 1.455 3.25 3.25 3.25h7.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-7.5c-.967 0-1.75-.783-1.75-1.75v-15c0-.967.783-1.75 1.75-1.75h15c.967 0 1.75.783 1.75 1.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75z"></path>
      <path d="m22 7.25h-20c-.414 0-.75.336-.75.75s.336.75.75.75h20c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z"></path>
      <path d="m21.457 21.57-2.101-3c-.237-.339-.705-.422-1.044-.184-.339.237-.422.705-.184 1.044l2.1 3c.238.339.706.422 1.045.184.339-.237.422-.705.184-1.044z"></path>
      <path d="m22.067 16.084c-1.708-.986-4.801-2.77-6.47-3.733-.46-.265-1.031-.24-1.466.064-.434.304-.653.833-.561 1.355.334 1.898.953 5.415 1.295 7.357.093.533.494.961 1.02 1.089.526.129 1.078-.065 1.408-.495 0 0 1.754-2.286 1.754-2.286s2.748-.866 2.748-.866c.517-.163.888-.616.947-1.154s-.206-1.061-.675-1.331zm-1.015 1.146-2.682.846c-.147.046-.276.136-.369.258l-1.712 2.232-1.192-6.772z"></path>
    </g>
  </svg>
);


const LandingPageMainContent: React.FC = () => {
  const features = [
    { icon: "💬", title: "Anonymous Messaging", description: "Send and receive messages without revealing your identity.", example: "I've always admired your creativity" },
    { icon: "❓", title: "Anonymous Q&A", description: "Get honest answers to your questions or receive authentic questions.", example: "What inspired you to start your business?" },
    { icon: "🌟", title: "Anonymous Compliments", description: "Spread positivity by sending genuine compliments.", example: "Your kindness makes everyone's day brighter" },
    { icon: "💡", title: "Anonymous Advice", description: "Give or receive unbiased advice without judgment.", example: "Try focusing on one project at a time" },
    { icon: "📊", title: "Anonymous Polls", description: "Create polls and get honest opinions from your audience.", example: "Which new feature should I develop next?" },
    { icon: "🤫", title: "Anonymous Confessions", description: "Share your deepest thoughts or receive genuine confessions.", example: "I'm afraid of failing but too proud to admit it" },
    { icon: "💬", title: "Anonymous Feedback", description: "Receive constructive feedback without fear of judgment.", example: "Your project could use more visuals" },
    { icon: "📝", title: "Anonymous Suggestions", description: "Get creative ideas and suggestions from others anonymously.", example: "You should try hosting a live Q&A session" },
    { icon: "🔒", title: "Anonymous Secrets", description: "Share or discover secrets in a secure, anonymous environment.", example: "I've always wanted to travel the world" },
    { icon: "🗣️", title: "Anonymous Opinions", description: "Express your true thoughts or gather honest opinions.", example: "I think remote work is the future" },
  ];

  const steps = [
    { number: 1, title: "Sign Up", description: "Create an account in seconds. No personal details required—just a username to get started." },
    { number: 2, title: "Share Your Link", description: "Get a unique link to share with your audience on social media, email, or anywhere else." },
    { number: 3, title: "Receive Messages", description: "Start receiving anonymous messages, questions, compliments, and more from your audience." },
    { number: 4, title: "Respond Anonymously", description: "Engage with your audience by responding anonymously, fostering honest conversations." },
  ];

  const privacyFeatures = [
    { icon: "🔒", title: "End-to-End Encryption", description: "All messages are encrypted, ensuring that only you and the recipient can read them." },
    { icon: "🛡️", title: "No Data Tracking", description: "We don't track or store any identifiable data. Your anonymity is guaranteed." },
    { icon: "🌐", title: "Open Source", description: "Whispr's code is open-source, allowing anyone to verify its security and privacy claims." },
    { icon: "🚫", title: "No Ads", description: "Enjoy a clean, ad-free experience with no interruptions or data exploitation." },
  ];

  const profileData = {
    username: 'username',
    promptText: 'send me anonymous messages!',
    placeholderText: 'send me anonymous messages...',
    counterText: '366 people just tapped the button',
    buttonText: 'Get your own messages!',
    onButtonClick: () => console.log('Get your own link')
  };

  const messagesData = [
    {
      id: '1',
      content: 'Your presentation today changed my perspective completely',
      timestamp: '2:45 PM'
    },
    {
      id: '2',
      content: 'What\'s your secret to staying so positive all the time?',
      timestamp: '1:32 PM'
    },
    {
      id: '3',
      content: 'I\'ve always been inspired by your creativity',
      timestamp: '11:20 AM'
    },
    {
      id: '4',
      content: 'Would you consider mentoring someone like me?',
      timestamp: '10:05 AM'
    },
    {
      id: '5',
      content: 'Your work ethic is truly admirable',
      timestamp: 'Yesterday'
    }
  ];

  const [showComingSoon, setShowComingSoon] = useState(false);

  const shapesData:  Shape[]  = [
    {
      id: 'shape1',
      type: 'rectangle',
      position: { top: '15%', left: '10%' },
      size: { width: '5rem', height: '5rem' },
      color: 'bg-gradient-primary',
      rotation: 45,
      duration: 8
    },
    {
      id: 'shape2',
      type: 'circle',
      position: { top: '30%', right: '15%' },
      size: { width: '3rem', height: '3rem' },
      color: 'bg-accent-green',
      duration: 12
    },
    {
      id: 'shape3',
      type: 'triangle',
      position: { bottom: '20%', left: '20%' },
      size: { width: '4rem', height: '4rem' },
      color: 'bg-accent-yellow',
      duration: 10
    },
    {
      id: 'shape4',
      type: 'blob',
      position: { bottom: '15%', right: '25%' },
      size: { width: '6rem', height: '6rem' },
      color: 'bg-gradient-to-r from-secondary to-primary',
      duration: 14
    }
  ];

  const floatingMessagesData = [
    {
      id: 'msg1',
      content: 'I love your new haircut! It really suits you 😊',
      position: { top: '15%', left: '10%' },
      duration: 15
    },
    {
      id: 'msg2',
      content: 'What\'s your favorite movie? I need recommendations!',
      position: { top: '30%', right: '10%' },
      delay: 3,
      duration: 15
    },
    {
      id: 'msg3',
      content: 'Your presentation today was amazing, you really inspired me!',
      position: { bottom: '20%', left: '15%' },
      delay: 6,
      duration: 15
    },
    {
      id: 'msg4',
      content: 'Could you share your thoughts on climate change?',
      position: { bottom: '30%', right: '15%' },
      delay: 9,
      duration: 15
    }
  ];

  const handleReply = (messageId: string) => {
    console.log(`Replying to message ${messageId}`);
  };

  const handleShare = (messageId: string) => {
    console.log(`Sharing message ${messageId}`);
  };

  const handleTabChange = (tabId: string) => {
    console.log(`Changed to tab ${tabId}`);
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="py-24 px-4 md:px-8 relative overflow-hidden text-center">
      {/* Background floating shapes */}
      <FloatingShapes shapes={shapesData} className="z-0" />
      
      {/* Hero content */}
      <div className="relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-5 bg-gradient-primary bg-clip-text text-transparent leading-tight">
          Be anonymous,<br />Be unstoppable
        </h1>
        <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10">
          Welcome to Whispr, the open-source anonymous messaging platform where you can express yourself freely, gather honest feedback, and connect authentically without revealing your identity.
        </p>
        <div className="flex gap-4 justify-center flex-col sm:flex-row">
          <IconButton 
            icon={<DownloadIcon />} 
            variant="primary" 
            showAltText={showComingSoon}
            onClick={() => setShowComingSoon(true)}
            altText="Coming Soon"
          >
            Download for mobile
          </IconButton>
          <IconButton 
            icon={<WebAccessIcon />} 
            variant="secondary"
            onClick={() => window.location.href = '/signup'}
          >
            Get web access
          </IconButton>
        </div>
      </div>
      
      {/* App showcase with floating messages */}
      <div className="relative mt-16 z-10">
        {/* Floating messages around the app image */}
        <FloatingMessagesContainer messages={floatingMessagesData} className="z-20" />
        
        {/* App showcase image */}
        <div className="relative z-10 mx-auto rounded-2xl overflow-hidden">
          <img
            src="https://placehold.co/1000x500/000000/FFFFFF?text=Whispr+App+Interface"
            alt="Whispr App Interface"
            className="w-full max-w-4xl mx-auto"
          />
        </div>
      </div>
    </section>

      {/* Features Section */}
      <section className="py-24 px-4 md:px-8 bg-[#1a1a3a]" id="features">
        <SectionTitle
          title="Share & receive"
          subtitle="Express yourself freely without revealing your identity. Get honest feedback, opinions, and confessions from your audience."
          highlight="anonymously"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* App Showcase Section */}
      <section className="py-24 px-4 md:px-8 relative bg-background-darker">
        <SectionTitle
          title="Designed for"
          subtitle="Share your personal link on social media and receive anonymous messages while maintaining complete privacy."
          highlight="honest interaction"
        />

        <div className="flex flex-col md:flex-row items-center justify-center gap-16 mt-16">
          {/* Share Link Phone */}
          <PhoneMockup>
            <ProfileView {...profileData} />
          </PhoneMockup>

          {/* Messages Phone */}
          <PhoneMockup className="mt-12 md:mt-0">
            <MessagesView
              messages={messagesData}
              unreadCount={15}
              onReply={handleReply}
              onShare={handleShare}
              onTabChange={handleTabChange}
            />
          </PhoneMockup>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 md:px-8 bg-[#1a1a3a]" id="how-it-works">
        <SectionTitle
          title="How it works"
          subtitle="Getting started with Whispr is simple, secure, and takes just minutes."
        />
        <div className="flex flex-wrap justify-center gap-6 mt-12">
          {steps.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </section>

      {/* Privacy & Security Section */}
      <section className="py-24 px-4 md:px-8 relative overflow-hidden" id="privacy">
        <SectionTitle
          title="Privacy & Security First"
          subtitle="Your anonymity and security are our top priorities. Whispr is built to keep your interactions safe and private."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {privacyFeatures.map((feature, index) => (
            <PrivacyCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <div className="px-4 md:px-8 my-24">
        <section className="py-24 px-4 md:px-16 text-center bg-background-lighter rounded-3xl relative overflow-visible">
          {/* Animated shapes - positioned relative to the section but extending outside */}
          <div className="absolute inset-0 w-full h-full">
            {/* Top left shape */}
            <div
              className="absolute -top-10 -left-10 w-28 h-28 rounded-xl bg-gradient-primary rotate-12 opacity-90"
              style={{
                animation: 'float 13s ease-in-out infinite',
                zIndex: 1
              }}
            ></div>

            {/* Top right shape */}
            <div
              className="absolute -top-6 right-[15%] w-16 h-16 rounded-full bg-accent-green opacity-80"
              style={{
                animation: 'float 17s ease-in-out infinite alternate',
                animationDelay: '1s',
                zIndex: 1
              }}
            ></div>

            {/* Bottom left shape - triangle */}
            <div
              className="absolute -bottom-8 left-[20%] w-24 h-24 bg-accent-yellow opacity-80"
              style={{
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                animation: 'float 15s ease-in-out infinite',
                animationDelay: '2s',
                zIndex: 1
              }}
            ></div>

            {/* Bottom right shape - blob */}
            <div
              className="absolute -bottom-12 -right-8 w-32 h-32 opacity-90"
              style={{
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                background: 'linear-gradient(135deg, #ff6b8b 0%, #7A31FF 100%)',
                animation: 'float 20s ease-in-out infinite alternate',
                animationDelay: '3s',
                zIndex: 1
              }}
            ></div>

            {/* Extra floating elements for more depth */}
            <div
              className="absolute top-[40%] left-[10%] w-8 h-8 rounded-full bg-primary-light opacity-30"
              style={{
                animation: 'float 25s ease-in-out infinite alternate',
                zIndex: 0
              }}
            ></div>

            <div
              className="absolute top-[60%] right-[25%] w-12 h-12 rounded-md rotate-45 bg-secondary-light opacity-40"
              style={{
                animation: 'float 22s ease-in-out infinite',
                animationDelay: '4s',
                zIndex: 0
              }}
            ></div>
          </div>

          {/* Content with higher z-index to ensure it's above the shapes */}
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-5 text-text-bright">
              Ready to <span className="bg-gradient-primary bg-clip-text text-transparent">Whispr?</span>
            </h2>
            <p className="text-lg md:text-xl text-text-muted max-w-xl mx-auto mb-10">
              Join thousands of users who are connecting authentically and anonymously. Cause chaos or spread love—the choice is yours.
            </p>
            <div className="flex gap-4 justify-center flex-col sm:flex-row">
              <Button
                variant="primary"
                className="px-8 py-4 text-lg shadow-glow"
                onClick={() => console.log('Get started')}
              >
                Get your free link
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LandingPageMainContent;