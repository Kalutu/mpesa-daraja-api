# **Getting Credentials for M-Pesa Integration**

Once you've received your **Paybill/Till number** and **admin account email**, you’re just a few steps away from going live! Let’s walk through the process.

---

## **Important Note**

This guide is for production Paybills or Tills. If you’re still in the application phase or just developing, you can start building and testing in the **sandbox environment** provided by Safaricom.

---

## **Why Use the Daraja Portal?**

To integrate M-Pesa payments into your systems, you’ll need specific credentials to authenticate requests. These include:

- **Consumer Key**
- **Consumer Secret**
- **PassKey**

These credentials can only be generated via the **Daraja portal** and are essential for both testing and live integrations.

---

## **Getting Sandbox (Test) Credentials**

The **sandbox environment** allows you to develop and test your integration before going live.

1. **Create a Daraja Portal Account:**  
   If you don’t have one, [create an account here](https://developer.safaricom.co.ke).

2. **Create a New App:**

   - Once logged in, go to the **"My Apps"** tab and click **"Create New App."**
   - Tick all checkboxes to avoid missing any required permissions.

   ![New App Creation](#) <!-- Placeholder for image -->

3. **Retrieve Your Sandbox Credentials:**

   - After creating your app, it will appear under **"Sandbox Apps."**
   - Copy the **Consumer Key** and **Consumer Secret** from there.

   ![Sandbox App Credentials](#) <!-- Placeholder for image -->

4. **Simulate API Requests:**

   - Click the **"APIs"** tab, select your app from the dropdown, and retrieve credentials for testing.

   ![API Simulation Page](#) <!-- Placeholder for image -->

---

## **Getting Live Credentials**

Once you’re ready to go live, follow these steps to obtain the production credentials:

1. **Go Live Tab:**  
   Head over to the **"Go Live"** tab on the Daraja portal and follow the prompts. No need to create an app for production.

2. **PassKey via Email:**  
   Your **PassKey** will be sent directly to your email after your Paybill or Till is successfully activated.

---

## **Summary of Required Credentials**

You now have the three essential credentials:

- **Consumer Key**
- **Consumer Secret**
- **PassKey**

Once these are ready, you’re all set to integrate M-Pesa with your system and start accepting payments.

---

With these credentials, your M-Pesa integration journey is complete! Now, you're ready to **authenticate API requests and receive payments securely.**

**Happy coding and successful transactions! 🚀**
