import os
import random
import string
import requests

# -------------------
# CONFIG (from os.env)
# -------------------
SUPABASE_URL = os.environ.get("SUPABASE_URL")  # e.g. https://xxxx.supabase.co
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")  # service_role or anon key

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("❌ Missing SUPABASE_URL or SUPABASE_KEY in environment variables")

TABLE = "users"
API_URL = f"{SUPABASE_URL}/rest/v1/{TABLE}"
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

# -------------------
# EMAIL + PASSWORD GENERATOR
# -------------------
def generate_email(base_name="user", domain="gmail.com"):
    # get last email
    resp = requests.get(API_URL + "?select=email&order=id.desc&limit=1", headers=HEADERS)
    data = resp.json()
    
    if data:
        last_email = data[0]["email"]
        num = int("".join(filter(str.isdigit, last_email)))
        next_num = num + 1
    else:
        next_num = 500
    
    return f"{base_name}{next_num}@{domain}"

def generate_password():
    length = random.randint(6, 10)
    num_symbols_count = random.randint(2, 4)
    letters_count = length - num_symbols_count

    letters = ''.join(random.choices(string.ascii_letters, k=letters_count))
    nums_symbols = ''.join(random.choices(string.digits + "!@#$%^&*", k=num_symbols_count))

    password_list = list(letters + nums_symbols)
    random.shuffle(password_list)
    return "".join(password_list)

# -------------------
# USER INPUT
# -------------------
def collect_user_data():
    user_data = {}
    user_data["pin"] = input("Enter PIN: ")
    user_data["firstname"] = input("Enter First Name: ")
    user_data["middlename"] = input("Enter Middle Name (optional): ") or None
    user_data["lastname"] = input("Enter Last Name: ")
    user_data["age"] = int(input("Enter Age (e.g., 18, 19, 20): "))
    user_data["month"] = int(input("Enter Birth Month (1-12): "))
    user_data["day"] = int(input("Enter Birth Day (1-31): "))
    user_data["houseNumber"] = input("Enter House Number: ")
    user_data["street"] = input("Enter Street Name: ")
    user_data["type"] = input("Enter Street Type (St/Rd/etc): ")
    user_data["suburb"] = input("Enter Suburb: ")
    user_data["postCode"] = input("Enter Postcode: ")
    user_data["state"] = "QLD"
    user_data["country"] = "AU"
    return user_data

# -------------------
# INSERT USER
# -------------------
def insert_user():
    email = generate_email()
    password = generate_password()
    user_info = collect_user_data()

    data = {
        "pin": user_info["pin"],
        "email": email,
        "password": password,
        "firstname": user_info["firstname"],
        "middlename": user_info["middlename"],
        "lastname": user_info["lastname"],
        "age": user_info["age"],
        "month": user_info["month"],
        "day": user_info["day"],
        "houseNumber": user_info["houseNumber"],
        "street": user_info["street"],
        "type": user_info["type"],
        "suburb": user_info["suburb"],
        "postCode": user_info["postCode"],
        "state": user_info["state"],
        "country": user_info["country"],
        "admin": False,
        "user_credentials": {}
    }

    resp = requests.post(API_URL, headers=HEADERS, json=data)
    if resp.status_code in (200, 201):
        print("✅ User inserted successfully!")
        print("Email:", email)
        print("Password:", password)
    else:
        print("❌ Error inserting user:", resp.status_code, resp.text)

if __name__ == "__main__":
    insert_user()
