import csv
from faker import Faker
import random

# Initialize Faker instance
fake = Faker()

# Define roles
roles = ["ADMIN", "EMPLOYEE"]


# Generate fake data
def generate_fake_data(num_records):
    data = []
    for i in range(2, num_records + 2):  # Start with id = 2, assuming id 1 is skipped
        name = fake.name()
        email = fake.email()
        password = "$2b$10$e2kWX54o1Om1.S8PIXj4Be6mRtz7mFQheATL7RRJbSgoqigLVDhxq"  # Fixed password
        role = random.choices(roles, weights=(10, 900))[0]  # Bias for EMPLOYEE role
        createdAt = fake.date_time_this_year().strftime(
            "%H:%M.%S"
        )  # Format time as '09:07.1'
        updatedAt = createdAt  # Assuming the same time for simplicity

        data.append(
            {
                "id": i + 2,  # Adjusted id
                "name": name,
                "email": email,
                "password": password,
                "role": role,
                "createdAt": createdAt,
                "updatedAt": updatedAt,
            }
        )

    return data


# Function to save data to CSV
def save_to_csv(data, filename):
    keys = data[0].keys()  # Get the headers from the first dictionary
    with open(filename, "w", newline="") as output_file:
        dict_writer = csv.DictWriter(output_file, fieldnames=keys)
        dict_writer.writeheader()
        dict_writer.writerows(data)


# Number of records to generate
num_records = 300
fake_data = generate_fake_data(num_records)

# Save the generated fake data to CSV
save_to_csv(fake_data, "fake_users.csv")

print(f"Data saved to 'fake_users.csv'")
