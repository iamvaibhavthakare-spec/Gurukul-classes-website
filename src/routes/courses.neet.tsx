import { CoursePageLayout } from "@/components/CoursePageLayout";
import { COURSE_BY_SLUG } from "@/data/site";

const course = COURSE_BY_SLUG["neet"];

export function CourseNeet() {
  return <CoursePageLayout course={course} />;
}
