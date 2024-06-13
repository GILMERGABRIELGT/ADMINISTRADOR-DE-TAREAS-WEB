document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('tareaForm');
    const listaTareas = document.getElementById('listaTareas');
    const buscarTarea = document.getElementById('buscarTarea');
    const filtroTodas = document.getElementById('filtroTodas');
    const filtroVencidas = document.getElementById('filtroVencidas');
    const filtroResueltas = document.getElementById('filtroResueltas');

    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    let filtroActual = 'todas';

    cargarTareas();

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const nombreTarea = document.getElementById('nombreTarea').value;
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;
        const responsable = document.getElementById('responsable').value;
        const descripcion = document.getElementById('descripcion').value;
        
        if (new Date(fechaInicio) > new Date(fechaFin)) {
            alert('La fecha de fin no puede ser anterior a la fecha de inicio.');
            return;
        }
        
        const tarea = {
            nombre: nombreTarea,
            inicio: fechaInicio,
            fin: fechaFin,
            responsable: responsable,
            descripcion: descripcion,
            resuelta: false
        };

        tareas.push(tarea);
        guardarTareas();
        mostrarTareas();
        form.reset();
    });

    buscarTarea.addEventListener('input', function() {
        mostrarTareas();
    });

    filtroTodas.addEventListener('click', function() {
        filtroActual = 'todas';
        mostrarTareas();
    });

    filtroVencidas.addEventListener('click', function() {
        filtroActual = 'vencidas';
        mostrarTareas();
    });

    filtroResueltas.addEventListener('click', function() {
        filtroActual = 'resueltas';
        mostrarTareas();
    });

    function mostrarTareas() {
        listaTareas.innerHTML = '';
        const terminoBusqueda = buscarTarea.value.toLowerCase();

        tareas.filter(tarea => {
            const coincideBusqueda = tarea.nombre.toLowerCase().includes(terminoBusqueda);
            const hoy = new Date();
            const fechaFinDate = new Date(tarea.fin);
            const vencida = hoy > fechaFinDate;
            const resuelta = tarea.resuelta;

            if (filtroActual === 'todas') {
                return coincideBusqueda;
            } else if (filtroActual === 'vencidas') {
                return coincideBusqueda && vencida;
            } else if (filtroActual === 'resueltas') {
                return coincideBusqueda && resuelta;
            }
        }).forEach(tarea => mostrarTarea(tarea));
    }

    function mostrarTarea(tarea) {
        const tareaDiv = document.createElement('div');
        tareaDiv.classList.add('tarea', 'pendiente');
        tareaDiv.innerHTML = `
            <div>
                <h3>${tarea.nombre}</h3>
                <p><strong>Inicio:</strong> ${tarea.inicio}, <strong>Fin:</strong> ${tarea.fin}, <strong>Responsable:</strong> ${tarea.responsable}</p>
                <p>${tarea.descripcion}</p>
            </div>
            <div>
                <button class="btn btn-success resolver-btn">Resolver</button>
                <button class="btn btn-secondary desmarcar-btn" style="display: none;">Desmarcar</button>
                <button class="btn btn-danger eliminar-btn">Eliminar</button>
            </div>
        `;
        
        const fechaFinDate = new Date(tarea.fin);
        const hoy = new Date();

        if (hoy > fechaFinDate) {
            tareaDiv.classList.add('vencida');
            tareaDiv.classList.remove('pendiente');
        }

        if (tarea.resuelta) {
            tareaDiv.classList.add('resuelta');
            tareaDiv.classList.remove('pendiente');
            tareaDiv.querySelector('.resolver-btn').style.display = 'none';
            tareaDiv.querySelector('.desmarcar-btn').style.display = 'inline-block';
        }

        const resolverBtn = tareaDiv.querySelector('.resolver-btn');
        const desmarcarBtn = tareaDiv.querySelector('.desmarcar-btn');
        const eliminarBtn = tareaDiv.querySelector('.eliminar-btn');

        resolverBtn.addEventListener('click', function() {
            if (hoy <= fechaFinDate) {
                tarea.resuelta = true;
                tareaDiv.classList.add('resuelta');
                tareaDiv.classList.remove('pendiente');
                resolverBtn.style.display = 'none';
                desmarcarBtn.style.display = 'inline-block';
                guardarTareas();
                mostrarTareas();
            } else {
                alert('La tarea no puede ser marcada como resuelta porque ya ha vencido.');
            }
        });

        desmarcarBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas desmarcar esta tarea?')) {
                tarea.resuelta = false;
                tareaDiv.classList.remove('resuelta');
                tareaDiv.classList.add('pendiente');
                resolverBtn.style.display = 'inline-block';
                desmarcarBtn.style.display = 'none';
                guardarTareas();
                mostrarTareas();
            }
        });

        eliminarBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
                tareas = tareas.filter(t => t !== tarea);
                guardarTareas();
                mostrarTareas();
            }
        });

        listaTareas.appendChild(tareaDiv);
    }

    function guardarTareas() {
        localStorage.setItem('tareas', JSON.stringify(tareas));
    }

    function cargarTareas() {
        mostrarTareas();
    }
});
