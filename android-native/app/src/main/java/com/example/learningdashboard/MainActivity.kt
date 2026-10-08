package com.example.learningdashboard

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private data class Lesson(
    val id: String,
    val title: String,
    val completed: Boolean = false,
)

private data class Course(
    val id: Int,
    val title: String,
    val instructor: String,
    val progress: Int,
    val totalLessons: Int,
    val lessons: List<Lesson>
)

private val sampleCourses = listOf(
    Course(
        id = 1,
        title = "Compose Fundamentals",
        instructor = "Alicia Nguyen",
        progress = 62,
        totalLessons = 8,
        lessons = listOf(
            Lesson("1", "Layouts", true),
            Lesson("2", "States", true),
            Lesson("3", "Modifiers", true),
            Lesson("4", "Theming", false),
            Lesson("5", "Animations", false),
            Lesson("6", "Lists", false),
            Lesson("7", "Accessibility", false),
            Lesson("8", "Testing", false),
        )
    ),
    Course(
        id = 2,
        title = "Android Architecture",
        instructor = "Darius Brooks",
        progress = 41,
        totalLessons = 6,
        lessons = listOf(
            Lesson("1", "MVVM Intro", true),
            Lesson("2", "ViewModels", true),
            Lesson("3", "State Holders", false),
            Lesson("4", "Repositories", false),
            Lesson("5", "Testing", false),
            Lesson("6", "Performance", false),
        )
    ),
    Course(
        id = 3,
        title = "Productivity Playbook",
        instructor = "Mina Patel",
        progress = 18,
        totalLessons = 5,
        lessons = listOf(
            Lesson("1", "Planning", true),
            Lesson("2", "Prioritization", false),
            Lesson("3", "Focus Blocks", false),
            Lesson("4", "Deep Work", false),
            Lesson("5", "Review", false),
        )
    )
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                LearningDashboardApp()
            }
        }
    }
}

