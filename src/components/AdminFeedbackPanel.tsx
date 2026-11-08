import React, { useState } from 'react';
import { LessonPlan, AdminFeedback, Language, PlanStatus } from '../types';
import { useTranslation } from '../data/translations';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MessageSquare, 
  Star, 
  UserCheck, 
  Check, 
  X, 
  Calendar 
} from 'lucide-react';

interface AdminFeedbackPanelProps {
  plans: LessonPlan[];
  onReviewSubmit: (planId: string, feedback: AdminFeedback) => void;
  lang: Language;
}

export const AdminFeedbackPanel: React.FC<AdminFeedbackPanelProps> = ({
  plans,
  onReviewSubmit,
  lang,
}) => {
  const t = useTranslation(lang);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || '');
  const [reviewerName, setReviewerName] = useState('លោកនាយក សុខា ចេត');
  const [ratingCurriculum, setRatingCurriculum] = useState(5);
  const [ratingPedagogy, setRatingPedagogy] = useState(5);
  const [ratingTime, setRatingTime] = useState(4);
  const [comments, setComments] = useState('');
  const [reviewStatus, setReviewStatus] = useState<PlanStatus>('approved');
  const [submitNotice, setSubmitNotice] = useState(false);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const newFeedback: AdminFeedback = {
      id: `fb-${Date.now()}`,
      reviewerName,
      reviewerRole: 'principal',
      reviewerAvatar: '/src/assets/images/avatar_principal_sokha_1794125376568.jpg',
      date: new Date().toISOString().slice(0, 10),
      status: reviewStatus,
      overallRating: Math.round((ratingCurriculum + ratingPedagogy + ratingTime) / 3),
      curriculumAlignment: ratingCurriculum,
      pedagogicalMethod: ratingPedagogy,
      timeAllocation: ratingTime,
      commentsKm: comments || (reviewStatus === 'approved' 
        ? 'កិច្ចតែងការនេះរៀបចំបានត្រឹមត្រូវតាមស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡា។ បានឯកភាព!' 
        : 'សូមពិនិត្យបន្ថែមលើសកម្មភាពសិស្សក្នុងជំហានទី៣ និងការបែងចែកពេលវេលា។'),
      commentsEn: comments || (reviewStatus === 'approved' 
        ? 'Approved. Strong alignment with MoEYS primary standards.' 
        : 'Please refine student active learning in Step 3.'),
      approvedDate: reviewStatus === 'approved' ? new Date().toISOString().slice(0, 10) : undefined,
    };

    onReviewSubmit(selectedPlan.id, newFeedback);
    setComments('');
    setSubmitNotice(true);
    setTimeout(() => setSubmitNotice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-khmer">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
            <Award className="w-4 h-4" />
            <span>{lang === 'km' ? 'គណៈគ្រប់គ្រង និងអធិការកិច្ចសាលារៀន' : 'School Inspection & Leadership Portal'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-khmer-heading">
            {t.adminFeedbackTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'km' 
              ? 'ការត្រួតពិនិត្យ ផ្តល់យោបល់កែលម្អ និងចុះហត្ថលេខាឯកភាពលើកិច្ចតែងការបង្រៀនរបស់គ្រូ' 
              : 'Review submitted teacher lesson plans, provide pedagogical coaching, and issue administrative approval.'}
          </p>
        </div>

        {submitNotice && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <Check className="w-4 h-4" />
            <span>{lang === 'km' ? 'បានបញ្ជូនមតិយោបល់ និងត្រាអនុម័ត!' : 'Feedback & stamp recorded!'}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Lesson plans queue */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white font-khmer-heading">
            {lang === 'km' ? 'បញ្ជីកិច្ចតែងការរង់ចាំការពិនិត្យ' : 'Pending Lesson Plans'}
          </h2>

          <div className="space-y-2">
            {plans.map((p) => {
              const isSelected = selectedPlan?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/50 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-bold text-blue-700 dark:text-blue-400">
                      {p.grade.replace('grade', 'ថ្នាក់ទី')}
                    </span>
                    <span className="font-mono text-[11px]">{p.date}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-khmer-heading line-clamp-1">
                    {p.lessonTitleKm}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                    <span>{p.teacherNameKm}</span>
                    <span className="capitalize font-mono text-[11px]">{p.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Inspection Rubric & Review Form */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPlan ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              
              {/* Plan brief header */}
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-1">
                  <span>{selectedPlan.schoolNameKm} · {selectedPlan.provinceKm}</span>
                  <span className="font-mono text-[11px]">{selectedPlan.date} ({selectedPlan.durationMinutes} នាទី)</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-khmer-heading">
                  {selectedPlan.lessonTitleKm}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {selectedPlan.chapterKm} · គ្រូបង្រៀន៖ <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPlan.teacherNameKm}</span>
                </p>
              </div>

              {/* 5-Step Process Summary Preview */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white font-khmer-heading">
                  {lang === 'km' ? 'សេចក្តីសង្ខេបដំណើរការ ៥ ជំហាន' : '5-Step Process Outline'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                  {selectedPlan.steps.map((st) => (
                    <div key={st.stepNumber} className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                      <span className="font-bold text-blue-700 dark:text-blue-400">ជំហាន {st.stepNumber} ({st.durationMinutes}m): </span>
                      <span className="line-clamp-1">{st.keyContentKm}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Principal Evaluation Form */}
              <form onSubmit={handleSendFeedback} className="space-y-5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-khmer-heading flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>{lang === 'km' ? 'ការវាយតម្លៃគរុកោសល្យរបស់នាយកសាលា' : 'Principal Pedagogical Assessment'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'km' ? 'ឈ្មោះអ្នកវាយតម្លៃ / នាយកសាលា' : 'Evaluator Name'}
                    </label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'km' ? 'ការសម្រេចចិត្ត' : 'Approval Decision'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setReviewStatus('approved')}
                        className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                          reviewStatus === 'approved'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{lang === 'km' ? 'ឯកភាព (Approve)' : 'Approve'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReviewStatus('revision')}
                        className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                          reviewStatus === 'revision'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{lang === 'km' ? 'កែសម្រួល' : 'Revise'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Rubrics (1-5 sliders) */}
                <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      <span>{t.curriculumRubric}</span>
                      <span className="font-mono text-blue-600">{ratingCurriculum}/5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={ratingCurriculum}
                      onChange={(e) => setRatingCurriculum(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      <span>{t.pedagogyRubric}</span>
                      <span className="font-mono text-blue-600">{ratingPedagogy}/5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={ratingPedagogy}
                      onChange={(e) => setRatingPedagogy(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      <span>{t.timeRubric}</span>
                      <span className="font-mono text-blue-600">{ratingTime}/5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={ratingTime}
                      onChange={(e) => setRatingTime(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Written Feedback */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'km' ? 'មតិយោបល់ និងអនុសាសន៍កែលម្អ' : 'Principal Comments & Directives'}
                  </label>
                  <textarea
                    rows={4}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="ឧទាហរណ៍៖ កិច្ចតែងការរៀបចំបានល្អប្រសើរ ស្របតាមស្តង់ដារក្រសួងអប់រំ... ឬស្នើឱ្យបន្ថែមកិច្ចការសិស្ស..."
                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-battambang"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>{lang === 'km' ? 'ភ្ជាប់មកជាមួយត្រាអេឡិចត្រូនិកផ្លូវការ' : 'Includes official digital MoEYS stamp'}</span>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
                  >
                    {lang === 'km' ? 'រក្សាទុក និងផ្ញើការវាយតម្លៃ' : 'Submit Review & Stamp'}
                  </button>
                </div>
              </form>

              {/* Review History on this plan */}
              {selectedPlan.feedbacks && selectedPlan.feedbacks.length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-khmer-heading">
                    {lang === 'km' ? 'ប្រវត្តិការវាយតម្លៃកន្លងមក' : 'Review History'}
                  </h4>

                  {selectedPlan.feedbacks.map((fb) => (
                    <div key={fb.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">{fb.reviewerName}</span>
                        <span className="font-mono text-[11px] text-slate-500">{fb.date}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                        "{fb.commentsKm}"
                      </p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
              <p className="text-sm text-slate-500">ជ្រើសរើសកិច្ចតែងការដើម្បីពិនិត្យ</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
