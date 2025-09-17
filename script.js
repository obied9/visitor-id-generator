document.addEventListener('DOMContentLoaded', () => {
    // تحديد العناصر الأساسية
    const generatorSection = document.getElementById('generator-section');
    const cardDisplaySection = document.getElementById('card-display-section');
    const generateBtn = document.getElementById('generateBtn');
    
    // عناصر بطاقة الهوية
    const visitorIdCard = document.getElementById('visitorIdCard');
    const cardUniqueId = document.getElementById('cardUniqueId');
    const cardQrCanvas = document.getElementById('cardQrCanvas');

    // أزرار التحكم
    const downloadPngBtn = document.getElementById('downloadPngBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const createNewCardBtn = document.getElementById('createNewCardBtn');

    // عند الضغط على زر الإنشاء
    generateBtn.addEventListener('click', function() {
        // إنشاء معرف فريد باستخدام الوقت الحالي
        const visitorID = "VIS-" + Date.now();

        // تجهيز كائن JSON مبسط يحتوي على المعرف فقط
        const qrObject = {
            visitor_id: visitorID,
        };
        const qrData = JSON.stringify(qrObject);

        // تعبئة بيانات البطاقة (المعرف الفريد فقط)
        cardUniqueId.textContent = visitorID;

        // إعدادات QR Code لجودة عالية
        const qrOptions = {
            errorCorrectionLevel: 'H',
            width: 200,
            margin: 1,
        };

        // إنشاء QR Code داخل البطاقة
        QRCode.toCanvas(cardQrCanvas, qrData, qrOptions, function (error) {
            if (error) console.error(error);
        });
        
        // إخفاء قسم الإنشاء وإظهار قسم البطاقة
        generatorSection.style.display = 'none';
        cardDisplaySection.style.display = 'block';
    });
    
    // تحميل البطاقة كصورة PNG
    downloadPngBtn.addEventListener('click', () => {
        const uniqueId = cardUniqueId.textContent;
        html2canvas(visitorIdCard, { scale: 3 }).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `visitor-card-${uniqueId}.png`;
            link.click();
        });
    });

    // تحميل البطاقة كـ PDF
    downloadPdfBtn.addEventListener('click', () => {
        const uniqueId = cardUniqueId.textContent;
        const { jsPDF } = window.jspdf;
        html2canvas(visitorIdCard, { scale: 3 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`visitor-card-${uniqueId}.pdf`);
        });
    });

    // زر لإنشاء بطاقة جديدة
    createNewCardBtn.addEventListener('click', () => {
        cardDisplaySection.style.display = 'none';
        generatorSection.style.display = 'block';
    });
});
