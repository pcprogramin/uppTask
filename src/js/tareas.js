(function () {
    obtenerTareas();

    //Variables para guardar todas las tareas de forma general.
    let tareas = [];
    //Permite guardar las variables que hemos filtrado.
    let filtradas = [];

    //Este codigo nos permite realizar una nueva tarea.
    const nuevaTareaBtn = document.querySelector('#agregar_tarea');
    nuevaTareaBtn.addEventListener('click', () => mostrarFormulario());

    //Nos permite apliacar los filtros de la apliacion la parte de la tarea
    const filtros = document.querySelectorAll('#filtros input[type="radio"]');
    filtros.forEach(radio => {
        radio.addEventListener('input', filtrarTareas);
    });
    function filtrarTareas(e) {
        const filtro = e.target.value;
        if (filtro !== '') filtradas = tareas.filter(tarea => tarea.estado === filtro);
        else filtradas = [];
        mostrarTareas();
    }

    //Funcion que nos permite obtener la tarea conectando con la api. 
    async function obtenerTareas() {
        try {
            const id = obtenerProyecto();
            const url = `/api/tareas?id=${id}`;
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();
            tareas = resultado.tareas;
            mostrarTareas();
        } catch (error) {
            console.log(error);
        }
    }

    //Funcion que nos permite dibujar las tareas
    function mostrarTareas() {
        limpiarTareas();
        totalPendiente();
        totalCompletas()
        const arrayTareas = filtradas.length ? filtradas : tareas;
        if (arrayTareas.length === 0) {
            const contenedorTareas = document.querySelector('#listado_tareas');
            const textoNoTareas = document.createElement('LI');
            textoNoTareas.textContent = 'No hay tareas';
            textoNoTareas.classList.add('no-tareas');

            contenedorTareas.appendChild(textoNoTareas);
            return;
        }
        const estados = {
            0: 'Pendiente',
            1: 'Completa'
        }
        arrayTareas.forEach(tarea => {
            const contenedorTarea = document.createElement('LI');
            contenedorTarea.dataset.tareaId = tarea.id;
            contenedorTarea.classList.add('tarea');
            const nombreTarea = document.createElement('P');
            nombreTarea.textContent = tarea.nombre;
            nombreTarea.ondblclick = function () {
                mostrarFormulario(true, { ...tarea });
            }
            const opcinesDiv = document.createElement('DIV');
            opcinesDiv.classList.add('opciones');
            const btnEstadoTarea = document.createElement('BUTTON');
            btnEstadoTarea.classList.add('estado-tarea');
            btnEstadoTarea.classList.add(`${estados[tarea.estado].toLowerCase()}`)
            btnEstadoTarea.textContent = estados[tarea.estado];
            btnEstadoTarea.dataset.btnEstadoTarea = tarea.estado;
            btnEstadoTarea.ondblclick = function () {
                cambiarEstadoTarea({ ...tarea });
            }

            const btnEliminarTarea = document.createElement('BUTTON');
            btnEliminarTarea.classList.add('eliminar-tarea');
            btnEliminarTarea.dataset.idTarea = tarea.id;
            btnEliminarTarea.textContent = 'Eliminar';
            btnEliminarTarea.ondblclick = () => confirmarElminarTarea({ ...tarea });

            opcinesDiv.appendChild(btnEstadoTarea);
            opcinesDiv.appendChild(btnEliminarTarea);
            contenedorTarea.appendChild(nombreTarea);
            contenedorTarea.appendChild(opcinesDiv);
            const listadoTareas = document.querySelector('#listado_tareas');
            listadoTareas.appendChild(contenedorTarea);
        })
    }
    function mostrarFormulario(editar = false, tarea = {}) {
        const modal = document.createElement('DIV');
        modal.classList.add('modal');
        modal.innerHTML = `
            <form class="formulario nueva-tarea">
                <legend>${editar ? 'Editar tarea' : 'Añade una nueva tarea '}</legend>
                <div class="campo">
                    <label>Tarea</label>
                    <input type = "text"  name="tarea" 
                    placeholder="${tarea.nombre ? "Edita la tarea" : "Añadir Tarea al Proyecto Actual"}" id = "tarea" value= "${tarea.nombre ? tarea.nombre : ''}"/>
                </div>
                <div class="opciones">
                    <input type ="submit" class="submit-nueva-tarea" value="${tarea.nombre ? "Edita tarea" : "Añadir tarea"}" />
                    <button type = "button" class ="cerrar-modal" >Cancelar</button>
                </div>
            </form>`;

        setTimeout(() => {
            const formulario = document.querySelector('.formulario');
            formulario.classList.add('animar');
        }, 0);
        modal.addEventListener('click', e => {
            e.preventDefault();
            if (e.target.classList.contains('cerrar-modal')) {
                const formulario = document.querySelector('.formulario');
                formulario.classList.add('cerrar');
                setTimeout(() => modal.remove(), 500);
            }
            if (e.target.classList.contains('submit-nueva-tarea')) {
                const nombreTarea = document.querySelector('#tarea').value.trim();
                if (nombreTarea === '') {
                    mostrarAlerta('El nombre de la tarea es obligatorio', 'error', document.querySelector('.formulario legend'));
                    return;
                }
                if (editar) {
                    tarea.nombre = nombreTarea;
                    actualizarTarea(tarea)
                } else agregarTarea(nombreTarea);
            }
        });
        document.querySelector('.dashboard').appendChild(modal);

    }
    function totalPendiente() {
        const totalPendiente = tareas.filter(tarea => tarea.estado === "0");
        const pendientesRadio = document.querySelector('#pendientes');
        if (totalPendiente.length === 0) pendientesRadio.disabled = true;
        else pendientesRadio.disabled = false;
    }
    function totalCompletas() {
        const totalCompletas = tareas.filter(tarea => tarea.estado === "1");
        const completadasRadio = document.querySelector('#completadas');
        if (totalCompletas.length === 0) completadasRadio.disabled = true;
        else completadasRadio.disabled = false;
    }
    function mostrarAlerta(mensaje, tipo, referencia) {
        const alertaPrevia = document.querySelector('.alertas');
        if (alertaPrevia) alertaPrevia.remove();
        const alerta = document.createElement('DIV');
        alerta.classList.add('alertas', tipo);
        alerta.textContent = mensaje;
        referencia.parentElement.insertBefore(alerta, referencia.nextElementSibling);
        setTimeout(() => alerta.remove(), 5000);
    }


    async function agregarTarea(tarea) {
        const datos = new FormData();
        datos.append('nombre', tarea);
        datos.append('proyectoId', obtenerProyecto());
        try {
            const url = 'http://localhost:3000/api/tarea';
            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            })
            const resultado = await respuesta.json();
            mostrarAlerta(resultado.mensaje, resultado.tipo, document.querySelector('.formulario legend'));
            if (resultado.tipo === 'exito') {
                const modal = document.querySelector('.modal');
                setTimeout(() => modal.remove(), 3000);
                const tareaOb = {
                    id: String(resultado.id),
                    nombre: tarea,
                    estado: "0",
                    proyectoId: resultado.proyectoId
                }
                tareas = [...tareas, tareaOb];
                mostrarTareas();
            }
        } catch (error) {
            console.log('error');
        }
    }
    function cambiarEstadoTarea(tarea) {
        const nuevoEstado = tarea.estado === "1" ? "0" : "1";
        tarea.estado = nuevoEstado;
        actualizarTarea(tarea);
    }
    async function actualizarTarea(tarea) {
        const { estado, id, nombre, proyectoId } = tarea;
        const datos = new FormData();
        datos.append('id', id);
        datos.append('nombre', nombre);
        datos.append('estado', estado);
        datos.append('proyectoId', obtenerProyecto());

        try {
            const url = 'http://localhost:3000/api/tarea/actualizar';

            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            });
            const resultado = await respuesta.json();
            if (resultado.repuesta.tipo === 'exito') {

                Swal.fire(
                    resultado.repuesta.mensaje,
                    resultado.repuesta.mensaje,
                    'success'
                );
                const modal = document.querySelector('.modal');
                if (modal)
                    modal.remove();

                tareas = tareas.map(tareaMemoria => {
                    if (tareaMemoria.id === id) {
                        tareaMemoria.estado = estado;
                        tareaMemoria.nombre = nombre;
                    }
                    return tareaMemoria;
                });
                mostrarTareas(tareas);
            }
        } catch (error) {
            console.log(error);
        }

    }
    function confirmarElminarTarea(tarea) {
        Swal.fire({
            title: '¿Eliminar tarea?',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) eliminarTarea(tarea)
        })
    }
    async function eliminarTarea(tarea) {
        const { estado, id, nombre } = tarea;
        const datos = new FormData();
        datos.append('id', id);
        datos.append('nombre', nombre);
        datos.append('estado', estado);
        datos.append('proyectoId', obtenerProyecto());
        try {
            const url = 'http://localhost:3000/api/tarea/eliminar';
            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            });
            const repuesta = await respuesta.json();
            if (repuesta.resultado) {

                Swal.fire('Eliminado!', repuesta.mensaje, 'success');
                tareas = tareas.filter(tareaMemoria => tareaMemoria.id != id);
                console.log(id);
                mostrarTareas();
            }


        } catch (error) {

        }
    }
    function obtenerProyecto() {
        const proyectoParams = new URLSearchParams(window.location.search);
        const proyecto = Object.fromEntries(proyectoParams.entries());
        return proyecto.id;
    }
    function limpiarTareas() {
        const listadoTareas = document.querySelector('#listado_tareas');
        while (listadoTareas.firstChild) {
            listadoTareas.removeChild(listadoTareas.firstChild);
        }
    }
})();