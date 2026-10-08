import AsyncStorage from '@react-native-async-storage/async-storage';
import fixture from './courses.json';
import {Course, Lesson, mergeCachedProgress} from '../domain/course';

const CACHE_KEY = '@learning-dashboard/courses-v1';

type CourseFixture = {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  totalLessons: number;
  lessonTitles: string[];
};

export type CourseLoadResult = {
  courses: Course[];
  offline: boolean;
};

function createLessons(course: CourseFixture): Lesson[] {
  const completedCount = Math.floor((course.progress * course.totalLessons) / 100);
  return Array.from({length: course.totalLessons}, (_, index) => ({
    id: `${course.id}-lesson-${index + 1}`,
    title:
      course.lessonTitles[index] ??
      `Lesson ${String(index + 1).padStart(2, '0')}`,
    completed: index < completedCount,
  }));
}

function isLesson(value: unknown): value is Lesson {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const lesson = value as Record<string, unknown>;
  return (
    typeof lesson.id === 'string' &&
    typeof lesson.title === 'string' &&
    typeof lesson.completed === 'boolean'
  );
}

function isCourseList(value: unknown): value is Course[] {
  return (
    Array.isArray(value) &&
    value.every(
      item =>
        typeof item?.id === 'number' &&
        typeof item?.title === 'string' &&
        typeof item?.instructor === 'string' &&
        typeof item?.progress === 'number' &&
        item.progress >= 0 &&
        item.progress <= 100 &&
        typeof item?.totalLessons === 'number' &&
        Array.isArray(item?.lessons) &&
        item.lessons.every(isLesson),
    )
  );
}

async function fetchMockCourses(): Promise<Course[]> {
  await new Promise<void>(resolve => setTimeout(resolve, 350));
  return (fixture as CourseFixture[]).map(course => ({
    id: course.id,
    title: course.title,
    instructor: course.instructor,
    progress: course.progress,
    totalLessons: course.totalLessons,
    lessons: createLessons(course),
  }));
}

export async function loadCourses(): Promise<CourseLoadResult> {
  let cachedCourses: Course[] | null = null;

  try {
    const rawCache = await AsyncStorage.getItem(CACHE_KEY);
    if (rawCache) {
      const parsed: unknown = JSON.parse(rawCache);
      if (isCourseList(parsed)) {
        cachedCourses = parsed;
      } else {
        console.warn('Ignoring invalid cached course data.');
      }
    }
  } catch (error) {
    console.warn('Could not read the saved course cache.', error);
  }

  try {
    const freshCourses = await fetchMockCourses();
    const courses = cachedCourses
      ? mergeCachedProgress(freshCourses, cachedCourses)
      : freshCourses;
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(courses));
    } catch (error) {
      console.warn('Could not save courses for offline use.', error);
    }
    return {courses, offline: false};
  } catch (error) {
    if (cachedCourses) {
      return {courses: cachedCourses, offline: true};
    }
    throw error;
  }
}

export async function saveCourses(courses: Course[]): Promise<void> {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(courses));
}
