export const formatSlug = (input: string) => {
    return input
        .toLowerCase() // Zamiana na małe litery
        .normalize("NFD") // Normalizacja, aby rozdzielić znaki diakrytyczne
        .replace(/[\u0300-\u036f]/g, "") // Usuwanie znaków diakrytycznych (np. ą -> a)
        .replace(/\s+/g, "-") // Zamiana wszystkich spacji na myślniki
        .replace(/[^a-z0-9\-]/g, "") // Usuwanie innych znaków (wszystko, co nie jest literą, cyfrą lub myślnikiem)
        .replace(/--+/g, "-") // Usuwanie nadmiarowych myślników
        .trim(); // Usuwanie nadmiarowych spacji
};