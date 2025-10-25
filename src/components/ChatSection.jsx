export default function ChatSection() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <h2 className="text-green-700 font-semibold mb-2">ჩათი</h2>
      <div className="bg-gray-50 p-2 h-40 rounded-lg overflow-y-auto">
        <p className="text-sm text-gray-600">
          👨‍🌾 ნინო: დღეს როგორ უნდა მოვრწყა?
        </p>
        <p className="text-sm text-gray-600">
          🌿 კახა: ორ ლიტრამდე საკმარისია.
        </p>
      </div>
      <input
        className="mt-2 w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-400"
        placeholder="მესიჯის დაწერა..."
      />
    </div>
  );
}
