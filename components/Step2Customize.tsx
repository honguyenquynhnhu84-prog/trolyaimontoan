import React from 'react';
import { Question } from '../types';
import { QuestionCard } from './QuestionCard';
import { Button } from './ui/Button';

interface Step2CustomizeProps {
  questions: Question[];
  onUpdateQuestion: (q: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Customize: React.FC<Step2CustomizeProps> = ({ 
  questions, 
  onUpdateQuestion, 
  onDeleteQuestion, 
  onNext, 
  onBack 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky-header">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            📝 Tùy chỉnh nội dung
          </h2>
          <p className="text-sm text-slate-500 mt-1 ml-10">Đã tạo {questions.length} câu hỏi. Bạn có thể chỉnh sửa nội dung hoặc xóa câu không ưng ý.</p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0 ml-10 sm:ml-0">
          <Button variant="outline" onClick={onBack}>Quay lại</Button>
          <Button variant="primary" onClick={onNext}>Hoàn tất & Xuất bản ➔</Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {questions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500">Chưa có câu hỏi nào. Vui lòng quay lại bước 1 để tạo.</p>
          </div>
        ) : (
          questions.map((q, index) => (
            <QuestionCard 
              key={q.id} 
              question={q} 
              index={index} 
              onEdit={onUpdateQuestion}
              onDelete={onDeleteQuestion}
            />
          ))
        )}
      </div>
    </div>
  );
};
