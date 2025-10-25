import { Sun, Droplet, Leaf, Camera, Bell, MessageSquare } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="bg-green-800 text-white rounded-2xl p-6 shadow-md">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Plantora</h1>
        <Bell className="w-6 h-6" />
      </div>

      <div className="mt-6 grid gap-4">
        <div className="bg-green-700 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sun className="w-8 h-8" />
            <div>
              <div className="text-sm opacity-80">ამინდი</div>
              <div className="text-2xl font-bold">22°</div>
            </div>
          </div>
          <div className="text-sm">ხვალ: წვიმა</div>
        </div>

        <div className="bg-green-700 rounded-lg p-4 flex items-center gap-3">
          <Droplet className="w-7 h-7" />
          <div>
            <div className="text-sm opacity-80">მორწყვა</div>
            <div className="text-lg font-medium">2 დღეში</div>
          </div>
        </div>

        <div className="bg-green-700 rounded-lg p-4 flex items-center gap-3">
          <Leaf className="w-7 h-7" />
          <div>
            <div className="text-sm opacity-80">მოსავალი</div>
            <div className="text-lg font-medium">შემდეგი პროგნოზი: +10%</div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <button className="bg-green-600/70 p-3 rounded-lg flex flex-col items-center gap-2">
            <Camera className="w-5 h-5" />
            <span className="text-xs">პლანტის სკანერი</span>
          </button>
          <button className="bg-green-600/70 p-3 rounded-lg flex flex-col items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">ჩატი</span>
          </button>
          <button className="bg-green-600/70 p-3 rounded-lg flex flex-col items-center gap-2">
            <Sun className="w-5 h-5" />
            <span className="text-xs">ამინდის დეტალები</span>
          </button>
        </div>
      </div>
    </div>
  );
}
