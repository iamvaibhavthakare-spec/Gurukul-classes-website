import { CoursePageLayout } from "@/components/CoursePageLayout";
import { COURSE_BY_SLUG } from "@/data/site";

const course = COURSE_BY_SLUG["mh-cet"];

export function CourseMhCet() {
  return <CoursePageLayout course={course} />;
}
