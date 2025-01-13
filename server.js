const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { execFile } = require("child_process");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

// Umożliwia dostęp z innych domen
app.use(cors());

// Serwowanie plików statycznych z folderu extracted
app.use("/extracted", express.static(path.join(__dirname, "extracted")));

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  console.log("File received:", req.file);
  const filePath = req.file.path;
  const fileName = req.file.originalname;

  // Wyciąganie numeru z nazwy pliku (np. 65 z "65.cbr")
  const match = fileName.match(/(\d+)\.cbr$/);
  if (!match) {
    return res.status(400).send("File name doesn't contain a valid number.");
  }
  const dirNumber = match[1]; // Numer wyciągnięty z nazwy pliku

  // Tworzenie katalogu z numerem (bez podkatalogu)
  const outputDir = path.join(__dirname, "extracted", dirNumber);

  // Sprawdzamy, czy katalog istnieje, jeśli nie, to go tworzymy
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Uruchamianie komendy 7z, wypakowywanie plików do katalogu docelowego
  execFile(
    "7z",
    ["x", "-y", filePath, `-o${outputDir}`], // Rozpakowanie do katalogu o numerze
    (err, stdout, stderr) => {
      if (err) {
        console.error("Error during extraction:", err);
        console.error("stderr:", stderr);
        return res.status(500).send("Error extracting file");
      }

      console.log("Extraction output:", stdout);

      // Zwracanie listy plików w katalogu
      fs.readdir(outputDir, (err, files) => {
        if (err) {
          console.error("Error reading extracted directory:", err);
          return res.status(500).send("Error reading extracted files");
        } else {
          // Filtrujemy tylko pliki graficzne
          const imageFiles = files.filter((file) =>
            /\.(jpg|jpeg|png)$/i.test(file)
          );
          const imageUrls = imageFiles.map(
            (file) => `/extracted/${dirNumber}/${file}`
          );
          res.json(imageUrls); // Zwracamy listę plików
        }
      });
    }
  );
});

app.get("/extracted/:dirNumber", (req, res) => {
  const dirNumber = req.params.dirNumber;
  const outputDir = path.join(__dirname, "extracted", dirNumber);

  fs.readdir(outputDir, (err, files) => {
    if (err) {
      return res.status(500).send("Error reading extracted directory");
    }

    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png)$/i.test(file));
    const imageUrls = imageFiles.map(
      (file) => `/extracted/${dirNumber}/${file}`
    );
    res.json(imageUrls); // Zwracamy URL-e obrazów
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
