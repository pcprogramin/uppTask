const movilMenuBtn = document.querySelector("#mobile-menu");
const sidebar = document.querySelector('.sidebar');
const cerrarMenuBtn = document.querySelector("#cerrar-menu")
if (movilMenuBtn) {
    movilMenuBtn.addEventListener('click', function () {
        sidebar.classList.add('mostrar');
    });
}
if (cerrarMenuBtn) {
    cerrarMenuBtn.addEventListener('click', function () {

        sidebar.classList.add('ocultar');
        setTimeout(() => {
            sidebar.classList.remove('mostrar');
            sidebar.classList.remove('ocultar');
        }, 1000)
    });
}

const anchoPantalla = document.body.clientWidth;

window.addEventListener('resize', function () {
    if (anchoPantalla >= 768) {
        sidebar.classList.remove('mostrar');
        sidebar.classList.remove('ocultar');
    }
})