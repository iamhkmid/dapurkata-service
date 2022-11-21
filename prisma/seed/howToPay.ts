export const htp_bca_bank_transfer = JSON.stringify([
  {
    name: "ATM BCA",
    stages: [
      "On the main menu, choose Other Transaction.",
      "Choose Transfer.",
      "Choose Transfer To BCA Virtual Account.",
      "Enter your Payment Code (11 digits code) and press Correct.",
      "Enter the full amount to be paid and press Correct.",
      "Your payment details will appear on the payment confirmation page. If the information is correct press Yes.",
    ],
  },
  {
    name: "Klik BCA",
    stages: [
      "Choose Menu Fund Transfer.",
      "Choose Transfer To BCA Virtual Account.",
      "Input BCA Virtual Account Number or Choose from Transfer list and click Continue.",
      "Amount to be paid, account number and Merchant name will appear on the payment confirmation page, if the information is right click Continue.",
      "Get your BCA token and input KEYBCA Response APPLI 1 and click Submit.",
      "Your Transaction is Done.",
    ],
  },
  {
    name: "m-BCA",
    stages: [
      "Log in to your BCA Mobile app.",
      "Choose m-BCA, then input your m-BCA access code.",
      "Choose m-Transfer, then choose BCA Virtual Account.",
      "Input Virtual Account Number or choose an existing account from Daftar Transfer.",
      "Input the payable amount.",
      "Input your m-BCA pin.",
      "Payment is finished. Save the notification as your payment receipt.",
    ],
  },
]);

export const htp_bni_bank_transfer = JSON.stringify([
  {
    name: "ATM BNI",
    stages: [
      "On the main menu, choose Others.",
      "Choose Transfer.",
      "Choose Savings Account.",
      "Choose To BNI Account.",
      "Enter the payment account number and press Yes.",
      "Enter the full amount to be paid. If the amount entered is not the same as the invoiced amount, the transaction will be declined.",
      "Amount to be paid, account number, and merchant name will appear on the payment confirmation page. If the information is correct, press Yes.",
      "You are done.",
    ],
  },
  {
    name: "Internet Banking",
    stages: [
      "Go to https://ibank.bni.co.id and then click Login.",
      "Continue login with your User ID and Password.",
      "Click Transfer and then Add Favorite Account and choose Antar Rekening BNI.",
      "Enter account name, account number, and email and then click Continue.",
      "Input the Authentification Code from your token and then click Continue.",
      "Back to main menu and select Transfer and then Transfer Antar Rekening BNI.",
      "Pick the account that you just created in the previous step as Rekening Tujuan and fill in the rest before clicking Continue.",
      "Check whether the details are correct, if they are, please input the Authentification Code and click Continue and you are done.",
    ],
  },
  {
    name: "Mobile Banking",
    stages: [
      "Open the BNI Mobile Banking app and login",
      "Choose menu Transfer",
      "Choose menu Virtual Account Billing",
      "Choose the bank account you want to use",
      "Enter the 16 digits virtual account number",
      "The billing information will appear on the payment validation page",
      "If the information is correct, enter your password to proceed the payment",
      "Your transaction will be processed",
    ],
  },
]);

export const htp_bri_bank_transfer = JSON.stringify([
  {
    name: "ATM BRI",
    stages: [
      "On the main menu, choose Other Transaction.",
      "Choose Payment.",
      "Choose Other.",
      "Choose BRIVA.",
      "Enter your BRIVA Number and press Correct.",
      "Amount to be paid, payment code, and merchant name will appear on the payment confirmation page. If the information is correct, press Yes.",
      "Payment is finished. Save your payment receipt.",
    ],
  },
  {
    name: "IB BRI",
    stages: [
      "Log in to your Internet Banking BRI.",
      "Choose Payment & Purchase.",
      "Choose sub menu BRIVA.",
      "Input BRIVA number.",
      "Amount to be paid, payment code, and merchant name will appear on the payment confirmation page. If the information is correct, choose Send.",
      "Input password and mToken, choose Send.",
      "Payment is finished, choose Print to have payment receipt.",
    ],
  },
  {
    name: "BRImo",
    stages: [
      "Log in to your BRI Mobile app, choose Mobile Banking BRI.",
      "Choose Payment, then choose BRIVA.",
      "Input BRIVA Number.",
      "Amount to be paid, payment code, and merchant name will appear on the payment confirmation page. If the information is correct, choose Continue.",
      "Input your Mobile Banking BRI PIN, choose Ok.",
      "Payment is finished. Save the notification as your payment receipt.",
    ],
  },
]);

export const htp_mandiri_bank_transfer = JSON.stringify([
  {
    name: "ATM Mandiri",
    stages: [
      "On the main menu, choose Pay/Buy.",
      "Choose Others.",
      "Choose Multi Payment.",
      "Enter 70012 (Midtrans company code) and press Correct.",
      "Enter your Payment Code and press Correct.",
      "Your payment details will appear on the payment confirmation page. If the information is correct press Yes.",
    ],
  },
  {
    name: "Internet Banking",
    stages: [
      "Login to Mandiri Internet Banking (https://ibank.bankmandiri.co.id/).",
      "	From the main menu choose Payment, then choose Multi Payment.",
      "Select your account in From Account, then in Billing Name select Midtrans.",
      "	Enter the Payment Code and you will receive your payment details.",
      "Confirm your payment using your Mandiri Token.",
    ],
  },
]);

export const htp_permata_bank_transfer = JSON.stringify([
  {
    name: "ATM Permata",
    stages: [
      "On the main menu, choose Other Transaction.",
      "Choose Payment.",
      "Choose Other Payment.",
      "Choose Virtual Account.",
      "Enter 16 digits Account No. and press Correct.",
      "Amount to be paid, account number, and merchant name will appear on the payment confirmation page. If the information is right, press Correct.",
      "Choose your payment account and press Correct.",
    ],
  },
]);

export const htp_indomaret_cstore = JSON.stringify([
  {
    name: "Indomaret",
    stages: [
      "After confirming your payment, we will issue you a unique Payment Code number.",
      "Note down your Payment Code and total amount.",
      "Go to an Indomaret store near you and provide the cashier with the Payment Code number.",
      "The cashier will then confirm the transaction by asking for the transaction amount and the merchant name.",
      "Confirm the payment with the cashier.",
      "Your transaction is successful! Please keep your Indomaret payment receipt just in case you need help via support.",
    ],
  },
]);

export const htp_alfamart_cstore = JSON.stringify([
  {
    name: "Alfamart",
    stages: [
      "Go to an Alfamart, Alfamidi, or Dan+Dan store near you and provide the cashier with the Payment Code number.",
      "The cashier will then confirm the transaction by asking for the transaction amount and the merchant name.",
      "Confirm the payment with the cashier to proceed payment.",
      "Confirm the payment with the cashier.",
      "Your transaction is successful! Please keep your payment receipt just in case you need help via support.",
    ],
  },
]);
