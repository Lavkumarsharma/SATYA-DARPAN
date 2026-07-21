require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./src/models/User');
const Category = require('./src/models/Category');
const Tag = require('./src/models/Tag');
const Article = require('./src/models/Article');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const seed = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected!');

    // Clean existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Tag.deleteMany({}),
      Article.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create Admin User
    const admin = await User.create({
      name: 'SatyaDarpan Admin',
      email: 'satyadarpan12111673@gmail.com',
      password: 'Satyadarpan@12111673',
      role: 'admin',
      bio: 'Chief Investigative Editor at SatyaDarpan.',
      isActive: true,
    });
    console.log('👤 Admin user created:', admin.email);

    // Create Categories
    const [corruptionCat, factCheckCat, exposeCat] = await Category.insertMany([
      { name: 'Bhrashtachar', slug: 'bhrashtachar', description: 'Exposing corruption in government and political parties' },
      { name: 'Fact Check', slug: 'fact-check', description: 'Verifying claims made by politicians and parties' },
      { name: 'Expose', slug: 'expose', description: 'In-depth investigative reports' },
    ]);
    console.log('📂 Categories created');

    // Create Tags
    const tags = await Tag.insertMany([
      { name: 'BJP', slug: 'bjp' },
      { name: 'Congress', slug: 'congress' },
      { name: 'AAP', slug: 'aap' },
      { name: 'Electoral Bonds', slug: 'electoral-bonds' },
      { name: 'PM Modi', slug: 'pm-modi' },
      { name: 'Black Money', slug: 'black-money' },
    ]);
    console.log('🏷️  Tags created');

    const bjpTag = tags[0];
    const bondsTag = tags[3];
    const modiTag = tags[4];
    const blackMoneyTag = tags[5];
    const congTag = tags[1];
    const factTag = tags[2];

    // ===========================
    // ARTICLE 1 - Electoral Bonds
    // ===========================
    await Article.create({
      title: 'Electoral Bonds Scam: ₹1.85 Lakh Crore Ka Sach',
      slug: 'electoral-bonds-scam-truth',
      excerpt: 'Supreme Court ke faisle ke baad Electoral Bonds scheme ke khatme se jo data saamne aaya hai, wo ek khatraanak sach chhupa raha tha. Kaun sa party ne kitna liya? Kaun si company ne diya? Aur kya link hai ED raids se?',
      author: admin._id,
      category: corruptionCat._id,
      tags: [bjpTag._id, bondsTag._id, blackMoneyTag._id],
      status: 'published',
      featured: true,
      trending: true,
      views: 14520,
      publishedAt: new Date('2024-03-15'),
      seo: {
        metaTitle: 'Electoral Bonds Scam - ₹1.85 Lakh Crore Ka Sach | SatyaDarpan',
        metaDescription: 'Supreme Court ke baad Electoral Bonds ka poora data. Kaun si company ne kaunsi party ko diya?',
        keywords: ['electoral bonds', 'corruption', 'BJP', 'scam', 'supreme court'],
      },
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '📌 Supreme Court ka Aishtihasik Faisla' }],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'February 2024 mein ' },
              { type: 'text', marks: [{ type: 'bold' }], text: 'Supreme Court of India' },
              { type: 'text', text: ' ne Electoral Bonds scheme ko ' },
              { type: 'text', marks: [{ type: 'highlight', attrs: { color: '#f59e0b' } }], text: 'unconstitutional' },
              { type: 'text', text: ' karaar diya. Court ne kaha ki yeh scheme voters ke "right to know" ka ullanghan karti hai aur democratic process ko nuksaan pahunchati hai.' },
            ],
          },
          {
            type: 'blockquote',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: '"Electoral Bonds scheme violates Article 19(1)(a) of the Constitution. Citizens have the right to know who is funding political parties." — Chief Justice D.Y. Chandrachud' }],
              },
            ],
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '💰 Kitna Paisa Kahan Gaya?' }],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'SBI dwara Supreme Court ko diye gaye data ke mutabik, 2018 se 2024 ke beech ' },
              { type: 'text', marks: [{ type: 'bold' }], text: '₹16,518 crore' },
              { type: 'text', text: ' ke bonds purchase hue. Inme se sirf BJP ko ' },
              { type: 'text', marks: [{ type: 'highlight', attrs: { color: '#ef4444' } }], text: '₹6,566 crore (47.5%)' },
              { type: 'text', text: ' mile — baki sab parties milake baaki amount.' },
            ],
          },
          {
            type: 'heading',
            attrs: { level: 3 },
            content: [{ type: 'text', text: 'Party-wise Breakdown (Top Receivers):' }],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', marks: [{ type: 'bold' }], text: '1. BJP: ₹6,566 Crore\n' },
              { type: 'text', marks: [{ type: 'bold' }], text: '2. TMC: ₹1,609 Crore\n' },
              { type: 'text', marks: [{ type: 'bold' }], text: '3. Congress: ₹1,421 Crore\n' },
              { type: 'text', marks: [{ type: 'bold' }], text: '4. BRS: ₹1,214 Crore\n' },
            ],
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '🔍 ED Raids aur Electoral Bonds ka Connection' }],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Investigation mein ek chaunka dene wala pattern saamne aaya. Kai companies ne ' },
              { type: 'text', marks: [{ type: 'highlight', attrs: { color: '#ef4444' } }], text: 'ED ya Income Tax raids ke BAAD' },
              { type: 'text', text: ' Electoral Bonds purchase kiye. Is pattern ko "extortion through institutions" kaha ja raha hai. Companies ne darkar ya deal karke bonds khareede taki government agencies unke khilaf action na le.' },
            ],
          },
          {
            type: 'blockquote',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Himachal Pradesh ke Nahan mein Future Gaming ne ₹1,368 crore ke bonds diye — wahi company jis par Income Tax aur ED ka shikar chal raha tha.' }],
              },
            ],
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '📋 References & Sources' }],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: '• Supreme Court Judgment (Feb 15, 2024)\n• Election Commission of India data\n• SBI disclosure to Supreme Court\n• The Hindu Electoral Bonds Database\n• ADR (Association for Democratic Reforms) report' },
            ],
          },
        ],
      },
      references: [
        { title: 'Supreme Court Judgment on Electoral Bonds', url: 'https://main.sci.gov.in', type: 'court' },
        { title: 'SBI Electoral Bond Data Disclosure', url: 'https://eci.gov.in', type: 'government' },
        { title: 'ADR Report on Electoral Bonds', url: 'https://adrindia.org', type: 'research' },
      ],
    });

    // ===========================
    // ARTICLE 2 - Adani Scam
    // ===========================
    await Article.create({
      title: 'Adani Group aur Hindenburg Report: Poora Sach Jo Media Ne Chhupaaya',
      slug: 'adani-hindenburg-full-truth',
      excerpt: 'January 2023 mein Hindenburg Research ne Adani Group par ek badi report publish ki. LIC aur SBI ka paisa khatrey mein tha. Lekin kya sach mein kuch galat hua? Aur agar hua to kaun zimmedaar hai?',
      author: admin._id,
      category: exposeCat._id,
      tags: [modiTag._id, blackMoneyTag._id, bjpTag._id],
      status: 'published',
      featured: true,
      trending: false,
      views: 9870,
      publishedAt: new Date('2024-02-10'),
      seo: {
        metaTitle: 'Adani Hindenburg Report - Poora Sach | SatyaDarpan',
        metaDescription: 'Adani-Hindenburg controversy ka poora analysis. LIC, SBI ka paisa kahan gaya?',
        keywords: ['adani', 'hindenburg', 'LIC', 'stock fraud', 'BJP'],
      },
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '🚨 Hindenburg Report: 88 Sawal Jinka Jawab Nahi Mila' }],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: '24 January 2023 ko US-based short-seller ' },
              { type: 'text', marks: [{ type: 'bold' }], text: 'Hindenburg Research' },
              { type: 'text', text: ' ne ek 106-page ki report publish ki jisme Adani Group par ' },
              { type: 'text', marks: [{ type: 'highlight', attrs: { color: '#ef4444' } }], text: 'stock manipulation, accounting fraud, aur shell companies' },
              { type: 'text', text: ' ke gambheer aarop lagaye gaye.' },
            ],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Report ke baad Adani Group ki market cap mein sirf 10 dino mein ' },
              { type: 'text', marks: [{ type: 'bold' }, { type: 'highlight', attrs: { color: '#ef4444' } }], text: '₹12 lakh crore' },
              { type: 'text', text: ' ki girawat aayi. LIC jisme aam Indians ka paisa hai, usne ' },
              { type: 'text', marks: [{ type: 'bold' } ], text: '₹56,000 crore' },
              { type: 'text', text: ' se zyada ka nuksaan jhela.' },
            ],
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '🏦 LIC aur SBI Ka Common Log Ka Paisa Kahan Gaya?' }],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'LIC, jo aam Indians ke life insurance ka paisa manage karta hai, usne Adani Group mein ' },
              { type: 'text', marks: [{ type: 'bold' }], text: '₹74,000 crore se zyada invest kiya tha.' },
              { type: 'text', text: ' Stocks crash hone par LIC ke policyholders ka paisa seedha affect hua. Yahi nahi, State Bank of India ne bhi Adani ke projects ko hazaron crore ke loans diye the.' },
            ],
          },
          {
            type: 'blockquote',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: '"Government-owned institutions were used to prop up a private conglomerate with close ties to the ruling party. This is a textbook case of crony capitalism." — JPC Demand by Opposition' }],
              },
            ],
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '🔗 Modi-Adani Rishta: Timeline' }],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', marks: [{ type: 'bold' }], text: '2002:' },
              { type: 'text', text: ' Modi Gujarat CM bane, Adani Group ne Gujarat mein bade contracts liye.\n' },
              { type: 'text', marks: [{ type: 'bold' }], text: '2014:' },
              { type: 'text', text: ' Modi PM bane, Adani Group ka expansion nationwide hua — airports, ports, defense, media.\n' },
              { type: 'text', marks: [{ type: 'bold' }], text: '2023:' },
              { type: 'text', text: ' Hindenburg report ke bawajood, koi bhi formal government investigation nahi hui.' },
            ],
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '⚖️ SEBI Ki Jaanch: Nakaam ya Janbujh Anjaani?' }],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Supreme Court ne SEBI ko Adani Group ke khilaf jaanch karne ka aadesh diya. SEBI ki report mein kaha gaya ki unhe koi conclusive evidence nahi mila. Lekin opposition aur experts ka kehna hai ki SEBI ne ' },
              { type: 'text', marks: [{ type: 'highlight', attrs: { color: '#f59e0b' } }], text: 'sirf surface-level jaanch ki' },
              { type: 'text', text: ' aur offshore shell companies ke asli owners tak pahunchne ki koshish nahi ki.' },
            ],
          },
        ],
      },
      references: [
        { title: 'Hindenburg Research Report on Adani', url: 'https://hindenburgresearch.com', type: 'research' },
        { title: 'Supreme Court Order on Adani Investigation', url: 'https://main.sci.gov.in', type: 'court' },
        { title: 'LIC Investment Details - Parliamentary Standing Committee', url: 'https://sansad.in', type: 'government' },
      ],
    });

    // ===========================
    // ARTICLE 3 - Fact Check
    // ===========================
    await Article.create({
      title: 'Fact Check: "India 5th Largest Economy" — Kya Yeh Aam Admi Ki Jeb Mein Bhi Dikhta Hai?',
      slug: 'fact-check-india-5th-economy-reality',
      excerpt: 'Government baar baar kehti hai India 5th largest economy ban gaya. Lekin GDP growth se common man ka kya fayda? Unemployment, inflation, aur inequality ka data kuch alag hi kahani sunta hai.',
      author: admin._id,
      category: factCheckCat._id,
      tags: [modiTag._id, congTag._id],
      status: 'published',
      featured: false,
      trending: true,
      factCheck: true,
      views: 7340,
      publishedAt: new Date('2024-04-01'),
      seo: {
        metaTitle: 'Fact Check: India 5th Economy - Aam Aadmi Ka Kya? | SatyaDarpan',
        metaDescription: 'India 5th largest economy hai — lekin GDP se aam aadmi ko kya fayda? Real data check.',
        keywords: ['india economy', 'GDP', 'unemployment', 'inflation', 'fact check'],
      },
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '✅ Claim: India 5th Largest Economy Ban Gaya' }],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', marks: [{ type: 'bold' }], text: 'Sach: Haan, lekin adhura sach.' },
              { type: 'text', text: ' 2023 mein India ne UK ko peeche chhodkar world ki 5th largest economy banni ki position haasil ki (nominal GDP ke hisab se). Yeh ek hakeekat hai. Lekin GDP ranking ka matlab ' },
              { type: 'text', marks: [{ type: 'highlight', attrs: { color: '#f59e0b' } }], text: 'per capita income se bilkul alag hai.' },
            ],
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '📊 Asli Aankde Jo Sarkar Nahi Bolti' }],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', marks: [{ type: 'bold' }], text: 'Per Capita GDP (2023):' },
              { type: 'text', text: '\n🇮🇳 India: $2,601 (rank 139 in world)\n🇺🇸 USA: $80,035\n🇬🇧 UK: $46,371\n🇨🇳 China: $12,720\n\n' },
              { type: 'text', marks: [{ type: 'highlight', attrs: { color: '#ef4444' } }], text: 'Matlab: India 5th badi economy hai, lekin 139th ameer country hai.' },
            ],
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '💼 Unemployment ka Sach' }],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'CMIE (Centre for Monitoring Indian Economy) ke data ke mutabik:' },
            ],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', marks: [{ type: 'bold' }], text: '• Urban Youth Unemployment (15-29 years): 16.5%\n' },
              { type: 'text', marks: [{ type: 'bold' }], text: '• Graduate Unemployment: 42.3% (ILO Report 2024)\n' },
              { type: 'text', marks: [{ type: 'bold' }], text: '• Real wage growth (2014-2024): Near zero after inflation adjustment\n' },
            ],
          },
          {
            type: 'blockquote',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: '"India\'s GDP growth benefits are captured by the top 10% of the population. The bottom 50% has seen negligible real income growth in the past decade." — Oxfam India Report 2024' }],
              },
            ],
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '🧾 Mehengai ka Data' }],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Retail inflation (CPI) lagaataar RBI ke 4% target se upar rahi hai. Khaas taur par ' },
              { type: 'text', marks: [{ type: 'highlight', attrs: { color: '#ef4444' } }], text: 'food inflation 8-10% tak pahunchi' },
              { type: 'text', text: ' — tomatoe ₹200/kg, pyaaz ₹80/kg, aur daal ₹150+/kg. Yahi common man ki asli economy hai.' },
            ],
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '⚖️ Verdict' }],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', marks: [{ type: 'bold' }], text: 'PARTLY TRUE — MOSTLY MISLEADING.' },
              { type: 'text', text: ' India ka 5th largest economy banna ek fakhr ki baat hai, lekin jab tak yeh growth aam aadmi ki jeb mein nahi pahuchti, yeh sirf ek marketing claim hai.' },
            ],
          },
        ],
      },
      references: [
        { title: 'World Bank GDP Rankings 2023', url: 'https://data.worldbank.org', type: 'research' },
        { title: 'CMIE Unemployment Data', url: 'https://cmie.com', type: 'research' },
        { title: 'Oxfam India Inequality Report 2024', url: 'https://oxfamindia.org', type: 'research' },
        { title: 'ILO India Employment Report 2024', url: 'https://ilo.org', type: 'research' },
      ],
    });

    console.log('📰 3 Articles seeded successfully!');
    console.log('\n✅ ======= SEED COMPLETE =======');
    console.log('Login: satyadarpan12111673@gmail.com / Satyadarpan@12111673');
    console.log('Articles: 3 published');
    console.log('Categories: 3');
    console.log('Tags: 6');
    console.log('================================\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed Error:', err.message);
    process.exit(1);
  }
};

seed();
