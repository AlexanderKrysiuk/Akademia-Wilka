"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductStatus, ProductType } from "@prisma/client";

export async function getPublishedCourses() {
  try {
    const courses = await prisma.course.findMany({
      where: {
        published: true,
        category: ProductType.Course, // Sprawdzanie, czy kategoria to "Course"
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



export async function LessonPageAccessStatus(courseId:string) {
  const session = await auth();
  const user = session?.user

  if (!user || !user.id) throw new Error("Niezalogowany");

  // 1. Sprawdź, czy użytkownik już ma kurs
  const userProgress = await prisma.user.findFirst({
    where: { id: user.id },
    select: {
      courses: { where: { id: courseId } },
      completedLessons: { 
        where: { 
          courseId: courseId,
          published: true
        },
        select: {
          id: true
        } 
      },
    },
  });

  if (userProgress?.courses.length) {
    // Jeśli użytkownik ma kurs, zwróć postęp
    const allLessons = await prisma.lesson.findMany({
      where: { courseId: courseId, published: true },
    });

    return {
      allLessons,
      completedLessonsIds: userProgress.completedLessons.map(lesson => lesson.id),
    };
  }
}

export async function getCourseAccessStatus(courseId: string) {
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) throw new Error("Niezalogowany");

  // 1. Sprawdź, czy użytkownik już ma kurs
  const userProgress = await prisma.user.findFirst({
    where: { id: user.id },
    select: {
      courses: { where: { id: courseId } },
      completedLessons: { where: { 
        courseId: courseId,
        published: true
       },
      },
    },
  });

  if (userProgress?.courses.length) {
    // Jeśli użytkownik ma kurs, zwróć postęp
    const allLessons = await prisma.lesson.findMany({
      where: { courseId: courseId, published: true },
    });

    return {
      status: true,
      allLessons,
      completedLessons: userProgress.completedLessons,
    };
  }

  // 2. Sprawdź, czy użytkownik ma aktywny zakup kursu
  const activeProduct = await prisma.purchasedProducts.findFirst({
    where: {
      userId: user.id,
      productId: courseId,
      productType: ProductType.Course,
      status: ProductStatus.Active,
    },
  });
  if (activeProduct) {
    return {status: true}
  }
  return {status: false}
  // 3. Jeśli nie ma kursu ani aktywnego zakupu, zwróć status do zakupu

  // if (activeProduct) {
  //   // Jeśli zakup jest aktywny, aktywuj kurs
  //   try {
  //     await prisma.$transaction([
  //       prisma.purchasedProducts.update({
  //         where: { id: activeProduct.id },
  //         data: { status: ProductStatus.Used },
  //       }),
  //       prisma.user.update({
  //         where: { id: user.id },
  //         data: {
  //           courses: {
  //             connect: { id: courseId },
  //           },
  //         },
  //       }),
  //     ]);

  //     return { status: "courseActivated" };
  //   } catch (error) {
  //     console.error("Error activating course:", error);
  //     throw new Error("Nie udało się aktywować kursu.");
  //   }
  // }

}

export const activateCourseById = async (courseId:string) => {
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) throw new Error("Niezalogowany");

  // 1. Sprawdź, czy użytkownik już ma kurs
  const userProgress = await prisma.user.findFirst({
    where: { id: user.id },
    select: {
      courses: { where: { id: courseId } },
      completedLessons: { where: { courseId: courseId } },
    },
  });

  if (userProgress?.courses.length) throw new Error("Użytkownik ma już kurs")

  // 2. Sprawdź, czy użytkownik ma aktywny zakup kursu
  const activeProduct = await prisma.purchasedProducts.findFirst({
    where: {
      userId: user.id,
      productId: courseId,
      productType: ProductType.Course,
      status: ProductStatus.Active,
    },
  });
  if (!activeProduct) throw new Error("Brak kursu do aktywacji!")
  
  // Jeśli zakup jest aktywny, aktywuj kurs
  try {
    await prisma.$transaction([
      prisma.purchasedProducts.update({
        where: { id: activeProduct.id },
        data: { status: ProductStatus.Used },
      }),
      prisma.user.update({
        where: { id: user.id },
          data: {
            courses: {
              connect: { id: courseId },
            },
          },
      }),
    ]);
    return { status: "courseActivated" };
  } catch (error) {
    console.error("Error activating course:", error);
    throw new Error("Nie udało się aktywować kursu.");
  }
  
  // const session = await auth()
  // const user = session?.user

  // if (!user || !user.id) throw new Error("Niezalogowany")

  // const product = await prisma.purchasedProducts.findFirst({
  //   where: {
  //     userId: user.id,
  //     productId: courseId,
  //     productType: ProductType.Course,
  //     status: ProductStatus.Active
  //   }
  // })

  // if (!product) throw new Error ("Brak produktu do aktywacji")

  // try {
  //   await prisma.$transaction([
  //     prisma.purchasedProducts.update({
  //       where: {id: product.id},
  //       data: {status: ProductStatus.Used}
  //     }),
  //     prisma.user.update({
  //       where: { id: user.id },
  //       data: {
  //         courses: {
  //           connect: { id: courseId }
  //         }
  //       }
  //     })
  //   ])
  // } catch(error) {
  //   console.error("Assigning course error in actions/student/course:", error)
  //   throw new Error("Nie udało się dopisać kursu")
  // }
}

export async function checkIfUserHasCourseIfYesReturnHisProgress(courseId:string) {
  const session = await auth()
  const user = session?.user

  if (!user || !user.id) throw new Error("Niezalogowany")

  const userHasCourse = await prisma.user.findFirst({
    where: {
      id: user.id
    },
    select: {
      courses: {
        where: {
          id: courseId, // Możesz także sprawdzić po slugu
        },      
      },
      completedLessons: {
        where: {
          courseId: courseId
        }
      }
    }
  })

  console.log(userHasCourse)

  if (userHasCourse?.courses && userHasCourse.courses.length > 0) {
    const lessons = await prisma.lesson.findMany({
      where: {
        courseId: courseId,
        published: true
      }
    })

    return {
      completedLessons: userHasCourse.completedLessons,
      allLessons: lessons,
    };
  }
  // Jeśli użytkownik nie ma kursu, zwrócimy null lub inny status
  return null;
}

export const checkIfUserHasBoughtCourse = async (courseId:string) => {
  const session = await auth()
  const user = session?.user

  if (!user || !user.id) throw new Error("Niezalogowany")

  const hasCourse = await prisma.purchasedProducts.findFirst({
    where: {
      userId: user.id,
      productId: courseId,
      productType: ProductType.Course,
      status: ProductStatus.Active
    }
  })
  return !!hasCourse
}


export async function checkIfUserHasCourse(courseId:string, email?:string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true }
  })

  if (!course) throw new Error ("Nie znaleziono kursu")

  let user

  if (email) {
    user = await prisma.user.findUnique({
      where: { email }
    })
  } else {
    const session = await auth()
    user = session?.user
  }
  
  if (!user) return false
  
  // 1. Sprawdź, czy użytkownik już ma kurs
  const userProgress = await prisma.user.findFirst({
    where: { id: user.id },
    select: {
      courses: { where: { id: courseId } },
      completedLessons: { where: { courseId: courseId } },
    },
  });

  if (userProgress?.courses.length) return true

  // 2. Sprawdź, czy użytkownik ma aktywny zakup kursu
  const activeProduct = await prisma.purchasedProducts.findFirst({
    where: {
      userId: user.id,
      productId: courseId,
      productType: ProductType.Course,
      status: ProductStatus.Active,
    },
  });
  if (activeProduct) return true
  
  // 3. Jeśli nie ma kursu ani aktywnego zakupu, zwróć status do zakupu
  return false
}