from fastapi import FastAPI
from backend.routes.login import register as register
from backend.routes.resources import resource as resource
from backend.routes.requests import request as request
from backend.routes.chat import chat as chat
app=FastAPI()

app.include_router(register)
app.include_router(resource)
app.include_router(request)
app.include_router(chat)