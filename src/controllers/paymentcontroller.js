import axios from "axios";
import pdf from "pdfkit";
import fs from "fs";
import path from "path";
import Payment from "../models/paymentmodel.js"; // Import the Payment model

export const processPayment = async (req, res, next) => {
  try {
    const { amount, otherFields, userEmail } = req.body; // Extract necessary fields from the request body

    // Prepare the payload for the Payaza API
    const data = JSON.stringify({
      service_type: "PaymentProcessing", // Confirm service type for payments from Payaza docs
      service_payload: {
        request_application: "Payaza",
        application_module: "PAYMENT_MODULE",
        application_version: "1.0.0",
        request_class: "PaymentRequest",
        amount: amount, // Pass the amount directly
        ...otherFields, // Spread other dynamic fields into the payload
      },
    });

    // API request configuration
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://router-live.78financials.com/api/request/secure/payloadhandler", // Confirm the endpoint for payments
      headers: {
        Authorization: `Payaza ${process.env.PAYAZA_API_KEY}`,
      },
      data: data,
    };

    // Make the API request
    const response = await axios.request(config);

    // If the payment is successful, proceed to generate the receipt
    if (response.data && response.data.status === "success") {
      const paymentDetails = response.data;

      // Create PDF document for the receipt
      const doc = new pdf();
      const filePath = path.join(
        __dirname,
        "receipts",
        `${paymentDetails.transaction_id}.pdf`
      );
      const writeStream = fs.createWriteStream(filePath);

      doc.pipe(writeStream); // Output the PDF to a file

      // Add content to the PDF receipt
      doc.fontSize(16).text("Payment Receipt", { align: "center" }).moveDown();
      doc.fontSize(12).text(`Transaction ID: ${paymentDetails.transaction_id}`);
      doc.text(`Amount: ${paymentDetails.amount} ${paymentDetails.currency}`);
      doc.text(`Date: ${new Date(paymentDetails.timestamp).toLocaleString()}`);
      doc.text(`Payment Status: ${paymentDetails.status}`);
      doc.text(`User Email: ${userEmail}`);

      // Finalize the PDF document
      doc.end();

      // Wait for the PDF file to be saved
      writeStream.on("finish", async () => {
        // Save the payment details to the database
        const paymentData = {
          user: req.user._id, // Assuming `req.user` contains the authenticated user
          transaction_id: paymentDetails.transaction_id,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          status: paymentDetails.status,
          payment_method: "payaza", // Or whatever the actual payment method is
          receipt_url: filePath, // URL to the saved receipt PDF
        };

        try {
          const payment = new Payment(paymentData);
          await payment.save(); // Save the payment data to the database

          // Send the response with the saved payment details
          res.status(200).json({
            success: true,
            message: "Payment processed successfully",
            receipt: filePath, // You can send the path or the file as an attachment
          });
        } catch (error) {
          console.error("Error saving payment to the database:", error);
          next(error); // Pass the error to the middleware
        }
      });
    } else {
      throw new Error("Payment failed, no valid response from Payaza.");
    }
  } catch (error) {
    next(error); // Pass the error to the middleware
  }
};
