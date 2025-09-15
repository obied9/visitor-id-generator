const form = document.getElementById("visitorForm");
const qrCanvas = document.getElementById("qrcode");
const idCard = document.getElementById("idCard");
const idName = document.getElementById("idName");
const idCategory = document.getElementById("idCategory");
const idOrganization = document.getElementById("idOrganization");
const idQR = document.getElementById("idQR");
const downloadBtn = document.getElementById("downloadBtn");
const downloadPDF = document.getElementById("downloadPDF");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const organization = document.getElementById("organization").value;
    const category = document.getElementById("category").value;

    const visitorID = "VIS-" + Date.now();

    const qrData = `ID: ${visitorID}\nالاسم: ${fullName}\nجهة العمل: ${organization}\nالفئة: ${category}`;

    // توليد QR للعرض العام
    QRCode.toCanvas(qrCanvas, qrData, function (error) {
        if (error) console.error(error);
    });

    // ملء بطاقة ID
    idName.textContent = `الاسم: ${fullName}`;
    idCategory.textContent = `الفئة: ${category}`;
    idOrganization.textContent = `جهة العمل/الجهة التابعة: ${organization}`;

    // توليد QR داخل البطاقة
    QRCode.toCanvas(idQR, qrData, function (error) {
        if (error) console.error(error);
    });

    // عرض البطاقة
    idCard.style.display = "block";

    alert(`تم تسجيل الزائر بنجاح! ID: ${visitorID}`);
});

// تحميل البطاقة كصورة PNG
downloadBtn.addEventListener("click", () => {
    idCard.classList.add("saving"); 
    html2canvas(idCard, {scale: 2}).then(canvas => { 
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "Visitor_ID.png";
        link.click();
        idCard.classList.remove("saving");
    });
});

// تحميل البطاقة كـ PDF
downloadPDF.addEventListener("click", () => {
    idCard.classList.add("saving"); 
    html2canvas(idCard, {scale: 2}).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save("Visitor_ID.pdf");
        idCard.classList.remove("saving");
    });
});
