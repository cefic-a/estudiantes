import { Users, UserCheck, UserX, Activity, TrendingUp } from 'lucide-react';

const StatsCards = ({ students, groups }) => {
  const total = students.length;
  const activos = students.filter(s => s.activo).length;
  const inactivos = total - activos;
  const conDiscapacidad = students.filter(s => s.discapacidad !== 'NO APLICA').length;
  const porcentajeDiscapacidad = total ? ((conDiscapacidad / total) * 100).toFixed(1) : 0;

  // Datos por grado
  const gradosMap = new Map();
  students.forEach(s => {
    const grado = s.grado;
    if (!gradosMap.has(grado)) {
      gradosMap.set(grado, { total: 0, activos: 0, inactivos: 0 });
    }
    const stats = gradosMap.get(grado);
    stats.total++;
    if (s.activo) stats.activos++;
    else stats.inactivos++;
  });
  const gradosStats = Array.from(gradosMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([grado, stats]) => ({
      grado,
      ...stats,
      porcentajeActivos: stats.total ? Math.round((stats.activos / stats.total) * 100) : 0
    }));

  // Colores para las tarjetas de grado (basados en el grado)
  const getColorByGrado = (grado) => {
    const colores = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-yellow-500 to-yellow-600',
      'from-red-500 to-red-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600',
      'from-orange-500 to-orange-600',
      'from-cyan-500 to-cyan-600',
      'from-lime-500 to-lime-600',
      'from-emerald-500 to-emerald-600',
    ];
    return colores[grado % colores.length] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Métricas globales - mismas 4 tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full"><Users size={28} className="text-blue-600" /></div>
          <div><p className="text-gray-500 text-sm">Total estudiantes</p><p className="text-2xl font-bold">{total}</p></div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full"><UserCheck size={28} className="text-green-600" /></div>
          <div><p className="text-gray-500 text-sm">Activos</p><p className="text-2xl font-bold">{activos}</p></div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-full"><UserX size={28} className="text-red-600" /></div>
          <div><p className="text-gray-500 text-sm">Inactivos</p><p className="text-2xl font-bold">{inactivos}</p></div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-full"><Activity size={28} className="text-purple-600" /></div>
          <div><p className="text-gray-500 text-sm">Discapacidad</p><p className="text-2xl font-bold">{porcentajeDiscapacidad}%</p></div>
        </div>
      </div>

      {/* Nueva sección: Tarjetas por grado */}
      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700 text-lg">📊 Estudiantes por grado</h3>
          <TrendingUp size={20} className="text-gray-400" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {gradosStats.map(({ grado, total, activos, inactivos, porcentajeActivos }) => (
            <div
              key={grado}
              className="relative overflow-hidden rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Fondo degradado sutil en la parte superior */}
              <div className={`bg-gradient-to-r ${getColorByGrado(grado)} p-3 text-white`}>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Grado {grado}</span>
                  <span className="text-xs bg-white bg-opacity-30 px-2 py-1 rounded-full">{total} estudiantes</span>
                </div>
              </div>
              <div className="p-4 bg-white">
                <div className="flex justify-between mb-2">
                  <div className="text-center flex-1">
                    <p className="text-2xl font-bold text-green-600">{activos}</p>
                    <p className="text-xs text-gray-500">Activos</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-2xl font-bold text-red-500">{inactivos}</p>
                    <p className="text-xs text-gray-500">Inactivos</p>
                  </div>
                </div>
                {/* Barra de progreso de actividad */}
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Tasa de actividad</span>
                    <span>{porcentajeActivos}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${porcentajeActivos}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {gradosStats.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">No hay datos de estudiantes por grado</div>
          )}
        </div>
      </div>

      {/* Sección de grupos personalizados (sin cambios) */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold text-gray-700 mb-3">🏷️ Estudiantes por grupo personalizado</h3>
        <div className="flex flex-wrap gap-3">
          {groups.map(group => {
            const count = students.filter(s => s.gruposIds?.includes(group.id)).length;
            return (
              <div key={group.id} className="bg-gray-100 rounded-full px-3 py-1 text-sm">
                {group.nombre}: {count}
              </div>
            );
          })}
          {groups.length === 0 && <p className="text-gray-500 text-sm">No hay grupos creados.</p>}
        </div>
      </div>
    </div>
  );
};

export default StatsCards;