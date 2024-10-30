import sqlite3
import markdown
from bs4 import BeautifulSoup
import os
import yaml
from pathlib import Path
import re

def parse_frontmatter(content):
    """Parse YAML frontmatter from markdown content."""
    if not content.startswith('---'):
        return {}, content
    
    parts = content.split('---', 2)[1:]
    if len(parts) < 2:
        return {}, content
    
    try:
        metadata = yaml.safe_load(parts[0])
        return metadata, parts[1]
    except yaml.YAMLError:
        return {}, content

def parse_markdown_file(file_path):
    """Parse a markdown file and return its metadata and content."""
    with open(file_path, 'r') as file:
        content = file.read()
    
    metadata, content = parse_frontmatter(content)
    return metadata, content

def create_database():
    """Create the SQLite database with necessary tables."""
    conn = sqlite3.connect('furps.db')
    cursor = conn.cursor()
    
    # Drop existing tables if they exist
    cursor.execute('DROP TABLE IF EXISTS furps_items')
    cursor.execute('DROP TABLE IF EXISTS milestones')
    
    # Create milestones table
    cursor.execute('''
    CREATE TABLE milestones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        critical_path BOOLEAN,
        date_of_completion DATE,
        status TEXT
    )
    ''')
    
    # Create furps_items table
    cursor.execute('''
    CREATE TABLE furps_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        milestone_id INTEGER,
        category TEXT,
        description TEXT,
        stage TEXT,
        title TEXT,
        critical_path BOOLEAN,
        status TEXT,
        FOREIGN KEY (milestone_id) REFERENCES milestones (id)
    )
    ''')
    
    conn.commit()
    return conn

def store_milestone(cursor, metadata):
    """Store milestone data and return its ID."""
    cursor.execute('''
    INSERT INTO milestones (title, description, critical_path, date_of_completion, status)
    VALUES (?, ?, ?, ?, ?)
    ''', (
        metadata.get('title', ''),
        metadata.get('description', ''),
        metadata.get('critical_path', False),
        metadata.get('date_of_completion', ''),
        metadata.get('status', '')
    ))
    return cursor.lastrowid

def extract_furps_from_milestone(content):
    """Extract FURP references and their categories from milestone content."""
    furp_mapping = {}
    current_category = None
    
    # Split content into lines
    lines = content.split('\n')
    
    for line in lines:
        # Check for category headers
        if line.startswith('###'):
            current_category = line.replace('#', '').strip().lower()
        # Look for FURP file references
        elif current_category and '[' in line and ']' in line and '.md' in line:
            # Extract the FURP filename
            match = re.search(r'\[(.*?)\]\((.*?\.md)\)', line)
            if match:
                furp_file = match.group(2)
                # Convert relative path to basename
                furp_file = os.path.basename(furp_file)
                furp_mapping[furp_file] = current_category
    
    return furp_mapping

def store_furp(cursor, metadata, milestone_id, content, category_override=None):
    """Store FURP item data."""
    # Use category_override if provided, otherwise try to get from metadata
    category = category_override if category_override else metadata.get('furp_category', '')
    
    cursor.execute('''
    INSERT INTO furps_items (
        milestone_id, category, description, stage, title, critical_path, status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        milestone_id,
        category,
        metadata.get('description', ''),
        metadata.get('stage', ''),
        metadata.get('title', ''),
        metadata.get('critical_path', False),
        metadata.get('status', '')
    ))

def process_files():
    """Process all milestone and FURP files."""
    conn = create_database()
    cursor = conn.cursor()
    
    # Dictionary to store milestone titles and their IDs
    milestone_ids = {}
    # Dictionary to store FURP category mappings
    furp_categories = {}
    
    # First pass: Process milestones and collect FURP categories
    milestones_dir = Path('public/milestones')
    for milestone_file in milestones_dir.glob('*.md'):
        metadata, content = parse_markdown_file(milestone_file)
        milestone_id = store_milestone(cursor, metadata)
        # Store the ID with a normalized title for matching
        milestone_title = metadata['title'].lower().replace(' ', '-')
        milestone_ids[milestone_title] = milestone_id
        
        # Extract FURP mappings from this milestone
        furp_mapping = extract_furps_from_milestone(content)
        furp_categories.update(furp_mapping)
    
    # Second pass: Process FURPS
    furps_dir = Path('public/furps')
    for furp_file in furps_dir.glob('*.md'):
        metadata, content = parse_markdown_file(furp_file)
        if 'milestone' in metadata:
            # Get the milestone ID using the normalized milestone name
            milestone_id = milestone_ids.get(metadata['milestone'].lower(), None)
            if milestone_id:
                # Get category from the mapping if available
                category_override = furp_categories.get(furp_file.name)
                store_furp(cursor, metadata, milestone_id, content, category_override)
    
    conn.commit()
    conn.close()

if __name__ == '__main__':
    process_files()
    print("Data has been successfully parsed and stored in the SQLite database.")
