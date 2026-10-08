import React, {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Course, Lesson} from './src/domain/course';
import {useCoursesViewModel} from './src/presentation/useCoursesViewModel';

const colors = {
  background: '#F6F5F1',
  card: '#FFFFFF',
  ink: '#17251F',
  muted: '#78827C',
  accent: '#176B52',
  pale: '#E4F0EA',
  border: '#E7E9E5',
  danger: '#AA3E35',
};

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const viewModel = useCoursesViewModel();

  async function login() {
    setLoginError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setLoginError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setLoginError('Password must be at least 6 characters.');
      return;
    }
    setLoginLoading(true);
    await new Promise<void>(resolve => setTimeout(resolve, 450));
    setLoginLoading(false);
    setSignedIn(true);
    viewModel.loadCourses();
  }

  function openCourse(course: Course) {
    setSelectedCourse(course);
  }

  const currentCourse =
    viewModel.courses.find(course => course.id === selectedCourse?.id) ??
    selectedCourse;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        {!signedIn ? (
          <ScrollView contentContainerStyle={styles.loginPage} keyboardShouldPersistTaps="handled">
            <View style={styles.brandMark}><Text style={styles.brandMarkText}>L</Text></View>
            <Text style={styles.eyebrow}>YOUR LEARNING SPACE</Text>
            <Text style={styles.loginTitle}>A little progress{'\n'}goes a long way.</Text>
            <Text style={styles.subtitle}>Sign in to pick up where you left off.</Text>
            <View style={styles.loginCard}>
              <Text style={styles.fieldLabel}>EMAIL</Text>
              <TextInput
                accessibilityLabel="Email"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#A0A7A2"
                style={styles.input}
                value={email}
              />
              <Text style={styles.fieldLabel}>PASSWORD</Text>
              <TextInput
                accessibilityLabel="Password"
                onChangeText={setPassword}
                placeholder="At least 6 characters"
                placeholderTextColor="#A0A7A2"
                secureTextEntry
                style={styles.input}
                value={password}
              />
              {!!loginError && <Text style={styles.errorText}>{loginError}</Text>}
              <ActionButton disabled={loginLoading} onPress={login} title="Sign in">
                {loginLoading ? <ActivityIndicator color="white" /> : null}
              </ActionButton>
            </View>
            <Text style={styles.demoNote}>Demo login · use any valid email and password (6+ characters)</Text>
          </ScrollView>
        ) : currentCourse ? (
          <CourseDetails
            course={currentCourse}
            onBack={() => setSelectedCourse(null)}
            onToggleLesson={lesson =>
              viewModel.completeLesson(currentCourse.id, lesson.id)
            }
          />
        ) : (
          <Dashboard
            courses={viewModel.courses}
            error={viewModel.error}
            loading={viewModel.loading}
            offline={viewModel.offline}
            onCoursePress={openCourse}
            onRetry={() => {
              viewModel.loadCourses();
            }}
            onSignOut={() => {
              setSelectedCourse(null);
              setSignedIn(false);
              setPassword('');
            }}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function Dashboard({
  courses,
  error,
  loading,
  offline,
  onCoursePress,
  onRetry,
  onSignOut,
}: {
  courses: Course[];
  error: string | null;
  loading: boolean;
  offline: boolean;
  onCoursePress: (course: Course) => void;
  onRetry: () => void;
  onSignOut: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.eyebrow}>LEARNER DASHBOARD</Text>
          <Text style={styles.heading}>Good to see you.</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={onSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </View>
      <Text style={styles.subtitle}>Keep your momentum going.</Text>
      {offline && <Text style={styles.offlineBanner}>Offline · showing your saved courses</Text>}
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={onRetry}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      )}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your courses</Text>
        <Text style={styles.courseCount}>{courses.length.toString().padStart(2, '0')}</Text>
      </View>
      {loading && courses.length === 0 ? (
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.accent} size="large" />
          <Text style={styles.stateText}>Loading your courses…</Text>
        </View>
      ) : courses.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.sectionTitle}>No courses yet</Text>
          <Text style={styles.stateText}>Your courses will show up here when they are ready.</Text>
        </View>
      ) : (
        courses.map((course, index) => (
          <CourseCard course={course} index={index} key={course.id} onPress={onCoursePress} />
        ))
      )}
    </ScrollView>
  );
}

