import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Directory paths
PREP_DATA_DIR = "./data/prep/"
REPORT_DATA_DIR = "./data/report/"

# Ensure the reporting data directory exists
os.makedirs(REPORT_DATA_DIR, exist_ok=True)


def load_transformed_data():
    """Load all transformed CSV files into Pandas DataFrames."""
    data_frames = {}
    files = [
        "user_assignments.csv",
        "course_progress_enriched.csv",
        "avg_score_per_course.csv",
        "users_per_skill_level.csv",
        "assignments_cleaned.csv",
        "users_cleaned.csv",
        "courses_cleaned.csv",
        "course_progress_cleaned.csv",
        "learning_paths_cleaned.csv",
        "user_skills_cleaned.csv",
    ]

    for file in files:
        file_path = os.path.join(PREP_DATA_DIR, file)
        if os.path.exists(file_path):
            df_name = file.split(".")[0]
            data_frames[df_name] = pd.read_csv(file_path)
            print(f"Loaded {file}")
        else:
            print(f"Warning: {file} not found in {PREP_DATA_DIR}")

    return data_frames


def generate_overview_report(data_frames):
    """Generate an overview report with key metrics."""
    users = data_frames.get("users_cleaned")
    courses = data_frames.get("courses_cleaned")
    assignments = data_frames.get("assignments_cleaned")
    course_progress = data_frames.get("course_progress_cleaned")
    learning_paths = data_frames.get("learning_paths_cleaned")
    user_skills = data_frames.get("user_skills_cleaned")

    overview = {
        "Total Users": len(users),
        "Total Courses": len(courses),
        "Total Assignments": len(assignments),
        "Total Learning Paths": len(learning_paths),
        "Total User Skills": len(user_skills),
        "Total Course Progress Records": len(course_progress),
    }

    overview_df = pd.DataFrame(list(overview.items()), columns=["Metric", "Value"])
    overview_csv_path = os.path.join(REPORT_DATA_DIR, "overview_report.csv")
    overview_df.to_csv(overview_csv_path, index=False)
    print(f"Saved Overview Report to {overview_csv_path}")

    # Print the overview
    print("\nOverview Report:")
    print(overview_df)


def generate_course_performance_report(data_frames):
    """Generate a report on average scores per course."""
    avg_score_per_course = data_frames.get("avg_score_per_course")
    courses = data_frames.get("courses_cleaned")

    # Merge to get course titles
    report_df = pd.merge(
        avg_score_per_course, courses, left_on="courseId", right_on="id", how="left"
    )
    report_df = report_df[["courseId", "title", "avg_total_score"]]
    report_df = report_df.rename(
        columns={"title": "Course Title", "avg_total_score": "Average Total Score"}
    )

    # Save to CSV
    report_csv_path = os.path.join(REPORT_DATA_DIR, "course_performance_report.csv")
    report_df.to_csv(report_csv_path, index=False)
    print(f"Saved Course Performance Report to {report_csv_path}")

    # Print the report
    print("\nCourse Performance Report:")
    print(report_df)


def generate_user_skill_distribution(data_frames):
    """Generate a report on user skill proficiency levels."""
    users_per_skill_level = data_frames.get("users_per_skill_level")

    # Save to CSV
    report_csv_path = os.path.join(REPORT_DATA_DIR, "user_skill_distribution.csv")
    users_per_skill_level.to_csv(report_csv_path, index=False)
    print(f"Saved User Skill Distribution Report to {report_csv_path}")

    # Print the report
    print("\nUser Skill Distribution Report:")
    print(users_per_skill_level)

    # Visualization
    plt.figure(figsize=(8, 6))
    sns.barplot(
        data=users_per_skill_level,
        x="proficiencyLevel",
        y="user_count",
        hue="proficiencyLevel",
        palette="viridis",
        dodge=False,
    )
    plt.title("Number of Users per Proficiency Level")
    plt.xlabel("Proficiency Level")
    plt.ylabel("Number of Users")
    plt.legend(title="Proficiency Level", bbox_to_anchor=(1.05, 1), loc="upper left")
    plt.tight_layout()
    plot_path = os.path.join(REPORT_DATA_DIR, "user_skill_distribution.png")
    plt.savefig(plot_path)
    plt.close()
    print(f"Saved User Skill Distribution Plot to {plot_path}")


