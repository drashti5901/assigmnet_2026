import {useCallback, useRef, useState} from 'react';
import {Course} from '../domain/course';
import {
  loadCourses as loadCoursesFromRepository,
  saveCourses,
} from '../data/courseRepository';
import {markLessonCompleted} from '../domain/course';

export function useCoursesViewModel() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const coursesRef = useRef<Course[]>([]);
  const saveQueue = useRef(Promise.resolve());

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loadCoursesFromRepository();
      coursesRef.current = result.courses;
      setCourses(result.courses);
      setOffline(result.offline);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? `We couldn't load your courses: ${loadError.message}`
          : "We couldn't load your courses. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const completeLesson = useCallback((courseId: number, lessonId: string) => {
    const updatedCourses = coursesRef.current.map(course =>
      course.id === courseId ? markLessonCompleted(course, lessonId) : course,
    );
    coursesRef.current = updatedCourses;
    setCourses(updatedCourses);
    saveQueue.current = saveQueue.current
      .then(() => saveCourses(updatedCourses))
      .catch(saveError => {
        setError(
          saveError instanceof Error
            ? `Your progress couldn't be saved offline: ${saveError.message}`
            : "Your progress couldn't be saved offline.",
        );
      });
  }, []);

  return {courses, loading, error, offline, loadCourses, completeLesson};
}
