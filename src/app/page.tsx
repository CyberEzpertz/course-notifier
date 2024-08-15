import CourseList from "@/components/CourseList";
import { fetchCourses } from "@/server-actions/fetch-courses";

const sampleCodes = [
  {
    code: 3900,
    course: "CSARCH2",
  },
  {
    code: 1740,
    course: "DIGIMAP",
  },
];

export default async function Home() {
  const data = await fetchCourses(sampleCodes);
  console.log(data);

  return <CourseList />;
}
