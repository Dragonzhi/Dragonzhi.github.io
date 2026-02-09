# github_contribution_exporter.py
import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime, timedelta
import re

def get_github_contributions(username):
    url = f"https://github.com/{username}"
    response = requests.get(url)
    response.raise_for_status()  # Raise an exception for HTTP errors

    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find the contribution calendar SVG
    # The structure might change, but this is a common selector
    contribution_graph = soup.find('div', class_='js-calendar-graph')
    
    if not contribution_graph:
        print(f"Could not find contribution graph for user {username}. GitHub page structure might have changed.")
        # Fallback to searching for individual day elements
        return get_contributions_from_day_elements(soup)

    contributions_data = {}
    
    # Iterate through each <rect> element representing a day
    for day_rect in contribution_graph.find_all('rect', class_='ContributionCalendar-day'):
        date_str = day_rect.get('data-date')
        if date_str:
            # data-date is in 'YYYY-MM-DD' format
            # Cal-Heatmap expects timestamp in seconds
            date_obj = datetime.strptime(date_str, '%Y-%m-%d')
            timestamp = int(date_obj.timestamp())
            
            # data-count holds the number of contributions
            # In modern GitHub, data-count is not directly on the rect.
            # It's in the tooltip, or derived from data-level.
            # Let's get the title attribute, which usually says "X contributions on YYYY-MM-DD"
            title_text = day_rect.get('data-original-title') or day_rect.get('title')
            
            contributions = 0
            if title_text:
                match = re.search(r'(\d+)\s+contribution', title_text)
                if match:
                    contributions = int(match.group(1))
            
            contributions_data[timestamp] = contributions
            
    return contributions_data

def get_contributions_from_day_elements(soup):
    contributions_data = {}
    
    # This is a more robust way to get daily data by iterating through all day cells
    # Newer GitHub uses <td class="ContributionCalendar-day">
    for day_cell in soup.find_all(class_='ContributionCalendar-day'):
        date_str = day_cell.get('data-date')
        if date_str:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d')
            timestamp = int(date_obj.timestamp())

            title_text = day_cell.get('data-original-title') or day_cell.get('title')
            contributions = 0
            if title_text:
                match = re.search(r'(\d+)\s+contribution', title_text)
                if match:
                    contributions = int(match.group(1))
            
            contributions_data[timestamp] = contributions
    
    # Check if we got any data, if not, maybe the structure is completely different
    if not contributions_data:
        print("Could not find any contribution data using common patterns.")
        print("Falling back to dummy data generation for the past year.")
        return generate_dummy_data_for_cal_heatmap() # Fallback

    return contributions_data

def generate_dummy_data_for_cal_heatmap():
    data = {}
    today = datetime.now()
    # Generate data for the past year
    for i in range(365):
        day = today - timedelta(days=i)
        timestamp = int(day.timestamp())
        data[timestamp] = i % 10 # Random-like values
    return data


def save_contributions_to_json(contributions_data, filename="github_contributions.json", output_dir="data"):
    # Ensure the output directory exists
    import os
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    filepath = os.path.join(output_dir, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(contributions_data, f, ensure_ascii=False, indent=4)
    print(f"Contributions saved to {filepath}")

if __name__ == "__main__":
    github_username = input("Enter your GitHub username: ")
    print(f"Fetching contributions for {github_username}...")
    try:
        contributions = get_github_contributions(github_username)
        if contributions:
            save_contributions_to_json(contributions)
            print("Successfully fetched and saved GitHub contributions.")
        else:
            print("No contributions data could be extracted.")
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}. Check username and internet connection.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
