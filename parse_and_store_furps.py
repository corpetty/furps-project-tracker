import sqlite3
import markdown
from bs4 import BeautifulSoup
import re

def parse_markdown_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Parse the markdown content
    html = markdown.markdown(content)
    soup = BeautifulSoup(html, 'html.parser')
    
    # Extract metadata
    metadata = {}
    for line in content.split('\n'):
        if line.startswith('---'):
            continue
        if ':' in line:
            key, value = line.split(':', 1)
            metadata[key.strip()] = value.strip()
    
    # Extract FURPS data
    furps_data = {}
    current_category = None
    for element in soup.find_all(['h3', 'li']):
        if element.name == 'h3':
            current_category = element.text.strip().lower()
            furps_data[current_category] = []
        elif element.name == 'li' and current_category:
            item_text = element.text.strip()
            stage = 'unknown'
            if '|' in item_text:
                item_text, stage = item_text.split('|')
                stage = stage.strip()[1:-1]  # Remove parentheses
            furps_data[current_category].append({
                'description': item_text.strip(),
                'stage': stage
            })
    
    return metadata, furps_data

def create_database():
    conn = sqlite3.connect('furps_database.db')
    cursor = conn.cursor()
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS milestones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        critical_path BOOLEAN,
        date_of_completion DATE,
        status TEXT
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS furps_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        milestone_id INTEGER,
        category TEXT,
        description TEXT,
        stage TEXT,
        FOREIGN KEY (milestone_id) REFERENCES milestones (id)
    )
    ''')
    
    conn.commit()
    return conn

def store_data(conn, metadata, furps_data):
    cursor = conn.cursor()
    
    # Insert milestone data
    cursor.execute('''
    INSERT INTO milestones (title, description, critical_path, date_of_completion, status)
    VALUES (?, ?, ?, ?, ?)
    ''', (
        metadata.get('title', ''),
        metadata.get('description', ''),
        metadata.get('critical_path', '').lower() == 'true',
        metadata.get('date_of_completion', ''),
        metadata.get('status', '')
    ))
    
    milestone_id = cursor.lastrowid
    
    # Insert FURPS items
    for category, items in furps_data.items():
        for item in items:
            cursor.execute('''
            INSERT INTO furps_items (milestone_id, category, description, stage)
            VALUES (?, ?, ?, ?)
            ''', (milestone_id, category, item['description'], item['stage']))
    
    conn.commit()

if __name__ == '__main__':
    file_path = 'public/store-service-upgrade.md'
    metadata, furps_data = parse_markdown_file(file_path)
    
    conn = create_database()
    store_data(conn, metadata, furps_data)
    conn.close()
    
    print("Data has been successfully parsed and stored in the SQLite database.")
