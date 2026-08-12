/* ==========================================
   AMANBANDUNG - APPLICATION LOGIC
   ========================================== */

// 1. MOCK DATABASE LAYER (Initial incidents)
let incidentsDatabase = [
    {
        id: 1,
        category: "Pohon Tumbang",
        risk: "Tinggi",
        title: "Jalan Ir. H. Juanda",
        time: "2 Jam lalu",
        timestamp: new Date().getTime() - 2 * 60 * 60 * 1000,
        location: "Sekitar Dago",
        kecamatan: "Coblong",
        description: "Pohon beringin besar tumbang menutupi separuh jalan arah Dago atas, dekat pertigaan. Menyebabkan kemacetan panjang. Tidak ada korban jiwa namun mengganggu arus kabel listrik.",
        status: "VERIFIKASI",
        coords: [-6.8876, 107.6152],
        image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 2,
        category: "Lainnya", // Kecelakaan Lalu Lintas
        risk: "Sedang",
        title: "Perempatan Braga",
        time: "5 Jam lalu",
        timestamp: new Date().getTime() - 5 * 60 * 60 * 1000,
        location: "Braga, Sumur Bandung",
        kecamatan: "Sumur Bandung",
        description: "Tabrakan ringan antara dua kendaraan roda empat di lampu merah Braga. Arus lalu lintas tersendat namun masih bisa dilalui satu lajur. Petugas kepolisian sedang menuju lokasi.",
        status: "SEDANG DITINJAU",
        coords: [-6.9175, 107.6094],
        image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 3,
        category: "Banjir Genangan",
        risk: "Tinggi",
        title: "Bunderan Cibiru",
        time: "1 Hari lalu",
        timestamp: new Date().getTime() - 24 * 60 * 60 * 1000,
        location: "Cibiru",
        kecamatan: "Cibiru",
        description: "Genangan air setinggi betis orang dewasa setelah hujan deras siang tadi. Motor banyak yang mogok karena memaksakan lewat. Warga menyarankan mencari jalur alternatif.",
        status: "VERIFIKASI",
        coords: [-6.9205, 107.7201],
        image: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 4,
        category: "Begal / Perampokan",
        risk: "Tinggi",
        title: "Aktivitas Mencurigakan",
        time: "10 Menit lalu",
        timestamp: new Date().getTime() - 10 * 60 * 1000,
        location: "Kec. Coblong, Bandung",
        kecamatan: "Coblong",
        description: "Sekelompok orang tidak dikenal terlihat mondar-mandir di sekitar fasilitas umum setelah jam malam. Membawa benda tumpul dan mencurigakan. Harap waspada melintasi daerah Dago Giri.",
        status: "BARU",
        coords: [-6.8725, 107.6210],
        image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 5,
        category: "Lainnya", // Lampu Jalan Padam
        risk: "Sedang",
        title: "Lampu Jalan Padam",
        time: "45 Menit lalu",
        timestamp: new Date().getTime() - 45 * 60 * 1000,
        location: "Kec. Buahbatu, Bandung",
        kecamatan: "Buahbatu",
        description: "Beberapa titik Penerangan Jalan Umum (PJU) di jalan utama mati total sejak hujan deras sore tadi. Membahayakan pengendara sepeda motor dan rawan tindakan kriminalitas.",
        status: "SEDANG DITINJAU",
        coords: [-6.9455, 107.6391],
        image: "https://images.unsplash.com/photo-1517404212738-1b2613758b77?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 6,
        category: "Pohon Tumbang",
        risk: "Rendah",
        title: "Pohon Tumbang Sebagian",
        time: "2 Jam lalu",
        timestamp: new Date().getTime() - 120 * 60 * 1000,
        location: "Kec. Sumur Bandung, Bandung",
        kecamatan: "Sumur Bandung",
        description: "Dahan besar patah dan menggantung di kabel telepon dekat pertigaan jalan. Tidak memblokir jalan namun perlu segera ditangani agar tidak membahayakan pejalan kaki.",
        status: "VERIFIKASI",
        coords: [-6.9150, 107.6110],
        image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 7,
        category: "Pencurian Kendaraan",
        risk: "Tinggi",
        title: "Curanmor Roda Dua",
        time: "3 Hari lalu",
        timestamp: new Date().getTime() - 3 * 24 * 60 * 60 * 1000,
        location: "Indomaret Dipatiukur",
        kecamatan: "Coblong",
        description: "Motor Beat hitam plat D 4829 XX hilang diparkiran minimarket. Kejadian sekitar jam 19.30 WIB. Pelaku terekam CCTV menggunakan jaket ojol.",
        status: "VERIFIKASI",
        coords: [-6.8915, 107.6165],
        image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=600"
    }
];

