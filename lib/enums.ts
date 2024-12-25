import { Category, Level, Subject } from "@prisma/client";

export const CategoryNames = {
    [Category.Exam]: "Opracowanie Egzaminu",
    [Category.Course]: "Kurs",
};

export const SubjectNames = {
    [Subject.Mathematics]: "Matematyka"
}

export const LevelNames = {
    [Level.ElementarySchool]: "Szkoła Podstawowa",
    [Level.GeneralHighSchool]: "Szkoła Średnia - podstawa",
    [Level.AdvancedHighSchool]: "Szkoła Średnia - rozszerzenie",
    [Level.University]: "Studia"
}