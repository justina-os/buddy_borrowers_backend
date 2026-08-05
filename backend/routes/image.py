from fastapi import APIRouter,Depends,HTTPException,UploadFile
from pydantic import BaseModel
from backend.db import get_connection
from typing import Literal
from backend.routes.login import give_access
from backend.supabase_client import supabase


image=APIRouter()

@image.post("/upload")
async def upload(image: UploadFile):
    contents = await image.read()
    file_name = image.filename

    bucket = supabase.storage.from_("resource-image")

    response=bucket.upload(
        path=file_name,
        file=contents,
        file_options={"content-type": image.content_type}
    )

    return response

    

# response = supabase.storage.from_("resource-image").list()
# print(response)