// Active Filters State
let reportFilters = {
    search: '',
    category: 'all',
    status: 'all'
};

// Global map variables
let riskMap = null;
let wizardMap = null;
let riskMapMarkersGroup = [];
let wizardSelectedMarker = null;

// Map Style State
let currentMapStyle = 'default'; // 'default' or 'satellite'
let defaultTileLayer = null;
let satelliteTileLayer = null;

// Wizard State Machine
let wizardState = {
    step: 1,
    selectedLatLng: null,
    selectedAddress: '',
    category: '',
    risk: 'Sedang',
    title: '',
    description: '',
    attachmentUrl: ''
};

// Pagination variables
let visibleReportsCount = 3;

// 2. WINDOW LIFECYCLE & ROUTING
window.addEventListener('DOMContentLoaded', () => {
    // Initial UI Elements rendering
    lucide.createIcons();
    initAppRouting();
    renderRecentReportsHome();
    applyReportFilters(); // will render community report cards
    animateStatsCounters();
});

// App Router
function navigateTo(targetViewId) {
    // Hide all views
    const views = document.querySelectorAll('.view-section');
    views.forEach(view => view.classList.remove('active'));

    // Deactivate all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    // Show targeted view
    const targetView = document.getElementById(`view-${targetViewId}`);
    if (targetView) {
        targetView.classList.add('active');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Highlight nav link
        const targetNavLink = document.getElementById(`nav-${targetViewId}`);
        if (targetNavLink) {
            targetNavLink.classList.add('active');
        }

        // View Specific Inits
        if (targetViewId === 'peta') {
            initRiskMap();
        } else if (targetViewId === 'wizard') {
            initWizardMap();
            resetWizard();
        } else if (targetViewId === 'beranda') {
            animateStatsCounters();
        }
    }
}

function initAppRouting() {
    // Intercept clicks on links that are SPA navigation targets
    document.querySelectorAll('[data-navigate]').forEach(elem => {
        elem.addEventListener('click', (e) => {
            e.preventDefault();
            const target = elem.getAttribute('data-navigate');
            navigateTo(target);
        });
    });
}

// 3. STATS COUNT UP ANIMATION
function animateStatsCounters() {
    const counters = [
        { id: 'stat-verified-count', target: 2450 },
        { id: 'stat-monitoring-count', target: 156 },
        { id: 'stat-citizens-count', target: 8921 }
    ];

    counters.forEach(counter => {
        const el = document.getElementById(counter.id);
        if (!el) return;
        
        el.innerText = '0';
        let current = 0;
        const target = counter.target;
        const duration = 1200; // ms
        const stepTime = Math.max(Math.floor(duration / target), 10);
        const increment = Math.ceil(target / (duration / stepTime));

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.innerText = target.toLocaleString('id-ID');
                clearInterval(timer);
            } else {
                el.innerText = current.toLocaleString('id-ID');
            }
        }, stepTime);
    });
}

// 4. MAP RISK LAYER (PETA RISIKO TAB)
function initRiskMap() {
    if (riskMap) {
        // Redraw sizes in case container dimensions changed
        setTimeout(() => {
            riskMap.invalidateSize();
        }, 100);
        return;
    }

    // Centered at Bandung City Hall
    const bandungCenter = [-6.9175, 107.6191];
    riskMap = L.map('risk-map', {
        zoomControl: false // custom zoom control position or style later
    }).setView(bandungCenter, 13);

    // Zoom control at bottom right
    L.control.zoom({
        position: 'bottomright'
    }).addTo(riskMap);

    // Initialize Tile Layers
    defaultTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    });

    satelliteTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    // Add default styled light map tile
    defaultTileLayer.addTo(riskMap);

    // Render Markers
    updateMapMarkers();
}

function setMapTileStyle(styleType) {
    if (!riskMap) return;

    document.getElementById('btn-map-view').classList.remove('active');
    document.getElementById('btn-satellite-view').classList.remove('active');

    if (styleType === 'satellite') {
        riskMap.removeLayer(defaultTileLayer);
        satelliteTileLayer.addTo(riskMap);
        document.getElementById('btn-satellite-view').classList.add('active');
        currentMapStyle = 'satellite';
    } else {
        riskMap.removeLayer(satelliteTileLayer);
        defaultTileLayer.addTo(riskMap);
        document.getElementById('btn-map-view').classList.add('active');
        currentMapStyle = 'default';
    }
}

