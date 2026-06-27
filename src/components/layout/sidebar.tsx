import { Search, Compass, Shield, Users, Trophy, Settings } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { icon: Compass, label: 'Galaxy', href: '/' },
  { icon: Search, label: 'Pokédex', href: '/pokedex' },
  { icon: Users, label: 'Team Builder', href: '/team' },
  { icon: Shield, label: 'Battle', href: '/battle' },
  { icon: Trophy, label: 'Quiz', href: '/quiz' },
  { icon: Settings, label: 'Collection', href: '/collection' },
];

export function Sidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-20 flex-col items-center py-8 bg-black/20 backdrop-blur-xl border-r border-white/10 z-50">
        <div className="mb-12">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          </div>
        </div>
        <nav className="flex flex-col gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group relative flex items-center justify-center p-3 rounded-xl hover:bg-white/10 transition-all"
              title={item.label}
            >
              <item.icon className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
              <span className="absolute left-full ml-4 px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs text-white pointer-events-none">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-black/80 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around px-4 z-50">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 text-white/40 hover:text-white transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
          </Link>
        ))}
        <Link
          href="/collection"
          className="flex flex-col items-center justify-center gap-1 text-white/40 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="text-[9px] font-black uppercase tracking-tighter">Coll.</span>
        </Link>
      </div>
    </>
  );
}
