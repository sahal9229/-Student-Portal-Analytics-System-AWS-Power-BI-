/**
 * Student Course Portal - Client Side Application Logic
 * Manages routing, validations, and hybrid API connections.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Session state
    let currentUser = null;
    let token = null;

    // Azure Function URLs
    const API_URLS = {
        register: "https://bj5vgdxg7d.execute-api.ap-south-1.amazonaws.com/register",
        login: "https://bj5vgdxg7d.execute-api.ap-south-1.amazonaws.com/login",
        courses: "https://bj5vgdxg7d.execute-api.ap-south-1.amazonaws.com/courses",
        dashboard: "https://bj5vgdxg7d.execute-api.ap-south-1.amazonaws.com/dashboard",
        enroll: "https://bj5vgdxg7d.execute-api.ap-south-1.amazonaws.com/enroll"
    };

    // View panels
    const views = {
        login: document.getElementById('view-login'),
        register: document.getElementById('view-register'),
        dashboard: document.getElementById('view-dashboard')
    };

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Dashboard items
    const dashWelcome = document.getElementById('dash-welcome');
    const dashTotalUsers = document.getElementById('dash-total-users');
    const profName = document.getElementById('prof-name');
    const profEmail = document.getElementById('prof-email');
    const profCity = document.getElementById('prof-city');
    const profAge = document.getElementById('prof-age');
    const profGoal = document.getElementById('prof-goal');
    const dashAvatar = document.getElementById('dash-avatar');
    const logoutBtn = document.getElementById('btn-logout');

    // Toast
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toast-icon');
    const toastMessage = document.getElementById('toast-message');

    // -------------------------------------------------------------
    // DATABASE SIMULATION (Offline Fallback Mode)
    // -------------------------------------------------------------
    const seedUsers = [
        { id: "1001", fullName: "Sahal", email: "sahal@gmail.com", password: "password123", city: "Kozhikode", age: 22, skills: ["Python", "SQL", "Power BI"], learningGoal: "Become a Cloud Data Engineer specializing in Azure architectures.", registrationDate: "2026-06-20T10:15:30.000Z" }
    ];

    const seedEnrollments = [
        { UserID: 1001, CourseID: 1 }, { UserID: 1001, CourseID: 2 }, { UserID: 1001, CourseID: 3 }
    ];

    const courseCatalog = {
        1: { name: 'Python', duration: '6 Weeks' },
        2: { name: 'SQL', duration: '4 Weeks' },
        3: { name: 'Power BI', duration: '4 Weeks' },
        4: { name: 'Azure Cloud', duration: '8 Weeks' },
        5: { name: 'Data Science', duration: '12 Weeks' }
    };

    const courseMap = {
        'Python': 1,
        'SQL': 2,
        'Power BI': 3,
        'Azure Cloud': 4,
        'Data Science': 5
    };

    // Initialize mock storages if not present
    if (!localStorage.getItem('portal_users')) {
        localStorage.setItem('portal_users', JSON.stringify(seedUsers));
    }
    if (!localStorage.getItem('portal_enrollments')) {
        localStorage.setItem('portal_enrollments', JSON.stringify(seedEnrollments));
    }

    // -------------------------------------------------------------
    // TOAST NOTIFICATIONS
    // -------------------------------------------------------------
    let toastTimeout;
    function showToast(message, type = 'success') {
        clearTimeout(toastTimeout);
        toast.className = `toast show ${type}`;
        toastMessage.textContent = message;

        if (type === 'success') toastIcon.className = 'fa-solid fa-circle-check';
        else if (type === 'error') toastIcon.className = 'fa-solid fa-circle-exclamation';
        else toastIcon.className = 'fa-solid fa-circle-info';

        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    // -------------------------------------------------------------
    // SPA ROUTER
    // -------------------------------------------------------------
    function handleRouting() {
        const hash = window.location.hash || '#login';
        const targetView = hash.substring(1);

        if (targetView === 'dashboard' && !currentUser) {
            showToast('Please login to enter student portal.', 'error');
            window.location.hash = '#login';
            return;
        }

        Object.keys(views).forEach(key => {
            if (views[key]) views[key].classList.remove('active');
        });

        if (views[targetView]) {
            views[targetView].classList.add('active');
        }

        if (targetView === 'dashboard') {
            loadDashboardData();
        }
    }

    window.addEventListener('hashchange', handleRouting);

    // -------------------------------------------------------------
    // HYBRID API NETWORKING CLIENT
    // -------------------------------------------------------------
    async function apiFetch(endpoint, options = {}) {
        let baseUrl = '';

        if (endpoint.startsWith('/register')) {
            baseUrl = API_URLS.register;
        }
        else if (endpoint.startsWith('/login')) {
            baseUrl = API_URLS.login;
        }
        else if (endpoint.startsWith('/dashboard')) {
            baseUrl = API_URLS.dashboard;
        }
        else if (endpoint.startsWith('/enroll')) {
            baseUrl = API_URLS.enroll;
        }
        
        const queryString = endpoint.includes('?') ? endpoint.substring(endpoint.indexOf('?')) : '';
        const url = baseUrl + queryString;
        
        try {
            // Attempt actual fetch call to AWS Lambda / API Gateway
            const response = await fetch(url, options);
            const data = await response.json();
            return { ok: response.ok, status: response.status, data };

        } catch (netError) {
            // Network failure fallback: Simulate execution locally using localStorage
            const method = (options.method || 'GET').toUpperCase();
            const body = options.body ? JSON.parse(options.body) : null;
            
            // Artificial delay to mimic latency
            await new Promise(r => setTimeout(r, 800));

            return simulateBackendRequest(endpoint, method, body);
        }
    }

    function simulateBackendRequest(endpoint, method, body) {
        const localUsers = JSON.parse(localStorage.getItem('portal_users')) || [];
        const localEnrollments = JSON.parse(localStorage.getItem('portal_enrollments')) || [];

        // 1. POST /register
        if (endpoint === '/register' && method === 'POST') {
            const { fullName, email, password, city, age, course, learningGoal } = body;

            if (localUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                return { ok: false, status: 409, data: { message: "Email already registered" } };
            }

            const newId = (1000 + localUsers.length + 1).toString();
            const registrationDate = new Date().toISOString();

            const newStudent = {
                id: newId,
                fullName,
                email: email.toLowerCase().trim(),
                password,
                city,
                age: parseInt(age),
                course,
                skills: [course],
                learningGoal,
                registrationDate
            };

            localUsers.push(newStudent);
            localStorage.setItem('portal_users', JSON.stringify(localUsers));

            const courseNameOnly = course ? course.replace(/\s*\([^)]*\)/g, '') : '';
            const courseId = courseMap[courseNameOnly] || 1;
            localEnrollments.push({ UserID: parseInt(newId), CourseID: courseId });
            localStorage.setItem('portal_enrollments', JSON.stringify(localEnrollments));

            return {
                ok: true,
                status: 201,
                data: {
                    message: "Student registered successfully",
                    userId: newId,
                    registrationDate
                }
            };
        }

        // 2. POST /login
        if (endpoint === '/login' && method === 'POST') {
            const { email, password } = body;
            const matched = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

            if (matched) {
                const token = btoa(JSON.stringify({ userId: matched.id, exp: Date.now() + 86400000 }));
                return {
                    ok: true,
                    status: 200,
                    data: {
                        message: "Login successful",
                        token,
                        user: matched,
                        studentId: matched.id,
                        fullName: matched.fullName,
                        email: matched.email,
                        city: matched.city,
                        age: matched.age,
                        learningGoal: matched.learningGoal
                    }
                };
            } else {
                return { ok: false, status: 401, data: { error: "Invalid email or password" } };
            }
        }

        // 3. GET /dashboard
        if (endpoint.startsWith('/dashboard') && method === 'GET') {
            const params = new URLSearchParams(endpoint.split('?')[1] || '');
            const userId = parseInt(params.get('userId'));

            const totalStudents = 124 + localUsers.length;

            const registeredCourses = localEnrollments
                .filter(e => e.UserID === userId)
                .map(e => courseCatalog[e.CourseID] ? courseCatalog[e.CourseID].name : null)
                .filter(name => name !== null);

            return {
                ok: true,
                status: 200,
                data: {
                    totalStudents,
                    registeredCourses
                }
            };
        }

        // 4. POST /enroll
        if (endpoint === '/enroll' && method === 'POST') {
            const { studentId, course } = body;
            
            const matched = localUsers.find(u => u.id === studentId || u.studentId === studentId);
            if (matched) {
                matched.course = course;
                localStorage.setItem('portal_users', JSON.stringify(localUsers));
                return {
                    ok: true,
                    status: 200,
                    data: {
                        message: "Enrollment successful",
                        course
                    }
                };
            }
            return { ok: false, status: 404, data: { error: "Student not found" } };
        }

        return { ok: false, status: 404, data: { error: "Endpoint not found" } };
    }

    // -------------------------------------------------------------
    // SIGN IN & REGISTRATION EVENTS
    // -------------------------------------------------------------
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            document.getElementById('err-login-email').textContent = '';
            document.getElementById('err-login-password').textContent = '';

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            let isValid = true;

            if (!email) {
                document.getElementById('err-login-email').textContent = 'Email is required';
                isValid = false;
            }
            if (!password) {
                document.getElementById('err-login-password').textContent = 'Password is required';
                isValid = false;
            }

            if (!isValid) return;

            const submitBtn = document.getElementById('btn-login');
            submitBtn.classList.add('loading');

            const result = await apiFetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            submitBtn.classList.remove('loading');

            if (result.ok) {
                console.log("Login API Response Data:", result.data);
                const userData = result.data.user || result.data;
                currentUser = {
                    studentId: userData.studentId || userData.studentID || userData.id || userData.UserID || '',
                    fullName: userData.fullName || userData.FullName || '',
                    email: userData.email || userData.Email || email,
                    city: userData.city || userData.City || '',
                    age: userData.age || userData.Age || '',
                    course: userData.course || userData.Course || '',
                    learningGoal: userData.learningGoal || userData.learninggoal || userData.LearningGoal || ''
                };

                sessionStorage.setItem(
                    'current_student_session',
                    JSON.stringify(currentUser)
                );

                showToast('Login successful! Welcome to the portal.', 'success');

                setTimeout(() => {
                    window.location.hash = '#dashboard';
                }, 800);
            } else {
                document.getElementById('err-login-password').textContent = result.data.error || 'Invalid credentials';
                showToast(result.data.error || 'Authentication failed', 'error');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear errors
            document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

            const fullName = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const password = document.getElementById('reg-password').value;
            const city = document.getElementById('reg-city').value.trim();
            const age = document.getElementById('reg-age').value;
            const course = document.getElementById('reg-course').value;
            const learningGoal = document.getElementById('reg-goal').value.trim();

            let isValid = true;

            if (!fullName) { document.getElementById('err-reg-name').textContent = 'Name is required'; isValid = false; }
            if (!email) { document.getElementById('err-reg-email').textContent = 'Email is required'; isValid = false; }
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { document.getElementById('err-reg-email').textContent = 'Invalid format'; isValid = false; }
            if (!password) { document.getElementById('err-reg-password').textContent = 'Password is required'; isValid = false; }
            else if (password.length < 8) { document.getElementById('err-reg-password').textContent = 'Password must be 8+ characters'; isValid = false; }
            if (!city) { document.getElementById('err-reg-city').textContent = 'City is required'; isValid = false; }
            
            const parsedAge = parseInt(age);
            if (!age) { document.getElementById('err-reg-age').textContent = 'Age is required'; isValid = false; }
            else if (isNaN(parsedAge) || parsedAge <= 0) { document.getElementById('err-reg-age').textContent = 'Positive age required'; isValid = false; }
            
            if (!course) { document.getElementById('err-reg-course').textContent = 'Please select a course'; isValid = false; }

            if (!isValid) return;

            const submitBtn = document.getElementById('btn-register');
            submitBtn.classList.add('loading');

            const result = await apiFetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password, city, age: parsedAge, course, learningGoal })
            });

            submitBtn.classList.remove('loading');

            if (result.ok) {
                showToast('Registration successful! Please login.', 'success');
                registerForm.reset();
                setTimeout(() => {
                    window.location.hash = '#login';
                }, 1200);
            } else {
                const errMsg = result.data.error || result.data.message || 'Registration failed';
                showToast(errMsg, 'error');
                if (result.status === 409 || 
                    result.data.message === "Email already registered" ||
                    errMsg.toLowerCase().includes('already') || 
                    errMsg.toLowerCase().includes('conflict') || 
                    errMsg.toLowerCase().includes('duplicate') || 
                    errMsg.toLowerCase().includes('exist')) {
                    document.getElementById('err-reg-email').textContent = "An account with this email already exists.";
                }
            }
        });
    }


    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            currentUser = null;
            token = null;
            sessionStorage.removeItem('current_student_session');
            showToast('Logged out of course session.', 'info');
            setTimeout(() => {
                window.location.hash = '#login';
            }, 800);
        });
    }

    // -------------------------------------------------------------
    // RENDER PROFILE DETAILS
    // -------------------------------------------------------------
    async function loadDashboardData() {
        if (!currentUser) return;

        // Render initial values from session
        const initialCourse = currentUser.course || currentUser.Course || '';
        const initialCity = currentUser.city || currentUser.City || '';
        const initialAge = currentUser.age || currentUser.Age || '';
        const initialGoal = currentUser.learningGoal || currentUser.learninggoal || currentUser.LearningGoal || '';

        dashWelcome.textContent = `Welcome, ${currentUser.fullName || ''}`;
        dashAvatar.textContent = (currentUser.fullName || 'S').charAt(0).toUpperCase();

        profName.textContent = currentUser.fullName || '';
        profEmail.textContent = currentUser.email || '';
        profCity.textContent = initialCity || '';
        profAge.textContent = initialAge || '';
        profGoal.textContent = initialGoal || 'None set.';

        // Render dynamic registered courses based on currentUser session course first
        const coursesGrid = document.getElementById('student-courses-grid');
        coursesGrid.innerHTML = '';

        if (initialCourse) {
            let duration = '4 Weeks';
            const match = initialCourse.match(/\(([^)]+)\)/);
            if (match) {
                duration = match[1];
            } else {
                const mapped = Object.values(courseCatalog).find(c => c.name === initialCourse);
                if (mapped) {
                    duration = mapped.duration;
                }
            }

            const badge = document.createElement('div');
            badge.className = 'course-badge';
            badge.innerHTML = `
                <div class="course-info">
                    <h4>${initialCourse}</h4>
                    <span>Active Enrollment</span>
                </div>
                <span class="course-duration">${duration}</span>
            `;
            coursesGrid.appendChild(badge);
        } else {
            coursesGrid.innerHTML = '<p class="text-muted">No courses registered.</p>';
        }

        // Fetch dynamic registration count, active enrollments, and possibly full profile
        const studentId = currentUser.studentId || currentUser.id;
        const result = await apiFetch(`/dashboard?userId=${studentId}`);
        console.log("Dashboard API Response Data:", result ? result.data : null);

        if (result && result.ok) {
            // Update profile fields if returned in the dashboard response
            const profileData = result.data.student || result.data.user || result.data;
            let needsUpdate = false;
            
            const emailVal = profileData.email || profileData.Email;
            if (emailVal && currentUser.email !== emailVal) {
                currentUser.email = emailVal;
                profEmail.textContent = emailVal;
                needsUpdate = true;
            }
            const cityVal = profileData.city || profileData.City;
            if (cityVal && (currentUser.city !== cityVal || !initialCity)) {
                currentUser.city = cityVal;
                profCity.textContent = cityVal;
                needsUpdate = true;
            }
            const ageVal = profileData.age || profileData.Age;
            if (ageVal && (currentUser.age !== ageVal || !initialAge)) {
                currentUser.age = ageVal;
                profAge.textContent = ageVal;
                needsUpdate = true;
            }
            const courseVal = profileData.course || profileData.Course;
            if (courseVal && (currentUser.course !== courseVal || !initialCourse)) {
                currentUser.course = courseVal;
                needsUpdate = true;
                
                // Re-render course grid to match database update
                coursesGrid.innerHTML = '';
                const duration = courseVal.match(/\(([^)]+)\)/) ? courseVal.match(/\(([^)]+)\)/)[1] : '4 Weeks';
                const badge = document.createElement('div');
                badge.className = 'course-badge';
                badge.innerHTML = `
                    <div class="course-info">
                        <h4>${courseVal}</h4>
                        <span>Active Enrollment</span>
                    </div>
                    <span class="course-duration">${duration}</span>
                `;
                coursesGrid.appendChild(badge);
            }
            const goalVal = profileData.learningGoal || profileData.learninggoal || profileData.LearningGoal;
            if (goalVal && (currentUser.learningGoal !== goalVal || !initialGoal)) {
                currentUser.learningGoal = goalVal;
                profGoal.textContent = goalVal;
                needsUpdate = true;
            }
            
            if (needsUpdate) {
                // Save updated session details back to storage
                sessionStorage.setItem('current_student_session', JSON.stringify(currentUser));
            }

            dashTotalUsers.textContent = `Total Students: ${result.data.totalStudents}`;
        }
    }

    // -------------------------------------------------------------
    // STARTUP RUN
    // -------------------------------------------------------------
    function checkSession() {
        const active = sessionStorage.getItem('current_student_session');
        if (active) {
            currentUser = JSON.parse(active);
        }
    }

    checkSession();
    handleRouting();
});
