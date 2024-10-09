import os
import pandas as pd

# Directory paths
RAW_DATA_DIR = "./data/raw/"
TRANSFORMED_DIR = "./data/prep/"

# Ensure the transformed data directory exists
os.makedirs(TRANSFORMED_DIR, exist_ok=True)


def load_csv(file_name):
    """Helper function to load a CSV file into a DataFrame."""
    file_path = os.path.join(RAW_DATA_DIR, file_name)
    return pd.read_csv(file_path)


def transform_data():
    # Load all the CSVs
    users_df = load_csv("users.csv")
    courses_df = load_csv("courses.csv")
    assignments_df = load_csv("assignments.csv")
    course_progress_df = load_csv("course_progress.csv")
    learning_paths_df = load_csv("learning_paths.csv")
    skills_df = load_csv("skills.csv")
    user_skills_df = load_csv("user_skills.csv")

    # 1. Handle Missing Values
    # For `assignments`, fill missing 'courseId' and 'learningPathId' with NaN or appropriate default
    assignments_df["courseId"] = assignments_df["courseId"].fillna(-1).astype(int)
    assignments_df["learningPathId"] = (
        assignments_df["learningPathId"].fillna(-1).astype(int)
    )

    # For `course_progress`, handle missing 'certificateUrl' by filling with 'None' or a placeholder
    course_progress_df["certificateUrl"] = course_progress_df["certificateUrl"].fillna(
        "None"
    )

    # 2. Convert Data Types
    # Convert date columns to datetime
    date_columns = {
        "users.csv": ["createdAt", "updatedAt"],
        "courses.csv": ["createdAt", "updatedAt"],
        "assignments.csv": ["assignedAt"],
        "course_progress.csv": ["updatedAt"],
        "learning_paths.csv": ["createdAt", "updatedAt"],
        "user_skills.csv": ["updatedAt"],
    }

    for file, cols in date_columns.items():
        df = locals()[file.split(".")[0] + "_df"]
        for col in cols:
            df[col] = pd.to_datetime(
                df[col], errors="coerce"
            )  # Use 'coerce' to handle invalid formats

    # 3. Data Cleaning
    # Remove invalid entries where both 'courseId' and 'learningPathId' are -1
    assignments_df = assignments_df[
        ~((assignments_df["courseId"] == -1) & (assignments_df["learningPathId"] == -1))
    ]

    # 4. Data Enrichment
    # Merge assignments with users
    user_assignments_df = assignments_df.merge(
        users_df,
        left_on="userId",
        right_on="id",
        how="left",
        suffixes=("_assignment", "_user"),
    )

    # Merge course_progress with assignments
    course_progress_assignments_df = course_progress_df.merge(
        assignments_df,
        left_on="assignmentId",
        right_on="id",
        how="left",
        suffixes=("_progress", "_assignment"),
    )

    # Merge course_progress_assignments with courses
    course_progress_enriched_df = course_progress_assignments_df.merge(
        courses_df,
        left_on="courseId_progress",
        right_on="id",
        how="left",
        suffixes=("", "_course"),
    )

    # 5. Derived Metrics
    # Calculate progress percentage
    course_progress_enriched_df["progress_percent"] = (
        course_progress_enriched_df["progress"] * 100
    )

    # Calculate total score
    course_progress_enriched_df["total_score"] = (
        course_progress_enriched_df["quizScore"]
        + course_progress_enriched_df["assignmentScore"]
    )

    # 6. Grouping and Aggregating
    # Average total score per course
    avg_score_per_course = (
        course_progress_enriched_df.groupby("courseId_progress")["total_score"]
        .mean()
        .reset_index()
    )
    avg_score_per_course = avg_score_per_course.rename(
        columns={"courseId_progress": "courseId", "total_score": "avg_total_score"}
    )

    # Number of users per proficiency level
    users_per_skill_level = (
        user_skills_df.groupby("proficiencyLevel")["userId"].nunique().reset_index()
    )
    users_per_skill_level = users_per_skill_level.rename(
        columns={"userId": "user_count"}
    )

    # 7. Handling Empty DataFrames
    # Since 'learning_path_courses.csv' is empty, we'll skip processing it
    # Alternatively, you can create an empty DataFrame in the transformed data or log a message

    # 8. Optimizing DataFrames
    # Convert object columns to categorical where appropriate to save memory
    categorical_columns = {
        "users_df": ["role"],
        "courses_df": ["difficultyLevel"],
        "course_progress_enriched_df": ["completionStatus"],
        "user_skills_df": ["proficiencyLevel"],
    }

    for df_name, cols in categorical_columns.items():
        df = locals()[df_name]
        for col in cols:
            df[col] = df[col].astype("category")

    # 9. Saving Transformed Data
    # Save cleaned and enriched DataFrames
    user_assignments_df.to_csv(
        os.path.join(TRANSFORMED_DIR, "user_assignments.csv"), index=False
    )
    course_progress_enriched_df.to_csv(
        os.path.join(TRANSFORMED_DIR, "course_progress_enriched.csv"), index=False
    )
    avg_score_per_course.to_csv(
        os.path.join(TRANSFORMED_DIR, "avg_score_per_course.csv"), index=False
    )
    users_per_skill_level.to_csv(
        os.path.join(TRANSFORMED_DIR, "users_per_skill_level.csv"), index=False
    )

    # Additionally, save other cleaned DataFrames if needed
    assignments_df.to_csv(
        os.path.join(TRANSFORMED_DIR, "assignments_cleaned.csv"), index=False
    )
    users_df.to_csv(os.path.join(TRANSFORMED_DIR, "users_cleaned.csv"), index=False)
    courses_df.to_csv(os.path.join(TRANSFORMED_DIR, "courses_cleaned.csv"), index=False)
    course_progress_df.to_csv(
        os.path.join(TRANSFORMED_DIR, "course_progress_cleaned.csv"), index=False
    )
    learning_paths_df.to_csv(
        os.path.join(TRANSFORMED_DIR, "learning_paths_cleaned.csv"), index=False
    )
    user_skills_df.to_csv(
        os.path.join(TRANSFORMED_DIR, "user_skills_cleaned.csv"), index=False
    )

    print("Data transformation complete!")


if __name__ == "__main__":
    transform_data()
