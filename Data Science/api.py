import pandas as pd
import joblib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import uvicorn
from fastapi.middleware.cors import CORSMiddleware


# Define the request schema
class RecommendationRequest(BaseModel):
    user_id: int
    top_n: int = 5  # Default number of recommendations


# Define the response schema
class RecommendedCourse(BaseModel):
    course_id: int
    title: str
    predicted_score: float


class RecommendationResponse(BaseModel):
    user_id: int
    recommendations: List[RecommendedCourse]


# Initialize FastAPI app
app = FastAPI(
    title="Course Recommender API",
    description="API for recommending courses to users based on their profiles and past performance.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify allowed origins like ['http://localhost:3000']
    allow_credentials=True,
    allow_methods=["*"],  # Or specify allowed methods like ['GET', 'POST']
    allow_headers=["*"],  # Or specify allowed headers like ['Content-Type']
)


# Load necessary data and models at startup
@app.on_event("startup")
def load_resources():
    global model
    global le_difficulty
    global le_role
    global feature_cols
    global user_skills_pivot
    global courses_df

    try:
        # Load the trained model
        model = joblib.load("models/course_recommender_model.pkl")

        # Load label encoders
        le_difficulty = joblib.load("models/le_difficulty.pkl")
        le_role = joblib.load("models/le_role.pkl")

        # Load feature columns
        feature_cols = joblib.load("models/feature_cols.pkl")

        # Load user skills pivot
        user_skills_pivot = joblib.load("models/user_skills_pivot.pkl")

        # Load courses data
        courses_df = pd.read_csv("data/courses.csv")

        # Additional data if needed
        # For example, users.csv, assignments.csv can be loaded here if necessary

        print("Resources loaded successfully.")
    except Exception as e:
        print(f"Error loading resources: {e}")


# Recommendation function
def recommend_courses(user_id: int, top_n: int = 5) -> List[RecommendedCourse]:
    """
    Recommend top N courses for a given user based on predicted scores.

    Parameters:
    - user_id (int): ID of the user.
    - top_n (int): Number of top courses to recommend.

    Returns:
    - List of RecommendedCourse
    """
    # Load users data
    print("Hello")
    users = pd.read_csv("data/users.csv")
    assignments = pd.read_csv("data/assignments.csv")
    course_progress = pd.read_csv("data/course_progress.csv")
    user_skills = pd.read_csv("data/user_skills.csv")

    # Check if user exists
    user = users[users["id"] == user_id]
    if user.empty:
        raise HTTPException(status_code=404, detail="User not found.")

    # Get user role
    user_role = user.iloc[0]["role"]
    role_encoded = le_role.transform([user_role])[0]

    # Get user skills
    user_skills_data = user_skills[user_skills["userId"] == user_id]
    if user_skills_data.empty:
        user_skill_features = [0] * (len(user_skills_pivot.columns) - 1)
    else:
        user_skill_pivot = (
            user_skills_data.pivot_table(
                index="userId", columns="proficiencyLevel", aggfunc="size", fill_value=0
            )
            .reset_index()
            .rename_axis(None, axis=1)
        )
        user_skill_pivot = user_skill_pivot.reindex(
            columns=user_skills_pivot.columns, fill_value=0
        )
        user_skill_features = (
            user_skill_pivot.drop("userId", axis=1).values.flatten().tolist()
        )

    # Define base user features
    base_features = {
        "role_encoded": role_encoded,
        "days_since_assignment": 0,  # Assuming new assignments
        "duration": 0,  # Placeholder, will be updated per course
        "difficulty_encoded": 0,  # Placeholder, will be updated per course
        "timeInvested": 0,
        "participationCount": 0,
        "timeSpentOnQuizzes": 0,
    }

    # Prepare a list to store predictions
    predictions = []

    # Iterate over all courses to predict scores
    for _, course in courses_df.iterrows():
        course_id = course["id"]
        title = course["title"]
        duration = course["duration"]
        difficulty = course["difficultyLevel"]
        difficulty_encoded = le_difficulty.transform([difficulty])[0]

        # Update base features with course-specific information
        features = base_features.copy()
        features["duration"] = duration
        features["difficulty_encoded"] = difficulty_encoded

        # Combine with user skills
        feature_vector = [
            features["duration"],
            features["difficulty_encoded"],
            features["timeInvested"],
            features["participationCount"],
            features["timeSpentOnQuizzes"],
            features["role_encoded"],
            features["days_since_assignment"],
        ] + user_skill_features

        # Create DataFrame for prediction
        input_df = pd.DataFrame([feature_vector], columns=feature_cols)

        # Predict the score
        predicted_score = model.predict(input_df)[0]

        predictions.append(
            {"course_id": course_id, "title": title, "predicted_score": predicted_score}
        )

    # Create DataFrame from predictions
    predictions_df = pd.DataFrame(predictions)

    # Sort courses by predicted_score in descending order and select top N
    top_courses = predictions_df.sort_values(
        by="predicted_score", ascending=False
    ).head(top_n)

    # Convert to list of RecommendedCourse
    recommendations = top_courses.to_dict(orient="records")
    recommended_courses = [RecommendedCourse(**rec) for rec in recommendations]

    return recommended_courses


# Define the /recommend endpoint
@app.post("/recommend", response_model=RecommendationResponse)
def get_recommendations(request: RecommendationRequest):
    """
    Endpoint to get course recommendations for a user.

    Parameters:
    - user_id (int): ID of the user.
    - top_n (int, optional): Number of top courses to recommend. Default is 5.

    Returns:
    - RecommendationResponse: Contains user_id and a list of recommended courses.
    """
    try:
        print(request.user_id)
        recommendations = recommend_courses(request.user_id, request.top_n)
        return RecommendationResponse(
            user_id=request.user_id, recommendations=recommendations
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Course Recommender API. Use the /recommend endpoint to get course recommendations."
    }


# Optional: Endpoint to check server health
@app.get("/health")
def health_check():
    return {"status": "OK"}


# To run the app using: uvicorn app.main:app --reload
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
