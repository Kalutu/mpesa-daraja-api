# Django Mpesa Daraja API Integration
This repository contains a Python Django web application that integrates with the Safaricom Mpesa Daraja API for seamless mobile payment processing. The integration allows you to securely accept payments, check transaction statuses, and more using the Mpesa Daraja API within your Django-based project.

## Features
- **Mpesa Payment Processing**: Securely process mobile payments from users.
- **Transaction Status**: Check the status of Mpesa transactions in real-time.
- **Notification Handling**: Receive and handle payment notifications from Safaricom's Mpesa API.
- **Customizable Integration**: Easily integrate the Mpesa Daraja API into your Django project.

## Prerequisites
Before getting started, make sure you have the following prerequisites:

- Python (>=3.6)
- Django (>=2.0)
- Safaricom Mpesa Daraja API credentials (Consumer Key, Consumer Secret, Lipa Na Mpesa Online Passkey)

## Configuration

To configure the Mpesa Daraja API integration, follow these steps:

1. **Set your Mpesa API credentials**: In your Django project's settings, provide the necessary Mpesa API credentials, including the Consumer Key, Consumer Secret, and Lipa Na Mpesa Online Passkey.

2. **Customize views and templates**: Tailor the views and templates to match your specific use case. This customization can include creating dedicated views and templates for payment processing, transaction status checks, and handling webhook notifications.

3. **Error handling and security**: Implement error handling, logging, and security measures that align with your project requirements. Ensure that your application effectively manages errors and exceptions during payment processing and webhook handling.

