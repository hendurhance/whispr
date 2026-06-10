import type { WhisprType } from '@/types/whispr'

export interface PromptPack {
  slug: string
  type: WhisprType
  title: string
  metaTitle: string
  metaDescription: string
  intro: string
  prompts: string[]
  related: string[]
}

export const PROMPT_PACKS: Record<string, PromptPack> = {
  'anonymous-questions': {
    slug: 'anonymous-questions',
    type: 'question',
    title: 'Anonymous question ideas',
    metaTitle: '50 Anonymous Question Ideas to Ask (or Get Asked) | Whispr',
    metaDescription:
      'A big list of anonymous question ideas to send someone or post with your link. Copy any prompt with one tap. Free — no account needed to send.',
    intro:
      'Stuck on what to ask? Copy any of these and send them to someone anonymously. The best questions are the ones people are too shy to ask with their name attached.',
    prompts: [
      'What’s a hill you’ll die on?',
      'What’s the most overrated thing everyone loves?',
      'What’s something you’ve changed your mind about recently?',
      'What’s the best advice you’ve ever gotten?',
      'What’s an unpopular opinion you actually believe?',
      'What’s a question you wish more people asked you?',
      'What’s something you’re secretly really good at?',
      'What’s the last thing that genuinely made you laugh?',
      'What’s a small thing that instantly makes your day?',
      'If you could redo one decision, what would it be?',
      'What’s a skill you wish you had?',
      'What’s something people get wrong about you?',
      'What’s a goal you’ve never said out loud?',
      'What’s your most controversial food opinion?',
      'What could you talk about for hours?',
      'What’s something you’re working on right now?',
      'What do you do when no one’s watching?',
      'What’s the kindest thing someone’s done for you?',
      'What’s a red flag you ignore?',
      'What’s something you’d only admit anonymously?',
    ],
    related: ['truth-or-dare', 'anonymous-hot-takes', 'anonymous-confessions'],
  },
  'anonymous-confessions': {
    slug: 'anonymous-confessions',
    type: 'confession',
    title: 'Anonymous confession prompts',
    metaTitle: 'Anonymous Confession Prompts — Get People to Spill | Whispr',
    metaDescription:
      'Prompts that get people to send anonymous confessions to your link. Copy any one with a tap. Private inbox, free, no account needed to send.',
    intro:
      'Confessions land best when no one knows who sent them. Post your link with one of these and watch your inbox fill up — everything stays private to you.',
    prompts: [
      'What’s a confession you’ve never told anyone?',
      'What’s a secret you’ve never told anyone?',
      'What’s the most harmless secret you’re keeping?',
      'What’s the most chaotic thing you’ve done this year?',
      'What’s something you’d only admit if no one knew it was you?',
      'What’s something you did that you still think about?',
      'What’s a white lie you tell all the time?',
      'What’s the pettiest thing you’ve ever done?',
      'Who do you have a secret crush on? (no names needed)',
      'What’s something you pretend to like but actually don’t?',
      'What’s a guilty pleasure you’d never admit out loud?',
      'What rule do you break all the time?',
      'What’s the last thing you lied about?',
      'What’s a habit you’re lowkey embarrassed by?',
      'What’s something you’ve never told your closest friend?',
      'What’s the most embarrassing thing in your search history? (paraphrase it)',
      'What’s a grudge you’re still holding?',
      'What’s something you did as a kid that you got away with?',
    ],
    related: ['anonymous-questions', 'anonymous-hot-takes', 'truth-or-dare'],
  },
  'anonymous-roasts': {
    slug: 'anonymous-roasts',
    type: 'roast',
    title: 'Anonymous roast prompts',
    metaTitle: 'Anonymous Roast Prompts — Get Roasted (Lovingly) | Whispr',
    metaDescription:
      'Open the floor for an anonymous roast. Copy a prompt, post your link, and let people send their best burns. Free, private inbox, no account to send.',
    intro:
      'Confident enough? Post one of these with your link and let people roast you anonymously. The funniest ones make great share cards — you pick what gets posted.',
    prompts: [
      'Be honest — what’s your most roastable trait?',
      'What’s the cringiest thing you do without realizing?',
      'What’s the most “red flag” thing about you?',
      'Describe your own vibe as a 1-star review.',
      'What’s your most predictable move?',
      'What’s a habit of yours people probably judge?',
      'What’s the most embarrassing song you have on repeat?',
      'What would your group chat roast you for?',
      'What’s a trend you followed that you now regret?',
      'What’s the most “main character” thing you’ve done?',
      'What part of your personality is a walking red flag?',
      'What’s something you do that ages you instantly?',
      'What’s the most “tried too hard” thing you’ve posted?',
      'What would your exes all agree on about you?',
      'What’s a compliment about you that’s secretly an insult?',
      'What’s the most chronically-online thing about you?',
    ],
    related: ['anonymous-hot-takes', 'truth-or-dare', 'anonymous-questions'],
  },
  'truth-or-dare': {
    slug: 'truth-or-dare',
    type: 'dare',
    title: 'Truth or dare ideas (anonymous)',
    metaTitle: 'Anonymous Truth or Dare Ideas — Dares to Send | Whispr',
    metaDescription:
      'Anonymous truth-or-dare prompts to send or get sent. Copy any dare with a tap. Free, private, no account needed to send a dare.',
    intro:
      'Truth or dare hits different when it’s anonymous. Copy a dare to send someone, or post your link with one and let people dare you back.',
    prompts: [
      'Truth: what’s the most embarrassing thing you’ve done sober?',
      'Post the first photo in your camera roll. No cropping.',
      'Text your crush something bold right now.',
      'Dare: let your last text decide your next post.',
      'Truth: who’s the last person you stalked online?',
      'Dare: change your pfp to whatever the next message says.',
      'Truth: what’s your most controversial opinion?',
      'Dare: reply to a hater with a poem.',
      'Truth: who would you bring back into your life if you could?',
      'Dare: text the last person you blocked “hi.”',
      'Truth: what’s a lie you told to get out of plans?',
      'Dare: post your screen time without editing it.',
      'Truth: who do you compare yourself to the most?',
      'Dare: send your most-used emoji to your last contact.',
      'Truth: what’s something you’d redo if you could?',
      'Dare: leave a nice anonymous message for someone else.',
    ],
    related: ['anonymous-roasts', 'anonymous-questions', 'anonymous-confessions'],
  },
  'anonymous-hot-takes': {
    slug: 'anonymous-hot-takes',
    type: 'hot_take',
    title: 'Anonymous hot take prompts',
    metaTitle: 'Anonymous Hot Take Prompts — Spicy Opinions | Whispr',
    metaDescription:
      'Prompts that pull out the spicy opinions people won’t post with their name on them. Copy a prompt, post your link, collect the takes. Free and private.',
    intro:
      'The best hot takes are the ones nobody will post publicly. Drop one of these with your link and collect the unfiltered opinions — privately.',
    prompts: [
      'What’s your most controversial hot take?',
      'What’s an opinion of yours you’d never post publicly?',
      'What’s something everyone’s wrong about?',
      'Say the thing you’d get ratioed for.',
      'What trend needs to end immediately?',
      'What’s overrated that everyone pretends to love?',
      'What’s underrated that deserves more hype?',
      'What’s a hot take about your own field?',
      'What’s a “food crime” you’ll defend?',
      'What celebrity take would get you cancelled?',
      'What’s a normal thing that’s actually weird?',
      'What opinion of yours has changed the most?',
      'What’s the most “old man yells at cloud” take you have?',
      'What do people your age get completely wrong?',
      'What’s a take you only share in your group chat?',
      'What would you ban if you could?',
    ],
    related: ['anonymous-roasts', 'anonymous-questions', 'anonymous-confessions'],
  },
}

export const PROMPT_PACK_SLUGS = Object.keys(PROMPT_PACKS)
export const ALL_PROMPT_PACKS = Object.values(PROMPT_PACKS)
