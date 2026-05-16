import Dexie from 'dexie';
import { initialStudents } from './data/mockData';

export const db = new Dexie('SistemaEstudiantes');

db.version(2).stores({
  estudiantes: 'id, doc, grado, activo',
  grupos: 'id',
  estudiantes_eliminados: 'id, doc, fechaEliminacion, motivo'
});

db.on('populate', async () => {
  await db.grupos.bulkAdd([
    { id: 'g1', nombre: 'Subsede Central' },
    { id: 'g2', nombre: 'Guías en casa' },
    { id: 'g3', nombre: 'Aceleración' }
  ]);
  if (initialStudents && initialStudents.length) {
    const estudiantesConGrupos = initialStudents.map(s => ({
      ...s,
      gruposIds: s.gruposIds || []
    }));
    await db.estudiantes.bulkAdd(estudiantesConGrupos);
  }
});

db.open().catch(err => console.error('Error al abrir DB:', err));