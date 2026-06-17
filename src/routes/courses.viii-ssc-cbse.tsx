import { CoursePageLayout } from "@/components/CoursePageLayout";
import { COURSE_BY_SLUG } from "@/data/site";

const course = COURSE_BY_SLUG["viii-ssc-cbse"];

export function CourseViiiSscCbse() {
  return <CoursePageLayout course={course} />;
}
