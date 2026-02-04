from pydantic import BaseModel, EmailStr, HttpUrl
from typing import List, Optional, Literal

class MemberDetail(BaseModel):
    name: str
    email: EmailStr
    phone_number: str
    college_or_university: str
    course: str
    year: Literal[1, 2, 3, 4]

class TeamRegister(BaseModel):
    event_id: str
    team_name: str
    members: List[MemberDetail]
