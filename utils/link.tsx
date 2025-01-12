export const slugify = (text:string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')  // Replace spaces with -
      .replace(/[^\w\-]+/g, '')  // Remove all non-word chars
      .replace(/\-\-+/g, '-');  // Replace multiple - with single -
    };

// Funkcja zamieniająca znaki diakrytyczne na ich odpowiedniki
function removeAccents(str: string): string {
  const accentsMap: { [key: string]: string } = {
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ż': 'z', 'ź': 'z',
    'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ż': 'Z', 'Ź': 'Z'
  };

  return str.split('').map(char => accentsMap[char] || char).join('');
}

// Funkcja do sanitacji nazwy pliku
export function sanitizeFileName(fileName: string): string {
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, ''); // Usunięcie rozszerzenia
  const extension = fileName.split('.').pop(); // Pobranie rozszerzenia pliku

  // Zastosowanie funkcji removeAccents, zamiana spacji na myślniki i usuwanie niepożądanych znaków
  const sanitizedFileName = removeAccents(nameWithoutExtension)
      .replace(/\s+/g, '-')  // Zamiana spacji na myślniki
      .replace(/[^a-zA-Z0-9-_]/g, '') // Usuwanie niepożądanych znaków
      .toLowerCase(); // Zamiana na małe litery

  // Ponowne złączenie nazwy i rozszerzenia
  return `${sanitizedFileName}.${extension}`;
}