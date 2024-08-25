# Django Mpesa Daraja

Welcome to the Django Mpesa Daraja repository! This project integrates the M-Pesa Daraja API with a Django application using the `django-daraja-api` package, enabling seamless mobile payments in your Django projects.

## Features

- **M-Pesa Integration**: Easily integrate M-Pesa payment processing with Django.
- **STK Push**: Initiate STK Push requests directly from your Django app.
- **Transaction Status**: Query the status of M-Pesa transactions.
- **Transaction Reversal**: Reverse M-Pesa transactions from your Django app.
- **Secure**: Handles M-Pesa credentials and tokens securely.

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/django-mpesa-daraja.git
cd django-mpesa-daraja
```

2. **Create a virtual environment:**
```bash
python3 -m venv env
source env/bin/activate
```
3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables:**
Create a .env file in the root of the project and add your M-Pesa credentials:
```bash
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_ENV=sandbox  # or 'production'
```

5. **Apply migrations:**
```bash
python manage.py migrate
```

6. **Run the development server:**
```bash
python manage.py runserver
```

## Usage
Once the server is running, you can initiate M-Pesa STK Push requests, check transaction statuses, and more using the API endpoints provided by the django-daraja-api package.

### Example STK Push Request
```python
from daraja.mpesa import MpesaClient

mpesa_client = MpesaClient()
response = mpesa_client.stk_push(phone_number, amount, account_reference, transaction_desc)
```
Refer to the django-daraja-api documentation for more detailed usage instructions.

## Contributing
We welcome contributions! Please fork this repository, create a new branch, and submit a pull request.
