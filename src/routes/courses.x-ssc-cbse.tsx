import { CoursePageLayout } from "@/components/CoursePageLayout";
import { COURSE_BY_SLUG } from "@/data/site";

const course = COURSE_BY_SLUG["x-ssc-cbse"];

export function CourseXSscCbse() {
  return <CoursePageLayout course={course} />;
}
