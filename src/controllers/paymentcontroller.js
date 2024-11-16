import axios from "axios";

export const processPayment = async (req, res, next) => {
  try {
    const { amount, otherFields } = req.body; // Extract necessary fields from the request body

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
        Authorization: `Payaza ${process.env.PAYAZA_API_KEY}`, // Use environment variable for the API key
        "Content-Type": "application/json",
      },
      data: data,
    };

    // Make the API request
    const response = await axios.request(config);

    // Return the response data
    res.status(200).json({
      success: true,
      data: response.data, // Adjust this based on Payaza's response structure
    });
  } catch (error) {
    console.error(error.response?.data || error.message); // Log error details
    next(error); // Pass the error to the middleware
  }
};
