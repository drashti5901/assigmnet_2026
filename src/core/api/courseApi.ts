import {loadCourses, saveCourses} from '../../features/courses/data/courseRepository';
import {Course} from '../../features/courses/domain/course';

export type CourseLoadResult = {
  courses: Course[];
  offline: boolean;
};

export async function fetchCourses(): Promise<CourseLoadResult> {
  return loadCourses();
}

export async function saveCourseProgress(courses: Course[]): Promise<void> {
  await saveCourses(courses);
}