@Composable
private fun LearningDashboardApp() {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var loginError by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var signedIn by remember { mutableStateOf(false) }
    var selectedCourse by remember { mutableStateOf<Course?>(null) }
    var courses by remember { mutableStateOf(sampleCourses) }
    val scope = rememberCoroutineScope()

    fun validateLogin(): Boolean {
        val emailValid = email.trim().matches(Regex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"))
        val passwordValid = password.length >= 6
        loginError = when {
            !emailValid -> "Enter a valid email address."
            !passwordValid -> "Password must be at least 6 characters."
            else -> ""
        }
        return loginError.isEmpty()
    }

    fun login() {
        if (!validateLogin()) return
        isLoading = true
        scope.launch {
            delay(450)
            isLoading = false
            signedIn = true
        }
    }

    fun toggleLesson(courseId: Int, lessonId: String) {
        courses = courses.map { course ->
            if (course.id != courseId) return@map course
            val updatedLessons = course.lessons.map { lesson ->
                if (lesson.id == lessonId && !lesson.completed) {
                    lesson.copy(completed = true)
                } else {
                    lesson
                }
            }
            val totalCompleted = updatedLessons.count { it.completed }
            val progress = ((totalCompleted.toFloat() / course.totalLessons.toFloat()) * 100).toInt()
            course.copy(lessons = updatedLessons, progress = progress)
        }
        selectedCourse = courses.firstOrNull { it.id == courseId }
    }

    when {
        !signedIn -> LoginScreen(
            email = email,
            password = password,
            loginError = loginError,
            loginLoading = isLoading,
            onEmailChange = { email = it },
            onPasswordChange = { password = it },
            onLogin = ::login,
        )
        selectedCourse != null -> CourseDetailScreen(
            course = selectedCourse!!,
            onBack = { selectedCourse = null },
            onToggleLesson = { lesson -> toggleLesson(selectedCourse!!.id, lesson.id) }
        )
        else -> DashboardScreen(
            courses = courses,
            onCoursePress = { selectedCourse = it },
            onSignOut = {
                selectedCourse = null
                signedIn = false
                email = ""
                password = ""
                loginError = ""
            }
        )
    }
}

@Composable
private fun LoginScreen(
    email: String,
    password: String,
    loginError: String,
    loginLoading: Boolean,
    onEmailChange: (String) -> Unit,
    onPasswordChange: (String) -> Unit,
    onLogin: () -> Unit,
) {
    Scaffold { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 26.dp, vertical = 28.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.Center,
        ) {
            Box(
                modifier = Modifier
                    .size(46.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(Color(0xFF176B52)),
                contentAlignment = Alignment.Center,
            ) {
                Text("L", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 24.sp)
            }

            Spacer(modifier = Modifier.height(34.dp))
            Text("YOUR LEARNING SPACE", color = Color(0xFF176B52), fontSize = 10.sp, letterSpacing = 1.8.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(10.dp))
            Text("A little progress\ngoes a long way.", fontSize = 35.sp, lineHeight = 42.sp, fontWeight = FontWeight.Bold, color = Color(0xFF17251F))
            Spacer(modifier = Modifier.height(8.dp))
            Text("Sign in to pick up where you left off.", fontSize = 14.sp, color = Color(0xFF78827C))

            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 34.dp),
                shape = RoundedCornerShape(20.dp),
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("EMAIL", color = Color(0xFF78827C), fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.2.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = email,
                        onValueChange = onEmailChange,
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("you@example.com") },
                        singleLine = true,
                    )

                    Spacer(modifier = Modifier.height(12.dp))
                    Text("PASSWORD", color = Color(0xFF78827C), fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.2.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = password,
                        onValueChange = onPasswordChange,
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("At least 6 characters") },
                        singleLine = true,
                        visualTransformation = PasswordVisualTransformation(),
                    )

                    if (loginError.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(loginError, color = Color(0xFFAA3E35), fontSize = 12.sp)
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Button(
                        onClick = onLogin,
                        modifier = Modifier.fillMaxWidth(),
                        enabled = !loginLoading,
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF176B52))
                    ) {
                        if (loginLoading) {
                            CircularProgressIndicator(color = Color.White, modifier = Modifier.size(18.dp), strokeWidth = 2.dp)
                        } else {
                            Text("Sign in", color = Color.White, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))
            Text("Demo login · use any valid email and password (6+ characters)", color = Color(0xFF78827C), fontSize = 11.sp, lineHeight = 17.sp)
        }
    }
}

@Composable
private fun DashboardScreen(
    courses: List<Course>,
    onCoursePress: (Course) -> Unit,
    onSignOut: () -> Unit,
) {
    Scaffold { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 24.dp, vertical = 26.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                Column {
                    Text("LEARNER DASHBOARD", color = Color(0xFF176B52), fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.8.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Good to see you.", fontSize = 27.sp, fontWeight = FontWeight.Bold, color = Color(0xFF17251F))
                }
                TextButton(onClick = onSignOut) {
                    Text("Sign out", color = Color(0xFF17251F))
                }
            }

            Spacer(modifier = Modifier.height(8.dp))
            Text("Keep your momentum going.", color = Color(0xFF78827C), fontSize = 14.sp)

            Spacer(modifier = Modifier.height(26.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text("Your courses", fontSize = 17.sp, fontWeight = FontWeight.Bold, color = Color(0xFF17251F))
                Text(courses.size.toString().padStart(2, '0'), fontSize = 12.sp, color = Color(0xFF78827C), fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(16.dp))
            courses.forEachIndexed { index, course ->
                CourseCard(course = course, index = index, onPress = onCoursePress)
            }
        }
    }
}

@Composable
private fun CourseCard(
    course: Course,
    index: Int,
    onPress: (Course) -> Unit,
) {
    val accentColors = listOf(Color(0xFFDDEBE4), Color(0xFFEDE7D9), Color(0xFFE5E1EE))
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 14.dp)
            .clickable { onPress(course) },
        shape = RoundedCornerShape(17.dp),
    ) {
        Row(modifier = Modifier.padding(16.dp)) {
            Box(
                modifier = Modifier
                    .size(42.dp)
                    .clip(RoundedCornerShape(13.dp))
                    .background(accentColors[index % accentColors.size]),
                contentAlignment = Alignment.Center,
            ) {
                Text(course.title.first().toString(), fontWeight = FontWeight.Bold, color = Color(0xFF17251F))
            }

            Spacer(modifier = Modifier.width(13.dp))
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(course.title, fontWeight = FontWeight.Bold, color = Color(0xFF17251F), fontSize = 15.sp)
                Text(course.instructor, color = Color(0xFF78827C), fontSize = 12.sp, modifier = Modifier.padding(top = 4.dp))
                Spacer(modifier = Modifier.height(8.dp))
                ProgressBar(course.progress)
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                    Text("${course.progress}% complete", color = Color(0xFF78827C), fontSize = 10.sp)
                    Text("${course.totalLessons} lessons", color = Color(0xFF78827C), fontSize = 10.sp)
                }
                Spacer(modifier = Modifier.height(12.dp))
                Text("Continue learning  →", color = Color(0xFF176B52), fontWeight = FontWeight.Bold, fontSize = 12.sp)
            }
        }
    }
}

