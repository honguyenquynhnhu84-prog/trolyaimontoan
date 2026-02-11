import { Chapter } from './types';

export const MATH_9_CHAPTERS: Chapter[] = [
  {
    id: 'c1',
    title: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lessons: [
      {
        id: 'l1',
        title: 'Bài 1. Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn',
        standards: [
          { id: 's1.1', description: 'Nhận biết được khái niệm phương trình bậc nhất hai ẩn, hệ hai phương trình bậc nhất hai ẩn' },
          { id: 's1.2', description: 'Nhận biết được khái niệm nghiệm của hệ hai phương trình bậc nhất hai ẩn' }
        ]
      },
      {
        id: 'l2',
        title: 'Bài 2. Giải hệ hai phương trình bậc nhất hai ẩn',
        standards: [
          { id: 's2.1', description: 'Giải được hệ hai phương trình bậc nhất hai ẩn bằng phương pháp thế và phương pháp cộng đại số' },
          { id: 's2.2', description: 'Tìm được nghiệm của hệ hai phương trình bậc nhất hai ẩn bằng máy tính cầm tay' }
        ]
      },
      {
        id: 'l3',
        title: 'Bài 3. Giải bài toán bằng cách lập hệ phương trình',
        standards: [
          { id: 's3.1', description: 'Giải quyết được một số vấn đề thực tiễn gắn với hệ hai phương trình bậc nhất hai ẩn' }
        ]
      }
    ]
  },
  {
    id: 'c2',
    title: 'Chương II: Phương trình và bất phương trình bậc nhất một ẩn',
    lessons: [
      {
        id: 'l4',
        title: 'Bài 4. Phương trình quy về phương trình bậc nhất một ẩn',
        standards: [
          { id: 's4.1', description: 'Giải được phương trình tích có dạng (a1x + b1)(a2x + b2) = 0' },
          { id: 's4.2', description: 'Giải được phương trình chứa ẩn ở mẫu quy về phương trình bậc nhất' }
        ]
      },
      {
        id: 'l5',
        title: 'Bài 5. Bất đẳng thức và tính chất',
        standards: [
          { id: 's5.1', description: 'Nhận biết được thứ tự trên tập hợp các số thực' },
          { id: 's5.2', description: 'Nhận biết được bất đẳng thức và mô tả được một số tính chất cơ bản của bất đẳng thức (tính chất bắc cầu; tính chất liên hệ giữa thứ tự và phép cộng, phép nhân)' }
        ]
      },
      {
        id: 'l6',
        title: 'Bài 6. Bất phương trình bậc nhất một ẩn',
        standards: [
          { id: 's6.1', description: 'Nhận biết được khái niệm bất phương trình bậc nhất một ẩn, nghiệm của bất phương trình bậc nhất một ẩn' },
          { id: 's6.2', description: 'Giải được bất phương trình bậc nhất một ẩn' }
        ]
      }
    ]
  },
  {
    id: 'c3',
    title: 'Chương III: Căn bậc hai và căn bậc ba',
    lessons: [
      {
        id: 'l7',
        title: 'Bài 7. Căn bậc hai và căn thức bậc hai',
        standards: [
          { id: 's7.1', description: 'Nhận biết được khái niệm về căn bậc hai của số thực không âm' },
          { id: 's7.2', description: 'Tính được giá trị (đúng hoặc gần đúng) căn bậc hai của một số hữu tỉ bằng máy tính cầm tay' },
          { id: 's7.3', description: 'Nhận biết được khái niệm về căn thức bậc hai của một biểu thức đại số' }
        ]
      },
      {
        id: 'l8',
        title: 'Bài 8. Khai căn bậc hai với phép nhân và phép chia',
        standards: [
          { id: 's8.1', description: 'Sử dụng các tính chất của phép khai phương (khai phương của một bình phương, một tích hay một thương) để thực hiện biến đổi, tính giá trị, rút gọn biểu thức' }
        ]
      },
      {
        id: 'l9',
        title: 'Bài 9. Biến đổi đơn giản và rút gọn biểu thức chứa căn thức bậc hai',
        standards: [
          { id: 's9.1', description: 'Thực hiện các biến đổi trục căn thức ở mẫu, khử mẫu của biểu thức lấy căn, rút gọn biểu thức chứa dấu căn' }
        ]
      },
      {
        id: 'l10',
        title: 'Bài 10. Căn bậc ba và căn thức bậc ba',
        standards: [
          { id: 's10.1', description: 'Nhận biết được khái niệm căn bậc ba của một số thực' },
          { id: 's10.2', description: 'Tính được giá trị (đúng hoặc gần đúng) căn bậc ba của một số hữu tỉ bằng máy tính cầm tay' },
          { id: 's10.3', description: 'Nhận biết được khái niệm về căn thức bậc ba của một biểu thức đại số' }
        ]
      }
    ]
  },
  {
    id: 'c4',
    title: 'Chương IV: Hệ thức lượng trong tam giác vuông (Phần Hình học)',
    lessons: [
      {
        id: 'l11',
        title: 'Bài 11. Tỉ số lượng giác của góc nhọn',
        standards: [
          { id: 's11.1', description: 'Nhận biết được các giá trị sin, côsin, tang, côtang của góc nhọn' },
          { id: 's11.2', description: 'Giải thích được TSLG của các góc nhọn đặc biệt và của hai góc phụ nhau' },
          { id: 's11.3', description: 'Tính được giá trị (đúng hoặc gần đúng) TSLG của góc nhọn bằng máy tính cầm tay' }
        ]
      },
      {
        id: 'l12',
        title: 'Bài 12. Một số hệ thức giữa cạnh, góc trong tam giác vuông và ứng dụng',
        standards: [
          { id: 's12.1', description: 'Giải thích được một số hệ thức về cạnh và góc trong tam giác vuông (cạnh góc vuông bằng cạnh huyền nhân với sin góc đối hoặc nhân với côsin góc kề...)' },
          { id: 's12.2', description: 'Giải quyết được một số vấn đề thực tiễn gắn với TSLG của góc nhọn (tính độ dài đoạn thẳng, độ lớn góc; áp dụng giải tam giác vuông)' }
        ]
      }
    ]
  },
  {
    id: 'c5',
    title: 'Chương V: Đường tròn',
    lessons: [
      {
        id: 'l13',
        title: 'Bài 13. Mở đầu về đường tròn',
        standards: [
          { id: 's13.1', description: 'Nhận biết được tâm, bán kính, đường kính, dây của đường tròn' },
          { id: 's13.2', description: 'Nhận biết hai điểm đối xứng nhau qua một tâm, qua một trục' },
          { id: 's13.3', description: 'Nhận biết được tâm đối xứng, trục đối xứng của đường tròn' }
        ]
      },
      {
        id: 'l14',
        title: 'Bài 14. Cung và dây của một đường tròn',
        standards: [
          { id: 's14.1', description: 'Nhận biết cung, dây cung, đường kính của đường tròn và quan hệ giữa độ dài dây và đường kính' },
          { id: 's14.2', description: 'Nhận biết góc ở tâm, cung bị chắn' },
          { id: 's14.3', description: 'Nhận biết và xác định số đo của một cung' },
          { id: 's14.4', description: 'So sánh được độ dài của đường kính và dây' }
        ]
      },
      {
        id: 'l15',
        title: 'Bài 15. Độ dài của cung tròn. Diện tích hình quạt tròn và hình vành khuyên',
        standards: [
          { id: 's15.1', description: 'Tính được độ dài cung tròn' },
          { id: 's15.2', description: 'Nhận biết được hình quạt tròn và hình vành khuyên' },
          { id: 's15.3', description: 'Tính được diện tích hình quạt tròn, diện tích hình vành khuyên' },
          { id: 's15.4', description: 'Giải quyết được một số vấn đề thực tiễn gắn với đường tròn (ví dụ: chuyển động tròn, diện tích hình phẳng)' }
        ]
      },
      {
        id: 'l16',
        title: 'Bài 16. Vị trí tương đối của đường thẳng và đường tròn',
        standards: [
          { id: 's16.1', description: 'Mô tả và vẽ hình biểu thị ba vị trí tương đối của đường thẳng và đường tròn: cắt nhau, tiếp xúc nhau, không giao nhau' },
          { id: 's16.2', description: 'Nhận biết tiếp tuyến của đường tròn dựa vào định nghĩa hoặc dấu hiệu nhận biết' },
          { id: 's16.3', description: 'Áp dụng tính chất của hai tiếp tuyến cắt nhau trong giải toán' }
        ]
      },
      {
        id: 'l17',
        title: 'Bài 17. Vị trí tương đối của hai đường tròn',
        standards: [
          { id: 's17.1', description: 'Mô tả được ba vị trí tương đối của hai đường tròn (không giao nhau, cắt nhau, tiếp xúc nhau)' }
        ]
      }
    ]
  },
  {
    id: 'c6',
    title: 'Chương VI: Hàm số y = ax² (a ≠ 0). Phương trình bậc hai một ẩn',
    lessons: [
      {
        id: 'l18',
        title: 'Bài 18. Hàm số y = ax² (a ≠ 0)',
        standards: [
          { id: 's18.1', description: 'Nhận biết được hàm số y = ax² (a ≠ 0)' },
          { id: 's18.2', description: 'Vẽ được đồ thị hàm số y = ax² (a ≠ 0)' },
          { id: 's18.3', description: 'Nhận biết được tính đối xứng (trục) và trục đối xứng của đồ thị hàm số y = ax² (a ≠ 0)' },
          { id: 's18.4', description: 'Giải quyết được một số vấn đề thực tiễn gắn với đồ thị của hàm số y = ax² (a ≠ 0)' }
        ]
      },
      {
        id: 'l19',
        title: 'Bài 19. Phương trình bậc hai một ẩn',
        standards: [
          { id: 's19.1', description: 'Nhận biết được khái niệm phương trình bậc hai một ẩn' },
          { id: 's19.2', description: 'Giải được phương trình bậc hai một ẩn' },
          { id: 's19.3', description: 'Tính được nghiệm phương trình bậc hai một ẩn bằng máy tính cầm tay' },
          { id: 's19.4', description: 'Vận dụng được phương trình bậc hai vào giải quyết bài toán thực tiễn' }
        ]
      },
      {
        id: 'l20',
        title: 'Bài 20. Định lí Viète và ứng dụng',
        standards: [
          { id: 's20.1', description: 'Giải thích được định lí Viète và ứng dụng (tính nhẩm nghiệm, tìm hai số biết tổng và tích)' }
        ]
      },
      {
        id: 'l21',
        title: 'Bài 21. Giải bài toán bằng cách lập phương trình',
        standards: [
          { id: 's21.1', description: 'Vận dụng được phương trình bậc hai vào giải quyết bài toán thực tiễn bằng cách lập phương trình' }
        ]
      }
    ]
  },
  {
    id: 'c7',
    title: 'Chương VII: Tần số và tần số tương đối',
    lessons: [
      {
        id: 'l22',
        title: 'Bài 22. Bảng tần số và biểu đồ tần số',
        standards: [
          { id: 's22.1', description: 'Xác định được tần số của một giá trị' },
          { id: 's22.2', description: 'Thiết lập được bảng tần số, biểu đồ tần số (biểu diễn dạng cột hoặc đoạn thẳng)' },
          { id: 's22.3', description: 'Giải thích được ý nghĩa và vai trò của tần số trong thực tiễn' },
          { id: 's22.4', description: 'Lí giải và thiết lập được dữ liệu vào bảng, biểu đồ thích hợp (bảng thống kê, cột, đoạn thẳng)' },
          { id: 's22.5', description: 'Lí giải và thực hiện được cách chuyển dữ liệu từ dạng biểu diễn này sang dạng biểu diễn khác' }
        ]
      },
      {
        id: 'l23',
        title: 'Bài 23. Bảng tần số tương đối và biểu đồ tần số tương đối',
        standards: [
          { id: 's23.1', description: 'Xác định được tần số tương đối của một giá trị' },
          { id: 's23.2', description: 'Thiết lập được bảng tần số tương đối, biểu đồ tần số tương đối (cột hoặc quạt tròn)' },
          { id: 's23.3', description: 'Giải thích được ý nghĩa và vai trò của tần số tương đối trong thực tiễn' },
          { id: 's23.4', description: 'Phát hiện và lí giải được số liệu không chính xác dựa trên mối liên hệ toán học đơn giản' }
        ]
      },
      {
        id: 'l24',
        title: 'Bài 24. Bảng tần số, tần số tương đối ghép nhóm và biểu đồ',
        standards: [
          { id: 's24.1', description: 'Thiết lập được bảng tần số ghép nhóm, bảng tần số tương đối ghép nhóm' },
          { id: 's24.2', description: 'Thiết lập được biểu đồ tần số tương đối ghép nhóm ở dạng biểu đồ cột và dạng biểu đồ đoạn thẳng' },
          { id: 's24.3', description: 'Nhận biết được mối liên hệ giữa thống kê với những kiến thức của các môn học khác và trong thực tiễn' }
        ]
      }
    ]
  },
  {
    id: 'c8',
    title: 'Chương VIII: Xác suất của biến cố trong một số mô hình xác suất đơn giản',
    lessons: [
      {
        id: 'l25',
        title: 'Bài 25. Phép thử ngẫu nhiên và không gian mẫu',
        standards: [
          { id: 's25.1', description: 'Nhận biết được phép thử ngẫu nhiên và không gian mẫu' },
          { id: 's25.2', description: 'Nhận biết được một kết quả là thuận lợi cho một biến cố trong một số phép thử đơn giản' }
        ]
      },
      {
        id: 'l26',
        title: 'Bài 26. Xác suất của biến cố liên quan tới phép thử',
        standards: [
          { id: 's26.1', description: 'Nhận biết được khái niệm đồng khả năng' },
          { id: 's26.2', description: 'Tính được xác suất của biến cố bằng cách kiểm đếm số trường hợp có thể và số trường hợp thuận lợi' }
        ]
      }
    ]
  },
  {
    id: 'c9',
    title: 'Chương IX: Đường tròn ngoại tiếp và đường tròn nội tiếp',
    lessons: [
      {
        id: 'l27',
        title: 'Bài 27. Góc nội tiếp',
        standards: [
          { id: 's27.1', description: 'Nhận biết được góc ở tâm, góc nội tiếp' },
          { id: 's27.2', description: 'Giải thích được mối liên hệ giữa số đo của cung với số đo góc ở tâm, số đo góc nội tiếp' },
          { id: 's27.3', description: 'Giải thích được mối liên hệ giữa số đo góc nội tiếp và số đo góc ở tâm cùng chắn một cung' }
        ]
      },
      {
        id: 'l28',
        title: 'Bài 28. Đường tròn ngoại tiếp và đường tròn nội tiếp của một tam giác',
        standards: [
          { id: 's28.1', description: 'Nhận biết được định nghĩa đường tròn ngoại tiếp tam giác' },
          { id: 's28.2', description: 'Xác định được tâm và bán kính đường tròn ngoại tiếp tam giác (trong đó có tam giác vuông, tam giác đều)' },
          { id: 's28.3', description: 'Vẽ được đường tròn ngoại tiếp tam giác bằng dụng cụ học tập' },
          { id: 's28.4', description: 'Nhận biết được định nghĩa đường tròn nội tiếp tam giác' },
          { id: 's28.5', description: 'Xác định được tâm và bán kính đường tròn nội tiếp tam giác (trong đó có tam giác đều)' },
          { id: 's28.6', description: 'Vẽ được đường tròn nội tiếp tam giác bằng dụng cụ học tập' }
        ]
      },
      {
        id: 'l29',
        title: 'Bài 29. Tứ giác nội tiếp',
        standards: [
          { id: 's29.1', description: 'Nhận biết được tứ giác nội tiếp đường tròn và giải thích được định lí về tổng hai góc đối của tứ giác nội tiếp bằng 180°' },
          { id: 's29.2', description: 'Xác định được tâm và bán kính đường tròn ngoại tiếp hình chữ nhật, hình vuông' }
        ]
      },
      {
        id: 'l30',
        title: 'Bài 30. Đa giác đều',
        standards: [
          { id: 's30.1', description: 'Nhận dạng được đa giác đều' },
          { id: 's30.2', description: 'Nhận biết được phép quay. Mô tả được các phép quay giữ nguyên hình đa giác đều' },
          { id: 's30.3', description: 'Nhận biết được những hình phẳng đều trong tự nhiên, nghệ thuật, kiến trúc, công nghệ chế tạo' },
          { id: 's30.4', description: 'Nhận biết được vẻ đẹp của thế giới tự nhiên biểu hiện qua tính đều' }
        ]
      }
    ]
  },
  {
    id: 'c10',
    title: 'Chương X: Một số hình khối trong thực tiễn',
    lessons: [
      {
        id: 'l31',
        title: 'Bài 31. Hình trụ và hình nón',
        standards: [
          { id: 's31.1', description: 'Mô tả được đường sinh, chiều cao, bán kính đáy của hình trụ, tạo lập được hình trụ' },
          { id: 's31.2', description: 'Tính được diện tích xung quanh và thể tích của hình trụ, hình nón' },
          { id: 's31.3', description: 'Giải quyết được một số vấn đề thực tiễn gắn với việc tính diện tích xung quanh và thể tích của hình trụ, hình nón' }
        ]
      },
      {
        id: 'l32',
        title: 'Bài 32. Hình cầu',
        standards: [
          { id: 's32.1', description: 'Mô tả được tâm, bán kính của hình cầu, tạo lập được hình cầu, mặt cầu. Nhận biết được phần chung của mặt phẳng và hình cầu' },
          { id: 's32.2', description: 'Tính được diện tích của mặt cầu, thể tích của hình cầu' },
          { id: 's32.3', description: 'Giải quyết được một số vấn đề thực tiễn gắn với việc tính diện tích của mặt cầu và thể tích của hình cầu' }
        ]
      }
    ]
  }
];
