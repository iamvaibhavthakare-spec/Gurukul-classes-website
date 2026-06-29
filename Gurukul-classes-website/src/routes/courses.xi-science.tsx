import { CoursePageLayout } from "@/components/CoursePageLayout";
import { COURSE_BY_SLUG } from "@/data/site";

const course = COURSE_BY_SLUG["xi-science"];

export function CourseXiScience() {
  return <CoursePageLayout course={course} />;
}
