const movilMenuBtn=document.querySelector("#mobile-menu"),sidebar=document.querySelector(".sidebar"),cerrarMenuBtn=document.querySelector("#cerrar-menu");movilMenuBtn&&movilMenuBtn.addEventListener("click",(function(){sidebar.classList.add("mostrar")})),cerrarMenuBtn&&cerrarMenuBtn.addEventListener("click",(function(){sidebar.classList.add("ocultar"),setTimeout(()=>{sidebar.classList.remove("mostrar"),sidebar.classList.remove("ocultar")},1e3)}));const anchoPantalla=document.body.clientWidth;window.addEventListener("resize",(function(){anchoPantalla>=768&&(sidebar.classList.remove("mostrar"),sidebar.classList.remove("ocultar"))}));