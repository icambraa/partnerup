La estructura de archivos y carpetas del frontend es la siguiente:

Cada uno de los módulos (components, pero tengo problemas con el refactor de intellij) representa una parte específica de la web. Por ejemplo, el módulo "admin" contiene el panel de 
administrador, mientras que el módulo de "autenticación" incluye la parte correspondiente al 
inicio de sesión y registro. 

El módulo "welcome" abarca lo relacionado con la página de bienvenida, y el módulo más 
importante, "inside", agrupa todas las páginas o componentes que se muestran una vez el usuario ha iniciado sesión.

Dentro del módulo "inside", podemos encontrar los submódulos de "board", "navbar" y "userProfile"
