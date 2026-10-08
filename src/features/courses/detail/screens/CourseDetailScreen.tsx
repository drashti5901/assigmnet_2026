import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {ProgressBar} from '../../../shared/components/ProgressBar';
import {Course, Lesson} from '../../domain/course';
import {screenStyles} from '../../../shared/styles/screenStyles';

type CourseDetailScreenProps = {
  course: Course;
  onBack: () => void;
  onToggleLesson: (lesson: Lesson) => void;
};

export function CourseDetailScreen({
  course,
  onBack,
  onToggleLesson,
}: CourseDetailScreenProps) {
  return (
    <ScrollView contentContainerStyle={screenStyles.page}>
      <Pressable accessibilityRole="button" onPress={onBack} style={screenStyles.backButton}>
        <Text style={screenStyles.backText}>←  All courses</Text>
      </Pressable>
      <Text style={screenStyles.eyebrow}>COURSE DETAILS</Text>
      <Text style={screenStyles.detailsTitle}>{course.title}</Text>
      <Text style={screenStyles.courseInstructor}>{course.instructor} · {course.totalLessons} lessons</Text>
      <View style={screenStyles.progressCard}>
        <View style={screenStyles.progressHeading}>
          <Text style={screenStyles.sectionTitle}>Your progress</Text>
          <Text style={screenStyles.progressPercent}>{course.progress}%</Text>
        </View>
        <ProgressBar progress={course.progress} />
      </View>
      <Text style={[screenStyles.sectionTitle, screenStyles.lessonSectionTitle]}>Lessons</Text>
      <View style={screenStyles.lessonList}>
        {course.lessons.map(lesson => (
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{checked: lesson.completed}}
            key={lesson.id}
            disabled={lesson.completed}
            onPress={() => onToggleLesson(lesson)}
            style={screenStyles.lessonRow}>
            <View style={[screenStyles.lessonCheck, lesson.completed && screenStyles.lessonCheckDone]}>
              <Text style={[screenStyles.lessonCheckText, lesson.completed && screenStyles.lessonCheckTextDone]}>
                {lesson.completed ? '✓' : ''}
              </Text>
            </View>
            <Text style={screenStyles.lessonTitle}>{lesson.title}</Text>
            <Text style={screenStyles.lessonStatus}>{lesson.completed ? 'Completed' : 'Mark done'}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