@Composable
private fun ProgressBar(progress: Int) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(5.dp)
            .clip(RoundedCornerShape(50))
            .background(Color(0xFFE9ECE9))
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth(progress / 100f)
                .height(5.dp)
                .clip(RoundedCornerShape(50))
                .background(Color(0xFF176B52))
        )
    }
}

@Composable
private fun CourseDetailScreen(
    course: Course,
    onBack: () -> Unit,
    onToggleLesson: (Lesson) -> Unit,
) {
    Scaffold { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 24.dp, vertical = 26.dp)
                .verticalScroll(rememberScrollState())
        ) {
            TextButton(onClick = onBack, modifier = Modifier.align(Alignment.Start)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFF176B52))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("All courses", color = Color(0xFF176B52))
                }
            }

            Text("COURSE DETAILS", color = Color(0xFF176B52), fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.8.sp)
            Spacer(modifier = Modifier.height(10.dp))
            Text(course.title, fontSize = 29.sp, fontWeight = FontWeight.Bold, color = Color(0xFF17251F))
            Spacer(modifier = Modifier.height(6.dp))
            Text("${course.instructor} · ${course.totalLessons} lessons", color = Color(0xFF78827C), fontSize = 12.sp)

            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 24.dp),
                shape = RoundedCornerShape(16.dp),
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text("Your progress", fontSize = 17.sp, fontWeight = FontWeight.Bold, color = Color(0xFF17251F))
                        Text("${course.progress}%", color = Color(0xFF176B52), fontWeight = FontWeight.Bold, fontSize = 19.sp)
                    }
                    Spacer(modifier = Modifier.height(14.dp))
                    ProgressBar(course.progress)
                }
            }

            Spacer(modifier = Modifier.height(30.dp))
            Text("Lessons", fontSize = 17.sp, fontWeight = FontWeight.Bold, color = Color(0xFF17251F))
            Spacer(modifier = Modifier.height(12.dp))
            Card(shape = RoundedCornerShape(16.dp), modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                    course.lessons.forEach { lesson ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 14.dp)
                                .clickable(enabled = !lesson.completed) { onToggleLesson(lesson) },
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(22.dp)
                                    .clip(RoundedCornerShape(7.dp))
                                    .border(1.5.dp, if (lesson.completed) Color(0xFF176B52) else Color(0xFFD0D7D2), RoundedCornerShape(7.dp))
                                    .background(if (lesson.completed) Color(0xFF176B52) else Color.Transparent),
                                contentAlignment = Alignment.Center,
                            ) {
                                if (lesson.completed) {
                                    Icon(Icons.Filled.Check, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                                }
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Text(lesson.title, modifier = Modifier.weight(1f), color = Color(0xFF17251F), fontSize = 12.sp)
                            Text(if (lesson.completed) "Completed" else "Mark done", color = Color(0xFF78827C), fontSize = 10.sp)
                        }
                    }
                }
            }
        }
    }
}
