# Payment Confirmation App

This project is a payment confirmation page built with **Django** and **Bootstrap 5**. It integrates with **M-Pesa Epress API**, enabling users to confirm their payments securely through M-Pesa PIN input. The app uses JavaScript to poll payment status and provide real-time updates.

---

## Features

- **M-Pesa STK Push Integration**: Sends an STK push request for payment.
- **Payment Status Polling**: Uses AJAX to check the payment status every 2 seconds.
- **Real-time Updates**: Provides immediate feedback on payment success or failure.
- **Retry Option**: Allows users to retry the payment if the transaction fails.
- **Bootstrap 5 UI**: Responsive design using Bootstrap.
- **Confetti Animation on Success**: Confetti appears when the payment is completed successfully.

---

## Technologies Used

- **Backend**: Django
- **Frontend**: HTML, Bootstrap 5, JavaScript
- **Payment Integration**: M-Pesa STK Push

---

## How to Run the Project

1. Clone the repository:

   ```bash
   git clone https://github.com/Kalutu/mpesa-daraja-api.git

   ```

2. Go to app directory:

   ```bash
   cd "mpesa-daraja-api/07. Compelete Code/Python (Django)"
   ```

3. Activate virtual environment:

   ```bash
   source venv/bin/activate
   ```

4. Switch to project directory:

   ```bash
   cd payments
   ```

5. Create .env file. Sample:

   ```bash
   CONSUMER_KEY=your_key
   CONSUMER_SECRET=your_secret
   MPESA_PASSKEY=your_passkey
   MPESA_SHORTCODE=your_shortcode for sandbox use 174379
   MPESA_BASE_URL=https://sandbox.safaricom.co.ke or https://api.safaricom.co.ke for sandbox or live respectively
   CALLBACK_URL=your_callbackurl
   ```

6. Apply migrations:

   ```bash
   python manage.py migrate
   ```

7. Start the Django server:

   ```bash
   python manage.py runserver
   ```

8. Access the app at `http://127.0.0.1:8000/`.

---

## How it Works

1. **Initiate Payment**: User triggers an M-Pesa payment request.
2. **STK Push Sent**: User receives an STK push and enters their PIN on their phone.
3. **Polling Status**: The app polls the payment status every 2 seconds.
4. **Success or Failure**: Displays appropriate messages based on the result, with confetti animation on success.
