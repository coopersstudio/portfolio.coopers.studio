import os

usrFolder = input("folder to gather (e.g. images/desn/pzza): ")
usrDest = input("file to put image tags into (e.g. birds): ")


# --- Configuration ---
image_folder = "images/desn/pzza"  # folder containing your images
output_file = "images/images-list-" + usrDest + ".html"  # file where the HTML will be saved

# --- Supported image extensions ---
extensions = (".jpg", ".jpeg", ".png")

# --- Gather image files ---
image_files = [f for f in os.listdir(usrFolder) if f.lower().endswith(extensions)]

# --- Generate HTML ---
html_lines = []
for img in image_files:
    # Full path relative to HTML file
    img_path = os.path.join(usrFolder, img).replace("\\", "/")
    html_line = f'<img src="{img_path}" alt="{img}"></a>'
    html_lines.append(html_line)

# --- Write to file ---
with open(output_file, "w", encoding="utf-8") as f:
    f.write("\n".join(html_lines))

print(f"Generated {len(image_files)} <img> tags in {output_file}")