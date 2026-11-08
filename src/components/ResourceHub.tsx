import React, { useState } from 'react';
import { SharedResource, Language, LessonPlan, PrimaryGrade, SubjectId } from '../types';
import { GRADES_LIST, SUBJECTS_LIST } from '../data/curriculumData';
import { useTranslation } from '../data/translations';
import { 
  Heart, 
  Download, 
  Share2, 
  BookOpen, 
  FileText, 
  FileSpreadsheet, 
  Sparkles, 
  Search, 
  Plus, 
  Check, 
  UserCheck 
} from 'lucide-react';

interface ResourceHubProps {
  resources: SharedResource[];
  onCloneResource: (res: SharedResource) => void;
  onLikeResource: (resId: string) => void;
  onUploadNewResource: (res: Partial<SharedResource>) => void;
  lang: Language;
}

export const ResourceHub: React.FC<ResourceHubProps> = ({
  resources,
  onCloneResource,
  onLikeResource,
  onUploadNewResource,
  lang,
}) => {
  const t = useTranslation(lang);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [clonedId, setClonedId] = useState<string | null>(null);

  // New resource form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newGrade, setNewGrade] = useState<PrimaryGrade>('grade2');
  const [newSubject, setNewSubject] = useState<SubjectId>('khmer');
  const [newType, setNewType] = useState<'lesson_plan' | 'worksheet' | 'teaching_aid'>('lesson_plan');

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.titleKm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.descriptionKm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.authorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = selectedGrade === 'all' || r.grade === selectedGrade;
    const matchesSubject = selectedSubject === 'all' || r.subject === selectedSubject;
    const matchesType = selectedType === 'all' || r.resourceType === selectedType;

    return matchesSearch && matchesGrade && matchesSubject && matchesType;
  });

  const handleCloneClick = (res: SharedResource) => {
    onCloneResource(res);
    setClonedId(res.id);
    setTimeout(() => setClonedId(null), 2500);
  };

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onUploadNewResource({
      titleKm: newTitle,
      titleEn: newTitle,
      descriptionKm: newDesc || 'ធនធានបង្រៀនចែករំលែកដោយសហគមន៍គ្រូបង្រៀនបឋម',
      descriptionEn: newDesc || 'Community contributed primary educational resource',
      grade: newGrade,
      subject: newSubject,
      resourceType: newType,
      authorName: 'អ្នកគ្រូ កែវ ស្រីមុំ',
      schoolName: 'សាលាបឋមសិក្សា វត្តបូព៌',
    });
    setNewTitle('');
    setNewDesc('');
    setShowShareModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-khmer">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
            <Share2 className="w-4 h-4" />
            <span>{lang === 'km' ? 'សហគមន៍គ្រូបង្រៀនកម្ពុជា' : 'Cambodian Primary Educator Community'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-khmer-heading">
            {t.navResourceHub}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'km' 
              ? 'បណ្តុំកិច្ចតែងការ សន្លឹកកិច្ចការ និងសម្ភារឧបទេសសម្រាប់គ្រូបឋមសិក្សាទូទាំងប្រទេស'
              : 'Collaborative repository of lesson plans, worksheets, and teaching aids from across Cambodia.'}
          </p>
        </div>

        <button
          onClick={() => setShowShareModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'km' ? 'ចែករំលែកធនធានថ្មី' : 'Share New Resource'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={lang === 'km' ? 'ស្វែងរកធនធាន សន្លឹកកិច្ចការ ឬឈ្មោះគ្រូចែករំលែក...' : 'Search resources, worksheets, or educator...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

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

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">{lang === 'km' ? 'គ្រប់ប្រភេទឯកសារ' : 'All Resource Types'}</option>
            <option value="lesson_plan">{lang === 'km' ? 'កិច្ចតែងការ (Lesson Plan)' : 'Lesson Plan'}</option>
            <option value="worksheet">{lang === 'km' ? 'សន្លឹកកិច្ចការ (Worksheet)' : 'Worksheet'}</option>
            <option value="teaching_aid">{lang === 'km' ? 'សម្ភារឧបទេស (Teaching Aid)' : 'Teaching Aid'}</option>
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-700 dark:text-blue-400">
                    {res.grade.replace('grade', 'ថ្នាក់ទី')}
                  </span>
                  <span>·</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {SUBJECTS_LIST.find((s) => s.id === res.subject)?.nameKm || res.subject}
                  </span>
                  <span>·</span>
                  <span className="text-slate-500 capitalize">{res.resourceType.replace('_', ' ')}</span>
                </div>

                <span className="text-[11px] font-mono text-slate-400">{res.createdAt}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white font-khmer-heading">
                {res.titleKm}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {res.descriptionKm}
              </p>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{res.authorName}</span>
                <span>·</span>
                <span className="truncate">{res.schoolName}</span>
              </div>
            </div>

            {/* Actions bottom bar */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                <button
                  onClick={() => onLikeResource(res.id)}
                  className="flex items-center gap-1 text-slate-500 hover:text-red-500 transition-colors"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>{res.likesCount}</span>
                </button>

                <div className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  <span>{res.downloadsCount}</span>
                </div>
              </div>

              <button
                onClick={() => handleCloneClick(res)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  clonedId === res.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                }`}
              >
                {clonedId === res.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{lang === 'km' ? 'បានចម្លងរួច!' : 'Cloned to Plans!'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.clonePlan}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-khmer-heading">
                {lang === 'km' ? 'ចែករំលែកធនធានបង្រៀនថ្មី' : 'Share Educational Resource'}
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-600 text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleShareSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'km' ? 'ចំណងជើងធនធាន' : 'Resource Title'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ឧទាហរណ៍៖ កិច្ចតែងការគំរូ គណិតវិទ្យា ថ្នាក់ទី៣..."
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.gradeLabel}
                  </label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value as PrimaryGrade)}
                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                  >
                    {GRADES_LIST.map((g) => (
                      <option key={g.id} value={g.id}>
                        {lang === 'km' ? g.nameKm : g.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.subjectLabel}
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as SubjectId)}
                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                  >
                    {SUBJECTS_LIST.map((s) => (
                      <option key={s.id} value={s.id}>
                        {lang === 'km' ? s.nameKm : s.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'km' ? 'ប្រភេទធនធាន' : 'Resource Type'}
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                >
                  <option value="lesson_plan">{lang === 'km' ? 'កិច្ចតែងការបង្រៀន (Lesson Plan)' : 'Lesson Plan'}</option>
                  <option value="worksheet">{lang === 'km' ? 'សន្លឹកកិច្ចការលំហាត់ (Worksheet)' : 'Worksheet'}</option>
                  <option value="teaching_aid">{lang === 'km' ? 'សម្ភារឧបទេស / រូបភាព (Teaching Aid)' : 'Teaching Aid'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'km' ? 'ការពិពណ៌នា' : 'Description'}
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="រៀបរាប់ពីខ្លឹមសារ និងវិធីសាស្ត្របង្រៀន..."
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-400"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm"
                >
                  {t.shareResource}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
