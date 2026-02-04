from fastapi import APIRouter, Depends
from datetime import datetime
from database import current_team_collection, current_user_collection, current_event_collection
from utils.time import IST
from verify.token import verify_access_token
from verify.user import verify_user_payload
from verify.event import verify_event, verify_eventRegistry
from verify.team import  verify_teamName , verify_teamMember, verify_teamLeader, verify_user_not_in_team, verify_is_team_allowed, verify_team_size
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from bson import ObjectId

security = HTTPBearer()

router = APIRouter(prefix="/team", tags=["Teams"])




def set_user_team(
    user_id: ObjectId,
    event_id: ObjectId,
    team_id: ObjectId | None
):
    if team_id is None:
        update = {"$unset": {"registered_event.$.team_id": ""}}
    else:
        update = {"$set": {"registered_event.$.team_id": team_id}}

    user_collection = current_user_collection()
    user_collection.update_one(
        {"_id": user_id, "registered_event.event_id": event_id},
        update
    )





from schemas.team import TeamRegister
from verify.team import verify_team_members_limit

@router.post("/register")
def signup_team(
    team_data: TeamRegister,
    credentials: HTTPAuthorizationCredentials = Depends(security)
    ):

    token = credentials.credentials
    payload = verify_access_token(token)
    user, user_id ,user_email = verify_user_payload(payload)
    
    event_id = team_data.event_id
    team_name = team_data.team_name
    members = team_data.members

    event, event_id = verify_event(event_id)
    verify_is_team_allowed(event)
    verify_eventRegistry(event_id, user_id, "Y", user, event)

    verify_user_not_in_team(user, event_id)
    team_, team_name = verify_teamName(team_name, event_id, "N")

    # Generate Unique Team Code
    import string
    import random
    
    team_collection = current_team_collection()
    while True:
        team_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
        if not team_collection.find_one({"event_id": event_id, "team_code": team_code}):
            break

    # Verify team size limit
    verify_team_members_limit(event, members)

    team_insert_data={
        "leader_id": user_id,
        "event_id": event_id,
        "team_name": team_name,
        "team_code": team_code,
        "members": [m.model_dump() for m in members], # Store full member details if needed, or just validate. 
        # Requirement was to "fill member details". Usually members store IDs, but request implies adding details directly?
        # Re-reading: "ask for team mebes name email mobile number college name course and year".
        # If these are external users not in DB, we store these details. 
        # Note: The original system stored user_ids in members list for joiners.
        # If we are adding members at creation time who might not be registered users, we should store their details.
        # However, the 'join' endpoint appends user_ids. This suggests a hybrid or changed approach.
        # Let's assume we store these detailing objects in a separate field or modify structure.
        # Given "members" field was a list of IDs in 'join', let's check 'join' logic.
        # 'join' adds a user_id. This implies 'members' is list of IDs.
        # If we collect details of UNREGISTERED members, we can't push IDs.
        # We might need a "pending_members" or "external_members" field, OR we assume these are just static details for record.
        # BUT, standard practice for hackathons: 
        # 1. Leader registers team.
        # 2. Leader fills details of members.
        # 3. These members might not need to login themselves, or this IS the registration.
        # Let's store these details in `members_details` to avoid conflict with `members` (list of IDs).
        # OR if the requirement implies these users are ALREADY reg'd, we'd ask for emails and find IDs. 
        # "name email mobile number..." suggests we are capturing raw data.
        # Let's store in a new field `member_details`.
        "member_details": [m.model_dump() for m in members], 
        "registered_on":datetime.now(IST).isoformat()
    }

    team_collection = current_team_collection()
    team=team_collection.insert_one(team_insert_data)
    team_id = team.inserted_id


    event_collection = current_event_collection()
    set_user_team(user_id, event_id, team_id)
    event_collection.update_one(
        {"_id": event_id},
        {"$push": {"registered_team":team_id}}
    )


    return {"message": "Team registered successfully", "team_code": team_code}




from verify.team import verify_teamCode

@router.patch("/join")
def register_event(
    event_id: str,
    team_code: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
    ):
    token = credentials.credentials
    payload = verify_access_token(token)
    user, user_id , email = verify_user_payload(payload)
    event, event_id = verify_event(event_id)
    verify_is_team_allowed(event)
    verify_eventRegistry(event_id, user_id, "Y", user, event)
    verify_user_not_in_team(user, event_id)

    team, team_code_verified = verify_teamCode(team_code, event_id)
    verify_team_size(event,team)
    verify_teamMember(team, user_id, "N")
    team_id = team["_id"]

    team_collection = current_team_collection()
    team_collection.update_one(
        {"_id":team_id},
        {"$push":{
            "members": user_id
        }}
    )
    
    set_user_team(user_id, event_id, team_id)


    return {"message": "Team Member registered successfully"}


@router.delete("/delete")
def delete_team(
    event_id: str,
    team_name: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    payload = verify_access_token(token)
    leader, leader_id, email = verify_user_payload(payload)
    event, event_id = verify_event(event_id)
    verify_is_team_allowed(event)
    verify_eventRegistry(event_id, leader_id, "Y", leader, event)

    team,team_name = verify_teamName(team_name, event_id, "Y")
    verify_teamLeader(team, leader_id, "Y")
    team_id = team["_id"]


    set_user_team(leader_id, event_id, None)
    for member_id in team["members"]:
        set_user_team(member_id, event_id, None)

    team_collection = current_team_collection()
    team_collection.delete_one({"_id": team_id})

    event_collection = current_event_collection()
    event_collection.update_one(
        {"_id": event_id},
        {"$pull": {"registered_team":team_id}}
    )

    return {"message": "Team deleted successfully"}


@router.patch("/leave")
def leave_team(
    event_id: str,
    team_name: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    payload = verify_access_token(token)
    user, user_id, _ = verify_user_payload(payload)
    event, event_id = verify_event(event_id)
    verify_is_team_allowed(event)
    verify_eventRegistry(event_id, user_id, "Y", user, event)


    team, team_name = verify_teamName(team_name, event_id, "Y")
    verify_teamMember(team, user_id, "Y")
    team_id = team["_id"]

    team_collection = current_team_collection()
    team_collection.update_one(
        {"_id": team_id},
        {"$pull": {"members": user_id}}
    )
    set_user_team(user_id, event_id, None)

    return {"message": "Left team successfully"}



















