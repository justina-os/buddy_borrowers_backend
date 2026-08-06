from fastapi import APIRouter,Depends,HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel,EmailStr
from backend.db import get_connection
from backend.auth import hash_password,verify_password
from datetime import datetime,timedelta
from jose import jwt,JWTError
import random 
from backend.test_email import send_email
# from fastapi import UploadFile
register=APIRouter()

# login and sigin schema 

class Login(BaseModel):
    email:EmailStr
    password:str

class Signup(BaseModel):
    user_name:str
    email:EmailStr
    password:str



secret_key="mo4cr4873g4hyiomdddddsmoccy"
access_token_expire=30

algorithm="HS256"

oauth=OAuth2PasswordBearer(tokenUrl="/login")

def create_token(data:dict):
    to_encode=data.copy()
    expire=datetime.now()+timedelta(minutes=access_token_expire)
    to_encode.update({"exp":expire})

    return jwt.encode(to_encode,secret_key,algorithm=algorithm)



@register.post("/login")
def login(details:Login,con=Depends(get_connection)):
    cur=con.cursor()

    


    if not details.email.endswith("@kalvium.community"):
        raise HTTPException(
            status_code=400,
            detail="Only Kalvium email addresses are allowed."
            )

    

    try:
        cur.execute("select user_id,password from users where  email=%s",(details.email,))
        row=cur.fetchone()
        if not row:
            raise HTTPException(status_code=404,detail="Email not found")

        if verify_password(details.password,row["password"]):
            access_token=create_token({"sub":str(row["user_id"])})
            return{ "access_token": access_token, "token_type": "bearer" }

        else:
            raise HTTPException(status_code=401,detail="Invalid credentials")

    finally:
        cur.close()




@register.post("/verify_signup")
def signup(mail_id:str,code:str,con=Depends(get_connection)):
    cur=con.cursor()
    
    try:
        cur.execute("select * from pending_signup where mail_id=%s",(mail_id,))
        temp=cur.fetchone()
        if not temp:
            raise HTTPException(status_code=404,detail="Pending signip not found")

        print(temp["expires_at"])
        
        if temp["expires_at"]<=datetime.utcnow():
            raise HTTPException(status_code=400,detail="otp expired")
        if temp["code"]==code:
            cur.execute("insert into users (user_name,email,password) values(%s,%s,%s)",(temp["user_name"],temp["mail_id"],temp["password"]))
            cur.execute("delete from pending_signup where mail_id=%s",(mail_id,))
            con.commit()
            return {
                "message": "User created successfully" }
        else:
            raise HTTPException(status_code=400,detail="Invalid OTP")
    finally:
        cur.close()

    

# def give_access(token:str =Depends(oauth)):
#     try :
#         payload=jwt.decode(token,secret_key,algorithms=[algorithm])
#         user_id=payload["sub"]

#         return int(user_id)
#     except JWTError:
#        raise HTTPException(status_code=401,detail="Invalid or expired token")

def verify_token(token: str):
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        return int(payload["sub"])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def give_access(token: str = Depends(oauth)):
    return verify_token(token)



@register.get("/me")
def get_current_user(
    user_id=Depends(give_access),
    con=Depends(get_connection)
):
    cur = con.cursor()

    try:
        cur.execute(
            "select user_name,user_id from users where user_id=%s",
            (user_id,)
        )
        user = cur.fetchone()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        return user

    finally:
        cur.close()





#
@register.post("/signup")
def verify_email(details:Signup,con=Depends(get_connection)):
    cur=con.cursor()

    if not details.email.endswith("@kalvium.community"):
            raise HTTPException(
                status_code=400,
                detail="Only Kalvium email addresses are allowed."
                )

    try:
        cur.execute("select 1 from users where  email=%s",(details.email,))
        row=cur.fetchone()
        if  row:
                raise HTTPException(status_code=409,detail="User already exists")

        password=hash_password(details.password)
        
        num=str(random.randint(100000,999999))

        cur.execute("delete from pending_signup where mail_id=%s",(details.email,))
        
        cur.execute("insert into pending_signup (mail_id,user_name,password,code) values(%s,%s,%s,%s)",(details.email,details.user_name,password,num))
        con.commit()

        send_email(details.email,num)


    finally:
        cur.close()


