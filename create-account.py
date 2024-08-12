import os
from supabase import create_client, Client


supabase: Client = create_client("https://mkzrsppxtzvdfmraueiv.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1renJzcHB4dHp2ZGZtcmF1ZWl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMzM3NzI0MywiZXhwIjoyMDM4OTUzMjQzfQ.fOMLUJv_P9aZ0J5VG11CK3wl8ZYXKW2HscT2onVDCtk")

email = input("Enter the email for the account: ")
password = input("Enter the password for the account: ")
pin = input("Set a numeric ONLY pin - 6 CHARACTERS ONLY, NO MORE, NO LESS: ")

print(f'\n')
fName = input("Enter first name for account: ")
mName = input("Enter middle name for account: ")
lName = input("Enter last name for account: ")
age = input("Enter age for account ")
birthMonth = input("Enter month of birth: ")
birthDay = input("Enter day of birth: ")




response = supabase.auth.sign_up(
    credentials={"email": email, "password": password}
)

def saveInfoToDb(identification):
    try:
        response = (
            supabase.table("users")
            .insert({
                "pin": int(pin),
                "email": str(email),
                "password": str(password),
                "firstname": str(fName),
                "middlename": str(mName),
                "age": int(age),
                "month": int(birthMonth),
                "day": int(birthDay),
                "uuid": str(identification)
            })
            .execute()
        )
        if response.error:
            print("Error:", response.error)
        else:
            print("Data saved successfully:", response.data)
    except Exception as e:
        print("Something occured but it likely was successful! More info: " + e)

if response.user:
    user_id = response.user.id
    print(f"User ID: {user_id}")

    saveInfoToDb(user_id)
else:
    print("Sign up failed or user ID not found.")