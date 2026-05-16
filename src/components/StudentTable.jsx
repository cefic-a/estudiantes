import { useState } from 'react';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import StudentModal from './StudentModal';
import GroupManager from './GroupManager';
import DeleteMotivoModal from './DeleteMotivoModal';
import { db } from '../db';

const StudentTable = ({ students, groups, onAdd, onEdit, onDelete, onAddGroup, onUpdateGroup, onDeleteGroup }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('todos');
  const [filterActive, setFilterActive] = useState('todos');
  const [selectedGrade, setSelectedGrade] = useState('todos');
  const [filterGroup, setFilterGroup] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [groupManagerOpen, setGroupManagerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const gradosUnicos = ['todos', ...new Set(students.map(s => s.grado))].sort((a,b) => a=== 'todos' ? -1 : a-b);

  let filtered = students.filter(s => {
    const fullName = `${s.apellidos} ${s.nombres}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || s.doc.includes(searchTerm);
    const matchesGender = filterGender === 'todos' || s.genero === filterGender;
    const matchesActive = filterActive === 'todos' || (filterActive === 'activo' ? s.activo : !s.activo);
    const matchesGrade = selectedGrade === 'todos' || s.grado === selectedGrade;
    const matchesGroup = filterGroup === 'todos' || (s.gruposIds && s.gruposIds.includes(filterGroup));
    return matchesSearch && matchesGender && matchesActive && matchesGrade && matchesGroup;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage-1)*pageSize, currentPage*pageSize);

  const calcularEdad = (fechaNac) => {
    const hoy = new Date();
    const nac = new Date(fechaNac);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setModalOpen(true);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (motivo) => {
    if (!studentToDelete) return;
    // Mover a estudiantes_eliminados
    const eliminado = {
      ...studentToDelete,
      motivo: motivo,
      fechaEliminacion: new Date().toISOString()
    };
    await db.estudiantes_eliminados.add(eliminado);
    await db.estudiantes.delete(studentToDelete.id);
    // Actualizar estado local
    onDelete(studentToDelete.id);
    setDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  const handleSave = (studentData) => {
    if (editingStudent) {
      onEdit(studentData);
    } else {
      onAdd(studentData);
    }
    setModalOpen(false);
    setEditingStudent(null);
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="p-4 border-b flex flex-wrap gap-3 justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Lista de estudiantes</h2>
        <div className="flex gap-2">
          <button onClick={() => setGroupManagerOpen(true)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg text-sm">
            Gestionar grupos
          </button>
          <button onClick={() => { setEditingStudent(null); setModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
            <Plus size={18} /> Agregar
          </button>
        </div>
      </div>

      {/* Filtros (igual que antes) */}
      <div className="p-4 bg-gray-50 border-b flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white rounded-lg border px-3 py-1">
          <Search size={18} className="text-gray-400" />
          <input type="text" placeholder="Buscar nombre o documento..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="outline-none text-sm w-48 md:w-64" />
        </div>
        <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className="border rounded-lg px-3 py-1 text-sm">
          <option value="todos">Todos los géneros</option>
          <option value="MASCULINO">Masculino</option>
          <option value="FEMENINO">Femenino</option>
        </select>
        <select value={filterActive} onChange={(e) => setFilterActive(e.target.value)} className="border rounded-lg px-3 py-1 text-sm">
          <option value="todos">Todos (estado)</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
        <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value === 'todos' ? 'todos' : Number(e.target.value))} className="border rounded-lg px-3 py-1 text-sm">
          {gradosUnicos.map(g => (<option key={g} value={g}>{g === 'todos' ? 'Todos los grados' : `Grado ${g}`}</option>))}
        </select>
        <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="border rounded-lg px-3 py-1 text-sm">
          <option value="todos">Todos los grupos</option>
          {groups.map(g => (<option key={g.id} value={g.id}>{g.nombre}</option>))}
        </select>
      </div>

      {/* Tabla (igual, solo cambia el botón eliminar para usar handleDeleteClick) */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Documento</th>
              <th className="px-4 py-3 text-left">Apellidos y Nombres</th>
              <th className="px-4 py-3 text-left">Género</th>
              <th className="px-4 py-3 text-left">Fecha nac.</th>
              <th className="px-4 py-3 text-left">Edad</th>
              <th className="px-4 py-3 text-left">EPS</th>
              <th className="px-4 py-3 text-left">Discapacidad</th>
              <th className="px-4 py-3 text-left">Idioma</th>
              <th className="px-4 py-3 text-left">Grupos</th>
              <th className="px-4 py-3 text-center">Estado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((student) => (
              <tr key={student.doc} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{student.doc}</td>
                <td className="px-4 py-2">{`${student.apellidos} ${student.nombres}`}</td>
                <td className="px-4 py-2">{student.genero === 'MASCULINO' ? 'M' : 'F'}</td>
                <td className="px-4 py-2">{student.fechaNacimiento}</td>
                <td className="px-4 py-2">{calcularEdad(student.fechaNacimiento)}</td>
                <td className="px-4 py-2 truncate max-w-[150px]">{student.eps}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${student.discapacidad !== 'NO APLICA' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>
                    {student.discapacidad !== 'NO APLICA' ? student.discapacidad : '—'}
                  </span>
                </td>
                <td className="px-4 py-2">{student.idioma || '—'}</td>
                <td className="px-4 py-2">
                  {student.gruposIds && student.gruposIds.map(gid => {
                    const group = groups.find(g => g.id === gid);
                    return group ? <span key={gid} className="inline-block bg-gray-100 rounded px-2 py-0.5 text-xs mr-1 mb-1">{group.nombre}</span> : null;
                  })}
                </td>
                <td className="px-4 py-2 text-center">
                  <span className={`inline-block w-3 h-3 rounded-full ${student.activo ? 'bg-green-500' : 'bg-red-500'}`} title={student.activo ? 'Activo' : 'Inactivo'}></span>
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(student)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                    <button onClick={() => handleDeleteClick(student)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan="11" className="text-center py-8 text-gray-500">No hay estudiantes que coincidan</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación (igual) */}
      <div className="p-4 border-t flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span>Mostrar</span>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="border rounded px-2 py-1">
            <option value={5}>5</option><option value={10}>10</option><option value={15}>15</option>
          </select>
          <span>por página</span>
        </div>
        <div className="flex gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p-1)} className="px-3 py-1 border rounded disabled:opacity-50">Anterior</button>
          <span className="px-3 py-1">Pág. {currentPage} de {totalPages || 1}</span>
          <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p+1)} className="px-3 py-1 border rounded disabled:opacity-50">Siguiente</button>
        </div>
      </div>

      <StudentModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingStudent(null); }} onSave={handleSave} initialData={editingStudent} groups={groups} />
      <GroupManager isOpen={groupManagerOpen} onClose={() => setGroupManagerOpen(false)} groups={groups} onAddGroup={onAddGroup} onUpdateGroup={onUpdateGroup} onDeleteGroup={onDeleteGroup} />
      <DeleteMotivoModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setStudentToDelete(null); }}
        onConfirm={handleConfirmDelete}
        studentName={studentToDelete ? `${studentToDelete.apellidos} ${studentToDelete.nombres}` : ''}
      />
    </div>
  );
};

export default StudentTable;