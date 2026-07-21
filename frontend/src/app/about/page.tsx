import { ShieldAlert, BookOpen, Fingerprint } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://satya-darpan.onrender.com/api';

const FALLBACK = {
  badge: 'Who We Are',
  title: 'सत्यदर्पण के बारे में',
  description: 'मुख्यधारा के विमर्शों से परे जाकर निष्पक्ष और तथ्य-आधारित खोजी पत्रकारिता का मंच।',
  missionTitle: 'हमारा उद्देश्य (Our Mission)',
  missionParagraphs: [
    'आज के दौर में जब मीडिया घराने और न्यूज़ चैनल सत्ता और बड़े कॉर्पोरेट्स के हितों के रक्षक बन चुके हैं, सत्यदर्पण का जन्म जनता को सच दिखाने के लिए हुआ है। हमारा एकमात्र ध्येय निष्पक्ष, भयमुक्त और साक्ष्य-आधारित (evidence-based) खोजी पत्रकारिता को जीवित रखना है।',
    'हम केवल आरोपों पर नहीं, बल्कि सरकारी अभिलेखों, आरटीआई (RTI) दस्तावेज़ों, कोर्ट के फैसलों और सत्यापित डेटा पर भरोसा करते हैं।',
  ],
  workTitle: 'हम कैसे काम करते हैं? (How We Work)',
  workCards: [
    { title: '1. गहन दस्तावेज़ी शोध', text: 'हम किसी भी खबर को तब तक प्रकाशित नहीं करते जब तक हमारे पास सरकारी फाइलें, डेटा या कोर्ट के रिकॉर्ड मौजूद न हों।' },
    { title: '2. पूर्णतः स्वतंत्र', text: 'हमें किसी भी राजनैतिक दल या बड़े कॉर्पोरेट घराने से कोई फंडिंग नहीं मिलती। हमारी स्वतंत्रता ही हमारी असली ताकत है।' },
  ],
  publicInterestTitle: 'सार्वजनिक हित और अधिकार',
  publicInterestText: 'संविधान के अनुच्छेद 19(1)(a) के तहत दिए गए भाषण और अभिव्यक्ति की स्वतंत्रता के अधिकार का उपयोग करते हुए, हम जनता के जानने के अधिकार (Right to Know) को सर्वोपरि मानते हैं।',
};

async function getAboutData() {
  try {
    const res = await fetch(`${API}/sections/about_page`, { cache: 'no-store' });
    if (res.ok) {
      const d = await res.json();
      if (d.data?.data) return d.data.data;
    }
  } catch {}
  return FALLBACK;
}

export const metadata = {
  title: 'About Us | SatyaDarpan',
  description: 'Our mission is to publish facts and evidence that mainstream media hides.',
};

export default async function AboutPage() {
  const data = await getAboutData();

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="border-l-2 border-accent pl-6 mb-16">
          <span className="text-accent font-black tracking-wider text-xs uppercase bg-accent/10 px-3 py-1 rounded">
            {data.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-playfair font-black mt-4 mb-4">{data.title}</h1>
          <p className="text-text-muted text-sm max-w-xl">{data.description}</p>
        </div>

        {/* Mission Body */}
        <div className="space-y-12 leading-relaxed">

          {/* Mission Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-playfair font-black text-accent flex items-center gap-2">
              <ShieldAlert className="w-6 h-6" /> {data.missionTitle}
            </h2>
            {(data.missionParagraphs || []).map((p: string, i: number) => (
              <p key={i} className="text-text-muted">{p}</p>
            ))}
          </section>

          {/* How We Work */}
          <section className="space-y-4">
            <h2 className="text-2xl font-playfair font-black text-accent flex items-center gap-2">
              <Fingerprint className="w-6 h-6" /> {data.workTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {(data.workCards || []).map((card: any, i: number) => (
                <div key={i} className="bg-surface border border-border p-5 rounded">
                  <h3 className="font-bold mb-2">{card.title}</h3>
                  <p className="text-sm text-text-muted">{card.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Public Interest */}
          <section className="space-y-4">
            <h2 className="text-2xl font-playfair font-black text-accent flex items-center gap-2">
              <BookOpen className="w-6 h-6" /> {data.publicInterestTitle}
            </h2>
            <p className="text-text-muted">{data.publicInterestText}</p>
          </section>

        </div>
      </div>
    </div>
  );
}
