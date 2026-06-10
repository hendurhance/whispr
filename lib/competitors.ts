export interface CompetitorRow {
  label: string
  whispr: true | string
  them: true | false | string
}

export interface Competitor {
  slug: string
  name: string
  metaTitle: string
  metaDescription: string
  h1: string
  lede: string
  rows: CompetitorRow[]
  whySwitch: string[]
  faqs: { q: string; a: string }[]
  footnote: string
}

export const COMPETITORS: Record<string, Competitor> = {
  sendit: {
    slug: 'sendit',
    name: 'Sendit',
    metaTitle: 'Sendit Alternative — Open-Source Anonymous Messages, No App | Whispr',
    metaDescription:
      'Looking for a Sendit alternative? Whispr is a free link (no app), open-source and ad-free, with no fake messages and no paid membership. Anonymous messages you control.',
    h1: 'The open-source Sendit alternative',
    lede:
      'Sendit is a mobile app that bolts onto Snapchat and Instagram with a paid membership. Whispr does the same anonymous-messages job as a simple free link — no app to install, open-source, ad-free, and every message comes from a real person.',
    rows: [
      { label: 'Truly anonymous senders', whispr: true, them: true },
      { label: 'Works as a link — no app to install', whispr: true, them: false },
      { label: 'Open-source & auditable', whispr: 'AGPL', them: false },
      { label: 'Every message from a real person (no auto-generated)', whispr: true, them: '—' },
      { label: 'No ads or paid membership', whispr: true, them: '—' },
      { label: 'Private inbox — you reply on your own socials', whispr: true, them: true },
      { label: 'Free', whispr: true, them: 'Free + paid' },
    ],
    whySwitch: [
      'No app, no “Diamond” membership, no upsell — Whispr is just a link you share, and your senders need nothing installed either.',
      'Because Whispr is open-source, anonymity isn’t a claim you have to take on faith — anyone can read exactly how it works. And every whispr you get is from a real person; Whispr never auto-generates messages to bait you into replying.',
    ],
    faqs: [
      { q: 'Is Whispr a good Sendit alternative?', a: 'Yes — same anonymous-messages job, but as a free link (no app), open-source, ad-free, with no paid membership and no fake messages.' },
      { q: 'Do I need to install an app?', a: 'No. Whispr is a link you share; your senders don’t install anything either.' },
      { q: 'Is it really anonymous?', a: 'Yes — senders are anonymous to you, and the code is open-source so you can verify it.' },
      { q: 'Is Whispr free?', a: 'Yes, completely free — no membership.' },
    ],
    footnote:
      'Comparison reflects publicly available information, including the U.S. FTC’s September 2025 complaint against Sendit (alleging deceptive subscription practices and auto-generated messages). Features change — verify both before deciding.',
  },
  tellonym: {
    slug: 'tellonym',
    name: 'Tellonym',
    metaTitle: 'Tellonym Alternative — Private Anonymous Messages You Own | Whispr',
    metaDescription:
      'A Tellonym alternative that keeps your messages private instead of on a public Q&A feed. Open-source, ad-free, with share cards — reply on your own socials.',
    h1: 'The private Tellonym alternative',
    lede:
      'Tellonym publishes your messages and answers on a public profile on their site. Whispr keeps your inbox private and lets you reply on your own socials — so the attention flows back to you, not to someone else’s platform.',
    rows: [
      { label: 'Truly anonymous senders', whispr: true, them: true },
      { label: 'Messages stay private (no public Q&A feed)', whispr: true, them: false },
      { label: 'Reply on your own socials — you own the audience', whispr: true, them: '—' },
      { label: 'Open-source & auditable', whispr: 'AGPL', them: false },
      { label: 'No ads', whispr: true, them: '—' },
      { label: 'Printable share cards for your story', whispr: true, them: '—' },
      { label: 'Free', whispr: true, them: 'Free + Plus' },
    ],
    whySwitch: [
      'On Tellonym, your received “tells” and answers live on a public profile on their site — you’re building their platform. Whispr keeps everything in your private inbox, and you answer on your own channels, so every bit of attention comes back to you.',
      'Whispr is also open-source and ad-free, and turns the messages worth sharing into a printed share card made for your story.',
    ],
    faqs: [
      { q: 'Is Whispr a good Tellonym alternative?', a: 'Yes, if you’d rather keep messages private and reply on your own channels than maintain a public Q&A profile on someone else’s site.' },
      { q: 'Does Whispr have a public feed?', a: 'No — received whisprs are private to you. Your public page is just the “send me a message” link.' },
      { q: 'Is it free?', a: 'Yes — free and ad-free.' },
      { q: 'Is it anonymous?', a: 'Yes — senders are anonymous to you, and it’s open-source so you can verify how it works.' },
    ],
    footnote: 'Comparison reflects publicly available information; Tellonym’s features and plans change — verify both before deciding.',
  },
}

export const COMPETITOR_SLUGS = Object.keys(COMPETITORS)
