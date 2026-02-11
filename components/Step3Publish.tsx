import React, { useMemo, useState } from 'react';
import { Question, LessonMatrix, QuestionType } from '../types';
import { Button } from './ui/Button';
import { Card, CardBody, CardHeader } from './ui/Card';

interface Step3PublishProps {
  questions: Question[];
  chapterTitle: string;
  onBack: () => void;
  onStartOver: () => void;
}

export const Step3Publish: React.FC<Step3PublishProps> = ({ 
  questions, 
  chapterTitle,
  onBack,
  onStartOver
}) => {
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [isExportingQuizizz, setIsExportingQuizizz] = useState(false);

  // Calculate matrix rows per lesson
  const matrixRows = useMemo(() => {
    const rowsMap: Record<string, LessonMatrix> = {};
    
    questions.forEach(q => {
      if (!rowsMap[q.lessonTitle]) {
        rowsMap[q.lessonTitle] = { lessonTitle: q.lessonTitle, nhanBiet: 0, thongHieu: 0, vanDung: 0, vanDungCao: 0, total: 0 };
      }
      const r = rowsMap[q.lessonTitle];
      if (q.difficulty.includes('Nhận biết')) r.nhanBiet++;
      else if (q.difficulty.includes('Thông hiểu')) r.thongHieu++;
      else if (q.difficulty.includes('Vận dụng cao')) r.vanDungCao++;
      else if (q.difficulty.includes('Vận dụng')) r.vanDung++;
      r.total++;
    });

    return Object.values(rowsMap);
  }, [questions]);

  const totalSummary = matrixRows.reduce((acc, row) => ({
    nhanBiet: acc.nhanBiet + row.nhanBiet,
    thongHieu: acc.thongHieu + row.thongHieu,
    vanDung: acc.vanDung + row.vanDung,
    vanDungCao: acc.vanDungCao + row.vanDungCao,
    total: acc.total + row.total
  }), { nhanBiet: 0, thongHieu: 0, vanDung: 0, vanDungCao: 0, total: 0 });

  const handleExportWord = () => {
    setIsExportingWord(true);
    
    try {
      let html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>Đề kiểm tra</title>
          <style>
            body { font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.5; }
            h1 { text-align: center; font-size: 18pt; text-transform: uppercase; }
            h2 { font-size: 16pt; margin-top: 24pt; border-bottom: 1px solid #000; padding-bottom: 5pt; }
            .question { margin-bottom: 15pt; }
            .question-text { font-weight: bold; }
            .options { margin-top: 5pt; margin-bottom: 0; padding-left: 15pt; list-style-type: none; }
            .option { margin-bottom: 4pt; }
            .explanation-box { background-color: #f9f9f9; padding: 10pt; border: 1px solid #ddd; margin-bottom: 15pt; }
          </style>
        </head>
        <body>
          <h1>ĐỀ KIỂM TRA</h1>
          <p style="text-align: center;"><b>Chủ đề:</b> ${chapterTitle}</p>
          <hr/>
          
          <h2>Phần I: Nội dung câu hỏi</h2>
      `;

      questions.forEach((q, index) => {
        html += `<div class="question">`;
        html += `<div class="question-text">Câu ${index + 1} (${q.type}): ${q.content.replace(/\n/g, '<br/>')}</div>`;
        
        if (q.type === QuestionType.MULTIPLE_CHOICE && q.options) {
          html += `<ul class="options">`;
          const labels = ['A', 'B', 'C', 'D'];
          q.options.forEach((opt, optIndex) => {
            html += `<li class="option"><b>${labels[optIndex]}.</b> ${opt}</li>`;
          });
          html += `</ul>`;
        } 
        else if (q.type === QuestionType.TRUE_FALSE && q.trueFalseStatements) {
          html += `<p><i>(Học sinh trả lời Đúng/Sai cho từng ý sau)</i></p><ul class="options">`;
          const labels = ['a', 'b', 'c', 'd'];
          q.trueFalseStatements.forEach((st, optIndex) => {
            html += `<li class="option"><b>${labels[optIndex]})</b> ${st.statement}</li>`;
          });
          html += `</ul>`;
        } 
        else if (q.type === QuestionType.FILL_BLANK || q.type === QuestionType.SHORT_ANSWER || q.type === QuestionType.ESSAY) {
          // Add some blank space for writing
          const spaces = q.type === QuestionType.ESSAY ? 150 : 30;
          html += `<div style="margin-top: 15pt; height: ${spaces}px; border-bottom: 1px dotted #ccc;"></div>`;
        }
        
        html += `</div>`;
      });

      html += `<h2>Phần II: Đáp án và Hướng dẫn chấm</h2>`;
      
      questions.forEach((q, index) => {
        html += `<div class="explanation-box">`;
        html += `<p><b>Câu ${index + 1} (${q.difficulty}):</b></p>`;
        
        if (q.type === QuestionType.MULTIPLE_CHOICE || q.type === QuestionType.FILL_BLANK || q.type === QuestionType.SHORT_ANSWER) {
          html += `<p>Đáp án đúng: <b>${q.correctAnswer}</b></p>`;
        } else if (q.type === QuestionType.TRUE_FALSE && q.trueFalseStatements) {
          html += `<p>Đáp án: `;
          const labels = ['a', 'b', 'c', 'd'];
          q.trueFalseStatements.forEach((st, i) => {
            html += `<b>${labels[i]}</b> ${st.isTrue ? 'Đúng' : 'Sai'}; `;
          });
          html += `</p>`;
        }

        html += `<p><b>Lời giải:</b><br/>${q.explanation.replace(/\n/g, '<br/>')}</p>`;
        html += `</div>`;
      });

      html += `</body></html>`;

      const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `De_Kiem_Tra_Toan9_${new Date().getTime()}.doc`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Lỗi khi xuất Word:", error);
      alert("Có lỗi xảy ra khi xuất file Word.");
    } finally {
      setIsExportingWord(false);
    }
  };

  const handleExportQuizizz = () => {
    setIsExportingQuizizz(true);
    
    try {
      let csv = 'Question Text,Question Type,Option 1,Option 2,Option 3,Option 4,Correct Answer,Time in seconds\n';

      const mapAnswerToNumber = (letter: string) => {
        const map: {[key: string]: number} = {'A': 1, 'B': 2, 'C': 3, 'D': 4};
        return map[letter.toUpperCase()] || 1;
      };

      questions.forEach(q => {
        const escapeCsv = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
        const content = escapeCsv(q.content);
        const time = 60; 

        if (q.type === QuestionType.MULTIPLE_CHOICE && q.options) {
          const correctNum = mapAnswerToNumber(q.correctAnswer || 'A');
          csv += `${content},Multiple Choice,${escapeCsv(q.options[0])},${escapeCsv(q.options[1])},${escapeCsv(q.options[2])},${escapeCsv(q.options[3])},${correctNum},${time}\n`;
        } 
        else if (q.type === QuestionType.FILL_BLANK || q.type === QuestionType.SHORT_ANSWER) {
          csv += `${content},Fill-in-the-Blank,${escapeCsv(q.correctAnswer || '')},,,,1,${time}\n`;
        }
        else if (q.type === QuestionType.ESSAY) {
          csv += `${content},Open-Ended,,,,,,${time}\n`;
        }
        // Quizizz CSV import doesn't cleanly support Vietnam's 4-statement True/False cluster. 
        // Best approach is exporting them as Open-Ended for manual review if needed, or skipping.
        else if (q.type === QuestionType.TRUE_FALSE) {
           const combinedContext = q.content + " (Học sinh đánh giá Đúng/Sai: " + (q.trueFalseStatements?.map(s => s.statement).join('; ') || '') + ")";
           csv += `${escapeCsv(combinedContext)},Open-Ended,,,,,,${time}\n`;
        }
      });

      const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Quizizz_Import_${new Date().getTime()}.csv`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Lỗi khi xuất Quizizz CSV:", error);
      alert("Có lỗi xảy ra khi xuất file Quizizz.");
    } finally {
      setIsExportingQuizizz(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-200 sticky-header">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <span className="bg-gradient-to-br from-green-500 to-emerald-500 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg shadow-green-200">3</span>
            🖨️ Xuất bản & Ma trận
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-2 ml-14">Kiểm tra lại ma trận đặc tả và chọn định dạng xuất file.</p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0 ml-14 sm:ml-0">
          <Button variant="outline" onClick={onBack}>Sửa lại câu hỏi</Button>
          <Button variant="ghost" onClick={onStartOver}>Tạo bộ mới</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="overflow-hidden border-slate-200 shadow-md">
            <CardHeader className="bg-slate-800 text-white py-4">
              <h3 className="font-bold flex items-center gap-2 text-lg uppercase tracking-wide">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                </svg>
                Ma Trận Đặc Tả Theo Bài
              </h3>
            </CardHeader>
            <CardBody className="p-0 overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-[11px] text-slate-500 uppercase bg-slate-50 border-b border-slate-200 font-black tracking-widest">
                  <tr>
                    <th scope="col" className="px-5 py-4">Bài học</th>
                    <th scope="col" className="px-3 py-4 text-center text-sky-600">NB</th>
                    <th scope="col" className="px-3 py-4 text-center text-emerald-600">TH</th>
                    <th scope="col" className="px-3 py-4 text-center text-amber-600">VD</th>
                    <th scope="col" className="px-3 py-4 text-center text-rose-600">VDC</th>
                    <th scope="col" className="px-4 py-4 text-center text-green-600">Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {matrixRows.map((row, i) => (
                    <tr key={i} className="bg-white border-b hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-800 break-words max-w-[200px]" title={row.lessonTitle}>
                        {row.lessonTitle.split('.')[0]}
                      </td>
                      <td className="px-3 py-4 text-center font-medium">{row.nhanBiet || '-'}</td>
                      <td className="px-3 py-4 text-center font-medium">{row.thongHieu || '-'}</td>
                      <td className="px-3 py-4 text-center font-medium">{row.vanDung || '-'}</td>
                      <td className="px-3 py-4 text-center font-medium">{row.vanDungCao || '-'}</td>
                      <td className="px-4 py-4 text-center font-black text-green-700 bg-green-50/30">{row.total}</td>
                    </tr>
                  ))}
                  
                  {/* Summary Footer */}
                  <tr className="bg-slate-100 font-black border-t-2 border-slate-200">
                    <td className="px-5 py-4 text-right text-slate-600 uppercase tracking-widest text-xs">Tổng số câu</td>
                    <td className="px-3 py-4 text-center text-sky-600 text-lg">{totalSummary.nhanBiet}</td>
                    <td className="px-3 py-4 text-center text-emerald-600 text-lg">{totalSummary.thongHieu}</td>
                    <td className="px-3 py-4 text-center text-amber-600 text-lg">{totalSummary.vanDung}</td>
                    <td className="px-3 py-4 text-center text-rose-600 text-lg">{totalSummary.vanDungCao}</td>
                    <td className="px-4 py-4 text-center text-green-700 text-xl bg-green-100/60">{totalSummary.total}</td>
                  </tr>
                </tbody>
              </table>
            </CardBody>
          </Card>
          
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-green-200 rounded-2xl p-5 flex gap-4 shadow-sm">
             <div className="text-4xl mt-1">💡</div>
             <div>
               <h4 className="font-black text-green-900 text-base">Chuyên nghiệp & Tốc độ</h4>
               <p className="text-sm font-medium text-green-800/80 mt-1 leading-relaxed">
                 Hệ thống tự động căn chỉnh và phân loại biểu mẫu. File Word được xuất ra có đầy đủ lời giải với chuẩn định dạng font Times New Roman 14pt dành cho giáo viên Việt Nam.
               </p>
             </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="border-green-200 shadow-lg shadow-green-100/50">
            <CardBody className="p-6 flex flex-col gap-5">
              <h3 className="font-black text-green-900 text-lg uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Tùy chọn Xuất bản
              </h3>
              
              <Button 
                className="w-full justify-start text-left bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-white shadow-md hover:shadow-lg py-4 border-0" 
                onClick={handleExportWord}
                isLoading={isExportingWord}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="bg-white/20 p-2 rounded-lg text-xl">📄</div> 
                  <div>
                    <div className="font-bold text-base">Xuất file Word</div>
                    <div className="text-[10px] font-medium text-teal-100 uppercase tracking-widest mt-0.5">Định dạng Docx</div>
                  </div>
                </div>
              </Button>
              
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <Button 
                  className="w-full justify-start text-left bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg py-4 border-0"
                  onClick={handleExportQuizizz}
                  isLoading={isExportingQuizizz}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="bg-white/20 p-2 rounded-lg text-xl">🚀</div> 
                    <div>
                      <div className="font-bold text-base">Xuất file Quizizz</div>
                      <div className="text-[10px] font-medium text-emerald-100 uppercase tracking-widest mt-0.5">Định dạng CSV</div>
                    </div>
                  </div>
                </Button>
                <p className="text-[11px] font-medium text-slate-500 text-center px-2 mt-2 leading-relaxed">
                  Tải file này lên mục "Import from spreadsheet" trên Quizizz để tạo đề ngay lập tức. Các loại câu hỏi phức tạp sẽ được tự động chuyển thành dạng Open-Ended tương thích.
                </p>
              </div>

            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
