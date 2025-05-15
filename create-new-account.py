import os
import string, random, pyperclip, requests
from dotenv import load_dotenv
from supabase import create_client, Client


url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

supabase: Client = create_client("https://mkzrsppxtzvdfmraueiv.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1renJzcHB4dHp2ZGZtcmF1ZWl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMzNzcyNDMsImV4cCI6MjAzODk1MzI0M30.jCheBzxYFXUS63z-ISo9MXgxFosrXdu8LPobRFyUNro")

load_dotenv()
def create_new_auth():
    # Generate a simple but secure password
    # Format: CommonWord + 2 digits + Special character
    common_words = ['Forest', 'Ocean', 'Mountain', 'River', 'Valley', 'Desert', 'Brisbane', 'XXXX', 'Footy', 'Flute', 'Password', 'Flame']
    password = random.choice(common_words) + str(random.randint(10,99)) + random.choice('!@#$')

    # Check on supabase auth for most-recent email (usual format is user402@gmail.com), create new email with an incremented number
    # Get the most recent email
    response = supabase.table("users").select("email").order("created_at", desc=True).limit(1).execute()
    most_recent_email = response.data[0]["email"]

    # Extract the username and number
    username_parts = most_recent_email.split("@")[0]
    # Find where the digits start in the username
    i = len(username_parts) - 1
    while i >= 0 and username_parts[i].isdigit():
        i -= 1
    base_username = username_parts[:i+1]
    number = int(username_parts[i+1:]) if username_parts[i+1:].isdigit() else 0
    
    # Create new email with incremented number
    new_email = f"{base_username}{number + 1}@gmail.com"
    
    confirmation = input(f"Create an account with {new_email}, {password} : (Y/N) ")
    match confirmation:
        case 'Y' | 'y':
            print('Great. Info has been copied to clipboard')
            pyperclip.copy(f"{new_email}\n{password}")
            return
        case 'N' | 'n':
            print('Exitting program.... Reason: DECLINED RESPONSE')
            exit()

    return {
        "email": new_email,
        "password": password
    }
    
def determine_postcode(suburb: str):
    # Use Australia Post API to lookup postcode
    print(f"Looking up postcode for suburb: {suburb}")
    
    try:
        # Format suburb name properly
        formatted_suburb = suburb.strip().title()
        print(f"Formatted suburb name: {formatted_suburb}")
        
        # Australia Post API endpoint
        url = "https://digitalapi.auspost.com.au/postcode/search.json"
        print(f"Making request to API endpoint: {url}")
        
        # Query parameters
        params = {
            "q": formatted_suburb,
            "state": "QLD"
        }
        print(f"Request parameters: {params}")
        
        # Add API key to headers - should be stored in environment variable
        headers = {
            "AUTH-KEY": "5GGkv2GlwcSTtGX2povdnR4C5jSn10mY"
        }
        
        # Make API request
        response = requests.get(url, params=params, headers=headers)
        print(f"API response status code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("Raw response:", data)
            
            localities = data.get("localities", {}).get("locality")
            
            if not localities:
                print("No results found")
                return None

            # Handle dict or list
            if isinstance(localities, dict):
                postcode = localities.get("postcode")
            elif isinstance(localities, list):
                postcode = localities[0].get("postcode")
            else:
                print("Unexpected format")
                return None

            print(f"Found postcode: {postcode}")
            return postcode

        print(f"API call failed: {response.text}")
        return None

    except Exception as e:
        print(f"Error looking up postcode: {e}")
        return None


x = input('Suburb: ')
determine_postcode(x)

def create_new_account(first_name: str,
                      middle_name: str,
                      last_name: str,
                      phone_number: str,
                      address: str,
                      city: str,
                      state: str,
                      zip_code: str,
                      country: str,
                      date_of_birth: str,
                      gender: str,
                      profile_picture: str,
                      auth_details=create_new_auth()):
    email = auth_details["email"]
    password = auth_details["password"]
    
    supabase.table("users").insert({
        "email": email,
        "password": password,
        "first_name": first_name,
        "last_name": last_name,

    })
