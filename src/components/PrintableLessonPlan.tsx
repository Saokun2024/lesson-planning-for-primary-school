import React from 'react';
import { LessonPlan, Language } from '../types';
import { useTranslation } from '../data/translations';
import { Printer, Download, ArrowLeft, CheckCircle2, Award } from 'lucide-react';

interface PrintableLessonPlanProps {
  plan: LessonPlan;
  lang: Language;
  onBack: () => void;
}

export const PrintableLessonPlan: React.FC<PrintableLessonPlanProps> = ({
  plan,
  lang,
  onBack,
}) => {
  const t = useTranslation(lang);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-6 px-2 sm:px-6">
      {/* Action Toolbar (Hidden in print) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'km' ? 'ត្រឡប់ក្រោយ' : 'Back to Editor'}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            {lang === 'km' ? 'ទំហំ A4 ស្តង់ដារ MoEYS' : 'MoEYS Standard A4 Format'}
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{lang === 'km' ? 'ព្រីន / ទាញយក PDF' : 'Print / Export to PDF'}</span>
          </button>
        </div>
      </div>

      {/* Official MoEYS Printable Paper Sheet */}
      <div className="max-w-4xl mx-auto bg-white text-slate-950 p-8 sm:p-12 shadow-lg border border-slate-200 print:border-none print:shadow-none print:p-0 print-container font-battambang">
        
        {/* Official Kingdom Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold font-khmer-heading text-slate-900 tracking-wide mb-1">
            ព្រះរាជាណាចក្រកម្ពុជា
          </h1>
          <h2 className="text-base sm:text-lg font-bold font-khmer-heading text-slate-800 mb-2">
            ជាតិ សាសនា ព្រះមហាក្សត្រ
          </h2>
          <div className="w-24 h-0.5 bg-slate-800 mx-auto mb-4" />
          <h3 className="text-lg font-bold font-khmer-heading text-blue-900 underline underline-offset-4">
            កិច្ចតែងការបង្រៀន (LESSON PLAN)
          </h3>
        </div>

        {/* Administrative Metadata Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm border-b border-slate-400 pb-4 mb-4">
          <div>
            <span className="font-semibold">សាលាបឋមសិក្សា៖ </span>
            <span>{plan.schoolNameKm} ({plan.schoolNameEn})</span>
          </div>
          <div>
            <span className="font-semibold">រាជធានី/ខេត្ត៖ </span>
            <span>{plan.provinceKm}</span>
          </div>
          <div>
            <span className="font-semibold">ឈ្មោះគ្រូបង្រៀន៖ </span>
            <span>{plan.teacherNameKm}</span>
          </div>
          <div>
            <span className="font-semibold">កាលបរិច្ឆេទបង្រៀន៖ </span>
            <span>{plan.date}</span>
          </div>
          <div>
            <span className="font-semibold">កម្រិតថ្នាក់៖ </span>
            <span className="font-bold">{plan.grade.replace('grade', 'ថ្នាក់ទី')}</span>
            <span className="ml-4 font-semibold">មុខវិជ្ជា៖ </span>
            <span className="font-bold">{plan.subject.toUpperCase()}</span>
          </div>
          <div>
            <span className="font-semibold">ចំនួនសិស្ស៖ </span>
            <span>{plan.totalStudents} នាក់ (ស្រី {plan.femaleStudents} នាក់)</span>
            <span className="ml-4 font-semibold">រយៈពេល៖ </span>
            <span>{plan.durationMinutes} នាទី</span>
          </div>
        </div>

        {/* Chapter & Lesson Subject Details */}
        <div className="space-y-2 text-sm mb-4">
          <div>
            <span className="font-bold text-slate-900">ជំពូក៖ </span>
            <span>{plan.chapterKm}</span>
            {plan.chapterEn && <span className="text-slate-600 ml-2">({plan.chapterEn})</span>}
          </div>
          <div>
            <span className="font-bold text-slate-900">មេរៀន / ចំណងជើង៖ </span>
            <span className="font-semibold">{plan.lessonTitleKm}</span>
            {plan.lessonTitleEn && <span className="text-slate-600 ml-2">({plan.lessonTitleEn})</span>}
          </div>
          <div>
            <span className="font-bold text-slate-900">ចំណងជើងរង / ខ្លឹមសារលម្អិត៖ </span>
            <span>{plan.subTopicKm}</span>
          </div>
        </div>

        {/* 1. Lesson Objectives */}
        <div className="mb-4 border border-slate-300 p-3 bg-slate-50/50 rounded-sm">
          <h4 className="font-bold text-sm text-blue-900 mb-2 font-khmer-heading">
            I. វត្ថុបំណងមេរៀន (Lesson Objectives)
          </h4>
          <ul className="text-xs sm:text-sm space-y-1.5 list-disc list-inside">
            <li>
              <span className="font-semibold">ចំណេះដឹង (Knowledge)៖ </span>
              {plan.objectives.knowledgeKm}
            </li>
            <li>
              <span className="font-semibold">បំណិន (Skills)៖ </span>
              {plan.objectives.skillKm}
            </li>
            <li>
              <span className="font-semibold">ឥរិយាបថ (Attitude)៖ </span>
              {plan.objectives.attitudeKm}
            </li>
          </ul>
        </div>

        {/* 2. Teaching Aids & Blackboard Plan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm mb-4">
          <div className="border border-slate-300 p-3 rounded-sm">
            <h5 className="font-bold text-slate-900 mb-1 font-khmer-heading">
              II. សម្ភារឧបទេស (Teaching Materials)
            </h5>
            <p className="whitespace-pre-line text-slate-800">{plan.teachingAidsKm || 'គ្មាន'}</p>
          </div>
          <div className="border border-slate-300 p-3 rounded-sm">
            <h5 className="font-bold text-slate-900 mb-1 font-khmer-heading">
              III. កត់ត្រាលើក្តារខៀន (Blackboard Plan)
            </h5>
            <p className="whitespace-pre-line text-slate-800">{plan.blackboardNotesKm || 'គ្មាន'}</p>
          </div>
        </div>

        {/* 3. MoEYS 5-Step Process Table */}
        <div className="mb-6">
          <h4 className="font-bold text-sm text-blue-900 mb-2 font-khmer-heading">
            IV. ដំណើរការបង្រៀន និងរៀន ៥ ជំហាន (5-Step Pedagogical Flow)
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-400 text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-semibold border-b border-slate-400">
                  <th className="border border-slate-400 p-2 text-left w-36">ជំហាន & ពេល</th>
                  <th className="border border-slate-400 p-2 text-left w-48">ខ្លឹមសារមេរៀន</th>
                  <th className="border border-slate-400 p-2 text-left">សកម្មភាពគ្រូ</th>
                  <th className="border border-slate-400 p-2 text-left">សកម្មភាពសិស្ស</th>
                </tr>
              </thead>
              <tbody>
                {plan.steps.map((step) => (
                  <tr key={step.stepNumber} className="align-top border-b border-slate-300">
                    <td className="border border-slate-400 p-2 font-semibold bg-slate-50/30">
                      <div>{step.stepNameKm}</div>
                      <div className="text-[11px] text-slate-500 font-mono">({step.durationMinutes} នាទី)</div>
                    </td>
                    <td className="border border-slate-400 p-2">
                      <div className="whitespace-pre-line">{step.keyContentKm}</div>
                    </td>
                    <td className="border border-slate-400 p-2">
                      <div className="whitespace-pre-line leading-relaxed">{step.teacherActivityKm}</div>
                    </td>
                    <td className="border border-slate-400 p-2">
                      <div className="whitespace-pre-line leading-relaxed">{step.studentActivityKm}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Official Signatures & Principal Approval Stamp */}
        <div className="mt-8 pt-4 border-t border-slate-300 grid grid-cols-2 text-center text-xs sm:text-sm">
          {/* Principal Approval Stamp */}
          <div className="flex flex-col items-center">
            <div className="text-slate-800 mb-1">
              បានឃើញ និងឯកភាព
            </div>
            <div className="font-bold text-slate-900 mb-2">
              នាយកសាលាបឋមសិក្សា
            </div>
            {plan.status === 'approved' ? (
              <div className="my-2 p-2 border-2 border-red-600 rounded-full w-28 h-28 flex flex-col items-center justify-center text-red-600 transform -rotate-6">
                <span className="text-[10px] font-bold">សាលាបឋមសិក្សា</span>
                <span className="text-xs font-bold font-khmer-heading">បានអនុម័ត</span>
                <span className="text-[9px] font-mono">{plan.feedbacks[0]?.approvedDate || '2026-11-09'}</span>
              </div>
            ) : (
              <div className="h-20 flex items-center justify-center text-slate-400 italic">
                (ទីតាំងត្រា និងហត្ថលេខា)
              </div>
            )}
            <div className="font-semibold text-slate-800">
              {plan.feedbacks[0]?.reviewerName || 'លោកនាយក សុខា ចេត'}
            </div>
          </div>

          {/* Teacher Signature */}
          <div className="flex flex-col items-center">
            <div className="text-slate-800 mb-1">
              ថ្ងៃទី......... ខែ........... ឆ្នាំ២០២....
            </div>
            <div className="font-bold text-slate-900 mb-2">
              គ្រូបង្រៀន
            </div>
            <div className="h-20 flex items-center justify-center italic text-blue-900 font-serif">
              {plan.teacherNameKm}
            </div>
            <div className="font-semibold text-slate-800">
              {plan.teacherNameKm}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
