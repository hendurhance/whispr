export interface MarketingFaq {
  q: string
  a: string
}

export interface MarketingDoc {
  slug: string
  kind: 'use-case' | 'platform'
  metaTitle: string
  metaDescription: string
  eyebrow: string
  h1: string
  lede: string
  sections: { heading: string; body: string[] }[]
  prompts?: string[]
  steps?: { title: string; body: string }[]
  faqs: MarketingFaq[]
}

export const USE_CASES: Record<string, MarketingDoc> = {
  'anonymous-questions': {
    slug: 'anonymous-questions',
    kind: 'use-case',
    metaTitle: 'Anonymous Questions — Get Honest Answers with a Free Link | Whispr',
    metaDescription:
      'Create a free anonymous questions link and let anyone ask you anything — no account needed to send. Read honest answers and share the best as a card.',
    eyebrow: 'Use case',
    h1: 'Anonymous questions, honest answers',
    lede:
      'Drop one link in your bio or story and let people ask you anything — anonymously. No sign-up to send, no awkwardness, just the questions people actually want to ask. Read them in your inbox and reply on your socials by posting a share card.',
    sections: [
      {
        heading: 'Why ask for anonymous questions?',
        body: [
          'People hold back when their name is attached. Take the name away and you get the real curiosity — the questions about how you actually did it, what you really think, and the things nobody says out loud. It’s the fastest way to start a genuine back-and-forth with your audience.',
          'Whispr keeps the sender anonymous to you while giving you full control: read, ignore, delete, or turn a great question into a printed share card for your story. There is no public comment wall — your inbox is yours.',
        ],
      },
      {
        heading: 'How it works',
        body: [
          'Claim your free link (trywhispr.me/yourname), share it anywhere, and questions land in your private inbox. You answer the ones you like by posting the share card — the card carries your link, so it loops new people back to ask more.',
        ],
      },
    ],
    prompts: [
      'What’s a hill you’ll die on?',
      'What’s something you’re secretly really good at?',
      'What could you talk about for hours?',
      'What’s an unpopular opinion you actually believe?',
      'What’s the best advice you’ve ever gotten?',
      'What’s something you’ve changed your mind about recently?',
      'What’s a question you wish more people asked you?',
      'What’s something you’d only admit anonymously?',
    ],
    faqs: [
      { q: 'Do people need an account to ask me a question?', a: 'No. Anyone with your link can send an anonymous question without signing up. Only you need an account to read your inbox.' },
      { q: 'Can I see who asked?', a: 'No — senders are anonymous to you. We keep minimal technical identifiers for safety and moderation only, never shown on your page.' },
      { q: 'How do I answer a question?', a: 'You reply on your own socials by posting the question as a share card (you never answer inside Whispr). The card includes your link so new people can ask too.' },
      { q: 'Is it free?', a: 'Yes — your anonymous questions link is free. No ads, no games.' },
    ],
  },
  'anonymous-feedback': {
    slug: 'anonymous-feedback',
    kind: 'use-case',
    metaTitle: 'Anonymous Feedback — Honest Feedback from Your Audience | Whispr',
    metaDescription:
      'Collect honest, anonymous feedback with a free Whispr link. No account needed to send. Find out what people really think and improve faster.',
    eyebrow: 'Use case',
    h1: 'Anonymous feedback, minus the filter',
    lede:
      'The most useful feedback is the stuff people won’t say to your face. Share a Whispr link and let your audience, followers, or teammates tell you the truth — anonymously — so you can actually act on it.',
    sections: [
      {
        heading: 'Honest feedback is rare for a reason',
        body: [
          'When feedback has a name attached, it gets softened, flattered, or skipped entirely. Anonymity removes the social cost, so you hear the things that actually move the needle: what’s confusing, what’s great, and what you should change.',
          'Whispr is built for trust on both sides. Senders stay anonymous; you stay in control — read it, sit with it, delete it, or screenshot the useful ones to act on. Nothing is published without you.',
        ],
      },
      {
        heading: 'Who uses it',
        body: [
          'Creators sanity-checking their content, founders pressure-testing an idea, managers running a no-blame retro, and anyone who’d rather hear it now than find out later. It works because there’s zero friction to send and zero pressure to be polite.',
        ],
      },
    ],
    prompts: [
      'What’s one thing you should stop doing?',
      'What’s the most honest feedback you’d give yourself?',
      'Where are you holding yourself back?',
      'What would make your content twice as good?',
      'What do you do that more people should notice?',
      'If you saw your work with fresh eyes, what would you change?',
    ],
    faqs: [
      { q: 'Is the feedback really anonymous?', a: 'Yes. Senders don’t need an account and are anonymous to you. We never show sender identity on your page.' },
      { q: 'Can I turn it off?', a: 'Anytime — flip “Accept anonymous messages” off in your dashboard and your link stops collecting.' },
      { q: 'Where does the feedback go?', a: 'Straight to your private inbox. Only you can read it.' },
      { q: 'Can I share a piece of feedback publicly?', a: 'Yes, optionally — turn any message into a share card and post it. You choose what (if anything) gets shared.' },
    ],
  },
  confessions: {
    slug: 'confessions',
    kind: 'use-case',
    metaTitle: 'Anonymous Confessions — A Safe Place for Honest Secrets | Whispr',
    metaDescription:
      'Collect anonymous confessions with a free link. Senders stay anonymous; you stay in control. Read them privately and share the best as cards.',
    eyebrow: 'Use case',
    h1: 'Anonymous confessions, on your terms',
    lede:
      'Some things are easier to say when no one knows it’s you. Share your link and let people send anonymous confessions to your private inbox — funny, sweet, or unhinged — then post the ones worth sharing.',
    sections: [
      {
        heading: 'Why people love sending confessions',
        body: [
          'A confession is the purest form of “I’d never say this with my name on it.” That’s exactly where Whispr shines: total anonymity for the sender, total control for you. No public feed, no pile-on — just your inbox.',
          'You decide what happens next. Most confessions stay private; the genuinely great ones become share cards your audience will actually want to screenshot.',
        ],
      },
    ],
    prompts: [
      'I’ve followed you longer than I’ll ever admit.',
      'There’s something I’ve wanted to tell you for ages.',
      'What’s the most harmless secret you’re keeping?',
      'What’s the most chaotic thing you’ve done this year?',
      'What’s something you’d only admit if no one knew it was you?',
    ],
    faqs: [
      { q: 'Will I know who confessed?', a: 'No — confessions are anonymous to you.' },
      { q: 'Are confessions public?', a: 'No. They land in your private inbox. Nothing is posted unless you choose to make a share card.' },
      { q: 'Is this safe?', a: 'Yes — Whispr is open-source, has no ads, and gives you delete + pause controls. We keep minimal identifiers for safety only.' },
    ],
  },
  'anonymous-compliments': {
    slug: 'anonymous-compliments',
    kind: 'use-case',
    metaTitle: 'Anonymous Compliments — Get Kind Words from a Free Link | Whispr',
    metaDescription:
      'Share a free link and let people send you anonymous compliments. No account needed to send. Read the kind words privately and post your favorites.',
    eyebrow: 'Use case',
    h1: 'Anonymous compliments that actually land',
    lede:
      'People are nicer when no one’s watching them be nice. Share a Whispr link and let friends, followers, or strangers send you anonymous compliments — the genuine, unprompted kind that make your day.',
    sections: [
      {
        heading: 'Why anonymous compliments hit different',
        body: [
          'A compliment with a name attached can feel like fishing or flattery. Anonymous, it’s just true — someone took a second to say something kind with nothing to gain. That sincerity is the whole point.',
          'Whispr keeps it warm and yours: read every compliment in your private inbox, and turn the best into a share card if you want to pass the good energy on.',
        ],
      },
    ],
    prompts: [
      'You’re genuinely one of the most talented people I follow.',
      'You don’t realize how good your stuff actually is.',
      'You made my day once and never even knew it.',
      'You’re way more impressive than you give yourself credit for.',
      'The internet is better with you posting in it.',
    ],
    faqs: [
      { q: 'Are the compliments anonymous?', a: 'Yes — senders are anonymous to you.' },
      { q: 'Where do they go?', a: 'To your private inbox. Nothing is posted unless you make a share card.' },
      { q: 'Is it free?', a: 'Yes — your link is free, no ads.' },
    ],
  },
  'anonymous-roasts': {
    slug: 'anonymous-roasts',
    kind: 'use-case',
    metaTitle: 'Anonymous Roast — Get Roasted by Your Friends (Lovingly) | Whispr',
    metaDescription:
      'Open the floor for an anonymous roast. Share your free Whispr link and let people roast you — no account needed to send. Post the funniest as cards.',
    eyebrow: 'Use case',
    h1: 'Anonymous roasts, no mercy',
    lede:
      'Confident enough to get roasted? Share your link and let people send their best (worst) anonymous roasts. The funniest ones become share-card gold — and your audience will line up to take a shot.',
    sections: [
      {
        heading: 'Why a roast is the most viral prompt',
        body: [
          'Nothing pulls replies like inviting people to roast you — it’s low-stakes, hilarious, and irresistible when it’s anonymous. Collect them privately, screenshot the elite ones onto a share card, and the loop runs itself.',
          'You stay in control: read everything, post only what you find funny, delete the rest. It’s playful, not a free-for-all.',
        ],
      },
    ],
    prompts: [
      'Be honest — what’s your most roastable trait?',
      'What’s the cringiest thing you do without realizing?',
      'Describe your own vibe as a 1-star review.',
      'What’s the most “red flag” thing about you?',
      'What’s your most predictable move?',
    ],
    faqs: [
      { q: 'Will I know who roasted me?', a: 'No — roasts are anonymous to you.' },
      { q: 'Can I delete the mean ones?', a: 'Yes — delete anything, anytime, and pause your link whenever you want.' },
      { q: 'Is it free?', a: 'Completely free, no ads.' },
    ],
  },
  'anonymous-dares': {
    slug: 'anonymous-dares',
    kind: 'use-case',
    metaTitle: 'Anonymous Dares — Let People Dare You with a Free Link | Whispr',
    metaDescription:
      'Share a free link and collect anonymous dares. No account needed to send. Read them privately, do the ones you like, and post the best as cards.',
    eyebrow: 'Use case',
    h1: 'Anonymous dares, if you’re brave enough',
    lede:
      'Open the floor and let people dare you — anonymously. Share your link, collect the dares in your private inbox, and turn the ones you actually do into share-card content your audience will love.',
    sections: [
      {
        heading: 'Why dares are made for anonymous',
        body: [
          'A dare is irresistible when there’s no name on it — people get bolder, funnier, and more creative. Collect them privately, pick what you’re up for, and post the receipts. It’s a content engine and a hype machine in one.',
          'You stay in control: read everything, do (and post) only what you’re comfortable with, delete the rest. Brave, not reckless.',
        ],
      },
    ],
    prompts: [
      'I dare you to post the last photo in your camera roll.',
      'I dare you to share your screen time, no editing.',
      'Reply to your oldest comment right now.',
      'Truth or dare? Pick dare.',
      'I dare you to text the last person you blocked.',
    ],
    faqs: [
      { q: 'Are the dares anonymous?', a: 'Yes — senders are anonymous to you.' },
      { q: 'Do I have to do every dare?', a: 'No — you choose which ones to do and post. Delete anything you don’t like.' },
      { q: 'Is it free?', a: 'Yes, free with no ads.' },
    ],
  },
  'anonymous-secrets': {
    slug: 'anonymous-secrets',
    kind: 'use-case',
    metaTitle: 'Anonymous Secrets — Collect Secrets with a Free Link | Whispr',
    metaDescription:
      'Let people tell you their anonymous secrets with a free Whispr link. No account needed to send. Read them privately; share the best as cards.',
    eyebrow: 'Use case',
    h1: 'Anonymous secrets, safely kept',
    lede:
      'Some things only get said when no one knows who said them. Share your link and let people send you anonymous secrets — straight to your private inbox, for your eyes only.',
    sections: [
      {
        heading: 'A safe place for the unsaid',
        body: [
          'Anonymity is what makes a secret possible — no name, no consequences, just the truth someone needed to get off their chest. Whispr keeps it that way: senders are anonymous to you, and nothing lands anywhere public.',
          'You decide what happens next. Most secrets stay private; the ones worth sharing become a share card on your terms.',
        ],
      },
    ],
    prompts: [
      'What’s a secret you’ve never told anyone?',
      'What’s something about you almost nobody knows?',
      'What’s the most harmless secret you’re keeping?',
      'What would you say if it was completely anonymous?',
      'What’s the biggest secret you’re keeping right now?',
    ],
    faqs: [
      { q: 'Will I know who sent a secret?', a: 'No — secrets are anonymous to you.' },
      { q: 'Are secrets public?', a: 'No. They go to your private inbox; nothing is posted unless you make a share card.' },
      { q: 'Is it safe?', a: 'Yes — open-source, ad-free, with delete and pause controls. See our safety page.' },
    ],
  },
  'anonymous-hot-takes': {
    slug: 'anonymous-hot-takes',
    kind: 'use-case',
    metaTitle: 'Anonymous Hot Takes — Collect Spicy Opinions Free | Whispr',
    metaDescription:
      'Share a free link and collect anonymous hot takes. No account needed to send. Read the spicy opinions privately and post the best as cards.',
    eyebrow: 'Use case',
    h1: 'Anonymous hot takes, fully uncensored',
    lede:
      'Ask for the spicy opinions people won’t post with their name on them. Share your link, collect anonymous hot takes, and turn the boldest into share-card content that gets people talking.',
    sections: [
      {
        heading: 'The takes people only say anonymously',
        body: [
          'Hot takes are everywhere — until you ask for them publicly, and suddenly everyone’s polite. Anonymity brings back the honesty: the unfiltered opinions, the controversial calls, the stuff that makes a great post. Collect them privately and share the ones worth the discourse.',
        ],
      },
    ],
    prompts: [
      'What’s your most controversial hot take?',
      'What’s an opinion of yours you’d never post publicly?',
      'What’s a hot take about your own content?',
      'What’s something everyone’s wrong about?',
      'Say the thing you’d get ratioed for.',
    ],
    faqs: [
      { q: 'Are hot takes anonymous?', a: 'Yes — senders are anonymous to you.' },
      { q: 'Where do they go?', a: 'To your private inbox. Nothing is posted unless you make a share card.' },
      { q: 'Is it free?', a: 'Yes — free, no ads.' },
    ],
  },
}

