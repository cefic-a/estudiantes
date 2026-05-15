import { Users, UserCheck, UserX, Activity } from 'lucide-react';

const StatsCards = ({ students, groups }) => {
  const total = students.length;
  const activos = students.filter(s => s.activo).length;
  const inactivos = total - activos;
  const conDiscapacidad = students.filter(s => s.discapacidad !== 'NO APLICA').length;
  const porcentajeDiscapacidad = total ? ((conDiscapacidad / total) * 100).toFixed(1) : 0;

  // Métricas por grado
  const gradosMap = new Map();
  students.forEach(s => {
    const grado = s.grado;
    if (!gradosMap.has(grado)) gradosMap.set(grado, { total: 0, activos: 0, inactivos: 0 });
    const stats = gradosMap.get(grado);
    stats.total++;
    if (s.activo) stats.activos++;
    else stats.inactivos++;
  });
  const gradosStats = Array.from(gradosMap.entries()).sort((a,b)=>a[0]-b[0]).map(([grado, stats]) => ({ grado, ...stats }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4"><div className="p-3 bg-blue-100 rounded-full"><Users size={28} className="text-blue-600" /></div><div><p className="text-gray-500 text-sm">Total estudiantes</p><p className="text-2xl font-bold">{total}</p></div></div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4"><div className="p-3 bg-green-100 rounded-full"><UserCheck size={28} className="text-green-600" /></div><div><p className="text-gray-500 text-sm">Activos</p><p className="text-2xl font-bold">{activos}</p></div></div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4"><div className="p-3 bg-red-100 rounded-full"><UserX size={28} className="text-red-600" /></div><div><p className="text-gray-500 text-sm">Inactivos</p><p className="text-2xl font-bold">{inactivos}</p></div></div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4"><div className="p-3 bg-purple-100 rounded-full"><Activity size={28} className="text-purple-600" /></div><div><p className="text-gray-500 text-sm">Discapacidad</p><p className="text-2xl font-bold">{porcentajeDiscapacidad}%</p></div></div>
      </div>
      <div className="bg-white rounded-xl shadow p-5"><h3 className="font-semibold text-gray-700 mb-3">📊 Estudiantes por grado</h3><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left">Grado</th><th className="px-4 py-2 text-left">Total</th><th className="px-4 py-2 text-left">Activos</th><th className="px-4 py-2 text-left">Inactivos</th></tr></thead><tbody>{gradosStats.map(({ grado, total, activos, inactivos }) => (<tr key={grado} className="border-t"><td className="px-4 py-2 font-medium">{grado}</td><td className="px-4 py-2">{total}</td><td className="px-4 py-2 text-green-600">{activos}</td><td className="px-4 py-2 text-red-500">{inactivos}</td></tr>))}</tbody></table></div></div>
      <div className="bg-white rounded-xl shadow p-5"><h3 className="font-semibold text-gray-700 mb-3">🏷️ Estudiantes por grupo personalizado</h3><div className="flex flex-wrap gap-3">{groups.map(group => { const count = students.filter(s => s.gruposIds?.includes(group.id)).length; return <div key={group.id} className="bg-gray-100 rounded-full px-3 py-1 text-sm">{group.nombre}: {count}</div>;})}{groups.length===0 && <p className="text-gray-500 text-sm">No hay grupos creados.</p>}</div></div>
    </div>
  );
};

export default StatsCards;