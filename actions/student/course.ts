"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductStatus, ProductType } from "@prisma/client";

export async function getPublishedCourses() {
  try {
    const courses = await prisma.course.findMany({
      where: {
        published: true,
        category: "Course", // Sprawdzanie, czy kategoria to "Course"
      }
    });

    return courses;
  } catch (error) {
    console.error("Error fetching published courses:", error);
    throw new Error("Unable to fetch published courses.");
  }
}

export async function getPublishedCourseBySlug(slug:string) {
  try {
    const course = await prisma.course.findUnique({
      where: {
        published: true,
        slug: slug
      }
    })

    if (!course || !course.published) {
      throw new Error("Course not found or not published.");
    }
    
    return course
  } catch (error) {
    console.error("Error fetching published course by slug:", error);
    throw new Error("Unable to fetch published course by slug.")
  }
}

export async function checkIfUserHasCourse(courseId:string) {
  const session = await auth()
  if (!session || !session.user || !session.user.id ) throw new Error("Brak dostępu")
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true }
  })

  if (!course) throw new Error ("Nie znaleziono kursu")
  
  const hasCourse = await prisma.purchasedProducts.findFirst({
    where: {
      userId: session.user.id,
      productId: course.id,
      productType: ProductType.Course,
      status: ProductStatus.Active
    }
  })

  return !!hasCourse
}