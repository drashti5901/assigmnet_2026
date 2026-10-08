import React from 'react';
import {ActivityIndicator, Pressable, ScrollView, Text, View} from 'react-native';
import {CourseCard} from '../../../shared/components/CourseCard';
import {Course} from '../../domain/course';
import {screenStyles} from '../../../shared/styles/screenStyles';

type DashboardScreenProps = {
  courses: Course[];
  error: string | null;
  loading: boolean;
  offline: boolean;
  onCoursePress: (course: Course) => void;
  onRetry: () => void;
  onSignOut: () => void;
};

export function DashboardScreen({
  courses,
  error,
  loading,
  offline,
  onCoursePress,
  onRetry,
  onSignOut,
}: DashboardScreenProps) {
  return (
    <ScrollView contentContainerStyle={screenStyles.page}>
      <View style={screenStyles.topBar}>
        <View>
          <Text style={screenStyles.eyebrow}>LEARNER DASHBOARD</Text>
          <Text style={screenStyles.heading}>Good to see you.</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={onSignOut} style={screenStyles.signOutButton}>
          <Text style={screenStyles.signOutText}>Sign out</Text>
        </Pressable>
      </View>
      <Text style={screenStyles.subtitle}>Keep your momentum going.</Text>
      {offline && <Text style={screenStyles.offlineBanner}>Offline · showing your saved courses</Text>}
      {error && (
        <View style={screenStyles.errorBox}>
          <Text style={screenStyles.errorText}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={onRetry}>
            <Text style={screenStyles.retryText}>Try again</Text>
          </Pressable>
        </View>
      )}
      <View style={screenStyles.sectionHeader}>
        <Text style={screenStyles.sectionTitle}>Your courses</Text>
        <Text style={screenStyles.courseCount}>{courses.length.toString().padStart(2, '0')}</Text>
      </View>
      {loading && courses.length === 0 ? (
        <View style={screenStyles.centerState}>
          <ActivityIndicator color="#176B52" size="large" />
          <Text style={screenStyles.stateText}>Loading your courses…</Text>
        </View>
      ) : courses.length === 0 ? (
        <View style={screenStyles.emptyCard}>
          <Text style={screenStyles.sectionTitle}>No courses yet</Text>
          <Text style={screenStyles.stateText}>Your courses will show up here when they are ready.</Text>
        </View>
      ) : (
        courses.map((course, index) => (
          <CourseCard course={course} index={index} key={course.id} onPress={onCoursePress} />
        ))
      )}
    </ScrollView>
  );
}
