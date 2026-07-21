const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Article = require('../models/Article');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/satyadarpan';

const MOCK_ARTICLES = [
  {
    slug: 'electoral-bonds-scam-truth',
    title: 'Electoral Bonds Scam: ₹1.85 Lakh Crore Ka Sach',
    excerpt: 'Supreme Court ke faisle ke baad Electoral Bonds scheme ke khatme se jo data saamne aaya hai, wo ek khatraanak sach chhupa raha tha.',
    status: 'published',
    publishedAt: new Date('2024-03-15'),
    readingTime: 8,
    views: 14520,
    categoryName: 'Bhrashtachar',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '📌 Supreme Court ka Aishtihasik Faisla' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'February 2024 mein Supreme Court of India ne Electoral Bonds scheme ko unconstitutional karaar diya. Court ne kaha ki yeh scheme voters ke "right to know" ka ullanghan karti hai aur democratic process ko nuksaan pahunchati hai.' }] },
        { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: '"Electoral Bonds scheme violates Article 19(1)(a) of the Constitution. Citizens have the right to know who is funding political parties." — Chief Justice D.Y. Chandrachud' }] }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '💰 Kitna Paisa Kahan Gaya?' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'SBI dwara Supreme Court ko diye gaye data ke mutabik, 2018 se 2024 ke beech ₹16,518 crore ke bonds purchase hue. Inme se sirf BJP ko ₹6,566 crore (47.5%) mile — baki sab parties milake baaki amount.' }] },
        { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Party-wise Breakdown (Top Receivers):' }] },
        { type: 'paragraph', content: [{ type: 'text', text: '1. BJP: ₹6,566 Crore\n2. TMC: ₹1,609 Crore\n3. Congress: ₹1,421 Crore\n4. BRS: ₹1,214 Crore' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '🔍 ED Raids aur Electoral Bonds ka Connection' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Investigation mein ek chaunka dene wala pattern saamne aaya. Kai companies ne ED ya Income Tax raids ke BAAD Electoral Bonds purchase kiye. Is pattern ko "extortion through institutions" kaha ja raha hai.' }] },
        { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Himachal Pradesh ke Nahan mein Future Gaming ne ₹1,368 crore ke bonds diye — wahi company jis par Income Tax aur ED ka shikar chal raha tha.' }] }] },
      ],
    },
    references: [
      { title: 'Supreme Court Judgment on Electoral Bonds', url: 'https://main.sci.gov.in', type: 'court' },
      { title: 'SBI Electoral Bond Data Disclosure', url: 'https://eci.gov.in', type: 'government' },
      { title: 'ADR Report on Electoral Bonds', url: 'https://adrindia.org', type: 'research' },
    ],
  },
  {
    slug: 'adani-hindenburg-full-truth',
    title: 'Adani Group aur Hindenburg Report: Poora Sach Jo Media Ne Chhupaaya',
    excerpt: 'January 2023 mein Hindenburg Research ne Adani Group par ek badi report publish ki. LIC aur SBI ka paisa khatrey mein tha.',
    status: 'published',
    publishedAt: new Date('2024-02-10'),
    readingTime: 10,
    views: 9870,
    categoryName: 'Expose',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '🚨 Hindenburg Report: 88 Sawal Jinka Jawab Nahi Mila' }] },
        { type: 'paragraph', content: [{ type: 'text', text: '24 January 2023 ko US-based short-seller Hindenburg Research ne ek 106-page ki report publish ki jisme Adani Group par stock manipulation, accounting fraud, aur shell companies ke gambheer aarop lagaye gaye.' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Report ke baad Adani Group ki market cap mein sirf 10 dino mein ₹12 lakh crore ki girawat aayi. LIC jisme aam Indians ka paisa hai, usne ₹56,000 crore se zyada ka nuksaan jhela.' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '🏦 LIC aur SBI Ka Common Log Ka Paisa Kahan Gaya?' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'LIC, jo aam Indians ke life insurance ka paisa manage karta hai, usne Adani Group mein ₹74,000 crore se zyada invest kiya tha. Stocks crash hone par LIC ke policyholders ka paisa seedha affect hua.' }] },
        { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: '"Government-owned institutions were used to prop up a private conglomerate with close ties to the ruling party. This is a textbook case of crony capitalism." — JPC Demand by Opposition' }] }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '⚖️ SEBI Ki Jaanch: Nakaam ya Janbujh Anjaani?' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Supreme Court ne SEBI ko Adani Group ke khilaf jaanch karne ka aadesh diya. SEBI ki report mein kaha gaya ki unhe koi conclusive evidence nahi mila. Lekin opposition aur experts ka kehna hai ki SEBI ne sirf surface-level jaanch ki.' }] },
      ],
    },
    references: [
      { title: 'Hindenburg Research Report on Adani', url: 'https://hindenburgresearch.com', type: 'research' },
      { title: 'Supreme Court Order on Adani Investigation', url: 'https://main.sci.gov.in', type: 'court' },
    ],
  },
  {
    slug: 'fact-check-india-5th-economy-reality',
    title: 'Fact Check: "India 5th Largest Economy" — Kya Yeh Aam Admi Ki Jeb Mein Bhi Dikhta Hai?',
    excerpt: 'Government baar baar kehti hai India 5th largest economy ban gaya. Lekin GDP growth se common man ka kya fayda?',
    status: 'published',
    publishedAt: new Date('2024-04-01'),
    readingTime: 6,
    views: 7340,
    categoryName: 'Fact Check',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '✅ Claim: India 5th Largest Economy Ban Gaya' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Sach: Haan, lekin adhura sach. 2023 mein India ne UK ko peeche chhodkar world ki 5th largest economy banni ki position haasil ki (nominal GDP ke hisab se). Yeh ek hakeekat hai. Lekin GDP ranking ka matlab per capita income se bilkul alag hai.' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '📊 Asli Aankde Jo Sarkar Nahi Bolti' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Per Capita GDP (2023):\n🇮🇳 India: $2,601 (rank 139 in world)\n🇺🇸 USA: $80,035\n🇬🇧 UK: $46,371\n🇨🇳 China: $12,720\n\nMatalab: India 5th badi economy hai, lekin 139th ameer country hai.' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '💼 Unemployment ka Sach' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'CMIE ke data ke mutabik:\n• Urban Youth Unemployment (15-29 years): 16.5%\n• Graduate Unemployment: 42.3% (ILO Report 2024)\n• Real wage growth (2014-2024): Near zero after inflation adjustment' }] },
        { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: '"India\'s GDP growth benefits are captured by the top 10% of the population. The bottom 50% has seen negligible real income growth in the past decade." — Oxfam India Report 2024' }] }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '⚖️ Verdict' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'PARTLY TRUE — MOSTLY MISLEADING. India ka 5th largest economy banna ek fakhr ki baat hai, lekin jab tak yeh growth aam aadmi ki jeb mein nahi pahuchti, yeh sirf ek marketing claim hai.' }] },
      ],
    },
    references: [
      { title: 'World Bank GDP Rankings 2023', url: 'https://data.worldbank.org', type: 'research' },
      { title: 'CMIE Unemployment Data', url: 'https://cmie.com', type: 'research' },
      { title: 'Oxfam India Inequality Report 2024', url: 'https://oxfamindia.org', type: 'research' },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Find or create admin
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.create({
        name: 'SatyaDarpan Admin',
        email: process.env.ADMIN_EMAIL || 'satyadarpan12111673@gmail.com',
        password: process.env.ADMIN_PASSWORD || 'Satyadarpan@12111673',
        role: 'admin',
        isVerified: true,
      });
      console.log('Created admin user:', admin.email);
    }

    for (const mockArt of MOCK_ARTICLES) {
      // Find or create category
      let category = await Category.findOne({ name: mockArt.categoryName });
      if (!category) {
        category = await Category.create({
          name: mockArt.categoryName,
          slug: mockArt.categoryName.toLowerCase().replace(' ', '-'),
          description: `${mockArt.categoryName} detailed reports`,
        });
        console.log('Created category:', category.name);
      }

      // Check if article exists
      let article = await Article.findOne({ slug: mockArt.slug });
      if (!article) {
        article = await Article.create({
          ...mockArt,
          author: admin._id,
          category: category._id,
        });
        console.log('Seeded article:', article.title);
      } else {
        console.log('Article already exists:', article.title);
      }
    }

    console.log('Database seeding successfully finished!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
