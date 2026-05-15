import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import GroupSelector from './GroupSelector';

const StudentModal = ({ isOpen, onClose, onSave, initialData, groups }) => {
  const [formData, setFormData] = useState({
    id: '',
    doc: '',
    tipodoc: 'RC',
    apellidos: '',
    nombres: '',
    genero: 'MASCULINO',
    fechaNacimiento: '',
    eps: 'AIC',
    discapacidad: 'NO APLICA',
    activo: true,
    grado: 0,
    grupo: 1,
    idioma: '',
  });
  const [selectedGroups, setSelectedGroups] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setSelectedGroups(initialData.gruposIds || []);
    } else {
      setFormData({
        id: '',
        doc: '',
        tipodoc: 'RC',
        apellidos: '',
        nombres: '',
        genero: 'MASCULINO',
        fechaNacimiento: '',
        eps: 'AIC',
        discapacidad: 'NO APLICA',
        activo: true,
        grado: 0,
        grupo: 1,
        idioma: '',
      });
      setSelectedGroups([]);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.doc || !formData.apellidos || !formData.nombres || !formData.fechaNacimiento) {
      alert('Por favor complete los campos obligatorios: Documento, Apellidos, Nombres y Fecha de nacimiento');
      return;
    }
    const finalData = { ...formData, gruposIds: selectedGroups };
    if (!finalData.id) finalData.id = `s${Date.now()}`;
    onSave(finalData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{initialData ? 'Editar estudiante' : 'Nuevo estudiante'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium">Número de documento *</label><input name="doc" value={formData.doc} onChange={handleChange} className="w-full border rounded px-3 py-2" required /></div>
          <div><label className="block text-sm font-medium">Tipo documento</label><select name="tipodoc" value={formData.tipodoc} onChange={handleChange} className="w-full border rounded px-3 py-2"><option value="RC">Registro Civil</option><option value="TI">Tarjeta de Identidad</option></select></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium">Apellidos completos *</label><input name="apellidos" value={formData.apellidos} onChange={handleChange} className="w-full border rounded px-3 py-2" required /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium">Nombres completos *</label><input name="nombres" value={formData.nombres} onChange={handleChange} className="w-full border rounded px-3 py-2" required /></div>
          <div><label className="block text-sm font-medium">Género</label><select name="genero" value={formData.genero} onChange={handleChange} className="w-full border rounded px-3 py-2"><option value="MASCULINO">Masculino</option><option value="FEMENINO">Femenino</option></select></div>
          <div><label className="block text-sm font-medium">Fecha nacimiento *</label><input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} className="w-full border rounded px-3 py-2" required /></div>
          <div><label className="block text-sm font-medium">EPS</label><input name="eps" value={formData.eps} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
          <div><label className="block text-sm font-medium">Discapacidad</label><select name="discapacidad" value={formData.discapacidad} onChange={handleChange} className="w-full border rounded px-3 py-2"><option value="NO APLICA">NO APLICA</option><option value="DISCAPACIDAD FÍSICA">DISCAPACIDAD FÍSICA</option><option value="VISUAL">VISUAL</option></select></div>
          <div><label className="block text-sm font-medium">Grado</label><input type="number" name="grado" value={formData.grado} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
          <div><label className="block text-sm font-medium">Grupo (aula)</label><input type="number" name="grupo" value={formData.grupo} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
          <div><label className="block text-sm font-medium">Idioma</label><input name="idioma" value={formData.idioma || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Ej: Español, Nasa Yuwe" /></div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Grupos personalizados</label>
            <GroupSelector groups={groups} selectedGroups={selectedGroups} onChange={setSelectedGroups} placeholder="Seleccionar grupos (SedeCentral, Subsede, Guías en casa, etc.)" />
          </div>
          <div className="flex items-center gap-2"><input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} /><label className="text-sm font-medium">Activo</label></div>
          <div className="md:col-span-2 flex justify-end gap-2 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button><button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Guardar</button></div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;