from fastapi import APIRouter,Depends,HTTPException
from pydantic import BaseModel
from backend.db import get_connection
from typing import Literal
from backend.routes.login import give_access

resource=APIRouter()

class Resource_info(BaseModel):
    resource_name:str
    resource_description:str
    price:int
    status:Literal["available","rented"]
    category:Literal["Object","Skill"]


class UpdateResource(BaseModel):
    resource_name:str| None=None
    resource_description:str|None=None
    price:int|None=None
    status:Literal["available","rented"]|None=None
    category:Literal["Object","Skill"]|None=None

# this is for lender
@resource.post("/resources")
def add_resouce(info:Resource_info,user_id=Depends(give_access),con=Depends(get_connection)):
    cur=con.cursor()

    try:
        cur.execute("insert into resources (resource_name, resource_description,price,status,category,owner_id) values(%s,%s,%s,%s,%s,%s)",
                   (info.resource_name,info.resource_description,info.price,info.status,info.category,user_id))
        con.commit()

        return {"Msg":"Added item successfully"}
    finally:
        cur.close()

# both the lender and buyer can use this 
@resource.get("/resources")
def show_item(item:str,con=Depends(get_connection)):
    cur=con.cursor()

    try:
        cur.execute("select * from resources where resource_name ILIKE %s",(f"%{item}%",))
        row=cur.fetchall()

        return row
        
    finally:
        cur.close()


# show the resources of the lender 
@resource.get("/resources/my_resources")
def get_my_resources(user_id=Depends(give_access),con=Depends(get_connection)):

    cur=con.cursor()
    try:
        
        cur.execute("select * from resources where owner_id=%s",(user_id,))
        temp=cur.fetchall()
        

        return temp

    finally:
        cur.close()

# delete the resouces of the lender
@resource.delete("/resources/{resource_id}")
def remove_resource(resource_id:int,user_id=Depends(give_access),con=Depends(get_connection)):
    cur=con.cursor()
    try:
      
        cur.execute("delete from resources where resource_id =%s and owner_id=%s",(resource_id,user_id))
        if cur.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Resource not found."
                )
        con.commit()

    finally:
        cur.close()


#need to update the the status or accepting the request 
# resouce_id from front_end not from user 

@resource.patch("/resource/{resource_id}/{request_id}")
def accept_request(resource_id:int,request_id:int,user_id=Depends(give_access),con=Depends(get_connection)):
    cur=con.cursor()

    try:

        cur.execute(
            """
            select owner_id, status
            from resources
            where resource_id=%s
            """,
            (resource_id,)
            )

        resource = cur.fetchone()

        if not resource:
            raise HTTPException(404, "Resource not found")

        if resource["owner_id"] != user_id:
            raise HTTPException(403, "You cannot accept requests for this resource")

        # if resource["status"] != "available":
        #     raise HTTPException(409, "Resource is not available")
        
        cur.execute('''update requests
                    set status=%s
                     where request_id=%s and resource_id=%s
                    ''',("accepted",request_id,resource_id))
        
        if cur.rowcount == 0:
            raise HTTPException(
                    status_code=404,
                    detail="Resource not found."
                                )
        cur.execute('''update resources
                    set status=%s
                    where owner_id=%s and resource_id=%s
          ''',("rented",user_id,resource_id))

        cur.execute('''
        update requests
        set status =%s
        where resource_id=%s and request_id!=%s and status=%s
        ''',("rejected",resource_id,request_id,"requested"))


        # if cur.rowcount == 0:
        #     raise HTTPException(
        #             status_code=404,
        #             detail="Resource not found."
        #         )

        
        

        con.commit()
    finally:
        cur.close()

@resource.patch("/resource/{resource_id}")
def edit_resource(resource_id:int,detail:UpdateResource,user_id=Depends(give_access),con=Depends(get_connection)):
    cur=con.cursor()
    update=detail.model_dump(exclude_unset=True)

    if not update:
        raise HTTPException(
              status_code=400,
              detail="No fields to update."
        )

    update_key=[]
    update_value=[]

    for key,values in update.items():
        update_key.append(f"{key}=%s")
        update_value.append(values)
    update_value.append(resource_id)
    update_value.append(user_id)
    update_value=tuple(update_value)


    command=f"update resources set {",".join(update_key)} where resource_id=%s and owner_id=%s"
    try:
        print(update_value)
        cur.execute("select * from resources where resource_id=%s",(resource_id,))
        temp=cur.fetchone()
        
        if not temp:
            raise HTTPException(status_code=404,detail="Resource id doesn't exist")

        if temp["owner_id"]!=user_id:
            raise HTTPException(status_code=403,detail="Can't edit other's resources")
        
        cur.execute(command,(update_value))
        con.commit()

    finally:
        cur.close()


@resource.patch("/resource/{resource_id}/{request_id}/return")
def returned_resource(resource_id:int,request_id:int,user_id=Depends(give_access),con=Depends(get_connection)):
        cur=con.cursor()
   
    
        try:

            cur.execute('''update resources
                                    set status=%s
                                    where owner_id=%s and resource_id=%s
                          ''',("available",user_id,resource_id))
                
                
            if cur.rowcount == 0:
                raise HTTPException(
                         status_code=404,
                        detail="Resource not found."
                                )
                
            cur.execute('''update requests
                        set status=%s
                         where request_id=%s and resource_id=%s and status=%s
                        ''',("returned",request_id,resource_id,"accepted"))
            
            if cur.rowcount == 0:
                raise HTTPException(
                        status_code=404,
                        detail="request not found."
                                    )
            
    
            con.commit()
        finally:
            cur.close()


@resource.patch("/requests/{request_id}/reject")
def reject_request(
    request_id: int,
    user_id=Depends(give_access),
    con=Depends(get_connection)
):
    cur = con.cursor()

    try:
        cur.execute(
            """
            select req.request_id
        
            from requests req
            join resources r
                on req.resource_id = r.resource_id
            where req.request_id=%s
            and r.owner_id=%s
            and req.status=%s
            """,
            (request_id, user_id, "requested")
        )

        req = cur.fetchone()

        if not req:
            raise HTTPException(
                status_code=404,
                detail="Pending request not found"
            )

        cur.execute(
            """
            update requests
            set status=%s
            where request_id=%s
            """,
            ("rejected", request_id)
        )


       
        con.commit()

        return {"message": "Request rejected"}

    finally:
        cur.close()