export default function PlantScanner() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <h2 className="text-green-700 font-semibold mb-2">მცენარის სკანერი</h2>
      <p className="text-sm text-gray-700 mb-3">
        გადაიღეთ ფოტოსურათი და მიიღეთ დიაგნოზი.
      </p>
      <button className="bg-green-600 text-white rounded-xl py-2 w-full hover:bg-green-700">
        📸 ფოტოს გადაღება
      </button>
    </div>
  );
}
