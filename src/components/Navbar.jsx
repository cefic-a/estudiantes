import { School } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm py-3 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <School className="text-indigo-600" size={28} />
        <span className="text-lg font-semibold text-gray-800">Dashboard Directivo</span>
      </div>
      <div className="text-sm text-gray-500 hidden sm:block">
        {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </header>
  );
};

export default Navbar;