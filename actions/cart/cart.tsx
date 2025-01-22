// 'use server';

// import { ProductType } from ".prisma/client";
// import { prisma } from "@/lib/prisma";
// import { redirect } from "next/navigation";

// export async function CheckProducts(cartItems: { id: string; type: ProductType }[]) {
//   const products = [];

//   for (const item of cartItems) {
//     if (item.type === ProductType.Course) {
//       const course = await prisma.course.findUnique({
//         where: {
//           id: item.id,
//         },
//         select: {
//           id: true,
//           name: true,
//           price: true, // Dodaj inne dane, które chcesz pobrać
//         },
//       });

//       if (course) {
//         products.push(course); // Dodajemy produkt do wyników
//       }
//     }
//     // Możesz dodać inne typy produktów i obsługę (np. dla `ProductType.Product`)
//   }

//   // Możesz przekazać dane przez redirect lub jako JSON, w zależności od potrzeb
//   return redirect("/zamowienie", {
//     query: {
//       products: JSON.stringify(products), // Możesz przekazać dane w formie JSON
//     },
//   });
// }
