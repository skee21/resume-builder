# Interactive Resume Builder

A web-based, interactive resume builder that allows you to create, customize, and export a professional resume directly in your browser. It features a live preview, drag-and-drop section management, and PDF/JSON export capabilities, with all data saved locally in your browser.

![image](https://i.postimg.cc/5tdFh7tF/Screenshot-2025-08-31-at-01-03-55-Offline-Resume-Builder.png)

## Features

*   **Live Preview:** See your resume update in real-time as you type.
*   **Dynamic Sections:** Add, remove, and reorder sections to fit your experience.
    *   Standard sections: Personal Info, Summary, Experience, Projects, Education, Skills.
    *   Add unlimited custom sections for things like "Certifications" or "Awards".
*   **Drag & Drop:** Easily reorder sections using a drag handle (`⠿`).
*   **Profile Picture:** Upload and include a professional headshot.
*   **PDF Export:** Generate a clean, formatted PDF of your resume with a single click.
*   **Data Persistence:** Your work is automatically saved to your browser's local storage, so you can close the tab and come back later.
*   **Import/Export Data:** Back up your resume data to a JSON file and import it later or on another machine.
*   **Reset Functionality:** Start over with a clean slate.

## Technologies Used

*   **HTML5**
*   **Tailwind CSS** for styling.
*   **JavaScript (ES6+)** for all client-side logic.
*   **jsPDF** for PDF generation.

## How to Use

This is a purely client-side application. No build steps or server is required.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/skee21/resume-builder
    ```
2.  **Navigate to the directory:**
    ```bash
    cd resume-builder
    ```
3.  **Open the `index.html` file** in your favorite web browser.

That's it! You can now start building your resume.

## Usage Guide

### Editing Content
Simply fill out the form fields in the left-hand panel. The preview on the right will update automatically as you type.

### Managing Sections & Items
*   **Add Items:** For sections like "Work Experience" or "Projects", click the **"Add"** button to create a new entry.
*   **Remove Items:** Click the `×` button on any individual entry (like a specific job) to remove it.
*   **Add Custom Sections:** Click the **"Add New Section"** button at the bottom of the form. You'll be prompted for a title, and a new custom section with a title and a text area will be added.
*   **Remove Custom Sections:** Click the `X` button next to the title of a custom section to remove the entire section.

### Reordering Sections
Click and hold the drag handle (`⠿`) on the left side of any section, and drag it to your desired position. The preview will update to reflect the new order.

### Data Management

*   **Export to PDF:** Click the **"Export to PDF"** button to generate and download a `resume.pdf` file.
*   **Export Data (JSON):** Click the **"Export JSON"** button. This saves all your resume content into a `resume-config.json` file. This is useful for backups or for moving your data to another computer.
*   **Import Data (JSON):** Click the **"Import JSON"** button and select a `resume-config.json` file you previously exported. The application will load the data from the file, overwriting your current session.
*   **Reset Data:** Click the **"Reset Data"** button to clear all data from the form and from your browser's local storage. **This action is irreversible unless you have saved the json of your configuration.**

## File Structure

```
.
├── index.html      # The main HTML file containing the page structure.
├── script.js       # Contains all the JavaScript logic for the application.
└── style.css       # Contains custom styles and Tailwind CSS directives.
```


