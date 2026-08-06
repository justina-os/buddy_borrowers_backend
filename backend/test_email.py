import smtplib
from dotenv import load_dotenv
import os
from email.message import EmailMessage
load_dotenv()
message = EmailMessage()



sender_email = os.getenv("MAIL_USERNAME")
app_password = os.getenv("MAIL_APP_PASSWORD")




def send_email(to, otp):
    message = EmailMessage()   # <-- create a NEW object

    message["From"] = sender_email
    message["To"] = to
    message["Subject"] = "Buddy Borrowers verification"
    message.set_content(str(otp))

    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(sender_email, app_password)
    server.send_message(message)
    server.quit()