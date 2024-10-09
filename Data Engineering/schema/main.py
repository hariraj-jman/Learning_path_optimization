import subprocess

# Define the Python files to run in sequence
scripts = ["extract.py", "transform.py", "report.py"]

# Loop through each script in the list
for script in scripts:
    try:
        # Print a message indicating which script is about to run
        print(f"Running {script}...")

        # Run the Python script using subprocess.run
        # The first argument is the path to the Python executable in the virtual environment
        # The second argument is the script to execute
        result = subprocess.run(["./../.venv/Scripts/python", script], check=True)

        # Print a success message if the script runs without errors
        print(f"{script} completed successfully!\n")

    # Handle errors specifically related to the script execution
    except subprocess.CalledProcessError as e:
        print(f"Error occurred while running {script}: {e}")
        # Break the loop if there is an error
        break

    # Handle any other unexpected errors
    except Exception as ex:
        print(f"An unexpected error occurred: {ex}")
        break
