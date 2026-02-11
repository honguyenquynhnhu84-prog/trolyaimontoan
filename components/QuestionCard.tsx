import React, { useState, useRef } from 'react';
import { Question, QuestionType } from '../types';
import { Card, CardBody, CardFooter, CardHeader } from './ui/Card';
import { MathText } from './MathText';
import { Button } from './ui/Button';

interface QuestionCardProps {
  question: Question;
  index: number;
  onEdit?: (updatedQuestion: Question) => void;
  onDelete?: (id: string) => void;
}

// Danh sách các công cụ chèn nhanh Toán học
const MATH_TOOLS = [
  { id: 'inline', icon: '$...$', tex: '$  $', offset: -2, tooltip: 'Công thức trong dòng' },
  { id: 'block', icon: '$$...$$', tex: '$$  $$', offset: -3, tooltip: 'Công thức độc lập' },
  { id: 'frac', icon: 'a/b', tex: '\\frac{ }{ }', offset: -4, tooltip: 'Phân số' },
  { id: 'sqrt', icon: '√x', tex: '\\sqrt{ }', offset: -2, tooltip: 'Căn bậc 2' },
  { id: 'pow2', icon: 'x²', tex: '^{2}', offset: 0, tooltip: 'Mũ 2' },
  { id: 'pow', icon: 'xⁿ', tex: '^{ }', offset: -2, tooltip: 'Số mũ' },
  { id: 'sub', icon: 'xₙ', tex: '_{ }', offset: -2, tooltip: 'Chỉ số dưới' },
  { id: 'sys', icon: '{x,y', tex: '\\begin{cases}  \\\\  \\end{cases}', offset: -14, tooltip: 'Hệ phương trình' },
  { id: 'deg', icon: '°', tex: '^\\circ', offset: 0, tooltip: 'Độ' },
  { id: 'angle', icon: '∠', tex: '\\widehat{ }', offset: -2, tooltip: 'Góc' },
  { id: 'triangle', icon: '△', tex: '\\Delta ', offset: 0, tooltip: 'Tam giác' },
  { id: 'pi', icon: 'π', tex: '\\pi ', offset: 0, tooltip: 'Số Pi' },
  { id: 'neq', icon: '≠', tex: '\\neq ', offset: 0, tooltip: 'Khác' },
  { id: 'ge', icon: '≥', tex: '\\ge ', offset: 0, tooltip: 'Lớn hơn bằng' },
  { id: 'le', icon: '≤', tex: '\\le ', offset: 0, tooltip: 'Nhỏ hơn bằng' },
  { id: 'perp', icon: '⊥', tex: '\\perp ', offset: 0, tooltip: 'Vuông góc' },
  { id: 'para', icon: '∥', tex: '\\parallel ', offset: 0, tooltip: 'Song song' },
];

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, index, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // States for editing
  const [editedContent, setEditedContent] = useState(question.content);
  const [editedExplanation, setEditedExplanation] = useState(question.explanation);
  const [editedOptions, setEditedOptions] = useState(question.options ? [...question.options] : ['', '', '', '']);
  const [editedAnswer, setEditedAnswer] = useState(question.correctAnswer || '');
  const [editedTF, setEditedTF] = useState(question.trueFalseStatements ? [...question.trueFalseStatements] : [
    { statement: '', isTrue: true }, { statement: '', isTrue: false }, { statement: '', isTrue: false }, { statement: '', isTrue: false }
  ]);

  // Quản lý Focus để chèn công cụ Toán học vào đúng ô input/textarea
  const [lastFocused, setLastFocused] = useState<{field: string, index?: number}>({field: 'content'});
  const inputRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});

  const setInputRef = (key: string) => (el: HTMLInputElement | HTMLTextAreaElement | null) => {
    inputRefs.current[key] = el;
  };

  const handleInsertMath = (tex: string, offset: number) => {
    const key = lastFocused.index !== undefined ? `${lastFocused.field}-${lastFocused.index}` : lastFocused.field;
    const el = inputRefs.current[key];
    if (!el) return;

    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const val = el.value;
    const newVal = val.slice(0, start) + tex + val.slice(end);

    // Cập nhật State tương ứng
    if (lastFocused.field === 'content') setEditedContent(newVal);
    else if (lastFocused.field === 'explanation') setEditedExplanation(newVal);
    else if (lastFocused.field === 'answer') setEditedAnswer(newVal);
    else if (lastFocused.field === 'option' && lastFocused.index !== undefined) {
      const newOpts = [...editedOptions];
      newOpts[lastFocused.index] = newVal;
      setEditedOptions(newOpts);
    }
    else if (lastFocused.field === 'tf' && lastFocused.index !== undefined) {
      const newTF = [...editedTF];
      newTF[lastFocused.index].statement = newVal;
      setEditedTF(newTF);
    }

    // Phục hồi focus và đặt con trỏ vào trong cặp ngoặc
    setTimeout(() => {
      el.focus();
      const newCursorPos = start + tex.length + offset;
      el.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'Nhận biết': return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'Thông hiểu': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Vận dụng': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Vận dụng cao': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case QuestionType.MULTIPLE_CHOICE: return 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200';
      case QuestionType.TRUE_FALSE: return 'bg-teal-100 text-teal-700 border-teal-200';
      case QuestionType.ESSAY: return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  }

  const handleSave = () => {
    if (onEdit) {
      onEdit({
        ...question,
        content: editedContent,
        explanation: editedExplanation,
        correctAnswer: editedAnswer,
        options: question.type === QuestionType.MULTIPLE_CHOICE ? editedOptions : undefined,
        trueFalseStatements: question.type === QuestionType.TRUE_FALSE ? editedTF : undefined,
      });
    }
    setIsEditing(false);
  };

  const labels = ['A', 'B', 'C', 'D'];
  const tfLabels = ['a', 'b', 'c', 'd'];

  return (
    <Card className={`mb-6 transition-all duration-300 ${isEditing ? 'ring-4 ring-green-200 shadow-xl' : 'hover:shadow-lg border-slate-200'}`}>
      <CardHeader className={`flex justify-between items-center py-3.5 transition-colors ${isEditing ? 'bg-green-50/80 border-b-green-100' : 'bg-gradient-to-r from-slate-50 to-white'}`}>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 whitespace-nowrap">Câu {index + 1}</span>
          <span className={`text-[11px] px-2.5 py-1 rounded-md border font-extrabold uppercase tracking-wide whitespace-nowrap ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </span>
          <span className={`text-[11px] px-2.5 py-1 rounded-md border font-extrabold uppercase tracking-wide whitespace-nowrap ${getTypeColor(question.type)}`}>
            {question.type}
          </span>
          <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-md line-clamp-1 max-w-[200px]" title={question.lessonTitle}>
            {question.lessonTitle.split('.')[0]}
          </span>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" size="sm" className="bg-white shadow-sm" onClick={() => setIsEditing(true)}>
                <span className="mr-1">✏️</span> Sửa
              </Button>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete && onDelete(question.id)}>Xóa</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Hủy</Button>
              <Button variant="primary" size="sm" onClick={handleSave}>Lưu thay đổi</Button>
            </>
          )}
        </div>
      </CardHeader>
      
      <CardBody className={isEditing ? 'bg-slate-50/50' : ''}>
        {!isEditing ? (
          <div className="space-y-4">
            <MathText text={question.content} className="font-medium text-lg text-slate-900 leading-relaxed" />
            
            {/* Multiple Choice Render */}
            {question.type === QuestionType.MULTIPLE_CHOICE && question.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                {question.options.map((opt, i) => {
                  const isCorrect = labels[i] === question.correctAnswer && showExplanation;
                  return (
                    <div key={i} className={`flex items-start p-3.5 rounded-xl border-2 transition-colors ${isCorrect ? 'bg-emerald-50 border-emerald-400 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                      <span className={`font-black text-lg mr-3 ${isCorrect ? 'text-emerald-600' : 'text-green-900'}`}>{labels[i]}.</span>
                      <MathText text={opt} className="text-base" />
                    </div>
                  );
                })}
              </div>
            )}

            {/* True False Render */}
            {question.type === QuestionType.TRUE_FALSE && question.trueFalseStatements && (
              <div className="flex flex-col gap-3 mt-5">
                {question.trueFalseStatements.map((st, i) => (
                  <div key={i} className="flex items-start p-3.5 rounded-xl border-2 bg-white border-slate-100 justify-between">
                    <div className="flex pr-4">
                      <span className="font-black mr-4 text-lg text-green-900">{tfLabels[i]})</span>
                      <MathText text={st.statement} className="text-base" />
                    </div>
                    {showExplanation && (
                      <span className={`font-black ml-4 whitespace-nowrap bg-white px-3 py-1 rounded border-2 ${st.isTrue ? 'text-emerald-600 border-emerald-200' : 'text-rose-600 border-rose-200'}`}>
                        {st.isTrue ? 'ĐÚNG' : 'SAI'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Fill Blank / Short Answer Render */}
            {(question.type === QuestionType.FILL_BLANK || question.type === QuestionType.SHORT_ANSWER) && (
              <div className="mt-5 flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 w-max">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Trả lời:</span>
                <input type="text" disabled className="flex-1 w-48 border-b-2 border-dashed border-slate-400 bg-transparent px-2 py-1 text-slate-800 focus:outline-none font-bold text-lg" />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 relative">
            
            {/* MATH TOOLBAR STICKY */}
            <div className="sticky top-16 z-10 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-md p-2.5 flex flex-wrap gap-1.5 items-center backdrop-blur-sm">
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest mr-2 hidden sm:block">Chèn Nhanh:</span>
              {MATH_TOOLS.map(tool => (
                <button
                  key={tool.id}
                  type="button"
                  title={tool.tooltip}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleInsertMath(tool.tex, tool.offset);
                  }}
                  className="px-2.5 py-1.5 text-xs bg-white hover:bg-green-500 hover:text-white text-green-700 rounded-lg border border-green-100 font-mono font-bold transition-colors shadow-sm"
                >
                  {tool.icon}
                </button>
              ))}
              <div className="ml-auto text-[10px] text-green-600 font-medium hidden md:block">
                * Click vào ô cần sửa, sau đó bấm công cụ
              </div>
            </div>

            {/* Editing mode for Content */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wide">Nội dung câu hỏi</label>
              <textarea 
                ref={setInputRef('content')}
                onFocus={() => setLastFocused({field: 'content'})}
                className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-400 bg-slate-50 hover:bg-white font-mono text-sm transition-all"
                rows={4}
                value={editedContent}
                placeholder="Nhập nội dung... Bấm nút trên thanh công cụ để chèn toán"
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className="mt-4 bg-gradient-to-br from-green-50/50 to-emerald-50/50 p-4 rounded-xl border border-green-100 min-h-[3rem]">
                <div className="text-[10px] font-black text-green-600 mb-2 uppercase tracking-wider">Xem trước hiển thị:</div>
                <MathText text={editedContent || '...'} className="text-lg text-slate-900" />
              </div>
            </div>
            
            {/* Editing Multiple Choice Options */}
            {question.type === QuestionType.MULTIPLE_CHOICE && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editedOptions.map((opt, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm focus-within:ring-4 focus-within:ring-green-500/10 focus-within:border-green-300 transition-all">
                     <label className="block text-xs font-black text-slate-500 mb-3 uppercase tracking-wide">Lựa chọn {labels[i]}</label>
                     <div className="flex items-start gap-4">
                       <input 
                         type="radio" 
                         name={`correct-${question.id}`} 
                         checked={editedAnswer === labels[i]}
                         onChange={() => setEditedAnswer(labels[i])}
                         className="mt-2.5 text-emerald-500 focus:ring-emerald-500 h-5 w-5 border-slate-300"
                       />
                       <div className="flex-1 space-y-3">
                         <input 
                           ref={setInputRef(`option-${i}`)}
                           onFocus={() => setLastFocused({field: 'option', index: i})}
                           type="text" 
                           className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-4 focus:ring-green-500/20 focus:border-green-400 font-mono text-sm bg-slate-50 hover:bg-white transition-colors"
                           value={opt}
                           placeholder={`Nhập lựa chọn ${labels[i]}...`}
                           onChange={(e) => {
                             const newOpts = [...editedOptions];
                             newOpts[i] = e.target.value;
                             setEditedOptions(newOpts);
                           }}
                         />
                         {opt.match(/[\$\\]/) && (
                           <div className="bg-green-50/50 p-3 rounded-lg border border-green-100 text-base">
                             <MathText text={opt} />
                           </div>
                         )}
                       </div>
                     </div>
                  </div>
                ))}
              </div>
            )}

            {/* Editing True/False */}
            {question.type === QuestionType.TRUE_FALSE && (
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wide">Các phát biểu (Tích chọn nếu là ĐÚNG)</label>
                {editedTF.map((st, i) => (
                  <div key={i} className="flex items-start gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm focus-within:ring-4 focus-within:ring-green-500/10 focus-within:border-green-300 transition-all">
                    <span className="mt-2.5 font-black text-lg text-green-900">{tfLabels[i]})</span>
                    <input 
                      type="checkbox" 
                      checked={st.isTrue}
                      onChange={(e) => {
                        const newTF = [...editedTF];
                        newTF[i].isTrue = e.target.checked;
                        setEditedTF(newTF);
                      }}
                      className="mt-3.5 text-emerald-500 focus:ring-emerald-500 h-5 w-5 rounded border-slate-300"
                    />
                    <div className="flex-1 space-y-3">
                      <textarea 
                        ref={setInputRef(`tf-${i}`)}
                        onFocus={() => setLastFocused({field: 'tf', index: i})}
                        className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-4 focus:ring-green-500/20 focus:border-green-400 font-mono text-sm bg-slate-50 hover:bg-white transition-colors"
                        rows={2}
                        value={st.statement}
                        placeholder={`Phát biểu ${tfLabels[i]}...`}
                        onChange={(e) => {
                          const newTF = [...editedTF];
                          newTF[i].statement = e.target.value;
                          setEditedTF(newTF);
                        }}
                      />
                      {st.statement.match(/[\$\\]/) && (
                         <div className="bg-green-50/50 p-3 rounded-lg border border-green-100 text-base">
                           <MathText text={st.statement} />
                         </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Editing Answer for Short Answer */}
            {(question.type === QuestionType.FILL_BLANK || question.type === QuestionType.SHORT_ANSWER) && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <label className="block text-xs font-black text-slate-500 mb-3 uppercase tracking-wide">Đáp án đúng</label>
                <input 
                  ref={setInputRef('answer')}
                  onFocus={() => setLastFocused({field: 'answer'})}
                  type="text" 
                  className="w-full max-w-md p-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-400 font-mono text-base font-bold bg-slate-50 hover:bg-white transition-colors"
                  value={editedAnswer}
                  onChange={(e) => setEditedAnswer(e.target.value)}
                />
                {editedAnswer.match(/[\$\\]/) && (
                  <div className="mt-3 inline-block bg-green-50/50 p-3 rounded-xl border border-green-100 text-base">
                    <MathText text={editedAnswer} />
                  </div>
                )}
              </div>
            )}

            {/* Editing Explanation */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <label className="block text-xs font-black text-slate-500 mb-3 uppercase tracking-wide">Lời giải chi tiết</label>
              <textarea 
                ref={setInputRef('explanation')}
                onFocus={() => setLastFocused({field: 'explanation'})}
                className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-400 bg-slate-50 hover:bg-white font-mono text-sm transition-all"
                rows={4}
                value={editedExplanation}
                placeholder="Nhập lời giải từng bước..."
                onChange={(e) => setEditedExplanation(e.target.value)}
              />
              <div className="mt-4 bg-gradient-to-br from-amber-50/50 to-orange-50/50 p-4 rounded-xl border border-amber-100 min-h-[3rem]">
                <div className="text-[10px] font-black text-amber-500 mb-2 uppercase tracking-wider">Xem trước hiển thị:</div>
                <MathText text={editedExplanation || '...'} className="text-base text-slate-800" />
              </div>
            </div>

          </div>
        )}
      </CardBody>

      <CardFooter className="py-4 bg-slate-50 flex flex-col gap-3 rounded-b-xl border-t border-slate-200">
        {!isEditing && (
          <button 
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-sm font-extrabold text-green-700 hover:text-green-900 flex items-center self-start bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition-colors"
          >
            {showExplanation ? '▲ Ẩn lời giải chi tiết' : '▼ Xem lời giải chi tiết & Đáp án'}
          </button>
        )}
        
        {(!isEditing && showExplanation) && (
          <div className="mt-2 p-5 bg-gradient-to-br from-amber-50 to-yellow-50/50 border border-amber-200 rounded-xl text-sm text-slate-800 shadow-sm">
            {(question.type === QuestionType.MULTIPLE_CHOICE || question.type === QuestionType.FILL_BLANK || question.type === QuestionType.SHORT_ANSWER) && question.correctAnswer && (
              <div className="font-black mb-4 text-emerald-700 text-base bg-white w-max px-4 py-2 rounded-lg border-2 border-emerald-200 shadow-sm">
                Đáp án đúng: <span className="text-emerald-600">{question.correctAnswer}</span>
              </div>
            )}
            <div className="font-black text-amber-800 mb-3 uppercase text-xs tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Lời giải chi tiết:
            </div>
            <div className="bg-white p-5 rounded-xl border border-amber-100 shadow-sm">
              <MathText text={question.explanation} className="text-base" />
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
