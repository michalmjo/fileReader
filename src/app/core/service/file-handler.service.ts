import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FileHandlerService {
  constructor(private http: HttpClient) {}

  /**
   * Obsługuje pliki CBZ, wyciąga obrazy i zwraca ich URL-e.
   * @param file - Plik CBZ do przetworzenia.
   * @returns Promise z tablicą URL-i obrazów.
   */
  handleCBZ(file: File): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event: any) => {
        try {
          const zip = new JSZip();
          const contents = await zip.loadAsync(event.target.result);

          const imagePromises = Object.keys(contents.files)
            .filter((filename) => /\.(jpg|jpeg|png)$/i.test(filename))
            .map(async (filename) => {
              const file = contents.files[filename];
              const blob = await file.async('blob');
              return URL.createObjectURL(blob);
            });

          const images = await Promise.all(imagePromises);
          resolve(images);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Błąd podczas odczytu pliku.'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Wysyła plik do backendu.
   * @param event - Zdarzenie zmiany na input[type="file"].
   */
  uploadFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);

    this.http.post('http://localhost:3000/upload', formData).subscribe({
      next: (response) => {
        console.log('File uploaded successfully:', response);
        alert('File uploaded successfully');
      },
      error: (err) => {
        console.error('Upload error:', err);
        alert('File upload failed');
      },
    });
  }
}
