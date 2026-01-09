// Initial data from CSV (converted to JSON)
const initialData = [
    {"Link_ID":"LNK-1","POP_Name":"Barisal Robi","BTS_Name":"Barisal Robi","Client_Name":"Barishal Robi to Muladi BL","Base_IP":"10.30.133.122","Client_IP":"10.30.133.123","Loopback_IP":"10.30.133.222","Location":"Muladi"},
    {"Link_ID":"LNK-2","POP_Name":"Bogura POP","BTS_Name":"Bogura POP","Client_Name":"Bogra POP to Kahalo BB","Base_IP":"10.30.136.154","Client_IP":"10.30.136.155","Loopback_IP":"118.179.187.130","Location":"Kahalo BB"},
    // ... Add all 709 entries here (truncated for brevity)
    // In production, you would paste all 709 entries
];

class RFManager {
    constructor() {
        this.links = this.loadData();
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.searchTerm = '';
        this.sortColumn = 'Link_ID';
        this.sortDirection = 'asc';
        this.currentEditId = null;
        
        this.init();
    }

    init() {
        this.renderTable();
        this.setupEventListeners();
        this.updateStats();
    }

    loadData() {
        const savedData = localStorage.getItem('rfLinksData');
        if (savedData) {
            return JSON.parse(savedData);
        }
        // Initialize with sample data if none exists
        localStorage.setItem('rfLinksData', JSON.stringify(initialData));
        return initialData;
    }

    saveData() {
        localStorage.setItem('rfLinksData', JSON.stringify(this.links));
    }

    renderTable() {
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = '';

        const filteredLinks = this.getFilteredLinks();
        const paginatedLinks = this.getPaginatedLinks(filteredLinks);

        paginatedLinks.forEach(link => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${link.Link_ID}</td>
                <td>${link.POP_Name}</td>
                <td>${link.BTS_Name}</td>
                <td>${link.Client_Name}</td>
                <td>${link.Base_IP}</td>
                <td>${link.Client_IP}</td>
                <td>${link.Loopback_IP || 'N/A'}</td>
                <td>${link.Location}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" data-id="${link.Link_ID}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn delete" data-id="${link.Link_ID}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        this.updatePagination(filteredLinks.length);
    }

    getFilteredLinks() {
        if (!this.searchTerm) return this.links;
        
        const searchLower = this.searchTerm.toLowerCase();
        return this.links.filter(link =>
            Object.values(link).some(value =>
                value && value.toString().toLowerCase().includes(searchLower)
            )
        );
    }

    getPaginatedLinks(links) {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return links.slice(startIndex, endIndex);
    }

    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        document.getElementById('pageInfo').textContent = 
            `Page ${this.currentPage} of ${totalPages}`;
        
        document.getElementById('prevBtn').disabled = this.currentPage === 1;
        document.getElementById('nextBtn').disabled = this.currentPage === totalPages;
    }

    updateStats() {
        document.getElementById('totalLinks').textContent = this.links.length;
        
        const uniqueLocations = new Set(this.links.map(link => link.Location));
        document.getElementById('uniqueLocations').textContent = uniqueLocations.size;
        
        const uniquePOPs = new Set(this.links.map(link => link.POP_Name));
        document.getElementById('uniquePOPs').textContent = uniquePOPs.size;
    }

    openModal(link = null) {
        const modal = document.getElementById('linkModal');
        const title = document.getElementById('modalTitle');
        const form = document.getElementById('linkForm');
        
        if (link) {
            title.textContent = 'Edit Link';
            document.getElementById('linkId').value = link.Link_ID;
            document.getElementById('popName').value = link.POP_Name;
            document.getElementById('btsName').value = link.BTS_Name;
            document.getElementById('clientName').value = link.Client_Name;
            document.getElementById('baseIP').value = link.Base_IP;
            document.getElementById('clientIP').value = link.Client_IP;
            document.getElementById('loopbackIP').value = link.Loopback_IP || '';
            document.getElementById('location').value = link.Location;
            this.currentEditId = link.Link_ID;
        } else {
            title.textContent = 'Add New Link';
            form.reset();
            this.currentEditId = null;
        }
        
        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('linkModal').style.display = 'none';
        document.getElementById('linkForm').reset();
        this.currentEditId = null;
    }

