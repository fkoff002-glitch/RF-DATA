# RF Links Management System

A frontend-only web application for managing RF (Radio Frequency) links data. This application stores data locally in your browser's localStorage.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete RF links
- **Search & Filter**: Search through all link data
- **Import/Export**: Import CSV files and export data as CSV
- **Responsive Design**: Works on desktop and mobile devices
- **Statistics Dashboard**: View total links, unique locations, and POPs
- **Pagination**: Navigate through large datasets easily

## How to Use

### Live Demo
1. Open `index.html` in any modern web browser
2. Or deploy to GitHub Pages (see below)

### Basic Operations
- **Add New Link**: Click the "Add New Link" button
- **Edit Link**: Click the edit button on any row
- **Delete Link**: Click the delete button on any row
- **Search**: Type in the search box to filter results
- **Export**: Click "Export CSV" to download all data
- **Import**: Click "Import CSV" to upload a CSV file

### Data Format
The CSV file should have the following columns:
- Link_ID
- POP_Name
- BTS_Name
- Client_Name
- Base_IP
- Client_IP
- Loopback_IP
- Location

## Deployment to GitHub Pages

1. Create a new repository on GitHub
2. Upload all four files to the repository:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md` (this file)
3. Go to repository Settings > Pages
4. Select "Deploy from a branch" and choose the main branch
5. Save - your site will be live at `https://[username].github.io/[repository-name]`

## Browser Compatibility
Works in all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Data Persistence
Data is stored in your browser's localStorage. To clear data:
- Use the "Reset Data" button in the app
- Or clear browser data for the site

## Customization

### Change Items Per Page
Edit `itemsPerPage` in `script.js` line 32.

### Modify Initial Data
Edit the `initialData` array in `script.js` lines 3-10.

### Change Color Scheme
Modify the CSS variables in `style.css` under the gradient sections.

## License
MIT License - Free to use and modify

## Support
For issues or questions, please check the GitHub repository.
