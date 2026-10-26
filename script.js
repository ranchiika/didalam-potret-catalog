/* ===================================================
   CONFIG & DATA (DENGAN DUKUNGAN STRIP IMAGE PATH)
   =================================================== */

// Ganti nomor WhatsApp Anda di sini (Format 62...)
const WA_NUMBER = "6281234567890"; 

// Data Frame (image = untuk katalog, stripImage = khusus untuk hanger & printer)
const framesData = [
    { 
        id: 1, 
        name: "Frame #1 — Zebra", 
        image: "img/1.png", 
        stripImage: "img/strip-1.jpg" // Path khusus untuk hanger & printer
    },
    { 
        id: 2, 
        name: "Frame #2 — Fawn Print", 
        image: "img/2.png", 
        stripImage: "img/strip-2.jpg" 
    },
    { 
        id: 3, 
        name: "Frame #3 — Baddest in Jakarta", 
        image: "img/3.png", 
        stripImage: "img/strip-3.jpg" 
    },
    { 
        id: 4, 
        name: "Frame #4 — Classic Sepia", 
        image: "img/4.png", 
        stripImage: "img/strip-5.jpg" 
    },
    { 
        id: 5, 
        name: "Frame #5 — Two-Shot B&W", 
        image: "img/5.jpg", 
        stripImage: "img/strip-4.jpg" 
    },
    { 
        id: 6, 
        name: "Frame #6 — Baddest, Black", 
        image: "img/6.jpg", 
        stripImage: "img/strip-6.jpg" 
    },
    { 
        id: 7, 
        name: "Frame #7 — Nine-Up Grid", 
        image: "img/7.jpg", 
        stripImage: "img/strip-7.jpg" 
    },
  
    
   
];

let currentLoopIndex = 0;
let autoPrintInterval = null;
let selectedPrintedFrame = framesData[0];
let selectedFrameIdModal = null;

/* ===================================================
   AUTO-LOOPING PRINTER LOGIC
   =================================================== */

function printFrameToMachine(frameItem) {
    selectedPrintedFrame = frameItem;

    const card = document.getElementById('printedStripCard');
    const img = document.getElementById('printedImage');
    const title = document.getElementById('printedFrameTitle');

    if (!card || !img || !title) return;

    card.classList.remove('print-animation');
    void card.offsetWidth; 

    // Menggunakan stripImage untuk mesin printer, fallback ke image utama jika stripImage kosong
    img.src = frameItem.stripImage ? frameItem.stripImage : frameItem.image;
    title.innerText = frameItem.name;
    
    card.classList.add('print-animation');
}

function startAutoPrinterLoop() {
    stopAutoPrinterLoop(); 
    
    autoPrintInterval = setInterval(() => {
        currentLoopIndex = (currentLoopIndex + 1) % framesData.length;
        const nextFrame = framesData[currentLoopIndex];
        
        updateHangingActiveState(nextFrame.id);
        printFrameToMachine(nextFrame);
    }, 3500); 
}

function stopAutoPrinterLoop() {
    if (autoPrintInterval) {
        clearInterval(autoPrintInterval);
        autoPrintInterval = null;
    }
}

function updateHangingActiveState(frameId) {
    document.querySelectorAll('.hanging-item').forEach(el => {
        if (el.dataset.id == frameId) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
}

/* ===================================================
   RENDER HANGING ROPE FRAMES
   =================================================== */

function renderHangingFrames() {
    const ropeContainer = document.getElementById('hangingRopeGrid');
    if (!ropeContainer) return;
    ropeContainer.innerHTML = '';

    const hangingList = framesData.slice(0, 10);

    hangingList.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = `hanging-item ${index === 0 ? 'active' : ''}`;
        itemDiv.dataset.id = item.id;
        
        itemDiv.onclick = () => {
            currentLoopIndex = framesData.findIndex(f => f.id === item.id);
            updateHangingActiveState(item.id);
            printFrameToMachine(item);
            startAutoPrinterLoop();
        };

        // Menggunakan stripImage untuk gambar di gantungan tali
        const displayImg = item.stripImage ? item.stripImage : item.image;

        itemDiv.innerHTML = `
            <div class="peg-clip-wrapper">
                <div class="peg-clip-custom">
                    <span class="peg-spring"></span>
                </div>
            </div>
            <div class="hanging-strip">
                <img src="${displayImg}" alt="${item.name}" loading="lazy">
            </div>
            <span class="hanging-label">Frame #${item.id}</span>
        `;

        ropeContainer.appendChild(itemDiv);
    });
}

function bookCurrentPrintedFrame() {
    if (!selectedPrintedFrame) return;
    const message = `Halo Didalam Potret! 👋%0ASaya mau pesan photobooth dengan pilihan *${selectedPrintedFrame.name}*.%0ABoleh minta info ketersediaan tanggal & pricelist?`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank');
}

/* ===================================================
   RENDER ALL CATALOGUE GRID & SEARCH
   =================================================== */

function renderCatalogueFrames(data = framesData) {
    const grid = document.getElementById('frameGrid');
    if (!grid) return;
    grid.innerHTML = '';

    if (data.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #5A6A7E;">Frame tidak ditemukan.</p>`;
        return;
    }

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'frame-card';
        card.onclick = () => openModal(item);

        // Katalog tetap menggunakan gambar utama (item.image)
        card.innerHTML = `
            <div class="aspect-strip">
                <img src="${item.image}" alt="Frame #${item.id}" loading="lazy">
            </div>
            <div class="frame-info">
                <span class="frame-name">Frame #${item.id}</span>
                <span class="btn-preview-tag">Preview</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterFrames() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const filtered = framesData.filter(item => item.id.toString().includes(query));
    renderCatalogueFrames(filtered);
}

/* ===================================================
   MODAL LOGIC & WA BOOKING
   =================================================== */

function openModal(item) {
    selectedFrameIdModal = item.id;
    document.getElementById('modalFrameTitle').innerText = `Preview Frame #${item.id}`;
    document.getElementById('modalImage').src = item.image;
    document.getElementById('detailModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('detailModal').classList.add('hidden');
}

function closeModalOnBackdrop(event) {
    if (event.target.id === 'detailModal') {
        closeModal();
    }
}

function bookCurrentFrame() {
    if (!selectedFrameIdModal) return;
    const message = `Halo Didalam Potret! 👋%0ASaya tertarik menggunakan *Frame #${selectedFrameIdModal}*.%0ABoleh minta info price list dan ketersediaan tanggalnya?`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank');
}

function bookPackage(packageName) {
    const message = `Halo Didalam Potret! 👋%0ASaya mau tanya ketersediaan jadwal untuk *Paket ${packageName}*.`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank');
}

function openGeneralBooking() {
    const message = `Halo Didalam Potret! 👋%0ASaya mau konsultasi jadwal photobooth untuk event saya.`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank');
}

/* Initial Load */
document.addEventListener('DOMContentLoaded', () => {
    renderHangingFrames();
    renderCatalogueFrames();
    
    printFrameToMachine(framesData[0]);
    startAutoPrinterLoop();
});