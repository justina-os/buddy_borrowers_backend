from fastapi import APIRouter, WebSocket,Depends
from backend.db import get_connection
from backend.websocket_manger import manager
from backend.routes.login import verify_token

chat= APIRouter()

@chat.websocket("/chat/{request_id}")
async def chatting(request_id:int,websocket:WebSocket,token:str,conn=Depends(get_connection)):
    user_id=verify_token(token)
        
    await websocket.accept()
    manager.connect(request_id, websocket,user_id)
    

    try:
       
        cur=conn.cursor()
        while True:
            message = await websocket.receive_text()
            print("Received:", message)
            
            
            cur.execute("insert into messages (message,sender_id,request_id)  values(%s,%s,%s)",(message,user_id,request_id))
            conn.commit()
            print(manager.connections)
            

            # for ws in manager.connections[request_id]:
            #     if not manager.connections[request_id][user_id]:
            #         await ws.send_text(message)

            for id,ws in manager.connections[request_id].items():
                if id !=user_id:
                    await ws.send_text(message)
        
    finally:
        manager.disconnect(request_id,websocket,user_id)
        cur.close()


















# while True:
#     message = await websocket.receive_text()

#     # 1. Save the message to the database

#     # 2. Send the message to the other user(s)

#     # 3. Wait for the next message