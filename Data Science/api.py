from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
from typing import List

# Initialize FastAPI app
app = FastAPI()

# Load the trained model
model = joblib.load("course_recommender_model.pkl")

# Load other necessary data
courses_df = pd.read_csv("./data/courses.csv")
user_skills_pivot = pd.read_csv("./data/user_skills.csv")  # Ensure this file exists


# Define the request body model
class UserRequest(BaseModel):
    user_id: int


# Placeholder for merged_df and feature_cols, ensure they are defined
merged_df = pd.DataFrame()  # Replace this with your actual merged data
feature_cols = []  # Replace this with your actual feature columns


# Define the recommendation route
@app.post("/recommend")
async def recommend(user_request: UserRequest):
    user_id = user_request.user_id

    # Ensure 'merged_df' is loaded correctly or passed appropriately
    if merged_df.empty:
        raise HTTPException(status_code=500, detail="Merged data not available")

    # Call the recommendation function (assumes it's defined somewhere)
    recommendations = recommend_courses(
        user_id=user_id,
        courses_df=courses_df,
        merged_df=merged_df,
        model=model,
        feature_cols=feature_cols,
        user_skills_pivot=user_skills_pivot,
        top_n=5,
    )

    return recommendations.to_dict(orient="records")


# To run the app, use: uvicorn app_name:app --reload
