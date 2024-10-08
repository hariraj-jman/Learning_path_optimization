import psycopg2
from psycopg2 import sql
from datetime import datetime, timedelta
import random
from faker import Faker
import traceback

# Initialize Faker
fake = Faker()

DB_USER = "postgres"
DB_PASSWORD = "hari2020raj"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "mydb"


# Database connection
def connect_db():
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,  # or your host
            port=DB_PORT,  # or your port
        )
        return conn
    except Exception as error:
        print(f"Error connecting to the database: {error}")
        return None


# Fetch data from users, courses, and learning_paths tables
def get_users(cursor):
    cursor.execute("SELECT id FROM public.users WHERE role = 'EMPLOYEE'")
    return [row[0] for row in cursor.fetchall()]


def get_courses(cursor):
    cursor.execute("SELECT id FROM public.courses")
    return [row[0] for row in cursor.fetchall()]


def get_learning_paths(cursor):
    cursor.execute("SELECT id FROM public.learning_paths")
    return [row[0] for row in cursor.fetchall()]


# Insert data into assignments and course_progress tables
def populate_assignments_and_progress(assignments_data, course_progress_data):
    conn = connect_db()
    if conn is None:
        return

    try:
        cursor = conn.cursor()

        # Insert into assignments table
        assignment_insert_query = sql.SQL("""
            INSERT INTO public.assignments
            VALUES (%s, %s, %s, %s, %s)
        """)
        cursor.executemany(assignment_insert_query, assignments_data)

        # Insert into course_progress table
        course_progress_insert_query = sql.SQL("""
            INSERT INTO public.course_progress 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """)
        cursor.executemany(course_progress_insert_query, course_progress_data)

        conn.commit()
        print(
            f"Inserted {len(assignments_data)} records into assignments and {len(course_progress_data)} into course_progress."
        )

    except Exception as error:
        print(f"Error inserting data: {error}")
        traceback.print_exc()
        conn.rollback()
    finally:
        cursor.close()
        conn.close()


# Populate assignments and course_progress with Faker
def populate_data():
    conn = connect_db()
    if conn is None:
        return
    try:
        cursor = conn.cursor()

        # Fetch users, courses, and learning paths
        users = get_users(cursor)
        courses = get_courses(cursor)
        learning_paths = get_learning_paths(cursor)
        aldready_exist = []

        assignments_data = []
        course_progress_data = []

        # Generate approx. 10,000 entries
        i = 1
        for user_id in users:
            for _ in range(random.randint(6, 25)):
                id = i
                # user_id = random.choice(users)
                course_id = random.choice(courses)
                learning_path_id = None
                assigned_at = fake.date_time_this_decade()

                if (user_id, course_id) in aldready_exist:
                    continue
                aldready_exist.append((user_id, course_id))
                # Add entry to assignments
                assignments_data.append(
                    (id, user_id, course_id, learning_path_id, assigned_at)
                )

                # Generate course_progress for each assignment
                assignment_id = (
                    id  # Assignment ID will be auto-generated and sequential
                )
                completion_status = random.choice(
                    ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]
                )
                updated_at = fake.date_time_this_year()

                if completion_status == "NOT_STARTED":
                    certificate_url = None
                    score = 0  # Score only for completed courses
                    time_invested = 0  # Random time invested in hours
                    progress = 0
                    quiz_score = 0
                    assignment_score = 0
                    timeSpentOnQuizzes = 0
                    participation_count = 0
                    print("1", end="")
                elif completion_status == "IN_PROGRESS":
                    certificate_url = None
                    score = random.uniform(50, 100)  # Score only for completed courses
                    time_invested = random.randint(
                        2, 30
                    )  # Random time invested in hours
                    progress = random.uniform(0, 100)
                    quiz_score = random.randint(1, 100)
                    assignment_score = random.randint(1, 100)
                    timeSpentOnQuizzes = random.randint(1, 10)
                    participation_count = random.randint(1, 10)
                    print("2", end="")
                else:
                    certificate_url = (
                        "https://th.bing.com/th/id/OIP.0sNWprQMpNBq_17I23CVvwAAAA?rs=1&pid=ImgDetMain"
                        if completion_status == "COMPLETED"
                        else None
                    )
                    score = random.uniform(50, 100)  # Score only for completed courses
                    time_invested = random.randint(
                        2, 30
                    )  # Random time invested in hours
                    progress = 100
                    quiz_score = random.randint(20, 100)
                    assignment_score = random.randint(20, 100)
                    timeSpentOnQuizzes = random.randint(1, 10)
                    participation_count = random.randint(1, 10)

                # Add entry to course_progress
                course_progress_data.append(
                    (
                        id,
                        assignment_id,
                        user_id,
                        course_id,
                        progress,
                        score,
                        time_invested,
                        completion_status,
                        certificate_url,
                        quiz_score,
                        assignment_score,
                        participation_count,
                        timeSpentOnQuizzes,
                        updated_at,
                    )
                )

                i += 1

        print(len(assignments_data), len(course_progress_data))
        x = input("Press enter to insert...")
        # Insert into the tables
        populate_assignments_and_progress(assignments_data, course_progress_data)

    except Exception as error:
        print(f"Error fetching data: {error}")
    finally:
        cursor.close()
        conn.close()


# Call the function to populate data
populate_data()
