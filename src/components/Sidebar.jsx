import { Users, BarChart3, Menu, X } from 'lucide-react';
import { useState } from 'react';


/* Agregar en el Slide 2 botónes, uno para ver los grados de forma general 
y que en cada grado se pueda ver, estadisticas del  grado y los estudiantes del grado.
y otro para ver los grupos personalizados */
const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { id: 'students', label: 'Estudiantes', icon: Users },
    { id: 'charts', label: 'Estadísticas', icon: BarChart3 },
  ];

  return (
    <>
      {/* Botón hamburguesa móvil */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative z-40 h-full w-64 bg-white shadow-lg transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b">
            <h1 className="text-xl font-bold text-indigo-700">CEFIC Ikh Tukh Kiwe La Estrella ⭐</h1>
            <p className="text-xs text-gray-500">Gestión de estudiantes</p>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                  ${activeTab === item.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;