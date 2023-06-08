<?php include_once __DIR__ . '/header-dashboard.php' ?>
<div class="contenedor-sm">
    <?php include_once __DIR__.'/../templates/alertas.php' ?>
    <a href="/perfil" class="enlace">Volver Perfil</a>
    <form action="" method="POST" class="formulario">
        <div class="campo">
            <label for="">Password Actual:</label>
            <input type="password" value="" name="password_actual" placeholder="Tu Password Actual">
        </div>
        <div class="campo">
            <label for="email">Nueva Password:</label>
            <input type="password" value="" name="password_nuevo" placeholder="Tu Password Nuevo">
        </div>
        <input type="submit" value="Guardar Cambios">

    </form>
</div>


<?php include_once __DIR__ . '/footer-dashboard.php' ?>