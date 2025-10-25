import { useEffect, useRef, useState } from "react";
import axios from "axios";

const APIKEY = "3QNgBIistUK89oUGY1lNYt04p9MKpber7zrVGoXSvQgS1LZw6e";
// ISO language code for georgian language
const LANGUAGE = "ka";

// todo add image detenction to crop leaves from the whole picture
// // todo add lantitude, langtitude
// // todo add in post ka for language

export default function PlantScanner() {
  // const imgRef = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [imageBase64, setImageBase64] = useState("");
  const [result, setResult] = useState({});

  useEffect(() => {
    if (navigator.geolocation) {
      // Geolocation is available
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success callback: permission granted, position received
          console.log("Latitude:", position.coords.latitude);
          console.log("Longitude:", position.coords.longitude);

          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          // Error callback: permission denied or other error
          console.error("Error getting location:", error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } // Options
      );
    } else {
      console.log("Can't access location");
    }
  }, []);

  const handleImageChange = (event) => {
    // setSelectedImage(event.target.files[0]);
    const file = event.target.files[0];
    if (!file) return;
    console.log(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result); // reader.result includes the "data:image/jpeg;base64,..." prefix
    };
    reader.readAsDataURL(file);

    setSelectedImage(URL.createObjectURL(file));
  };

  const scanImage = async () => {
    if (!selectedImage) {
      console.log("Please provide a base64 image string");
      return;
    }

    console.log(selectedImage);

    // https://plant.id/api/v3/usage_info

    // default values are in Zugdidi
    // todo could it be null??
    const body = {
      images: [imageBase64],
      latitude: location.latitude || 42.5,
      longitude: location.longitude || 41.86,
      similar_images: true,
    };

    // set language to "ka"
    console.log(body);
    axios
      .post(
        `https://plant.id/api/v3/health_assessment?language=${LANGUAGE}`,
        body,
        {
          headers: { "Api-Key": APIKEY, "Content-Type": "application/json" },
        }
      )
      .then((data) => {
        console.log(data);
        setResult(data.data.result);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <h2 className="text-green-700 font-semibold mb-2">მცენარის სკანერი</h2>
      <p className="text-sm text-gray-700 mb-3">
        გადაიღეთ ფოტოსურათი და მიიღეთ დიაგნოზი.
      </p>
      <img src={selectedImage} />
      <button
        className="bg-green-600 text-white rounded-xl py-2 w-full hover:bg-green-700"
        onClick={scanImage}
      >
        📸 ფოტოს დასკანვა
      </button>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        placeholder="ფოტო"
      />
      <p>{imageBase64}</p>

      {console.log(result)}
      {Object.keys(result).length != 0 && (
        <>
          {!result.is_plant.binary ? (
            <>
              <p>ეს ფოტო არ შეიცავს მცენარეს</p>
            </>
          ) : (
            <p>sheicavs</p>
          )}

          {result.is_healthy.binary ? (
            <>
              <p>მცენარე ჯანმრთელია</p>
              <>
                {result.disease.suggestions.map((r) => (
                  <>
                    <p>{r.name}</p>
                    <p>{r.probability}</p>
                    <img src={r.similar_images[0].url} />
                  </>
                ))}
              </>
            </>
          ) : (
            <>
              {result.disease.suggestions.map((r) => (
                <div key={r.id}>
                  <p>{r.name}</p>
                  <img src={r.similar_images[0].url} />
                  <img src={r.similar_images[0].url_small} />
                </div>
              ))}
            </>
          )}
          {/* {!result.is_plant.binary ? (
            <>
              <p>ეს ფოტო არ შეიცავს მცენარეს</p>
            </>
          ) : result.is_healthy.binary ? (
            <p>მცენარე ჯანმრთელია</p>
          ) : (
            <>
              {result.disease.suggestions.map((r) => (
                <>
                  <p>{r.name}</p>
                  <img src={r.similar_images[0].url} />
                </>
              ))}
            </>
          )} */}
        </>
      )}
    </div>
  );
}
