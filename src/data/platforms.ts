// One entry per NAMED platform Chakam supports today (see the Flutter
// app's import_screen.dart _screenshotSources / WhatsApp export flow) —
// deliberately NOT including Telegram. Telegram has a real, working
// parser (telegram_parser.dart), but its export is Telegram Desktop
// JSON only, with no iOS path, so it's hidden as a dedicated source in
// the app. Telegram (and any other app not listed here — Discord, WeChat,
// LINE, Viber…) still works via the app's generic "Other" screenshot
// source (see the homepage's "Other apps" pill) — it just doesn't get a
// dedicated, platform-tuned page here, since a page makes an accuracy
// promise ("built for this platform's UI") that a generic OCR bucket
// can't back up. Nav dropdown + [platform].astro pages are both built
// from this single array, so a platform can never appear in one place
// and not the other.
export interface PlatformStep {
  title: string;
  body: string;
}

export interface PlatformBlock {
  title: string;
  body: string;
}

export interface PlatformFaq {
  q: string;
  a: string;
}

export interface Platform {
  slug: string; // URL: /{slug}/
  name: string; // "WhatsApp"
  navLabel: string; // full, spelled-out — for the dropdown + <title> keyword match
  metaDescription: string;
  heroHeadline: string;
  heroSub: string;
  importMethod: 'export' | 'screenshot';
  heroTrustPills: string[];
  steps: PlatformStep[];
  insights: PlatformBlock[];
  personas: PlatformBlock[];
  faq: PlatformFaq[];
  screenshotFile: string; // see the note in [platform].astro for exactly what to capture
  screenshotAlt: string;
}

