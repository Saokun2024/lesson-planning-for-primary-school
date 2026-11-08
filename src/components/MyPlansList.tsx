import React, { useState } from 'react';
import { LessonPlan, Language, PrimaryGrade, SubjectId, PlanStatus } from '../types';
import { GRADES_LIST, SUBJECTS_LIST } from '../data/curriculumData';
import { useTranslation } from '../data/translations';
import { 
  Search, 
  Filter, 
  Printer, 
  Edit3, 
  Trash2, 
  Send, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Cloud, 
  CloudOff, 
  Share2, 
  Plus 
} from 'lucide-react';

interface MyPlansListProps {
  plans: LessonPlan[];
  onSelectPlan: (plan: LessonPlan) => void;
  onPrintPlan: (plan: LessonPlan) => void;
  onDeletePlan: (id: string) => void;
  onSubmitPlan: (plan: LessonPlan) => void;
  onSharePlan: (plan: LessonPlan) => void;
  onNewPlan: () => void;
  lang: Language;
}

export const MyPlansList: React.FC<MyPlansListProps> = ({
  plans,
  onSelectPlan,
  onPrintPlan,
  onDeletePlan,
  onSubmitPlan,
  onSharePlan,
  onNewPlan,
  lang,
}) => {
  const t = useTranslation(lang);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredPlans = plans.filter((p) => {
    const matchesSearch =
      p.lessonTitleKm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.lessonTitleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.chapterKm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.teacherNameKm.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = selectedGrade === 'all' || p.grade === selectedGrade;
    const matchesSubject = selectedSubject === 'all' || p.subject === selectedSubject;
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;

    return matchesSearch && matchesGrade && matchesSubject && matchesStatus;
  });

  const getStatusBadge = (status: PlanStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{t.approvedByPrincipal}</span>
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.pendingReview}</span>
          </span>
        );
      case 'revision':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{t.needsRevision}</span>
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
            <span>{t.statusDraft}</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-khmer">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-khmer-heading">
            {t.navMyPlans}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'km' 
              ? `កិច្ចតែងការសរុបចំនួន ${plans.length} មេរៀន (បានរក្សាទុកទាំងលើម៉ាស៊ីន និងពពក)`
              : `Total ${plans.length} lesson plans stored and synchronized.`}
          </p>
        </div>

        <button
          onClick={onNewPlan}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.createNewPlan}</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={lang === 'km' ? 'ស្វែងរកតាមចំណងជើងមេរៀន ជំពូក ឬឈ្មោះគ្រូ...' : 'Search by lesson title, chapter, or teacher...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Grade filter */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">{lang === 'km' ? 'គ្រប់កម្រិតថ្នាក់' : 'All Grades'}</option>
            {GRADES_LIST.map((g) => (
              <option key={g.id} value={g.id}>
                {lang === 'km' ? g.nameKm : g.nameEn}
              </option>
            ))}
          </select>

          {/* Subject filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">{lang === 'km' ? 'គ្រប់មុខវិជ្ជា' : 'All Subjects'}</option>
            {SUBJECTS_LIST.map((s) => (
              <option key={s.id} value={s.id}>
                {lang === 'km' ? s.nameKm : s.nameEn}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">{lang === 'km' ? 'គ្រប់ស្ថានភាព' : 'All Status'}</option>
            <option value="draft">{t.statusDraft}</option>
            <option value="submitted">{t.pendingReview}</option>
            <option value="approved">{t.approvedByPrincipal}</option>
            <option value="revision">{t.needsRevision}</option>
          </select>
        </div>
      </div>

      {/* Plans List Table / Cards */}
      {filteredPlans.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {lang === 'km' ? 'ពុំមានកិច្ចតែងការណាត្រូវនឹងលក្ខខណ្ឌស្វែងរកនេះទេ' : 'No lesson plans found matching your filter.'}
          </p>
          <button
            onClick={onNewPlan}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm"
          >
            {t.createNewPlan}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Meta top bar */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-700 dark:text-blue-400">
                      {plan.grade.replace('grade', 'ថ្នាក់ទី')}
                    </span>
                    <span>·</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {SUBJECTS_LIST.find((s) => s.id === plan.subject)?.nameKm || plan.subject}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{plan.durationMinutes} នាទី</span>
                  </div>
                </div>

                {/* Lesson Title */}
                <h3 
                  onClick={() => onSelectPlan(plan)}
                  className="text-base font-bold text-slate-900 dark:text-white font-khmer-heading hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                >
                  {plan.lessonTitleKm}
                </h3>

                {/* Chapter & subtopic */}
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {plan.chapterKm} {plan.subTopicKm ? `— ${plan.subTopicKm}` : ''}
                </p>

                {/* Status and Sync State */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>{getStatusBadge(plan.status)}</div>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    {plan.syncStatus === 'synced' ? (
                      <span title="Synced to Cloud">
                        <Cloud className="w-3.5 h-3.5 text-emerald-500" />
                      </span>
                    ) : (
                      <span title="Saved locally offline">
                        <CloudOff className="w-3.5 h-3.5 text-amber-500" />
                      </span>
                    )}
                    <span>{plan.date}</span>
                  </div>
                </div>

                {/* If approved by principal, show reviewer note preview */}
                {plan.feedbacks && plan.feedbacks.length > 0 && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300">
                    <span className="font-semibold">{plan.feedbacks[0].reviewerName}៖ </span>
                    <span className="italic line-clamp-2">{plan.feedbacks[0].commentsKm}</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSelectPlan(plan)}
                    className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={lang === 'km' ? 'កែសម្រួល' : 'Edit Plan'}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onPrintPlan(plan)}
                    className="p-1.5 rounded text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                    title={t.printPlan}
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSharePlan(plan)}
                    className="p-1.5 rounded text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                    title={t.shareResource}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {plan.status !== 'approved' && plan.status !== 'submitted' && (
                    <button
                      onClick={() => onSubmitPlan(plan)}
                      className="px-2.5 py-1 text-xs font-medium rounded text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 transition-colors"
                    >
                      {t.submitToAdmin}
                    </button>
                  )}

                  <button
                    onClick={() => onDeletePlan(plan.id)}
                    className="p-1.5 rounded text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
