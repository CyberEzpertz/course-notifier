"use server";

import { Class, Code } from "@/lib/types";

export async function fetchCourses(codes: Code[]) {
  if (codes.length === 0) {
    return { sendNotif: false, codes: [] };
  }

  const id = process.env.ID_NUMBER;
  const courseCodes: number[] = [];
  let sendNotif = false;

  const courses = codes.reduce<string[]>((acc, curr) => {
    if (curr.course.length !== 7) return acc;

    if (!acc.includes(curr.course)) acc.push(curr.course);

    courseCodes.push(curr.code);
    return acc;
  }, []);

  try {
    const data = await fetch(
      `${
        process.env.COURSE_API
      }/api/getMultipleCourses?id=${id}&courses=${courses.join("&courses=")}`,
      {
        cache: "no-store",
      }
    );
    //   const data = await fetch(`${process.env.COURSE_API}/api/getCookies`);
    const decoded = (await data.json()) as Class[][];

    for (const course of decoded) {
      course.map((classDetails) => {
        if (courseCodes.includes(classDetails.code)) {
          const index = courseCodes.indexOf(classDetails.code);
          const newStatus =
            classDetails.enrolled >= classDetails.enrollCap ? "close" : "open";

          if (!sendNotif && codes[index].status) {
            sendNotif = codes[index].status !== newStatus;
          }

          codes[index].status = newStatus;
          codes[index].details = classDetails;
        }
      });
    }

    return { sendNotif: sendNotif, codes: codes };
  } catch (error) {
    console.error(error);
    return { sendNotif: false, codes: codes };
  }
}
