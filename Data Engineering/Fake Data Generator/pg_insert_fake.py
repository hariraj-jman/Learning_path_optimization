import psycopg2
from faker import Faker
import random
from datetime import datetime
import traceback

# Initialize Faker instance
fake = Faker()

# Connect to your PostgreSQL database
conn = psycopg2.connect(
    dbname="mydb",
    user="postgres",
    password="hari2020raj",
    host="localhost",
    port="5432",
)

# Create a cursor object
cur = conn.cursor()


# Generate learning paths
def generate_learning_paths(num_paths=100):
    learning_paths = []
    for i in range(num_paths):
        title = fake.unique.sentence(nb_words=3)  # Ensure unique title
        description = fake.text(max_nb_chars=200)
        created_at = updated_at = datetime.now()
        learning_paths.append((title, description, created_at, updated_at))
    return learning_paths


learning_path_id = 4


def insert_learning_paths(learning_paths):
    insert_query = """
    INSERT INTO learning_paths
    VALUES (%s, %s, %s, %s, %s) RETURNING id;
    """
    inserted_ids = []
    for i, learning_path in enumerate(learning_paths):
        cur.execute(insert_query, (learning_path_id + i, *learning_path))
        inserted_id = cur.fetchone()[0]  # Fetch the ID of the inserted row
        inserted_ids.append(inserted_id)
    return inserted_ids  # Return list of inserted IDs


# Generate learning path courses (ensure uniqueness of learningPathId, courseId)
def generate_learning_path_courses(learning_path_ids, course_ids, courses_per_path=5):
    learning_path_courses = set()  # Use a set to avoid duplicate combinations
    for path_id in learning_path_ids:
        selected_courses = random.sample(course_ids, courses_per_path)
        for idx, course_id in enumerate(selected_courses):
            if (path_id, course_id) not in learning_path_courses:  # Avoid duplicates
                learning_path_courses.add((path_id, course_id, idx + 1))
    return list(learning_path_courses)


# Insert learning path courses
def insert_learning_path_courses(learning_path_courses):
    insert_query = """
    INSERT INTO learning_path_courses (learningPathId, courseId, "order")
    VALUES (%s, %s, %s) ON CONFLICT DO NOTHING;  # Avoid duplicate inserts
    """
    cur.executemany(insert_query, learning_path_courses)


# Generate user skills (ensure unique userId and skillId combination)
def generate_user_skills(user_ids, skill_ids, min_skills=5, max_skills=10):
    user_skills = set()  # Use a set to avoid duplicates
    for user_id in user_ids:
        num_skills = random.randint(min_skills, max_skills)
        selected_skills = random.sample(skill_ids, num_skills)
        for skill_id in selected_skills:
            if (user_id, skill_id) not in user_skills:  # Ensure uniqueness
                proficiency = random.choice(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
                updated_at = datetime.now()
                user_skills.add((user_id, skill_id, proficiency, updated_at))
    return list(user_skills)


# Insert user skills
def insert_user_skills(user_skills):
    insert_query = """
    INSERT INTO user_skills (userId, skillId, proficiencyLevel, updatedAt)
    VALUES (%s, %s, %s, %s) ON CONFLICT DO NOTHING;  # Avoid duplicate inserts
    """
    cur.executemany(insert_query, user_skills)


# Generate assignments (respect unique constraint for userId and courseId or learningPathId)
def generate_assignments(
    user_ids, learning_path_ids, course_ids, num_assignments=20000
):
    assignments = set()  # Use a set to avoid duplicates
    for _ in range(num_assignments):
        user_id = random.choice(user_ids)
        if random.random() < 0.5:  # 50% chance for learning path or course
            learning_path_id = random.choice(learning_path_ids)
            course_id = None
        else:
            course_id = random.choice(course_ids)
            learning_path_id = None

        assigned_at = datetime.now()

        if (user_id, course_id, learning_path_id) not in assignments:
            assignments.add((user_id, course_id, learning_path_id, assigned_at))
    return list(assignments)


# Insert assignments (respecting unique constraints)
def insert_assignments(assignments):
    insert_query = """
    INSERT INTO assignments (userId, courseId, learningPathId, assignedAt)
    VALUES (%s, %s, %s, %s) ON CONFLICT DO NOTHING RETURNING id;  # Avoid duplicates
    """
    cur.executemany(insert_query, assignments)
    return [row[0] for row in cur.fetchall()]  # Return list of inserted assignment IDs


# Generate course progress (one per assignment)
def generate_course_progress(assignments, min_progress=0.0, max_progress=1.0):
    course_progress = []
    for assignment_id in assignments:
        progress = round(random.uniform(min_progress, max_progress), 2)
        score = random.uniform(50, 100) if progress == 1.0 else None
        time_invested = random.randint(1, 10) * 60  # in minutes
        completion_status = "COMPLETED" if progress == 1.0 else "IN_PROGRESS"
        updated_at = datetime.now()
        course_progress.append(
            (
                assignment_id,
                progress,
                score,
                time_invested,
                completion_status,
                updated_at,
            )
        )
    return course_progress


# Insert course progress
def insert_course_progress(course_progress):
    insert_query = """
    INSERT INTO course_progress (assignmentId, progress, score, timeInvested, completionStatus, updatedAt)
    VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING;  # Avoid duplicates
    """
    cur.executemany(insert_query, course_progress)


# Main function to run all the generation and insertion
def main():
    try:
        # Fetch user IDs, course IDs, and skill IDs
        cur.execute("SELECT id FROM users;")
        user_ids = [row[0] for row in cur.fetchall()]

        cur.execute("SELECT id FROM courses;")
        course_ids = [row[0] for row in cur.fetchall()]

        cur.execute("SELECT id FROM skills;")
        skill_ids = [row[0] for row in cur.fetchall()]

        # Generate and insert learning paths
        learning_paths = generate_learning_paths()
        learning_path_ids = insert_learning_paths(learning_paths)

        # # Generate and insert learning path courses
        # learning_path_courses = generate_learning_path_courses(
        #     learning_path_ids, course_ids
        # )
        # insert_learning_path_courses(learning_path_courses)

        # # Generate and insert user skills
        # user_skills = generate_user_skills(user_ids, skill_ids)
        # insert_user_skills(user_skills)

        # # Generate and insert assignments
        # assignments = generate_assignments(user_ids, learning_path_ids, course_ids)
        # assignment_ids = insert_assignments(assignments)

        # # Generate and insert course progress
        # course_progress = generate_course_progress(assignment_ids)
        # insert_course_progress(course_progress)

        # Commit the transactions
        x = input("Press enter to commit to DB")
        conn.commit()
        print("Data generation and insertion completed successfully!")
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
        conn.rollback()
    finally:
        cur.close()
        conn.close()


# Run the main function
if __name__ == "__main__":
    main()
