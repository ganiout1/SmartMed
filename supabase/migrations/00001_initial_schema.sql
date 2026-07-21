-- Enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'lecturer', 'student');

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role user_role NOT NULL DEFAULT 'student',
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Admins can do anything
CREATE POLICY "Admins have full access to profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Users can read their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Function to handle new user signup from auth.users to public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        new.id, 
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 
        new.email, 
        COALESCE((new.raw_user_meta_data->>'role')::user_role, 'student'::user_role)
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 2. COURSES TABLE
-- ============================================================================
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to courses" ON public.courses
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Lecturers can read courses they are assigned to
CREATE POLICY "Lecturers can view assigned courses" ON public.courses
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.course_lecturers WHERE course_id = public.courses.id AND lecturer_id = auth.uid())
    );

-- Students can read courses they are enrolled in
CREATE POLICY "Students can view enrolled courses" ON public.courses
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.course_members WHERE course_id = public.courses.id AND student_id = auth.uid())
    );

-- ============================================================================
-- 3. COURSE_LECTURERS TABLE
-- ============================================================================
CREATE TABLE public.course_lecturers (
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    lecturer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (course_id, lecturer_id)
);

ALTER TABLE public.course_lecturers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to course_lecturers" ON public.course_lecturers
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Lecturers can view their own assignments" ON public.course_lecturers
    FOR SELECT USING (lecturer_id = auth.uid());

-- ============================================================================
-- 4. ENROLLMENT_KEYS TABLE
-- ============================================================================
CREATE TABLE public.enrollment_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    key_code TEXT NOT NULL UNIQUE,
    usage_limit INTEGER,
    usage_count INTEGER NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.enrollment_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to enrollment_keys" ON public.enrollment_keys
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Students can read keys during enrollment
CREATE POLICY "Students can read enrollment_keys" ON public.enrollment_keys
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'student')
    );

-- ============================================================================
-- 5. COURSE_MEMBERS TABLE
-- ============================================================================
CREATE TABLE public.course_members (
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (course_id, student_id)
);

ALTER TABLE public.course_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to course_members" ON public.course_members
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Lecturers can view students in their courses" ON public.course_members
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.course_lecturers WHERE course_id = public.course_members.course_id AND lecturer_id = auth.uid())
    );

CREATE POLICY "Students can view their own enrollments" ON public.course_members
    FOR SELECT USING (student_id = auth.uid());

-- Students can insert themselves using enrollment keys (handled via server logic ideally, but allowing insert here)
CREATE POLICY "Students can insert their own enrollment" ON public.course_members
    FOR INSERT WITH CHECK (student_id = auth.uid());

-- ============================================================================
-- 6. QUIZZES TABLE
-- ============================================================================
CREATE TABLE public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    passing_score INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to quizzes" ON public.quizzes
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Lecturers can manage quizzes in their courses" ON public.quizzes
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.course_lecturers WHERE course_id = public.quizzes.course_id AND lecturer_id = auth.uid())
    );

CREATE POLICY "Students can view quizzes in enrolled courses" ON public.quizzes
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.course_members WHERE course_id = public.quizzes.course_id AND student_id = auth.uid())
    );

-- ============================================================================
-- 7. QUESTIONS TABLE
-- ============================================================================
CREATE TABLE public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    explanation_text TEXT,
    explanation_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to questions" ON public.questions
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Lecturers can manage questions in their quizzes" ON public.questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.quizzes q
            JOIN public.course_lecturers cl ON q.course_id = cl.course_id
            WHERE q.id = public.questions.quiz_id AND cl.lecturer_id = auth.uid()
        )
    );

CREATE POLICY "Students can view questions for active quizzes" ON public.questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.quizzes q
            JOIN public.course_members cm ON q.course_id = cm.course_id
            WHERE q.id = public.questions.quiz_id AND cm.student_id = auth.uid()
        )
    );

-- ============================================================================
-- 8. QUIZ_ATTEMPTS TABLE
-- ============================================================================
CREATE TABLE public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    score INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to quiz_attempts" ON public.quiz_attempts
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Lecturers can view attempts in their courses" ON public.quiz_attempts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.quizzes q
            JOIN public.course_lecturers cl ON q.course_id = cl.course_id
            WHERE q.id = public.quiz_attempts.quiz_id AND cl.lecturer_id = auth.uid()
        )
    );

CREATE POLICY "Students can view their own attempts" ON public.quiz_attempts
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can insert their own attempts" ON public.quiz_attempts
    FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their own attempts" ON public.quiz_attempts
    FOR UPDATE USING (student_id = auth.uid());

-- ============================================================================
-- 9. ANSWERS TABLE
-- ============================================================================
CREATE TABLE public.answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES public.quiz_attempts(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
    selected_option CHAR(1) CHECK (selected_option IN ('A', 'B', 'C', 'D')),
    is_correct BOOLEAN,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (attempt_id, question_id)
);

ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to answers" ON public.answers
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Lecturers can view answers in their courses" ON public.answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.quiz_attempts qa
            JOIN public.quizzes q ON qa.quiz_id = q.id
            JOIN public.course_lecturers cl ON q.course_id = cl.course_id
            WHERE qa.id = public.answers.attempt_id AND cl.lecturer_id = auth.uid()
        )
    );

CREATE POLICY "Students can view their own answers" ON public.answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.quiz_attempts qa
            WHERE qa.id = public.answers.attempt_id AND qa.student_id = auth.uid()
        )
    );

CREATE POLICY "Students can insert their own answers" ON public.answers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.quiz_attempts qa
            WHERE qa.id = public.answers.attempt_id AND qa.student_id = auth.uid()
        )
    );

CREATE POLICY "Students can update their own answers" ON public.answers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.quiz_attempts qa
            WHERE qa.id = public.answers.attempt_id AND qa.student_id = auth.uid()
        )
    );
