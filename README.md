<div id="top"></div>

<div align="center">
  <img src="/doc/images/logo.png" width="200px">
  <h2>Whispr</h2>
  <p>An open-source anonymous platform to receive questions, dares, roast, confessions, feedback, and more — you decide whether to spark chaos or spread love. 
  </p> <p> It's an open source alternative to "NGL", "Sarahah" and "Kubool". </p>

  <p  align="center">
    <a href="https://trywhispr.me">View Demo</a>
    ·
    <a href="https://github.com/hendurhance/whispr/issues/new?assignees=&labels=bug&template=bug.yml&title=%5BBUG%5D+%3Cdescription%3E">Report Bug</a>
    ·
    <a href="https://github.com/hendurhance/whispr/issues/new?assignees=&labels=feature&template=features.yml&title=%5BFEATURE%5D+%3Cdescription%3E">Request Feature</a>
  </p>

  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/hendurhance/whispr?style=flat">
  <img alt="contributors" src="https://img.shields.io/github/contributors/hendurhance/whispr?style=flat">
  <img alt="GitHub Repo forks" src="https://img.shields.io/github/forks/hendurhance/whispr?style=flat">
  <img alt="issues" src="https://img.shields.io/github/issues/hendurhance/whispr?style=flat"> </br>
</div>

## What is Whispr?
Whispr is an open-source alternative to anonymous Q&A apps like NGL, Sarahah, or Kubool, built with privacy and security in mind. It allows users to create a personal profile and share a unique link to receive anonymous messages from others. People can send questions, feedback, compliments, confessions, or any message completely anonymously through the link, and the recipient can read them in their Whispr dashboard. Whispr’s goal is to provide a fun and safe environment for honest communication, while respecting user privacy.

## Features
- **Anonymous Messages**: Receive messages or questions from anyone without knowing the sender’s identity. Supports various categories of messages such as Q&A, compliments, advice, opinions, confessions, and more.
- **Personal Link**: Every user gets a unique shareable link (e.g.` https://trywhispr.me/<yourUsername>`) that others can use to send them messages
- **Customizable Profile**: Users can choose theme colors, add a profile picture, and write a short bio to personalize their profile
- **Dashboard & Filters**: Logged-in users have a dashboard to view all incoming “whisprs.” Messages can be filtered by type (question, confession, compliment, etc.) and marked as read/unread for better organization
- **Password-less Login**: Easy account creation via passwordless email magic link
- **Random Prompts**: A fun “dice” feature provides random pre-written questions or prompts for senders who aren’t sure what to ask
- **Privacy Controls**: Only the intended recipient can read the messages they receive – senders remain anonymous. Sender metadata (like IP address) is encrypted and not exposed to the recipient, ensuring privacy while still allowing abuse prevention if needed
- **Responsive UI**: A clean, mobile-friendly web interface built with a modern tech stack (React + Tailwind CSS) for a smooth user experience.

## 💻 Tech Stack
Whispr is built with Next.js (React framework) and TypeScript, styled with Tailwind CSS, and deployed on Vercel for hosting. It uses Supabase (a Backend-as-a-Service) for its entire back-end needs and edge functions to handle server-side logic. The app is designed to be responsive and user-friendly, ensuring a seamless experience across devices.
<table>
  <tr>
    <td align="center"><a href="https://nextjs.org/"><img src="https://cdn.worldvectorlogo.com/logos/next-js.svg" width="100px;" alt=""/><br /><sub><b>Next.js</b></sub></a><br /></td>
    <td align="center"><a href="https://reactjs.org/"><img src="https://cdn.worldvectorlogo.com/logos/react-2.svg" width="100px;" alt=""/><br /><sub><b>React</b></sub></a><br /></td>
    <td align="center"><a href="https://www.typescriptlang.org/"><img src="https://cdn.worldvectorlogo.com/logos/typescript.svg" width="100px;" alt=""/><br /><sub><b>Typescript</b></sub></a><br /></td>
    <td align="center"><a href="https://www.supabase.io/"><img src="https://vectorlogo.zone/logos/supabase/supabase-icon.svg" width="100px;" alt=""/><br /><sub><b>Supabase</b></sub></a><br /></td>
    <td align="center"><a href="https://tailwindcss.com/"><img src="https://cdn.worldvectorlogo.com/logos/tailwindcss.svg" width="100px;" alt=""/><br /><sub><b>Tailwind CSS</b></sub></a><br /></td>
    <td align="center"><a href="https://vercel.com/"><img src="https://cdn.worldvectorlogo.com/logos/vercel.svg" width="100px;" alt=""/><br /><sub><b>Vercel</b></sub></a><br /></td>
  </tr>
