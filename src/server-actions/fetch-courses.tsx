"use server";

import { Class, classEntry, watchEntry } from "@/lib/types";

export async function fetchCourses(codes: watchEntry[]) {
  const id = process.env.ID_NUMBER;

  if (codes.length === 0) {
    return [];
  }

  const { uniqueCourses, classCodes } = codes.reduce<{
    uniqueCourses: string[];
    classCodes: number[];
  }>(
    (acc, curr) => {
      if (!acc.uniqueCourses.includes(curr.course))
        acc.uniqueCourses.push(curr.course);

      acc.classCodes.push(curr.code);
      return acc;
    },
    { uniqueCourses: [], classCodes: [] }
  );

  try {
    console.log(
      `[FETCH COURSES] Fetching courses as of ${new Date().toLocaleTimeString()}`
    );

    const data = await fetch(
      `${
        process.env.COURSE_API
      }/api/getMultipleCourses?id=${id}&courses=${uniqueCourses.join(
        "&courses="
      )}`,
      {
        cache: "no-store",
      }
    );

    // const data = await fetch(`${process.env.COURSE_API}/testing`, {
    //   cache: "no-store",
    // });

    if (!data.ok) {
      throw new Error("Tried fetching, but Course API is not yet ready.");
    }

    const parsed = (await data.json()) as Class[][];
    const finalData: classEntry[] = [];

    for (const course of parsed) {
      course.map((courseClass) => {
        if (classCodes.includes(courseClass.code)) {
          const newStatus =
            courseClass.enrolled >= courseClass.enrollCap ? "close" : "open";
          finalData.push({
            details: courseClass,
            status: newStatus,
          });
        }
      });
    }

    return finalData;
  } catch (error) {
    console.error("[FETCH COURSES] Something went wrong during fetching:");
    throw error;
  }
}

export async function tellServer(message: any) {
  console.log(message);
}