function updateMapMarkers() {
    if (!riskMap) return;

    // Clear existing markers
    riskMapMarkersGroup.forEach(marker => riskMap.removeLayer(marker));
    riskMapMarkersGroup = [];

    // Filter dynamic database
    const filteredIncidents = getFilteredIncidentsForMap();

    // Add new markers
    filteredIncidents.forEach(incident => {
        // Map Risk color class
        let colorClass = 'blue';
        if (incident.risk === 'Tinggi') colorClass = 'red';
        else if (incident.risk === 'Sedang') colorClass = 'orange';

        // Select proper Lucide Icon tag
        let iconName = 'shield-alert';
        if (incident.category === 'Pohon Tumbang') iconName = 'trees';
        else if (incident.category === 'Banjir Genangan') iconName = 'droplets';
        else if (incident.category === 'Pencurian Kendaraan') iconName = 'car-front';
        else if (incident.category === 'Begal / Perampokan') iconName = 'swords';

        // Create Custom HTML Pin Icon
        const customIcon = L.divIcon({
            html: `
                <div class="marker-pin-wrapper">
                    <div class="marker-pulse ${colorClass}"></div>
                    <div class="marker-icon-box ${colorClass}">
                        <i data-lucide="${iconName}"></i>
                    </div>
                </div>
            `,
            className: 'custom-map-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        const marker = L.marker(incident.coords, { icon: customIcon }).addTo(riskMap);
        
        // Custom Pop-up Layout
        const popupContent = `
            <div class="custom-map-popup">
                <div class="popup-card-header">
                    <img src="${incident.image}" alt="Incident">
                </div>
                <div class="popup-card-body">
                    <span class="popup-card-category ${colorClass}">${incident.category} • ${incident.risk}</span>
                    <h4 class="popup-card-title">${incident.title}</h4>
                    <p class="popup-card-address">${incident.location}</p>
                    <p class="popup-card-desc">${incident.description.substring(0, 80)}...</p>
                    <div class="popup-card-footer">
                        <span class="text-sm text-muted">${incident.time}</span>
                        <a href="#" class="popup-card-btn" onclick="viewIncidentDetailFromMap(${incident.id})">Detail Laporan</a>
                    </div>
                </div>
            </div>
        `;

        marker.bindPopup(popupContent, {
            maxWidth: 260,
            closeButton: false
        });

        // Trigger Lucide refresh inside the popup when opened
        marker.on('popupopen', () => {
            lucide.createIcons();
        });

        riskMapMarkersGroup.push(marker);
    });

    // Update Counts in panel
    updateFilterCounts(filteredIncidents);
}

function viewIncidentDetailFromMap(incidentId) {
    if (riskMap) riskMap.closePopup();
    
    // Switch to Laporan view
    navigateTo('laporan');
    
    // Set search filter to this title to isolate it
    const incident = incidentsDatabase.find(i => i.id === incidentId);
    if (incident) {
        document.getElementById('report-search-input').value = incident.title;
        applyReportFilters();
    }
}

// Get filter status from checklist UI
let mapRiskFilters = {
    'Tinggi': true,
    'Sedang': true,
    'Rendah': true
};

function toggleMapRiskFilter(riskLevel) {
    const btn = document.querySelector(`.btn-risk-toggle.${riskLevel.toLowerCase()}`);
    if (!btn) return;

    mapRiskFilters[riskLevel] = !mapRiskFilters[riskLevel];
    
    if (mapRiskFilters[riskLevel]) {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }

    updateMapMarkers();
}

function getFilteredIncidentsForMap() {
    const searchText = document.getElementById('map-search').value.toLowerCase();
    const chkBegal = document.getElementById('chk-begal').checked;
    const chkCuranmor = document.getElementById('chk-curanmor').checked;
    const chkKekerasan = document.getElementById('chk-kekerasan').checked;
    const chkLainnya = document.getElementById('chk-lainnya').checked;
    const timeFilter = document.getElementById('map-time-select').value;

    return incidentsDatabase.filter(incident => {
        // Search Filter
        const matchesSearch = incident.title.toLowerCase().includes(searchText) || 
                              incident.kecamatan.toLowerCase().includes(searchText) ||
                              incident.location.toLowerCase().includes(searchText);
        if (!matchesSearch) return false;

        // Risk Level Filter
        if (!mapRiskFilters[incident.risk]) return false;

        // Incident Type Filters
        if (incident.category === 'Begal / Perampokan' && !chkBegal) return false;
        if (incident.category === 'Pencurian Kendaraan' && !chkCuranmor) return false;
        if (incident.category === 'Kekerasan Jalanan' && !chkKekerasan) return false;
        if (incident.category === 'Lainnya' && !chkLainnya) return false;
        if (incident.category === 'Pohon Tumbang' && !chkLainnya) return false; // Pohon & banjir mapped to lainnya/other in map check
        if (incident.category === 'Banjir Genangan' && !chkLainnya) return false;

        // Time Filter (mock)
        if (timeFilter === '24h') {
            const oneDayAgo = new Date().getTime() - 24 * 60 * 60 * 1000;
            if (incident.timestamp < oneDayAgo) return false;
        } else if (timeFilter === '7d') {
            const sevenDaysAgo = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
            if (incident.timestamp < sevenDaysAgo) return false;
        } else if (timeFilter === '30d') {
            const thirtyDaysAgo = new Date().getTime() - 30 * 24 * 60 * 60 * 1000;
            if (incident.timestamp < thirtyDaysAgo) return false;
        }

        return true;
    });
}

function filterMapMarkers() {
    updateMapMarkers();
}

function updateFilterCounts(currentList) {
    const begalCount = currentList.filter(i => i.category === 'Begal / Perampokan').length;
    const curanmorCount = currentList.filter(i => i.category === 'Pencurian Kendaraan').length;
    const kekerasanCount = currentList.filter(i => i.category === 'Kekerasan Jalanan').length;
    const lainnyaCount = currentList.filter(i => ['Lainnya', 'Pohon Tumbang', 'Banjir Genangan'].includes(i.category)).length;

    document.getElementById('cnt-begal').innerText = begalCount;
    document.getElementById('cnt-curanmor').innerText = curanmorCount;
    document.getElementById('cnt-kekerasan').innerText = kekerasanCount;
    document.getElementById('cnt-lainnya').innerText = lainnyaCount;
}


// 5. HOME RECENT REPORTS RENDER
function renderRecentReportsHome() {
    const container = document.getElementById('home-recent-reports');
    if (!container) return;

    container.innerHTML = '';

    // Take top 3 recent reports sorted by timestamp
    const sorted = [...incidentsDatabase].sort((a, b) => b.timestamp - a.timestamp).slice(0, 3);

    sorted.forEach(incident => {
        const card = createReportCardHTML(incident);
        container.appendChild(card);
    });

    lucide.createIcons();
}


// 6. REPORTS LIST RENDER & FILTERS (LAPORAN TAB)
function applyReportFilters() {
    const searchVal = document.getElementById('report-search-input').value;
    const catVal = document.getElementById('filter-category').value;
    const statusVal = document.getElementById('filter-status').value;

    reportFilters.search = searchVal;
    reportFilters.category = catVal;
    reportFilters.status = statusVal;

    // Filter raw mock array
    let filtered = incidentsDatabase.filter(incident => {
        // Search text matching Title, Description, or Location
        if (reportFilters.search) {
            const term = reportFilters.search.toLowerCase();
            const match = incident.title.toLowerCase().includes(term) ||
                          incident.description.toLowerCase().includes(term) ||
                          incident.location.toLowerCase().includes(term);
            if (!match) return false;
        }

        // Category dropdown
        if (reportFilters.category !== 'all') {
            if (incident.category !== reportFilters.category) return false;
        }

        // Status dropdown
        if (reportFilters.status !== 'all') {
            if (incident.status !== reportFilters.status) return false;
        }

        return true;
    });

    // Render active tags indicators
    renderActiveFilterTags();

    // Sort by timestamp desc
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    // Pagination display logic
    const totalCount = filtered.length;
    const paginatedList = filtered.slice(0, visibleReportsCount);

    const gridContainer = document.getElementById('reports-cards-grid');
    if (gridContainer) {
        gridContainer.innerHTML = '';
        if (paginatedList.length === 0) {
            gridContainer.innerHTML = `
                <div class="no-reports-card" style="grid-column: span 3; text-align: center; padding: 60px 20px; color: var(--color-text-muted);">
                    <i data-lucide="shield-alert" style="width: 48px; height: 48px; margin: 0 auto 16px; color: var(--color-text-light);"></i>
                    <h3>Laporan tidak ditemukan</h3>
                    <p>Coba sesuaikan kata kunci pencarian atau bersihkan filter aktif Anda.</p>
                </div>
            `;
        } else {
            paginatedList.forEach(incident => {
                const card = createReportCardHTML(incident);
                gridContainer.appendChild(card);
            });
        }
    }

    // Update Counter text
    const counterText = document.getElementById('pagination-counter');
    if (counterText) {
        counterText.innerText = `Menampilkan ${paginatedList.length} dari ${totalCount} laporan`;
    }

    // Hide/show load more button
    const loadMoreBtn = document.getElementById('btn-load-more');
    if (loadMoreBtn) {
        if (visibleReportsCount >= totalCount) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }

    lucide.createIcons();
}

function loadMoreReports() {
    visibleReportsCount += 3;
    applyReportFilters();
}

function createReportCardHTML(incident) {
    const card = document.createElement('div');
    card.className = 'report-card';

    // Risk badge class
    let riskClass = 'medium';
    if (incident.risk === 'Tinggi') riskClass = 'high';
    else if (incident.risk === 'Rendah') riskClass = 'low';

    // Status styling
    let statusClass = 'review';
    let statusText = 'SEDANG DITINJAU';
    if (incident.status === 'VERIFIKASI') {
        statusClass = 'verified';
        statusText = 'TERVERIFIKASI';
    } else if (incident.status === 'BARU') {
        statusClass = 'review';
        statusText = 'BARU';
    }

    // Category Icon select
    let catIcon = 'shield-alert';
    if (incident.category === 'Pohon Tumbang') catIcon = 'trees';
    else if (incident.category === 'Banjir Genangan') catIcon = 'droplets';
    else if (incident.category === 'Pencurian Kendaraan') catIcon = 'car-front';
    else if (incident.category === 'Begal / Perampokan') catIcon = 'swords';

    card.innerHTML = `
        <div class="card-map-wrapper">
            <img src="${incident.image}" alt="Laporan Map" class="card-map-thumbnail">
            <span class="badge-risk ${riskClass}">
                <span class="indicator-dot"></span>
                ${incident.risk.toUpperCase()}
            </span>
            <span class="badge-category">
                <i data-lucide="${catIcon}" class="icon-sm"></i>
                <span>${incident.category}</span>
            </span>
        </div>
        <div class="card-body">
            <h3 class="card-title">${incident.title}</h3>
            <span class="card-meta">${incident.time} • ${incident.location}</span>
            <p class="card-desc">${incident.description}</p>
            <div class="card-footer">
                <div class="status-indicator-badge ${statusClass}">
                    <span class="status-dot"></span>
                    <span>${statusText}</span>
                </div>
                <a href="#" class="btn-link" onclick="openDetailsModal(${incident.id}); return false;">
                    <span>Detail</span>
                    <i data-lucide="arrow-right" class="icon-sm"></i>
                </a>
            </div>
        </div>
    `;

    return card;
}

function renderActiveFilterTags() {
    const tagsBox = document.getElementById('active-tags-box');
    const tagsList = document.getElementById('active-tags-list');
    if (!tagsBox || !tagsList) return;

    tagsList.innerHTML = '';
    let activeTagsCount = 0;

    // Search Tag
    if (reportFilters.search) {
        createTag(reportFilters.search, 'search');
        activeTagsCount++;
    }

    // Category Tag
    if (reportFilters.category !== 'all') {
        createTag(`Kategori: ${reportFilters.category}`, 'category');
        activeTagsCount++;
    }

    // Status Tag
    if (reportFilters.status !== 'all') {
        const label = reportFilters.status === 'VERIFIKASI' ? 'Terverifikasi' : (reportFilters.status === 'BARU' ? 'Baru' : 'Sedang Ditinjau');
        createTag(`Status: ${label}`, 'status');
        activeTagsCount++;
    }

    // Hide entire container if no active tags
    if (activeTagsCount === 0) {
        tagsBox.style.display = 'none';
    } else {
        tagsBox.style.display = 'flex';
    }

    function createTag(text, type) {
        const tag = document.createElement('div');
        tag.className = 'tag-badge';
        tag.innerHTML = `
            <span>${text}</span>
            <button class="tag-btn-remove" onclick="removeReportFilter('${type}')">
                <i data-lucide="x"></i>
            </button>
        `;
        tagsList.appendChild(tag);
    }
}

function removeReportFilter(type) {
    if (type === 'search') {
        document.getElementById('report-search-input').value = '';
    } else if (type === 'category') {
        document.getElementById('filter-category').value = 'all';
    } else if (type === 'status') {
        document.getElementById('filter-status').value = 'all';
    }
    applyReportFilters();
}

function clearAllReportFilters() {
    document.getElementById('report-search-input').value = '';
    document.getElementById('filter-category').value = 'all';
    document.getElementById('filter-status').value = 'all';
    applyReportFilters();
}

function openDetailsModal(id) {
    const incident = incidentsDatabase.find(i => i.id === id);
    if (!incident) return;
    
    // Formulate alert dialog with the incident data
    alert(`[DETAIL LAPORAN]\n\nJudul: ${incident.title}\nKategori: ${incident.category}\nRisiko: ${incident.risk}\nLokasi: ${incident.location}\nStatus: ${incident.status}\n\nDeskripsi:\n${incident.description}`);
}


// 7. WIZARD WIDGET CONTROLLER (LAPOR INSIDEN BARU TAB)
function initWizardMap() {
    if (wizardMap) {
        setTimeout(() => {
            wizardMap.invalidateSize();
        }, 100);
        return;
    }

    // Default centered at Bandung
    const bandungCenter = [-6.9175, 107.6191];
    
    wizardMap = L.map('wizard-select-map', {
        zoomControl: false
    }).setView(bandungCenter, 14);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(wizardMap);

    // Click map event to choose spot
    wizardMap.on('click', (e) => {
        setWizardCoordinates(e.latlng);
    });
}

function setWizardCoordinates(latlng) {
    wizardState.selectedLatLng = latlng;
    
    // Set Marker
    if (wizardSelectedMarker) {
        wizardSelectedMarker.setLatLng(latlng);
    } else {
        const markerIcon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41]
        });
        wizardSelectedMarker = L.marker(latlng, { icon: markerIcon }).addTo(wizardMap);
    }

    // Reverse geocode mock address generator based on coordinates
    const lat = latlng.lat.toFixed(6);
    const lng = latlng.lng.toFixed(6);
    let mockAddress = `Jl. Braga No. ${Math.floor(Math.random() * 50) + 1}, Braga, Kec. Sumur Bandung, Kota Bandung`;
    
    if (latlng.lat > -6.90) {
        mockAddress = `Jl. Ir. H. Juanda No. ${Math.floor(Math.random() * 120) + 1}, Dago, Kec. Coblong, Kota Bandung`;
    } else if (latlng.lng > 107.68) {
        mockAddress = `Jl. Soekarno Hatta No. ${Math.floor(Math.random() * 200) + 700}, Cibiru, Kota Bandung`;
    }
    
    wizardState.selectedAddress = mockAddress;

    document.getElementById('wizard-selected-address').innerText = `${mockAddress} (${lat}, ${lng})`;
}

