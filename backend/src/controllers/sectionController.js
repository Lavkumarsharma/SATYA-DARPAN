const Section = require('../models/Section');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

// GET /api/sections
exports.getSections = asyncHandler(async (req, res) => {
  const sections = await Section.find({}).lean();
  res.status(200).json({ success: true, data: sections });
});

// GET /api/sections/:key
exports.getSectionByKey = asyncHandler(async (req, res, next) => {
  let section = await Section.findOne({ key: req.params.key }).lean();
  
  if (!section) {
    return next(new AppError(`Section ${req.params.key} not found`, 404));
  }
  
  res.status(200).json({ success: true, data: section });
});

// PUT /api/sections/:key
exports.updateSection = asyncHandler(async (req, res, next) => {
  const section = await Section.findOneAndUpdate(
    { key: req.params.key },
    { data: req.body.data, title: req.body.title },
    { new: true, runValidators: true, upsert: true }
  );

  res.status(200).json({ success: true, data: section });
});

// Seed default sections
exports.seedDefaultSections = async () => {
  const defaults = [
    {
      key: 'homepage_hero',
      title: 'Homepage Hero Block',
      data: {
        badge: 'Independent Public Interest Journalism',
        title: 'सत्यदर्पण: सत्ता, सांठगांठ और सार्वजनिक हित के छिपे दस्तावेज़।',
        description: 'हम देश के सामने वह सच्चाई रख रहे हैं जिसे मुख्यधारा के चैनल हमेशा छुपाते हैं। प्रमाणों के साथ बड़े खुलासे:',
        highlights: [
          'इलेक्टोरल बॉन्ड्स का सच: कैसे कंपनियों पर जांच एजेंसियों (ED-CBI) का दबाव बनाकर करोड़ों का चंदा वसूला गया।',
          'टीवी मीडिया की फंडिंग का सच: बड़े न्यूज़ चैनलों के मालिक वही कॉर्पोरेट घराने हैं जिन्हें सरकार से सीधे बड़े ठेके और फायदे मिलते हैं।'
        ]
      }
    },
    {
      key: 'homepage_comparisons',
      title: 'Narrative vs Reality Comparisons',
      data: [
        {
          topic: "Electoral Bonds Allocation",
          officialNarrative: "चुनावी चंदे में पारदर्शिता लाने और काले धन को समाप्त करने के उद्देश्य से शुरू किया गया एक सुधारक कदम।",
          investigativeFinding: "दस्तावेज़ों और ऑडिट ट्रेल से स्पष्ट है कि यह वित्तीय लाभ और अनुबंधों के बदले राजनीतिक दलों को चंदा देने का माध्यम बना। कई मुखौटा (shell) कंपनियों और केंद्रीय एजेंसियों की जांच के दायरे में आई कॉर्पोरेट कंपनियों ने बड़े पैमाने पर गुप्त दान दिया।",
          evidence: "SBI official transaction logs, Supreme Court judgment paper, Election Commission disclosures."
        },
        {
          topic: "Industrial Oligopoly & Monopolies",
          officialNarrative: "देश में इंफ्रास्ट्रक्चर के तेज़ विकास और राष्ट्रीय चैंपियंस को बढ़ावा देने के लिए आवश्यक कदम।",
          investigativeFinding: "अहम इंफ्रास्ट्रक्चर सेक्टर्स (बंदरगाह, हवाई अड्डे, कोयला खदानें) बिना पारदर्शी प्रतिस्पर्धा या उचित खुली बोली (open bidding) के चुनिंदा उद्योग समूहों को सौंप दिए गए। इसमें सार्वजनिक वित्तीय संस्थानों (LIC & SBI) की भारी राशि को उच्च जोखिम में डाला गया।",
          evidence: "DRI investigation reports, Mauritius company registry filings, CAG audit notes."
        },
        {
          topic: "Economic Growth vs Unemployment Indicators",
          officialNarrative: "विश्व की पांचवीं सबसे बड़ी अर्थव्यवस्था बनने और तीव्र जीडीपी दर से सभी नागरिकों के उत्थान का दावा।",
          investigativeFinding: "जीडीपी विकास दर का लाभ केवल शीर्ष 1% आबादी तक सीमित रहा है। आवधिक श्रम बल सर्वेक्षणों (PLFS) के अनुसार युवा बेरोजगारी की दर ऐतिहासिक रूप से उच्च स्तर पर है, जबकि भौगोलिक बचत में बड़ी गिरावट आई है।",
          evidence: "Ministry of Statistics (MOSPI) reports, CMIE labour indicators, Reserve Bank of India bulletins."
        }
      ]
    },
    {
      key: 'vault_documents',
      title: 'Leaked Evidence Vault Files',
      data: [
        {
          id: "DOC-2024-001",
          title: "Electoral Bonds Complete Donor-Receiver Matching Ledger",
          category: "वित्तीय अनियमितता",
          date: "March 2024",
          size: "4.2 MB",
          status: "VERIFIED EVIDENCE"
        },
        {
          id: "DOC-2024-002",
          title: "Censored Press Freedom Index Report (MoIB Internal Copy)",
          category: "सेंसरशिप",
          date: "May 2024",
          size: "1.8 MB",
          status: "TOP SECRET"
        },
        {
          id: "DOC-2024-003",
          title: "Pegasus Surveillance Target List - Indian Journalists & Activists",
          category: "निगरानी",
          date: "Jan 2024",
          size: "820 KB",
          status: "EXPOSED"
        },
        {
          id: "DOC-2024-004",
          title: "PM Cares Fund Audits & Secret Direct Investment Accounts",
          category: "वित्तीय अनियमितता",
          date: "April 2024",
          size: "12.4 MB",
          status: "HIGH RISK"
        }
      ]
    },
    {
      key: 'about_page',
      title: 'About Page Information',
      data: {
        badge: 'Who We Are',
        title: 'सत्यदर्पण के बारे में',
        description: 'मुख्यधारा के विमर्शों से परे जाकर निष्पक्ष और तथ्य-आधारित खोजी पत्रकारिता का मंच।',
        missionTitle: 'हमारा उद्देश्य (Our Mission)',
        missionParagraphs: [
          'आज के दौर में जब मीडिया घराने और न्यूज़ चैनल सत्ता और बड़े कॉर्पोरेट्स के हितों के रक्षक बन चुके हैं, सत्यदर्पण का जन्म जनता को सच दिखाने के लिए हुआ है। हमारा एकमात्र ध्येय निष्पक्ष, भयमुक्त और साक्ष्य-आधारित (evidence-based) खोजी पत्रकारिता को जीवित रखना है।',
          'हम केवल आरोपों पर नहीं, बल्कि सरकारी अभिलेखों, आरटीआई (RTI) दस्तावेज़ों, कोर्ट के फैसलों और सत्यापित डेटा पर भरोसा करते हैं।'
        ],
        workTitle: 'हम कैसे काम करते हैं? (How We Work)',
        workCards: [
          { title: '1. गहन दस्तावेज़ी शोध', text: 'हम किसी भी खबर को तब तक प्रकाशित नहीं करते जब तक हमारे पास सरकारी फाइलें, डेटा या कोर्ट के रिकॉर्ड मौजूद न हों।' },
          { title: '2. पूर्णतः स्वतंत्र', text: 'हमें किसी भी राजनैतिक दल या बड़े कॉर्पोरेट घराने से कोई फंडिंग नहीं मिलती। हमारी स्वतंत्रता ही हमारी असली ताकत है।' }
        ],
        publicInterestTitle: 'सार्वजनिक हित और अधिकार',
        publicInterestText: 'संविधान के अनुच्छेद 19(1)(a) के तहत दिए गए भाषण और अभिव्यक्ति की स्वतंत्रता के अधिकार का उपयोग करते हुए, हम जनता के जानने के अधिकार (Right to Know) को सर्वोपरि मानते हैं। देश के नागरिकों को पता होना चाहिए कि उनके अधिकारों और देश के संसाधनों का उपयोग कहाँ और कैसे हो रहा है।'
      }
    }
  ];

  for (const d of defaults) {
    const existing = await Section.findOne({ key: d.key });
    if (!existing) {
      await Section.create(d);
      console.log(`Seeded default section: ${d.key}`);
    }
  }
};
