"use server";

import { Class, classEntry } from "@/lib/types";

export async function fetchCourses(codes: classEntry[]) {
  const id = process.env.ID_NUMBER;
  let hasStatusChanged = false;

  if (codes.length === 0) {
    return { sendNotif: false, codes: [] };
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
      console.error(
        "[FETCH COURSES] Tried fetching, but API is not yet ready."
      );
      return { sendNotif: false, codes: [] };
    }

    const parsed = (await data.json()) as Class[][];

    for (const course of parsed) {
      course.map((courseClass) => {
        if (classCodes.includes(courseClass.code)) {
          const index = classCodes.indexOf(courseClass.code);
          const newStatus =
            courseClass.enrolled >= courseClass.enrollCap ? "close" : "open";

          // If we're not yet sending notifs + the class doesn't have a status yet
          // reassign the hasStatusChanged depending on the result.
          if (!hasStatusChanged && codes[index].status) {
            hasStatusChanged = codes[index].status !== newStatus;
          }

          codes[index].status = newStatus;
          codes[index].details = courseClass;
        }
      });
    }

    return { sendNotif: hasStatusChanged, codes: codes, timestamp: new Date() };
  } catch (error) {
    console.error("[FETCH COURSES] Something went wrong during fetching:");
    console.error(error);
    return { sendNotif: false, codes: codes };
  }
}

export async function tellServer(message: any) {
  console.log(message);
}
