import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Timetable {
  [day: string]: {
    [time: string]: {
      room: string | null;
      course: string | null;
      teacher: string | null;
    }[];
  };
}

const TimetablePage: React.FC = () => {
  const [timetable, setTimetable] = useState<Timetable | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  // Fetch timetable data
  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/users/${id}/timetable`
      );
      setTimetable(response.data.timetable);
    } catch (error) {
      console.error("Error fetching timetable:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Timetable</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Time</th>
              {timetable &&
                Object.keys(timetable).map((day) => (
                  <th key={day} className="border border-gray-300 px-4 py-2">
                    {day}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {["7:00 - 9:00", "9:00 - 11:00", "1:00 - 3:00", "3:00 - 5:00"].map(
              (time) => (
                <tr key={time}>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    {time}
                  </td>
                  {timetable &&
                    Object.keys(timetable).map((day) => (
                      <td
                        key={`${day}-${time}`}
                        className="border border-gray-300 px-4 py-2 bg-teal-100"
                      >
                        {timetable[day][time]?.map((entry, index) => (
                          <div key={index} className="mb-2">
                            <div className="font-bold">{entry.room}</div>
                            <div>{entry.course}</div>
                            <div className="text-sm text-gray-600">
                              {entry.teacher}
                            </div>
                          </div>
                        )) || <span>Unassigned</span>}
                      </td>
                    ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimetablePage;
