from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.connections = {}
        #the reqquest id is given by front_end
    def connect(self, request_id: int, websocket: WebSocket,user_id:int):
        if request_id  not in self.connections:
            # self.connections.update({request_id:[websocket]})
            self.connections.update({request_id:{user_id:websocket}})
        else:
            # self.connections[request_id].append(websocket)
            self.connections[request_id][user_id]=websocket

    def disconnect(self,request_id:int,websocket:WebSocket,user_id:int):


        self.connections[request_id].pop(user_id)
        if not self.connections[request_id]:
            self.connections.pop(request_id)

manager = ConnectionManager()