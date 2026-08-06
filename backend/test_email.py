import smtplib
from dotenv import load_dotenv
import os
from email.message import EmailMessage
load_dotenv()
message = EmailMessage()



sender_email = os.getenv("MAIL_USERNAME")
app_password = os.getenv("MAIL_APP_PASSWORD")




def send_email(to, otp):
    
    message = EmailMessage()

    message["From"] = sender_email
    message["To"] = to
    message["Subject"] = "Buddy Borrowers verification"
    message.set_content(str(otp))

    try:
        print("MAIL_USERNAME:", sender_email)
        print("APP PASSWORD EXISTS:", app_password is not None)

        print("Connecting...")
        server = smtplib.SMTP("smtp.gmail.com", 587, timeout=20)

        print("Connected")

        server.starttls()
        print("TLS OK")

        server.login(sender_email, app_password)
        print("Login OK")

        server.send_message(message)
        print("Mail sent")

        server.quit()

    except Exception as e:
        print("EMAIL ERROR:", repr(e))
        raise
    # message = EmailMessage()

    # message["From"] = sender_email
    # message["To"] = to
    # message["Subject"] = "Buddy Borrowers verification"
    # message.set_content(str(otp))

    # print(sender_email)
    # print(app_password is not None)

    # server = smtplib.SMTP("smtp.gmail.com", 587)
    # server.starttls()
    # server.login(sender_email, app_password)

    # server.send_message(message)
    # server.quit()
    # send_email(details.email, num)
    # 
    return {
    "message": "OTP generated",
    "otp": otp
}