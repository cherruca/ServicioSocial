import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import {
  petitionService,
  petitionAdminService,
} from '../../services/petitionService';
import { FaCheck, FaTimes } from 'react-icons/fa';

const PetitionsManagement = () => {
  const {
    data: petitions,
    loading,
    error,
    execute,
  } = useApi(petitionService.getPetitions);

  useEffect(() => {
    execute();
  }, [execute]);

  const handleApprove = async (id) => {
    try {
      await petitionAdminService.approvePetition(id);
      execute();
    } catch (e) {
      console.error('Approve failed', e);
      const msg = e?.response?.data?.message || e?.message || 'No se pudo aprobar la petición';
      alert(msg);
    }
  };

  const handleReject = async (id) => {
    // open modal handled elsewhere
    setRejectingId(id);
    setShowRejectModal(true);
  };

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const submitReject = async () => {
    try {
      await petitionAdminService.rejectPetition(rejectingId, rejectReason || '');
      setShowRejectModal(false);
      setRejectReason('');
      setRejectingId(null);
      execute();
    } catch (e) {
      console.error('Reject failed', e);
      const msg = e?.response?.data?.message || e?.message || 'No se pudo rechazar la petición';
      alert(msg);
    }
  };

  const isAdmin = (() => {
    if (typeof window === 'undefined') return false;
    const role = localStorage.getItem('role') || '';
    return typeof role === 'string' && role.toLowerCase().includes('admin');
  })();

  if (loading) return <p>Cargando solicitudes...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Solicitudes</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="py-2 px-4 border">Estudiante</th>
              <th className="py-2 px-4 border">Proyecto</th>
              <th className="py-2 px-4 border">Fecha</th>
              <th className="py-2 px-4 border">Estado</th>
              <th className="py-2 px-4 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(petitions) && petitions.length > 0 ? (
              petitions.map((p) => {
                const studentObj = p.students && p.students[0] ? p.students[0] : p.student || null;
                const studentLabel = studentObj
                  ? studentObj.name || studentObj.email || studentObj.carnet || String(studentObj)
                  : '-';

                const projectObj = p.projects && p.projects[0] ? p.projects[0] : p.project || null;
                const projectLabel = projectObj
                  ? projectObj.name || projectObj.title || String(projectObj)
                  : '-';

                return (
                  <tr key={p._id} className="border-b">
                    <td className="py-2 px-4 border">{studentLabel}</td>
                    <td className="py-2 px-4 border">{projectLabel}</td>
                    <td className="py-2 px-4 border">
                      {p.date ? new Date(p.date).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      {(() => {
                        const s = (p.status || '').toLowerCase();
                        if (s === 'approved' || s === 'aprobada') {
                          return <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Aprobada</span>;
                        }
                        if (s === 'rejected' || s === 'rechazada') {
                          return <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Rechazada</span>;
                        }
                        return <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Pendiente</span>;
                      })()}
                    </td>
                    <td className="py-2 px-4 border">
                      {p.status === 'pending' && isAdmin ? (
                        <div className="flex items-center gap-2">
                          <button
                            title="Aprobar"
                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                            onClick={() => handleApprove(p._id)}
                          >
                            <FaCheck />
                          </button>
                          <button
                            title="Rechazar"
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                            onClick={() => handleReject(p._id)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                      <span className="text-gray-600">No hay acciones</span>
                    )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="py-2 px-4 text-center">
                  No hay solicitudes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded shadow-lg w-11/12 max-w-md p-4">
            <h3 className="text-lg font-semibold mb-2">Motivo del rechazo (opcional)</h3>
            <textarea
              className="w-full border rounded p-2 mb-3 bg-white"
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Escribe el motivo aquí..."
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 bg-gray-300 rounded"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setRejectingId(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded"
                onClick={submitReject}
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetitionsManagement;
