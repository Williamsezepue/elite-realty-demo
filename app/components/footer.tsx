import { SiFacebook, SiInstagram, SiX } from 'react-icons/si';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
        <div>
          <div className="text-lg sm:text-xl font-bold text-white">Elite Realty</div>
          <p className="mt-2 text-xs sm:text-sm">Premium properties • Private viewings • Investment advisory</p>
        </div>
        <div>
          <div className="font-semibold text-sm text-white mb-3">Quick Links</div>
          <ul className="space-y-1 text-xs sm:text-sm">
            <li><a href="#" className="hover:text-white transition">About</a></li>
            <li><a href="#" className="hover:text-white transition">Properties</a></li>
            <li><a href="#" className="hover:text-white transition">Agents</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-sm text-white mb-3">Contact</div>
          <div className="space-y-1 text-xs sm:text-sm">
            <div>hello@eliterealty.ng</div>
            <div>+234 800 000 0000</div>
          </div>
        </div>
        <div>
          <div className="font-semibold text-sm text-white mb-3">Hours</div>
          <div className="space-y-1 text-xs sm:text-sm">
            <div>Victoria Island, Lagos</div>
            <div>Mon - Fri: 9AM - 6PM</div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-700 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
        © 2025 Elite Realty — Luxury property marketplace
      </div>
    </footer>
  );
}