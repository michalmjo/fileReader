import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FileHandlerService {
  extractedFiles: any = [];

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
   * Wysyła plik CBR do serwera i odbiera URL-e rozpakowanych obrazów.
   * @param file - Plik CBR do przesłania.
   */
  uploadFilse(file: File): Promise<string[]> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<string[]>('http://localhost:3000/upload', formData)
      .toPromise()
      .then((response) => {
        // Upewniamy się, że odpowiedź nie jest undefined
        return response || []; // Zwracamy pustą tablicę, jeśli odpowiedź jest undefined
      })
      .catch((err) => {
        console.error('Błąd podczas przesyłania pliku:', err);
        return []; // Zwracamy pustą tablicę w przypadku błędu
      });
  }

  uploadFile(file: File): Promise<string[]> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http
      .post<string[]>('http://localhost:3000/upload', formData)
      .toPromise()
      .then((response) => {
        console.log('Odpowiedź z serwera:', response);
        if (Array.isArray(response) && response.length > 0) {
          return response;
        } else {
          throw new Error('Serwer nie zwrócił danych obrazów.');
        }
      })
      .catch((error) => {
        console.error('Błąd serwera:', error);
        throw error;
      });
  }

  /**
   * Wysyła żądanie do serwera po obrazy w danym katalogu.
   * @param dirNumber - Numer katalogu.
   * @returns Promise z tablicą URL-i obrazów.
   */
  getImages(dirNumber: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<string[]>(`http://localhost:3000/extracted/${dirNumber}`)
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (err) => {
            reject('Błąd pobierania obrazów: ' + err);
          },
        });
    });
  }
}
