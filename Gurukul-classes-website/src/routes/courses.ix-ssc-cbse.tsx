import { CoursePageLayout } from "@/components/CoursePageLayout";
import { COURSE_BY_SLUG } from "@/data/site";

const course = COURSE_BY_SLUG["ix-ssc-cbse"];

export function CourseIxSscCbse() {
  return <CoursePageLayout course={course} />;
}
