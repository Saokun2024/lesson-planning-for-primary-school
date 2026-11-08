import React from 'react';
import { LessonPlan, Language } from '../types';
import { exportPlansToCsv } from '../utils/storage';
import { useTranslation } from '../data/translations';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  BarChart3, 
  CheckCircle, 
  Clock, 
  Award, 
  Calendar 
} from 'lucide-react';

interface ReportsExportProps {
  plans: LessonPlan[];
  lang: Language;
}

export const ReportsExport: React.FC<ReportsExportProps> = ({ plans, lang }) => {
  const t = useTranslation(lang);

  const totalTeachingHours = plans.reduce((acc, p) => acc + (p.durationMinutes || 45), 0) / 60;
  const approvedCount = plans.filter((p) => p.status === 'approved').length;
  const approvalRate = plans.length > 0 ? Math.round((approvedCount / plans.length) * 100) : 0;

  const handleDownloadCsv = () => {
    exportPlansToCsv(plans);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-khmer">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>{lang === 'km' ? 'ស្ថិតិគរុកោសល្យ និងការតាមដានការបង្រៀន' : 'Pedagogical Statistics & Reports'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-khmer-heading">
            {t.navReports}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'km' 
              ? 'របាយការណ៍បង្រៀនប្រចាំខែ និងសៀវភៅតាមដានកម្មវិធីសិក្សាជាតិ អាចទាញយកជា CSV ឬ PDF' 
              : 'Monthly teaching logs and curriculum coverage tracking exportable to CSV and PDF.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{t.exportCsv}</span>
          </button>

          <button
            onClick={handlePrintSummary}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{lang === 'km' ? 'ព្រីនរបាយការណ៍ PDF' : 'Print PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 no-print">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">{lang === 'km' ? 'កិច្ចតែងការសរុប' : 'Total Plans'}</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-1 tabular-nums">
            {plans.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">មេរៀនក្នុងប្រព័ន្ធ</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">{lang === 'km' ? 'ម៉ោងបង្រៀនសរុប' : 'Total Hours'}</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono mt-1 tabular-nums">
            {totalTeachingHours.toFixed(1)}h
          </div>
          <div className="text-[11px] text-slate-400 mt-1">ម៉ោងគរុកោសល្យ</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">{lang === 'km' ? 'អត្រាអនុម័តនាយក' : 'Approval Rate'}</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1 tabular-nums">
            {approvalRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{approvedCount} មេរៀនបានអនុម័ត</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">{lang === 'km' ? 'ការស្របតាម MoEYS' : 'MoEYS Standard'}</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono mt-1 tabular-nums">
            100%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">ស្តង់ដារ ៥ ជំហាន</div>
        </div>
      </div>

      {/* Printable Monthly Summary Report Table */}
      <div className="bg-white text-slate-950 p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0">
        
        {/* Printable Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold font-khmer-heading text-slate-900">
            ព្រះរាជាណាចក្រកម្ពុជា · ជាតិ សាសនា ព្រះមហាក្សត្រ
          </h2>
          <h3 className="text-base font-bold text-blue-900 font-khmer-heading mt-1">
            តារាងតាមដាន និងវាយតម្លៃការអនុវត្តកិច្ចតែងការបង្រៀនប្រចាំខែ
          </h3>
          <p className="text-xs text-slate-500 font-mono mt-1">
            សាលាបឋមសិក្សា វត្តបូព៌ · ខេត្តសៀមរាប · ខែវិច្ឆិកា ឆ្នាំ២០២៦
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-300">
                <th className="border border-slate-300 p-2 text-center w-10">ល.រ</th>
                <th className="border border-slate-300 p-2 text-left w-24">កាលបរិច្ឆេទ</th>
                <th className="border border-slate-300 p-2 text-left w-20">កម្រិតថ្នាក់</th>
                <th className="border border-slate-300 p-2 text-left w-28">មុខវិជ្ជា</th>
                <th className="border border-slate-300 p-2 text-left">ចំណងជើងមេរៀន និងខ្លឹមសារ</th>
                <th className="border border-slate-300 p-2 text-center w-16">ពេល</th>
                <th className="border border-slate-300 p-2 text-center w-28">ស្ថានភាពត្រួតពិនិត្យ</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p, index) => (
                <tr key={p.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="border border-slate-300 p-2 text-center font-mono">{index + 1}</td>
                  <td className="border border-slate-300 p-2 font-mono text-[11px]">{p.date}</td>
                  <td className="border border-slate-300 p-2 font-semibold">
                    {p.grade.replace('grade', 'ថ្នាក់ទី')}
                  </td>
                  <td className="border border-slate-300 p-2 uppercase font-medium">{p.subject}</td>
                  <td className="border border-slate-300 p-2">
                    <div className="font-bold text-slate-900">{p.lessonTitleKm}</div>
                    <div className="text-[11px] text-slate-600">{p.chapterKm}</div>
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-mono">{p.durationMinutes}m</td>
                  <td className="border border-slate-300 p-2 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : p.status === 'submitted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {p.status === 'approved' ? 'បានអនុម័ត' : p.status === 'submitted' ? 'រង់ចាំពិនិត្យ' : 'សេចក្តីព្រាង'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Printable Signature Box */}
        <div className="mt-8 pt-4 grid grid-cols-2 text-center text-xs">
          <div>
            <div className="text-slate-700">បានឃើញ និងពិនិត្យត្រឹមត្រូវ</div>
            <div className="font-bold text-slate-900 mt-1">នាយកសាលាបឋមសិក្សា</div>
            <div className="h-16 flex items-center justify-center italic text-slate-400">
              (ត្រា និងហត្ថលេខា)
            </div>
            <div className="font-semibold text-slate-800">លោកនាយក សុខា ចេត</div>
          </div>

          <div>
            <div className="text-slate-700">ថ្ងៃទី......... ខែ........... ឆ្នាំ២០២....</div>
            <div className="font-bold text-slate-900 mt-1">គ្រូបង្រៀនទទួលបន្ទុក</div>
            <div className="h-16 flex items-center justify-center italic text-blue-900 font-serif">
              អ្នកគ្រូ កែវ ស្រីមុំ
            </div>
            <div className="font-semibold text-slate-800">អ្នកគ្រូ កែវ ស្រីមុំ</div>
          </div>
        </div>

      </div>
    </div>
  );
};
