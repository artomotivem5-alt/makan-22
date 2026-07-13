'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useCart } from '@/context/cart-context';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  type?: 'text' | 'categories' | 'items' | 'cart_summary' | 'recommendation' | 'location' | 'reservation';
  items?: any[];
  options?: string[];
  timestamp: Date;
  recommendation?: any;
}

const MENU_ITEMS = [
  // Breakfast Lounge
  { id: 'croissant-salmon', name: 'Croissant Salmon', price: 216, category: 'Breakfast Lounge', description: 'Smoked premium Norwegian salmon, microgreens, whipped lemon cheese, toasted flaky croissant.' },
  { id: 'scramble-eggs', name: 'Scramble Eggs', price: 162, category: 'Breakfast Lounge', description: 'Soft double-folded creamy farm eggs, chives, toasted organic sourdough.' },
  { id: 'avocado-toast', name: 'Avocado Toast', price: 175, category: 'Breakfast Lounge', description: 'Avocado spread, organic poached eggs, creamy Greek feta, chili flakes, toasted sourdough.' },
  // Beef Lounge
  { id: 'tenderloin-mushroom', name: 'Tenderloin Mushroom', price: 408, category: 'Beef Lounge', description: 'Seared prime tenderloin fillet, sautéed field mushrooms, marrow demi-glace reduction.' },
  { id: 'king-short-ribs', name: 'King Short Ribs', price: 675, category: 'Beef Lounge', description: 'Slow 24-hour braised short ribs, sweet potato mash, charred shallots.' },
  { id: 'ribeye-steak', name: 'Ribeye Steak', price: 590, category: 'Beef Lounge', description: 'Prime 400g grass-fed ribeye steak, seared with fresh rosemary garlic butter.' },
  // Pizza Lounge
  { id: 'margherita', name: 'Margherita', price: 190, category: 'Pizza Lounge', description: 'Crushed San Marzano tomatoes, buffalo mozzarella, fresh basil, extra virgin olive oil.' },
  { id: 'makan-pizza', name: 'Makan Pizza', price: 380, category: 'Pizza Lounge', description: 'Blistered sourdough crust, beef bresaola, wild arugula, shaved parmesan, white truffle oil drizzle.' },
  { id: 'truffle-mushroom-pizza', name: 'Truffle Mushroom Pizza', price: 350, category: 'Pizza Lounge', description: 'White base, wild mushrooms, fresh mozzarella, truffle oil, and baby arugula.' },
  // Pasta Lounge
  { id: 'truffle-pasta', name: 'Truffle Pasta', price: 164, category: 'Pasta Lounge', description: 'Handmade tagliatelle, black truffle paste, wild forest mushrooms, cream reduction.' },
  { id: 'seafood-rose-pasta', name: 'Seafood Rose Pasta', price: 301, category: 'Pasta Lounge', description: 'Paccheri pasta, fresh wild prawns, calamari, rich cherry tomato rose sauce.' },
  { id: 'pesto-gnocchi', name: 'Pesto Gnocchi', price: 220, category: 'Pasta Lounge', description: 'Handcrafted soft potato gnocchi tossed in aromatic basil pesto and toasted pine nuts.' },
  // Drinks
  { id: 'v60-coffee', name: 'V60 Coffee', price: 144, category: 'Drinks', description: 'Slow drip filter coffee, single-origin berries, served over custom carved ice.' },
  { id: 'pistachio-milkshake', name: 'Pistachio Milkshake', price: 138, category: 'Drinks', description: 'Whipped pistachio paste, organic vanilla bean cream, cold organic whole milk.' },
  { id: 'iced-matcha', name: 'Iced Matcha', price: 109, category: 'Drinks', description: 'Uji matcha stone-ground, light raw honey, cold organic oat milk.' },
  { id: 'spanish-latte', name: 'Spanish Latte', price: 115, category: 'Drinks', description: 'Double shot espresso, sweet condensed milk, and organic cold milk.' }
];

const CATEGORIES = [
  { id: 'breakfast', name: 'Breakfast Lounge' },
  { id: 'pizza', name: 'Pizza Lounge' },
  { id: 'beef', name: 'Beef Lounge' },
  { id: 'pasta', name: 'Pasta Lounge' },
  { id: 'drinks', name: 'Drinks Lounge' }
];

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  breakfast: ['فطور', 'افطار', 'فطورنا', 'بيض', 'كرواسون', 'سلمون', 'عسل', 'توست'],
  pizza: ['بيتزا', 'بيتزه', 'مارجريتا', 'ترافل', 'مشروم بيتزا'],
  beef: ['لحم', 'لحوم', 'ستيك', 'ريباي', 'شورت ريبس', 'تندرلوين'],
  pasta: ['باستا', 'مكرونه', 'مكرونة', 'نوكي', 'بينى', 'بيني'],
  drinks: ['مشروب', 'مشروبات', 'قهوه', 'قهوة', 'ماتشا', 'لاتيه', 'لاتى', 'سبانش', 'ميلك شيك', 'بارد', 'سخن', 'v60']
};

const RECOMMENDATIONS = {
  1: [
    { id: 'avocado-toast', name: 'Avocado Toast', desc: 'Avocado spread, organic poached eggs, creamy Greek feta, chili flakes, toasted sourdough.', price: 175, category: 'Breakfast Lounge' },
    { id: 'v60-coffee', name: 'V60 Coffee', desc: 'Slow drip filter coffee, single-origin berries, served over custom carved ice.', price: 144, category: 'Drinks' }
  ],
  2: [
    { id: 'makan-pizza', name: 'Makan Pizza', desc: 'Blistered sourdough crust, beef bresaola, wild arugula, shaved parmesan, white truffle oil drizzle.', price: 380, category: 'Pizza Lounge' },
    { id: 'truffle-pasta', name: 'Truffle Pasta', desc: 'Handmade tagliatelle, black truffle paste, wild forest mushrooms, cream reduction.', price: 164, category: 'Pasta Lounge' }
  ],
  3: [
    { id: 'ribeye-steak', name: 'Ribeye Steak', desc: 'Prime 400g grass-fed ribeye steak, seared with fresh rosemary garlic butter.', price: 590, category: 'Beef Lounge' },
    { id: 'makan-pizza', name: 'Makan Pizza', desc: 'Blistered sourdough crust, beef bresaola, wild arugula, shaved parmesan, white truffle oil drizzle.', price: 380, category: 'Pizza Lounge' }
  ],
  5: [
    { id: 'king-short-ribs', name: 'King Short Ribs', desc: 'Slow 24-hour braised short ribs, sweet potato mash, charred shallots.', price: 675, category: 'Beef Lounge' },
    { id: 'tenderloin-mushroom', name: 'Tenderloin Mushroom', desc: 'Seared prime tenderloin fillet, sautéed field mushrooms, marrow demi-glace reduction.', price: 408, category: 'Beef Lounge' },
    { id: 'seafood-rose-pasta', name: 'Seafood Rose Pasta', desc: 'Paccheri pasta, fresh wild prawns, calamari, rich cherry tomato rose sauce.', price: 301, category: 'Pasta Lounge' }
  ]
};

