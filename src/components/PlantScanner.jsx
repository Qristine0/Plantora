import { useState } from "react";
import axios from "axios";
import { useData } from "../context/DataProvider";

const APIKEY = "3QNgBIistUK89oUGY1lNYt04p9MKpber7zrVGoXSvQgS1LZw6e";
const LANGUAGE = "ka"; // Georgian language ISO code

// todo - make the translation dynamic (now it's hardcoded for demonstration purpose)
const TRANSLATIONS = {
  "Do you see visible insects, webbing, holes, or honeydew on or around the plant?":
    "ხედავთ თუ არა მცენარეზე ან მის გარშემო ხილულ მწერებს, ბადისებრ ნაკვერჩხლებს, ნახვრეტებს ან თაფლის ნამს?",
  Fungi: "სოკოვანი დაავადება",
  "feeding damage by insects": "მწერების მიერ კვების დაზიანება",
};

export default function PlantScanner() {
  const [selectedImage, setSelectedImage] = useState(null);
  const { location } = useData();
  const [imageBase64, setImageBase64] = useState("");
  const [result, setResult] = useState({});
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [finalSuggestion, setFinalSuggestion] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImageBase64(reader.result);
    reader.readAsDataURL(file);

    setSelectedImage(URL.createObjectURL(file));
  };

  const scanImage = async () => {
    if (!imageBase64) {
      console.log("Please provide a base64 image string");
      return;
    }
    setQuestion(null);
    setFinalSuggestion(null);

    // todo add null checking instead of defaults
    const body = {
      images: [imageBase64],
      latitude: location?.latitude || 42.5,
      longitude: location?.longitude || 41.86,
      similar_images: true,
    };

    try {
      const { data } = await axios.post(
        `https://plant.id/api/v3/health_assessment?language=${LANGUAGE}`,
        body,
        {
          headers: { "Api-Key": APIKEY, "Content-Type": "application/json" },
        }
      );

      const res = data.result;
      setResult(res);

      if (res?.disease?.question) {
        setQuestion(res.disease.question);
      } else {
        setFinalSuggestion(res.disease?.suggestions?.[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswer = (answer) => {
    setUserAnswer(answer);
    const suggestionIndex = question.options[answer].suggestion_index;
    const selected = result.disease.suggestions[suggestionIndex];
    setFinalSuggestion(selected);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md w-full max-w-md mx-auto">
      <h2 className="text-green-700 font-semibold mb-2 text-lg">
        მცენარის სკანერი
      </h2>
      <p className="text-sm text-gray-700 mb-3">
        გადაიღეთ ფოტოსურათი და მიიღეთ დიაგნოზი 🌿
      </p>

      {/* Image Preview Box */}
      <div
        className="relative w-full aspect-[3/4] border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden flex items-center justify-center bg-gray-50 shadow-sm mb-3"
        style={{ maxHeight: "50vh" }}
      >
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Uploaded plant"
            className="object-cover w-full h-full rounded-2xl"
            style={{ maxHeight: "50vh" }}
          />
        ) : (
          <div className="text-gray-400 text-sm text-center p-4">
            📷 ჯერ არ არის არჩეული სურათი
            <br />
            აირჩიეთ ფაილი ქვემოთ 👇
          </div>
        )}
      </div>

      {/* Styled Input */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <label
          htmlFor="fileInput"
          className="cursor-pointer bg-blue-600 text-white px-5 py-2 rounded-xl font-medium shadow hover:bg-blue-700 active:scale-95 transition text-center"
        >
          აირჩიეთ სურათი
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          onClick={scanImage}
          disabled={!imageBase64}
          className={`w-full sm:w-auto px-5 py-2 rounded-xl font-medium shadow transition ${
            imageBase64
              ? "bg-green-600 text-white hover:bg-green-700 active:scale-95"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          📸 ფოტოს დასკანვა
        </button>
      </div>

      {/* Display result */}
      {Object.keys(result).length !== 0 && (
        <div className="mt-5">
          {!result.is_plant?.binary ? (
            <p>ეს ფოტო არ შეიცავს მცენარეს</p>
          ) : result.is_healthy?.binary ? (
            <p>მცენარე ჯანმრთელია 🌿</p>
          ) : question && !userAnswer ? (
            <div className="mt-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
              <p className="font-semibold mb-2">
                {question.translation ||
                  TRANSLATIONS[question.text] ||
                  question.text}
              </p>
              <div className="flex justify-around">
                <button
                  onClick={() => handleAnswer("yes")}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  დიახ
                </button>
                <button
                  onClick={() => handleAnswer("no")}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  არა
                </button>
              </div>
            </div>
          ) : finalSuggestion ? (
            <div className="mt-4">
              <h3 className="font-semibold text-lg text-green-700">
                დიაგნოზი:{" "}
                {TRANSLATIONS[finalSuggestion.name] || finalSuggestion.name}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {finalSuggestion.similar_images?.map((img, i) => (
                  <img
                    key={i}
                    src={img.url_small || img.url}
                    alt={finalSuggestion.name}
                    className="w-28 h-28 object-cover rounded-lg shadow-sm"
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// export default function PlantScanner() {
//   // const imgRef = useRef();
//   const [selectedImage, setSelectedImage] = useState(null);
//   const { location, setLocation } = useData();
//   const [imageBase64, setImageBase64] = useState("");
//   const [result, setResult] = useState({});

//   const handleImageChange = (event) => {
//     // setSelectedImage(event.target.files[0]);
//     const file = event.target.files[0];
//     if (!file) return;
//     console.log(file);

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImageBase64(reader.result); // reader.result includes the "data:image/jpeg;base64,..." prefix
//     };
//     reader.readAsDataURL(file);

//     setSelectedImage(URL.createObjectURL(file));
//   };

//   const scanImage = async () => {
//     if (!selectedImage) {
//       console.log("Please provide a base64 image string");
//       return;
//     }

//     console.log(selectedImage);

//     // https://plant.id/api/v3/usage_info

//     // default values are in Zugdidi
//     const body = {
//       images: [imageBase64],
//       latitude: location.latitude || 42.5,
//       longitude: location.longitude || 41.86,
//       // language: LANGUAGE,
//       similar_images: true,
//     };

//     // set language to "ka"
//     console.log(body);
//     axios
//       .post(
//         `https://plant.id/api/v3/health_assessment?language=${LANGUAGE}`,
//         body,
//         {
//           headers: { "Api-Key": APIKEY, "Content-Type": "application/json" },
//         }
//       )
//       .then((data) => {
//         console.log(data);
//         setResult(data.data.result);
//       })
//       .catch((err) => console.log(err));
//   };

//   return (
//     <div className="bg-white rounded-2xl p-4 shadow-md">
//       <h2 className="text-green-700 font-semibold mb-2">მცენარის სკანერი</h2>
//       <p className="text-sm text-gray-700 mb-3">
//         გადაიღეთ ფოტოსურათი და მიიღეთ დიაგნოზი.
//       </p>
//       <img src={selectedImage} />
//       <button
//         className="bg-green-600 text-white rounded-xl py-2 w-full hover:bg-green-700"
//         onClick={scanImage}
//       >
//         📸 ფოტოს დასკანვა
//       </button>
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleImageChange}
//         placeholder="ფოტო"
//       />
//       <p>{imageBase64}</p>

//       {console.log(result)}
//       {Object.keys(result).length != 0 && (
//         <>
//           {!result.is_plant.binary ? (
//             <>
//               <p>ეს ფოტო არ შეიცავს მცენარეს</p>
//             </>
//           ) : (
//             <p>sheicavs</p>
//           )}

//           {result.is_healthy.binary ? (
//             <>
//               <p>მცენარე ჯანმრთელია</p>
//               <>
//                 {result.disease.suggestions.map((r) => (
//                   <>
//                     <p>{r.name}</p>
//                     <p>{r.probability}</p>
//                     <img src={r.similar_images[0].url} />
//                   </>
//                 ))}
//               </>
//             </>
//           ) : (
//             <>
//               {result.disease.suggestions.map((r) => (
//                 <div key={r.id}>
//                   <p>{r.name}</p>
//                   <img src={r.similar_images[0].url} />
//                   <img src={r.similar_images[0].url_small} />
//                 </div>
//               ))}
//             </>
//           )}
//           {/* {!result.is_plant.binary ? (
//             <>
//               <p>ეს ფოტო არ შეიცავს მცენარეს</p>
//             </>
//           ) : result.is_healthy.binary ? (
//             <p>მცენარე ჯანმრთელია</p>
//           ) : (
//             <>
//               {result.disease.suggestions.map((r) => (
//                 <>
//                   <p>{r.name}</p>
//                   <img src={r.similar_images[0].url} />
//                 </>
//               ))}
//             </>
//           )} */}
//         </>
//       )}
//     </div>
//   );
// }
