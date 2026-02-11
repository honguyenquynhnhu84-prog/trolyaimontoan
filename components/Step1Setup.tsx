import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MATH_9_CHAPTERS } from '../constants';
import { Difficulty, GenerationParams, QuestionType, QuestionConfig } from '../types';
import { Button } from './ui/Button';
import { Card, CardBody } from './ui/Card';

interface Step1SetupProps {
  onGenerate: (params: GenerationParams) => void;
  isLoading: boolean;
}

export const Step1Setup: React.FC<Step1SetupProps> = ({ onGenerate, isLoading }) => {
  // Thay đổi: Sử dụng mảng để lưu nhiều ID chương được chọn, mặc định chọn chương đầu tiên
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([MATH_9_CHAPTERS[0].id]);
  
  // Matrix configurations built by user
  const [configs, setConfigs] = useState<QuestionConfig[]>([]);
  
  // Form states for adding a new configuration
  const [formLessonId, setFormLessonId] = useState('');
  const [formType, setFormType] = useState<QuestionType>(QuestionType.MULTIPLE_CHOICE);
  const [formDifficulty, setFormDifficulty] = useState<Difficulty>(Difficulty.NHAN_BIET);
  const [formCount, setFormCount] = useState<number>(1);
  
  // Advanced Form States (Per Config)
  const [formRealWorld, setFormRealWorld] = useState(false);
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [formImageBase64, setFormImageBase64] = useState<string | null>(null);
  const [formImageMimeType, setFormImageMimeType] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Lấy danh sách các chương đang được chọn
  const activeChapters = useMemo(() => {
    return MATH_9_CHAPTERS.filter(c => selectedChapterIds.includes(c.id));
  }, [selectedChapterIds]);

  // Set default lesson when chapters change and cleanup orphaned configs
  useEffect(() => {
    const allValidLessonIds = new Set(activeChapters.flatMap(c => c.lessons.map(l => l.id)));
    
    // Nếu formLessonId hiện tại không thuộc các chương đang chọn, reset về bài đầu tiên của chương đầu tiên
    if (!allValidLessonIds.has(formLessonId) && activeChapters.length > 0 && activeChapters[0].lessons.length > 0) {
      setFormLessonId(activeChapters[0].lessons[0].id);
    }

    // Tự động xóa các quy tắc khỏi ma trận nếu người dùng bỏ chọn chương chứa bài học đó
    setConfigs(prev => prev.filter(c => allValidLessonIds.has(c.lessonId)));
  }, [selectedChapterIds, activeChapters, formLessonId]);

  const handleChapterToggle = (chapterId: string) => {
    setSelectedChapterIds(prev => {
      if (prev.includes(chapterId)) {
        // Không cho phép bỏ chọn hết, phải giữ lại ít nhất 1 chương
        if (prev.length === 1) {
          alert("Vui lòng chọn ít nhất 1 chủ đề.");
          return prev;
        }
        return prev.filter(id => id !== chapterId);
      } else {
        return [...prev, chapterId];
      }
    });
  };

  const processFile = (file: File) => {
    setFormImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setFormImageBase64(result.split(',')[1]);
      setFormImageMimeType(file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setFormImageFile(null);
    setFormImageBase64(null);
    setFormImageMimeType(null);
  };

  const handleAddConfig = () => {
    if (activeChapters.length === 0) return;
    
    // Tìm bài học trong tất cả các chương đang chọn
    let selectedLesson = null;
    for (const ch of activeChapters) {
      const found = ch.lessons.find(l => l.id === formLessonId);
      if (found) {
        selectedLesson = found;
        break;
      }
    }
    
    if (!selectedLesson) return;

    const newConfig: QuestionConfig = {
      id: Math.random().toString(36).substr(2, 9),
      lessonId: selectedLesson.id,
      lessonTitle: selectedLesson.title,
      type: formType,
      difficulty: formDifficulty,
      count: formCount,
      standards: selectedLesson.standards.map(s => s.description),
      useRealWorldContext: formRealWorld,
      referenceImageBase64: formImageBase64 || undefined,
      referenceImageMimeType: formImageMimeType || undefined,
      imageUrl: formImageFile ? URL.createObjectURL(formImageFile) : undefined
    };

    setConfigs([...configs, newConfig]);
    
    // Reset advanced form states but keep basics for fast entry
    setFormRealWorld(false);
    clearImage();
  };

  const handleRemoveConfig = (id: string) => {
    setConfigs(configs.filter(c => c.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (configs.length === 0) {
      alert("Vui lòng thêm ít nhất 1 quy tắc vào cấu trúc ma trận.");
      return;
    }

    // Xác định tên chủ đề tổng hợp cho đề
    let combinedTitle = "";
    if (activeChapters.length === 1) {
      combinedTitle = activeChapters[0].title;
    } else if (activeChapters.length === MATH_9_CHAPTERS.length) {
      combinedTitle = "Toàn bộ chương trình Toán 9";
    } else {
      combinedTitle = `Kiểm tra tổng hợp ${activeChapters.length} chủ đề`;
    }

    onGenerate({
      chapterTitle: combinedTitle,
      configs: configs
    });
  };

  const totalQuestions = configs.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      <div className="lg:col-span-2 space-y-6 md:space-y-8">
        <Card>
          <CardBody className="p-6 md:p-8">
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
               <span className="bg-gradient-to-br from-green-500 to-emerald-500 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg shadow-green-200">1</span>
               Thiết lập Nội dung & Ma trận
            </h2>
            
            <form id="setup-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Cập nhật UI: Chọn nhiều chương */}
              <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-100">
                <label className="block text-sm font-bold text-amber-900 mb-3 uppercase tracking-wide flex items-center justify-between">
                  <span className="flex items-center gap-2">📚 Chọn chương / chủ đề</span>
                  <span className="text-xs text-amber-600 bg-amber-100/50 px-2 py-1 rounded-md lowercase normal-case tracking-normal">Có thể chọn nhiều</span>
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#fcd34d transparent' }}>
                  {MATH_9_CHAPTERS.map(ch => {
                    const isSelected = selectedChapterIds.includes(ch.id);
                    return (
                      <label 
                        key={ch.id} 
                        className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none ${isSelected ? 'bg-white border-green-400 shadow-sm' : 'bg-white/50 border-amber-200/50 hover:border-green-300 hover:bg-white'}`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 text-green-500 border-slate-300 rounded focus:ring-green-500 cursor-pointer"
                            checked={isSelected}
                            onChange={() => handleChapterToggle(ch.id)}
                          />
                        </div>
                        <div className={`text-sm font-bold leading-tight ${isSelected ? 'text-green-800' : 'text-slate-600'}`}>
                          {ch.title}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Config Builder */}
              <div className="bg-gradient-to-br from-green-50/60 via-white to-emerald-50/40 border-2 border-green-100 p-5 md:p-6 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full -z-10"></div>
                
                <h3 className="font-extrabold text-green-800 mb-5 text-lg uppercase tracking-wider flex items-center gap-2">
                  🎯 Xây dựng Cấu trúc Câu hỏi
                </h3>
                
                <div className="flex flex-col gap-5">
                  {/* Basic Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Bài học</label>
                      <select 
                        className="w-full p-3 text-sm font-medium border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
                        value={formLessonId}
                        onChange={e => setFormLessonId(e.target.value)}
                      >
                        {activeChapters.map(ch => (
                          <optgroup key={ch.id} label={ch.title} className="font-bold text-slate-800">
                            {ch.lessons.map(l => (
                              <option key={l.id} value={l.id} className="font-normal text-slate-600">
                                {l.title}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Hình thức</label>
                      <select 
                        className="w-full p-3 text-sm font-medium border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
                        value={formType}
                        onChange={e => setFormType(e.target.value as QuestionType)}
                      >
                        {Object.values(QuestionType).map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5 items-end">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Mức độ</label>
                      <select 
                        className="w-full p-3 text-sm font-medium border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
                        value={formDifficulty}
                        onChange={e => setFormDifficulty(e.target.value as Difficulty)}
                      >
                        {Object.values(Difficulty).map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Số lượng</label>
                      <input 
                        type="number" min="1" max="20"
                        className="w-full p-3 text-base font-bold text-green-700 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 text-center bg-white shadow-sm"
                        value={formCount}
                        onChange={e => setFormCount(parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="hidden md:block"></div> {/* Spacer */}
                  </div>

                  {/* Advanced Options For THIS Config */}
                  <div className="mt-3 bg-white/80 backdrop-blur border border-green-100/80 rounded-xl p-5 shadow-sm">
                    <h4 className="text-[11px] font-black text-green-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-4 h-px bg-green-200"></span> 
                      Tùy chọn Nâng cao 
                      <span className="w-full h-px bg-green-100"></span>
                    </h4>
                    
                    <div className="space-y-5">
                      {/* STEM Checkbox */}
                      <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg hover:bg-emerald-50/50 transition-colors border border-transparent hover:border-emerald-100">
                        <input 
                          type="checkbox" 
                          checked={formRealWorld}
                          onChange={e => setFormRealWorld(e.target.checked)}
                          className="mt-1 text-emerald-500 focus:ring-emerald-500 h-5 w-5 rounded border-slate-300 bg-white" 
                        />
                        <div>
                          <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">🌿 Lồng ghép Ngữ cảnh thực tế (STEM)</span>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">Tạo bài toán ứng dụng đời sống, kinh tế thay vì toán học thuần túy.</p>
                        </div>
                      </label>

                      {/* Scan to Quiz */}
                      <div className="border-t border-slate-100 pt-4">
                         <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                           📸 Chế độ "Scan to Quiz"
                           <span className="bg-gradient-to-r from-orange-400 to-amber-500 text-white text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow-sm">Mới</span>
                         </label>
                         <p className="text-xs text-slate-500 mb-3">AI sẽ tạo biến thể câu hỏi (đúng mức độ/số lượng ở trên) dựa theo bài tập trong ảnh.</p>
                         
                         {!formImageFile ? (
                           <div 
                             onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                             onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                             onDrop={handleDrop}
                             className={`flex flex-col items-center justify-center w-full h-32 px-4 transition-all duration-300 border-2 border-dashed rounded-xl ${isDragging ? 'border-green-500 bg-green-50 scale-[1.02]' : 'border-slate-300 bg-slate-50/50 hover:border-green-400 hover:bg-slate-50'}`}
                           >
                              <div className="flex gap-5">
                                {/* Upload Button */}
                                <label className="flex flex-col items-center cursor-pointer text-slate-500 hover:text-green-600 transition-colors group">
                                   <div className="bg-white shadow-sm group-hover:shadow border border-slate-100 group-hover:border-green-200 p-2.5 rounded-full mb-2 transition-all group-hover:-translate-y-1">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                      </svg>
                                   </div>
                                   <span className="text-xs font-bold">Tải ảnh / Kéo thả</span>
                                   <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                </label>
                                
                                <div className="w-px bg-slate-200 mx-2"></div>
                                
                                {/* Camera Button */}
                                <label className="flex flex-col items-center cursor-pointer text-slate-500 hover:text-green-600 transition-colors group">
                                   <div className="bg-white shadow-sm group-hover:shadow border border-slate-100 group-hover:border-green-200 p-2.5 rounded-full mb-2 transition-all group-hover:-translate-y-1">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                   </div>
                                   <span className="text-xs font-bold">Chụp ảnh</span>
                                   <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                                </label>
                              </div>
                           </div>
                         ) : (
                           <div className="relative border-2 border-green-200 rounded-xl overflow-hidden bg-slate-100 p-2 flex items-center justify-center h-40 w-max max-w-full group shadow-inner">
                              <img src={URL.createObjectURL(formImageFile)} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg" />
                              <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                 <button onClick={clearImage} type="button" className="bg-red-500 text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-red-600 shadow-xl transform transition-transform hover:scale-105">
                                    Xóa ảnh này
                                 </button>
                              </div>
                           </div>
                         )}
                      </div>
                    </div>
                  </div>

                  <Button type="button" onClick={handleAddConfig} className="w-full md:w-auto md:self-end mt-2" variant="outline">
                    + Thêm vào Ma trận
                  </Button>

                </div>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Cấu trúc đã chọn */}
        {configs.length > 0 && (
          <Card className="border-green-200 shadow-lg shadow-green-100/50 overflow-hidden">
            <CardBody className="p-0">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Ma trận đang thiết kế ({configs.length} quy tắc)
                </h3>
              </div>
              
              <div className="bg-white overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 border-b border-slate-200 tracking-wider font-black">
                    <tr>
                      <th className="px-5 py-3">Bài học</th>
                      <th className="px-5 py-3">Thuộc tính</th>
                      <th className="px-5 py-3">Đặc biệt</th>
                      <th className="px-5 py-3 text-center text-green-600">SL</th>
                      <th className="px-5 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {configs.map((c) => (
                      <tr key={c.id} className="border-b border-slate-100 hover:bg-green-50/30 transition-colors">
                        <td className="px-5 py-4 text-slate-800 font-bold truncate max-w-[200px]" title={c.lessonTitle}>
                          {c.lessonTitle.split('.')[0]}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md w-max uppercase">{c.type}</span>
                            <span className="text-xs font-semibold text-green-700">{c.difficulty}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {c.useRealWorldContext && (
                              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md border border-emerald-200 uppercase tracking-wide" title="Yêu cầu có ngữ cảnh thực tế STEM">STEM</span>
                            )}
                            {c.imageUrl && (
                              <div className="relative group">
                                <img src={c.imageUrl} alt="Ref" className="h-9 w-9 object-cover rounded-md border border-slate-300 shadow-sm" title="Quét từ ảnh này" />
                                <div className="absolute inset-0 ring-2 ring-green-400 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </div>
                            )}
                            {!c.useRealWorldContext && !c.imageUrl && <span className="text-slate-300 font-bold text-sm">-</span>}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center text-xl font-black text-green-600 bg-green-50/50">{c.count}</td>
                        <td className="px-5 py-4 text-right">
                          <button type="button" onClick={() => handleRemoveConfig(c.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      <div className="space-y-6 md:space-y-8">
        <Card className="sticky top-24 border-2 border-green-100 shadow-xl shadow-green-100/40">
          <CardBody className="p-6 md:p-8">
             <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center justify-between border-b-2 border-slate-100 pb-4">
               <span className="flex items-center gap-2">📊 Tổng Quan Đề</span>
               <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1.5 rounded-full text-base shadow-md">{totalQuestions} Câu</span>
             </h3>
             
             {configs.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">Chưa có cấu trúc nào được thêm.<br/>Hãy thiết lập ở cột bên trái.</p>
                </div>
             ) : (
                <div className="space-y-5 mb-8">
                  {Object.values(Difficulty).map(diff => {
                    const count = configs.filter(c => c.difficulty === diff).reduce((a, b) => a + b.count, 0);
                    const percentage = totalQuestions > 0 ? Math.round((count / totalQuestions) * 100) : 0;
                    if (count === 0) return null;
                    
                    let barColor = 'bg-slate-500';
                    let textColor = 'text-slate-700';
                    if (diff === Difficulty.NHAN_BIET) { barColor = 'bg-sky-400'; textColor = 'text-sky-700'; }
                    if (diff === Difficulty.THONG_HIEU) { barColor = 'bg-emerald-400'; textColor = 'text-emerald-700'; }
                    if (diff === Difficulty.VAN_DUNG) { barColor = 'bg-amber-400'; textColor = 'text-amber-700'; }
                    if (diff === Difficulty.VAN_DUNG_CAO) { barColor = 'bg-rose-400'; textColor = 'text-rose-700'; }

                    return (
                      <div key={diff} className="flex items-center gap-3 group">
                        <div className={`w-24 text-xs font-bold ${textColor} uppercase tracking-tight truncate`} title={diff}>{diff}</div>
                        <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                          <div className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`} style={{ width: `${percentage}%` }}></div>
                        </div>
                        <div className="w-16 text-right">
                          <span className="font-black text-slate-800 text-base">{count}</span>
                          <span className="text-[10px] font-bold text-slate-400 ml-1">({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
             )}

            <Button 
              type="submit" 
              form="setup-form" 
              className="w-full shadow-green-200/50" 
              size="lg"
              isLoading={isLoading}
              disabled={configs.length === 0}
            >
              <span className="mr-2 text-xl">✨</span> AI TẠO BÀI TẬP
            </Button>
            
            <p className="text-[11px] font-medium text-center text-slate-400 mt-5 leading-relaxed bg-slate-50 p-3 rounded-xl">
              Quá trình xử lý AI có thể mất 15-30 giây tùy thuộc vào số lượng yêu cầu và độ khó.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
