/**
 * The anxious attachment test.
 *
 * Twelve items scoring ONE dimension (attachment anxiety), unlike the
 * app's `attachment_style` quiz, which is a six-item, four-way classifier
 * across secure/anxious/avoidant/disorganized. Someone searching for an
 * "anxious attachment test" is asking how anxious they are, not which of
 * four boxes they land in, so this is built for that question rather than
 * reusing the app's.
 *
 * WRITTEN FROM SCRATCH, DELIBERATELY. The established instrument here is
 * the ECR anxiety subscale, which is copyrighted and not ours to
 * reproduce. These items are original and informed by the same construct;
 * nothing is lifted, and the page states plainly that this is not a
 * validated or diagnostic measure. That honesty is also better content:
 * most pages ranking for this term overclaim.
 *
 * Each option scores 0 to 3, so the range is 0 to 36.
 */

export interface Option {
  text: string;
  score: 0 | 1 | 2 | 3;
}

export interface Question {
  text: string;
  options: Option[];
}

export const QUESTIONS: Question[] = [
  {
    text: 'They take longer than usual to reply. What happens in your head?',
    options: [
      { text: 'Almost nothing. They are busy.', score: 0 },
      { text: 'I notice, then move on.', score: 1 },
      { text: 'I check my phone more than I would like to admit.', score: 2 },
      { text: 'I start working out what I did wrong.', score: 3 },
    ],
  },
  {
    text: 'You send something honest about how you feel and there is no answer yet.',
    options: [
      { text: 'I get on with my day.', score: 0 },
      { text: 'Slightly on edge, but it passes.', score: 1 },
      { text: 'I reread what I sent and wish I had said it differently.', score: 2 },
      { text: 'I want to take it back before they even see it.', score: 3 },
    ],
  },
  {
    text: 'How often do you reread your own messages after sending them?',
    options: [
      { text: 'Basically never.', score: 0 },
      { text: 'Now and then, if it mattered.', score: 1 },
      { text: 'Often enough that I notice myself doing it.', score: 2 },
      { text: 'Constantly, looking for what could be taken the wrong way.', score: 3 },
    ],
  },
  {
    text: 'Your partner says they want a weekend to themselves. Your first reaction?',
    options: [
      { text: 'Fine. I have my own things on.', score: 0 },
      { text: 'A small dip, then it is fine.', score: 1 },
      { text: 'I agree out loud and feel uneasy about it.', score: 2 },
      { text: 'I start wondering whether something is wrong between us.', score: 3 },
    ],
  },
  {
    text: 'Something feels off between you. What do you usually do?',
    options: [
      { text: 'Say so plainly and wait for the answer.', score: 0 },
      { text: 'Bring it up once I have thought about it.', score: 1 },
      { text: 'Hint at it and hope they pick it up.', score: 2 },
      { text: 'Go quiet or get sharp, so they ask me what is wrong.', score: 3 },
    ],
  },
  {
    text: 'They reply with one word. How much does that affect the rest of your day?',
    options: [
      { text: 'Not at all.', score: 0 },
      { text: 'A flicker, then gone.', score: 1 },
      { text: 'It sits with me for a few hours.', score: 2 },
      { text: 'It can colour the whole day.', score: 3 },
    ],
  },
  {
    text: 'Do you check whether they are online, active, or have read your message?',
    options: [
      { text: 'No, I do not think about it.', score: 0 },
      { text: 'Occasionally.', score: 1 },
      { text: 'Regularly, and I know what it means when they are online.', score: 2 },
      { text: 'Often, and seeing them online without a reply is the worst part.', score: 3 },
    ],
  },
  {
    text: 'When you want reassurance, how easy is it to simply ask for it?',
    options: [
      { text: 'Easy. I just say it.', score: 0 },
      { text: 'A bit awkward, but I manage.', score: 1 },
      { text: 'Hard. I usually look for it indirectly instead.', score: 2 },
      { text: 'Very hard. Asking feels like proof I am too much.', score: 3 },
    ],
  },
  {
    text: 'After a disagreement is resolved, how long before you feel settled again?',
    options: [
      { text: 'Straight away.', score: 0 },
      { text: 'Within the hour.', score: 1 },
      { text: 'It takes the rest of the day.', score: 2 },
      { text: 'Days, and I keep checking that we are really okay.', score: 3 },
    ],
  },
  {
    text: 'Do you edit what you say to avoid seeming like too much?',
    options: [
      { text: 'No, I say what I mean.', score: 0 },
      { text: 'Sometimes, early on.', score: 1 },
      { text: 'Frequently. I water things down.', score: 2 },
      { text: 'Almost always. They rarely hear the real version.', score: 3 },
    ],
  },
  {
    text: 'Things are going genuinely well between you. What happens?',
    options: [
      { text: 'I enjoy it.', score: 0 },
      { text: 'I enjoy it, with a bit of caution.', score: 1 },
      { text: 'Part of me waits for it to change.', score: 2 },
      { text: 'It makes me more anxious, because there is now more to lose.', score: 3 },
    ],
  },
  {
    text: 'Looking back, how often has this pattern shown up across relationships?',
    options: [
      { text: 'It has not, really.', score: 0 },
      { text: 'Once, with one particular person.', score: 1 },
      { text: 'In a few of them.', score: 2 },
      { text: 'In most of them, whoever I was with.', score: 3 },
    ],
  },
];