// Handle Map Search in Wizard overlay
function handleWizardMapSearch(e) {
    if (e.key === 'Enter') {
        triggerWizardMapSearch();
    }
}

function triggerWizardMapSearch() {
    const query = document.getElementById('wizard-map-search-input').value;
    if (!query) return;

    // Simulate geolocation coordinates based on search terms
    let targetCoords = [-6.9175, 107.6191]; // default Bandung center
    let resolvedAddress = query;

    if (query.toLowerCase().includes('braga')) {
        targetCoords = [-6.9175, 107.6094];
        resolvedAddress = 'Jl. Braga No. 12, Braga, Kec. Sumur Bandung, Kota Bandung';
    } else if (query.toLowerCase().includes('dago') || query.toLowerCase().includes('juanda')) {
        targetCoords = [-6.8876, 107.6152];
        resolvedAddress = 'Jl. Ir. H. Juanda No. 82, Dago, Kec. Coblong, Kota Bandung';
    } else if (query.toLowerCase().includes('cibiru')) {
        targetCoords = [-6.9205, 107.7201];
        resolvedAddress = 'Bunderan Cibiru, Cipadung, Kec. Cibiru, Kota Bandung';
    } else if (query.toLowerCase().includes('pasirkaliki')) {
        targetCoords = [-6.9092, 107.5975];
        resolvedAddress = 'Jl. Pasir Kaliki No. 121, Pamoyanan, Kec. Cicendo, Kota Bandung';
    }

    if (wizardMap) {
        wizardMap.setView(targetCoords, 16);
        setWizardCoordinates({ lat: targetCoords[0], lng: targetCoords[1] });
    }
}

