from fastapi import FastAPI
from backend.routes.login import register as register
from backend.routes.resources import resource as resource
from backend.routes.requests import request as request
from backend.routes.chat import chat as chat

from fastapi.middleware.cors import CORSMiddleware


app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(register)
app.include_router(resource)
app.include_router(request)
app.include_router(chat)