export const PLATFORMS: Record<string, MarketingDoc> = {
  instagram: {
    slug: 'instagram',
    kind: 'platform',
    metaTitle: 'Anonymous Messages for Instagram — Add a Link to Your Story | Whispr',
    metaDescription:
      'Add an anonymous message link to your Instagram bio and story. Free, no app to install — collect anonymous questions and honest feedback from your followers.',
    eyebrow: 'For Instagram',
    h1: 'Anonymous messages for Instagram',
    lede:
      'Put a “send me anonymous messages” link in your Instagram bio and story sticker, and let your followers ask questions, drop confessions, or give honest feedback — anonymously. Read them privately and reply by re-sharing a card to your story.',
    sections: [
      {
        heading: 'Why it works on Instagram',
        body: [
          'Stories are built for fast, low-stakes interaction — and anonymity removes the last bit of hesitation. A single link sticker turns passive viewers into people actually sending you questions, and every share card you post back carries your link, so the loop keeps feeding itself.',
        ],
      },
    ],
    steps: [
      { title: 'Claim your free link', body: 'Sign up and pick a username — you get trywhispr.me/yourname.' },
      { title: 'Add it to your bio', body: 'Paste your link into your Instagram bio (Edit profile → Website / link).' },
      { title: 'Drop it in your story', body: 'Add a Link sticker to a story pointing at your Whispr link, with a “send me anything” prompt.' },
      { title: 'Read & re-share', body: 'Answer the best messages by posting the share card back to your story — it brings new people in to ask more.' },
    ],
    faqs: [
      { q: 'Do my followers need an account?', a: 'No — anyone can send you an anonymous message from your link without signing up.' },
      { q: 'Is it really anonymous?', a: 'Yes, senders are anonymous to you. We keep minimal identifiers for safety/moderation only.' },
      { q: 'Do I need to install anything?', a: 'No app required — it’s a link. Add it to your bio or a story sticker and you’re live.' },
      { q: 'How do I reply on Instagram?', a: 'Turn a message into a share card and post it to your story; the card carries your link so people can ask more.' },
    ],
  },
  tiktok: {
    slug: 'tiktok',
    kind: 'platform',
    metaTitle: 'Anonymous Messages for TikTok — Link in Bio for Q&A | Whispr',
    metaDescription:
      'Add an anonymous Q&A link to your TikTok bio. Free, no app — collect anonymous questions and feedback, then answer them in a video or story card.',
    eyebrow: 'For TikTok',
    h1: 'Anonymous messages for TikTok',
    lede:
      'Add your Whispr link to your TikTok bio and let viewers send anonymous questions and confessions. The best ones become your next video hook — or a share card you post back.',
    sections: [
      {
        heading: 'Turn anonymous questions into content',
        body: [
          'TikTok rewards a strong hook, and “someone asked me this anonymously…” is one of the strongest. Collect questions with your link, pick the spicy ones, and answer them on camera. It’s an endless, audience-sourced content engine — and every share card you post links back for more.',
        ],
      },
    ],
    steps: [
      { title: 'Claim your free link', body: 'Sign up and pick a username — you get trywhispr.me/yourname.' },
      { title: 'Add it to your TikTok bio', body: 'Edit profile → add your Whispr link to the website/bio field.' },
      { title: 'Ask for questions', body: 'Post a video telling viewers to send you anonymous questions via your link.' },
      { title: 'Answer on camera', body: 'Use the best questions as video hooks, or post a share card — both bring new senders in.' },
    ],
    faqs: [
      { q: 'Do viewers need an account?', a: 'No — anyone can send an anonymous message from your link without signing up.' },
      { q: 'Is it anonymous?', a: 'Yes — senders are anonymous to you.' },
      { q: 'Is it free?', a: 'Yes, completely free — no ads.' },
      { q: 'Can I use the questions in videos?', a: 'That’s the point — collect them privately and answer your favorites on camera or as a card.' },
    ],
  },
  snapchat: {
    slug: 'snapchat',
    kind: 'platform',
    metaTitle: 'Anonymous Messages for Snapchat — Link for Anonymous Q&A | Whispr',
    metaDescription:
      'Add an anonymous message link for Snapchat. Free, no app — let friends send anonymous questions and confessions, then reply with a Snap or story card.',
    eyebrow: 'For Snapchat',
    h1: 'Anonymous messages for Snapchat',
    lede:
      'Share your Whispr link with your Snapchat friends and let them send anonymous questions, confessions, and roasts. Read them privately and reply with a Snap or by posting a share card.',
    sections: [
      {
        heading: 'Built for close-friends honesty',
        body: [
          'Snapchat is where your real friends are — which is exactly where anonymous gets interesting. Drop your link in your story or chat and you’ll get the unfiltered stuff, with full control over what you reply to.',
        ],
      },
    ],
    steps: [
      { title: 'Claim your free link', body: 'Sign up and pick a username — you get trywhispr.me/yourname.' },
      { title: 'Share it to your story', body: 'Post your Whispr link to your Snapchat story (or send it in chats) with a “send me anything” prompt.' },
      { title: 'Read your inbox', body: 'Anonymous messages land in your private Whispr inbox.' },
      { title: 'Reply with a Snap', body: 'Answer your favorites with a Snap or post a share card — the card links back so more roll in.' },
    ],
    faqs: [
      { q: 'Do my friends need an account?', a: 'No — anyone with your link can send anonymously, no sign-up.' },
      { q: 'Is it anonymous?', a: 'Yes — senders are anonymous to you.' },
      { q: 'Do I need an app?', a: 'No — it’s just a link you share on Snapchat.' },
    ],
  },
  twitch: {
    slug: 'twitch',
    kind: 'platform',
    metaTitle: 'Anonymous Q&A for Twitch Streamers — Audience Questions | Whispr',
    metaDescription:
      'Collect anonymous questions from your Twitch chat with a free link. Read them on stream, answer live, and post the best as cards. No app to install.',
    eyebrow: 'For Twitch',
    h1: 'Anonymous Q&A for Twitch streamers',
    lede:
      'Give your Twitch community a link to drop anonymous questions and feedback — perfect for a Q&A segment, a “roast the streamer” bit, or honest input on your channel. Read them on stream and answer live.',
    sections: [
      {
        heading: 'A better Q&A than chat',
        body: [
          'Chat moves fast and people self-censor in front of everyone. An anonymous link lets lurkers and regulars alike ask the things they’d never type in a public chat — which makes for far better on-stream content.',
        ],
      },
    ],
    steps: [
      { title: 'Claim your free link', body: 'Sign up and pick a username — you get trywhispr.me/yourname.' },
      { title: 'Add it to your panels', body: 'Put your Whispr link in your Twitch About panels and command (e.g., !ask).' },
      { title: 'Collect questions', body: 'Anonymous questions land in your private inbox before and during stream.' },
      { title: 'Answer on stream', body: 'Read the best ones live, and post a share card afterward to keep them coming.' },
    ],
    faqs: [
      { q: 'Do viewers need an account?', a: 'No — anyone can send an anonymous question from your link.' },
      { q: 'Is it anonymous?', a: 'Yes — senders are anonymous to you.' },
      { q: 'Is it free?', a: 'Yes, free with no ads.' },
    ],
  },
  x: {
    slug: 'x',
    kind: 'platform',
    metaTitle: 'Anonymous Messages for X (Twitter) — Link in Bio | Whispr',
    metaDescription:
      'Add an anonymous message link to your X (Twitter) bio. Free, no app — collect anonymous questions and hot takes, then quote them in a post or card.',
    eyebrow: 'For X (Twitter)',
    h1: 'Anonymous messages for X (Twitter)',
    lede:
      'Drop your Whispr link in your X bio and let followers send anonymous questions, hot takes, and roasts. The spicy ones make perfect quote-posts — or a share card that links back for more.',
    sections: [
      {
        heading: 'Anonymous fuel for the timeline',
        body: [
          'X runs on takes, and the best ones are the ones people won’t post under their own name. An anonymous link gets them flowing — collect privately, then screenshot the elite ones onto a share card or build a post around them. Every card carries your link, so the replies keep coming.',
        ],
      },
    ],
    steps: [
      { title: 'Claim your free link', body: 'Sign up and pick a username — you get trywhispr.me/yourname.' },
      { title: 'Add it to your X bio', body: 'Edit profile → drop your Whispr link in the bio or website field.' },
      { title: 'Ask for messages', body: 'Post asking followers to send anonymous questions or hot takes via your link.' },
      { title: 'Quote & post', body: 'Turn the best into quote-posts or a share card — both bring new senders in.' },
    ],
    faqs: [
      { q: 'Do followers need an account?', a: 'No — anyone can send an anonymous message from your link.' },
      { q: 'Is it anonymous?', a: 'Yes — senders are anonymous to you.' },
      { q: 'Is it free?', a: 'Yes, free with no ads.' },
    ],
  },
  discord: {
    slug: 'discord',
    kind: 'platform',
    metaTitle: 'Anonymous Messages for Discord — Anonymous Q&A Link | Whispr',
    metaDescription:
      'Share an anonymous message link in your Discord server or profile. Free, no bot needed — collect anonymous questions and feedback from your community.',
    eyebrow: 'For Discord',
    h1: 'Anonymous messages for Discord',
    lede:
      'Share your Whispr link in your Discord profile or server and let your community send anonymous questions, feedback, and confessions — no bot to set up. Read them privately and answer in chat.',
    sections: [
      {
        heading: 'Honest input from your community',
        body: [
          'Even in a tight server, people self-censor in public channels. An anonymous link lets members ask and share the things they’d never post with their name attached — great for AMAs, mod feedback, or just letting the community speak freely.',
        ],
      },
    ],
    steps: [
      { title: 'Claim your free link', body: 'Sign up and pick a username — you get trywhispr.me/yourname.' },
      { title: 'Share it on Discord', body: 'Add your Whispr link to your profile “About me”, a pinned message, or a #links channel.' },
      { title: 'Collect anonymously', body: 'Members send anonymous messages straight to your private inbox.' },
      { title: 'Answer in chat', body: 'Reply to the best ones in your server, or post a share card to keep them coming.' },
    ],
    faqs: [
      { q: 'Do I need a Discord bot?', a: 'No — it’s just a link you share. No bot or setup required.' },
      { q: 'Is it anonymous?', a: 'Yes — senders are anonymous to you.' },
      { q: 'Is it free?', a: 'Yes, free with no ads.' },
    ],
  },
}

export const ALL_MARKETING: MarketingDoc[] = [...Object.values(USE_CASES), ...Object.values(PLATFORMS)]

export function marketingHref(doc: MarketingDoc): string {
  return doc.kind === 'platform' ? `/for/${doc.slug}` : `/${doc.slug}`
}
