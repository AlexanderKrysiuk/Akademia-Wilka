// menu.tsx
import { Gauge, Rocket } from "lucide-react"; // Ikona rakiety dla nauczycieli
import { UserRole } from "@prisma/client";

export const userItems = [
    {
        key: 'dashboard',
        label: 'Kokpit',
        href: '/kokpit',
        icon: Gauge
    },
];

// Sekcja nauczyciela - dostępna tylko dla nauczycieli
export const teacherItems = [
    {
        key: 'my-courses',
        label: 'Moje kursy',
        href: '/my-courses',
        icon: Rocket
    },
];
