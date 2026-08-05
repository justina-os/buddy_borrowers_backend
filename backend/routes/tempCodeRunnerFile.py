cur.execute("select * from resources where resource_id=%s",(resource_id,))
        # temp=cur.fetchone()
        
        # if not temp:
        #     raise HTTPException(status_code=404,detail="Resource id doesn't exist")

        # if temp["owner_id"]!=user_id:
        #     raise HTTPException(status_code=403,detail="Can't edit other's resources")
        
        # cur.execute(command,(update_value))
        # con.commit()