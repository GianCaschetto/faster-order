import Switch from "@/components/Switch";
import { useAdmin } from "@/contexts/AdminContext";
import { saveAdminData } from "@/services/firebase";
import { Schedule } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const defaultSchedules: Schedule[] = [
  {
    day: "0",
    open: "0:00",
    close: "23:59",
    forced: false,
  },
  {
    day: "1",
    open: "0:00",
    close: "23:59",
    forced: false,
  },
  {
    day: "2",
    open: "0:00",
    close: "23:59",
    forced: false,
  },
  {
    day: "3",
    open: "0:00",
    close: "23:59",
    forced: false,
  },
  {
    day: "4",
    open: "0:00",
    close: "23:59",
    forced: false,
  },
  {
    day: "5",
    open: "0:00",
    close: "23:59",
    forced: false,
  },
  {
    day: "6",
    open: "0:00",
    close: "23:59",
    forced: false,
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
  const [schedules, setSchedules] = useState<Schedule[]>(
    adminData?.schedules ?? defaultSchedules
  );

  const createDateFromTimeString = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0); // Sets hours, minutes, seconds, and milliseconds
    return date;
  };

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
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 w-2/3 mt-4 mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-4">
        Horarios
      </h2>
      <div className="mt-6 ">
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-gray-50 ">
            <tr>
              <th
                scope="col"
                className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Forzar apertura
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedules.map((schedule, index) => (
              <tr key={schedule.day}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p>{schedule.forced}</p>
                  <span className="text-sm font-medium text-gray-900">
                    {daysOfWeek[schedule.day]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <DatePicker
                    className="w-24 border border-gray-300 rounded-md p-1 text-black "
                    selected={createDateFromTimeString(schedule.open)}
                    onChange={(date) => {
                      const updatedSchedules = [...schedules];
                      const hours = date.getHours().toString().padStart(2, "0");
                      const minutes = date
                        .getMinutes()
                        .toString()
                        .padStart(2, "0");
                      updatedSchedules[index].open = `${hours}:${minutes}`;
                      setSchedules(updatedSchedules);
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={1}
                    timeCaption="Hora"
                    dateFormat="HH:mm"
                    placeholderText="Selecciona una hora"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <DatePicker
                    className="w-24 border border-gray-300 rounded-md p-1 text-white"
                    selected={createDateFromTimeString(schedule.close)}
                    onChange={(date) => {
                      const updatedSchedules = [...schedules];
                      const hours = date.getHours().toString().padStart(2, "0");
                      const minutes = date
                        .getMinutes()
                        .toString()
                        .padStart(2, "0");
                      updatedSchedules[index].close = `${hours}:${minutes}`;
                      setSchedules(updatedSchedules);
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={1}
                    timeCaption="Hora"
                    dateFormat="HH:mm"
                    placeholderText="Selecciona una hora"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Switch
                    onChange={() => {
                      const updatedSchedules = [...schedules];
                      updatedSchedules[index].forced = !schedule.forced;
                      setSchedules(updatedSchedules);
                    }}
                    value={schedule.forced}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={handleSave}
          className=" group relative mt-4 h-12 w-48 overflow-hidden rounded-2xl bg-slate-600 text-lg font-bold text-white"
        >
          Guardar datos
          <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
        </button>
      </div>
    </div>
  );
}

export default SchedulesPage;
