export type Lesson = {
  id: string;
  title: string;
  completed: boolean;
};

export type Course = {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  totalLessons: number;
  lessons: Lesson[];
};

export function mergeCachedProgress(
  freshCourses: Course[],
  cachedCourses: Course[],
): Course[] {
  const cachedById = new Map(cachedCourses.map(course => [course.id, course]));
  return freshCourses.map(course => {
    const cached = cachedById.get(course.id);
    if (!cached || cached.totalLessons !== course.totalLessons) {
      return course;
    }
    return {...course, progress: cached.progress, lessons: cached.lessons};
  });
}

export function markLessonCompleted(course: Course, lessonId: string): Course {
  const lesson = course.lessons.find(item => item.id === lessonId);
  if (!lesson || lesson.completed) {
    return course;
  }

  const completedCount = course.lessons.filter(item => item.completed).length;
  return {
    ...course,
    lessons: course.lessons.map(item =>
      item.id === lessonId ? {...item, completed: true} : item,
    ),
    progress: progressAfterLessonCompletion(
      course.progress,
      completedCount,
      course.totalLessons,
    ),
  };
}

export function progressAfterLessonCompletion(
  currentProgress: number,
  completedLessons: number,
  totalLessons: number,
): number {
  if (totalLessons <= 0) {
    return currentProgress;
  }
  return Math.min(
    100,
    Math.max(currentProgress, Math.round(((completedLessons + 1) / totalLessons) * 100)),
  );
}
