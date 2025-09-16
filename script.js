document.addEventListener('DOMContentLoaded', () => {
    // تحديد العناصر الأساسية
    const formSection = document.getElementById('form-section');
    const cardDisplaySection = document.getElementById('card-display-section');
    const visitorForm = document.getElementById('visitorForm');
    
    // عناصر بطاقة الهوية
    const visitorIdCard = document.getElementById('visitorIdCard');
    const cardName = document.getElementById('cardName');
    const cardOrganization = document.getElementById('cardOrganization');
    const cardCategory = document.getElementById('cardCategory');
    const cardQrCanvas = document.getElementById('cardQrCanvas');

    // أزرار التحكم
    const downloadPngBtn = document.getElementById('downloadPngBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const createNewCardBtn = document.getElementById('createNewCardBtn');

    // عند تقديم النموذج
    visitorForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // الحصول على البيانات من النموذج
        const fullName = document.getElementById('fullName').value;
        const organization = document.getElementById('organization').value;
        const category = document.getElementById('category').value;
        const visitorID = "VIS-" + Date.now();

        // تجهيز بيانات QR Code بصيغة JSON
        const qrObject = {
            visitor_id: visitorID,
            full_name: fullName,
            organization: organization,
            category: category
        };
        const qrData = JSON.stringify(qrObject);

        // تعبئة بيانات البطاقة
        cardName.textContent = fullName;
        cardOrganization.textContent = organization || 'زائر'; // قيمة افتراضية إذا كانت الجهة فارغة
        cardCategory.textContent = category;

        // إعدادات QR Code لجودة عالية
        const qrOptions = {
            errorCorrectionLevel: 'H', // مستوى عالٍ لتصحيح الأخطاء
            width: 180, // تحديد حجم ثابت للكود
            margin: 1,
            color: {
                dark: "#2c3e50", // لون الكود
                light: "#FFFFFF" // لون الخلفية
            }
        };

        // إنشاء QR Code داخل البطاقة
        QRCode.toCanvas(cardQrCanvas, qrData, qrOptions, function (error) {
            if (error) console.error(error);
            console.log('QR Code generated successfully!');
        });
        
        // إخفاء النموذج وإظهار قسم البطاقة
        formSection.style.display = 'none';
        cardDisplaySection.style.display = 'block';
    });
    
    // تحميل البطاقة كصورة PNG
    downloadPngBtn.addEventListener('click', () => {
        html2canvas(visitorIdCard, { scale: 3 }).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `visitor-card-${document.getElementById('fullName').value}.png`;
            link.click();
        });
    });

    // تحميل البطاقة كـ PDF
    downloadPdfBtn.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        html2canvas(visitorIdCard, { scale: 3 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`visitor-card-${document.getElementById('fullName').value}.pdf`);
        });
    });

    // زر لإنشاء بطاقة جديدة (إعادة إظهار النموذج)
    createNewCardBtn.addEventListener('click', () => {
        cardDisplaySection.style.display = 'none';
        formSection.style.display = 'block';
        visitorForm.reset(); // إعادة تعيين حقول النموذج
    });
});
