// ჰექტარი
// ნერგი
// თხილი...
// სიტუაცია (სელექთ)
// წინა წლის მოსავალი

import { useEffect, useState } from "react";
import { useData } from "../context/DataProvider";
import { trainAndPredict } from "../utils/regression";

export default function MyLand() {
  const { farmerInfo, setFarmerInfo, prediction, setPrediction, location } =
    useData();

  const [formData, setFormData] = useState({
    area: "",
    quantity: "",
    type: "",
    quality: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // update farmer info

    setFarmerInfo((prev) => ({
      ...prev,
      area: formData.area || prev.area,
      quantity: formData.quantity || prev.quantity,
      type: formData.type || prev.type,
      quality: formData.quality || prev.quality,
      lastYear: formData.lastYear || prev.lastYear,
    }));
  };

  useEffect(() => {
    async function computePrediction() {
      if (
        farmerInfo.area &&
        farmerInfo.quantity &&
        farmerInfo.type &&
        farmerInfo.quality &&
        farmerInfo.lastYear &&
        location.latitude &&
        location.longitude
      ) {
        const qualityScore =
          farmerInfo.quality === "კარგი"
            ? 3
            : farmerInfo.quality === "საშუალო"
            ? 2
            : 1;

        const year = new Date().getFullYear() - 1;
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        // Fetch daily mean temperatures for the full year
        const res = await fetch(
          `https://archive-api.open-meteo.com/v1/archive?latitude=${location.latitude}&longitude=${location.longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean&timezone=auto`
        );
        const data = await res.json();
        console.log(data);

        if (!data.daily || !data.daily.temperature_2m_mean) {
          console.warn("No temperature data returned from API");
          return null;
        }

        // Use the daily mean temperatures
        const temps = data.daily.temperature_2m_mean;
        const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;

        console.log("Average temperature for past year:", avgTemp);

        const X = [
          [1.0, 200, 3, 24, 480],
          [0.8, 180, 2, 21, 400],
          [1.2, 250, 3, 26, 620],
          [0.5, 100, 1, 20, 250],
          [1.0, 230, 3, 27, 580],
          [0.9, 190, 2, 23, 420],
        ];

        // Corresponding yields
        const y = [[500], [400], [620], [250], [580], [420]];

        // Prepare the input for prediction (also include lastYear)
        const predictedYield = await trainAndPredict(X, y, [
          farmerInfo.area,
          farmerInfo.quantity,
          qualityScore,
          avgTemp,
          farmerInfo.lastYear,
        ]);

        // todo
        console.log(predictedYield);

        setPrediction(
          `${Math.max(
            (
              Number(farmerInfo.lastYear) +
              Number(farmerInfo.lastYear) * 0.1 * (qualityScore - 1.8)
            ).toFixed(2),
            predictedYield.toFixed(2)
          )} კგ მოსავალია მოსალოდნელი`
        );
      } else {
        setPrediction(null);
      }
    }

    computePrediction();
  }, [farmerInfo, location]);

  return (
    <div className="bg-green-50 rounded-2xl p-4 shadow-md">
      <h2 className="text-green-700 font-semibold mb-4 text-lg">ჩემი ბაღი</h2>

      <p className="text-sm text-gray-700 mb-2">
        {/* {farmerInfo.lastYear ? `${farmerInfo.lastYear} კგ` : "ცარიელი"} */}
      </p>

      <div className="space-y-3 mb-4">
        <div>
          <label className="text-sm text-green-800 block">ფართობი (ჰა)</label>
          <input
            type="number"
            min="0"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="w-full border rounded-md p-2 text-sm"
            placeholder={
              farmerInfo.area ? `${farmerInfo.area} ჰა` : "მაგ: 150 ჰა"
            }
          />
        </div>

        <div>
          <label className="text-sm text-green-800 block">
            ნერგების რაოდენობა
          </label>
          <input
            type="integer"
            min="0"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border rounded-md p-2 text-sm"
            placeholder={
              farmerInfo.quantity
                ? `${farmerInfo.quantity} ცალი ნერგი`
                : "მაგ: 1200 ნერგი"
            }
          />
        </div>

        <div>
          <label className="text-sm text-green-800 block">
            წინა წლის მოსავალი (კგ)
          </label>
          <input
            type="number"
            min="0"
            name="lastYear"
            value={formData.lastYear}
            onChange={handleChange}
            className="w-full border rounded-md p-2 text-sm"
            placeholder={
              farmerInfo.lastYear ? `${farmerInfo.lastYear} კგ` : "მაგ: 150 კგ"
            }
          />
        </div>

        <div>
          <label className="text-sm text-green-800 block">ტიპი</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border rounded-md p-2 text-sm"
          >
            <option value="">აირჩიეთ ტიპი</option>
            <option value="თხილი">თხილი</option>
            <option value="მოცვი">მოცვი</option>
            <option value="ვაშლი">ვაშლი</option>
            <option value="ატამი">ატამი</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-green-800 block">ხარისხი</label>
          <select
            name="quality"
            value={formData.quality}
            onChange={handleChange}
            className="w-full border rounded-md p-2 text-sm"
          >
            <option value="">აირჩიეთ ხარისხი</option>
            <option value="კარგი">კარგი</option>
            <option value="საშუალო">საშუალო</option>
            <option value="ცუდი">ცუდი</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-2">
        {Object.keys(farmerInfo).length < 4
          ? "საკმარისი ინფორმაცია არ მოიპოვება"
          : !prediction
          ? "პროგნოზი გამოთვლის პროცესშია..."
          : `პროგნოზი: ${prediction}`}
      </p>

      <button
        className="mt-2 w-full bg-green-600 text-white rounded-xl py-2 hover:bg-green-700"
        onClick={handleSubmit}
      >
        მონაცემების დამატება
      </button>
    </div>
  );
}
