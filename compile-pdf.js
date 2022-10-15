var { PDFDocument, StandardFonts } = require('pdf-lib');
const axios = require('axios');
const fs = require('fs/promises');
const crypto = require('crypto');

module.exports = async function (form) {
    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(await fs.readFile('./assets/dform.pdf'));

    // Embed the Courier font
    const courierFont = await pdfDoc.embedFont(StandardFonts.Courier);

    // Get the first page of the document
    const firstPage = pdfDoc.getPages()[0];
    
    // Draw elements
    const drawPFP = async () => {
        let image = await axios.get(form.photo_of_applicant, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(image.data).toString('base64');
        const jpgImage = await pdfDoc.embedJpg(buffer);
        const scaledJpg = jpgImage.scale(90 / (jpgImage.width >= jpgImage.height ? jpgImage.width : jpgImage.height));
        firstPage.drawImage(jpgImage, {
            x: 414 + scaledJpg.width / 2,
            y: 765 - scaledJpg.height / 2,
            width: scaledJpg.width,
            height: scaledJpg.height,
        });
        console.log(firstPage.getHeight(), firstPage.getWidth())
    }; await drawPFP();

    firstPage.drawText((form.membership_type  || 'N / A'), {
        x: 185,
        y: 630,
        size: 10,
        font: courierFont,
    });

    firstPage.drawText(form.name_of_company_firm  || 'N / A', {
        x: 185,
        y: 604,
        size: 10,
        font: courierFont,
    });

    firstPage.drawText(form.company_address  || 'N / A', {
        x: 185,
        y: 578,
        size: 10,
        font: courierFont,
    });

    firstPage.drawText(form.company_phones  || 'N / A', {
        x: 185,
        y: 552,
        size: 10,
        font: courierFont,
    });

    firstPage.drawText(form.company_email  || 'N / A', {
        x: 185,
        y: 526,
        size: 10,
        font: courierFont,
    });

    firstPage.drawText(form.pan_number  || 'N / A', {
        x: 185,
        y: 500,
        size: 10,
        font: courierFont,
    });

    firstPage.drawText(form.gst_number  || 'N / A', {
        x: 185,
        y: 474,
        size: 10,
        font: courierFont,
    });

    firstPage.drawText(`${form.name_of_applicant} (${form.applicant_gender}) (${form.applicant_designation === 'others' ? form.applicant_designation_specification : form.applicant_designation})`  || 'N / A', {
        x: 185,
        y: 448,
        size: 10,
        font: courierFont,
    });

    firstPage.drawText(form.applicant_contact_number || 'N / A', {
        x: 185,
        y: 422,
        size: 10,
        font: courierFont,
    });

    firstPage.drawText(form.applicant_aadhaar_number  || 'N / A', {
        x: 185,
        y: 396,
        size: 10,
        font: courierFont,
    });

    firstPage.drawText(form.document_proof_description  || 'N / A', {
        x: 185,
        y: 367,
        size: 10,
        font: courierFont,
    });

    firstPage.drawText(form.main_line  || 'N / A', {
        x: 185,
        y: 335,
        size: 10,
        font: courierFont,
    });

    firstPage.drawText(form.name_of_nm  || 'N / A', {
        x: 185,
        y: 305,
        size: 10,
        font: courierFont,
    });

    firstPage.drawText((form.nm_designation === 'others' ? form.nm_designation_specification : form.nm_designation) || 'N / A', {
        x: 185,
        y: 279,
        size: 10,
        font: courierFont,
    });

    firstPage.drawText(form.nm_aadhaar_number  || 'N / A', {
        x: 185,
        y: 254,
        size: 10,
        font: courierFont,
    });

    firstPage.drawText(form.amount  || 'N / A', {
        x: 185,
        y: 228,
        size: 10,
        font: courierFont,
    });

    firstPage.drawText(form.cash_cheque_dd_no  || 'N / A', {
        x: 185,
        y: 202,
        size: 10,
        font: courierFont,
    });

    firstPage.drawText(form.cash_cheque_dd_date  || 'N / A', {
        x: 185,
        y: 176,
        size: 10,
        font: courierFont,
    });

    firstPage.drawText(`${form.proposed_by} (${form.proposed_by_id})`  || 'N / A', {
        x: 185,
        y: 150,
        size: 10,
        font: courierFont,
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    const fileName = `${crypto.randomBytes(25).toString('hex')}.pdf`;

	await fs.writeFile(fileName, pdfBytes);
    return fileName;
};
