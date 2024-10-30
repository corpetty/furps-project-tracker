import sqlite3

# Connect to the database
conn = sqlite3.connect('furps.db')

# Create a cursor object
cursor = conn.cursor()

# Execute a SELECT query
cursor.execute("SELECT * FROM milestones")

# Fetch all results
rows = cursor.fetchall()

# Print the results
for row in rows:
    print(row)

cursor.execute("SELECT * FROM furps_items")
# print property names
print(cursor.description)
rows = cursor.fetchall()
for row in rows:
    print(row)

# Close the connection
conn.close()
