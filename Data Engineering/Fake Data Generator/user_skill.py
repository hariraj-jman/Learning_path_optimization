import psycopg2
from psycopg2 import sql
from datetime import datetime
import random

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


# Fetch user IDs from users table
def get_user_ids(cursor):
    try:
        cursor.execute("SELECT id FROM public.users")
        return [row[0] for row in cursor.fetchall()]
    except Exception as error:
        print(f"Error fetching user IDs: {error}")
        return []


# Fetch skill IDs from skills table
def get_skill_ids(cursor):
    try:
        cursor.execute("SELECT id FROM public.skills")
        return [row[0] for row in cursor.fetchall()]
    except Exception as error:
        print(f"Error fetching skill IDs: {error}")
        return []


# Generate random proficiency levels
def get_random_proficiency_level():
    return random.choice(["BEGINNER", "INTERMEDIATE", "ADVANCED"])


# Populate the user_skills table
def populate_user_skills():
    conn = connect_db()
    if conn is None:
        return

    try:
        cursor = conn.cursor()

        # Get user IDs and skill IDs
        user_ids = get_user_ids(cursor)
        skill_ids = get_skill_ids(cursor)

        if not user_ids or not skill_ids:
            print("No users or skills found in the respective tables.")
            return

        user_skills_data = []
        for user_id in user_ids:
            for skill_id in random.sample(
                skill_ids, random.randint(1, len(skill_ids))
            ):  # Each user will have 1 to all skills
                proficiency_level = get_random_proficiency_level()
                updated_at = datetime.now()
                user_skills_data.append(
                    (user_id, skill_id, proficiency_level, updated_at)
                )

        # Insert into user_skills table
        insert_query = sql.SQL("""
            INSERT INTO public.user_skills ("userId", "skillId", "proficiencyLevel", "updatedAt")
            VALUES (%s, %s, %s, %s)
        """)

        cursor.executemany(insert_query, user_skills_data)
        conn.commit()

        print(f"Inserted {cursor.rowcount} records into user_skills table.")

    except Exception as error:
        print(f"Error inserting data: {error}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()


# Call the function to populate user_skills
populate_user_skills()
