import os
import pandas as pd
import psycopg2

# Output directory for extracted data
RAW_DATA_DIR = "./data/raw/"

# Ensure the directory exists
os.makedirs(RAW_DATA_DIR, exist_ok=True)

# Database connection parameters
DB_PARAMS = {
    "dbname": "mydb",
    "user": "postgres",
    "password": "hari2020raj",
    "host": "localhost",
    "port": "5432",
}

# Queries to fetch data
QUERIES = {
    "users": "SELECT * FROM public.users;",
    "courses": "SELECT * FROM public.courses;",
    "course_progress": "SELECT * FROM public.course_progress;",
    "learning_paths": "SELECT * FROM public.learning_paths;",
    "assignments": "SELECT * FROM public.assignments;",
    "skills": "SELECT * FROM public.skills",
    "user_skills": "SELECT * FROM public.user_skills",
    "learning_path_courses": "SELECT * FROM public.learning_path_courses;",
}


def extract_data():
    # Connect to the PostgreSQL database
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()

        # Fetch and save data for each table
        for table, query in QUERIES.items():
            cursor.execute(query)
            data = cursor.fetchall()

            # Get column names from cursor description
            col_names = [desc[0] for desc in cursor.description]
            df = pd.DataFrame(data, columns=col_names)

            # Removing Sensitive Data
            if table == "users":
                print("Removed Password")
                df.drop("password", axis=1, inplace=True)

            # Save dataframe to CSV
            csv_path = os.path.join(RAW_DATA_DIR, f"{table}.csv")
            df.to_csv(csv_path, index=False)

        print("Data extraction complete!")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            cursor.close()
            conn.close()


if __name__ == "__main__":
    extract_data()
