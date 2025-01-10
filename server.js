const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { execFile } = require("child_process");
const fs = require("fs"); // Dodajemy fs do obsługi systemu plików

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

  // Wyciąganie numeru z nazwy pliku
  const match = fileName.match(/(\d+)\.cbr$/); // Wyszukuje liczbę przed rozszerzeniem .cbr
  if (!match) {
    return res.status(400).send("File name doesn't contain a valid number.");
  }
  const dirNumber = match[1]; // Numer wyciągnięty z nazwy pliku

  // Tworzenie katalogu z numerem
  const outputDir = path.join(__dirname, "extracted", dirNumber);

  // Sprawdzamy, czy katalog istnieje, jeśli nie, to go tworzymy
  fs.mkdir(outputDir, { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating directory:", err);
      return res.status(500).send("Error creating directory");
    }

    // Uruchamianie komendy 7z
    execFile(
      "7z",
      ["x", "-y", filePath, "-o" + outputDir],
      (err, stdout, stderr) => {
        if (err) {
          console.error("Error during extraction:", err);
          console.error("stderr:", stderr);
          return res.status(500).send("Error extracting file");
        }
        console.log("Extraction output:", stdout);

        // Dodanie kodu do sprawdzania plików w folderze 'extracted'
        fs.readdir(outputDir, (err, files) => {
          if (err) {
            console.error("Error reading extracted directory:", err);
            return res.status(500).send("Error reading extracted files");
          } else {
            console.log("Extracted files:", files); // Wyświetlanie listy plików w katalogu
          }
        });

        res.send("File extracted successfully");
      }
    );
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
