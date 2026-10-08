import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {Course} from '../../courses/domain/course';
import {screenStyles} from '../styles/screenStyles';
import {ProgressBar} from './ProgressBar';

type CourseCardProps = {
  course: Course;
  index: number;
  onPress: (course: Course) => void;
};

export function CourseCard({course, index, onPress}: CourseCardProps) {
  const accents = ['#DDEBE4', '#EDE7D9', '#E5E1EE'];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(course)}
      style={screenStyles.courseCard}>
      <View style={[screenStyles.courseIcon, {backgroundColor: accents[index % accents.length]}]}>
        <Text style={screenStyles.courseIconText}>{course.title.charAt(0)}</Text>
      </View>
      <View style={screenStyles.courseMeta}>
        <Text style={screenStyles.courseTitle}>{course.title}</Text>
        <Text style={screenStyles.courseInstructor}>{course.instructor}</Text>
        <ProgressBar progress={course.progress} />
        <View style={screenStyles.courseFooter}>
          <Text style={screenStyles.courseStat}>{course.progress}% complete</Text>
          <Text style={screenStyles.courseStat}>{course.totalLessons} lessons</Text>
        </View>
        <View style={screenStyles.continueButton}>
          <Text style={screenStyles.continueText}>Continue learning  →</Text>
        </View>
      </View>
    </Pressable>
  );
}
