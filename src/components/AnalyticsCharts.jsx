import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalyticsCharts = ({ students }) => {
  // Distribución por grado
  const gradosMap = new Map();
  students.forEach(s => {
    const grado = s.grado;
    gradosMap.set(grado, (gradosMap.get(grado) || 0) + 1);
  });
  const dataGrados = Array.from(gradosMap.entries())
    .sort((a,b) => a[0]-b[0])
    .map(([grado, count]) => ({ grado: `Grado ${grado}`, cantidad: count }));

  // Activos vs Inactivos
  const activos = students.filter(s => s.activo).length;
  const inactivos = students.length - activos;
  const dataActivos = [
    { name: 'Activos', value: activos, color: '#10b981' },
    { name: 'Inactivos', value: inactivos, color: '#ef4444' },
  ];

  // Género
  const masculinos = students.filter(s => s.genero === 'MASCULINO').length;
  const femeninos = students.filter(s => s.genero === 'FEMENINO').length;
  const dataGenero = [
    { name: 'Masculino', value: masculinos, color: '#3b82f6' },
    { name: 'Femenino', value: femeninos, color: '#ec489a' },
  ];

  // Discapacidad
  const conDiscap = students.filter(s => s.discapacidad !== 'NO APLICA').length;
  const sinDiscap = students.length - conDiscap;
  const dataDiscap = [
    { name: 'Con discapacidad', value: conDiscap, color: '#f59e0b' },
    { name: 'Sin discapacidad', value: sinDiscap, color: '#9ca3af' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">📊 Distribución de estudiantes por grado</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={dataGrados} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="grado" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#6366f1" name="Estudiantes" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">Activos vs Inactivos</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={dataActivos} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {dataActivos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">Distribución por género</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={dataGenero} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {dataGenero.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">Estudiantes con discapacidad</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={dataDiscap} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {dataDiscap.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;