function locateUserInWizard() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLatLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            if (wizardMap) {
                wizardMap.setView(userLatLng, 16);
                setWizardCoordinates(userLatLng);
            }
        }, () => {
            // Geolocation error fallback
            const fallback = { lat: -6.9175, lng: 107.6191 };
            setWizardCoordinates(fallback);
        });
    } else {
        alert("Browser Anda tidak mendukung deteksi lokasi.");
    }
}

// Wizard State transitions
function updateWizardStepperUI() {
    // Stepper Line Progress
    const progressBar = document.getElementById('wizard-progress-bar');
    const widthPercentage = ((wizardState.step - 1) / 3) * 100;
    if (progressBar) {
        progressBar.style.width = `${widthPercentage}%`;
    }

    // Node updates
    for (let i = 1; i <= 4; i++) {
        const node = document.getElementById(`step-node-${i}`);
        if (node) {
            node.classList.remove('active', 'completed');
            if (i < wizardState.step) {
                node.classList.add('completed');
            } else if (i === wizardState.step) {
                node.classList.add('active');
            }
        }
    }

    // Toggle Panes
    for (let i = 1; i <= 4; i++) {
        const pane = document.getElementById(`wizard-pane-${i}`);
        if (pane) {
            pane.classList.remove('active');
            if (i === wizardState.step) {
                pane.classList.add('active');
            }
        }
    }
}

