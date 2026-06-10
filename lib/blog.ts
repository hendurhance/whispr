export interface BlogPost {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  datePublished: string
  dateModified?: string
  readMinutes: number
  excerpt: string
  sections: { heading: string; body: string[] }[]
  faqs?: { q: string; a: string }[]
  related: string[]
}

export const BLOG_POSTS: Record<string, BlogPost> = {
  'is-anonymous-messaging-safe': {
    slug: 'is-anonymous-messaging-safe',
    title: 'Is anonymous messaging safe? What to know in 2026',
    metaTitle: 'Is Anonymous Messaging Safe? What to Know (2026) | Whispr',
    metaDescription:
      'A straight answer on whether anonymous messaging apps are safe, what data they keep, and how to use them without the downsides. Plus what makes Whispr different.',
    datePublished: '2026-05-20',
    dateModified: '2026-06-09',
    readMinutes: 5,
    excerpt:
      'Anonymous messaging is fun, but the apps don’t all play fair. Here’s how to tell a safe one from a sketchy one — and how to use yours without the regret.',
    sections: [
      {
        heading: 'The short answer',
        body: [
          'Anonymous messaging can be perfectly safe — the risk isn’t the idea, it’s the app you pick and how you use it. A good one keeps senders anonymous to you, keeps your messages private, gives you delete and pause controls, and doesn’t monetize your discomfort. A bad one harvests data, sends fake messages to bait you, and hides paywalls.',
          'So “is it safe?” really means two questions: is the app trustworthy, and are you in control of what you receive?',
        ],
      },
      {
        heading: 'How to spot a safe app',
        body: [
          'Look for four things. **Real anonymity:** senders are anonymous to you, and the app doesn’t quietly attach identity to messages. **Privacy:** what you receive stays in your inbox — no public pile-on feed. **Control:** you can delete anything, pause incoming, and hide your page. **Honesty:** no ads disguised as messages, no “see who sent this” paywalls, ideally open-source so anyone can verify the claims.',
          'Several popular anonymous apps have failed on exactly these points — collecting kids’ data, auto-generating fake “anonymous” messages, and burying recurring charges. That’s not anonymity being unsafe; that’s a business model being dishonest.',
        ],
      },
      {
        heading: 'How to use it without the regret',
        body: [
          'Treat your inbox like email, not a megaphone. Read on your own time, delete anything that crosses a line, and pause incoming whenever you need a break. Only the messages you choose to turn into a share card ever leave your inbox — nothing is public by default.',
          'If something is genuinely harmful, report it. A trustworthy app gives you a clear path to do that.',
        ],
      },
    ],
    faqs: [
      { q: 'Can anyone find out who sent an anonymous message?', a: 'On a trustworthy app, no — senders are anonymous to you and identity is never shown. Whispr keeps only minimal technical signals for abuse-prevention, never attached to a message.' },
      { q: 'Are anonymous messages public?', a: 'They shouldn’t be. On Whispr, received messages are private to your inbox — there’s no public feed, and nothing is posted unless you make a share card.' },
      { q: 'What makes Whispr safer?', a: 'It’s open-source (so anonymity is auditable, not just promised), ad-free, and gives you delete/pause/hide controls. See our safety page for the details.' },
    ],
    related: ['why-anonymous-messages-get-honest-answers', 'get-honest-feedback-from-your-audience'],
  },
  'anonymous-qa-on-instagram': {
    slug: 'anonymous-qa-on-instagram',
    title: 'How to set up an anonymous Q&A on Instagram',
    metaTitle: 'How to Set Up an Anonymous Q&A on Instagram (2026) | Whispr',
    metaDescription:
      'Step-by-step: add an anonymous Q&A link to your Instagram bio and story, collect questions, and answer them with a share card. Free, no app to install.',
    datePublished: '2026-05-27',
    readMinutes: 4,
    excerpt:
      'Add an anonymous Q&A to your Instagram in a couple of minutes — link in bio, story sticker, and a share card to answer the best ones.',
    sections: [
      {
        heading: 'Why anonymous Q&A works on Instagram',
        body: [
          'Stories are built for quick, low-stakes interaction, and anonymity removes the last bit of hesitation. A single link turns passive viewers into people actually sending you questions — and every answer you post back carries your link, so the loop keeps feeding itself.',
        ],
      },
      {
        heading: 'The setup (about 2 minutes)',
        body: [
          '**1. Claim your free link.** Sign up and pick a username — you get `trywhispr.me/yourname`.',
          '**2. Add it to your bio.** Edit profile → drop your link in the website field.',
          '**3. Put it in a story.** Add a Link sticker pointing at your Whispr link with a prompt like “send me anything 👀”.',
          '**4. Answer the good ones.** Turn a question into a share card and post it back to your story — it brings new people in to ask more.',
        ],
      },
      {
        heading: 'What to ask for',
        body: [
          'Open-ended beats yes/no. “Ask me anything” works, but specific prompts get more replies: “what do you actually think of my content?”, “what should I post next?”, “roast me.” Grab a few ready-made ones from our prompt packs and rotate them.',
        ],
      },
    ],
    faqs: [
      { q: 'Do my followers need an app or account?', a: 'No — anyone can send you an anonymous message from your link, no sign-up. Only you need an account to read your inbox.' },
      { q: 'Does Instagram allow anonymous Q&A links?', a: 'Yes — it’s just a link in your bio or a story Link sticker. There’s no app to install.' },
      { q: 'How do I reply?', a: 'Turn a message into a share card and post it to your story; the card carries your link so people can ask more.' },
    ],
    related: ['get-honest-feedback-from-your-audience', 'why-anonymous-messages-get-honest-answers'],
  },
  'get-honest-feedback-from-your-audience': {
    slug: 'get-honest-feedback-from-your-audience',
    title: 'How to get honest feedback from your audience',
    metaTitle: 'How to Get Honest Feedback From Your Audience | Whispr',
    metaDescription:
      'The honest feedback that actually helps is the stuff people won’t say to your face. Here’s how to collect it anonymously and turn it into better work.',
    datePublished: '2026-06-03',
    readMinutes: 5,
    excerpt:
      'The most useful feedback is the stuff people won’t say with their name on it. Here’s how to ask for it — and actually act on it.',
    sections: [
      {
        heading: 'Why honest feedback is so rare',
        body: [
          'When feedback has a name attached, it gets softened, flattered, or skipped entirely. People don’t want the awkwardness. Anonymity removes the social cost, so you finally hear what’s confusing, what’s great, and what you should change.',
          'That’s the whole pitch: take the name away and the truth shows up.',
        ],
      },
      {
        heading: 'How to ask so people actually answer',
        body: [
          'Be specific and give permission to be blunt. “Any feedback?” gets nothing; “what’s one thing I should stop doing?” gets gold. Rotate a few prompts: “where am I holding myself back?”, “what would make this twice as good?”, “what do I do that you wish more people noticed?”',
          'Share the link where your audience already is — bio, story, newsletter, community — and make it clear it’s anonymous and private to you.',
        ],
      },
      {
        heading: 'How to actually use it',
        body: [
          'Read everything, but don’t react to everything. Look for patterns: one harsh note is noise; the same note from five people is a signal. Keep the useful ones, delete the rest, and pick one concrete thing to change this week.',
          'You stay in control the whole time — nothing is public, and you decide what (if anything) ever gets shared.',
        ],
      },
    ],
    faqs: [
      { q: 'Is the feedback really anonymous?', a: 'Yes — senders don’t need an account and are anonymous to you. Identity is never shown on your page.' },
      { q: 'Can I turn it off?', a: 'Anytime — flip “Accept anonymous messages” off in your dashboard and your link stops collecting.' },
      { q: 'Where does the feedback go?', a: 'Straight to your private inbox. Only you can read it.' },
    ],
    related: ['why-anonymous-messages-get-honest-answers', 'is-anonymous-messaging-safe'],
  },
  'why-anonymous-messages-get-honest-answers': {
    slug: 'why-anonymous-messages-get-honest-answers',
    title: 'Why anonymous messages get more honest answers',
    metaTitle: 'Why Anonymous Messages Get More Honest Answers | Whispr',
    metaDescription:
      'The psychology behind why people are more honest when they’re anonymous — and how to use it to get real questions, feedback, and confessions.',
    datePublished: '2026-06-09',
    readMinutes: 4,
    excerpt:
      'There’s a reason “anonymous” and “honest” go together. A quick look at why — and how to use it.',
    sections: [
      {
        heading: 'Take the name away, get the truth',
        body: [
          'Most of what people hold back isn’t mean — it’s just risky to say with your name on it. A compliment can feel like fishing, a question can feel nosy, a criticism can feel like a fight. Anonymity removes the social cost of all three, so people say the thing instead of swallowing it.',
          'That’s why anonymous inboxes fill up with the stuff that never makes it to the comments: the real questions, the genuine compliments, the honest feedback.',
        ],
      },
      {
        heading: 'Why it’s good for you (not just fun)',
        body: [
          'Honesty you can’t get any other way is genuinely useful. Creators learn what’s landing, friends say the nice things they’d never say out loud, and you get a clearer picture of how you actually come across — minus the politeness filter.',
          'The catch is trust: people only open up if they believe it’s truly anonymous and private. That’s why the app matters — open-source, ad-free, no fake messages, with your inbox kept private.',
        ],
      },
    ],
    faqs: [
      { q: 'Are people actually more honest anonymously?', a: 'Generally yes — removing identity removes the social risk of saying something awkward, so people share what they’d otherwise hold back.' },
      { q: 'Does anonymity just invite abuse?', a: 'It can on apps with no controls. A good app gives you delete, pause, hide, and report — so you keep the honesty and drop the rest.' },
    ],
    related: ['is-anonymous-messaging-safe', 'get-honest-feedback-from-your-audience'],
  },
}

export const BLOG_SLUGS = Object.keys(BLOG_POSTS)
export const ALL_BLOG_POSTS = Object.values(BLOG_POSTS).sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1))
