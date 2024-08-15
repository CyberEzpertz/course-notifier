"use server";

type Code = {
  code: number;
  course: string;
  enlisted?: number;
  cap?: number;
};

type Modality =
  | "HYBRID"
  | "F2F"
  | "ONLINE"
  | "PREDOMINANTLY_ONLINE"
  | "PREDOMINANTLY_F2F"
  | "PURE_ASYNCHRONOUS"
  | "TENTATIVE";

type Restriction = "NONE" | "FROSH" | "RESTRICTED";

type Schedule = {
  day: string;
  start: number;
  end: number;
  isOnline: Boolean;
};

type Class = {
  code: number;
  course: string;
  section: string;
  professor?: string;
  schedules: Schedule[];
  enrolled: number;
  enrollCap: number;
  room: string;
  restriction: string;
  modality: Modality;
};

export async function fetchCourses(codes: Code[]) {
  const id = "12213423";
  const courseCodes: number[] = [];

  const courses = codes.reduce<string[]>((acc, curr) => {
    acc.push(curr.course);
    courseCodes.push(curr.code);
    return acc;
  }, []);

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

  const filtered: Class[] = [];

  for (const course of decoded) {
    course.map((classDetails) => {
      if (courseCodes.includes(classDetails.code)) {
        filtered.push(classDetails);
      }
    });
  }

  return filtered;
}
