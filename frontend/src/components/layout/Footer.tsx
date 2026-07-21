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
              A premium investigative journalism and political evidence publishing platform dedicated to truth and transparency.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-text mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/authors" className="hover:text-accent transition-colors">Our Authors</Link></li>
              <li><Link href="/timeline" className="hover:text-accent transition-colors">Political Timeline</Link></li>
              <li><Link href="/fact-checks" className="hover:text-accent transition-colors">Fact Checks</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link href="/ethics" className="hover:text-accent transition-colors">Ethics Policy</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text mb-4">Newsletter</h4>
            <p className="text-sm text-text-muted mb-4">Get the latest investigations delivered to your inbox.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-2 rounded-l-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button className="px-4 py-2 bg-accent text-white rounded-r-lg text-sm font-medium hover:bg-accent/90 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} SatyaDarpan. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-text-muted">
            <Link href="/rss.xml" className="hover:text-accent transition-colors">RSS Feed</Link>
            <Link href="/sitemap.xml" className="hover:text-accent transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
