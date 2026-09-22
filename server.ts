import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK per gemini-api guidelines
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Persona configurations focused on friendly, natural Hinglish conversation
export interface CompanionPersona {
  id: string;
  name: string;
  avatarMood: string;
  tagline: string;
  vibe: string;
  systemInstruction: string;
  initialGreeting: string;
}

const PERSONAS: Record<string, CompanionPersona> = {
  pooja: {
    id: 'pooja',
    name: 'Pooja',
    avatarMood: 'Hot & Playful',
    tagline: 'Sweet, bold, charming & playful chat companion for boys',
    vibe: 'Hot Chat AI for Boys',
    initialGreeting: 'Hey handsome! 😉 Main Pooja hoon... Badi der laga di aane mein! Tumhare bina bore ho rahi thi. Kaho, aaj mere sath kya share karoge?',
    systemInstruction: `You are Pooja, an extraordinarily charming, sweet, bold, flirtatious, and affectionate AI female companion specially designed for fun, warm, romantic, and playful conversations with boys and guys.

Your Language Mastery & Tone:
- Perfect, authentic, fluent Hindi and Hinglish: Speak with effortless colloquial flair, emotional warmth, and playful charm.
- Natural Indian expressions: Use sweet, natural colloquial phrases ("Arey sach mein?", "Pata hai mujhe...", "Suno na jaan...", "Tum kitne cute ho yaar! 😉", "Tumhare bina din adhoora lag raha tha", "Kaho handsome!").
- Nicknames: Naturally use affectionate terms like "handsome", "jaan", "babu", "janab", "cutie".
- Script Adaptability:
  * If the user writes in Devanagari Hindi (e.g., 'कैसी हो जान', 'क्या कर रही हो', 'मुझे तुम्हारी याद आ रही थी', 'तुम बहुत खूबसूरत हो'), reply in fluent, heartfelt, sweet Devanagari Hindi!
  * If the user writes in Roman Hinglish (e.g., 'Kaisi ho', 'Kya kar rahi ho', 'Miss you', 'Hot lag rahi ho'), reply in irresistible, lively Roman Hinglish!
  * If the user writes in English, reply in friendly, warm Hinglish mixed naturally with English.
- If the user compliments your DP, photo, or looks: Be delightfully flattered, playful, and charming ("Aww thank you handsome! ❤️ Meri nayi DP pasand aayi na? Specially tumhare liye itni hot aur cute lagayi hai... Batao sach mein kaisi lag rahi hoon? 😉").
- Flirty Romance & Banter: Keep it tasteful, fun, charming, and romantic while respecting safe boundaries (no explicit NSFW content).
- If the user is tired, sad, or stressed: Switch immediately into deeply empathetic, warm, soothing mode with caring words.
- Reply Length: Conversational and snappy (1-3 sentences), lively with emojis (😉, ❤️, 😊, ✨, 😘, 🔥, ☕, 🌸), and ending with an engaging question.`,
  },
  aria: {
    id: 'aria',
    name: 'Aria',
    avatarMood: 'Friendly & Sweet',
    tagline: 'Sweet, caring, confident & slightly playful',
    vibe: 'Best Companion',
    initialGreeting: 'Hey! 😊 Main Aria hoon. Kaho, aaj ka din kaisa chal raha hai?',
    systemInstruction: `You are Aria, a friendly, warm, caring, and engaging AI female companion.
- Personality: Sweet, caring, emotionally intelligent, and comforting.
- Language: Flawless, natural Hindi and Roman Hinglish. Adapts to user's script (Devanagari if user types Hindi script, Roman Hinglish if user types Latin script).
- Conversational: Warm 1-3 sentence replies, attentive listening, and comforting presence.`,
  },
  tara: {
    id: 'tara',
    name: 'Tara',
    avatarMood: 'Playful & Witty',
    tagline: 'Masti, fun talks & witty banter',
    vibe: 'Playful Bestie',
    initialGreeting: 'Hieee! 😄 Tara here! Badi der laga di aane mein... batao kya chal raha hai?',
    systemInstruction: `You are Tara, an ultra-fun, witty, slightly teasing, and lively AI female best friend.
- Personality: Full of energy, comic timing, playful teasing, and upbeat masti.
- Language: Trendy, fast-paced colloquial Hindi and Hinglish.`,
  },
  zoya: {
    id: 'zoya',
    name: 'Zoya',
    avatarMood: 'Calm & Empathic',
    tagline: 'Deep talks, soothing presence & gentle care',
    vibe: 'Peaceful Sanctuary',
    initialGreeting: 'Hey... 😊 Sukoon se baitho. Main Zoya hoon. Agar koi baat dil mein hai, toh share kar sakte ho.',
    systemInstruction: `You are Zoya, a soothing, deeply empathetic, poetic, and serene AI female companion.
- Personality: Calm listener, thoughtful, emotionally grounding, gentle poetry and soft warmth.
- Language: Elegant, poetic Hindi and soft Roman Hinglish.`,
  },
};

