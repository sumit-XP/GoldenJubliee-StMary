import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Camera, 
  Video, 
  ExternalLink, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowLeft, 
  Heart, 
  GraduationCap, 
  Users,
  Image as ImageIcon
} from 'lucide-react';
import { TRIBUTE_LINKS_CONFIG } from '../config/tributeLinks.ts';

interface JubileeTributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'select' | 'parent-form' | 'video-form';
}

export const JubileeTributeModal: React.FC<JubileeTributeModalProps> = ({
  isOpen,
  onClose,
  defaultView = 'select',
}) => {
  const [view, setView] = useState<'select' | 'parent-form' | 'video-form' | 'success'>(defaultView);
  const [successMessage, setSuccessMessage] = useState('');
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Parent form state
  const [parentName, setParentName] = useState('');
  const [studentDetails, setStudentDetails] = useState('');
  const [parentContact, setParentContact] = useState('');
  const [parentNote, setParentNote] = useState('');
  const [parentPhoto, setParentPhoto] = useState<File | null>(null);
  const [parentPhotoPreview, setParentPhotoPreview] = useState<string | null>(null);
  const [parentSubmitting, setParentSubmitting] = useState(false);
  const [parentError, setParentError] = useState<string | null>(null);

  // Video form state
  const [personName, setPersonName] = useState('');
  const [role, setRole] = useState<'Alumnus' | 'Alumna' | 'Former Teacher' | 'Current Teacher'>('Alumnus');
  const [batchOrSubject, setBatchOrSubject] = useState('');
  const [location, setLocation] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoSubmitting, setVideoSubmitting] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setView(defaultView);
    }
  }, [isOpen, defaultView]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (dontShowAgain) {
      sessionStorage.setItem('stmarys_jubilee_tribute_dismissed', 'true');
    }
    onClose();
  };

  // Handle Photo Selection
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParentError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setParentError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setParentError('Image size exceeds 12MB. Please select a smaller photo.');
      return;
    }

    setParentPhoto(file);
    const reader = new FileReader();
    reader.onload = () => {
      setParentPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle Video Selection & Enforce <= 60 seconds limit
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setVideoError('Please select a valid video file (MP4, MOV, WEBM).');
      return;
    }

    if (file.size > 150 * 1024 * 1024) {
      setVideoError('File size is over 150MB. Please compress your video.');
      return;
    }

    // Check duration via HTML5 Video element
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    const objectUrl = URL.createObjectURL(file);

    tempVideo.onloadedmetadata = () => {
      URL.revokeObjectURL(tempVideo.src);
      const duration = tempVideo.duration;

      if (duration > TRIBUTE_LINKS_CONFIG.teachersAlumni.maxVideoDurationSeconds) {
        setVideoError(
          `Video is ${Math.round(duration)} seconds long! Videos must be under 1 minute (60 seconds). Please trim or record a shorter video.`
        );
        setVideoFile(null);
        setVideoPreview(null);
        setVideoDuration(null);
        if (videoInputRef.current) videoInputRef.current.value = '';
      } else {
        setVideoDuration(duration);
        setVideoFile(file);
        setVideoPreview(objectUrl);
        setVideoError(null);
      }
    };

    tempVideo.onerror = () => {
      URL.revokeObjectURL(tempVideo.src);
      setVideoError('Unable to inspect video format. Please upload standard MP4 or WebM.');
    };

    tempVideo.src = objectUrl;
  };

  // Submit Parent Note & Photo
  const handleParentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !parentNote.trim()) {
      setParentError('Please fill in your name and message.');
      return;
    }

    setParentSubmitting(true);
    setParentError(null);

    try {
      // Simulate submission / persist tribute
      await new Promise((res) => setTimeout(res, 900));
      setSuccessMessage("Thank you! Your Golden Jubilee note and photo have been received.");
      setView('success');
      // Reset form
      setParentName('');
      setStudentDetails('');
      setParentContact('');
      setParentNote('');
      setParentPhoto(null);
      setParentPhotoPreview(null);
    } catch {
      setParentError('An error occurred while submitting. Please try again.');
    } finally {
      setParentSubmitting(false);
    }
  };

  // Submit Video Tribute
  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim()) {
      setVideoError('Please provide your name.');
      return;
    }
    if (!videoFile) {
      setVideoError('Please select a video file under 1 minute.');
      return;
    }
    if (videoDuration && videoDuration > 60) {
      setVideoError('Video must be under 60 seconds.');
      return;
    }

    setVideoSubmitting(true);
    setVideoError(null);

    try {
      await new Promise((res) => setTimeout(res, 1000));
      setSuccessMessage("Thank you! Your 1-minute video tribute has been successfully submitted.");
      setView('success');
      // Reset form
      setPersonName('');
      setBatchOrSubject('');
      setLocation('');
      setVideoFile(null);
      setVideoPreview(null);
      setVideoDuration(null);
    } catch {
      setVideoError('Failed to upload video. Please try again or use the redirect link.');
    } finally {
      setVideoSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden my-auto">
        
        {/* Top Decorative Header */}
        <div className="relative bg-gradient-to-r from-[#5A0506] via-[#750809] to-[#400203] text-amber-50 p-6 sm:p-7 border-b border-amber-500/30">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-amber-200 hover:text-white transition-colors"
            title="Close popup"
            aria-label="Close popup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* School Emblem & Badge */}
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow border border-amber-400 shrink-0">
              <img
                src="/school-logo.png"
                alt="St. Mary's Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Golden Jubilee 1976 – 2026
              </div>
              <h2 className="font-serif text-lg sm:text-2xl font-bold text-amber-100 tracking-wide mt-1">
                Share Your Jubilee Memories
              </h2>
            </div>
          </div>

          <p className="text-amber-200/80 text-xs sm:text-sm max-w-lg leading-relaxed">
            Choose your category below to contribute your special blessings, photographs, or video tributes celebrating 50 Glorious Years!
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-7 bg-[#FAF7F2]">
          
          {/* VIEW: SELECT CATEGORY */}
          {view === 'select' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. PARENTS CARD */}
                <div className="flex flex-col justify-between bg-white rounded-2xl p-5 border-2 border-stone-200 hover:border-amber-500 shadow-sm hover:shadow-md transition-all group">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                        <Users className="w-3.5 h-3.5 text-amber-800" />
                        {TRIBUTE_LINKS_CONFIG.parents.shortLabel}
                      </span>
                      <div className="w-9 h-9 rounded-full bg-amber-50 text-[#850B0C] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 group-hover:text-[#5A0506] transition-colors">
                      {TRIBUTE_LINKS_CONFIG.parents.title}
                    </h3>

                    <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                      {TRIBUTE_LINKS_CONFIG.parents.description}
                    </p>

                    <div className="mt-3.5 space-y-1.5 text-[11px] text-stone-500">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Write your greetings & blessings</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Upload photo / picture for the jubilee</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    {/* Primary Redirect Link */}
                    <a
                      href={TRIBUTE_LINKS_CONFIG.parents.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-[#5A0506] hover:bg-[#780809] text-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all group-hover:shadow-amber-900/20"
                    >
                      <span>{TRIBUTE_LINKS_CONFIG.parents.buttonLabel}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* In-App Direct Submission Alternative */}
                    <button
                      type="button"
                      onClick={() => setView('parent-form')}
                      className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[11px] transition-colors"
                    >
                      Or Fill Form Directly on Website →
                    </button>
                  </div>
                </div>

                {/* 2. TEACHERS & ALUMNI CARD */}
                <div className="flex flex-col justify-between bg-white rounded-2xl p-5 border-2 border-stone-200 hover:border-amber-500 shadow-sm hover:shadow-md transition-all group">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-[#5A0506] text-xs font-bold">
                        <GraduationCap className="w-3.5 h-3.5 text-[#5A0506]" />
                        {TRIBUTE_LINKS_CONFIG.teachersAlumni.shortLabel}
                      </span>
                      <div className="w-9 h-9 rounded-full bg-red-50 text-[#850B0C] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Video className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 group-hover:text-[#5A0506] transition-colors">
                        {TRIBUTE_LINKS_CONFIG.teachersAlumni.title}
                      </h3>
                    </div>

                    <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                      {TRIBUTE_LINKS_CONFIG.teachersAlumni.description}
                    </p>

                    <div className="mt-3.5 space-y-1.5 text-[11px] text-stone-500">
                      <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Maximum duration: Under 1 minute (60s)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>For former/current teachers & all alumni</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    {/* Primary Redirect Link */}
                    <a
                      href={TRIBUTE_LINKS_CONFIG.teachersAlumni.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                    >
                      <span>{TRIBUTE_LINKS_CONFIG.teachersAlumni.buttonLabel}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* In-App Direct Submission Alternative */}
                    <button
                      type="button"
                      onClick={() => setView('video-form')}
                      className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[11px] transition-colors"
                    >
                      Or Upload 1-Min Video Here →
                    </button>
                  </div>
                </div>

              </div>

              {/* Dismiss Options Footer */}
              <div className="mt-5 pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500 border-stone-300"
                  />
                  <span>Do not show automatically for this session</span>
                </label>

                <button
                  type="button"
                  onClick={handleClose}
                  className="font-semibold text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Continue to Website
                </button>
              </div>
            </div>
          )}

          {/* VIEW: PARENT IN-APP FORM */}
          {view === 'parent-form' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <button
                  type="button"
                  onClick={() => setView('select')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-[#5A0506] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Options
                </button>
                <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  Parents' Note & Photo
                </span>
              </div>

              {parentError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{parentError}</span>
                </div>
              )}

              <form onSubmit={handleParentSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Parent's Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar Mohanty"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#5A0506] text-xs sm:text-sm outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Student Name & Class/Section *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Mohanty (Class 8-B)"
                      value={studentDetails}
                      onChange={(e) => setStudentDetails(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#5A0506] text-xs sm:text-sm outline-none bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone / Email (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210 or parent@gmail.com"
                    value={parentContact}
                    onChange={(e) => setParentContact(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#5A0506] text-xs sm:text-sm outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Jubilee Note & Blessings *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Write your prayers, congratulations, and fond memories of St. Mary's School..."
                    value={parentNote}
                    onChange={(e) => setParentNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#5A0506] text-xs sm:text-sm outline-none bg-white resize-none"
                  />
                </div>

                {/* Photo Upload Area */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Upload Photograph (Student / Family / School Memory)
                  </label>
                  
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />

                  {parentPhotoPreview ? (
                    <div className="relative rounded-2xl border-2 border-amber-400 overflow-hidden bg-stone-900/5 p-2 flex items-center gap-3">
                      <img
                        src={parentPhotoPreview}
                        alt="Photo preview"
                        className="w-20 h-20 object-cover rounded-xl border border-amber-300"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-800 truncate">{parentPhoto?.name}</p>
                        <p className="text-[11px] text-stone-500">
                          {parentPhoto ? (parentPhoto.size / 1024 / 1024).toFixed(2) + ' MB' : ''}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setParentPhoto(null);
                            setParentPhotoPreview(null);
                            if (photoInputRef.current) photoInputRef.current.value = '';
                          }}
                          className="mt-1 text-xs text-red-600 hover:text-red-700 font-semibold"
                        >
                          Remove photo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="w-full py-4 px-4 border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-2xl bg-white flex flex-col items-center justify-center gap-1.5 transition-colors group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-50 group-hover:bg-amber-100 text-amber-800 flex items-center justify-center transition-colors">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-stone-700 group-hover:text-[#5A0506]">
                        Click to Choose Photo (JPG, PNG, WEBP)
                      </span>
                      <span className="text-[10px] text-stone-400">Up to 12MB</span>
                    </button>
                  )}
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={parentSubmitting}
                    className="flex-1 py-2.5 rounded-full bg-[#5A0506] hover:bg-[#780809] text-amber-200 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Heart className="w-4 h-4 fill-amber-200" />
                    <span>{parentSubmitting ? 'Submitting Note...' : 'Submit Note & Photo'}</span>
                  </button>

                  <a
                    href={TRIBUTE_LINKS_CONFIG.parents.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-full border border-stone-300 hover:border-amber-500 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Open external form link"
                  >
                    <span>Use External Form</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </form>
            </div>
          )}

          {/* VIEW: TEACHERS & ALUMNI VIDEO FORM */}
          {view === 'video-form' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <button
                  type="button"
                  onClick={() => setView('select')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-[#5A0506] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Options
                </button>
                <span className="text-xs font-semibold text-red-900 bg-red-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Max 1-Min Video Tribute
                </span>
              </div>

              {/* Duration Warning banner */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Strict 1-Minute Rule: </span>
                  Video clips must be <strong>60 seconds or under</strong>. Videos exceeding 60s will be automatically prevented by our duration validator.
                </div>
              </div>

              {videoError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{videoError}</span>
                </div>
              )}

              <form onSubmit={handleVideoSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Santosh Senapati"
                      value={personName}
                      onChange={(e) => setPersonName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#5A0506] text-xs sm:text-sm outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Role / Affiliation *
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#5A0506] text-xs sm:text-sm outline-none bg-white"
                    >
                      <option value="Alumnus">Alumnus (Former Male Student)</option>
                      <option value="Alumna">Alumna (Former Female Student)</option>
                      <option value="Former Teacher">Former Teacher</option>
                      <option value="Current Teacher">Current Teacher / Staff</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Batch Year / Subject Taught
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Batch 2004 or English Dept."
                      value={batchOrSubject}
                      onChange={(e) => setBatchOrSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#5A0506] text-xs sm:text-sm outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Current City / Country
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bhubaneswar / USA"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-[#5A0506] text-xs sm:text-sm outline-none bg-white"
                    />
                  </div>
                </div>

                {/* Video Upload Area with Duration Checker */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Select Video File (Under 1 Minute) *
                  </label>

                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/mov"
                    onChange={handleVideoSelect}
                    className="hidden"
                  />

                  {videoPreview && videoFile ? (
                    <div className="rounded-2xl border-2 border-emerald-400 bg-stone-900 p-3 text-white space-y-2">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full max-h-48 rounded-xl bg-black"
                      />
                      <div className="flex items-center justify-between text-xs pt-1">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            Duration: {videoDuration ? `${Math.round(videoDuration)}s` : 'Validated'} / 60s max
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoFile(null);
                            setVideoPreview(null);
                            setVideoDuration(null);
                            if (videoInputRef.current) videoInputRef.current.value = '';
                          }}
                          className="text-red-400 hover:text-red-300 font-semibold underline"
                        >
                          Change video
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="w-full py-5 px-4 border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-2xl bg-white flex flex-col items-center justify-center gap-1.5 transition-colors group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-red-50 group-hover:bg-red-100 text-[#5A0506] flex items-center justify-center transition-colors">
                        <Video className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-stone-700 group-hover:text-[#5A0506]">
                        Click to Upload Video (MP4, MOV, WEBM)
                      </span>
                      <span className="text-[11px] font-semibold text-amber-700">
                        ⚡ Duration must be under 60 seconds (1 minute)
                      </span>
                    </button>
                  )}
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={videoSubmitting || !videoFile}
                    className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{videoSubmitting ? 'Uploading Video...' : 'Submit 1-Min Video'}</span>
                  </button>

                  <a
                    href={TRIBUTE_LINKS_CONFIG.teachersAlumni.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-full border border-stone-300 hover:border-amber-500 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Open external form link"
                  >
                    <span>Use External Form</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </form>
            </div>
          )}

          {/* VIEW: SUCCESS */}
          {view === 'success' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  Submission Successful!
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                  {successMessage || "Your contribution to the 50th Golden Jubilee archive has been recorded."}
                </p>
              </div>

              <div className="pt-3 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setView('select')}
                  className="px-5 py-2.5 rounded-full border border-stone-300 hover:border-amber-500 text-stone-700 font-bold text-xs transition-colors"
                >
                  Submit Another Tribute
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full bg-[#5A0506] hover:bg-[#780809] text-amber-200 font-bold text-xs shadow transition-all"
                >
                  Return to Jubilee Portal
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

// Floating Quick-Access Trigger Button
export const FloatingTributeTrigger: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#5A0506] via-[#7A0B0D] to-[#5A0506] text-amber-200 px-4 py-3 rounded-full shadow-2xl border-2 border-amber-400 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 group cursor-pointer"
      title="Share Your Golden Jubilee Tributes"
    >
      <div className="relative">
        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
      </div>
      <div className="text-left">
        <div className="text-[10px] uppercase font-bold tracking-wider text-amber-300/80 leading-none">
          Share Memories
        </div>
        <div className="text-xs sm:text-sm font-bold text-amber-100 flex items-center gap-1.5">
          <span>Notes, Photos & Videos</span>
          <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">→</span>
        </div>
      </div>
    </button>
  );
};
