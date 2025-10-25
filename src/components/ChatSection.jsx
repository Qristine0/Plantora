import React, { useState, useEffect } from "react";

// todo
// n8n or predefined questions with answers

// Minimal Georgian stopwords
const GEORGIAN_STOPWORDS = new Set([
  "და",
  "რომ",
  "თუ",
  "მე",
  "ის",
  "თქვენ",
  "ჩვენ",
  "ან",
  "მაგრამ",
  "არც",
  "არ",
]);

// Simple Georgian tokenizer
function tokenizeGeorgian(text) {
  return text
    .toLowerCase()
    .split(/\s+|[.,!?;:()«»„““”—–]/)
    .filter((w) => w && !GEORGIAN_STOPWORDS.has(w));
}

// Compute IDF values for documents
function computeIDFs(documents) {
  const totalDocs = Object.keys(documents).length;
  const wordDocCounts = {};
  for (const doc of Object.values(documents)) {
    const uniqueWords = new Set(doc);
    uniqueWords.forEach((w) => {
      wordDocCounts[w] = (wordDocCounts[w] || 0) + 1;
    });
  }
  const idfs = {};
  for (const [word, count] of Object.entries(wordDocCounts)) {
    idfs[word] = Math.log(totalDocs / count);
  }
  return idfs;
}

// Rank files by TF-IDF
function topFiles(query, files, idfs, n = 1) {
  const scores = {};
  for (const [filename, words] of Object.entries(files)) {
    let score = 0;
    query.forEach((word) => {
      const tf = words.filter((w) => w === word).length;
      if (idfs[word]) score += tf * idfs[word];
    });
    scores[filename] = score;
  }
  return Object.keys(scores)
    .sort((a, b) => scores[b] - scores[a])
    .slice(0, n);
}

// Rank sentences by IDF + query term density
function topSentences(query, sentences, idfs, n = 2) {
  const scores = sentences.map((sentence) => {
    const words = tokenizeGeorgian(sentence);
    let idfSum = 0;
    let queryCount = 0;
    words.forEach((w) => {
      if (query.has(w)) {
        idfSum += idfs[w] || 0;
        queryCount += 1;
      }
    });
    const density = queryCount / words.length;
    return { sentence, score: idfSum, density };
  });

  return scores
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.density - a.density;
    })
    .slice(0, n)
    .map((s) => s.sentence);
}

export default function ChatSection() {
  const [filesContent, setFilesContent] = useState({});
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const filesToLoad = [
    "nuts-conv.txt",
    "bio_txili.txt",
    "სამეცნიერო.txt",
    "მუხლი-1.-მიზანი-და-რეგულირების-სფერ.txt",
  ]; // Add more files here if needed

  // Load files from public/files/ on mount
  useEffect(() => {
    async function loadFiles() {
      const contentMap = {};
      for (const file of filesToLoad) {
        const res = await fetch(`/files/${file}`);
        const text = await res.text();
        contentMap[file] = text;
      }
      setFilesContent(contentMap);
    }
    loadFiles();
  }, []);

  const handleSearch = () => {
    if (Object.keys(filesContent).length === 0) return;

    // Preprocess files
    const fileWords = {};
    for (const [filename, content] of Object.entries(filesContent)) {
      fileWords[filename] = tokenizeGeorgian(content);
    }
    const idfs = computeIDFs(fileWords);

    const querySet = new Set(tokenizeGeorgian(query));
    const topFileNames = topFiles(querySet, fileWords, idfs, 1);

    // Extract sentences from top files
    let sentences = [];
    topFileNames.forEach((fname) => {
      const sents = filesContent[fname]
        .split(".")
        .map((s) => s.trim())
        .filter(Boolean);
      sentences = sentences.concat(sents);
    });

    console.log(sentences);
    const topSents = topSentences(querySet, sentences, idfs, 2);
    setResults(topSents);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Georgian Chat Corpus Search</h1>

      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="შეიყვანეთ თქვენი კითხვა..."
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <button
          onClick={handleSearch}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Search
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">შედეგები:</h2>
          <ul className="list-disc pl-5">
            {results.map((res, idx) => (
              <li key={idx} className="bg-white p-2 rounded shadow">
                {res}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
