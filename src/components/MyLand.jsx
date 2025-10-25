export default function MyLand() {
  return (
    <div className="bg-green-50 rounded-2xl p-4 shadow-md">
      <h2 className="text-green-700 font-semibold mb-2">ჩემი ბაღი</h2>
      <p className="text-sm text-gray-700">წინა მოსავალი: 450კგ</p>
      <p className="text-sm text-gray-700">პროგნოზი: 520კგ (+15%)</p>
      <button className="mt-2 w-full bg-green-600 text-white rounded-xl py-2 hover:bg-green-700">
        მონაცემების დამატება
      </button>
    </div>
  );
}
