import React, { useState } from 'react';
import { Step1Setup } from './components/Step1Setup';
import { Step2Customize } from './components/Step2Customize';
import { Step3Publish } from './components/Step3Publish';
import { GenerationParams, Question } from './types';
import { generateQuestions } from './services/geminiService';

enum WizardStep {
  SETUP = 1,
  CUSTOMIZE = 2,
  PUBLISH = 3
}

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(WizardStep.SETUP);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chapterTitle, setChapterTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async (params: GenerationParams) => {
    setIsGenerating(true);
    setErrorMsg(null);
    setChapterTitle(params.chapterTitle);
    
    try {
      const generated = await generateQuestions(params);
      setQuestions(generated);
      setCurrentStep(WizardStep.CUSTOMIZE);
    } catch (error: any) {
      setErrorMsg(error.message || "Đã xảy ra lỗi khi tạo câu hỏi. Vui lòng thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateQuestion = (updatedQ: Question) => {
    setQuestions(prev => prev.map(q => q.id === updatedQ.id ? updatedQ : q));
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF0] font-sans pb-20 selection:bg-green-200 selection:text-green-900">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-green-100/60 shadow-sm sticky top-0 z-40 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-[4rem]">
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Vùng chứa Logo: Cập nhật viền, độ bóng và kích thước */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 bg-white rounded-full p-0.5 shadow-md border-2 border-green-500 overflow-hidden flex items-center justify-center">
              <img 
                src="./logo.png" 
                alt="Logo Trường THCS Nguyễn Văn Luông" 
                className="w-full h-full object-contain"
                title="Trường THCS Nguyễn Văn Luông"
              />
            </div>
            <div className="flex-1 ml-1">
              <h1 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-emerald-600 leading-tight text-sm sm:text-base lg:text-lg xl:text-xl line-clamp-2 md:line-clamp-1">
                Trợ lý AI hỗ trợ giáo viên soạn đề kiểm tra Toán 9
              </h1>
              <p className="text-[9px] sm:text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1">
                <span>🌟</span> Đúng chuẩn - Nhanh chóng - Sáng tạo
              </p>
            </div>
          </div>
          
          {/* Stepper Indicator (Desktop) */}
          <div className="hidden lg:flex items-center space-x-4 text-sm font-bold ml-4 shrink-0">
            <div className={`flex items-center transition-colors duration-300 ${currentStep >= 1 ? 'text-green-700' : 'text-slate-400'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs mr-2 shadow-sm transition-all duration-300 ${currentStep >= 1 ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-200' : 'bg-slate-100 text-slate-400'}`}>1</span>
              Thiết lập
            </div>
            <div className={`w-10 h-1 rounded-full transition-colors duration-300 ${currentStep >= 2 ? 'bg-green-500' : 'bg-slate-200'}`}></div>
            <div className={`flex items-center transition-colors duration-300 ${currentStep >= 2 ? 'text-green-700' : 'text-slate-400'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs mr-2 shadow-sm transition-all duration-300 ${currentStep >= 2 ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-200' : 'bg-slate-100 text-slate-400'}`}>2</span>
              Tùy chỉnh
            </div>
            <div className={`w-10 h-1 rounded-full transition-colors duration-300 ${currentStep >= 3 ? 'bg-green-500' : 'bg-slate-200'}`}></div>
            <div className={`flex items-center transition-colors duration-300 ${currentStep >= 3 ? 'text-green-700' : 'text-slate-400'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs mr-2 shadow-sm transition-all duration-300 ${currentStep >= 3 ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-200' : 'bg-slate-100 text-slate-400'}`}>3</span>
              Xuất bản
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {errorMsg && (
          <div className="mb-6 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-bold text-rose-800">{errorMsg}</p>
              </div>
            </div>
          </div>
        )}

        {currentStep === WizardStep.SETUP && (
          <Step1Setup 
            onGenerate={handleGenerate} 
            isLoading={isGenerating} 
          />
        )}

        {currentStep === WizardStep.CUSTOMIZE && (
          <Step2Customize 
            questions={questions}
            onUpdateQuestion={handleUpdateQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onBack={() => setCurrentStep(WizardStep.SETUP)}
            onNext={() => setCurrentStep(WizardStep.PUBLISH)}
          />
        )}

        {currentStep === WizardStep.PUBLISH && (
          <Step3Publish 
            questions={questions}
            chapterTitle={chapterTitle}
            onBack={() => setCurrentStep(WizardStep.CUSTOMIZE)}
            onStartOver={() => {
              setQuestions([]);
              setCurrentStep(WizardStep.SETUP);
            }}
          />
        )}

      </main>
    </div>
  );
};

export default App;