</table>

- **Next.js 15**: Modern React framework with App Router, Server Components, and Server Actions for optimal performance and SEO
- **React & TypeScript**: For building a dynamic application with robust, maintainable code (leveraging static typing)
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development and consistent design
- **Supabase (PostgreSQL database + Auth + Storage)**: Handles user authentication, data persistence, and file storage. This replaces a custom server/backend – all data operations and authentication are done via Supabase's secure APIs with Server-Side Rendering (SSR) support
- **Vercel**: Hosts the application, providing easy deployment, edge functions, and scaling. The app can be accessed publicly (and via the demo link above) with automatic SSL and global CDN

> **Why these technologies**? We chose Next.js for its powerful features including Server-Side Rendering (SSR), Static Site Generation (SSG), API routes, and excellent SEO capabilities. The framework provides an optimal developer experience while delivering superior performance to end users. Using Supabase for the back-end greatly speeds up development by offloading infrastructure, security, and scaling concerns to a reliable service. This way, we focus on building features rather than reinventing the wheel for authentication or database management. The Atomic Design pattern is used in the front-end codebase to keep components modular and maintainable (see [Technical Specifications](/doc/technical-specifications.md) for more details).

## 📸 Screenshots
### Landing Page
![Screenshot 1](/doc/images/landing_page.png)
### Dashboard
![Screenshot 2](/doc/images/dashboard.png)
### Profile Page
![Screenshot 3](/doc/images/profile.png)
### Settings Page
![Screenshot 4](/doc/images/settings.png)

## 🚀 Getting Started
Follow these steps to set up a local development environment for Whispr.
### Prerequisites
Make sure you have the following installed/setup on your system:
- Git – for cloning the repository
- Node.js (v18.17 or above recommended) – JavaScript runtime
- npm (comes with Node.js) – for installing dependencies
- Supabase account – You'll need a Supabase project to use as the back-end (sign up at supabase.com). In the project, obtain your Supabase API URL and anon API key for the next step

### Installation
1. **Clone the repo**
   ```sh
   git clone https://github.com/hendurhance/whispr.git
   cd whispr
   ```
2. **Install NPM packages**
   ```sh
    npm install
    ```
3. **Configure environment variables**: Create a `.env.local` file in the root directory and add the following variables
    ```sh
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    NEXT_PUBLIC_SUPABASE_URL=<your_supabase_project_url>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
    ```
    Replace the placeholders with your actual Supabase project credentials.
4. **Run the development server**
    ```sh
    npm run dev
    ```
  This will run the app in development mode. Open http://localhost:3000 in your browser to view it.
5. **Setup Supabase Database**: In your Supabase project, set up the database schema:
   - Navigate to the SQL Editor in your Supabase dashboard
   - Run the SQL script from `/migrations/init.sql` to create the necessary tables, functions, and Row Level Security (RLS) policies
   - This will create tables for profiles, whisprs, social_links, and weekly_stats
   
6. **Setup Supabase Edge Functions** (Optional but recommended for production):
   In your Supabase project, you may want to deploy edge functions for server-side operations:
   - `update-profile-views`: Handles updating profile view counts
   - `update-whispr-counts`: Handles updating whispr statistics
   - `submit-whispr`: Handles anonymous message submissions with validation
   - `delete-user`: Handles user account deletion with proper cleanup
   
7. **Create an account**: Once the app is running locally, navigate to http://localhost:3000 and click Sign Up. You can create an account using email (you'll receive a magic login link). After your first login, you'll be prompted to set up your profile and choose a unique username.

8. **Set up your profile**: After signing up, configure your profile settings including your username, display name, bio, and avatar. Your personal Whispr link will be `http://localhost:3000/<username>` (or `trywhispr.me/<username>` in production).

9. **Test the app**: 
   - Share your profile link with friends or open it in an incognito browser
   - Submit an anonymous message to yourself
   - Check your dashboard to see the received message
   - Explore customization options, filters, and other features