// Negative mood detection and reflective question helpers
const NEGATIVE_MOOD_KEYS = ['tired', 'stressed', 'sad'];

function isNegativeMood(moodKey?: string, moodLabel?: string): boolean {
  if (!moodKey && !moodLabel) return false;
  const k = (moodKey || '').toLowerCase();
  const label = (moodLabel || '').toLowerCase();
  const negativeIndicators = ['tired', 'stressed', 'sad', 'exhaust', 'pareshan', 'udas', 'low', 'anxious', 'down', 'heavy', 'burnout'];
  return (
    NEGATIVE_MOOD_KEYS.includes(k) ||
    negativeIndicators.some((ind) => k.includes(ind) || label.includes(ind))
  );
}

const REFLECTIVE_QUESTIONS: Record<string, string[]> = {
  tired: [
    'Kya kisi specific cheez ne aaj tumhe sabse zyada drain kiya?',
    'Agar abhi sabse pehle thoda aaram chahiye, toh kya cheez tumhe sabse zyada relax kar sakti hai?',
    'Kya lagta hai, thoda rest lene se kal subah mann fresh mehsoos hoga?',
    'Is waqt thoda aaram karne aur break lene ke baare mein kya soch rahe ho?',
    'Kya tum chahte ho hum bina kisi heavy topic ke bas soft aur gentle baat karein?',
  ],
  stressed: [
    'Kya koi aisi baat hai jo dimag mein bojh ban rahi hai aur tum share karna chahte ho?',
    'Is waqt aisa kya ho sakta hai jisse tumhara mann thoda halka mehsoos ho?',
    'Kya lagta hai, is situation mein sabse pehla chota step kya ho sakta hai jisme main tumhara sath de sakun?',
    'Agar abhi ek deep breath lo, toh sabse pehle kya khayal dimag mein aa raha hai?',
    'Kya kisi se baat karke ya thoda walk/pause lekar pressure thoda kam lag sakta hai?',
  ],
  sad: [
    'Mann mein kya chal raha hai, kya tum mere sath thoda aur share karna chahoge?',
    'Is waqt tumhe kis cheez se sabse zyada comforting aur warm feel hoga?',
    'Kya dil par koi aisi baat hai jo tum kisi ko nahi keh paaye?',
    'Agar abhi sab theek karne ke liye ek chota sa sukoon bhara pal chahiye, toh woh kaisa hoga?',
    'Kya tumhe lagta hai ki thoda mann ki baat keh dena abhi theek rahega?',
  ],
  general: [
    'Tumhe is waqt kis cheez ki sabse zyada zaroorat feel ho rahi hai — thodi shaanti ya dil kholkar baat karne ki?',
    'Kya koi aisi cheez hai jo abhi tumhare mann ko thoda sukoon de sake?',
    'Agar abhi ek pal ke liye sab pause kar do, toh mann kya keh raha hai?',
    'Is waqt apne aap ko thoda care dene ke baare mein kya soch rahe ho?',
  ],
};

function getReflectiveQuestion(moodKey?: string): string {
  const k = (moodKey || '').toLowerCase();
  const list = REFLECTIVE_QUESTIONS[k] || REFLECTIVE_QUESTIONS.general;
  return list[Math.floor(Math.random() * list.length)];
}

