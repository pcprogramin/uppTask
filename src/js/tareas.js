(function () {
    obtenerTareas();

    let tareas = [];

    const nuevaTareaBtn = document.querySelector('#agregar_tarea');
    nuevaTareaBtn.addEventListener('click', mostrarFormulario);
    async function obtenerTareas(){
        try{
            const id= obtenerProyecto();
            const url = `/api/tareas?id=${id}`;
            const respuesta= await fetch(url);
            const resultado = await respuesta.json();
            tareas = resultado.tareas;
            mostrarTareas(tareas);

        }catch(error){
            console.log(error);
        }
    }
    function mostrarTareas(tareas = []){
        limpiarTareas();
        if (tareas.length === 0 ){
            const contenedorTareas = document.querySelector('#listado_tareas');
            const textoNoTareas =document.createElement('LI');
            textoNoTareas.textContent = 'No hay tareas';
            textoNoTareas.classList.add('no-tareas');

            contenedorTareas.appendChild (textoNoTareas);
            return;
        }
        const estados = {
            0:'Pendiente',
            1:'Completa'
        }
        tareas.forEach(tarea=>{
            const contenedorTarea= document.createElement('LI');
            contenedorTarea.dataset.tareaId =  tarea.id;
            contenedorTarea.classList.add('tarea');
            const nombreTarea = document.createElement('P');
            nombreTarea.textContent=tarea.nombre;
            const opcinesDiv= document.createElement('DIV');
            opcinesDiv.classList.add('opciones');
            const btnEstadoTarea = document.createElement('BUTTON');
            btnEstadoTarea.classList.add('estado-tarea');
            btnEstadoTarea.classList.add(`${estados[tarea.estado].toLowerCase()}`)
            btnEstadoTarea.textContent = estados[tarea.estado];
            btnEstadoTarea.dataset.btnEstadoTarea = tarea.estado;

            const btnEliminarTarea = document.createElement('BUTTON');
            btnEliminarTarea.classList.add('eliminar-tarea');
            btnEliminarTarea.dataset.idTarea= tarea.id;
            btnEliminarTarea.textContent = 'Eliminar';

            opcinesDiv.appendChild(btnEstadoTarea);
            opcinesDiv.appendChild(btnEliminarTarea);
            contenedorTarea.appendChild(nombreTarea);
            contenedorTarea.appendChild(opcinesDiv);
            const listadoTareas = document.querySelector('#listado_tareas');
            listadoTareas.appendChild(contenedorTarea);
        })
    }
    function mostrarFormulario() {
        const modal = document.createElement('DIV');
        modal.classList.add('modal');
        modal.innerHTML = `
            <form class="formulario nueva-tarea">
                <legend>Añade una nueva tarea </legend>
                <div class="campo">
                    <label>Tarea</label>
                    <input type = "text"  name="tarea" 
                    placeholder="Añadir Tarea al Proyecto Actual" id = "tarea"/>
                </div>
                <div class="opciones">
                    <input type ="submit" class="submit-nueva-tarea" value="Añadir Tarea" />
                    <button type = "button" class ="cerrar-modal" >Cancelar</button>
                </div>
            </form>`;

        setTimeout(() => {
            const formulario = document.querySelector('.formulario');
            formulario.classList.add('animar');
        }, 0);
        modal.addEventListener('click',e=>{
            e.preventDefault();
            if (e.target.classList.contains('cerrar-modal')){
                const formulario = document.querySelector('.formulario');
                formulario.classList.add('cerrar');
                setTimeout(() => {
             
                    modal.remove();
                    
                }, 500);
            }
            if(e.target.classList.contains('submit-nueva-tarea')){
                submitFormularioNuevaTarea();
            }
        });
        document.querySelector('.dashboard').appendChild(modal);

    }
    function submitFormularioNuevaTarea(){
      const tarea = document.querySelector('#tarea').value.trim();
      if ( tarea === ''){
        mostrarAlerta('El nombre de la tarea es obligatorio','error',document.querySelector('.formulario legend'));
        return;
      }else{
        agregarTarea(tarea);
      }

    } 
    function mostrarAlerta(mensaje,tipo,referencia){
        const alertaPrevia = document.querySelector('.alertas');
        if (alertaPrevia){
            alertaPrevia.remove();
        }
        const alerta = document.createElement('DIV');
        alerta.classList.add('alertas',tipo);
        alerta.textContent=mensaje;
        referencia.parentElement.insertBefore(alerta, referencia.nextElementSibling);
        setTimeout(()=>{
            alerta.remove();
        },5000);
     
        
    }


    async function agregarTarea(tarea){
        const datos = new FormData();
        datos.append('nombre',tarea);
        datos.append('proyectoId',obtenerProyecto());
        try{
            const url = 'http://localhost:3000/api/tarea';
            const respuesta = await fetch(url,{
                method:'POST',
                body: datos
            })
            const resultado = await respuesta.json();
            mostrarAlerta(resultado.mensaje,resultado.tipo, document.querySelector('.formulario legend'));
            if(resultado.tipo === 'exito'){
                const modal = document.querySelector('.modal');
                setTimeout(()=>{
                    modal.remove();
                },3000);
                const tareaOb = {
                    id:String(resultado.id),
                    nombre:tarea,
                    estado:"0",
                    proyectoId: resultado.proyectoId
                }
                tareas =[...tareas, tareaOb];
               mostrarTareas(tareas);
            }
        }catch(error){
            console.log('error');
        }
    }
    function obtenerProyecto(){
        const proyectoParams = new URLSearchParams(window.location.search);
        const proyecto = Object.fromEntries(proyectoParams.entries());
        return proyecto.id;
    }
    function limpiarTareas(){
        const listadoTareas= document.querySelector('#listado_tareas');
        while(listadoTareas.firstChild){
            listadoTareas.removeChild(listadoTareas.firstChild);
        }
    }
})();