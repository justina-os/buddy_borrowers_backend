from fastapi import APIRouter, WebSocket,Depends
from backend.db import get_connection
from backend.websocket_manger import manager
from backend.routes.login import verify_token
from backend.routes.login import verify_token, give_access

chat= APIRouter()

@chat.websocket("/chat/{request_id}")
async def chatting(request_id:int,websocket:WebSocket,token:str,conn=Depends(get_connection)):
    user_id=verify_token(token)
    cur=conn.cursor()

    
        
    await websocket.accept()
    manager.connect(request_id, websocket,user_id)
    

    try:

        cur.execute(
        '''
        SELECT req.requester_id, r.owner_id
        FROM requests req
        JOIN resources r
            ON req.resource_id = r.resource_id
        WHERE req.request_id = %s
        ''',
        (request_id,)
    )

        request_data=cur.fetchone()

        if not request_data:
            await websocket.close(code=1008)
            cur.close()
            return

        if (
        user_id != request_data["requester_id"]
        and user_id != request_data["owner_id"]
        ):

            await websocket.close(code=1008)
            cur.close()
            return

        cur.execute(
                          """
                            SELECT message, sender_id
                            FROM messages
                            WHERE request_id = %s
                            ORDER BY sent_at
                         """,(request_id,))
        old_messages = cur.fetchall()
        
        for msg in old_messages:
            await websocket.send_json({
                            "message":msg["message"],
                            "sender_id":msg["sender_id"]}
                        )
       
        
        while True:
            message = await websocket.receive_text()
            print("Received:", message)
            
            
            cur.execute("insert into messages (message,sender_id,request_id)  values(%s,%s,%s)",(message,user_id,request_id))
            conn.commit()
            

            

            # for ws in manager.connections[request_id]:
            #     if not manager.connections[request_id][user_id]:
            #         await ws.send_text(message)

            for id,ws in manager.connections[request_id].items():
                # if id !=user_id:
                await ws.send_json({
                    "message": message,
                    "sender_id": user_id
                })
        
    finally:
        manager.disconnect(request_id,websocket,user_id)
        cur.close()




@chat.get("/chats")
def get_chats(
    user_id=Depends(give_access),
    conn=Depends(get_connection)
):
    cur = conn.cursor()

    try:
        cur.execute(
            '''
            SELECT
                r.resource_id,
                r.resource_name,
                r.resource_description,
                r.price,
                r.category,
                req.request_id,
                req.status AS request_status
            FROM resources r
            JOIN requests req
                ON r.resource_id = req.resource_id
            WHERE req.status = %s
            AND (
                r.owner_id = %s
                
            )
            ''',
            ("accepted", user_id)
        )

        return cur.fetchall()

    finally:
        cur.close()