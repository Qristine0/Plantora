// def predict_yield(numTrees, nutsPerTree, nutWeight, treeHealth,
//                   moisture, pH, avg_temp, total_rain,
//                   infestation_percent, N=1.0):

//     soilF = soil_factor(moisture, pH, N)
//     weatherF = weather_factor(avg_temp, total_rain)
//     pestF = pest_factor(infestation_percent)

//     yield_kg = (numTrees * nutsPerTree * nutWeight * treeHealth *
//                 soilF * weatherF * pestF) / 1000
//     return yield_kg

// # Example usage
// predicted_yield = predict_yield(
//     numTrees=200,
//     nutsPerTree=500,
//     nutWeight=5,
//     treeHealth=0.9,
//     moisture=50,
//     pH=6.5,
//     avg_temp=22,
//     total_rain=300,
//     infestation_percent=5
// )

// print(f"Predicted yield: {predicted_yield:.2f} kg")

// Yield (kg) = (numTrees × nutsPerTree × nutWeight × treeHealth × soilFactor × weatherFactor × pestFactor) / 1000

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
