from fastapi import HTTPException, status
from database import current_event_collection
from bson import ObjectId
from typing import Tuple
from datetime import datetime, time, timezone, date



def verify_event(event_id: str) -> Tuple[dict, ObjectId]:
    if not ObjectId.is_valid(event_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid event_id"
        )
    
    event_oid = ObjectId(event_id)

    event_collection = current_event_collection()
    event = event_collection.find_one({"_id": event_oid})
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    return (event,event_oid)



def verify_eventRegistry(
    event_id: ObjectId,
    user_id: ObjectId,
    type: str,
    user: dict,
    event: dict
):
    user_registered = any(
        reg.get("event_id") == event_id
        for reg in user.get("registered_event", [])
    )

    event_has_user = user_id in event.get("registered_user", [])

    if type == "Y":
        if not (user_registered and event_has_user):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is not registered for this event"
            )

    elif type == "N":
        if user_registered and event_has_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is already registered for this event"
            )

    
def verify_can_register(
        event:dict
):
    # No capacity limit as requested
    
    last_date_raw = event.get("last_date_to_register")
    if last_date_raw:
        if isinstance(last_date_raw, str):
            last_date = datetime.fromisoformat(last_date_raw).date()
        elif isinstance(last_date_raw, (datetime, date)):
            last_date = last_date_raw if isinstance(last_date_raw, date) else last_date_raw.date()
        else:
            # Fallback or handle error
            last_date = None
        
        if last_date:
            last_date_dt = datetime.combine(
                last_date,
                time(18, 30, 0),
                tzinfo=timezone.utc
            )
            today = datetime.now(timezone.utc)

            if today > last_date_dt:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Registration deadline has passed"
                )
