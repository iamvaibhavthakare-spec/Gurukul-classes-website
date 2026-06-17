import { CoursePageLayout } from "@/components/CoursePageLayout";
import { COURSE_BY_SLUG } from "@/data/site";

const course = COURSE_BY_SLUG["xii-science"];

export function CourseXiiScience() {
  return <CoursePageLayout course={course} />;
}
