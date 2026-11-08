import React, { useState } from 'react';
import { LessonPlan, Language, PrimaryGrade, SubjectId, LessonStep } from '../types';
import { GRADES_LIST, SUBJECTS_LIST, INITIAL_LESSON_PLANS } from '../data/curriculumData';
import { useTranslation } from '../data/translations';
import { 
  Save, 
  Send, 
  Printer, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Users, 
  CheckCircle, 
  Cloud, 
  Share2, 
  Plus, 
  Trash2, 
  RotateCcw,
  LayoutTemplate
} from 'lucide-react';

interface LessonPlannerFormProps {
  currentPlan: LessonPlan;
  setCurrentPlan: React.Dispatch<React.SetStateAction<LessonPlan>>;
  onSave: (plan: LessonPlan) => void;
  onSubmitReview: (plan: LessonPlan) => void;
  onPreviewPrint: (plan: LessonPlan) => void;
  onShareToCommunity: (plan: LessonPlan) => void;
  lang: Language;
}

export const LessonPlannerForm: React.FC<LessonPlannerFormProps> = ({
  currentPlan,
  setCurrentPlan,
  onSave,
  onSubmitReview,
  onPreviewPrint,
  onShareToCommunity,
  lang,
}) => {
  const t = useTranslation(lang);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [activeStepTab, setActiveStepTab] = useState<number>(1);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const calculateTotalTime = (): number => {
    return currentPlan.steps.reduce((sum, s) => sum + (Number(s.durationMinutes) || 0), 0);
  };

  const handleStepChange = (
    stepIndex: number, 
    field: keyof LessonStep, 
    value: string | number
  ) => {
    const updatedSteps = [...currentPlan.steps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      [field]: value,
    };
    setCurrentPlan((prev) => ({
      ...prev,
      steps: updatedSteps,
      durationMinutes: field === 'durationMinutes' ? calculateTotalTime() : prev.durationMinutes,
    }));
  };

  const handleApplyTemplate = (tmpl: LessonPlan) => {
    const newInstance: LessonPlan = {
      ...tmpl,
      id: `lp-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      status: 'draft',
      feedbacks: [],
      lastModified: new Date().toISOString(),
      syncStatus: 'pending',
    };
    setCurrentPlan(newInstance);
    setShowTemplatesModal(false);
    showNotice(lang === 'km' ? 'បានបញ្ចូលទម្រង់គំរូដោយជោគជ័យ' : 'Template applied successfully');
  };

  const showNotice = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleSaveDraft = () => {
    onSave(currentPlan);
    showNotice(lang === 'km' ? 'បានរក្សាទុកក្នុងម៉ាស៊ីន និងពពក' : 'Saved to local and cloud');
  };

  const handleSubmitForReview = () => {
    const updated: LessonPlan = { ...currentPlan, status: 'submitted' };
    setCurrentPlan(updated);
    onSubmitReview(updated);
    showNotice(lang === 'km' ? 'បានបញ្ជូនទៅលោកនាយកសាលា' : 'Submitted to Principal');
  };

  const totalTime = calculateTotalTime();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-khmer">
      {/* Toast Notice */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-900 text-white shadow-xl text-sm animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Hero Action & Template Selection Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
              <BookOpen className="w-4 h-4" />
              <span>{t.moeysAligned}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-khmer-heading">
              {lang === 'km' ? 'តាក់តែងកិច្ចតែងការបង្រៀន' : 'Create / Edit MoEYS Lesson Plan'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {lang === 'km' 
                ? 'ទម្រង់គរុកោសល្យ ៥ ជំហានស្តង់ដារបឋមសិក្សាកម្ពុជា ជាមួយការព្រីនជា PDF និង Sync ស្វ័យប្រវត្តិ' 
                : 'Cambodian primary standard 5-step lesson structure with offline sync and printable A4 PDF export.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowTemplatesModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors"
            >
              <LayoutTemplate className="w-4 h-4 text-blue-600" />
              <span>{t.templatesTitle}</span>
            </button>

            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors"
            >
              <Save className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>{t.saveDraft}</span>
            </button>

            <button
              onClick={() => onPreviewPrint(currentPlan)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-colors"
            >
              <Printer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{t.printPlan}</span>
            </button>

            <button
              onClick={handleSubmitForReview}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>{t.submitToAdmin}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Administrative & Subject Details */}
        <div className="space-y-6">
          
          {/* School & Teacher Profile */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-khmer-heading flex items-center justify-between">
              <span>{lang === 'km' ? 'ព័ត៌មានរដ្ឋបាល' : 'Administrative Info'}</span>
              <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                {currentPlan.status.toUpperCase()}
              </span>
            </h2>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.schoolNameLabel} (Khmer)
              </label>
              <input
                type="text"
                value={currentPlan.schoolNameKm}
                onChange={(e) => setCurrentPlan({ ...currentPlan, schoolNameKm: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.provinceLabel}
                </label>
                <input
                  type="text"
                  value={currentPlan.provinceKm}
                  onChange={(e) => setCurrentPlan({ ...currentPlan, provinceKm: e.target.value })}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.teacherNameLabel}
                </label>
                <input
                  type="text"
                  value={currentPlan.teacherNameKm}
                  onChange={(e) => setCurrentPlan({ ...currentPlan, teacherNameKm: e.target.value })}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.dateLabel}
                </label>
                <input
                  type="date"
                  value={currentPlan.date}
                  onChange={(e) => setCurrentPlan({ ...currentPlan, date: e.target.value })}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.durationLabel}
                </label>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs font-mono text-slate-900 dark:text-white">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-bold">{totalTime}</span>
                  <span className="text-slate-500">/ 45-50 min</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.studentsLabel}
                </label>
                <input
                  type="number"
                  value={currentPlan.totalStudents}
                  onChange={(e) => setCurrentPlan({ ...currentPlan, totalStudents: Number(e.target.value) })}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.femaleStudentsLabel}
                </label>
                <input
                  type="number"
                  value={currentPlan.femaleStudents}
                  onChange={(e) => setCurrentPlan({ ...currentPlan, femaleStudents: Number(e.target.value) })}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

          </div>

          {/* Grade & Subject Selector */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-khmer-heading">
              {lang === 'km' ? 'កម្រិតថ្នាក់ និងមុខវិជ្ជា' : 'Grade & Subject Selection'}
            </h2>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t.gradeLabel}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {GRADES_LIST.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setCurrentPlan({ ...currentPlan, grade: g.id })}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-all text-center ${
                      currentPlan.grade === g.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {lang === 'km' ? g.nameKm : g.nameEn}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t.subjectLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SUBJECTS_LIST.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentPlan({ ...currentPlan, subject: s.id })}
                    className={`py-2 px-2.5 text-xs font-medium rounded-lg border text-left flex items-center justify-between transition-all ${
                      currentPlan.subject === s.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 font-bold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{lang === 'km' ? s.nameKm : s.nameEn}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.chapterLabel}
              </label>
              <input
                type="text"
                value={currentPlan.chapterKm}
                onChange={(e) => setCurrentPlan({ ...currentPlan, chapterKm: e.target.value })}
                placeholder="ឧទាហរណ៍៖ ជំពូកទី៣៖ ការអានពាក្យផ្សំ"
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.lessonTitleLabel}
              </label>
              <input
                type="text"
                value={currentPlan.lessonTitleKm}
                onChange={(e) => setCurrentPlan({ ...currentPlan, lessonTitleKm: e.target.value })}
                placeholder="ឧទាហរណ៍៖ មេរៀនទី១៤៖ ស្រៈ ឰ ឱ ឳ"
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.subTopicLabel}
              </label>
              <input
                type="text"
                value={currentPlan.subTopicKm}
                onChange={(e) => setCurrentPlan({ ...currentPlan, subTopicKm: e.target.value })}
                placeholder="ឧទាហរណ៍៖ ទំព័រ ២៨ (ការផ្សំស្រៈ និងការសរសេរលើក្តារឆ្នួន)"
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* Teaching Aids & Materials */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-khmer-heading">
              {t.teachingAidsTitle}
            </h2>
            <textarea
              rows={3}
              value={currentPlan.teachingAidsKm}
              onChange={(e) => setCurrentPlan({ ...currentPlan, teachingAidsKm: e.target.value })}
              placeholder="សៀវភៅសិក្សាគោល, បណ្ណអក្សរ, ក្តារឆ្នួន, រូបភាព..."
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-khmer-heading pt-2 border-t border-slate-100 dark:border-slate-800">
              {t.blackboardNotesTitle}
            </h2>
            <textarea
              rows={3}
              value={currentPlan.blackboardNotesKm}
              onChange={(e) => setCurrentPlan({ ...currentPlan, blackboardNotesKm: e.target.value })}
              placeholder="ប្លង់ក្តារខៀន៖ ខាងឆ្វេង (កាលបរិច្ឆេទ), កណ្តាល (ចំណងជើង), ខាងស្តាំ (លំហាត់)..."
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

        </div>

        {/* Right 2 Columns: Objectives & 5-Step MoEYS Process */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 3-Tier MoEYS Objectives Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider font-khmer-heading flex items-center gap-2">
                <span>{t.objectivesTitle}</span>
              </h2>
              <span className="text-xs text-slate-500">ស្តង់ដារ ៣ វិស័យ (ចំណេះដឹង បំណិន ឥរិយាបថ)</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  {t.objKnowledge}
                </label>
                <textarea
                  rows={2}
                  value={currentPlan.objectives.knowledgeKm}
                  onChange={(e) => setCurrentPlan({
                    ...currentPlan,
                    objectives: { ...currentPlan.objectives, knowledgeKm: e.target.value }
                  })}
                  placeholder="សិស្សប្រាប់បានច្បាស់ពី..."
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  {t.objSkill}
                </label>
                <textarea
                  rows={2}
                  value={currentPlan.objectives.skillKm}
                  onChange={(e) => setCurrentPlan({
                    ...currentPlan,
                    objectives: { ...currentPlan.objectives, skillKm: e.target.value }
                  })}
                  placeholder="សិស្សអនុវត្ត និងដោះស្រាយបាន..."
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  {t.objAttitude}
                </label>
                <textarea
                  rows={2}
                  value={currentPlan.objectives.attitudeKm}
                  onChange={(e) => setCurrentPlan({
                    ...currentPlan,
                    objectives: { ...currentPlan.objectives, attitudeKm: e.target.value }
                  })}
                  placeholder="បណ្តុះស្មារតីសិស្សឱ្យស្រឡាញ់..."
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* MoEYS 5-Step Process Tabs & Interactive Editor */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-khmer-heading">
                  {t.fiveStepsTitle}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'km' ? 'បែងចែកសកម្មភាពគ្រូ និងសិស្សឱ្យមានភាពច្បាស់លាស់' : 'Detailed Teacher and Student instructional actions'}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
                <span>Total:</span>
                <span className={totalTime > 50 ? 'text-amber-500 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-bold'}>
                  {totalTime}m
                </span>
                <span>/ 45m</span>
              </div>
            </div>

            {/* Step selector tabs */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {currentPlan.steps.map((step) => {
                const isActive = activeStepTab === step.stepNumber;
                return (
                  <button
                    key={step.stepNumber}
                    onClick={() => setActiveStepTab(step.stepNumber)}
                    className={`p-2.5 text-center rounded-lg border transition-all ${
                      isActive
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-[10px] sm:text-xs font-bold font-khmer-heading">
                      ជំហាន {step.stepNumber}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      {step.durationMinutes} នាទី
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Step Editor */}
            {currentPlan.steps.map((step, idx) => {
              if (step.stepNumber !== activeStepTab) return null;

              return (
                <div key={step.stepNumber} className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-xs font-bold text-blue-900 dark:text-blue-300 font-khmer-heading">
                        {step.stepNameKm}
                      </span>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {step.stepNameEn}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {lang === 'km' ? 'រយៈពេល៖' : 'Duration:'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={step.durationMinutes}
                        onChange={(e) => handleStepChange(idx, 'durationMinutes', Number(e.target.value))}
                        className="w-16 text-xs text-center rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-1 font-mono font-bold"
                      />
                      <span className="text-xs text-slate-500">នាទី</span>
                    </div>
                  </div>

                  {/* Key Content */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      {t.keyContent}
                    </label>
                    <input
                      type="text"
                      value={step.keyContentKm}
                      onChange={(e) => handleStepChange(idx, 'keyContentKm', e.target.value)}
                      placeholder="ខ្លឹមសារសង្ខេប ឬលំហាត់..."
                      className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Teacher & Student Activity Split */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1 flex items-center justify-between">
                        <span>{t.teacherActivity}</span>
                        <span className="text-[10px] text-slate-500 font-normal">តួនាទីសម្របសម្រួល</span>
                      </label>
                      <textarea
                        rows={7}
                        value={step.teacherActivityKm}
                        onChange={(e) => handleStepChange(idx, 'teacherActivityKm', e.target.value)}
                        placeholder="- គ្រូបង្ហាញ...\n- គ្រូសួរសំណួរ...\n- គ្រូណែនាំ..."
                        className="w-full text-xs leading-relaxed rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-battambang"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-emerald-800 dark:text-emerald-400 mb-1 flex items-center justify-between">
                        <span>{t.studentActivity}</span>
                        <span className="text-[10px] text-slate-500 font-normal">ការចូលរួមផ្ទាល់</span>
                      </label>
                      <textarea
                        rows={7}
                        value={step.studentActivityKm}
                        onChange={(e) => handleStepChange(idx, 'studentActivityKm', e.target.value)}
                        placeholder="- សិស្សសង្កេត...\n- សិស្សឆ្លើយសំណួរ...\n- សិស្សអនុវត្តជាក្រុម..."
                        className="w-full text-xs leading-relaxed rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-battambang"
                      />
                    </div>
                  </div>

                  {/* Next Step Shortcut */}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      disabled={activeStepTab <= 1}
                      onClick={() => setActiveStepTab((prev) => Math.max(1, prev - 1))}
                      className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 disabled:opacity-40"
                    >
                      ← ជំហានមុន
                    </button>
                    <button
                      type="button"
                      disabled={activeStepTab >= 5}
                      onClick={() => setActiveStepTab((prev) => Math.min(5, prev + 1))}
                      className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline disabled:opacity-40"
                    >
                      ជំហានបន្ទាប់ →
                    </button>
                  </div>
                </div>
              );
            })}

          </div>

          {/* Quick Share to Community Banner */}
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {lang === 'km' ? 'ចែករំលែកទៅកាន់បណ្តាញគ្រូបង្រៀនទូទាំងប្រទេស' : 'Collaborate & Share with Cambodian Teachers'}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'km' ? 'អនុញ្ញាតឱ្យលោកគ្រូ អ្នកគ្រូផ្សេងទៀតទាញយក និងរៀនសូត្រពីកិច្ចតែងការនេះ' : 'Allow other teachers to clone and benefit from your pedagogical preparation'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onShareToCommunity(currentPlan)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
            >
              {t.shareResource}
            </button>
          </div>

        </div>

      </div>

      {/* Curriculum Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-khmer-heading">
                  {t.templatesTitle}
                </h3>
                <p className="text-xs text-slate-500">
                  {t.templatesDesc}
                </p>
              </div>
              <button
                onClick={() => setShowTemplatesModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {INITIAL_LESSON_PLANS.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all bg-white dark:bg-slate-800/60 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-700 dark:text-blue-400">
                        {tmpl.grade.replace('grade', 'ថ្នាក់ទី')} · {tmpl.subject.toUpperCase()}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">{tmpl.durationMinutes} នាទី</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white font-khmer-heading">
                      {tmpl.lessonTitleKm}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {tmpl.objectives.knowledgeKm}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">{tmpl.schoolNameKm}</span>
                    <button
                      onClick={() => handleApplyTemplate(tmpl)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
                    >
                      {t.useTemplate}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