export const platforms: Platform[] = [
  {
    "slug": "whatsapp-chat-analyzer",
    "name": "WhatsApp",
    "navLabel": "WhatsApp Chat Analysis",
    "metaDescription": "Analyze any WhatsApp chat for red flags, ghosting risk, and real interest — Chakam's free WhatsApp chat analyzer reads your real export, on-device, in under a minute.",
    "heroHeadline": "WhatsApp Chat Analysis, From Your Real Export",
    "heroSub": "WhatsApp is the one platform Chakam reads directly from a full chat export — not screenshots — so every metric, from reply speed to red flags, is built on your actual message history, not a guess from a handful of screenshots.",
    "importMethod": "export",
    "heroTrustPills": [
      "Full export, not screenshots",
      "Group chats supported",
      "Most accurate metrics"
    ],
    "steps": [
      {
        "title": "Open the chat in WhatsApp",
        "body": "Open the 1:1 or group conversation you want analyzed — WhatsApp chat analysis works the same way for a partner, a situationship, a friend group, or family."
      },
      {
        "title": "Export the chat",
        "body": "Tap the contact or group name, scroll down, and choose \"Export Chat.\" Pick \"Without Media\" — Chakam only needs the text, and it keeps the export small and fast to share."
      },
      {
        "title": "Share it into Chakam",
        "body": "Choose Chakam from the share sheet (or save the file and open Chakam, then WhatsApp, to import it manually). No login, no upload to a website."
      },
      {
        "title": "Get your full analysis",
        "body": "Chakam parses the real timestamps and message history on your device and builds your Vibe Check, Red Flag Report, Ghost Risk Meter, and full AI verdict — typically in under a minute."
      }
    ],
    "insights": [
      {
        "title": "Red flags, with real timestamps behind them",
        "body": "Because a WhatsApp export carries genuine send times, Chakam's Red Flag Report and reply-speed metrics are as accurate as this chat analyzer gets — no estimated timing, no guessing at gaps."
      },
      {
        "title": "Group chat support most chat analyzers skip",
        "body": "Family group chats, friend groups, work chats — WhatsApp analysis in Chakam isn't limited to 1:1 conversations, so you can see who dominates, who goes quiet, and how the group's dynamic actually shifts."
      },
      {
        "title": "Interest Over Time, not a single score",
        "body": "Whether it's a years-long relationship or a new situationship, Chakam's Interest Over Time trend shows exactly when someone's engagement started rising or fading across the whole history of the chat, week by week."
      },
      {
        "title": "Track the same relationship over time",
        "body": "Re-export the same WhatsApp chat later and Chakam recognizes it — your compatibility, vibe, and red flag numbers update instead of starting over, so you're tracking one relationship's story, not a series of disconnected reports."
      }
    ],
    "personas": [
      {
        "title": "Couples & long-term partners",
        "body": "Years of WhatsApp history hold real patterns — Chakam's WhatsApp chat analysis surfaces effort balance, tone shifts, and communication habits that are hard to see message by message."
      },
      {
        "title": "People in a situationship",
        "body": "\"Are we a thing?\" is exactly the kind of question a full export answers better than memory does — Chakam's Vibe Check reads the pattern, not just the last few days."
      },
      {
        "title": "Anyone managing a family or friend group chat",
        "body": "See who actually replies, who starts conversations, and whether the group dynamic is as balanced as it feels."
      },
      {
        "title": "Anyone who suspects they're being ghosted",
        "body": "The Ghost Risk Meter reads unanswered messages and fading engagement specifically, using real WhatsApp timestamps — not a guess."
      }
    ],
    "faq": [
      {
        "q": "Does exporting a WhatsApp chat upload it to a server?",
        "a": "No — Chakam parses the export file entirely on your device. Only a small, de-identified sample is ever sent anywhere, and only to generate the written AI verdict; the raw export itself never leaves your phone."
      },
      {
        "q": "Can I analyze a WhatsApp group chat, not just a 1:1?",
        "a": "Yes. Chakam's WhatsApp chat analyzer supports group exports — cards that don't make sense for a group (like compatibility) are automatically hidden, and cards built for groups (like message-share breakdowns) adjust to show everyone, not just two people."
      },
      {
        "q": "Does this work with WhatsApp Business?",
        "a": "The export format is the same either way, so yes — if you can export the chat from WhatsApp's own share menu, Chakam can read it."
      },
      {
        "q": "What if I export the same chat again later?",
        "a": "Chakam detects that it's the same relationship (by comparing overlapping messages, never by guessing from names) and links the new export to your existing history — so you get a trend, not a duplicate report."
      }
    ],
    "screenshotFile": "platform-whatsapp-import.png",
    "screenshotAlt": "Chakam's WhatsApp export guide screen, showing how to share a WhatsApp chat export into the app"
  },
  {
    "slug": "instagram-chat-analyzer",
    "name": "Instagram",
    "navLabel": "Instagram DM Analysis",
    "metaDescription": "Analyze Instagram DMs for mixed signals, red flags, and real interest. Chakam's Instagram chat analyzer reads your screenshots directly — no export, no login needed.",
    "heroHeadline": "Instagram DM Analysis, Straight From Screenshots",
    "heroSub": "Instagram doesn't offer a DM export, so Chakam reads your Instagram chat analysis directly off screenshots — no login, no risky third-party access to your account, just the conversation you choose to share.",
    "importMethod": "screenshot",
    "heroTrustPills": [
      "No login required",
      "Up to 20 screenshots",
      "Story-reply aware"
    ],
    "steps": [
      {
        "title": "Screenshot the DM thread",
        "body": "Scroll through the Instagram conversation and take screenshots — up to 20 at a time. Include story replies and reactions if they're part of the conversation you care about."
      },
      {
        "title": "Open Chakam and choose Instagram",
        "body": "Pick Instagram from the source list and select the screenshots straight from your camera roll."
      },
      {
        "title": "Chakam reads the messages",
        "body": "Chakam's vision AI transcribes exactly what's visible in each screenshot — never guessing at anything cropped or illegible — and reconstructs the conversation in order."
      },
      {
        "title": "Review your Instagram DM analysis",
        "body": "Get your Vibe Check, effort breakdown, Red Flag Report, and full AI verdict, built entirely from what was actually said in the thread."
      }
    ],
    "insights": [
      {
        "title": "Reads more than plain text messages",
        "body": "Instagram conversations lean heavily on story replies, reactions, and quick voice-note-style back-and-forth — Chakam's Instagram chat analyzer is built to make sense of that shape of conversation, not just formal texting."
      },
      {
        "title": "Who initiates, who replies, who fades",
        "body": "Instagram DMs are an easy place for effort to quietly go one-sided — Chakam's Who's More Into Who breakdown puts a real number on it instead of a feeling."
      },
      {
        "title": "Ghost Risk Meter for a platform built for going quiet",
        "body": "Instagram makes it easy to leave someone on \"seen\" without a trace — the Ghost Risk Meter reads unanswered messages and fading engagement to flag it before it's obvious."
      },
      {
        "title": "Tone and vibe, read accurately",
        "body": "Positivity vs Negativity scoring is tuned to read real, casual DM language — including emoji and modern slang — not just formal sentence structure."
      }
    ],
    "personas": [
      {
        "title": "Anyone dating through Instagram DMs",
        "body": "A slide into the DMs that turned into a real conversation — Chakam reads the whole thread for genuine interest versus polite replies."
      },
      {
        "title": "People decoding mixed signals",
        "body": "Story replies and quick reactions can read as interest or as habit — Chakam looks at the pattern across the whole conversation, not one message."
      },
      {
        "title": "Anyone worried about being ghosted on Instagram",
        "body": "The Ghost Risk Meter is built exactly for this — a real read on fading engagement, not a guess."
      },
      {
        "title": "Friends checking a group DM dynamic",
        "body": "See who actually carries a group conversation and who's gone quiet."
      }
    ],
    "faq": [
      {
        "q": "Do I need to log into Instagram inside Chakam?",
        "a": "No — Chakam never asks for your Instagram login. You take the screenshots yourself, from your own camera roll; nothing connects to your account directly."
      },
      {
        "q": "Are the screenshots saved anywhere?",
        "a": "No. Screenshots are sent for one-time reading (OCR), used to build your report, and are not stored afterward — on your device or on our servers."
      },
      {
        "q": "Does it work with dark mode Instagram screenshots?",
        "a": "Yes, as long as the text is legible in the screenshot — very low-contrast or heavily edited images are the only real risk to accuracy."
      },
      {
        "q": "Can it read story replies and reactions?",
        "a": "Yes — Chakam's Instagram DM analysis reads exactly what's visible in a screenshot, story replies and quick reactions included, the same as a regular message."
      }
    ],
    "screenshotFile": "platform-instagram-import.png",
    "screenshotAlt": "Chakam's Instagram screenshot import screen, showing the Instagram source selected"
  },
  {
    "slug": "snapchat-chat-analyzer",
    "name": "Snapchat",
    "navLabel": "Snapchat Chat Analysis",
    "metaDescription": "Analyze Snapchat conversations for red flags, hot-and-cold behavior, and real interest. Chakam's Snapchat chat analyzer reads your screenshots — streaks and disappearing snaps included.",
    "heroHeadline": "Snapchat Chat Analysis, Built for Disappearing Messages",
    "heroSub": "Snapchat conversations vanish by design, which makes screenshots the only real record — Chakam's Snapchat chat analyzer reads exactly what you captured and turns it into a real relationship analysis.",
    "importMethod": "screenshot",
    "heroTrustPills": [
      "No login required",
      "Built for a disappearing-message platform",
      "Up to 20 screenshots"
    ],
    "steps": [
      {
        "title": "Screenshot the conversation",
        "body": "Take screenshots of the chat thread as you scroll — up to 20 at a time. Since Snapchat messages can disappear, this is also the only way to keep a record to analyze later."
      },
      {
        "title": "Choose Snapchat in Chakam",
        "body": "Select Snapchat from the source list and pick your screenshots from the camera roll."
      },
      {
        "title": "Chakam transcribes the thread",
        "body": "Vision AI reads the visible text in each screenshot and reconstructs the conversation in order — never inventing anything that wasn't actually there."
      },
      {
        "title": "See your Snapchat chat analysis",
        "body": "Vibe Check, effort balance, Red Flag Report, Ghost Risk Meter, and a full written verdict on the dynamic."
      }
    ],
    "insights": [
      {
        "title": "Reads past the streak-keeping noise",
        "body": "Snap streaks can make a conversation look active even when real engagement has faded — Chakam looks at actual message content and reply patterns, not just whether a streak is still alive."
      },
      {
        "title": "Interest Over Time for a platform built on habit",
        "body": "Snapchat's daily-habit design can hide a real drop in interest — the Interest Over Time trend shows whether someone's actually more into you, or just maintaining a streak out of habit."
      },
      {
        "title": "Red flags in a low-accountability format",
        "body": "Disappearing messages can make people say things they wouldn't in a chat that sticks around — Chakam's Red Flag Report catches patterns like one-sided effort and escalating arguments the same way it would anywhere else."
      },
      {
        "title": "Positivity vs Negativity, read for casual Snapchat language",
        "body": "Snapchat conversation is often short and slang-heavy — Chakam's sentiment analysis is built to read real texting style, not just formal sentences."
      }
    ],
    "personas": [
      {
        "title": "Anyone questioning a Snapchat streak relationship",
        "body": "Is it a real connection or just streak maintenance? Chakam's Snapchat analysis looks at what's actually said, not just daily activity."
      },
      {
        "title": "People navigating mixed signals",
        "body": "A platform built for quick, disappearing messages is an easy place for signals to feel confusing — Chakam reads the whole pattern."
      },
      {
        "title": "Anyone worried about being ghosted",
        "body": "Snapchat makes it easy to go quiet without explanation — the Ghost Risk Meter flags a fading pattern before it's obvious."
      },
      {
        "title": "Friends checking in on a group Snapchat",
        "body": "See who actually drives the conversation in a group chat, streak or not."
      }
    ],
    "faq": [
      {
        "q": "Does Chakam need my Snapchat login?",
        "a": "No. You take the screenshots yourself and Chakam only ever reads those — never your account directly."
      },
      {
        "q": "Can it analyze a chat even after the snaps disappear?",
        "a": "Yes — as long as you screenshotted the conversation before it disappeared, Chakam can read and analyze it from those images."
      },
      {
        "q": "Are my screenshots stored after analysis?",
        "a": "No — screenshots are used once, to transcribe the conversation, and are discarded afterward. We never keep a copy."
      },
      {
        "q": "Does streak count factor into the analysis?",
        "a": "No — Chakam reads message content and timing patterns, not streak numbers, since a streak alone says nothing about the actual quality of a conversation."
      }
    ],
    "screenshotFile": "platform-snapchat-import.png",
    "screenshotAlt": "Chakam's Snapchat screenshot import screen, showing the Snapchat source selected"
  },
  {
    "slug": "messenger-chat-analyzer",
    "name": "Messenger",
    "navLabel": "Messenger Chat Analysis",
    "metaDescription": "Analyze Facebook Messenger conversations for red flags, effort balance, and real interest. Chakam's Messenger chat analyzer reads your screenshots directly.",
    "heroHeadline": "Facebook Messenger Chat Analysis",
    "heroSub": "From long-running friend groups to a new conversation that started on Marketplace or a dating profile, Chakam's Messenger chat analyzer reads your screenshots and turns them into a real relationship analysis.",
    "importMethod": "screenshot",
    "heroTrustPills": [
      "No login required",
      "Group chats supported",
      "Up to 20 screenshots"
    ],
    "steps": [
      {
        "title": "Screenshot the Messenger thread",
        "body": "Scroll through the conversation and take screenshots — up to 20 at a time, in order."
      },
      {
        "title": "Choose Messenger in Chakam",
        "body": "Select Messenger from the source list and pick your screenshots."
      },
      {
        "title": "Chakam reads the conversation",
        "body": "Vision AI transcribes exactly what's visible and reconstructs the thread — including reactions where they're part of the exchange."
      },
      {
        "title": "Get your Messenger chat analysis",
        "body": "Vibe Check, effort breakdown, Red Flag Report, Ghost Risk Meter, and a full written AI verdict."
      }
    ],
    "insights": [
      {
        "title": "Built for both old friendships and new connections",
        "body": "Messenger conversations often span years with people you already know well, or start fresh with someone you just matched with — Chakam's chat analysis works for either."
      },
      {
        "title": "\"Seen\" receipts, read honestly",
        "body": "Messenger's visible seen status makes ghosting feel personal — the Ghost Risk Meter turns that anxiety into an actual, evidence-based read instead of a guess from a read receipt alone."
      },
      {
        "title": "Effort balance across long histories",
        "body": "Who's More Into Who and the double-text rate are especially telling in a Messenger thread that's been running for months or years — patterns that are genuinely hard to see just by scrolling back."
      },
      {
        "title": "Group chat support",
        "body": "Friend groups, family threads, and shared-interest chats all work — cards that need exactly two people (like compatibility) step aside automatically, and group-aware cards take over."
      }
    ],
    "personas": [
      {
        "title": "Long-time friends checking a group dynamic",
        "body": "See who actually keeps a years-old group chat alive and who's gone quiet."
      },
      {
        "title": "People dating someone they met on Facebook or Marketplace",
        "body": "A conversation that started outside a dating app deserves the same real analysis — red flags, effort, and vibe, read the same way."
      },
      {
        "title": "Anyone questioning where they stand",
        "body": "Messenger's seen receipts and typing indicators create a lot of anxious guessing — Chakam replaces the guessing with an actual pattern read."
      },
      {
        "title": "Family members managing a group chat",
        "body": "Understand the real dynamic in a family thread, not just who posts the most."
      }
    ],
    "faq": [
      {
        "q": "Does Chakam connect to my Facebook account?",
        "a": "No — Chakam never logs into Facebook or Messenger. You take the screenshots yourself, and only those images are ever read."
      },
      {
        "q": "Can it handle a Messenger group chat?",
        "a": "Yes — group-aware cards adjust automatically, showing everyone's share of the conversation rather than assuming just two people."
      },
      {
        "q": "Are screenshots kept after the analysis?",
        "a": "No — they're read once to transcribe the conversation and discarded immediately after, never stored on our servers."
      },
      {
        "q": "Does it read message reactions?",
        "a": "Yes, where a reaction is visible and relevant in the screenshot, Chakam includes it as part of reading the conversation's tone."
      }
    ],
    "screenshotFile": "platform-messenger-import.png",
    "screenshotAlt": "Chakam's Messenger screenshot import screen, showing the Messenger source selected"
  },
  {
    "slug": "imessage-chat-analyzer",
    "name": "iMessage",
    "navLabel": "iMessage Chat Analysis",
    "metaDescription": "Analyze iMessage conversations for red flags, ghosting risk, and real interest. Chakam's iMessage chat analyzer reads your screenshots — read receipts and group chats included.",
    "heroHeadline": "iMessage Chat Analysis for iPhone Conversations",
    "heroSub": "iMessage is where a lot of the closest relationships actually live — Chakam's iMessage chat analyzer reads your screenshots and turns blue-bubble conversations into a real, evidence-based analysis.",
    "importMethod": "screenshot",
    "heroTrustPills": [
      "No login required",
      "Read receipts read accurately",
      "Up to 20 screenshots"
    ],
    "steps": [
      {
        "title": "Screenshot the iMessage thread",
        "body": "Scroll through Messages and take screenshots of the conversation — up to 20, in order."
      },
      {
        "title": "Choose iMessage in Chakam",
        "body": "Select iMessage from the source list and pick your screenshots."
      },
      {
        "title": "Chakam reads the conversation",
        "body": "Vision AI transcribes exactly what's visible, including read receipts and delivery status where they show up in the screenshot."
      },
      {
        "title": "Review your iMessage analysis",
        "body": "Vibe Check, effort breakdown, Red Flag Report, Ghost Risk Meter, and a full written AI verdict."
      }
    ],
    "insights": [
      {
        "title": "Read receipts, without the overthinking",
        "body": "\"Read\" with no reply is one of the most anxiety-inducing signals in texting — Chakam's Ghost Risk Meter turns that specific pattern into an actual, evidence-based score instead of a spiral."
      },
      {
        "title": "Built for the relationships that live in iMessage",
        "body": "Partners, closest friends, family — a lot of the highest-stakes conversations in someone's life happen over iMessage, and Chakam's analysis is built to match that depth."
      },
      {
        "title": "Group chats, handled properly",
        "body": "Family threads and friend group chats work the same way — group-aware cards show the real share of the conversation, not a forced two-person comparison."
      },
      {
        "title": "Tone and vibe, read for real texting",
        "body": "Positivity vs Negativity scoring reads real conversational language and emoji use, not just formal sentence structure."
      }
    ],
    "personas": [
      {
        "title": "Couples and close relationships",
        "body": "The conversations that matter most often live in iMessage — Chakam gives them a real, evidence-based read."
      },
      {
        "title": "Anyone stuck overanalyzing a read receipt",
        "body": "Replace the anxious guessing with an actual Ghost Risk score, built from the real pattern."
      },
      {
        "title": "Family group chat members",
        "body": "See the real shape of a family thread's dynamic, not just a gut feeling."
      },
      {
        "title": "Anyone comparing how a conversation used to feel vs. now",
        "body": "Interest Over Time and Vibe Over Time show whether things have genuinely shifted, or if it just feels that way."
      }
    ],
    "faq": [
      {
        "q": "Does Chakam need access to my Messages app?",
        "a": "No — Chakam never connects to Messages directly. You take the screenshots yourself; that's the only thing Chakam ever reads."
      },
      {
        "q": "Does it work with group iMessage chats?",
        "a": "Yes — group-aware cards adjust automatically to show everyone's share of the conversation."
      },
      {
        "q": "Are my screenshots stored afterward?",
        "a": "No — they're used once to transcribe the conversation and discarded immediately, never kept on our servers."
      },
      {
        "q": "Does it read delivered/read status?",
        "a": "Where visible in a screenshot, yes — that status feeds directly into signals like the Ghost Risk Meter."
      }
    ],
    "screenshotFile": "platform-imessage-import.png",
    "screenshotAlt": "Chakam's iMessage screenshot import screen, showing the iMessage source selected"
  },
  {
    "slug": "tinder-chat-analyzer",
    "name": "Tinder",
    "navLabel": "Tinder Chat Analysis",
    "metaDescription": "Analyze Tinder conversations for ghosting risk, real interest, and red flags before you meet up. Chakam's Tinder chat analyzer reads your match conversation from screenshots.",
    "heroHeadline": "Tinder Chat Analysis, Match to Conversation",
    "heroSub": "A match is just the start — Chakam's Tinder chat analyzer reads the actual conversation that follows and tells you whether the interest is real, fading, or already gone quiet.",
    "importMethod": "screenshot",
    "heroTrustPills": [
      "No login required",
      "Built for dating-app pacing",
      "Up to 20 screenshots"
    ],
    "steps": [
      {
        "title": "Screenshot the match conversation",
        "body": "Take screenshots of the conversation with your match — up to 20, in order, from the moment you matched onward."
      },
      {
        "title": "Choose Tinder in Chakam",
        "body": "Select Tinder from the source list and pick your screenshots."
      },
      {
        "title": "Chakam reads the conversation",
        "body": "Vision AI transcribes exactly what's said, reconstructing the exchange in order."
      },
      {
        "title": "See your Tinder chat analysis",
        "body": "Vibe Check, effort breakdown, Ghost Risk Meter, Red Flag Report, and a full AI verdict on where things actually stand."
      }
    ],
    "insights": [
      {
        "title": "Ghost Risk Meter, built for exactly this platform",
        "body": "Tinder conversations go quiet constantly, and it's genuinely hard to tell a busy week from an actual fade — the Ghost Risk Meter reads unanswered messages and slowing replies to give you a real signal, not a guess."
      },
      {
        "title": "Real interest vs. polite matching",
        "body": "A match doesn't mean real interest — Chakam's effort and reciprocity analysis looks at who's actually carrying the conversation after the initial match excitement wears off."
      },
      {
        "title": "Red flags before you meet up",
        "body": "One-sided effort, inconsistent replies, or an escalating vibe that doesn't match the conversation — Chakam's Red Flag Report surfaces these before you invest real time in meeting up."
      },
      {
        "title": "Interest Over Time, from match to now",
        "body": "See whether engagement has been rising since you matched, or quietly fading — the trend line most dating apps never show you."
      }
    ],
    "personas": [
      {
        "title": "Anyone unsure if a match is actually interested",
        "body": "Chakam reads the real pattern in the conversation instead of leaving you to guess from a slow reply."
      },
      {
        "title": "People juggling multiple matches",
        "body": "A quick, evidence-based read on which conversations are actually going somewhere."
      },
      {
        "title": "Anyone who's been ghosted on Tinder before",
        "body": "The Ghost Risk Meter is built specifically to catch the pattern early, before radio silence."
      },
      {
        "title": "People deciding whether to suggest meeting up",
        "body": "A real read on interest and vibe before you take the conversation offline."
      }
    ],
    "faq": [
      {
        "q": "Does Chakam connect to my Tinder account?",
        "a": "No — Chakam never logs into Tinder. You screenshot the conversation yourself; that's the only thing Chakam reads."
      },
      {
        "q": "Can it tell me if I'm about to be ghosted?",
        "a": "The Ghost Risk Meter estimates the chance based on unanswered messages, fading engagement, and silence length — a real, evidence-based signal, though never a guarantee."
      },
      {
        "q": "Are my screenshots saved?",
        "a": "No — they're read once to transcribe the conversation and discarded immediately, never stored on our servers."
      },
      {
        "q": "Does this work for conversations that never really got going?",
        "a": "Yes, though very short conversations naturally give Chakam less to work with — more messages means a more confident read."
      }
    ],
    "screenshotFile": "platform-tinder-import.png",
    "screenshotAlt": "Chakam's Tinder screenshot import screen, showing the Tinder source selected"
  },
  {
    "slug": "bumble-chat-analyzer",
    "name": "Bumble",
    "navLabel": "Bumble Chat Analysis",
    "metaDescription": "Analyze Bumble conversations for real interest, red flags, and ghosting risk. Chakam's Bumble chat analyzer reads your match conversation directly from screenshots.",
    "heroHeadline": "Bumble Chat Analysis, Beyond the First Message",
    "heroSub": "Bumble's own 24-hour window to send that first message creates a very particular kind of pressure — Chakam's Bumble chat analyzer reads what happens after, so you know whether it's actually going somewhere.",
    "importMethod": "screenshot",
    "heroTrustPills": [
      "No login required",
      "Built for dating-app pacing",
      "Up to 20 screenshots"
    ],
    "steps": [
      {
        "title": "Screenshot the conversation",
        "body": "Take screenshots of your Bumble conversation — up to 20, in order."
      },
      {
        "title": "Choose Bumble in Chakam",
        "body": "Select Bumble from the source list and pick your screenshots."
      },
      {
        "title": "Chakam reads the conversation",
        "body": "Vision AI transcribes exactly what's said and reconstructs the exchange in order."
      },
      {
        "title": "Get your Bumble chat analysis",
        "body": "Vibe Check, effort breakdown, Ghost Risk Meter, Red Flag Report, and a full AI verdict."
      }
    ],
    "insights": [
      {
        "title": "A real read after the opening message pressure fades",
        "body": "Bumble's format puts a lot of weight on that first message — Chakam looks past it, at the actual pattern of effort and interest across the whole conversation that follows."
      },
      {
        "title": "Ghost Risk Meter for a platform where matches expire",
        "body": "Bumble already trains you to expect a conversation might just end — the Ghost Risk Meter reads real signals (unanswered messages, fading replies) instead of leaving you to assume the worst from silence alone."
      },
      {
        "title": "Red flags before you meet up",
        "body": "One-sided effort or an inconsistent vibe shows up in the Red Flag Report before you've invested real time."
      },
      {
        "title": "Who's actually carrying the conversation",
        "body": "Effort and reciprocity analysis shows whether interest is genuinely mutual, or resting entirely on one person's messages."
      }
    ],
    "personas": [
      {
        "title": "Anyone reading into a slow reply",
        "body": "Replace the guessing with a real pattern read across the whole conversation."
      },
      {
        "title": "People managing several Bumble conversations at once",
        "body": "A quick way to see which conversations show real, growing interest."
      },
      {
        "title": "Anyone who's been ghosted on a dating app before",
        "body": "The Ghost Risk Meter is built to catch a fading pattern early."
      },
      {
        "title": "People deciding whether to suggest a date",
        "body": "A real read on interest and vibe before taking things further."
      }
    ],
    "faq": [
      {
        "q": "Does Chakam connect to my Bumble account?",
        "a": "No — Chakam never logs into Bumble. You screenshot the conversation yourself; that's the only thing Chakam ever reads."
      },
      {
        "q": "Can it tell me if someone's about to go quiet?",
        "a": "The Ghost Risk Meter estimates the chance based on unanswered messages and fading engagement — a real signal, though never a guarantee."
      },
      {
        "q": "Are my screenshots kept afterward?",
        "a": "No — they're read once to transcribe the conversation and discarded immediately, never stored on our servers."
      },
      {
        "q": "Does it work if the conversation is very short?",
        "a": "Yes, though more messages give Chakam more to work with — a longer conversation means a more confident read."
      }
    ],
    "screenshotFile": "platform-bumble-import.png",
    "screenshotAlt": "Chakam's Bumble screenshot import screen, showing the Bumble source selected"
  },
  {
    "slug": "hinge-chat-analyzer",
    "name": "Hinge",
    "navLabel": "Hinge Chat Analysis",
    "metaDescription": "Analyze Hinge conversations for real interest, red flags, and ghosting risk. Chakam's Hinge chat analyzer reads your prompt-based conversation directly from screenshots.",
    "heroHeadline": "Hinge Chat Analysis, Prompt to Real Conversation",
    "heroSub": "Hinge conversations usually start from a prompt reply, which makes the early back-and-forth genuinely revealing — Chakam's Hinge chat analyzer reads the whole thread and tells you if the interest is real.",
    "importMethod": "screenshot",
    "heroTrustPills": [
      "No login required",
      "Built for dating-app pacing",
      "Up to 20 screenshots"
    ],
    "steps": [
      {
        "title": "Screenshot the conversation",
        "body": "Take screenshots of your Hinge conversation — up to 20, in order, from the prompt reply onward."
      },
      {
        "title": "Choose Hinge in Chakam",
        "body": "Select Hinge from the source list and pick your screenshots."
      },
      {
        "title": "Chakam reads the conversation",
        "body": "Vision AI transcribes exactly what's said and reconstructs the exchange in order."
      },
      {
        "title": "Review your Hinge chat analysis",
        "body": "Vibe Check, effort breakdown, Ghost Risk Meter, Red Flag Report, and a full AI verdict on the dynamic."
      }
    ],
    "insights": [
      {
        "title": "Built for a platform designed around real conversation",
        "body": "Hinge leans on prompt-based openers meant to spark a genuine exchange — Chakam's analysis looks at how that early spark actually developed, not just whether the opener landed."
      },
      {
        "title": "Ghost Risk Meter for serious-intent dating",
        "body": "Hinge users are often looking for something real, which makes a sudden quiet stretch sting more — the Ghost Risk Meter turns that into an actual, evidence-based read instead of a guess."
      },
      {
        "title": "Red flags before you meet up",
        "body": "One-sided effort, inconsistent replies, or a vibe that doesn't match the conversation's start — surfaced before you've invested real time."
      },
      {
        "title": "Who's actually carrying the conversation",
        "body": "Effort and reciprocity analysis shows whether interest is genuinely mutual as the conversation moves past the opening prompt."
      }
    ],
    "personas": [
      {
        "title": "People looking for something real, not just a match",
        "body": "A genuine, evidence-based read on whether a promising opener turned into a real conversation."
      },
      {
        "title": "Anyone unsure if a conversation is fading",
        "body": "Chakam's Interest Over Time trend shows the real pattern, not a snapshot from the last message."
      },
      {
        "title": "Anyone who's been ghosted before",
        "body": "The Ghost Risk Meter is built to catch a fading pattern early."
      },
      {
        "title": "People deciding whether to suggest meeting up",
        "body": "A real read on interest and vibe before taking the conversation offline."
      }
    ],
    "faq": [
      {
        "q": "Does Chakam connect to my Hinge account?",
        "a": "No — Chakam never logs into Hinge. You screenshot the conversation yourself; that's the only thing Chakam ever reads."
      },
      {
        "q": "Can it read the original prompt being replied to?",
        "a": "If it's visible in your screenshot, yes — Chakam reads exactly what's shown, prompt and reply both."
      },
      {
        "q": "Are my screenshots stored afterward?",
        "a": "No — they're read once to transcribe the conversation and discarded immediately, never kept on our servers."
      },
      {
        "q": "Does this work for a conversation that just started?",
        "a": "Yes, though more messages give Chakam more to work with — a longer conversation means a more confident read."
      }
    ],
    "screenshotFile": "platform-hinge-import.png",
    "screenshotAlt": "Chakam's Hinge screenshot import screen, showing the Hinge source selected"
  }
];

export function getPlatform(slug: string): Platform | undefined {
  return platforms.find((p) => p.slug === slug);
}