const normalizeArabic = (text: string): string => {
  return text
    .replace(/[أإآأ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ئ/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/[ًٌٍَُِّ]/g, '')
    .toLowerCase()
    .trim();
};

const matchesKeywords = (normText: string, keywords: string[]): boolean => {
  return keywords.some(keyword => normText.includes(normalizeArabic(keyword)));
};

const isGreetingOrCommand = (text: string): boolean => {
  const norm = normalizeArabic(text);
  
  // Greetings
  const greetings = ['سلام', 'اهلان', 'اهلين', 'مرحب', 'مرحبا', 'هلو', 'هاي', 'hi', 'hello', 'hey', 'صباح', 'مساء', 'يسعد', 'كيفك', 'شلونك', 'اخبارك', 'ازيك', 'عامل ايه', 'salam', 'marhaba', 'ezayak', 'ezayk', '3amel eh', '3aml eh', 'good morning', 'good evening', 'good afternoon', 'how are you'];
  if (greetings.some(kw => norm.includes(normalizeArabic(kw)))) {
    return true;
  }
  
  // Commands/Keywords/Topics
  const commands = ['منيو', 'اكل', 'طعام', 'عرض', 'عروض', 'خصم', 'توفير', 'عجلة', 'عجله', 'حظ', 'سلة', 'سله', 'طلب', 'عنوان', 'مكان', 'فروع', 'فرع', 'فين', 'بلد', 'موقع', 'تليفون', 'رقم', 'دليفري', 'توصيل', 'شكوى', 'شكاوي', 'مشكلة', 'مشكله', 'سيء', 'اقتراح', 'صالة', 'صاله', 'مواعيد', 'ساعات', 'ساعة', 'ساعه', 'شغالين', 'مفتوح', 'جعان', 'جوع', 'جعت', 'عطشان', 'عطش', 'صاحبي', 'صديقي', 'حلو', 'حادق', 'ساقع', 'سخن', 'سخنة', 'سخنه', 'حجز', 'طاولة', 'طاوله', 'قائمة', 'قائمه', 'دايت', 'نباتي', 'صحي', 'اسعار', 'غالي', 'رخيص', 'نكتة', 'فزورة', 'سياسة', 'كورة', 'برمجة', 'ذكاء اصطناعي', 'اشرب', 'مشروب', 'مشروبات', 'عصير', 'عصاير', 'menu', 'food', 'eat', 'hungry', 'thirsty', 'drink', 'prices', 'price', 'location', 'address', 'book', 'reservation', 'table', 'cart', 'order', 'vegan', 'diet', 'healthy', 'offer', 'discount', 'delivery', 'takeaway', 'complaint', 'problem', 'bad', 'suggest', 'recommend', 'open', 'hours', 'time', 'sweet', 'dessert', 'savory', 'hot', 'cold', 'friend', 'bot', 'ai', 'joke', 'sport', 'politics', 'code', 'programming', 'g3an', 'ga3an', '3atshan', 'atshan', 'akl', 'akll', 'eshrb', 'ashrb', 'mshrob', 'mshrobat', '3aser', '3ser', 'twsil', 'as3ar', 'as3aar', '7agz', 'hagz', 'tawla', 'tarabeza', 'makan', 'shakwa', 'moshkela', 'mo4kela', 'e5tara7', 'e9tra7', 'sa7by', 'sa7be', '7elw', '7lw', '7ade2', 'sa2e3', 'sa23', 'so5n', 'soxne', 'dayt', 'nabaty', 'nokat', 'nokta', 'fazoora', 'syasa', 'kora', 'koura'];
  if (commands.some(kw => norm.includes(normalizeArabic(kw)))) {
    return true;
  }
  
  // Common short filler words or generic rejects
  const fillers = ['نعم', 'لا', 'تمام', 'اوكي', 'ok', 'ايوه', 'ايوة', 'حاضر', 'ماشي', 'شكر', 'شكرا', 'تسلم', 'حبيبي', 'يا', 'يا غالي', 'يا باشا', 'yes', 'no', 'thanks', 'thank you', 'shokran', 'tslam', 'mashy', 'tamam', 'tmm', 'aywa', 'ah'];
  if (fillers.some(kw => norm === normalizeArabic(kw) || norm.startsWith(normalizeArabic(kw) + ' ') || norm.endsWith(' ' + normalizeArabic(kw)))) {
    return true;
  }

  return false;
};

const searchMenu = (query: string): any[] => {
  const normalizedQuery = normalizeArabic(query);
  if (!normalizedQuery) return [];
  return MENU_ITEMS.filter((item) => normalizeArabic(item.name).includes(normalizedQuery));
};

export default function ChatBot() {
  const { cartItems, addToCart, updateQuantity, totalAmount, totalItemsCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [lastRecommendIdx, setLastRecommendIdx] = useState<Record<number, number>>({ 1: -1, 2: -1, 3: -1, 5: -1 });

  // Scroll visibility state: show chatbot only after scrolling past the first hero page
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const heroHeight = window.innerHeight;
        // Show after scrolling past the first hero page
        if (window.scrollY > heroHeight * 0.95) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check immediately on client mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const showChatBot = isVisible || isOpen;

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: 'مرحباً بك في مَكان (MAKAN) 🤖🌸\n\nأنا مساعدك الرقمي المخصص لملاذ مَكان الهادئ. هنا لمساعدتك في تصفح قائمتنا المبتكرة وتأكيد طلبك أو حجز طاولتك الخاصة. كيف يمكنني خدمتك اليوم؟',
        options: ['📋 تصفح القائمة', '🤔 محتار؟ اقترح وجبة', '📅 حجز طاولة', '⏰ مواعيد العمل', '📍 موقع ملاذنا'],
        timestamp: new Date()
      }
    ]);
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    // Standard Message Flow
    const userMessage: Message = { id: `user-${Date.now()}`, sender: 'user', text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue('');

    setTimeout(() => {
      const response = generateBotResponse(text);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        ...response,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 450);
  };

  const getRecommendation = (persons: 1 | 2 | 3 | 5) => {
    const list = RECOMMENDATIONS[persons];
    let idx = Math.floor(Math.random() * list.length);
    if (idx === lastRecommendIdx[persons] && list.length > 1) {
      idx = (idx + 1) % list.length;
    }
    setLastRecommendIdx(prev => ({ ...prev, [persons]: idx }));
    return list[idx];
  };

  const generateBotResponse = (query: string): Omit<Message, 'id' | 'sender' | 'timestamp'> => {
    const normText = normalizeArabic(query);
    const greet = 'يا غالي';

    // Adding dynamic item order via chatbot
    if (
      normText.includes('اضف') || 
      normText.includes('اضيف') || 
      normText.includes('عايز') || 
      normText.includes('اطلب') || 
      normText.includes('زود') || 
      normText.includes('هات')
    ) {
      const cleanSearch = query
        .replace(/(اضف|اضيف|عايز|اطلب|زود|هات|واحد|٢|3|4|5|من فضلك|لو سمحت|لي|لى|ساندوتش|كريب|وجبة|وجبه)/g, '')
        .trim();
      
      const matched = searchMenu(cleanSearch);
      if (matched.length > 0) {
        const item = matched[0];
        addToCart({
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.price
        });
        return {
          text: `✅ تم إضافة **${item.name}** لسلتك بنجاح. السعر: ${item.price} جنيه.\n\nتحب تضيف حاجة تانية؟`,
          options: ['🛒 سلتك الحالية', '📋 تصفح القائمة']
        };
      }
    }

    // Category routing
    let matchedCategory: string | null = null;
    let matchedCategoryName = '';

    for (const [catId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      const categoryObj = CATEGORIES.find(c => c.id === catId);
      const catName = categoryObj ? categoryObj.name : '';
      if (
        normText.includes(normalizeArabic(catName)) ||
        keywords.some(kw => normText.includes(normalizeArabic(kw)))
      ) {
        matchedCategory = catId;
        matchedCategoryName = catName;
        break;
      }
    }

    if (matchedCategory) {
      const items = MENU_ITEMS.filter(i => i.category.toLowerCase().includes(matchedCategory!)) || [];
      if (items.length > 0) {
        return {
          text: `ملاذنا يقدم أرقى أصناف **${matchedCategoryName}**. يمكنك الضغط على "+ إضافة" للطلب مباشرة من هنا:`,
          type: 'items',
          items: items,
          options: ['📋 تصفح القائمة', '🛒 سلتك الحالية']
        };
      }
    }

    // Interactive Helper Recommendations
    if (normText.includes('محتار') || normText.includes('مش عارف') || normText.includes('ترشيح') || normText.includes('اقترح') || normText.includes('suggest') || normText.includes('recommend') || normText.includes('e5tara7') || normText.includes('e9tra7')) {
      return {
        text: 'ولا يهمك يا صديقي! 😉 سيب ذوقك عليا وسأقترح لك أشهى الأطباق والمشروبات في مَكان. قولي الأوردر ده بيكون لكام فرد تقريباً؟',
        options: ['👤 فرد واحد', '👥 فردين', '👨‍👩‍👧‍👦 3 إلى 4 أفراد', '👑 مجموعة (5 أفراد أو أكثر)']
      };
    }

    if (normText.includes('فرد واحد') || normText === '1' || normText.includes('one') || normText.includes('wa7ed')) {
      const rec = getRecommendation(1);
      return {
        text: `بما إنك لوحدك، بنقترح تبدأ بالخيارات المميزة دي لتستمتع باللحظة الهادئة: 👇\n\n(بالمناسبة، لو تحب تطلب مشروب يظبط الأكلة، قولي "اشرب")`,
        type: 'recommendation',
        recommendation: rec,
        options: ['🤔 اقتراح تاني؟', '🥤 نفسي اشرب حاجة', '🛒 سلتك الحالية']
      };
    }

    if (normText.includes('فردين') || normText === '2' || normText.includes('two') || normText.includes('etnen')) {
      const rec = getRecommendation(2);
      return {
        text: `لمشاركتنا التجربة لشخصين، بنقترح عليكم هذا الاختيار المتكامل: 👇\n\nتحبوا تشوفوا المشروبات كمان؟`,
        type: 'recommendation',
        recommendation: rec,
        options: ['🤔 اقتراح تاني؟', '🥤 نفسي اشرب حاجة', '🛒 سلتك الحالية']
      };
    }

    if (normText.includes('3') || normText.includes('ثلاث') || normText.includes('اربع') || normText.includes('4 أفراد') || normText.includes('three') || normText.includes('four') || normText.includes('talata')) {
      const rec = getRecommendation(3);
      return {
        text: `للشلة والأصدقاء، بنقترح عليكم التشكيلة الرائعة دي: 👇\n\nممكن أضيف لكم عصاير فريش للترطيب؟ 😉`,
        type: 'recommendation',
        recommendation: rec,
        options: ['🤔 اقتراح تاني؟', '🥤 نفسي اشرب حاجة', '🛒 سلتك الحالية']
      };
    }

    if (normText.includes('مجموعه') || normText.includes('مجموعة') || normText.includes('5 أفراد') || normText.includes('اكثر') || normText.includes('group') || normText.includes('magmo3a')) {
      const rec = getRecommendation(5);
      return {
        text: `للمجموعات الكبيرة والولائم المميزة، بنقترح الأصناف الفاخرة دي لتجربة دافئة: 👇\n\n(متنسوش تطلبوا مشروبات للكل!)`,
        type: 'recommendation',
        recommendation: rec,
        options: ['🤔 اقتراح تاني؟', '🥤 نفسي اشرب حاجة', '🛒 سلتك الحالية']
      };
    }

    if (normText.includes('اقتراح تاني') || normText.includes('اقتراح ثاني') || normText.includes('another') || normText.includes('other') || normText.includes('ghero')) {
      return {
        text: 'على الرحب والسعة، تحب نقترح وجبة لكام فرد المرة دي؟',
        options: ['👤 فرد واحد', '👥 فردين', '👨‍👩‍👧‍👦 3 إلى 4 أفراد', '👑 مجموعة (5 أفراد أو أكثر)']
      };
    }

    // Conversational & Friend Mode
    if (matchesKeywords(normText, ['جعان', 'جوعان', 'جعت', 'هموت من الجوع', 'نفسي اكل', 'hungry', 'starving', 'g3an', 'ga3an'])) {
      return {
        text: `سلامتك من الجوع يا صاحبي! 😄\nمَكان هنا عشان يظبطلك مودك.\nقولي، تحب تاكل حاجة "حادق" تشبعك، ولا نفسك في حاجة "حلو" تروق عليك؟`,
        options: ['🍕 حادق (أكلات)', '🍰 حلو (مشروبات وحلويات)']
      };
    }

    if (matchesKeywords(normText, ['حادق', 'اكلات', 'غداء', 'عشاء', 'لحوم', 'اكلني', 'savory', 'food', 'lunch', 'dinner', 'meat', '7ade2', 'akl'])) {
      return {
        text: `يا سيدي طلبك عندنا! 🥩🍕\nبنقدملك أشهى اللحوم في Beef Lounge، وألذ بيتزا وباستا.\nتحب لحوم ولا بيتزا/باستا؟`,
        options: ['🥩 لحوم', '🍕 بيتزا وباستا', '🤔 اقترحلي وجبة']
      };
    }

    if (matchesKeywords(normText, ['اشرب', 'عايز اشرب', 'نفسي اشرب', 'اشرب ايه', 'مشروب', 'مشروبات', 'عصاير', 'عصير', 'drink', 'beverage', 'juice', 'ashrb', 'eshrb', 'mshrob', '3aser'])) {
      return {
        text: `يا سلام، أحلى مشروب لأحلى ضيف! 🍹\nعندنا في مَكان قسم كامل للمشروبات (Drinks Lounge). تحب حاجة سخنة تفوقك ولا ساقعة ترطب عليك؟`,
        options: ['☕ حاجة سخنة', '🧊 حاجة ساقعة', '📋 وريني قسم Drinks Lounge']
      };
    }

    if (matchesKeywords(normText, ['حلو', 'حلويات', 'عطشان', 'عطش', 'قهوة', 'اروق', 'sweet', 'dessert', 'thirsty', 'coffee', '7elw', '7lw', 'atshan', '3atshan', 'ahwa', '2hwa'])) {
      return {
        text: `أحلى روقان في مَكان! ☕✨\nتحب تشرب حاجة سخنة تظبط الدماغ ولا حاجة ساقعة ترطب على قلبك؟`,
        options: ['☕ حاجة سخنة', '🧊 حاجة ساقعة', '📋 وريني قسم Drinks Lounge']
      };
    }

    if (matchesKeywords(normText, ['حاجة سخنة', 'سخن', 'سخنه', 'قهوه', 'شاي', 'لاتيه', 'دفي', 'hot', 'tea', 'latte', 'warm', 'so5n', 'soxne', 'shay'])) {
      return {
        text: `مفيش أحلى من فنجان قهوة V60 أو سبانش لاتيه دافي يظبط المزاج! ☕\nشوف مشروباتنا واختار اللي يعجبك:`,
        options: ['☕ وريني قسم Drinks Lounge', '📋 تصفح القائمة']
      };
    }

    if (matchesKeywords(normText, ['حاجة ساقعة', 'ساقع', 'ساقعه', 'عصير', 'ميلك شيك', 'ماتشا', 'بارد', 'عطشان', 'ارطب', 'cold', 'iced', 'matcha', 'milkshake', 'cool', 'sa2e3', 'sa23'])) {
      return {
        text: `عشان ترطب على قلبك، عندنا Iced Matcha وميلك شيك فستق حكاية! 🧊\nتحب تشوف المشروبات؟`,
        options: ['🧊 وريني قسم Drinks Lounge', '📋 تصفح القائمة']
      };
    }

    if (matchesKeywords(normText, ['لحوم', 'ستيك', 'beef', 'لحمة', 'ريباي', 'تندرلوين', 'steak', 'meat', 'ribeye', 'tenderloin', 'la7ma', 'l7ma'])) {
      return {
        text: `عشاق اللحوم! 🥩 ملاذنا بيقدم لك أفضل قطعيات اللحم (Ribeye, Tenderloin). اضغط هنا عشان تشوفهم:`,
        options: ['🥩 وريني قسم Beef Lounge', '📋 تصفح القائمة']
      };
    }

    if (matchesKeywords(normText, ['بيتزا', 'باستا', 'مكرونة', 'مكرونه', 'ايطالي', 'pizza', 'pasta', 'italian', 'macaroni', 'makarona'])) {
      return {
        text: `المطبخ الإيطالي عندنا ليه طعم تاني! 🍕🍝 تحب البيتزا النابولي ولا الباستا الطازجة؟`,
        options: ['🍕 وريني قسم Pizza Lounge', '🍝 وريني قسم Pasta Lounge', '🤔 اقترحلي وجبة']
      };
    }

    if (matchesKeywords(normText, ['بتحبني', 'رايك فيا', 'صاحبي', 'صديقي', 'حبيبي', 'يا صاحبي', 'يا غالي', 'friend', 'love', 'sa7by', 'sa7be', 'habibi'])) {
      return {
        text: `طبعاً يا صاحبي! أنت مش مجرد عميل، أنت ضيف عزيز في "مَكان". 🥰\nلو احتجت أي حاجة أنا موجود، قولي بس نفسك في إيه؟`,
        options: ['🍕 جعان', '☕ عطشان', '🤔 اقترحلي وجبة']
      };
    }

    if (matchesKeywords(normText, ['مين صاحب', 'بتاع مين', 'مين بيمتلك', 'مين مؤسس', 'owner', 'founder', 'who owns', 'sa7eb'])) {
      return {
        text: `مَكان هو فكرة وإبداع لمجموعة شغوفة بالفن والطهي، بيحاولوا يخلقوا "ملاذ" يجمع بين الأكل الفاخر والهدوء النفسي. 🌸`,
        options: ['📋 تصفح القائمة']
      };
    }

    if (matchesKeywords(normText, ['ليه اسم مكان', 'معنى مكان', 'اشمعنى مكان', 'ليه سميتوه', 'معنى الاسم', 'meaning', 'why makan', 'name', 'ma3na'])) {
      return {
        text: `اسم "مَكان" (MAKAN) جي من فكرة إننا نكون "المكان" اللي بترتاح فيه، اللي بتفصل فيه عن دوشة الدنيا وتستمتع بجمال التفاصيل (الوابي-سابي). ✨`,
        options: ['📋 تصفح القائمة', '📍 موقع ملاذنا']
      };
    }

    // Reservation Inquiries
    if (matchesKeywords(normText, ['حجز', 'طاولة', 'طاوله', 'احجز', 'ترابيزة', 'ترابيزه', 'reservation', 'book', 'table', '7agz', 'hagz', 'tarabeza'])) {
      return {
        text: `نرحب بكم في ملاذنا الرقمي والواقعي. 🛋️✨\n\nتتوفر لدينا طاولات في صالاتنا المتخصصة (Breakfast, Beef, Pizza, Pasta, Drinks).\n\nيمكنك استخدام استمارة الحجز في الموقع بالأسفل، أو دعني أسجل بياناتك لإرسالها وتأكيد الحجز فوراً.`,
        type: 'reservation',
        options: ['📅 حجز طاولة', '📋 تصفح القائمة']
      };
    }

    // Work Hours
    if (matchesKeywords(normText, ['مواعيد', 'ساعات', 'ساعة', 'ساعه', 'وقت', 'تفتح', 'تقفل', 'شغالين', 'مفتوح', 'open', 'hours', 'time', 'close', 'mwa3ed', 'sa3at'])) {
      return {
        text: `يسعدنا استقبالك في مَكان كل يوم:\n\n⏰ من الساعة **9:00 صباحاً** حتى **1:00 بعد منتصف الليل**.\n\nمستعدين دائمًا لتقديم تجربة دافئة ومميزة تليق بك. ☕🍕`,
        options: ['📋 تصفح القائمة', '📅 حجز طاولة']
      };
    }

    // Location / Address
    if (matchesKeywords(normText, ['عنوان', 'مكان', 'فروع', 'فرع', 'فين', 'بلد', 'موقع', 'location', 'address', 'العناوين', 'where', 'branch', '3enwan', '3nwan', 'makan', 'fro3'])) {
      return {
        text: `ملاذ مَكان يقع في:\n\n📍 **القاهرة الجديدة، التجمع الخامس**.\n\nيسعدنا جداً تشريفك لتجربة أجواء الوابي-سابي الهادئة والإضاءة الذهبية المذهلة. ✨`,
        type: 'location',
        options: ['📋 تصفح القائمة', '⏰ مواعيد العمل']
      };
    }

    // Greetings & Chat
    if (matchesKeywords(normText, ['سلام عليكم', 'السلام عليكم', 'سلامو عليكم', 'سلام', 'سلاام', 'سالم', 'salam', 'alsalam'])) {
      return {
        text: `وعليكم السلام ورحمة الله وبركاته ${greet}! 🌸 منور مَكان (MAKAN). تحب تتصفح قائمتنا أم تحب نقترحلك وجبة على ذوقنا؟`,
        options: ['📋 تصفح القائمة', '🤔 محتار؟ اقترح وجبة', '📅 حجز طاولة']
      };
    }

    if (matchesKeywords(normText, ['ازيك', 'عامل ايه', 'اخبارك', 'كيفك', 'شلونك', 'how are you', 'ezayak', 'ezayk', '3amel eh', '3aml eh', 'akhbarak'])) {
      return {
        text: 'بأفضل حال والحمد لله يا فندم! 😊 أتمنى أن تكون بأحسن صحة وحال. كيف يمكن لمَكان إسعادك اليوم؟',
        options: ['📋 تصفح القائمة', '🤔 محتار؟ اقترح وجبة']
      };
    }

    if (matchesKeywords(normText, ['صباح الخير', 'صباح النور', 'صباح الورد', 'good morning', 'morning', 'saba7'])) {
      return {
        text: `صباح النور والجمال ${greet}! ☀️ بداية يوم هادئة. ما رأيك ببدء اليوم مع Croissant Salmon اللذيذ مع كوب قهوة V60 دافئة؟`,
        options: ['📋 تصفح القائمة', '🤔 محتار؟ اقترح وجبة']
      };
    }

    if (matchesKeywords(normText, ['مساء الخير', 'مساء النور', 'مساء الورد', 'good evening', 'evening', 'masa2'])) {
      return {
        text: `مساء السرور والروقان ${greet}! 🌙 كيف قضيت يومك؟ ما رأيك بعشاء هادئ من بيتزا مَكان أو باستا الترافل المميزة؟`,
        options: ['📋 تصفح القائمة', '🤔 محتار؟ اقترح وجبة']
      };
    }

    if (matchesKeywords(normText, ['شكرا', 'تسلم', 'حبيبي', 'يعطيك العافية', 'كتر خيرك', 'thanks', 'thank you', 'shokran', 'tslam'])) {
      return {
        text: 'الشكر لك يا غالي! مَكان دائماً في خدمتك. بالهناء والشفاء مقدماً. 🌸',
        options: ['📋 تصفح القائمة', '📅 حجز طاولة']
      };
    }

    if (matchesKeywords(normText, ['انت مين', 'مين انت', 'اسمك ايه', 'بوت', 'chatbot', 'ذكاء اصطناعي', 'ai', 'شات جي بي تي', 'chatgpt', 'روبوت', 'who are you', 'bot', 'robot', 'ent min', 'enta min'])) {
      return {
        text: 'أنا وكيل مَكان (MAKAN) الذكي 🤖. مبرمج خصيصاً لمساعدتك في كل ما يخص مطعمنا من وجبات وحجوزات فقط، ومهمتي الأساسية هي راحتك! ✨',
        options: ['📋 تصفح القائمة', '📅 حجز طاولة']
      };
    }

    // Delivery & Takeaway
    if (matchesKeywords(normText, ['توصيل', 'دليفري', 'دليفرى', 'تيك اوي', 'تيك أوي', 'delivery', 'takeaway', 'twsil'])) {
      return {
        text: 'حالياً نتشرف بتقديم تجربة استثنائية داخل صالاتنا (Dine-in)، ويمكنك طلب أي وجبة لاستلامها بنفسك (Takeaway). الدليفري سيكون متاحاً قريباً! 🛵',
        options: ['📋 تصفح القائمة', '📍 موقع ملاذنا']
      };
    }

    // Prices & Offers
    if (matchesKeywords(normText, ['اسعار', 'أسعار', 'غالي', 'رخيص', 'خصم', 'عروض', 'عرض', 'بكام', 'price', 'prices', 'expensive', 'cheap', 'discount', 'offer', 'how much', 'as3ar', 'as3aar', 'bkam'])) {
      return {
        text: 'في مَكان، نلتزم بتقديم أعلى جودة من المكونات الفاخرة والطازجة. أسعارنا تعكس هذه الجودة لضمان تجربة لا تُنسى. ✨',
        options: ['📋 تصفح القائمة', '🤔 اقترحلي وجبة']
      };
    }

    // Dietary Options
    if (matchesKeywords(normText, ['دايت', 'نباتي', 'صحي', 'رجيم', 'vegan', 'healthy', 'diet', 'سعرات', 'calories', 'dayt', 'nabaty'])) {
      return {
        text: 'صحتك تهمنا! 🥗 نقدم لك خيارات صحية ولذيذة مثل Avocado Toast وسلطات طازجة لتناسب نظامك الغذائي.',
        options: ['📋 تصفح القائمة', '🤔 اقترحلي وجبة']
      };
    }

    // Complaints
    if (matchesKeywords(normText, ['مشكلة', 'شكوى', 'سيء', 'وحش', 'زعلان', 'مش عاجبني', 'problem', 'complaint', 'bad', 'angry', 'moshkela', 'mo4kela', 'shakwa', 'we7esh'])) {
      return {
        text: 'نعتذر جداً لو واجهتك أي مشكلة! 😔 رضاك هو أولويتنا القصوى. يرجى التحدث مع إدارة المطعم وسنقوم بحل الأمر فوراً.',
        options: ['📋 تصفح القائمة', '⏰ مواعيد العمل']
      };
    }

    // Out of Scope Handling (Entertainment, Politics, Sports, General Chat)
    if (matchesKeywords(normText, ['نكتة', 'فزورة', 'اضحك', 'سياسة', 'كورة', 'ماتش', 'الاهلي', 'الزمالك', 'رياضة', 'مدرسة', 'واجب', 'كود', 'برمجة', 'joke', 'sports', 'football', 'politics', 'code', 'programming', 'school', 'homework', 'nokta', 'kora', 'syasa'])) {
      return {
        text: 'أنا وكيل مخصص فقط لمَكان، معرفش غير في الأكل، القهوة، والروقان! 😉 تحب نرجع لموضوعنا وتشوف المنيو؟ 🍕☕',
        options: ['📋 تصفح القائمة', '🤔 محتار؟ اقترح وجبة']
      };
    }

    // Cart summary
    if (matchesKeywords(normText, ['سلة', 'سله', 'سلتك', 'طلب', 'طلبي', 'حسابي', 'السلة', 'السله', 'الحساب', 'cart', 'order', 'basket', 'bill', 'sala', 'salet', 'talab'])) {
      if (cartItems.length === 0) {
        return {
          text: 'سلتك الحالية فارغة يا صديقي. 🛒 تصفح القائمة واختر ما يعجبك لإضافته فوراً!',
          options: ['📋 تصفح القائمة', '🤔 محتار؟ اقترح وجبة']
        };
      }
      return {
        text: 'إليك ملخص الأصناف الحالية في سلتك. يمكنك تأكيد الطلب مباشرة للواتس من هنا: 👇',
        type: 'cart_summary',
        options: ['📋 تصفح القائمة', '⏰ مواعيد العمل']
      };
    }

    // Menu
    if (matchesKeywords(normText, ['منيو', 'منية', 'اكل', 'طعام', 'قائمة', 'قائمه', 'menu', 'المنيو', 'تصفح', 'food', 'list', 'eat'])) {
      return {
        text: 'إليك صالات وقوائم مَكان (MAKAN) المتميزة. اختر القسم لعرض أصنافه: 👇',
        type: 'categories',
        options: []
      };
    }

    // Strict Out of Context Fallback
    return {
      text: `عذراً يا صاحبي، بصفتي وكيل مَكان (MAKAN) الذكي، أنا مبرمج خصيصاً للرد على استفساراتك حول المطعم، القائمة، والحجوزات فقط. ولا يمكنني الخروج عن هذا السياق. 😅\n\nخلينا في المهم، تحب تشوف المنيو ولا ندردش عن الأكل؟ 👇`,
      options: ['📋 تصفح القائمة', '🍕 جعان', '☕ عطشان', '📅 حجز طاولة']
    };
  };

  const handleSendWhatsAppOrder = () => {
    if (cartItems.length === 0) return;

    // Matches Option A compiled payload inside cart.tsx
    const orderPayload = {
      event: 'new_whatsapp_order',
      source: 'makan_web_frontend',
      order_data: {
        items: cartItems.map((item) => ({
          item_name: item.name,
          category: item.category,
          quantity: item.quantity,
          unit_price_le: item.price,
        })),
        order_total_le: totalAmount,
      },
      timestamp: new Date().toISOString(),
    };

    // Human-friendly clean Arabic/English text format
    const detailsString = cartItems
      .map((item) => `• ${item.name} (x${item.quantity}) — ${item.price * item.quantity} L.E`)
      .join('\n');

    const whatsappMessage = `مرحباً مَكان 🍕☕\n\nأود طلب الآتي:\n${detailsString}\n\nإجمالي الحساب: ${totalAmount} L.E`;

    const encodedText = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/201000000000?text=${encodedText}`, '_blank');
  };

  const getItemQtyInCart = (itemName: string): number => {
    const found = cartItems.find((i) => i.name === itemName);
    return found ? found.quantity : 0;
  };

  const handleAddMenuItem = (item: any) => {
    const currentQty = getItemQtyInCart(item.name);
    if (currentQty > 0) {
      updateQuantity(item.id, currentQty + 1);
    } else {
      addToCart({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price
      });
    }
  };

  const handleRemoveMenuItem = (item: any) => {
    const currentQty = getItemQtyInCart(item.name);
    if (currentQty <= 0) return;
    updateQuantity(item.id, currentQty - 1);
  };

  return (
    <>
      {/* Floating Chat Bubble with Wabi-Sabi styling */}
      <div
        className="chatbot-bubble-container"
        style={{
          position: 'fixed',
          left: '24px',
          bottom: cartItems.length > 0 ? '128px' : '80px', // Raised to clear Next.js Turbopack dev indicator!
          zIndex: 290,
          transition: 'all 0.5s var(--ease-cinematic-slow)',
          opacity: showChatBot ? 1 : 0,
          transform: showChatBot ? 'scale(1)' : 'scale(0.8)',
          pointerEvents: showChatBot ? 'auto' : 'none',
          display: 'block'
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'rgba(18, 17, 17, 0.85)',
            border: '1px solid rgba(217, 155, 46, 0.25)',
            color: 'var(--color-ember-gold)',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.borderColor = 'var(--color-ember-gold)';
            e.currentTarget.style.boxShadow = '0 10px 36px rgba(217, 155, 46, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = 'rgba(217, 155, 46, 0.25)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';
          }}
        >
          {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
          {!isOpen && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: 'var(--color-ember-gold)',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                boxShadow: '0 0 12px var(--color-ember-gold)',
                animation: 'pulse 2.2s infinite'
              }}
            />
          )}
        </button>
      </div>

      {/* Chat Window Popup with Wabi-Sabi styling */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            left: '24px',
            bottom: '96px',
            width: '360px',
            height: '530px',
            zIndex: 350,
            backgroundColor: 'rgba(18, 17, 17, 0.96)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '0px', // strict minimal wabi-sabi aesthetics
            boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            fontFamily: 'var(--font-geometric-sans), sans-serif',
            touchAction: 'pan-y',
            overscrollBehavior: 'contain',
            transition: 'all 0.5s var(--ease-cinematic-slow)',
            animation: 'slideUp 0.4s var(--ease-cinematic-slow)'
          }}
        >
          {/* Plaster texture background inside Chat Window */}
          <div className="absolute inset-0 plaster-texture opacity-5 pointer-events-none" />
          <div className="absolute inset-0 engineering-grid opacity-10 pointer-events-none" />

          {/* Header */}
          <div
            style={{
              padding: '16px',
              background: 'rgba(25, 25, 25, 0.5)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              zIndex: 10
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-dark-muted)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', direction: 'rtl' }}>
              <div
                style={{
                  background: 'rgba(217, 155, 46, 0.1)',
                  border: '1px solid rgba(217, 155, 46, 0.3)',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-ember-gold)'
                }}
              >
                <Sparkles size={16} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <h4 style={{ margin: 0, color: 'var(--color-text-dark-primary)', fontSize: '13px', fontWeight: '600', letterSpacing: '0.05em' }}>
                  MAKAN ASSISTANT 🤖
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '9px', color: 'var(--color-text-dark-muted)', fontStyle: 'italic' }}>
                    Contemplative Craft Assistant
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              position: 'relative',
              zIndex: 10,
              overscrollBehavior: 'contain'
            }}
            className="chatbot-window"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-start' : 'flex-end',
                  width: '100%'
                }}
              >
                {/* Bubble text */}
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    fontSize: '12px',
                    lineHeight: '1.6',
                    direction: 'rtl',
                    whiteSpace: 'pre-line',
                    textAlign: 'right',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                    ...(msg.sender === 'user'
                      ? {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--color-text-dark-primary)',
                          border: '1px solid rgba(255,255,255,0.05)'
                        }
                      : {
                          backgroundColor: 'rgba(184, 134, 85, 0.1)',
                          color: 'var(--color-text-dark-primary)',
                          border: '1px solid rgba(217, 155, 46, 0.15)'
                        })
                  }}
                >
                  {msg.text}
                </div>

                {/* Rendering recommendation card */}
                {msg.type === 'recommendation' && msg.recommendation && (
                  <div
                    style={{
                      width: '85%',
                      backgroundColor: 'rgba(25, 25, 25, 0.8)',
                      border: '1px solid rgba(217, 155, 46, 0.25)',
                      padding: '12px',
                      marginTop: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      alignSelf: 'flex-end',
                      direction: 'rtl',
                      animation: 'fadeIn 0.3s ease-out'
                    }}
                  >
                    <span style={{ fontSize: '8px', background: 'rgba(217, 155, 46, 0.15)', color: 'var(--color-ember-gold)', border: '1px solid rgba(217, 155, 46, 0.3)', padding: '2px 6px', width: 'max-content', fontWeight: 'bold', fontFamily: 'monospace' }}>
                      [ RECOMMENDED // SELECTION ]
                    </span>
                    <h5 style={{ margin: 0, color: 'var(--color-text-dark-primary)', fontSize: '13px', fontWeight: '600' }}>
                      {msg.recommendation.name}
                    </h5>
                    <p style={{ margin: 0, color: 'var(--color-text-dark-muted)', fontSize: '10.5px', lineHeight: '1.4' }}>
                      {msg.recommendation.desc}
                    </p>
                    <span style={{ fontSize: '12px', color: 'var(--color-ember-gold)', fontWeight: 'bold' }}>
                      {msg.recommendation.price} L.E
                    </span>
                    {getItemQtyInCart(msg.recommendation.name) > 0 ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: 'rgba(217, 155, 46, 0.15)',
                          border: '1px solid rgba(217, 155, 46, 0.3)',
                          padding: '3px 6px',
                          marginTop: '6px'
                        }}
                      >
                        <button
                          onClick={() => handleRemoveMenuItem(msg.recommendation)}
                          style={{ border: 'none', background: 'transparent', color: 'var(--color-text-dark-primary)', fontSize: '16px', cursor: 'pointer' }}
                        >
                          −
                        </button>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-dark-primary)', fontWeight: 'bold' }}>
                          {getItemQtyInCart(msg.recommendation.name)}
                        </span>
                        <button
                          onClick={() => handleAddMenuItem(msg.recommendation)}
                          style={{ border: 'none', background: 'transparent', color: 'var(--color-text-dark-primary)', fontSize: '16px', cursor: 'pointer' }}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddMenuItem(msg.recommendation)}
                        style={{
                          backgroundColor: 'var(--color-ember-gold)',
                          color: 'var(--makan-black)',
                          border: 'none',
                          padding: '6px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          textAlign: 'center',
                          marginTop: '4px'
                        }}
                      >
                        + إضافة للطلب
                      </button>
                    )}
                  </div>
                )}

                {/* Rendering custom items list inside chatbot */}
                {msg.type === 'items' && msg.items && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      overflowX: 'auto',
                      width: '100%',
                      padding: '8px 2px',
                      marginTop: '8px',
                      direction: 'rtl'
                    }}
                    className="chatbot-items-scroll"
                  >
                    {msg.items.map((item, idx) => {
                      const qty = getItemQtyInCart(item.name);
                      return (
                        <div
                          key={idx}
                          style={{
                            flex: '0 0 160px',
                            backgroundColor: 'rgba(25, 25, 25, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            padding: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '6px'
                          }}
                        >
                          <span style={{ fontSize: '11.5px', fontWeight: '600', color: 'var(--color-text-dark-primary)', textAlign: 'right' }}>
                            {item.name}
                          </span>
                          <span style={{ fontSize: '10.5px', color: 'var(--color-ember-gold)', textAlign: 'right', fontWeight: 'bold' }}>
                            {item.price} L.E
                          </span>
                          {qty > 0 ? (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: 'rgba(217, 155, 46, 0.1)',
                                border: '1px solid rgba(217, 155, 46, 0.25)',
                                padding: '3px 6px',
                                marginTop: '4px'
                              }}
                            >
                              <button
                                onClick={() => handleRemoveMenuItem(item)}
                                style={{
                                  border: 'none',
                                  background: 'transparent',
                                  color: 'var(--color-text-dark-primary)',
                                  fontSize: '14px',
                                  cursor: 'pointer'
                                }}
                              >
                                −
                              </button>
                              <span style={{ fontSize: '11px', color: 'var(--color-text-dark-primary)', fontWeight: 'bold' }}>
                                {qty}
                              </span>
                              <button
                                onClick={() => handleAddMenuItem(item)}
                                style={{
                                  border: 'none',
                                  background: 'transparent',
                                  color: 'var(--color-text-dark-primary)',
                                  fontSize: '14px',
                                  cursor: 'pointer'
                                }}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddMenuItem(item)}
                              style={{
                                backgroundColor: 'var(--color-ember-gold)',
                                color: 'var(--makan-black)',
                                border: 'none',
                                padding: '4px 8px',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                textAlign: 'center',
                                marginTop: '4px'
                              }}
                            >
                              + إضافة للطلب
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Rendering Category options */}
                {msg.type === 'categories' && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      justifyContent: 'flex-end',
                      width: '100%',
                      marginTop: '8px',
                      direction: 'rtl'
                    }}
                  >
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleSend(`وريني قسم ${cat.name}`)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          color: 'var(--color-text-dark-primary)',
                          fontSize: '11px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-ember-gold)';
                          e.currentTarget.style.color = 'var(--color-ember-gold)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.color = 'var(--color-text-dark-primary)';
                        }}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Rendering Cart summary inside Chat */}
                {msg.type === 'cart_summary' && (
                  <div
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(25, 25, 25, 0.9)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      padding: '12px',
                      marginTop: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      direction: 'rtl'
                    }}
                  >
                    <h5 style={{ margin: 0, color: 'var(--color-ember-gold)', fontSize: '11.5px', fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'right' }}>
                      [ CART // CURRENT ITEMS ]
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {cartItems.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '11px',
                            color: 'var(--color-text-dark-primary)',
                            borderBottom: '1px dashed rgba(255,255,255,0.05)',
                            paddingBottom: '4px'
                          }}
                        >
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span style={{ color: 'var(--color-ember-gold)' }}>{item.price * item.quantity} L.E</span>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: 'var(--color-text-dark-primary)',
                        marginTop: '4px'
                      }}
                    >
                      <span>الإجمالي:</span>
                      <span style={{ color: 'var(--color-ember-gold)' }}>{totalAmount} L.E</span>
                    </div>
                    <button
                      onClick={handleSendWhatsAppOrder}
                      style={{
                        backgroundColor: 'var(--color-ember-gold)',
                        color: 'var(--makan-black)',
                        border: 'none',
                        padding: '10px 14px',
                        fontSize: '11.5px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 16px rgba(217, 155, 46, 0.15)',
                        marginTop: '6px'
                      }}
                    >
                      📲 إرسال الطلب للواتساب
                    </button>
                  </div>
                )}

                {/* Rendering options below the bubble */}
                {msg.options && msg.options.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      justifyContent: 'flex-end',
                      width: '100%',
                      marginTop: '8px',
                      direction: 'rtl'
                    }}
                  >
                    {msg.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSend(opt)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          color: 'var(--color-text-dark-primary)',
                          fontSize: '11px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-ember-gold)';
                          e.currentTarget.style.color = 'var(--color-ember-gold)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.color = 'var(--color-text-dark-primary)';
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Helper Tabs before Input */}
          <div
            style={{
              padding: '8px 12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              backgroundColor: 'rgba(15, 15, 15, 0.5)',
              direction: 'rtl',
              position: 'relative',
              zIndex: 10
            }}
            className="chatbot-items-scroll"
          >
            <button
              onClick={() => handleSend('📋 تصفح القائمة')}
              style={{
                flex: '0 0 auto',
                padding: '4px 10px',
                fontSize: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255,255,255,0.02)',
                color: 'var(--color-text-dark-primary)',
                cursor: 'pointer'
              }}
            >
              📋 القائمة
            </button>
            <button
              onClick={() => handleSend('🤔 محتار؟ اقترح وجبة')}
              style={{
                flex: '0 0 auto',
                padding: '4px 10px',
                fontSize: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255,255,255,0.02)',
                color: 'var(--color-text-dark-primary)',
                cursor: 'pointer'
              }}
            >
              🤔 الترشيحات
            </button>
            <button
              onClick={() => handleSend('📅 حجز طاولة')}
              style={{
                flex: '0 0 auto',
                padding: '4px 10px',
                fontSize: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255,255,255,0.02)',
                color: 'var(--color-text-dark-primary)',
                cursor: 'pointer'
              }}
            >
              📅 حجز
            </button>
            <button
              onClick={() => handleSend('📍 موقع ملاذنا')}
              style={{
                flex: '0 0 auto',
                padding: '4px 10px',
                fontSize: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255,255,255,0.02)',
                color: 'var(--color-text-dark-primary)',
                cursor: 'pointer'
              }}
            >
              📍 الموقع
            </button>
            {cartItems.length > 0 && (
              <button
                onClick={() => handleSend('🛒 سلتك الحالية')}
                style={{
                  flex: '0 0 auto',
                  padding: '4px 10px',
                  fontSize: '10px',
                  border: '1px solid var(--color-ember-gold)',
                  background: 'rgba(217, 155, 46, 0.05)',
                  color: 'var(--color-ember-gold)',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🛒 السلة ({totalAmount} L.E)
              </button>
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              backgroundColor: 'rgba(18, 17, 17, 0.98)',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              position: 'relative',
              zIndex: 10
            }}
          >
            <button
              type="submit"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-ember-gold)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-ember-gold)';
                e.currentTarget.style.background = 'rgba(217, 155, 46, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              }}
            >
              <Send size={16} style={{ transform: 'rotate(180deg)' }} />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="اسألني عن الصالات، الأصناف، أو الحجوزات..."
              style={{
                flex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '8px 12px',
                fontSize: '16px',
                color: 'var(--color-text-dark-primary)',
                outline: 'none',
                textAlign: 'right',
                direction: 'rtl'
              }}
            />
          </form>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(217, 155, 46, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 8px rgba(217, 155, 46, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(217, 155, 46, 0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .chatbot-items-scroll::-webkit-scrollbar {
          height: 4px;
        }
        .chatbot-items-scroll::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.01);
        }
        .chatbot-items-scroll::-webkit-scrollbar-thumb {
          background: rgba(217, 155, 46, 0.15);
        }
      `}</style>
    </>
  );
}