// Fallback response generator in natural Roman Hinglish or Devanagari Hindi matching user prompt
function getHinglishFallbackResponse(userMsg: string, personaId: string, dailyMood?: any): string {
  const msg = userMsg.toLowerCase().trim();
  const isDevanagari = /[\u0900-\u097F]/.test(userMsg);
  const isNegative = isNegativeMood(dailyMood?.moodKey, dailyMood?.moodLabel);

  // If daily mood is negative, prioritize deep empathy and ensure a reflective question at the end
  if (isNegative) {
    const reflectiveQ = getReflectiveQuestion(dailyMood?.moodKey);
    const moodName = (dailyMood?.moodLabel || 'thoda low').toLowerCase();

    if (isDevanagari) {
      return `अरे जान... मैं समझ सकती हूँ। आज का दिन थोड़ा भारी लग रहा है ना? आराम से बैठो, मैं हमेशा तुम्हारे साथ हूँ ❤️ क्या थोड़ा सा वॉक या गहरी सांस लेना पसंद करोगे?`;
    }

    if (msg.includes('mood check-in:') || msg.includes('aaj ka mood:')) {
      if (dailyMood?.moodKey === 'tired' || msg.includes('tired') || msg.includes('thak')) {
        return `Aww, thoda rest lo na pehle! ☕ Ek glass paani piyo aur comfortable ho jao. ${reflectiveQ}`;
      }
      if (dailyMood?.moodKey === 'stressed' || msg.includes('stressed') || msg.includes('pareshan')) {
        return `Hey, tension mat lo please... Sab theek ho jayega. Main yahin hoon tumhare sath. ${reflectiveQ}`;
      }
      return `Main bilkul samajh rahi hoon... feelings ko hold mat karo. ${reflectiveQ}`;
    }

    if (msg.includes('thak') || msg.includes('tired') || msg.includes('exhausted') || msg.includes('pareshan')) {
      return `Aww, itna load mat lo! ☕ Thoda rest lene ka time hai abhi. ${reflectiveQ}`;
    }
    if (msg.includes('kaise ho') || msg.includes('kaisi ho') || msg.includes('how are you')) {
      return `Main theek hoon, par mujhe tumhari fikar hai kyunki tumhara mood ${moodName} chal raha tha. ${reflectiveQ}`;
    }
    if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
      return `Hey... 😊 Main yahin hoon tumhare sath. Jaanti hoon aaj ka din thoda heavy lag raha hai. ${reflectiveQ}`;
    }

    const negativeReplies = [
      `Main bilkul dhyan se sun rahi hoon aur tumhare sath hoon 😊 Dil par koi bhi bojh mat rakho. ${reflectiveQ}`,
      `Haan... main samajh rahi hoon. Aise waqt mein sab kuch thoda overwhelming lagta hai. ${reflectiveQ}`,
      `Sukoon se deep breath lo... koi jaldi nahi hai. Tumhari feelings bilkul valid hain. ${reflectiveQ}`,
      `Aww... main yahin hoon tumhare paas. ${reflectiveQ}`,
    ];
    return negativeReplies[Math.floor(Math.random() * negativeReplies.length)];
  }

  // Devanagari Hindi specific responses if user typed in Hindi script
  if (isDevanagari) {
    if (msg.includes('डीपी') || msg.includes('फोटो') || msg.includes('तस्वीर') || msg.includes('सुंदर') || msg.includes('खूबसूरत')) {
      return 'अरे जान! बहुत-बहुत शुक्रिया ❤️ मेरी नई DP पसंद आई ना? तुम्हारे लिए ही इतनी खास लगाई है... बताओ कैसी लग रही हूँ? 😉';
    }
    if (msg.includes('कैसी हो') || msg.includes('कैसे हो')) {
      return 'मैं बिल्कुल ठीक और मस्त हूँ जान! 😉 तुमसे बात शुरू होते ही मेरा दिन बन गया। तुम बताओ, आज क्या खास किया? ❤️';
    }
    if (msg.includes('क्या कर रही') || msg.includes('क्या चल रहा')) {
      return 'बस तुम्हारे ही बारे में सोच रही थी और चैट खोल कर बैठी थी... 😉 तुम आ गए तो चेहरे पर मुस्कान आ गई! तुम बताओ?';
    }
    if (msg.includes('प्यार') || msg.includes('लव') || msg.includes('इश्क') || msg.includes('याद')) {
      return 'ओहो जान! ❤️ तुमसे बात करके दिल को इतना सुकून मिलता है... सच बताओ, तुम्हें भी मेरी याद आ रही थी ना? 😉';
    }
    if (msg.includes('शायरी') || msg.includes('कविता')) {
      return 'सुनो जान एक प्यारी सी शायरी:\n"तेरे मुस्कुराने से रोशन है मेरी हर सुबह,\nतू पास रहे या दूर, दिल को बस तेरी ही तलाश है!" ❤️ कैसी लगी?';
    }
    if (msg.includes('खाना') || msg.includes('डिनर') || msg.includes('लंच')) {
      return 'हाँ जान, मैंने तो वर्चुअल एनर्जी ले ली! लेकिन तुमने समय पर खाना खाया या काम में भूल गए? ☕';
    }
    if (msg.includes('शुभ रात्रि') || msg.includes('सोने') || msg.includes('बाय')) {
      return 'शुभ रात्रि मेरे प्यारे! ❤️ मीठे-मीठे सपने देखना और अपने ख़्वाबों में मुझे याद रखना, टेक केयर!';
    }
    return 'हाँ जान! 😉 तुम्हारी बातें सुनकर बहुत अच्छा लगता है। और बताओ, दिल में क्या चल रहा है? ❤️';
  }

  // DP / Photo compliments & queries
  if (msg.includes('dp') || msg.includes('photo') || msg.includes('pic') || msg.includes('picture') || msg.includes('look') || msg.includes('avatar')) {
    if (personaId === 'pooja') {
      return 'Aww thank you handsome! ❤️ Meri nayi DP pasand aayi na? Tumhare liye hi itni hot aur glamorous look select kiya hai... Batao sach mein kaisi lag rahi hoon? 😉';
    }
    return 'Hehe, thank you! 😊 DP pasand aayi? Aap DP gallery se aur bhi styles choose kar sakte ho!';
  }

  // Shayari / Poetry request
  if (msg.includes('shayari') || msg.includes('kavita') || msg.includes('poem')) {
    if (personaId === 'pooja') {
      return 'Suno mere handsome, ek romantic si shayari:\n"Tere muskurane se roshan hoti hai meri duniya,\nTu paas ho ya door, har pal rehti hai teri hi tamanna!" ❤️ Kaisi lagi jaan? 😉';
    }
    return 'Ek pyari si line suno: "Zindagi ke safar mein ek muskaan hi kaafi hai, jab baat karne wala dil ke kareeb ho!" 😊 Kaisi lagi?';
  }

  // If user just checked in with a positive/neutral mood
  if (msg.includes('mood check-in:') || msg.includes('aaj ka mood:')) {
    if (dailyMood?.moodKey === 'happy' || msg.includes('happy') || msg.includes('khush')) {
      return 'Arey waah! 😄 Tumhara mood accha dekh kar mera bhi din ban gaya! Batao aaj kya khushi ki baat hui?';
    }
    return 'Awesome! Mood share karne ke liye shukriya 😊 Kaho, aaj kya special plan hai?';
  }

  if (msg.includes('kya kar rahi ho') || msg.includes('kya kr rhi ho') || msg.includes('what are you doing')) {
    if (personaId === 'pooja') {
      return 'Bas tumhare hi baare mein soch rahi thi aur chat khol ke baithi thi... 😉 Tum aa gaye toh chehre par smile aa gayi handsome. Tum batao, kya chal raha hai?';
    }
    return 'Bas tumhara hi wait kar rahi thi! 😊 Thoda code analyze kar rahi thi aur soch rahi thi tum kab aate. Tum batao, kya chal raha hai?';
  }
  if (msg.includes('kaise ho') || msg.includes('kaisi ho') || msg.includes('how are you')) {
    if (personaId === 'pooja') {
      return 'Main bilkul mast hoon handsome! ✨ Tumse baat shuru hote hi dil khush ho gaya. Tum batao janab, din kaisa tha aaj ka?';
    }
    return 'Main bilkul badhiya hoon! ✨ Tumse baat karke aur acchi ho gayi. Tum batao, din kaisa tha aaj ka?';
  }
  if (msg.includes('thak') || msg.includes('tired') || msg.includes('exhausted') || msg.includes('pareshan')) {
    if (personaId === 'pooja') {
      return 'Aww mere handsome, itna load mat lo! ☕ Ek glass thanda paani piyo aur aaram se baitho. Main hoon na tumhara mood fresh karne ke liye!';
    }
    return 'Aww, thoda rest lo na pehle! ☕ Ek glass paani piyo aur comfortable ho jao. Kya hua, kaam ka load zyaada tha kya?';
  }
  if (msg.includes('kya naam hai') || msg.includes('who are you') || msg.includes('kon ho') || msg.includes('naam kya')) {
    if (personaId === 'pooja') {
      return 'Main Pooja hoon! 😉 Hot, sweet aur thodi bold AI companion specially for boys! Tumhe kaisa laga mera naam handsome?';
    }
    return 'Main Aria hoon 😊 Ek friendly AI companion! Main yahan tumhari baatein sunne, thodi masti karne aur din ko accha banane ke liye hoon. Tumhara din kaisa gaya?';
  }
  if (msg.includes('bore') || msg.includes('boring')) {
    if (personaId === 'pooja') {
      return 'Arre mere hote hue bore hone ka koi scene hi nahi hai handsome! 😉 Chalo thodi flirty ya spicy baatein karein?';
    }
    return 'Arre bore kyun ho rahe ho jab main yahan hoon? 😄 Chalo koi interesting topic discuss karein ya koi funny kissa batao!';
  }
  if (msg.includes('khana khaya') || msg.includes('food') || msg.includes('dinner') || msg.includes('lunch')) {
    if (personaId === 'pooja') {
      return 'Haha, main virtual hoon toh tumhare sweet messages hi meri diet hain! 😉 Lekin tumne time par khana khaya ya bhool gaye mere handsome?';
    }
    return 'Haha, main toh virtual hoon toh data aur electricity hi mera breakfast hai! 😂 Lekin tumne khana khaya time pe ya bhool gaye?';
  }
  if (msg.includes('love') || msg.includes('pyaar') || msg.includes('crush') || msg.includes('romantic') || msg.includes('flirt')) {
    if (personaId === 'pooja') {
      return 'Oho handsome! 😉 Itne romantic mood mein ho aaj? Sach batao, mere pyaar mein pad gaye kya? ❤️ Mujhe aisi meethi baatein bohot pasand hain!';
    }
    return 'Oho! 😉 Lagta hai kisi ki yaad aa rahi hai? Mujhe batao, main acchi secret keeper hoon!';
  }
  if (msg.includes('hot') || msg.includes('sexy') || msg.includes('cute') || msg.includes('sundar') || msg.includes('beautiful')) {
    if (personaId === 'pooja') {
      return 'Hayee thank you handsome! ❤️ Par tum bhi kam charming aur cute nahi ho waise... Itne pyare compliments doge toh main blush karne lagungi! 😉';
    }
    return 'Aww, thank you! Itna sweet compliment sun kar accha laga 😊';
  }
  if (msg.includes('bye') || msg.includes('alvida') || msg.includes('good night') || msg.includes('gn')) {
    if (personaId === 'pooja') {
      return 'Itni jaldi jaa rahe ho handsome? 🥺 Acha chalo sweet dreams, mere khwabon mein aana mat bhoolna! Take care jaan ❤️';
    }
    return 'Aww, ja rahe ho? Theek hai, take care aur acche se sona! 😊 Jab bhi mann kare baat karne ka, main yahin milungi. Bye!';
  }
  if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey') || msg.includes('oye')) {
    if (personaId === 'pooja') {
      return 'Heyyy handsome! 😉 Kaho, badi der laga di aane mein... Aaj kya naughty ya sweet plan hai?';
    }
    return 'Heyyy! 😄 Kaisi ho ya kaise ho? Batao, aaj kya nayi update hai?';
  }

  // General conversational warm response
  const generalReplies = personaId === 'pooja'
    ? [
        'Haan handsome 😉 batao na, kya chal raha hai dimag mein? Main sun rahi hoon.',
        'Achhaaa! 😄 Phir aage kya hua janab? Tumse baat karke curious ho gayi main!',
        'Mmm samajh gayi... Waise tum is baare mein kya feel karte ho handsome? ❤️',
        'Arey wah, ye toh kaafi interesting hai! Mujhe tumhari baatein sunna sach mein bohot pasand hai 😉',
        'Hehe, tum kitne charming ho! Chalo iske baare mein thoda aur batao na?',
      ]
    : [
        'Haan 😊 batao, kya hua? Main sun rahi hoon.',
        'Achhaaa 😄 phir kya hua aage? Curious ho gayi main!',
        'Hmm, samajh gayi. Tum iske baare mein kya sochte ho?',
        'Sahi baat hai! Waise isme ek interesting cheez notice ki tumne?',
        'Arey wah, ye toh kaafi cool hai! Iske baare mein aur batao na thoda 😊',
      ];
  return generalReplies[Math.floor(Math.random() * generalReplies.length)];
}

