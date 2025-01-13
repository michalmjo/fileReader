import { Component, OnInit } from '@angular/core';
import { FileHandlerService } from '../service/file-handler.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  selectedFile: File | null = null;
  images: string[] = []; // Tablica z URL obrazów do wyświetlenia
  extractedFiles: string[] = []; // Tablica plików z rozpakowanych zdjęć
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private fileHandlerService: FileHandlerService) {}

  ngOnInit(): void {
    console.log(this.images);
  }

  // Obsługuje zmianę pliku
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0]; // Pobieramy pierwszy plik

    // Sprawdzanie, czy plik ma rozszerzenie .cbz
    if (file.name.endsWith('.cbz')) {
      this.handleCBZ(file); // Przekazujemy obiekt File do handleCBZ
    }
    // Obsługuje plik .cbr
    else if (file.name.endsWith('.cbr')) {
      this.handleCBR(file); // Przekazujemy obiekt File do handleCBR
    }
    // Obsługuje inne pliki (możesz dodać inne przypadki)
    else {
      console.error('Nieobsługiwany typ pliku.');
    }
  }

  // Obsługuje plik CBZ
  handleCBZ(file: File): void {
    this.isLoading = true;
    this.error = null;

    this.fileHandlerService
      .handleCBZ(file)
      .then((images) => {
        console.log('Obrazy z CBZ:', images);
        this.images = images;
        console.log('Po przypisaniu obrazy:', this.images);
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Błąd przetwarzania pliku CBZ:', error);
        this.isLoading = false;
        this.error = 'Błąd przetwarzania pliku CBZ.';
      });
  }

  handleCBR(file: File): void {
    this.isLoading = true;
    this.error = null;

    this.fileHandlerService
      .uploadFile(file)
      .then((imageUrls) => {
        console.log('Obrazy z serwera:', imageUrls);
        this.extractedFiles = imageUrls;
        console.log('Po przypisaniu obrazy:', this.extractedFiles);
        this.loadImages(imageUrls);
      })
      .catch((err) => {
        console.error('Błąd podczas przesyłania pliku CBR:', err);
        this.isLoading = false;
        this.error = 'Błąd podczas przesyłania pliku CBR.';
      });
  }

  // Funkcja do ładowania zdjęć z serwera
  loadImages(imageUrls: string[]): void {
    console.log('laduje obrazy');
    console.log(this.images);
    this.images = imageUrls; // Ustawiamy obrazy
    this.isLoading = false;
  }
}
