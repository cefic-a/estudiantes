import Dexie from 'dexie';
import { initialStudents } from './data/mockData';

export const db = new Dexie('SistemaEstudiantes');
db.version(1).stores({
  estudiantes: 'id, doc, grado, activo',
  grupos: 'id'
});

db.on('populate', async () => {
  // Agregar grupos por defecto
  await db.grupos.bulkAdd([
    { id: "g1", nombre: "Sede CEFIC" },
    { id: "g2", nombre: "Especial (Guías)" },
    { id: "g3", nombre: "Apadrinados PUEBLO_N" },
    { id: "g4", nombre: "Apadrinados CENTRO" },
  ]);

  // Agregar estudiantes del mock
  if (initialStudents && initialStudents.length) {
    const estudiantesConGrupos = initialStudents.map(s => ({
      ...s,
      gruposIds: s.gruposIds || []
    }));
    await db.estudiantes.bulkAdd(estudiantesConGrupos);
  }
});

// Abrir y verificar si ya hay datos, si no, forzar carga (por si la BD ya existía)
db.open().then(async () => {
  const count = await db.estudiantes.count();
  if (count === 0 && initialStudents && initialStudents.length) {
    const estudiantesConGrupos = initialStudents.map(s => ({
      ...s,
      gruposIds: s.gruposIds || []
    }));
    await db.estudiantes.bulkAdd(estudiantesConGrupos);
    console.log('Estudiantes importados desde mockData');
  }
});