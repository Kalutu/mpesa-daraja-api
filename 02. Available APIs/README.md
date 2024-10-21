# Safaricom M-Pesa APIs Overview

Safaricom provides a suite of APIs to facilitate seamless mobile payments, transactions, and financial services. Below is a detailed list of the APIs and their functionalities:

---

## **1. Authorization API**

Provides a **time-bound access token** required to call other Safaricom APIs.

- **Use Case:** Authenticate and access all API services.

---

## **2. Dynamic QR API**

Generates a **dynamic M-Pesa QR Code** for payments.

- **Use Case:** QR-based payments at physical stores or online.

---

## **3. M-Pesa Express (STK Push)**

Facilitates **merchant-initiated online payments**, where the customer approves the transaction on their phone.

- **Use Case:** E-commerce payments, subscription services.

---

## **4. Customer to Business (C2B) API**

Allows businesses to **register URLs** for payment validation and confirmation, and to **simulate transactions**.

- **Use Case:** Paybill and BuyGoods collections.

---

## **5. Business to Customer (B2C) API**

Enables businesses to **transfer funds from a shortcode** directly to a customer’s M-Pesa account.

- **Use Case:** Salary payments, refunds, promotional payouts.

---

## **6. Transaction Status API**

Allows checking the **status of a specific transaction** for tracking or resolving payment issues.

- **Use Case:** Payment reconciliation, issue resolution.

---

## **7. Account Balance API**

Provides the **current balance** of a BuyGoods (Till Number) account.

- **Use Case:** Track account funds and maintain financial records.

---

## **8. Reversals API**

Allows businesses to **reverse a completed transaction** in case of an error or dispute.

- **Use Case:** Refunds, correcting mistaken payments.

---

## **9. Tax Remittance API**

Facilitates **automatic tax remittance** to the Kenya Revenue Authority (KRA).

- **Use Case:** Compliance with tax regulations through automated payment.

---

## **10. Business Pay Bill API**

Allows businesses to **pay bills directly from their account** to a Paybill number or store.

- **Use Case:** Utility bill payments, supplier payments.

---

## **11. Business Buy Goods API**

Enables businesses to **pay for goods or services** directly to a till number or merchant account.

- **Use Case:** Payments to vendors and suppliers.

---

## **12. Bill Manager API**

Provides a platform for businesses and customers to **send, receive, pay, and reconcile payments**.

- **Use Case:** End-to-end bill management and reconciliation.

---

## **13. B2B Express Checkout API**

Enables merchants to initiate **USSD Push to another merchant’s till**, allowing for fast inter-merchant payments.

- **Use Case:** Vendor payments between merchants.

---

## **14. B2C Account Top-Up API**

Allows businesses to **load funds to a B2C shortcode** for disbursement purposes.

- **Use Case:** Ensuring sufficient funds for payouts.

---

## **15. M-Pesa Ratiba API**

Provides functionality for businesses to **create standing orders** through M-Pesa on their digital channels.

- **Use Case:** Automate recurring payments (e.g., subscriptions, loan repayments).

---

### **Conclusion**

These APIs offer businesses a comprehensive toolkit for integrating **M-Pesa payments and services**, ensuring seamless transactions, better financial management, and compliance with tax regulations.

To begin integrating these APIs, create an account on the [Daraja Portal](https://developer.safaricom.co.ke) and generate the necessary credentials.
