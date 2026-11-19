document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // --- Set Minimum Dates ---
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkin').setAttribute('min', today);
    document.getElementById('checkout').setAttribute('min', today);
    document.getElementById('book-checkin').setAttribute('min', today);
    document.getElementById('book-checkout').setAttribute('min', today);

    // --- Booking Modal Logic ---
    const modal = document.getElementById('bookingModal');
    const modalRoomName = document.getElementById('modal-room-name');

    window.openBookingModal = function(roomName) {
        modalRoomName.textContent = roomName;
        modal.style.display = 'flex';
    };

    window.closeBookingModal = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // --- Save Booking ---
    const bookingForm = document.getElementById('booking-form');
    
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        const bookingData = {
            name: document.getElementById('book-name').value,
            email: document.getElementById('book-email').value,
            room: modalRoomName.textContent,
            checkin: document.getElementById('book-checkin').value,
            checkout: document.getElementById('book-checkout').value,
        };

        setTimeout(() => {
            let bookings = JSON.parse(localStorage.getItem('orixia_bookings')) || [];
            bookings.push(bookingData);
            localStorage.setItem('orixia_bookings', JSON.stringify(bookings));

            modal.querySelector('.modal-content').innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <i class="fas fa-check-circle" style="font-size: 4rem; color: #28c76f; margin-bottom: 20px;"></i>
                    <h2 style="font-family: 'Cinzel', serif; color: #0a1f14;">Booking Confirmed!</h2>
                    <p style="margin-top: 10px; color: #666;">Thank you, ${bookingData.name}. Your request for the <strong>${bookingData.room}</strong> has been saved.</p>
                    <button onclick="closeBookingModal()" class="btn-primary" style="margin-top: 20px;">Close</button>
                </div>
            `;
        }, 1500);
    });
});

function checkAvailability() {
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    if (!checkin || !checkout) {
        alert("Please select both Check-in and Check-out dates.");
        return;
    }
    document.getElementById('rooms').scrollIntoView({ behavior: 'smooth' });
}

function showBookings() {
    const adminModal = document.getElementById('adminModal');
    const tableBody = document.getElementById('bookingsTableBody');
    const bookings = JSON.parse(localStorage.getItem('orixia_bookings')) || [];
    
    tableBody.innerHTML = '';
    if (bookings.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">No bookings found.</td></tr>';
    } else {
        bookings.forEach(booking => {
            tableBody.innerHTML += `
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">${booking.name}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${booking.email}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${booking.room}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${booking.checkin}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${booking.checkout}</td>
                </tr>
            `;
        });
    }
    adminModal.style.display = 'flex';
}