export const MAX_SCORE = QUESTIONS.length * 3;

export interface Band {
  id: string;
  /** Inclusive lower bound. */
  min: number;
  label: string;
  /** One line, used on the shareable card. Kept gentle on purpose. */
  cardLine: string;
  summary: string;
  detail: string[];
  /** Posts this result should send the reader to next. */
  reads: { href: string; label: string }[];
}

export const BANDS: Band[] = [
  {
    id: 'low',
    min: 0,
    label: 'Low attachment anxiety',
    cardLine: 'Distance does not rattle me much.',
    summary:
      'Closeness and distance both seem to sit fairly comfortably for you. A slow reply reads as a slow reply rather than as a verdict.',
    detail: [
      'This usually means uncertainty in a relationship does not register as danger, so you are not spending energy managing it.',
      'Worth a sanity check though: some people score low because things are genuinely steady, and others because the relationship is not close enough yet to test anything. If you are early on with someone, retake this in a few months.',
    ],
    reads: [
      { href: '/blog/how-to-know-your-attachment-style/', label: 'How to know your attachment style' },
      { href: '/blog/avoidant-attachment-partner/', label: 'What an avoidant attachment partner looks like' },
    ],
  },
  {
    id: 'some',
    min: 9,
    label: 'Some attachment anxiety',
    cardLine: 'It shows up, but it does not run the show.',
    summary:
      'You recognise some of this, usually under stress or with a particular person, but it is not shaping how you behave most of the time.',
    detail: [
      'Almost everyone has a version of this. Early dating, a rough patch, or someone who is genuinely inconsistent will pull the same reactions out of people who are ordinarily settled.',
      'The thing to watch is whether it tracks the situation or the person. If it flares with one partner and not others, that says something about the relationship rather than about you.',
    ],
    reads: [
      { href: '/blog/signs-of-anxious-attachment-style/', label: 'Signs of anxious attachment, and what is just nerves' },
      { href: '/blog/overthinking-texts-talking-stage/', label: 'Why you overthink texts, and how to stop' },
    ],
  },
  {
    id: 'moderate',
    min: 18,
    label: 'Moderate attachment anxiety',
    cardLine: 'Distance reads as danger more often than it should.',
    summary:
      'There is a consistent pattern here. Ordinary gaps in contact are landing as evidence that something is wrong, and a fair amount of your attention is going into managing that.',
    detail: [
      'The core of it is not clinginess. It is that uncertainty registers as threat faster for you than it does for other people, so your system starts solving a problem that may not exist.',
      'Reassurance helps for about an hour. What actually moves this is naming the feeling before acting on it, and separating what you feel from what you can actually point to in the conversation.',
      'It is also worth knowing this pairs up with avoidant patterns constantly, and each one confirms the other. If your partner withdraws when you press, neither of you is imagining it.',
    ],
    reads: [
      { href: '/blog/signs-of-anxious-attachment-style/', label: 'Signs of anxious attachment' },
      { href: '/blog/dating-rules-women-anxious-attachment/', label: 'Dating rules for women with anxious attachment' },
      { href: '/blog/dating-rules-men-anxious-attachment/', label: 'Dating rules for men with anxious attachment' },
    ],
  },
  {
    id: 'high',
    min: 27,
    label: 'High attachment anxiety',
    cardLine: 'Closeness and fear are arriving together.',
    summary:
      'These patterns are showing up strongly and, by your own answers, across more than one relationship. That is exhausting to carry, and it is a pattern rather than a personality.',
    detail: [
      'Scoring here does not mean you are too much, and it does not mean something is wrong with you. It usually means that somewhere along the way, needing someone did not reliably work out, and your system adapted sensibly to that.',
      'It also does not mean you cannot have a steady relationship. Attachment patterns are learned expectations, and they shift through repeated experiences of closeness that does not vanish when there is distance.',
      'This is the band where working with a therapist genuinely helps, particularly one who works with attachment. Self-awareness alone tends to produce better vocabulary rather than better nights.',
      'If this is affecting your sleep, your work, or how you feel about yourself day to day, please talk to someone you trust or a professional. That is a bigger thing than a website quiz is built for.',
    ],
    reads: [
      { href: '/blog/signs-of-anxious-attachment-style/', label: 'Signs of anxious attachment' },
      { href: '/blog/overthinking-texts-talking-stage/', label: 'Why you overthink texts, and how to stop' },
      { href: '/blog/one-sided-texting-how-to-know/', label: 'How to actually check if it is one-sided' },
    ],
  },
];
