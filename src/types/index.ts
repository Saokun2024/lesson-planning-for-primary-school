export type Language = 'km' | 'en';

export type PrimaryGrade = 'grade1' | 'grade2' | 'grade3' | 'grade4' | 'grade5' | 'grade6';

export type SubjectId = 'khmer' | 'math' | 'science' | 'social' | 'art' | 'pe';

export type PlanStatus = 'draft' | 'submitted' | 'approved' | 'revision';

export interface LessonStep {
  stepNumber: 1 | 2 | 3 | 4 | 5;
  stepNameKm: string;
  stepNameEn: string;
  durationMinutes: number;
  teacherActivityKm: string;
  teacherActivityEn: string;
  studentActivityKm: string;
  studentActivityEn: string;
  keyContentKm: string;
  keyContentEn: string;
}

export interface LessonObjective {
  knowledgeKm: string;
  knowledgeEn: string;
  skillKm: string;
  skillEn: string;
  attitudeKm: string;
  attitudeEn: string;
}

export interface AdminFeedback {
  id: string;
  reviewerName: string;
  reviewerRole: 'principal' | 'deputy_principal' | 'pedagogy_head';
  reviewerAvatar?: string;
  date: string;
  status: PlanStatus;
  overallRating: number; // 1 to 5
  curriculumAlignment: number; // 1 to 5
  pedagogicalMethod: number; // 1 to 5
  timeAllocation: number; // 1 to 5
  commentsKm: string;
  commentsEn: string;
  approvedDate?: string;
}

export interface LessonPlan {
  id: string;
  schoolNameKm: string;
  schoolNameEn: string;
  provinceKm: string;
  provinceEn: string;
  teacherNameKm: string;
  teacherNameEn: string;
  grade: PrimaryGrade;
  subject: SubjectId;
  chapterKm: string;
  chapterEn: string;
  lessonTitleKm: string;
  lessonTitleEn: string;
  subTopicKm: string;
  subTopicEn: string;
  date: string;
  durationMinutes: number;
  totalStudents: number;
  femaleStudents: number;
  objectives: LessonObjective;
  teachingAidsKm: string;
  teachingAidsEn: string;
  blackboardNotesKm: string;
  blackboardNotesEn: string;
  steps: LessonStep[];
  status: PlanStatus;
  feedbacks: AdminFeedback[];
  isShared: boolean;
  sharedLikes: number;
  sharedDownloads: number;
  tags: string[];
  lastModified: string;
  syncStatus: 'synced' | 'pending';
}

export interface SharedResource {
  id: string;
  titleKm: string;
  titleEn: string;
  descriptionKm: string;
  descriptionEn: string;
  authorName: string;
  schoolName: string;
  grade: PrimaryGrade;
  subject: SubjectId;
  resourceType: 'lesson_plan' | 'worksheet' | 'teaching_aid' | 'assessment';
  likesCount: number;
  downloadsCount: number;
  createdAt: string;
  lessonPlanData?: LessonPlan;
}

export interface DeadlineReminder {
  id: string;
  titleKm: string;
  titleEn: string;
  dueDate: string;
  type: 'plan_submission' | 'inspection' | 'exam' | 'holiday';
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface UserProfile {
  id: string;
  nameKm: string;
  nameEn: string;
  role: 'teacher' | 'principal';
  schoolNameKm: string;
  schoolNameEn: string;
  province: string;
  gradeAssigned: PrimaryGrade;
  biometricEnabled: boolean;
  pinCode?: string;
  avatarUrl: string;
}