function nextWizardStep() {
    if (wizardState.step === 1 && !wizardState.selectedLatLng) {
        alert("Pilih lokasi insiden pada peta terlebih dahulu.");
        return;
    }

    if (wizardState.step < 4) {
        wizardState.step++;
        updateWizardStepperUI();
        
        // Prepare step 4 details if navigating to it
        if (wizardState.step === 4) {
            populateWizardReviewDetails();
        }
    }
}

function prevWizardStep() {
    if (wizardState.step > 1) {
        wizardState.step--;
        updateWizardStepperUI();
    }
}

function jumpToWizardStep(stepNum) {
    // Prevent skipping ahead without details or location
    if (stepNum > 1 && !wizardState.selectedLatLng) return;
    if (stepNum > 2 && (!wizardState.category || !wizardState.title || !wizardState.description)) return;
    
    wizardState.step = stepNum;
    updateWizardStepperUI();
    
    if (stepNum === 4) {
        populateWizardReviewDetails();
    }
}

function validateStep2AndNext() {
    const categorySelect = document.getElementById('wiz-category');
    const riskSelected = document.querySelector('input[name="wiz-risk"]:checked');
    const titleInput = document.getElementById('wiz-title');
    const descText = document.getElementById('wiz-desc');

    if (!categorySelect.value || !titleInput.value.trim() || !descText.value.trim()) {
        alert("Mohon isi semua kolom bertanda bintang (*) terlebih dahulu.");
        return;
    }

    wizardState.category = categorySelect.value;
    wizardState.risk = riskSelected ? riskSelected.value : 'Sedang';
    wizardState.title = titleInput.value.trim();
    wizardState.description = descText.value.trim();

    nextWizardStep();
}

