import pandas as pd
from sqlalchemy import create_engine, text

# Database connection details
DB_USER = "postgres"
DB_PASSWORD = "hari2020raj"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "mydb"

# Create a connection to the PostgreSQL database
engine = create_engine(
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# Read the Excel file
file_path = "software_engineering_dataset.xlsx"

# Load all sheets into a dictionary of DataFrames
sheets = pd.read_excel(file_path, sheet_name=None)

# Disable foreign key checks (optional: for performance reasons)
with engine.connect() as conn:
    conn.execute(text("SET session_replication_role = 'replica';"))

# Insert data manually into the tables in the correct order
table_insert_order = [
    "users",
    "skills",
    "courses",
    "learning_paths",
    "learning_path_courses",
    "assignments",
    "course_progress",
    "user_skills",
]


# Helper function to format SQL values
def format_sql_value(value):
    if pd.isna(value):
        return "NULL"
    elif isinstance(value, str):
        return f"'{value.replace("'", "''")}'"  # Escape single quotes in strings
    else:
        return str(value)


with engine.connect() as conn:
    for table in table_insert_order:
        df = sheets[table]
        print(f"Inserting data into {table} table...")

        for index, row in df.iterrows():
            # Create the column names and values for the insert statement
            columns = ", ".join(df.columns)
            values = ", ".join([format_sql_value(row[col]) for col in df.columns])

            # Write the SQL insert statement
            sql = f"INSERT INTO {table} ({columns}) VALUES ({values});"

            # Execute the insert statement
            conn.execute(text(sql))

        print(f"Data inserted into {table} successfully.")

# Enable foreign key checks again
with engine.connect() as conn:
    conn.execute(text("SET session_replication_role = 'origin';"))

print("All data inserted successfully.")
