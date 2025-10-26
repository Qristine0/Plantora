import { Sun, Droplet, Leaf, Camera, Bell, MessageSquare } from "lucide-react";
import { useData } from "../context/DataProvider";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { weather } = useData();
  const Navigate = useNavigate();

  return (
    <div className="bg-green-800 text-white rounded-2xl p-6 shadow-md">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Plantora</h1>
        <Bell
          className="w-6 h-6 hover:cursor-pointer"
          onClick={() => Navigate("/notifications")}
        />
      </div>

      <div className="mt-6 grid gap-4">
        {/* ----------------- */}
        {weather ? (
          <div
            className="bg-green-700 rounded-lg p-4 flex items-center justify-between hover:cursor-pointer"
            onClick={() => Navigate("./weather")}
          >
            <div className="flex items-center gap-3">
              {/* <Sun className="w-8 h-8" /> */}
              <img
                src={"https:" + weather.condition.icon}
                alt={weather.condition.text}
                className="w-16 h-16"
              />
              <div>
                <div className="text-sm opacity-80">ამინდი</div>
                <div className="text-2xl font-bold">{weather.temp_c}°C</div>
              </div>
            </div>
            {/* <div className="text-sm">{weather.condition.text}</div> */}
          </div>
        ) : (
          <>
            <p>მდებარეობა არაა მითითებული</p>
          </>
        )}

        <div
          className="bg-green-700 rounded-lg p-4 flex items-center gap-3 hover:cursor-pointer"
          onClick={() => Navigate("./notifications")}
        >
          <Droplet className="w-7 h-7" />
          <div>
            <div className="text-sm opacity-80">მორწყვა</div>
            <div className="text-lg font-medium">2 დღეში</div>
          </div>
        </div>

        <div
          className="bg-green-700 rounded-lg p-4 flex items-center gap-3 hover:cursor-pointer"
          onClick={() => Navigate("./land")}
        >
          <Leaf className="w-7 h-7" />
          <div>
            <div className="text-sm opacity-80">მოსავალი</div>
            <div className="text-lg font-medium">შემდეგი პროგნოზი: +10%</div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <button
            className="bg-green-600/70 p-3 rounded-lg flex flex-col items-center gap-2 hover:cursor-pointer justify-center"
            onClick={() => Navigate("/scanner")}
          >
            <Camera className="w-5 h-5" />
            <Link></Link>
            <span className="text-xs">პლანტის სკანერი</span>
          </button>
          <button
            className="bg-green-600/70 p-3 rounded-lg flex flex-col items-center gap-2 hover:cursor-pointer justify-center"
            onClick={() => Navigate("/chat")}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">ჩატი</span>
          </button>
          <button
            className="bg-green-600/70 p-3 rounded-lg flex flex-col items-center gap-2 hover:cursor-pointer justify-center"
            onClick={() => Navigate("/weather")}
          >
            <Sun className="w-5 h-5" />
            <span className="text-xs">ამინდის დეტალები</span>
          </button>
        </div>
      </div>
    </div>
  );
}
