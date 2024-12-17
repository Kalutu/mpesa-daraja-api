const axios = require("axios");

const darajaAuthMiddleware = async (req, res, next) => {
  try {
    const { CONSUMER_KEY, CONSUMER_SECRET, BASE_URL } = process.env;

    // Validate environment variables
    if (!CONSUMER_KEY || !CONSUMER_SECRET || !BASE_URL) {
      throw new Error(
        "Environment variables CONSUMER_KEY, CONSUMER_SECRET, or BASE_URL are missing."
      );
    }

    // Encode the credentials
    const encodedCredentials = Buffer.from(
      `${CONSUMER_KEY}:${CONSUMER_SECRET}`
    ).toString("base64");

    // Make the GET request to the Daraja auth API
    const response = await axios.get(
      `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      }
    );

    // Check if the token was returned
    if (!response.data || !response.data.access_token) {
      throw new Error("Failed to retrieve access token from Daraja API.");
    }

    // Pass the token to the request object
    req.darajaToken = response.data.access_token;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error authenticating with Daraja API:", error.message);

    // Handle specific axios errors
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data.errorMessage || "Daraja API error occurred",
      });
    }

    // Handle generic errors
    res.status(500).json({ error: "Failed to authenticate with Daraja API" });
  }
};

module.exports = darajaAuthMiddleware;
