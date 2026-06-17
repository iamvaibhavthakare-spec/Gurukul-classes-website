import { CoursePageLayout } from "@/components/CoursePageLayout";
import { COURSE_BY_SLUG } from "@/data/site";

const course = COURSE_BY_SLUG["iit-jee"];

export function CourseIitJee() {
  return <CoursePageLayout course={course} />;
}
