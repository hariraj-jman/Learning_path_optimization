import pandas as pd
import os


def display_csv_info(folder_path):
    # List all files in the specified folder
    files = os.listdir(folder_path)

    # Filter for CSV files
    csv_files = [file for file in files if file.endswith(".csv")]

    # Display info for each CSV file
    for csv_file in csv_files:
        file_path = os.path.join(folder_path, csv_file)
        try:
            # Read the CSV file
            df = pd.read_csv(file_path)
            print(f"Info for {csv_file}:")
            # Display the info of the DataFrame
            df.info()
            print(df.head(3))
            print("\n" + "=" * 50 + "\n")  # Separator for readability
        except Exception as e:
            print(f"Error reading {csv_file}: {e}")


# Specify the folder path here
folder_path = "./data/raw/"  # Change this to your folder path

# Call the function to display CSV info
display_csv_info(folder_path)