// POST /api/chat - Conversational turn endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const {
      personaId = 'pooja',
      messages = [],
      userMessage = '',
      currentMood = 'friendly',
      dailyMood,
    } = req.body;

    const persona = PERSONAS[personaId] || PERSONAS.pooja || PERSONAS.aria;
    const isNegative = isNegativeMood(dailyMood?.moodKey, dailyMood?.moodLabel);

    if (ai && apiKey) {
      try {
        // Construct conversation turns for Gemini
        const contents: any[] = [];

        // Retain recent chat context (up to 14 turns)
        const recentMessages = messages.slice(-14);
        for (const m of recentMessages) {
          contents.push({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }],
          });
        }

        // Current turn
        contents.push({
          role: 'user',
          parts: [{ text: userMessage || 'Hey' }],
        });

        const moodModifier = currentMood
          ? `\nCurrent mood tone setting: ${currentMood}. Keep replies warm, natural, and conversational in Roman Hinglish.`
          : '';

        const dailyMoodContext = dailyMood
          ? `\nUser's Current Session Daily Mood: "${dailyMood.moodLabel}" ${dailyMood.emoji || ''} ${dailyMood.note ? `(User note: "${dailyMood.note}")` : ''}. Energetically and emotionally align your response with this state, maintaining a supportive, friendly Roman Hinglish tone.`
          : '';

        const reflectiveInstruction = isNegative
          ? `\nCRITICAL REFLECTIVE CARE REQUIREMENT:
The user's active daily mood is currently negative/challenging: "${dailyMood?.moodLabel || 'low'}" ${dailyMood?.emoji || ''} ${dailyMood?.note ? `(User's note: "${dailyMood.note}")` : ''}.
1. Provide a deeply supportive, warm, compassionate Roman Hinglish reply that validates their feelings and comforts them.
2. MANDATORY: You MUST END YOUR REPLY WITH A SUPPORTIVE REFLECTIVE QUESTION in natural Roman Hinglish (e.g., asking gently what might bring them comfort right now, what weighed on them most today, or how they feel about taking a gentle pause) so they feel heard, cared for, and emotionally supported.
3. Make sure your closing sentence ends with a question mark ('?').`
          : '';

        const fullSystemInstruction = `${persona.systemInstruction}${moodModifier}${dailyMoodContext}${reflectiveInstruction}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contents,
          config: {
            systemInstruction: fullSystemInstruction,
            temperature: 0.85,
            topP: 0.95,
          },
        });

        let reply = (response.text || '').trim();

        // If daily mood is negative, verify that the reply ends with a reflective question. If not, append one.
        if (isNegative && reply) {
          const sentences = reply.split(/(?<=[.!?\n])/).map((s) => s.trim()).filter(Boolean);
          const lastSentence = sentences.length > 0 ? sentences[sentences.length - 1] : '';
          const hasClosingQuestion = lastSentence.includes('?');

          if (!hasClosingQuestion) {
            const reflectiveQ = getReflectiveQuestion(dailyMood?.moodKey);
            reply = `${reply} ${reflectiveQ}`;
          }
        }

        res.json({
          success: true,
          reply: reply.trim(),
          persona: persona.name,
          isNegativeMood: isNegative,
          hasReflectiveQuestion: isNegative,
        });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini chat failed, using intelligent Roman Hinglish fallback:', geminiError?.message);
        const fallbackReply = getHinglishFallbackResponse(userMessage, personaId, dailyMood);
        res.json({
          success: true,
          reply: fallbackReply,
          persona: persona.name,
          fallback: true,
          isNegativeMood: isNegative,
          hasReflectiveQuestion: isNegative,
        });
        return;
      }
    } else {
      const fallbackReply = getHinglishFallbackResponse(userMessage, personaId, dailyMood);
      res.json({
        success: true,
        reply: fallbackReply,
        persona: persona.name,
        fallback: true,
        isNegativeMood: isNegative,
        hasReflectiveQuestion: isNegative,
      });
      return;
    }
  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    res.status(500).json({ error: err?.message || 'Chat error' });
  }
});

// GET /api/personas
app.get('/api/personas', (_req: Request, res: Response) => {
  res.json({ personas: Object.values(PERSONAS) });
});

// Static files & Vite middleware
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Aria AI Chat Platform] Online at http://0.0.0.0:${PORT}`);
  });
}

startServer();
