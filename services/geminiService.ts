import { GoogleGenAI, Type } from '@google/genai';
import { GenerationParams, Question } from '../types';

const initAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const questionSchema = {
  type: Type.ARRAY,
  description: "Danh sách các câu hỏi Toán học",
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "ID duy nhất cho câu hỏi, ví dụ: q1, q2" },
      type: { type: Type.STRING, description: "Loại câu hỏi (phải khớp chính xác với yêu cầu)" },
      lessonTitle: { type: Type.STRING, description: "Tên bài học tương ứng" },
      content: { 
        type: Type.STRING, 
        description: "Nội dung câu hỏi, bối cảnh. Sử dụng định dạng LaTeX trong dấu $ (ví dụ: $y = ax + b$)." 
      },
      options: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "CHỈ DÙNG CHO 'Trắc nghiệm 4 lựa chọn'. Mảng chứa đúng 4 chuỗi lựa chọn." 
      },
      trueFalseStatements: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            statement: { type: Type.STRING, description: "Nội dung phát biểu" },
            isTrue: { type: Type.BOOLEAN, description: "Đúng (true) hay Sai (false)" }
          }
        },
        description: "CHỈ DÙNG CHO 'Trắc nghiệm đúng/sai'. Gồm đúng 4 phát biểu a, b, c, d."
      },
      correctAnswer: { 
        type: Type.STRING, 
        description: "Đáp án đúng cho Trắc nghiệm 4 lựa chọn (A/B/C/D) hoặc Trả lời ngắn/Điền khuyết (chuỗi kết quả). Có thể bỏ trống với Tự luận." 
      },
      explanation: { 
        type: Type.STRING, 
        description: "Lời giải chi tiết từng bước." 
      },
      difficulty: { type: Type.STRING }
    },
    required: ["id", "type", "lessonTitle", "content", "explanation", "difficulty"]
  }
};

export const generateQuestions = async (params: GenerationParams): Promise<Question[]> => {
  const ai = initAI();
  
  let parts: any[] = [{ 
    text: `Bạn là một chuyên gia thiết kế chương trình và giáo viên Toán lớp 9 xuất sắc, tuân thủ chặt chẽ Chương trình GDPT 2018.
Nhiệm vụ của bạn là tạo ra một bộ câu hỏi kiểm tra/bài tập thuộc chương: "${params.chapterTitle}".\n
HÃY TUÂN THỦ TUYỆT ĐỐI CÁC CẤU TRÚC SAU ĐÂY:\n`
  }];

  // Construct parts per config to accurately pair images with rules
  params.configs.forEach((c, index) => {
    let configText = `\n--- YÊU CẦU CẤU TRÚC ${index + 1} ---\n`;
    configText += `- Chủ đề bài học: "${c.lessonTitle}"\n`;
    configText += `- Hình thức: "${c.type}"\n`;
    configText += `- Mức độ: "${c.difficulty}"\n`;
    configText += `- Số lượng: ${c.count} câu\n`;
    configText += `- Yêu cầu cần đạt: ${c.standards.join('; ')}\n`;

    if (c.useRealWorldContext) {
      configText += `- Ngữ cảnh: Ưu tiên lồng ghép bối cảnh thực tế đời sống, kinh tế, STEM vào câu hỏi.\n`;
    }

    if (c.referenceImageBase64 && c.referenceImageMimeType) {
      configText += `- CHẾ ĐỘ SCAN TO QUIZ: Dựa vào hình ảnh được cung cấp NGAY SAU ĐÂY, hãy tạo ra các câu hỏi biến thể (thay đổi số liệu, bối cảnh, hoặc cách hỏi) tương tự bài toán trong ảnh, đồng thời PHẢI TUÂN THỦ đúng Hình thức và Mức độ đã yêu cầu.\n`;
      parts.push({ text: configText });
      parts.push({
        inlineData: {
          data: c.referenceImageBase64,
          mimeType: c.referenceImageMimeType
        }
      });
    } else {
      parts.push({ text: configText });
    }
  });

  parts.push({ 
    text: `\nLƯU Ý QUAN TRỌNG VỀ ĐỊNH DẠNG:
1. Trắc nghiệm 4 lựa chọn: Cung cấp mảng \`options\` có 4 phần tử. \`correctAnswer\` là A, B, C hoặc D.
2. Trắc nghiệm đúng/sai: \`content\` là nội dung/bối cảnh chung. Cung cấp \`trueFalseStatements\` gồm đúng 4 phát biểu. Mỗi phát biểu gán \`isTrue\` (true/false).
3. Trắc nghiệm điền khuyết / Câu trả lời ngắn: Học sinh chỉ cần điền kết quả cuối cùng. \`correctAnswer\` chính là kết quả đó.
4. Tự luận: Yêu cầu học sinh trình bày các bước giải. \`correctAnswer\` có thể để trống.
5. SỬ DỤNG CHUẨN LaTeX cho toàn bộ công thức toán học. Đặt công thức inline trong cặp dấu $ (ví dụ: $x^2 + y^2 = 1$).` 
  });

  const attemptGeneration = async (modelName: string, retries: number, delayMs: number): Promise<Question[]> => {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: questionSchema,
          temperature: 0.7, 
        }
      });

      const text = response.text;
      if (!text) throw new Error("AI trả về kết quả trống.");
      
      const rawQuestions = JSON.parse(text);
      
      // Sanitize options globally
      const sanitizedQuestions: Question[] = rawQuestions.map((q: any) => ({
        ...q,
        options: q.options ? q.options.map((opt: string) => opt.replace(/^[A-D][\.\:\)]\s*/i, '').trim()) : undefined,
      }));

      return sanitizedQuestions;
    } catch (error: any) {
      const errorStr = String(error).toLowerCase();
      const isRateLimit = error?.status === 429 || 
                          error?.status === 'RESOURCE_EXHAUSTED' ||
                          errorStr.includes('429') || 
                          errorStr.includes('quota') ||
                          errorStr.includes('resource_exhausted');

      // Thực hiện Retry nếu gặp lỗi 429 và còn số lần thử lại
      if (isRateLimit && retries > 0) {
        console.warn(`[Gemini API] Bị giới hạn Quota/Rate Limit với model ${modelName}. Sẽ thử lại sau ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        
        // Cứu vãn: Đổi xuống model Flash (nhẹ hơn, quota cao hơn) nếu Pro bị chặn
        const nextModel = modelName === 'gemini-3-pro-preview' ? 'gemini-3-flash-preview' : modelName;
        return attemptGeneration(nextModel, retries - 1, delayMs * 2);
      }

      console.error("Lỗi khi gọi AI:", error);
      throw new Error(
        isRateLimit 
          ? "Hệ thống AI đang quá tải hoặc hết lượt sử dụng (Quota Exceeded). Vui lòng kiểm tra lại API Key hoặc thử lại sau."
          : (error?.message || "Đã xảy ra lỗi không xác định khi tạo câu hỏi. Vui lòng thử lại.")
      );
    }
  };

  // Khởi chạy với model ưu tiên (Pro) và thử lại tối đa 3 lần
  return attemptGeneration('gemini-3-pro-preview', 3, 2000);
};