def generate_user_activity_report(data_frames):
    """Generate a report on user assignments and course progress."""
    user_assignments = data_frames.get("user_assignments")
    course_progress = data_frames.get("course_progress_enriched")

    # Debug: Print columns to verify 'userId' presence
    print("\nColumns in 'course_progress_enriched':")
    print(course_progress.columns.tolist())

    # Attempting to group by 'userId'
    try:
        # Adjust the column name based on actual DataFrame columns
        if "userId" in course_progress.columns:
            user_id_col = "userId"
        elif "userId_assignment" in course_progress.columns:
            user_id_col = "userId_assignment"
        elif "userId_progress" in course_progress.columns:
            user_id_col = "userId_progress"
        else:
            raise KeyError(
                "No 'userId' column found in 'course_progress_enriched' DataFrame."
            )

        # Total assignments per user
        assignments_per_user = (
            user_assignments.groupby("userId")
            .size()
            .reset_index(name="total_assignments")
        )

        # Average progress per user
        avg_progress_per_user = (
            course_progress.groupby(user_id_col)["progress_percent"]
            .mean()
            .reset_index(name="avg_progress_percent")
        )

        # Merge the two
        user_activity = pd.merge(
            assignments_per_user,
            avg_progress_per_user,
            left_on="userId",
            right_on=user_id_col,
            how="left",
        )

        # Merge with user details
        users = data_frames.get("users_cleaned")
        user_activity = pd.merge(
            user_activity, users, left_on="userId", right_on="id", how="left"
        )

        user_activity = user_activity[
            ["userId", "name", "email", "total_assignments", "avg_progress_percent"]
        ]

        # Save to CSV
        report_csv_path = os.path.join(REPORT_DATA_DIR, "user_activity_report.csv")
        user_activity.to_csv(report_csv_path, index=False)
        print(f"Saved User Activity Report to {report_csv_path}")

        # Print the report
        print("\nUser Activity Report:")
        print(user_activity.head())

    except KeyError as e:
        print(f"KeyError encountered: {e}")


def generate_course_completion_status(data_frames):
    """Generate a report on course completion status."""
    course_progress = data_frames.get("course_progress_enriched")

    # Count completion statuses
    completion_status_counts = (
        course_progress["completionStatus"].value_counts().reset_index()
    )
    completion_status_counts.columns = ["Completion Status", "Count"]

    # Save to CSV
    report_csv_path = os.path.join(REPORT_DATA_DIR, "course_completion_status.csv")
    completion_status_counts.to_csv(report_csv_path, index=False)
    print(f"Saved Course Completion Status Report to {report_csv_path}")

    # Print the report
    print("\nCourse Completion Status Report:")
    print(completion_status_counts)

    # Visualization
    plt.figure(figsize=(8, 6))
    sns.barplot(
        data=completion_status_counts,
        x="Completion Status",
        y="Count",
        hue="Completion Status",
        palette="coolwarm",
        dodge=False,
    )
    plt.title("Course Completion Status Distribution")
    plt.xlabel("Completion Status")
    plt.ylabel("Number of Records")
    plt.legend(title="Completion Status", bbox_to_anchor=(1.05, 1), loc="upper left")
    plt.tight_layout()
    plot_path = os.path.join(REPORT_DATA_DIR, "course_completion_status.png")
    plt.savefig(plot_path)
    plt.close()
    print(f"Saved Course Completion Status Plot to {plot_path}")


def generate_skill_distribution(data_frames):
    """Generate a report on skill distribution among users."""
    user_skills = data_frames.get("user_skills_cleaned")
    skills = data_frames.get("skills_cleaned")

    # Merge to get skill names
    skill_distribution = pd.merge(
        user_skills, skills, left_on="skillId", right_on="id", how="left"
    )

    # Count users per skill
    users_per_skill = (
        skill_distribution.groupby("name").size().reset_index(name="user_count")
    )

    # Save to CSV
    report_csv_path = os.path.join(REPORT_DATA_DIR, "skill_distribution.csv")
    users_per_skill.to_csv(report_csv_path, index=False)
    print(f"Saved Skill Distribution Report to {report_csv_path}")

    # Print the report
    print("\nSkill Distribution Report:")
    print(users_per_skill)

    # Visualization
    plt.figure(figsize=(10, 8))
    sns.barplot(
        data=users_per_skill.sort_values("user_count", ascending=False),
        x="user_count",
        y="name",
        hue="name",
        palette="magma",
        dodge=False,
    )
    plt.title("Skill Distribution Among Users")
    plt.xlabel("Number of Users")
    plt.ylabel("Skill")
    plt.legend(title="Skill", bbox_to_anchor=(1.05, 1), loc="upper left")
    plt.tight_layout()
    plot_path = os.path.join(REPORT_DATA_DIR, "skill_distribution.png")
    plt.savefig(plot_path)
    plt.close()
    print(f"Saved Skill Distribution Plot to {plot_path}")


def generate_all_reports(data_frames):
    """Generate all reports."""
    generate_overview_report(data_frames)
    generate_course_performance_report(data_frames)
    generate_user_skill_distribution(data_frames)
    generate_user_activity_report(data_frames)
    generate_course_completion_status(data_frames)
    # generate_skill_distribution(data_frames)
    print("\nAll reports have been generated successfully!")


def main():
    data_frames = load_transformed_data()
    generate_all_reports(data_frames)


if __name__ == "__main__":
    main()
