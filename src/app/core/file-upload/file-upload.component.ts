import { Component } from '@angular/core';
import { FileHandlerService } from '../service/file-handler.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  images: string[] = []; // Tablica z URL obrazów do wyświetlenia
  // nowe
  extractedFiles: string[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  // nowe

  constructor(private fileHandlerService: FileHandlerService) {}

  // Obsługuje zmianę pliku
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.handleFile(file);
    }
  }

  // Obsługuje plik
  handleFile(file: File) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'cbz') {
      this.handleCBZ(file);
    } else if (fileExtension === 'cbr') {
      // this.handleCBR(file);
      console.log('CBR');
    } else {
      console.error('Invalid file type');
    }
  }

  // Obsługuje plik CBZ
  handleCBZ(file: File) {
    this.fileHandlerService
      .handleCBZ(file)
      .then((images) => {
        this.images = images;
      })
      .catch((err) => {
        console.error('Error reading CBZ:', err);
      });
  }

  // Obsługuje plik CBR
  // handleCBR(file: File) {
  //   this.fileHandlerService.handleCBR(file).then((images) => {
  //     this.images = images;
  //   }).catch((err) => {
  //     console.error('Error reading CBR:', err);
  //   });
  // }

  // nowe
  // Funkcja wywoływana po wybraniu pliku
  onFileSelectedd(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.selectedFile = inputElement.files[0];
      this.extractedFiles = [];
      this.error = null;
    }
  }

  // Funkcja uruchamiająca proces rozpakowywania
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (file.name.endsWith('.cbz')) {
      this.fileHandlerService
        .handleCBZ(file)
        .then((images) => {
          this.images = images;
        })
        .catch((error) => {
          console.error('Błąd przetwarzania pliku CBZ:', error);
        });
    } else {
      this.fileHandlerService.uploadFile(event);
    }
  }
  // nowe
}