    saveLink(formData) {
        const linkData = {
            Link_ID: formData.get('linkId'),
            POP_Name: formData.get('popName'),
            BTS_Name: formData.get('btsName'),
            Client_Name: formData.get('clientName'),
            Base_IP: formData.get('baseIP'),
            Client_IP: formData.get('clientIP'),
            Loopback_IP: formData.get('loopbackIP'),
            Location: formData.get('location')
        };

        if (this.currentEditId) {
            // Update existing link
            const index = this.links.findIndex(link => link.Link_ID === this.currentEditId);
            if (index !== -1) {
                this.links[index] = linkData;
            }
        } else {
            // Add new link
            this.links.push(linkData);
        }

        this.saveData();
        this.renderTable();
        this.updateStats();
        this.closeModal();
    }

    deleteLink(linkId) {
        this.links = this.links.filter(link => link.Link_ID !== linkId);
        this.saveData();
        this.renderTable();
        this.updateStats();
    }

    exportToCSV() {
        const headers = ['Link_ID', 'POP_Name', 'BTS_Name', 'Client_Name', 'Base_IP', 'Client_IP', 'Loopback_IP', 'Location'];
        const csvContent = [
            headers.join(','),
            ...this.links.map(link => 
                headers.map(header => {
                    const value = link[header] || '';
                    return `"${value.toString().replace(/"/g, '""')}"`;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'RF_LINKS_EXPORT.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    importFromCSV(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const lines = content.split('\n');
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            
            const importedLinks = lines.slice(1)
                .filter(line => line.trim())
                .map(line => {
                    const values = line.split(',');
                    const link = {};
                    headers.forEach((header, index) => {
                        link[header] = values[index] ? values[index].trim().replace(/"/g, '') : '';
                    });
                    return link;
                });

            // Merge with existing data (avoid duplicates based on Link_ID)
            const existingIds = new Set(this.links.map(link => link.Link_ID));
            const newLinks = importedLinks.filter(link => !existingIds.has(link.Link_ID));
            
            this.links = [...this.links, ...newLinks];
            this.saveData();
            this.renderTable();
            this.updateStats();
            
            alert(`Imported ${newLinks.length} new links successfully!`);
        };
        reader.readAsText(file);
    }

    setupEventListeners() {
        // Add button
        document.getElementById('addLinkBtn').addEventListener('click', () => this.openModal());
        
        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.currentPage = 1;
            this.renderTable();
        });
        
        // Pagination
        document.getElementById('prevBtn').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderTable();
            }
        });
        
        document.getElementById('nextBtn').addEventListener('click', () => {
            const filteredLinks = this.getFilteredLinks();
            const totalPages = Math.ceil(filteredLinks.length / this.itemsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderTable();
            }
        });
        
        // Export
        document.getElementById('exportBtn').addEventListener('click', () => this.exportToCSV());
        
        // Import
        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('csvFileInput').click();
        });
        
        document.getElementById('csvFileInput').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.importFromCSV(file);
                e.target.value = '';
            }
        });
        
        // Reset
        document.getElementById('resetBtn').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                localStorage.removeItem('rfLinksData');
                this.links = initialData;
                this.saveData();
                this.currentPage = 1;
                this.renderTable();
                this.updateStats();
            }
        });
        
        // Form submission
        document.getElementById('linkForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            this.saveLink(formData);
        });
        
        // Close modal buttons
        document.querySelectorAll('.close, .close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        
        // Edit and Delete buttons (delegated)
        document.getElementById('tableBody').addEventListener('click', (e) => {
            const target = e.target.closest('.action-btn');
            if (!target) return;
            
            const linkId = target.dataset.id;
            
            if (target.classList.contains('edit')) {
                const link = this.links.find(l => l.Link_ID === linkId);
                if (link) this.openModal(link);
            } else if (target.classList.contains('delete')) {
                if (confirm('Are you sure you want to delete this link?')) {
                    this.deleteLink(linkId);
                }
            }
        });
        
        // Close modal on outside click
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('linkModal');
            if (e.target === modal) this.closeModal();
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RFManager();
});
