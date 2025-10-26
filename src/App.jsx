import NotificationsPanel from "./components/NotificationsPanel";
import ChatSection from "./components/ChatSection";
import MyLand from "./components/MyLand";
import PlantScanner from "./components/PlantScanner";
import WeatherCard from "./components/WeatherCard";
import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import DataProvider from "./context/DataProvider";
import { Link } from "react-router-dom";

// todo change 🌿to txili

export default function App() {
  const location = useLocation();

  return (
    <DataProvider>
      <div
        className={
          "min-h-screen bg-green-50 p-6 space-y-6 F flex flex-col items-center justify-center"
        }
      >
        {/* <h1 className="text-2xl font-bold text-green-700">Plantora 🌿</h1> */}

        {/* todo add margin or padding bottom */}
        {location.pathname !== "/" && (
          <Link to="/" className="text-2xl font-bold text-green-700">
            Plantora 🌿
          </Link>
        )}

        <Routes path="/">
          <Route>
            <Route
              path=""
              element={
                <>
                  <Dashboard />
                </>
              }
            />
            <Route path="weather" element={<WeatherCard />} />
            <Route path="notifications" element={<NotificationsPanel />} />
            <Route path="scanner" element={<PlantScanner />} />
            <Route path="land" element={<MyLand />} />
            <Route path="chat" element={<ChatSection />} />
            {/* todo redirect */}
            <Route
              path="*"
              element={<p className="invalid">Redirecting...</p>}
            />
          </Route>
        </Routes>
      </div>
    </DataProvider>
  );
}
