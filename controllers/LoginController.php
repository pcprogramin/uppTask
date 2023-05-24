<?php

namespace Controllers;

use Classes\Email;
use Model\Usuario;
use MVC\Router;

class LoginController
{
    public static function login(Router $router)
    {
        $alertas= [];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auth = new Usuario($_POST);
            $alertas = $auth->validarLogin();
            if(empty($alertas)){
                $usuario = Usuario::where('email',$auth->email);
                if($usuario && $usuario->confirmado==='1'){
                    if(password_verify($auth->password,$usuario->password)){
                        session_start();
                        $_SESSION['id']=$usuario->id;
                        $_SESSION['nombre']=$usuario->nombre;
                        $_SESSION['email']=$usuario->email;
                        $_SESSION['login']=true;
                        header('Location: /dashboard');
                    }else{
                        Usuario::setAlerta('error','El Password Incorrecto');
                    }
                }else{
                    Usuario::setAlerta('error','El usuario no existe o no esta confirmado');
                }
            }
          $alertas= Usuario::getAlertas();

        }
        $router->render('auth/login', [
            'titulo' => 'Iniciar Sesión',
            'alertas' => $alertas
        ]);
    }
    public static function logout()
    {
       session_start();
       $_SESSION=[];
       header('Location:/');
    }
    public static function crear(Router $router)
    {
        $usuario = new Usuario;
        $alertas = [];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario->sincronizar($_POST);
            $alertas = $usuario->validarNuevaCuenta();
            if (empty($alertas)) {
                $existeUsuario = Usuario::where('email', $usuario->email);
                if ($existeUsuario) {
                    Usuario::setAlerta('error', 'El Usuario ya esta registrado');
                    $alertas = Usuario::getAlertas();
                } else {
                    $usuario->hashPassword();
                    unset($usuario->password2);
                    $usuario->crearToken();
                    $resultado = $usuario->guardar();

                    $meail = new Email($usuario->email, $usuario->nombre, $usuario->token);

                    $meail->enviarConfirmacion();
                    if ($resultado) {
                        header('Location:/mensaje');
                    }
                }
            }
        }
        $router->render('auth/crear', [
            'titulo' => 'Crear tu cuenta en upTask',
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);
    }
    public static function olvide(Router $router)
    {
        $alertas = [];
    
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario = new Usuario($_POST);
            $alertas = $usuario->validarEmail();

            if (empty($alertas)) {
                $usuario = Usuario::where('email', $usuario->email);
                if ($usuario && $usuario->confirmado === "1") {
                    $usuario->crearToken();
                    unset($usuario->password2);
                    $usuario->guardar();
                    $meail = new Email($usuario->email, $usuario->nombre, $usuario->token);
                    $meail->enviarInstrucciones();
                    Usuario::setAlerta('exito', "Hemos Enviado las intrucciones a tu email");
                } else {
                    Usuario::setAlerta('error', 'El usuario no existe o no esta confirmado');
                }
            }
        }
        $alertas = Usuario::getAlertas();
        $router->render('auth/olvide', [
            'titulo' => 'Olvide mi Password',
            'alertas' => $alertas,
        ]);
    }
    public static function reestablecer(Router $router)
    {
        $alertas=[];
        $mostrar = true;
        $token = s($_GET['token']);
        if(!$token) header('Location: /');
        $usuario = Usuario::where('token',$token);
        if(empty($usuario)){
            Usuario::setAlerta('error','Token no válido');
            $mostrar=false;
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario->sincronizar($_POST);
            $alertas = $usuario->validarPassword();
            if(empty($alertas)){
                $usuario->hashPassword();
                unset($usuario->password2);
                $usuario->token=null;
                $resultado= $usuario->guardar();
                if($resultado){
                    header('Location: /');
                }
            }
        }
        $alertas = Usuario::getAlertas();

        $router->render('auth/reestablecer', [
            'titulo' => 'Olvide mi Password',
            'alertas'=> $alertas,
            'mostrar'=>$mostrar
        ]);
    }
    public static function confirmar(Router $router)
    {
        $token  = s($_GET['token']);
        if (!$token) header('Location: /');

        $usuario = Usuario::where('token', $token);
        if (empty($usuario)) {
            Usuario::setAlerta('error', 'Token no válido');
        } else {
            $usuario->confirmado = 1;
            $usuario->token = null;
            unset($usuario->password2);
            $usuario->guardar();

            Usuario::setAlerta('exito', 'Cuenta Comprobada Correctamente');
        }
        $alertas = Usuario::getAlertas();
        $router->render('auth/confirmar', [
            'titulo' => 'Confirma tu cuenta Task',
            'alertas' => $alertas
        ]);
    }
    public static function mensaje(Router $router)
    {

        $router->render('auth/mensaje', [
            'titulo' => 'Cuenta Creada',
        ]);
    }
}
