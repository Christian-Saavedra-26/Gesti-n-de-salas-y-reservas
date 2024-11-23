const SALAS_API_URL = 'http://localhost:3000/salas';
const RESERVAS_API_URL = 'http://localhost:3000/reservas';

let editingSalaID = null;
let editingReservaID = null;

async function loadSalas() {
    try {
        const response = await fetch(SALAS_API_URL);
        const salas = await response.json();
        
        const salaList = document.getElementById('sala-list');
        salaList.innerHTML = '';
        salas.forEach(addSalaToTable);

        const reservaSalaSelect = document.getElementById('reserva-sala');
        reservaSalaSelect.innerHTML = '<option value="">Seleccione una sala</option>';
        salas.forEach(sala => {
            const option = document.createElement('option');
            option.value = sala.id;
            option.textContent = sala.nombre;
            reservaSalaSelect.appendChild(option);
        });
    } catch (error) {
        alert('Error al cargar las salas: ' + error.message);
    }
}


function addSalaToTable(sala) {
    const salaList = document.getElementById('sala-list');
    const row = document.createElement('tr');
    row.setAttribute('data-id', sala.id);
    row.innerHTML = `
        <td>${sala.id}</td>
        <td>${sala.nombre}</td>
        <td>${sala.capacidad}</td>
        <td>${sala.estado}</td>
        <td>
            <button onclick="editarSala(${sala.id})">Editar</button>
            <button onclick="deleteSala(${sala.id})">Eliminar</button>
        </td>
    `;
    salaList.appendChild(row);
}

async function saveSala(event) {
    event.preventDefault();
    const nombre = document.getElementById('sala-nombre').value;
    const capacidad = document.getElementById('sala-capacidad').value;
    const estado = document.getElementById('sala-estado').value;

    if (!nombre || !capacidad || !estado) {
        alert('Complete todos los campos.');
        return;
    }

    const sala = { nombre, capacidad, estado };

    try {
        if (editingSalaID) {
            const response = await fetch(`${SALAS_API_URL}/${editingSalaID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sala),
            });
            if (!response.ok) throw new Error('Error al actualizar la sala.');
            alert('Sala actualizada.');
            editingSalaID = null;
        } else {
            const response = await fetch(SALAS_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sala),
            });
            if (!response.ok) throw new Error('Error al crear la sala.');
            alert('Sala creada.');
        }
        loadSalas();
    } catch (error) {
        alert(error.message);
    }
    document.getElementById('sala-form').reset();
}

async function deleteSala(id) {
    if (!confirm('¿Seguro que deseas eliminar esta sala?')) return;
    try {
        const response = await fetch(`${SALAS_API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar la sala.');
        alert('Sala eliminada.');
        loadSalas();
    } catch (error) {
        alert(error.message);
    }
}

function editarSala(id) {
    const row = document.querySelector(`#sala-list tr[data-id="${id}"]`);
    document.getElementById('sala-nombre').value = row.children[1].textContent;
    document.getElementById('sala-capacidad').value = row.children[2].textContent;
    document.getElementById('sala-estado').value = row.children[3].textContent;
    editingSalaID = id;
}

async function loadReservas() {
    try {
        const response = await fetch(RESERVAS_API_URL);
        const reservas = await response.json();
        const reservaList = document.getElementById('reserva-list');
        reservaList.innerHTML = '';
        reservas.forEach(addReservaToTable);
    } catch (error) {
        alert('Error al cargar las reservas: ' + error.message);
    }
}
async function saveReserva(event) {
    event.preventDefault();

    const cliente = document.getElementById('reserva-cliente').value;
    const salaId = document.getElementById('reserva-sala').value;
    const fechaInicio = document.getElementById('reserva-fecha-inicio').value;
    const fechaFin = document.getElementById('reserva-fecha-fin').value;

    if (!cliente || !salaId || !fechaInicio || !fechaFin) {
        alert('Complete todos los campos.');
        return;
    }

    const reserva = {
        nombreReservante: cliente,
        salaId: parseInt(salaId),
        fechaInicio,
        fechaFin
    };

    try {
        if (editingReservaID) {
            const response = await fetch(`${RESERVAS_API_URL}/${editingReservaID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reserva),
            });
            if (!response.ok) throw new Error('Error al actualizar la reserva.');
            alert('Reserva actualizada.');
            editingReservaID = null;
        } else {
            const response = await fetch(RESERVAS_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reserva),
            });
            if (!response.ok) throw new Error('Error al crear la reserva.');
            alert('Reserva creada.');
        }
        loadReservas();
    } catch (error) {
        alert(error.message);
    }

    document.getElementById('reserva-form').reset();
}
function addReservaToTable(reserva) {
    const reservaList = document.getElementById('reserva-list');
    const row = document.createElement('tr');
    row.setAttribute('data-id', reserva.id);
    row.innerHTML = `
        <td>${reserva.id}</td>
        <td>${reserva.nombreReservante}</td>
        <td>${reserva.salaId}</td>
        <td>${reserva.fechaInicio}</td>
        <td>${reserva.fechaFin}</td>
        <td>
            <button onclick="editarReserva(${reserva.id})">Editar</button>
            <button onclick="deleteReserva(${reserva.id})">Eliminar</button>
        </td>
    `;
    reservaList.appendChild(row);
}

function editarReserva(id) {
    const row = document.querySelector(`#reserva-list tr[data-id="${id}"]`);
    document.getElementById('reserva-cliente').value = row.children[1].textContent;
    document.getElementById('reserva-sala').value = row.children[2].textContent;
    document.getElementById('reserva-fecha-inicio').value = row.children[3].textContent;
    document.getElementById('reserva-fecha-fin').value = row.children[4].textContent;
    editingReservaID = id;
}

async function deleteReserva(id) {
    if (!confirm('¿Seguro que deseas eliminar esta reserva?')) return;
    try {
        const response = await fetch(`${RESERVAS_API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar la reserva.');
        alert('reserva eliminada.');
        loadReservas();
    } catch (error) {
        alert(error.message);
    }
}

document.getElementById('sala-form').addEventListener('submit', saveSala);
document.getElementById('reserva-form').addEventListener('submit', saveReserva);

loadSalas();
loadReservas();
