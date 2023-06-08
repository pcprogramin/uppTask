<?php include_once __DIR__ . '/header-dashboard.php' ?>

    <div class="contenedor-sm">
        <div class="contenedor-nueva-tarea">
            <button type="button" class="agregar-tarea" id="agregar_tarea">
                &#43; Nueva Tarea
            </button>
        </div>
        <div class="filtros" id="filtros">
            <div class="filtros-inputs">
                <h2>Filtros:</h2>
                <div class="campo">
                    <label for="todas">Todas</label>
                    <input type="radio" id="todas" value="" name="filtro" checked >

                </div>
                <div class="campo">
                    <label for="todas">Completadas</label>
                    <input type="radio" id="completadas" value="1" name="filtro" >

                </div>
                <div class="campo">
                    <label for="todas">Pendientes</label>
                    <input type="radio" id="pendientes" value="0" name="filtro" >

                </div>
            </div>
        </div>
        <ul id = "listado_tareas" class="listado-tareas">

        </ul>
    </div>

<?php include_once __DIR__ . '/footer-dashboard.php' ?>

<?php

    $script .= '
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <script src="build/js/tareas.js"></script>
    '
?>