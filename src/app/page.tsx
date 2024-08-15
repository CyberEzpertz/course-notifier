import CourseList from "@/components/CourseList";
import { fetchCourses } from "@/server-actions/fetch-courses";

export default async function Home() {
  // const data = await fetchCourses(sampleCodes);
  // console.log(data);

  return <CourseList />;
}
