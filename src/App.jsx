import NotificationsPanel from "./components/NotificationsPanel";
import ChatSection from "./components/ChatSection";
import MyLand from "./components/MyLand";
import PlantScanner from "./components/PlantScanner";
import WeatherCard from "./components/WeatherCard";
import { Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";

export default function App() {
  return (
    <div className="min-h-screen bg-green-50 p-6 space-y-6">
      <h1 className="text-2xl font-bold text-green-700">Plantora 🌿</h1>
      <WeatherCard />
      <NotificationsPanel />
      <PlantScanner />
      <MyLand />
      <ChatSection />

      {/* <Routes path="/">
        <Route>
          <Route path="" element={<MainPage />} />
          <Route path="notifications" element={<NotificationsPanel />} />
          <Route path="scanner" element={<PlantScanner />} />
          <Route path="land" element={<MyLand />} />
          <Route path="chat" element={<ChatSection />} />
          <Route path="*" element={<p className="invalid">Redirecting...</p>} />
        </Route>
      </Routes> */}
    </div>
  );
}
