import os, time
from supabase import create_client, Client


supabase: Client = create_client("https://mkzrsppxtzvdfmraueiv.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1renJzcHB4dHp2ZGZtcmF1ZWl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMzM3NzI0MywiZXhwIjoyMDM4OTUzMjQzfQ.fOMLUJv_P9aZ0J5VG11CK3wl8ZYXKW2HscT2onVDCtk")

print(""" 
    ..........................................................................
   _____              _____ _____     _____                           _             
  / ____|            |_   _|  __ \   / ____|                         | |            
 | |  __  _____   __   | | | |  | | | |  __  ___ _ __   ___ _ __ __ _| |_ ___  _ __ 
 | | |_ |/ _ \ \ / /   | | | |  | | | | |_ |/ _ \ '_ \ / _ \ '__/ _` | __/ _ \| '__|
 | |__| | (_) \ V /   _| |_| |__| | | |__| |  __/ | | |  __/ | | (_| | || (_) | |   
  \_____|\___/ \_/   |_____|_____/   \_____|\___|_| |_|\___|_|  \__,_|\__\___/|_|   
                                                                                    
   To Get started.. Select an option:
      [1] Create new ID 
      [2] Edit previous ID (requires user-id/uuid)
      [3] Delete ID
      [4] View statistics
   Please enter a number below.....                                                                                 
""")
time.sleep(2)
futureOption = input("Please enter your option --> ")


def createNewID():
    print('\n\n\n\n')
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
    photo = input("Insert photo (!! Copy image address !!): ")

        
    response = supabase.auth.sign_up(
        credentials={"email": email, "password": password}
    )
    if response.user:
        user_id = response.user.id
        print(f"User ID: {user_id}")

        try:
            response = (
                supabase.table("users")
                .insert({
                    "pin": int(pin),
                    "email": str(email),
                    "password": str(password),
                    "firstname": str(fName),
                    "middlename": str(mName),
                    "lastname": str(lName),
                    "age": int(age),
                    "month": int(birthMonth),
                    "day": int(birthDay),
                    "uuid": str(user_id)
                })
                .execute()
            )
            if response.error:
                print("Error:", response.error)
            else:
                print("Data saved successfully:", response.data)
        except Exception as e:
            print("Something occured but it likely was successful! More info: " + e)
    else:
        print("Sign up failed or user ID not found.")
        exit()

match futureOption:
    case "1":
        # Create new ID
        createNewID()




