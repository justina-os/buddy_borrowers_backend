from fastapi import APIRouter,Depends,HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from backend.db import get_connection
from backend.auth import hash_password,verify_password
from datetime import datetime,timedelta
from jose import jwt,JWTError
register=APIRouter()

# login and sigin schema 

class Login(BaseModel):
    email:str
    password:str

class Signup(BaseModel):
    user_name:str
    email:str
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




@register.post("/signup")
def signup(details:Signup,con=Depends(get_connection)):
    cur=con.cursor()

    
    
    
    try:
        cur.execute("select 1 from users where  email=%s",(details.email,))
        row=cur.fetchone()
        password=hash_password(details.password)

        if  row:
                raise HTTPException(status_code=409,detail="User already exists")


        cur.execute("insert into users (user_name,email,password) values(%s,%s,%s)",(details.user_name,details.email,password))
        con.commit()
        return {
                "message": "User created successfully"
            }
    finally:
        cur.close()

    
    
    

def give_access(token:str =Depends(oauth)):
    
    
    try :
        payload=jwt.decode(token,secret_key,algorithms=[algorithm])
        user_id=payload["sub"]

        return int(user_id)
    except JWTError:
       raise HTTPException(status_code=401,detail="Invalid or expired token")