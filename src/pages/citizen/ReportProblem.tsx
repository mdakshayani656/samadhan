import React, { useState } from 'react';
import { SamadhanLogo } from '../../components/SamadhanLogo';
import { VoiceInputButton } from '../../components/VoiceInputButton';
import { LocationPicker } from '../../components/LocationPicker';
import { AIAnalysisModal } from '../../components/AIAnalysisModal';
import { ProblemCategory, PriorityLevel, Problem, AIAnalysisReport } from '../../types';
import { createProblem, getCurrentUser } from '../../data/storage';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface ReportProblemProps {
  onBack: () => void;
  onSuccess: (problemId: string) => void;
}

const CATEGORIES: ProblemCategory[] = [
  'Infrastructure',
  'Environment',
  'Public Utilities',
  'Transport',
  'Education',
  'Healthcare',
  'Safety',
  'Other'
];

export const ReportProblem: React.FC<ReportProblemProps> = ({
  onBack,
  onSuccess
}) => {
  const user = getCurrentUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('NH-16 AIIMS Junction, Mangalagiri, Guntur, AP');
  const [category, setCategory] = useState<ProblemCategory>('Infrastructure');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [photoPreview, setPhotoPreview] = useState<string>(
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80'
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [createdResult, setCreatedResult] = useState<{
    problem: Problem;
    aiReport: AIAnalysisReport;
  } | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setDescription((prev) => (prev ? `${prev} ${text}` : text));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      alert('Please fill in Problem Title, Description, and Location.');
      return;
    }

    setAnalyzing(true);
    setAnalysisProgress(15);

    // Realistic scanning animation progress
    const t1 = setTimeout(() => setAnalysisProgress(45), 400);
    const t2 = setTimeout(() => setAnalysisProgress(80), 800);
    const t3 = setTimeout(() => {
      setAnalysisProgress(100);
      const res = createProblem({
        title,
        description,
        location,
        category,
        priority,
        photo: photoPreview,
        citizenName: user?.name || 'Ramesh Babu',
        citizenEmail: user?.email || 'citizen@demo.com'
      });
      setAnalyzing(false);
      setCreatedResult(res);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F4F8F8] p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between py-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#073F68] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Citizen Portal</span>
        </button>
        <SamadhanLogo size="sm" />
      </div>

      {/* Form Container */}
      <div className="max-w-3xl mx-auto w-full my-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 relative overflow-hidden">
          {/* Header banner */}
          <div className="border-b border-slate-100 pb-5 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F57A16]">
              Stage 1: Citizen Submission
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#073F68] mt-1">
              Report a Community Problem
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Provide photographic evidence, geolocation, and description. Our advisory AI engine will
              perform duplicate screening and triage before official Government ground verification.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Problem Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Problem Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Road damage near AIIMS Junction"
                required
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#073F68] transition-all"
              />
              <div className="flex gap-2 mt-2">
                <span className="text-[11px] text-slate-400">Quick suggestions:</span>
                <button
                  type="button"
                  onClick={() => {
                    setTitle('Road damage near AIIMS Junction');
                    setDescription(
                      'Deep crater potholes on four-lane approach road to AIIMS Mangalagiri. Severe ambulance transit delay and accident risk.'
                    );
                    setCategory('Infrastructure');
                    setPriority('High');
                  }}
                  className="text-[11px] font-semibold text-[#073F68] hover:underline"
                >
                  AIIMS Road Damage
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => {
                    setTitle('Overflowing market waste dump');
                    setDescription(
                      'Unsegregated municipal market garbage dump accumulating organic waste and causing stench near wholesale yard.'
                    );
                    setCategory('Environment');
                    setPriority('High');
                  }}
                  className="text-[11px] font-semibold text-[#087D70] hover:underline"
                >
                  Market Waste Dump
                </button>
              </div>
            </div>

            {/* Category & Priority Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProblemCategory)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#073F68]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['High', 'Medium', 'Low'] as PriorityLevel[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        priority === p
                          ? p === 'High'
                            ? 'bg-rose-50 border-rose-400 text-rose-700 ring-1 ring-rose-300'
                            : p === 'Medium'
                            ? 'bg-amber-50 border-amber-400 text-amber-700 ring-1 ring-amber-300'
                            : 'bg-slate-100 border-slate-400 text-slate-700 ring-1 ring-slate-300'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description with Voice Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <VoiceInputButton onTranscript={handleVoiceTranscript} />
              </div>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the severity, risk to commuters/residents, and duration of the problem..."
                required
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#073F68] transition-all"
              />
            </div>

            {/* Location with Current Geolocation */}
            <LocationPicker value={location} onChange={(loc) => setLocation(loc)} />

            {/* Photo / Video Evidence */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Photo / Video Evidence
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-full sm:w-48 h-32 bg-slate-100 border border-slate-300 rounded-2xl overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-slate-400 p-2">
                      <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-[11px]">No file chosen</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl cursor-pointer transition-colors border border-slate-300">
                    <Upload className="w-4 h-4 text-[#073F68]" />
                    <span>Upload Image / Video (JPG, PNG, WEBP)</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Clear images help the AI verify evidence sufficiency and aid Government officers
                    during field inspection.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={analyzing}
                className="w-full py-4 px-6 text-sm font-extrabold text-white bg-gradient-to-r from-[#073F68] via-[#087D70] to-[#073F68] hover:shadow-xl hover:shadow-[#073F68]/20 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Running AI Analysis & Duplicate Screening ({analysisProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span>Submit Problem for AI Analysis (Step 1)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* AI Analysis Modal Pop-up when completed */}
      {createdResult && (
        <AIAnalysisModal
          isOpen={true}
          report={createdResult.aiReport}
          problem={createdResult.problem}
          onClose={() => {
            onSuccess(createdResult.problem.id);
          }}
        />
      )}
    </div>
  );
};
