from pydantic import BaseModel, EmailStr, HttpUrl, field_validator
from typing import Optional, Literal, List

class AdminCreate(BaseModel):
    name: str
    email: EmailStr
    team: str
    role: str
    phone_number: str
    college_or_university: str
    course: str
    year: Literal[1, 2, 3, 4]
    gender: Literal["M", "F", "O"]
    github_profile: Optional[HttpUrl] = None
    linkedin_profile: Optional[HttpUrl] = None

    @field_validator("github_profile", "linkedin_profile", mode="before")
    @classmethod
    def convert_empty_to_none(cls, v):
        if v == "" or v is None:
            return None
        return v