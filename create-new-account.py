import tkinter as tk
from tkinter import messagebox

# -----------------------------
#  APP CONTROLLER
# -----------------------------
class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("3-Page Tkinter Template")
        self.geometry("400x350")
        self.resizable(False, False)

        # Store shared data between pages
        self.shared_data = {
            "firstName": tk.StringVar(),
            "middleName": tk.StringVar(),
            "lastName": tk.StringVar(),
            "age": tk.StringVar(),
            "month": tk.StringVar(),
            "day": tk.StringVar(),
            
        }

        container = tk.Frame(self)
        container.pack(fill="both", expand=True)

        self.frames = {}

        for F in (StartPage, InputPage, OverviewPage):
            frame = F(parent=container, controller=self)
            self.frames[F] = frame
            frame.grid(row=0, column=0, sticky="nsew")

        self.show_frame(StartPage)

    def show_frame(self, page):
        frame = self.frames[page]
        frame.tkraise()


# -----------------------------
#  PAGE 1: START PAGE
# -----------------------------
class StartPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller

        title = tk.Label(self, text="Welcome!", font=("Segoe UI", 18, "bold"))
        title.pack(pady=40)

        subtitle = tk.Label(self, text="This is the start page.\nClick Next to begin.", font=("Segoe UI", 11))
        subtitle.pack(pady=10)

        next_btn = tk.Button(self, text="Next →", width=10, command=lambda: controller.show_frame(InputPage))
        next_btn.pack(pady=20)


# -----------------------------
#  PAGE 2: INPUT FORM PAGE
# -----------------------------
class InputPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller
        shared = controller.shared_data

        title = tk.Label(self, text="Enter Your Details", font=("Segoe UI", 16, "bold"))
        title.pack(pady=20)

        tk.Label(self, text="Name:").pack()
        tk.Entry(self, textvariable=shared["name"], width=30).pack(pady=5)

        tk.Label(self, text="Email:").pack()
        tk.Entry(self, textvariable=shared["email"], width=30).pack(pady=5)

        tk.Label(self, text="Age:").pack()
        tk.Entry(self, textvariable=shared["age"], width=30).pack(pady=5)

        btn_frame = tk.Frame(self)
        btn_frame.pack(pady=20)

        back_btn = tk.Button(btn_frame, text="← Back", width=10,
                             command=lambda: controller.show_frame(StartPage))
        back_btn.grid(row=0, column=0, padx=5)

        next_btn = tk.Button(btn_frame, text="Next →", width=10,
                             command=lambda: controller.show_frame(OverviewPage))
        next_btn.grid(row=0, column=1, padx=5)


# -----------------------------
#  PAGE 3: OVERVIEW PAGE
# -----------------------------
class OverviewPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller
        shared = controller.shared_data

        title = tk.Label(self, text="Overview", font=("Segoe UI", 16, "bold"))
        title.pack(pady=20)

        # Container for displayed data
        self.fields = []

        # Create field display blocks
        for key in ["name", "email", "age"]:
            frame = tk.Frame(self)
            frame.pack(pady=5)

            label = tk.Label(frame, text=f"{key.capitalize()}: ", font=("Segoe UI", 11))
            label.grid(row=0, column=0, sticky="e")

            value_label = tk.Label(frame, textvariable=shared[key], font=("Segoe UI", 11, "bold"), width=20, anchor="w")
            value_label.grid(row=0, column=1, padx=5)

            copy_btn = tk.Button(frame, text="Copy", command=lambda k=key: self.copy_to_clipboard(shared[k].get()))
            copy_btn.grid(row=0, column=2, padx=5)

            self.fields.append((key, value_label))

        btn_frame = tk.Frame(self)
        btn_frame.pack(pady=25)

        back_btn = tk.Button(btn_frame, text="← Back", width=10,
                             command=lambda: controller.show_frame(InputPage))
        back_btn.grid(row=0, column=0, padx=5)

        done_btn = tk.Button(btn_frame, text="Finish", width=10,
                             command=self.finish)
        done_btn.grid(row=0, column=1, padx=5)

    def copy_to_clipboard(self, text):
        self.clipboard_clear()
        self.clipboard_append(text)
        messagebox.showinfo("Copied", f"'{text}' copied to clipboard!")

    def finish(self):
        name = self.controller.shared_data["name"].get()
        messagebox.showinfo("Done", f"Thanks, {name}!")
        self.controller.show_frame(StartPage)


# -----------------------------
#  RUN THE APP
# -----------------------------
if __name__ == "__main__":
    app = App()
    app.mainloop()
