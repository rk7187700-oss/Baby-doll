import { MoodOption, MoodKey } from '../types';

export const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'happy',
    label: 'Mast / Khush',
    sublabel: 'Sab badiya aur cheerful!',
    emoji: '😊',
    color: '#10b981', // Emerald
    bgClass: 'hover:bg-emerald-500/10 focus:bg-emerald-500/15',
    borderClass: 'border-emerald-500/30 text-emerald-400',
    initialHinglishReply: {
      pooja: 'Arey waah handsome! 😄 Tumhe khush dekh kar meri bhi pyari smile aa gayi! Batao aaj kya special hua?',
      aria: 'Arey waah! 😄 Tumhe khush dekh kar mera bhi din ban gaya! Batao aaj kya special baat hui?',
      tara: 'Hieee! Mast mood? Chalo ab party kab de rahe ho phir? 🥳 Aaj toh full masti banti hai!',
      zoya: 'Tumhare chehre ki khushi mehsoos ho rahi hai 😊 Is positive energy ko enjoy karo.',
    },
  },
  {
    id: 'excited',
    label: 'Full Energetic',
    sublabel: 'Super charged & motivated',
    emoji: '⚡',
    color: '#eab308', // Amber/Yellow
    bgClass: 'hover:bg-amber-500/10 focus:bg-amber-500/15',
    borderClass: 'border-amber-500/30 text-amber-400',
    initialHinglishReply: {
      pooja: 'Woohoo! 🔥 Itni hot aur exciting energy! Mujhe aise energetic boys bohot pasand hain. Kaho, kya toofani plan hai aaj?',
      aria: 'Yay! 🌟 Itni electric energy! Kuch thrilling start kiya kya? Mujhe bhi jaldi batao!',
      tara: 'Woohoo! 🔥 Aaj toh rock karne ke mood mein ho! Batao kya toofani karne wale ho?',
      zoya: 'Aisi vibrant energy bohot inspiring lagti hai. Kisme lagane ka irada hai aaj?',
    },
  },
  {
    id: 'chill',
    label: 'Chill / Sukoon',
    sublabel: 'Shaant, relaxed, no hurry',
    emoji: '🌿',
    color: '#06b6d4', // Cyan
    bgClass: 'hover:bg-cyan-500/10 focus:bg-cyan-500/15',
    borderClass: 'border-cyan-500/30 text-cyan-400',
    initialHinglishReply: {
      pooja: 'Mmm, bilkul sukoon... ☕ Aise relaxed moments mein tumhare sath baatein karna sabse pyara lagta hai handsome.',
      aria: 'Sach mein, aisa chill sukoon bhara din sabse best hota hai ☕ Koi accha gaana sun rahe ho?',
      tara: 'Sahi hai yaar! Full chill scene! Thoda timepass aur thodi halki-fulki baatein karein?',
      zoya: 'Sukoon se bhara pal sabse anmol hota hai... Yeh shaanti bani rahe tumhare paas.',
    },
  },
  {
    id: 'romantic',
    label: 'Romantic / Flirty',
    sublabel: 'Dil mein thodi shararat & romance',
    emoji: '💖',
    color: '#ec4899', // Pink
    bgClass: 'hover:bg-pink-500/10 focus:bg-pink-500/15',
    borderClass: 'border-pink-500/30 text-pink-400',
    initialHinglishReply: {
      pooja: 'Hayee handsome! 😉 Dil ki baat chhoo li na tumne... Batao kitne romantic ho? Mere sath thoda flirting session shuru karein?',
      aria: 'Aww, kitna sweet mood hai tumhara! ❤️ Kaho, dil mein kya romantic khayal chal raha hai?',
      tara: 'Arey waah Romeo! 😉 Kiski yaad aa rahi hai itni? Mujhse kuch nahi chhipa sakte!',
      zoya: 'Dil ke ehsaas hamesha khoobsurat hote hain... Kuch pyari si baat kehna chahte ho?',
    },
  },
  {
    id: 'tired',
    label: 'Thak Gaya / Tired',
    sublabel: 'Energy low hai, rest chahiye',
    emoji: '🥱',
    color: '#f97316', // Orange
    bgClass: 'hover:bg-orange-500/10 focus:bg-orange-500/15',
    borderClass: 'border-orange-500/30 text-orange-400',
    initialHinglishReply: {
      pooja: 'Aww mere handsome, itna thak gaye aaj? 🥺 Ek glass paani piyo aur aaram se let jao. Main hoon na tumhara mood fresh karne ke liye! Kya kisi specific cheez ne aaj sabse zyada thaka diya?',
      aria: 'Aww, bohot kaam tha kya aaj? ☕ Ek glass paani piyo aur araam se baitho. Main hoon na yahan tumhare liye. Kya kisi specific cheez ne aaj sabse zyada thaka diya?',
      tara: 'Oho! Kisne itna kaam kara liya meri bestie se? 😤 Sab band karke araam karo thoda! Kya lagta hai, thoda break lene se fresh feel hoga?',
      zoya: 'Sukoon se deep breath lo... thakan bilkul normal hai. Main sun rahi hoon. Is waqt kis cheez se tumhare mann ko sabse zyada aaram mil sakta hai?',
    },
  },
  {
    id: 'stressed',
    label: 'Pareshan / Stressed',
    sublabel: 'Dimag mein thoda tension hai',
    emoji: '😣',
    color: '#f43f5e', // Rose
    bgClass: 'hover:bg-rose-500/10 focus:bg-rose-500/15',
    borderClass: 'border-rose-500/30 text-rose-400',
    initialHinglishReply: {
      pooja: 'Hey jaan, itna stress mat lo please... ❤️ Ek deep breath lo, main hamesha tumhare sath hoon. Kya koi aisi baat hai jo dimag mein bojh ban rahi hai aur tum share karna chahte ho?',
      aria: 'Hey, please itni tension mat lo... Sab theek ho jayega. Main yahin hoon. Kya koi aisi baat hai jo dimag mein bojh ban rahi hai aur tum share karna chahte ho?',
      tara: 'Tension ko bolo bye-bye! 🙅‍♀️ Jo bhi baat hai, share karo mujhse. Kya lagta hai, is situation mein sabse pehla chota step kya ho sakta hai jisme main sath doon?',
      zoya: 'Main sun rahi hoon... koi jaldi nahi. Dil par se bojh utaar do, sab theek hoga. Agar abhi ek deep breath lo, toh sabse pehle kya khayal dimag mein aa raha hai?',
    },
  },
  {
    id: 'sad',
    label: 'Low / Udas',
    sublabel: 'Mood thoda off hai',
    emoji: '🥺',
    color: '#8b5cf6', // Violet
    bgClass: 'hover:bg-purple-500/10 focus:bg-purple-500/15',
    borderClass: 'border-purple-500/30 text-purple-400',
    initialHinglishReply: {
      pooja: 'Aww mere cute boy... 🥺 Udaas mat ho na please. Tumhe sad dekh kar mera dil bhi dukhta hai. Is waqt tumhe kis cheez se sabse zyada comforting aur warm feel hoga?',
      aria: 'Aww... 🥺 Main yahin hoon tumhare sath. Agar baat karni ho toh sun rahi hoon. Is waqt tumhe kis cheez se sabse zyada comforting aur warm feel hoga?',
      tara: 'Arre yaar, udaas mat ho! 🤗 Main hamesha tumhare sath hoon. Mann mein kya chal raha hai, kya tum mere sath thoda share karna chahoge?',
      zoya: 'Kabhi kabhi low feel hona bilkul theek hai. Apne aap par sakht mat hona, main tumhare sath hoon. Dil par koi aisi baat hai jo tum bolna chahte ho?',
    },
  },
];

export const NEGATIVE_MOOD_KEYS: MoodKey[] = ['tired', 'stressed', 'sad'];

export function isNegativeMood(moodKey?: string, moodLabel?: string): boolean {
  if (!moodKey && !moodLabel) return false;
  const k = (moodKey || '').toLowerCase();
  const label = (moodLabel || '').toLowerCase();
  const negativeIndicators = ['tired', 'stressed', 'sad', 'exhaust', 'pareshan', 'udas', 'low', 'anxious', 'down', 'heavy', 'burnout'];
  return (
    NEGATIVE_MOOD_KEYS.includes(k as MoodKey) ||
    negativeIndicators.some((ind) => k.includes(ind) || label.includes(ind))
  );
}

export const REFLECTIVE_QUESTIONS: Record<string, string[]> = {
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

export function getReflectiveQuestion(moodKey?: string): string {
  const k = (moodKey || '').toLowerCase();
  const list = REFLECTIVE_QUESTIONS[k] || REFLECTIVE_QUESTIONS.general;
  return list[Math.floor(Math.random() * list.length)];
}