> Happy Hacking! You now have Whispr running locally with Next.js. Feel free to explore the code, tweak features, or contribute improvements. For a deep dive into the architecture and design of Whispr, see the [Technical Specifications](/doc/technical-specifications.md) document.
6. **Create an account on Whispr:** Once the app is running locally, click Sign Up and create an account. You can sign up with an email (you’ll receive a magic login link). After your first login, you’ll be prompted to choose a username for your profile link.
7. Set up your profile link: After signing up, Whispr will associate your chosen username with a personal link (e.g., `http://localhost:3000/<username>` for local dev, or `trywhispr.me/<username>` in production)
github.com. Share this link with friends or on social media so others can send you anonymous messages!
9. Test sending/receiving messages: Try opening your profile link in an incognito browser (or have a friend open it). You’ll see a message submission page where anyone can send you a Whispr anonymously. Submit a test message. Then, log back into your account and check your dashboard – the message should appear there, along with any metadata like the type of message and timestamp.
> Happy Hacking! You now have Whispr running locally. Feel free to explore the code, tweak features, or contribute improvements. For a deep dive into the architecture and design of Whispr, see the Technical Specifications document.

## 💬 Usage Example
Scenario: _You want to gather honest feedback and fun messages from your friends. Here’s how you can use Whispr:_
- Sign Up & Get Your Link: Register on Whispr (using the demo or your deployed instance) and create a unique username. For example, if you choose alex, your anonymous message link will be `trywhispr.me/alex`. This link is displayed on your dashboard.
- **Share the Link**: Post your Whispr link on social platforms or send it directly to friends. Invite people to “send me anything – anonymously.”
**Receive Messages**: Others can click your link and be taken to the Whispr submission page for your profile. They do not need to log in or reveal who they are. They can select a category (question, compliment, confession, etc.), type a message, and send it completely anonymously
**Read and Respond**: When someone sends you a message, it gets saved to the database with no identifying information about the sender (aside from hidden metadata). You can respond by sharing the message or downloading it as an image. You will get an image like this:
  > ![Screenshot 5](/doc/images/whispr.png)

You can log into Whispr and see the new message on your dashboard. New messages are marked as unread. You might choose to respond to these messages publicly by sharing them (outside the app), or just keep the feedback privately.
**Manage Your Whisprs**: In your dashboard, you can filter messages by type (e.g., only show compliments) and sort them by date received or other criteria. This helps in managing a large number of incoming whisprs. You can also mark messages as read, or delete any message that is inappropriate.

This simple flow allows for open communication – you get honest messages, and senders get the freedom of anonymity. Whispr’s design ensures that while messages are anonymous to users, there are protections behind the scenes to prevent abuse (like rate limiting and encrypted tracking of submissions).

## 🤝 Contributing
Contributions are what make the open-source community amazing! **We welcome all contributions** – whether it’s bug fixes, new features, or improvements to documentation. If you’re interested in contributing to Whispr, please take a moment to read our [contributing guidelines](/CONTRIBUTING.md).
Some ways you can contribute:
- **Report Bugs**: If you find a bug, you can use the GitHub issue tracker to let us know. Please include details and steps to reproduce.
- **Request Features**: Have an idea for a new feature or improvement? Open an issue to discuss it, or submit a pull request if you’re ready to code it.
- **Improve Documentation**: Spot an error or have suggestions for better docs? We’d love your help to make our documentation clearer and more comprehensive.
Please note we have a Code of Conduct to ensure a respectful, harassment-free experience for everyone. By participating, you agree to abide by it

## 📝 License
Distributed under the [AGPL-3.0 License](/LICENSE).You are free to use, modify, and distribute this software. See the LICENSE file for the full license text.

## 🙏🏽 Support
If you like this project, please consider supporting it by starring ⭐ and sharing it with your friends! You can also [sponsor](https://github.com/sponsors/hendurhance) me or [buy me a coffee](https://www.buymeacoffee.com/hendurhance) to help me continue developing it. Thanks for your support!

If you find Whispr useful or fun, please consider supporting the project:
- Star this repository on GitHub ⭐ to show your appreciation.
- Share Whispr with your friends or on social media to help others discover it.
- Sponsor the Maintainer:  You can [sponsor](https://github.com/sponsors/hendurhance) or [buy me them coffee](https://www.buymeacoffee.com/hendurhance) to contribute to ongoing development.
