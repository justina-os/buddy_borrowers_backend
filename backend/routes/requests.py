from fastapi import APIRouter,Depends,HTTPException
from pydantic import BaseModel
from backend.db import get_connection
from typing import Literal
from backend.routes.login import give_access


request=APIRouter()

class RequestInfo(BaseModel):
    offers:str
    # status:Literal['requested','accepted','rejected','returned']


# this is for buyer 
@request.post("/request/{resource_id}") # resource_id is sent by the frontend when the user clicks the request button(the front_end saves by using the retur from show_resource).
def request_item(info:RequestInfo,resource_id:int,
                 user_id=Depends(give_access),
                 con=Depends(get_connection)):

    cur=con.cursor()

    try:
        cur.execute("select * from resources where resource_id=%s",(resource_id,))
        resource=cur.fetchone()

        if not resource:
            raise HTTPException(status_code=404,detail="Resouce not found")

        if resource["owner_id"]==user_id:
            raise HTTPException(status_code=400,detail="You can't request ur own request")

        if resource["status"]!="available":
            raise HTTPException(status_code=409 ,detail="Resource not available")
        

        cur.execute("select * from requests where resource_id=%s and requester_id=%s",(resource_id,user_id))
        row=cur.fetchone()
        if row:
            raise HTTPException(status_code=409,detail="Already requested ")

        
        cur.execute(''' insert into requests 
        (offers,requester_id,resource_id,status) values(%s,%s,%s,%s)''',(info.offers,user_id,resource_id,"requested"))
        con.commit()

        return {
        "message": "Request sent successfully."
    }
    finally:
        cur.close()

# show all requests to the user
@request.get("/requests")
def show_requests(user_id=Depends(give_access),
                 con=Depends(get_connection)):
    cur=con.cursor()

    try:
        # cur.execute("select resource_id from requests where status=%s and  lender_id=%s ",("requested",user_id))
        # id_s=cur.fetchall()

        # resources=[]


        # for key in id_s:
        #     cur.execute("select * from resources where resource_id=%s",(key["resource_id"],))
        #     temp=cur.fetchone()
        #     resources.append(temp)

        # return resources

       cur.execute('''
        select
        r.*,
        req.request_id,
        req.status as request_status
        from resources r
        join requests req
        on r.resource_id = req.resource_id
        where req.status=%s
        and r.owner_id=%s
        ''',
        ("requested", user_id)
            )
       resources = cur.fetchall()
       return resources
    finally:
        cur.close()

@request.delete("/requests/{request_id}")
def cancel_request(request_id:int,con=Depends(get_connection),user_id=Depends(give_access)):#getting request_id from front_end
    cur=con.cursor()

    try:
        
        

        cur.execute("delete  from requests where request_id=%s and requester_id=%s and status=%s",(request_id,user_id,"requested"))

        if cur.rowcount==0:
            raise HTTPException(status_code=404, detail="Request doesn't exist")
        con.commit()
        return {"message": "Request cancelled"}
    finally:
        cur.close()


@request.get("/requests/my_requests")
def get_my_request(user_id=Depends(give_access),
                 con=Depends(get_connection)):
    cur=con.cursor()
    try:
        cur.execute('''
                select r.resource_name,
                r.resource_description,
                req.offers,
                req.status,
                req.request_id
                from resources 
                r join requests req 
                on r.resource_id=req.resource_id
                where requester_id=%s



            ''',(user_id,))
        requests=cur.fetchall()

        return requests
        
    finally:
        cur.close()