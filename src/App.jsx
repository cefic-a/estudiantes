import { useState, useEffect } from 'react';
import { db } from './db';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import StudentTable from './components/StudentTable';
import AnalyticsCharts from './components/AnalyticsCharts';

function App() {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activeTab, setActiveTab] = useState('students');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [estudiantes, gruposList] = await Promise.all([
          db.estudiantes.toArray(),
          db.grupos.toArray()
        ]);
        setStudents(estudiantes);
        setGroups(gruposList);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const addStudent = async (newStudent) => {
    const id = newStudent.id || `s${Date.now()}`;
    const studentToSave = { ...newStudent, id };
    await db.estudiantes.add(studentToSave);
    setStudents(prev => [...prev, studentToSave]);
  };

  const updateStudent = async (updatedStudent) => {
    await db.estudiantes.put(updatedStudent);
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const deleteStudent = async (id) => {
    if (window.confirm('¿Eliminar este estudiante?')) {
      await db.estudiantes.delete(id);
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const addGroup = async (newGroup) => {
    await db.grupos.add(newGroup);
    setGroups(prev => [...prev, newGroup]);
  };

  const updateGroup = async (updatedGroup) => {
    await db.grupos.put(updatedGroup);
    setGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));
  };

  const deleteGroup = async (groupId) => {
    if (window.confirm('¿Eliminar grupo? Los estudiantes perderán la asignación.')) {
      await db.grupos.delete(groupId);
      setGroups(prev => prev.filter(g => g.id !== groupId));
      const updatedStudents = students.map(s => ({
        ...s,
        gruposIds: s.gruposIds?.filter(id => id !== groupId) || []
      }));
      for (const student of updatedStudents) {
        await db.estudiantes.put(student);
      }
      setStudents(updatedStudents);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando datos...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === 'students' ? (
            <>
              <StatsCards students={students} groups={groups} />
              <div className="mt-6">
                <StudentTable
                  students={students}
                  groups={groups}
                  onAdd={addStudent}
                  onEdit={updateStudent}
                  onDelete={deleteStudent}
                  onAddGroup={addGroup}
                  onUpdateGroup={updateGroup}
                  onDeleteGroup={deleteGroup}
                />
              </div>
            </>
          ) : (
            <AnalyticsCharts students={students} groups={groups} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;