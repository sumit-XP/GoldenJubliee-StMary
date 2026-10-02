import React from 'react';
import { Phone, Mail, MapPin, ExternalLink, Lock, Heart, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface FooterProps {
  onOpenContribute: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenContribute,
  onNavigate,
  onOpenAdmin,
}) => {
  const { isAdmin } = useAuth();

  return (
    <footer id="about" className="bg-[#2D0304] text-amber-100/90 pt-16 pb-12 border-t-4 border-amber-500 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-amber-600/20">
          
          {/* Col 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 p-0.5 shadow">
                <div className="w-full h-full rounded-full bg-[#5A0506] flex items-center justify-center text-amber-300 font-serif font-black text-sm">
                  SMJ
                </div>
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-amber-200">
                  St. Mary's School
                </h3>
                <p className="text-xs text-amber-300/80">Jajpur Road, Odisha</p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-amber-200/70">
              Co-educational English medium institution founded in 1976 under the patronage of Mother Mary. Managed by Cuttack Roman Catholic Diocesan Corporation (CRCDC), Archdiocese of Cuttack-Bhubaneswar, in collaboration with Sisters of the Handmaids of Mary.
            </p>

            <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-semibold text-amber-300 font-serif italic">
              "Service Through Excellence" • 1976–2026
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-sm text-amber-300 uppercase tracking-wider mb-4">
              Jubilee Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-amber-100/80">
              <li>
                <button
                  onClick={() => onNavigate('hero')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Golden Jubilee Welcome
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('timeline')}
                  className="hover:text-amber-300 transition-colors"
                >
                  50-Year Milestone Journey
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('events')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Jubilee Events Schedule & RSVP
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('donors')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Distinguished Donors Wall
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('wishes')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Alumni Memory Wall
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContribute}
                  className="text-amber-300 font-bold hover:underline flex items-center gap-1"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  Make a Jubilee Contribution
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Contact Details */}
          <div>
            <h4 className="font-serif font-bold text-sm text-amber-300 uppercase tracking-wider mb-4">
              School Contact Info
            </h4>
            <div className="space-y-3 text-xs text-amber-100/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>St. Mary's School, Jajpur Road, Jajpur District, Odisha - 755019</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>06726-220393 / 8763116421</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>stmary_jkr@rediffmail.com</span>
              </div>

              <div className="pt-2">
                <a
                  href="https://www.stmarysjajpurroad.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 underline"
                >
                  <span>Official Main School Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Jubilee Secretariat & Admin Access */}
          <div>
            <h4 className="font-serif font-bold text-sm text-amber-300 uppercase tracking-wider mb-4">
              Jubilee Secretariat
            </h4>
            <p className="text-xs text-amber-200/70 leading-relaxed mb-4">
              Organized by the Golden Jubilee Celebration Committee & St. Mary's Alumni Association.
            </p>

            <div className="bg-black/30 border border-amber-500/20 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-200">Admin Control</span>
                <button
                  onClick={onOpenAdmin}
                  className="px-2.5 py-1 bg-amber-400 text-stone-950 font-bold rounded-lg text-[11px] hover:bg-amber-300 transition-colors flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>{isAdmin ? 'Dashboard' : 'Admin Login'}</span>
                </button>
              </div>
              <p className="text-[10px] text-amber-200/50 mt-1.5">
                Manage jubilee events, timeline, ledger & site announcements
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-200/60 text-center sm:text-left">
          <p>
            © 1976 – 2026 St. Mary's School, Jajpur Road. All Rights Reserved. Commemorating 50 Golden Years.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-amber-400 font-serif font-semibold">Service Through Excellence</span>
            <span>•</span>
            <span className="font-mono">CISCE Affiliation No. OR034</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
