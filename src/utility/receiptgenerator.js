// utils/receiptGenerator.js
import pdf from "pdfkit";
import fs from "fs";

export const generateReceipt = async (donation) => {
  const receiptPath = `/receipts/receipt_${donation._id}.pdf`;
  const doc = new pdf();

  doc.pipe(fs.createWriteStream(receiptPath));

  doc.fontSize(20).text("Donation Receipt", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Donor ID: ${donation.donorId}`);
  doc.text(`Donation Amount: $${donation.amount}`);
  doc.text(`Transaction Fee: $${donation.transactionFee}`);
  doc.text(`Net Amount: $${donation.netAmount}`);
  doc.text(`Donation Date: ${donation.createdAt}`);
  doc.text(`Payment Status: ${donation.paymentStatus}`);
  doc.text("Thank you for your contribution!");

  doc.end();

  return receiptPath;
};
