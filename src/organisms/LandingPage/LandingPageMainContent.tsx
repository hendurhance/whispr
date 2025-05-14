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
import { useNavigate } from 'react-router-dom';
import DashboardImage from '../../assets/dashboard.png'

const DownloadIcon = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" fill="currentColor">
    <g>
      <path d="M407,0H105C47.103,0,0,47.103,0,105v302c0,57.897,47.103,105,105,105h302c57.897,0,105-47.103,105-105V105 C512,47.103,464.897,0,407,0z M482,407c0,41.355-33.645,75-75,75H105c-41.355,0-75-33.645-75-75V105c0-41.355,33.645-75,75-75h302 c41.355,0,75,33.645,75,75V407z" />
      <path d="M305.646,123.531c-1.729-6.45-5.865-11.842-11.648-15.18c-11.936-6.892-27.256-2.789-34.15,9.151L256,124.166 l-3.848-6.665c-6.893-11.937-22.212-16.042-34.15-9.151h-0.001c-11.938,6.893-16.042,22.212-9.15,34.151l18.281,31.664 L159.678,291H110.5c-13.785,0-25,11.215-25,25c0,13.785,11.215,25,25,25h189.86l-28.868-50h-54.079l85.735-148.498 C306.487,136.719,307.375,129.981,305.646,123.531z" />
      <path d="M401.5,291h-49.178l-55.907-96.834l-28.867,50l86.804,150.348c3.339,5.784,8.729,9.921,15.181,11.65 c2.154,0.577,4.339,0.863,6.511,0.863c4.332,0,8.608-1.136,12.461-3.361c11.938-6.893,16.042-22.213,9.149-34.15L381.189,341 H401.5c13.785,0,25-11.215,25-25C426.5,302.215,415.285,291,401.5,291z" />
      <path d="M119.264,361l-4.917,8.516c-6.892,11.938-2.787,27.258,9.151,34.15c3.927,2.267,8.219,3.345,12.458,3.344 c8.646,0,17.067-4.484,21.693-12.495L176.999,361H119.264z" />
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
    { icon: "❓", title: "Anonymous Q&A", description: "Ask spicy questions or get raw, unfiltered answers.", example: "What's the most unhinged thing you've done for clout?", is_coming_soon: false },
    { icon: "🌟", title: "Anonymous Compliments", description: "Drop some chaotic praise to hype someone up.", example: "Your vibe is like a glitter bomb of awesome.", is_coming_soon: false },
    { icon: "🔥", title: "Anonymous Roasts", description: "Throw shade or get roasted with zero chill.", example: "Your tweets are so dry they need a hydration sponsor.", is_coming_soon: false },
    { icon: "🤫", title: "Anonymous Confessions", description: "Spill your wildest secrets or hear juicy ones.", example: "I stalked your profile and now I'm obsessed.", is_coming_soon: false },
    { icon: "🗣️", title: "Anonymous Rumors", description: "Start or hear spicy gossip without the trace.", example: "Heard you crashed a party with a rap battle.", is_coming_soon: false },
    { icon: "💡", title: "Anonymous Suggestions", description: "Pitch chaotic ideas or get wild recommendations.", example: "Drop a thirst trap and break the internet.", is_coming_soon: false },
    { icon: "🔒", title: "Anonymous Secrets", description: "Share or uncover hidden tea in a safe space.", example: "I'm secretly your biggest fan but here for the drama.", is_coming_soon: false },
    { icon: "💥", title: "Anonymous Hot Takes", description: "Throw out bold opinions or hear unfiltered ones.", example: "Your content's overrated but I can't look away.", is_coming_soon: false },
    { icon: "😈", title: "Anonymous Dares", description: "Challenge someone to chaos or take on a wild dare.", example: "Tweet a hot take so bad you get canceled by lunch.", is_coming_soon: false },
    { icon: "📊", title: "Anonymous Polls", description: "Create or participate in wild polls for fun.", example: "Who's the biggest drama queen in our group?", is_coming_soon: true },
  ];

  const steps = [
    { number: 1, title: "Sign Up", description: "Join the chaos in seconds. Just a username and email to create your account." },
    { number: 2, title: "Share Your Link", description: "Get a unique link to blast on X, TikTok, or wherever you stir up trouble." },
    { number: 3, title: "Receive Wild Messages", description: "Brace for unfiltered questions, roasts, dares, and more from your crew." },
    { number: 4, title: "Respond Anonymously", description: "Clap back or escalate the chaos with anonymous replies." },
  ];

  const privacyFeatures = [
    { icon: "🔒", title: "Total Anonymity", description: "No names, no traces—just pure, unfiltered chaos with zero identifiable data." },
    { icon: "🛡️", title: "No Data Tracking", description: "We don’t track jack. Your spicy secrets stay safe." },
    { icon: "🌐", title: "Open Source", description: "Whispr’s code is public, so you can check it's as legit as your hottest take." },
    { icon: "🚫", title: "No Ads", description: "No annoying ads, no data scams—just a clean playground for chaos." },
  ];

   const profileData = {
    username: 'username',
    promptText: 'hit me with your wildest anonymous messages!',
    placeholderText: 'drop some anonymous chaos...',
    counterText: '666 people just unleashed the madness',
    buttonText: 'Start your own chaos!',
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

  const navigate = useNavigate();

  const shapesData: Shape[] = [
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
      content: 'Your energy is so chaotic, I\'m living for it 🔥',
      position: { top: '15%', left: '10%' },
      duration: 15
    },
    {
      id: 'msg2',
      content: 'What\'s the wildest party you\'ve ever crashed?',
      position: { top: '30%', right: '10%' },
      delay: 3,
      duration: 15
    },
    {
      id: 'msg3',
      content: 'I\'m secretly jealous of your clout, spill the tea!',
      position: { bottom: '20%', left: '15%' },
      delay: 6,
      duration: 15
    },
    {
      id: 'msg4',
      content: 'Drop a hot take so spicy it gets you canceled 👀',
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
      <section className="py-12 md:py-24 px-4 md:px-8 relative overflow-hidden text-center">
        {/* Background floating shapes - reduced or simplified on mobile */}
        <FloatingShapes
          shapes={shapesData}
          className="z-0 opacity-50 md:opacity-100"
        />

        {/* Hero content with improved mobile spacing */}
        <div className="relative z-10 max-w-screen-xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-3 md:mb-5 bg-gradient-primary bg-clip-text text-transparent leading-tight">
            Be anonymous,<br />Be unstoppable
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-6 md:mb-10 px-2">
            Welcome to Whispr, the open-source anonymous Q&A platform that lets anyone send you questions, compliments, and honest feedback without revealing their identity. Share your link and discover what people really want to ask you.
          </p>
          <div className="flex gap-3 md:gap-4 justify-center flex-col sm:flex-row px-4 sm:px-0">
            <IconButton
              icon={<DownloadIcon />}
              variant="primary"
              showAltText={showComingSoon}
              onClick={() => setShowComingSoon(true)}
              altText="Coming Soon"
              className="w-full sm:w-auto text-sm md:text-base"
            >
              Download for mobile
            </IconButton>
            <IconButton
              icon={<WebAccessIcon />}
              variant="secondary"
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto text-sm md:text-base"
            >
              Get web access
            </IconButton>
          </div>
        </div>

        {/* App showcase with floating messages - improved for mobile */}
        <div className="relative mt-10 md:mt-16 z-10">
          {/* Hide some floating messages on small screens */}
          <FloatingMessagesContainer
            messages={floatingMessagesData}
            className="z-20 hidden sm:block"
          />

          {/* App showcase image with better mobile display */}
          <div className="relative z-10 mx-auto rounded-xl md:rounded-2xl overflow-hidden shadow-xl">
            <img
              src={DashboardImage}
              alt="Whispr App Interface"
              className="w-full max-w-full sm:max-w-2xl lg:max-w-4xl mx-auto"
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
          subtitle="Share your personal link on social media and receive anonymous q&a while maintaining complete privacy."
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