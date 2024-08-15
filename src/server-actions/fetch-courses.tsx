"use server";

import { Class, Code } from "@/lib/types";

export async function fetchCourses(codes: Code[]) {
  if (codes.length === 0) {
    return { sendNotif: false, codes: [] };
  }

  const id = "12213423";
  const courseCodes: number[] = [];
  let sendNotif = false;

  const courses = codes.reduce<string[]>((acc, curr) => {
    acc.push(curr.course);
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

          if (!sendNotif && codes[index].status) {
            const newStatus =
              classDetails.enrolled >= classDetails.enrollCap
                ? "close"
                : "open";
            sendNotif = codes[index].status !== newStatus;
          }

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
