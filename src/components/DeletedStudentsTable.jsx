import { useState, useEffect } from 'react';
import { Trash2, RotateCcw, Search } from 'lucide-react';
import { db } from '../db';

const DeletedStudentsTable = ({ onRestore, onPermanentDelete }) => {
  const [deleted, setDeleted] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMotivo, setFilterMotivo] = useState('todos');

  useEffect(() => {
    loadDeleted();
  }, []);

  const loadDeleted = async () => {
    const list = await db.estudiantes_eliminados.toArray();
    setDeleted(list);
  };

  const handleRestore = async (student) => {
    if (window.confirm(`¿Restaurar a ${student.apellidos} ${student.nombres}? Volverá a la lista activa.`)) {
      await onRestore(student);
      await loadDeleted();
    }
  };

  const handlePermanentDelete = async (id, name) => {
    if (window.confirm(`¿Eliminar permanentemente a ${name}? Esta acción no se puede deshacer.`)) {
      await onPermanentDelete(id);
      await loadDeleted();
    }
  };

  let filtered = deleted.filter(d => {
    const fullName = `${d.apellidos} ${d.nombres}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || d.doc.includes(searchTerm);
    const matchesMotivo = filterMotivo === 'todos' || d.motivo === filterMotivo;
    return matchesSearch && matchesMotivo;
  });

  const motivosUnicos = ['todos', ...new Set(deleted.map(d => d.motivo))];

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Estudiantes eliminados</h2>
        <p className="text-sm text-gray-500">Registro histórico de bajas</p>
      </div>

      <div className="p-4 bg-gray-50 border-b flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white rounded-lg border px-3 py-1">
          <Search size={18} className="text-gray-400" />
          <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="outline-none text-sm w-48 md:w-64" />
        </div>
        <select value={filterMotivo} onChange={(e) => setFilterMotivo(e.target.value)} className="border rounded-lg px-3 py-1 text-sm">
          {motivosUnicos.map(m => <option key={m} value={m}>{m === 'todos' ? 'Todos los motivos' : m}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Documento</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Grado</th>
              <th className="px-4 py-3 text-left">Motivo</th>
              <th className="px-4 py-3 text-left">Fecha eliminación</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => (
              <tr key={student.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{student.doc}</td>
                <td className="px-4 py-2">{`${student.apellidos} ${student.nombres}`}</td>
                <td className="px-4 py-2">{student.grado}</td>
                <td className="px-4 py-2">{student.motivo}</td>
                <td className="px-4 py-2">{new Date(student.fechaEliminacion).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleRestore(student)} className="text-green-600 hover:text-green-800" title="Restaurar">
                      <RotateCcw size={18} />
                    </button>
                    <button onClick={() => handlePermanentDelete(student.id, `${student.apellidos} ${student.nombres}`)} className="text-red-600 hover:text-red-800" title="Eliminar permanentemente">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="6" className="text-center py-8 text-gray-500">No hay registros de estudiantes eliminados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeletedStudentsTable;