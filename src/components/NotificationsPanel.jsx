import React from "react";

export default function NotificationsPanel() {
  const notifications = [
    "დღეს იწვიმებს 🌧️",
    "ერთ კვირაში უნდა მორწყა 💧",
    "ზუგდიდის ტემპერატურა დღეს 17°C იქნება ☀️",
    "გაითვალისწინეთ მავნე მწერები 🐛",
  ];

  const shades = ["bg-green-200", "bg-green-300"];

  return (
    <div className="space-y-2 p-4 bg-green-100 rounded-lg m-10 border-1 border-green-900">
      {notifications.map((note, index) => (
        <p
          key={index}
          className={`text-green-900 m-2 p-3 rounded-lg ${
            shades[index % shades.length]
          }`}
        >
          {note}
        </p>
      ))}
    </div>
  );
}
