import { useEffect, useState } from "react";
import { useData } from "../context/DataProvider";

// todo could show weather by hour (or the whole month, as it will affect the crops more)

export default function WeatherCard() {
  const { weather, tomorrow } = useData();

  if (!location)
    return (
      <div className="bg-yellow-50 rounded-2xl p-6 text-gray-700 shadow-lg max-w-sm mx-auto">
        <p>📍 მდებარეობა არაა მითითებული</p>
      </div>
    );

  if (!weather)
    return (
      <div className="bg-gray-100 rounded-2xl p-6 text-gray-700 shadow-lg max-w-sm mx-auto">
        <p>იტვირთება ამინდის ინფორმაცია...</p>
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-6 text-gray-800 shadow-lg max-w-md mx-auto">
      {/* ========== CURRENT WEATHER ========== */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-green-700">
          ამინდის პროგნოზი
        </h3>
        <span className="text-sm text-gray-500">{weather.last_updated}</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <img
          src={"https:" + weather.condition.icon}
          alt={weather.condition.text}
          className="w-16 h-16"
        />
        <div>
          <p className="text-3xl font-bold text-gray-900">{weather.temp_c}°C</p>
          {/* todo translate */}
          {/* <p className="text-gray-600">{weather.condition.text}</p> */}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <Info label="გრძნობა როგორც:" value={`${weather.feelslike_c}°C`} />
        <Info label="ტენიანობა:" value={`${weather.humidity}%`} />
        <Info
          label="ქარი:"
          value={`${weather.wind_kph} კმ/ს (${weather.wind_dir})`}
        />
        <Info label="წნევა:" value={`${weather.pressure_mb} მბ`} />
        <Info label="ხილვადობა:" value={`${weather.vis_km} კმ`} />
        <Info label="ღრუბლიანობა:" value={`${weather.cloud}%`} />
        <Info label="ნალექი:" value={`${weather.precip_mm} მმ`} />
        <Info label="ულტრაიისფერი:" value={weather.uv} />
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        💨 ქარის სიჩქარე: {weather.gust_kph} კმ/ს · 🌡 წვიმის წნევა:{" "}
        {weather.dewpoint_c}°C
      </div>

      {/* ========== TOMORROW'S FORECAST ========== */}
      {tomorrow && (
        <div className="mt-6 border-t border-green-200 pt-4">
          <h4 className="text-md font-semibold text-green-700 mb-3">
            ხვალინდელი ამინდი ({tomorrow.date})
          </h4>
          <div className="flex items-center gap-3 mb-3">
            <img
              src={"https:" + tomorrow.day.condition.icon}
              alt={tomorrow.day.condition.text}
              className="w-14 h-14"
            />
            <div>
              {/* todo translate */}

              {/* <p className="text-gray-700 font-medium">
                {tomorrow.day.condition.text}
              </p> */}
              <p className="text-lg font-bold text-gray-900">
                🌡 {tomorrow.day.maxtemp_c}° / {tomorrow.day.mintemp_c}°C
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info
              label="საშ. ტენიანობა:"
              value={`${tomorrow.day.avghumidity}%`}
            />
            <Info label="ულტრაიისფერი:" value={tomorrow.day.uv} />
            <Info
              label="საშ. წნევა:"
              value={`${tomorrow.hour[12].pressure_mb} მბ`}
            />
            <Info
              label="საშ. ნალექი:"
              value={`${tomorrow.day.daily_chance_of_rain}%`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// small helper component for info rows
function Info({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="font-medium text-gray-700">{label}</span>
      <span>{value}</span>
    </div>
  );
}
