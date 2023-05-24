(function () {

    const nuevaTareaBtn = document.querySelector('#agregar_tarea');
    nuevaTareaBtn.addEventListener('click', mostrarFormulario);

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
})();