import * as tf from "@tensorflow/tfjs";

export async function trainAndPredict(X, y, input) {
  // Ensure all numbers, no strings sneak in
  const numericX = X.map((row) => row.map(Number));
  const numericY = y.map((row) => row.map(Number));
  const numericInput = input.map(Number);

  console.log(numericX);
  console.log(numericY);
  console.log(numericInput);

  const xs = tf.tensor2d(numericX);
  const ys = tf.tensor2d(numericY);

  // Neural network: nonlinear regression
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 8, inputShape: [5], activation: "relu" }));
  model.add(tf.layers.dense({ units: 4, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({ optimizer: "adam", loss: "meanSquaredError" });

  await model.fit(xs, ys, { epochs: 200, verbose: 0 });

  const inputTensor = tf.tensor2d([numericInput]);
  const prediction = model.predict(inputTensor);
  const result = (await prediction.data())[0];

  tf.dispose([xs, ys, inputTensor, prediction]);
  return result;
}
