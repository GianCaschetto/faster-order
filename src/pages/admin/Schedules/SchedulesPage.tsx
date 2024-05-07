import { useAdmin } from "@/contexts/AdminContext";
import { saveAdminData } from "@/services/firebase";
import { Schedule } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const defaultSchedules: Schedule[] = [
  {
    day: "0",
    open: "0:00",
    close: "23:59",
  },
  {
    day: "1",
    open: "0:00",
    close: "23:59",
  },
  {
    day: "2",
    open: "0:00",
    close: "23:59",
  },
  {
    day: "3",
    open: "0:00",
    close: "23:59",
  },
  {
    day: "4",
    open: "0:00",
    close: "23:59",
  },
  {
    day: "5",
    open: "0:00",
    close: "23:59",
  },
  {
    day: "6",
    open: "0:00",
    close: "23:59",
  },
];

const daysOfWeek = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

function SchedulesPage() {
  const { adminData } = useAdmin();
  const [schedules, setSchedules] = useState<Schedule[]>(defaultSchedules);

  const handleSave = () => {
    if (!schedules.every((schedule) => schedule.open <= schedule.close)) {
      toast.error("La hora de cierre debe ser mayor a la de apertura");
      return;
    }
    const updatedAdminData = { ...adminData, schedules };
    saveAdminData(updatedAdminData);
  };

  useEffect(() => {
    setSchedules(adminData?.schedules ?? defaultSchedules);
  }, [adminData?.schedules]);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800">Horarios</h1>
      <div className="mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Día
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Abre
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Cierra
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedules.map((schedule, index) => (
              <tr key={schedule.day}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span>{daysOfWeek[schedule.day]}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="time"
                    value={schedule.open}
                    onChange={(e) => {
                      const updatedSchedules = [...schedules];
                      updatedSchedules[index].open = e.target.value;
                      setSchedules(updatedSchedules);
                    }}
                    className="w-24 border border-gray-300 rounded-md p-1 text-white"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="time"
                    value={schedule.close}
                    onChange={(e) => {
                      const updatedSchedules = [...schedules];
                      updatedSchedules[index].close = e.target.value;
                      setSchedules(updatedSchedules);
                    }}
                    className="w-24 border border-gray-300 rounded-md p-1 text-white"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleSave}>Guardar</button>
      </div>
    </div>
  );
}

export default SchedulesPage;
