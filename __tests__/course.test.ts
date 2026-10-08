import {
  Course,
  mergeCachedProgress,
  markLessonCompleted,
  progressAfterLessonCompletion,
} from '../src/domain/course';

const course: Course = {
  id: 7,
  title: 'Testing',
  instructor: 'Ada',
  progress: 40,
  totalLessons: 10,
  lessons: [
    {id: '1', title: 'One', completed: true},
    {id: '2', title: 'Two', completed: true},
    {id: '3', title: 'Three', completed: true},
    {id: '4', title: 'Four', completed: true},
    {id: '5', title: 'Five', completed: false},
    {id: '6', title: 'Six', completed: false},
    {id: '7', title: 'Seven', completed: false},
    {id: '8', title: 'Eight', completed: false},
    {id: '9', title: 'Nine', completed: false},
    {id: '10', title: 'Ten', completed: false},
  ],
};

test('completing a pending lesson updates its state and course progress once', () => {
  const updated = markLessonCompleted(course, '5');

  expect(updated.lessons[4].completed).toBe(true);
  expect(updated.progress).toBe(50);
  expect(markLessonCompleted(updated, '5')).toBe(updated);
  expect(course.lessons[4].completed).toBe(false);
});

test('progress never exceeds 100 and handles courses without lessons', () => {
  expect(progressAfterLessonCompletion(100, 9, 10)).toBe(100);
  expect(progressAfterLessonCompletion(30, 0, 0)).toBe(30);
});

test('refreshes course metadata without discarding saved lesson progress', () => {
  const cached = markLessonCompleted(course, '5');
  const refreshed = mergeCachedProgress(
    [{...course, title: 'Updated course name'}],
    [cached],
  );

  expect(refreshed[0].title).toBe('Updated course name');
  expect(refreshed[0].progress).toBe(50);
  expect(refreshed[0].lessons[4].completed).toBe(true);
});