function CourseCard({
  course,
  index,
  onPress,
}: {
  course: Course;
  index: number;
  onPress: (course: Course) => void;
}) {
  const accents = ['#DDEBE4', '#EDE7D9', '#E5E1EE'];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(course)}
      style={styles.courseCard}>
      <View style={[styles.courseIcon, {backgroundColor: accents[index % accents.length]}]}>
        <Text style={styles.courseIconText}>{course.title.charAt(0)}</Text>
      </View>
      <View style={styles.courseMeta}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <Text style={styles.courseInstructor}>{course.instructor}</Text>
        <ProgressBar progress={course.progress} />
        <View style={styles.courseFooter}>
          <Text style={styles.courseStat}>{course.progress}% complete</Text>
          <Text style={styles.courseStat}>{course.totalLessons} lessons</Text>
        </View>
        <View style={styles.continueButton}>
          <Text style={styles.continueText}>Continue learning  →</Text>
        </View>
      </View>
    </Pressable>
  );
}

function CourseDetails({
  course,
  onBack,
  onToggleLesson,
}: {
  course: Course;
  onBack: () => void;
  onToggleLesson: (lesson: Lesson) => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>←  All courses</Text>
      </Pressable>
      <Text style={styles.eyebrow}>COURSE DETAILS</Text>
      <Text style={styles.detailsTitle}>{course.title}</Text>
      <Text style={styles.courseInstructor}>{course.instructor} · {course.totalLessons} lessons</Text>
      <View style={styles.progressCard}>
        <View style={styles.progressHeading}>
          <Text style={styles.sectionTitle}>Your progress</Text>
          <Text style={styles.progressPercent}>{course.progress}%</Text>
        </View>
        <ProgressBar progress={course.progress} />
      </View>
      <Text style={[styles.sectionTitle, styles.lessonSectionTitle]}>Lessons</Text>
      <View style={styles.lessonList}>
        {course.lessons.map(lesson => (
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{checked: lesson.completed}}
            key={lesson.id}
            disabled={lesson.completed}
            onPress={() => onToggleLesson(lesson)}
            style={styles.lessonRow}>
            <View style={[styles.lessonCheck, lesson.completed && styles.lessonCheckDone]}>
              <Text style={[styles.lessonCheckText, lesson.completed && styles.lessonCheckTextDone]}>
                {lesson.completed ? '✓' : ''}
              </Text>
            </View>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            <Text style={styles.lessonStatus}>{lesson.completed ? 'Completed' : 'Mark done'}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

function ProgressBar({progress}: {progress: number}) {
  return (
    <View
      accessibilityLabel={`Course progress ${progress}%`}
      accessibilityRole="progressbar"
      accessibilityValue={{min: 0, max: 100, now: progress}}
      style={styles.progressTrack}>
      <View style={[styles.progressFill, {width: `${progress}%`}]} />
    </View>
  );
}

function ActionButton({
  children,
  disabled,
  onPress,
  title,
}: {
  children?: React.ReactNode;
  disabled?: boolean;
  onPress: () => void;
  title: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      accessibilityLabel={title}
      style={({pressed}) => [styles.actionButton, pressed && styles.buttonPressed]}>
      {children ?? <Text style={styles.actionButtonText}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: colors.background},
  page: {paddingHorizontal: 24, paddingTop: 26, paddingBottom: 40},
  loginPage: {flexGrow: 1, justifyContent: 'center', paddingHorizontal: 26, paddingVertical: 40},
  brandMark: {width: 46, height: 46, borderRadius: 16, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 34},
  brandMarkText: {color: 'white', fontSize: 24, fontWeight: '700'},
  eyebrow: {fontSize: 10, color: colors.accent, fontWeight: '700', letterSpacing: 1.8, marginBottom: 10},
  loginTitle: {fontSize: 35, lineHeight: 42, fontWeight: '700', color: colors.ink, letterSpacing: -1},
  heading: {fontSize: 27, fontWeight: '700', color: colors.ink, letterSpacing: -0.6},
  subtitle: {fontSize: 14, color: colors.muted, marginTop: 7, lineHeight: 21},
  loginCard: {backgroundColor: colors.card, borderRadius: 20, padding: 20, marginTop: 34},
  fieldLabel: {fontSize: 10, color: colors.muted, fontWeight: '700', letterSpacing: 1.2, marginBottom: 8, marginTop: 9},
  input: {height: 48, borderWidth: 1, borderColor: colors.border, borderRadius: 11, paddingHorizontal: 14, color: colors.ink, fontSize: 14, marginBottom: 9},
  actionButton: {height: 50, borderRadius: 12, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: 13},
  actionButtonText: {color: 'white', fontSize: 14, fontWeight: '700'},
  buttonPressed: {opacity: 0.82},
  demoNote: {color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 16, textAlign: 'center'},
  topBar: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  signOutButton: {paddingHorizontal: 12, paddingVertical: 9, borderRadius: 10, backgroundColor: colors.card},
  signOutText: {fontSize: 12, fontWeight: '600', color: colors.ink},
  offlineBanner: {marginTop: 20, padding: 12, borderRadius: 10, overflow: 'hidden', backgroundColor: colors.pale, color: colors.accent, fontSize: 12, fontWeight: '600'},
  errorBox: {marginTop: 18, padding: 14, backgroundColor: '#F9E8E5', borderRadius: 12},
  errorText: {fontSize: 12, color: colors.danger, lineHeight: 18},
  retryText: {fontSize: 12, color: colors.danger, fontWeight: '700', marginTop: 6},
  sectionHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 34, marginBottom: 14},
  sectionTitle: {fontSize: 17, fontWeight: '700', color: colors.ink},
  courseCount: {fontSize: 12, fontWeight: '600', color: colors.muted},
  courseCard: {backgroundColor: colors.card, borderRadius: 17, padding: 16, marginBottom: 14, flexDirection: 'row'},
  courseIcon: {width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 13},
  courseIconText: {fontSize: 17, fontWeight: '700', color: colors.ink},
  courseMeta: {flex: 1},
  courseTitle: {fontSize: 15, fontWeight: '700', color: colors.ink, marginTop: 1},
  courseInstructor: {fontSize: 12, color: colors.muted, marginTop: 4},
  progressTrack: {height: 5, borderRadius: 5, backgroundColor: '#E9ECE9', overflow: 'hidden'},
  progressFill: {height: '100%', borderRadius: 5, backgroundColor: colors.accent},
  courseFooter: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 8},
  courseStat: {fontSize: 10, color: colors.muted, fontWeight: '500'},
  continueButton: {marginTop: 12, paddingVertical: 9, borderTopWidth: 1, borderTopColor: colors.border},
  continueText: {color: colors.accent, fontSize: 12, fontWeight: '700'},
  centerState: {alignItems: 'center', paddingVertical: 48},
  stateText: {fontSize: 12, color: colors.muted, lineHeight: 19, marginTop: 8},
  emptyCard: {backgroundColor: colors.card, padding: 20, borderRadius: 16},
  backButton: {alignSelf: 'flex-start', paddingVertical: 8, paddingRight: 12, marginBottom: 24},
  backText: {fontSize: 13, color: colors.accent, fontWeight: '600'},
  detailsTitle: {fontSize: 29, lineHeight: 35, color: colors.ink, fontWeight: '700', letterSpacing: -0.7},
  progressCard: {backgroundColor: colors.card, borderRadius: 16, padding: 18, marginTop: 25},
  progressHeading: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14},
  progressPercent: {fontSize: 19, color: colors.accent, fontWeight: '700'},
  lessonSectionTitle: {marginTop: 30, marginBottom: 13},
  lessonList: {backgroundColor: colors.card, borderRadius: 16, paddingHorizontal: 16},
  lessonRow: {minHeight: 59, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border},
  lessonCheck: {width: 22, height: 22, borderWidth: 1.5, borderColor: '#D0D7D2', borderRadius: 7, alignItems: 'center', justifyContent: 'center', marginRight: 12},
  lessonCheckDone: {backgroundColor: colors.accent, borderColor: colors.accent},
  lessonCheckText: {fontSize: 13, color: 'transparent', fontWeight: '700'},
  lessonCheckTextDone: {color: 'white'},
  lessonTitle: {flex: 1, color: colors.ink, fontSize: 12, fontWeight: '500'},
  lessonStatus: {color: colors.muted, fontSize: 10, marginLeft: 8},
});
