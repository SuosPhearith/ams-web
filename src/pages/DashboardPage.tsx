import { useEffect, useState } from "react";
import { GrSchedules } from "react-icons/gr";
import { LuBookType } from "react-icons/lu";
import { RiBuilding4Line, RiContactsBook3Line } from "react-icons/ri";
import { SiGoogleclassroom } from "react-icons/si";
import { TbUsers } from "react-icons/tb";

interface DashboardData {
  users_count: number;
  courses_count: number;
  buildings_count: number;
  rooms_count: number;
  submits_count: number;
  schedules_count: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/dashboard") // Adjust the API endpoint accordingly
      .then((response) => response.json())
      .then((data: DashboardData) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (!data) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className=" from-gray-100 to-gray-300 p-10 flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <div
          className="bg-white p-8 rounded-2xl border-[1px] border-black text-center flex flex-col justify-center items-center"
        >
          <div><TbUsers size={60} className="mb-2"/></div>
          <h2 className="text-2xl font-semibold capitalize text-gray-700">Users</h2>
          <p className="text-4xl font-bold mt-3 text-blue-600">{data.users_count}</p>
        </div>
        <div
          className="bg-white p-8 rounded-2xl border-[1px] border-black text-center flex flex-col justify-center items-center"
        >
          <div><GrSchedules size={60} className="mb-2"/></div>
          <h2 className="text-2xl font-semibold capitalize text-gray-700">Schedules</h2>
          <p className="text-4xl font-bold mt-3 text-blue-600">{data.schedules_count}</p>
        </div>
        <div
          className="bg-white p-8 rounded-2xl border-[1px] border-black text-center flex flex-col justify-center items-center"
        >
          <div><RiBuilding4Line size={60} className="mb-2"/></div>
          <h2 className="text-2xl font-semibold capitalize text-gray-700">Buildings</h2>
          <p className="text-4xl font-bold mt-3 text-blue-600">{data.buildings_count}</p>
        </div>
        <div
          className="bg-white p-8 rounded-2xl border-[1px] border-black text-center flex flex-col justify-center items-center"
        >
          <div><LuBookType size={60} className="mb-2"/></div>
          <h2 className="text-2xl font-semibold capitalize text-gray-700">Courses</h2>
          <p className="text-4xl font-bold mt-3 text-blue-600">{data.courses_count}</p>
        </div>
        <div
          className="bg-white p-8 rounded-2xl border-[1px] border-black text-center flex flex-col justify-center items-center"
        >
          <div><SiGoogleclassroom size={60} className="mb-2"/></div>
          <h2 className="text-2xl font-semibold capitalize text-gray-700">Room</h2>
          <p className="text-4xl font-bold mt-3 text-blue-600">{data.rooms_count}</p>
        </div>
        <div
          className="bg-white p-8 rounded-2xl border-[1px] border-black text-center flex flex-col justify-center items-center"
        >
          <div><RiContactsBook3Line size={60} className="mb-2"/></div>
          <h2 className="text-2xl font-semibold capitalize text-gray-700">Submite</h2>
          <p className="text-4xl font-bold mt-3 text-blue-600">{data.submits_count}</p>
        </div>
      </div>
    </div>
  );
}
