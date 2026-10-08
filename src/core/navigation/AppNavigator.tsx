import React, {useState} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {LoginScreen} from '../../features/auth/screens/LoginScreen';
import {DashboardScreen} from '../../features/courses/dashboard/screens/DashboardScreen';
import {CourseDetailScreen} from '../../features/courses/detail/screens/CourseDetailScreen';
import {Course} from '../../features/courses/domain/course';
import {useCoursesViewModel} from '../../features/courses/presentation/useCoursesViewModel';
import {screenStyles} from '../../features/shared/styles/screenStyles';

type ScreenName = 'login' | 'dashboard' | 'courseDetail';

export default function AppNavigator() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [screen, setScreen] = useState<ScreenName>('login');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const viewModel = useCoursesViewModel();

  async function handleLogin() {
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
    await viewModel.loadCourses();
    setScreen('dashboard');
  }

  function handleOpenCourse(course: Course) {
    setSelectedCourse(course);
    setScreen('courseDetail');
  }

  function handleBackToDashboard() {
    setSelectedCourse(null);
    setScreen('dashboard');
  }

  function handleSignOut() {
    setSelectedCourse(null);
    setPassword('');
    setScreen('login');
  }

  const currentCourse =
    viewModel.courses.find(course => course.id === selectedCourse?.id) ?? selectedCourse;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={screenStyles.safeArea}>
        <StatusBar barStyle="dark-content" />

        {screen === 'login' ? (
          <LoginScreen
            email={email}
            loginError={loginError}
            loginLoading={loginLoading}
            onEmailChange={setEmail}
            onLogin={handleLogin}
            onPasswordChange={setPassword}
          />
        ) : null}

        {screen === 'dashboard' ? (
          <DashboardScreen
            courses={viewModel.courses}
            error={viewModel.error}
            loading={viewModel.loading}
            offline={viewModel.offline}
            onCoursePress={handleOpenCourse}
            onRetry={() => viewModel.loadCourses()}
            onSignOut={handleSignOut}
          />
        ) : null}

        {screen === 'courseDetail' && currentCourse ? (
          <CourseDetailScreen
            course={currentCourse}
            onBack={handleBackToDashboard}
            onToggleLesson={lesson => viewModel.completeLesson(currentCourse.id, lesson.id)}
          />
        ) : null}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