// Drag & Drop mock upload
function triggerFileInput() {
    document.getElementById('wiz-file-input').click();
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length === 0) return;
    processUploadedFile(files[0]);
}

function processUploadedFile(file) {
    const uploadZone = document.getElementById('upload-drag-area');
    const previewBox = document.getElementById('upload-preview-box');
    const progressFill = document.getElementById('upload-progress-fill');
    
    document.getElementById('preview-filename').innerText = file.name;
    document.getElementById('preview-filesize').innerText = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    // Show preview & hide drag area
    uploadZone.style.display = 'none';
    previewBox.style.display = 'block';

    // Simulate progress bar load
    progressFill.style.width = '0%';
    let prg = 0;
    const timer = setInterval(() => {
        prg += 10;
        progressFill.style.width = `${prg}%`;
        if (prg >= 100) {
            clearInterval(timer);
            // Create preview link url
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('uploaded-image-preview').src = e.target.result;
                wizardState.attachmentUrl = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }, 80);
}

function removeUploadedFile(e) {
    e.stopPropagation();
    document.getElementById('wiz-file-input').value = '';
    document.getElementById('upload-preview-box').style.display = 'none';
    document.getElementById('upload-drag-area').style.display = 'flex';
    wizardState.attachmentUrl = '';
}

function populateWizardReviewDetails() {
    document.getElementById('review-category').innerText = wizardState.category;
    
    // Risk label style
    let riskBadgeColor = 'badge-orange';
    if (wizardState.risk === 'Tinggi') riskBadgeColor = 'badge-red';
    else if (wizardState.risk === 'Rendah') riskBadgeColor = 'badge-green';

    document.getElementById('review-risk').innerHTML = `<span class="badge ${riskBadgeColor}">${wizardState.risk}</span>`;
    document.getElementById('review-title').innerText = wizardState.title;
    document.getElementById('review-address').innerText = wizardState.selectedAddress;
    document.getElementById('review-desc').innerText = wizardState.description;

    const lat = wizardState.selectedLatLng.lat.toFixed(6);
    const lng = wizardState.selectedLatLng.lng.toFixed(6);
    document.getElementById('review-coords').innerText = `(${lat}, ${lng})`;

    // Preview photo
    const reviewBuktiImg = document.getElementById('review-bukti-img');
    if (wizardState.attachmentUrl) {
        reviewBuktiImg.src = wizardState.attachmentUrl;
        document.getElementById('review-bukti-box').style.display = 'block';
    } else {
        // Fallback placeholder image or hide
        reviewBuktiImg.src = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=400';
    }
}

function submitNewIncident() {
    const btn = document.querySelector('.btn-submit-report');
    btn.innerHTML = `<i data-lucide="loader" class="icon-sm anim-spin"></i> <span>Mengirim...</span>`;
    lucide.createIcons();

    setTimeout(() => {
        // Build new mock report
        const newIncident = {
            id: incidentsDatabase.length + 1,
            category: wizardState.category,
            risk: wizardState.risk,
            title: wizardState.title,
            time: "Baru saja",
            timestamp: new Date().getTime(),
            location: wizardState.selectedAddress.split(',')[0], // street name
            kecamatan: wizardState.selectedAddress.includes('Coblong') ? 'Coblong' : (wizardState.selectedAddress.includes('Cibiru') ? 'Cibiru' : 'Sumur Bandung'),
            description: wizardState.description,
            status: "BARU",
            coords: [wizardState.selectedLatLng.lat, wizardState.selectedLatLng.lng],
            image: wizardState.attachmentUrl || 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=600'
        };

        // Push to local database array
        incidentsDatabase.unshift(newIncident);

        // Reset elements
        btn.innerHTML = `<i data-lucide="send" class="icon-sm"></i> <span>Kirim Laporan</span>`;
        lucide.createIcons();

        // Show Success Modal popup
        document.getElementById('success-modal').classList.add('active');
    }, 1500);
}

function closeSuccessModalAndRedirect() {
    document.getElementById('success-modal').classList.remove('active');
    
    // Refresh datasets & views
    visibleReportsCount = 3;
    renderRecentReportsHome();
    applyReportFilters();
    
    if (riskMap) {
        updateMapMarkers();
    }

    // Go to Laporan view tab
    navigateTo('laporan');
}

function resetWizard() {
    wizardState = {
        step: 1,
        selectedLatLng: null,
        selectedAddress: '',
        category: '',
        risk: 'Sedang',
        title: '',
        description: '',
        attachmentUrl: ''
    };

    // Reset Forms UI
    document.getElementById('wiz-category').value = '';
    document.getElementById('wiz-title').value = '';
    document.getElementById('wiz-desc').value = '';
    document.getElementById('risk-med').checked = true;
    document.getElementById('wizard-selected-address').innerText = "Silakan klik pada peta atau gunakan kolom pencarian di atas untuk menentukan titik lokasi.";
    document.getElementById('wiz-file-input').value = '';
    document.getElementById('upload-preview-box').style.display = 'none';
    document.getElementById('upload-drag-area').style.display = 'flex';

    if (wizardSelectedMarker && wizardMap) {
        wizardMap.removeLayer(wizardSelectedMarker);
        wizardSelectedMarker = null;
    }

    updateWizardStepperUI();
}

function toggleProfileDropdown() {
    alert("Profil Warga AMANBANDUNG - Status: Aktif & Terverifikasi. Menu Pengaturan Profil segera hadir.");
}
