import Link from 'next/link';
import { Eye } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Eye className="h-6 w-6 text-accent" />
              <span className="text-xl font-playfair font-bold text-text">सत्यदर्पण</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed mb-6">
              सत्य, पारदर्शिता और जनहित को समर्पित एक प्रमुख निष्पक्ष अन्वेषणात्मक पत्रकारिता एवं साक्ष्य प्रकाशन मंच।
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-text mb-4">प्लेटफॉर्म</h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li><Link href="/about" className="hover:text-accent transition-colors">हमारे बारे में</Link></li>
              <li><Link href="/authors" className="hover:text-accent transition-colors">हमारे लेखक</Link></li>
              <li><Link href="/timeline" className="hover:text-accent transition-colors">राजनीतिक टाइमलाइन</Link></li>
              <li><Link href="/fact-checks" className="hover:text-accent transition-colors">फैक्ट चेक</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text mb-4">कानूनी व नीति</h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li><Link href="/privacy" className="hover:text-accent transition-colors">गोपनीयता नीति</Link></li>
              <li><Link href="/terms" className="hover:text-accent transition-colors">सेवा की शर्तें</Link></li>
              <li><Link href="/ethics" className="hover:text-accent transition-colors">आचार संहिता</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">संपर्क करें</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text mb-4">न्यूज़लेटर</h4>
            <p className="text-sm text-text-muted mb-4">नवीनतम अन्वेषण और खुलासे सीधे अपने ईमेल पर प्राप्त करें।</p>
            <form className="flex">
              <input
                type="email"
                placeholder="अपना ईमेल दर्ज करें"
                className="w-full px-4 py-2 rounded-l-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button className="px-4 py-2 bg-accent text-white rounded-r-lg text-sm font-medium hover:bg-accent/90 transition-colors">
                सब्सक्राइब
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} सत्यदर्पण। सर्वाधिकार सुरक्षित।
          </p>
          <div className="flex items-center gap-4 text-sm text-text-muted">
            <Link href="/rss.xml" className="hover:text-accent transition-colors">आरएसएस फीड</Link>
            <Link href="/sitemap.xml" className="hover:text-accent transition-colors">साइटमैप</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
