<h1>Daw Cloud</h1>

<h2>Manual de despliegue de la aplicación</h2>

A continuación, se detalla el software necesario, junto a las recomendaciones o elecciones que han sido escogidas en este proyecto:
-	Servidor web: Apache<br>
https://www.apachelounge.com/download/VS16/binaries/httpd-2.4.48-win64-VS16.zip 
-	Base de datos: MySQL       <br>
https://downloads.mysql.com/archives/get/p/23/file/mysql-8.0.23-winx64.zip 
-	PHP  <br>
https://windows.php.net/download#php-8.0 
-	Node.js<br>
https://nodejs.org/dist/v14.17.0/node-v14.17.0-win-x64.zip 
-	Composer     <br>
https://getcomposer.org/download/
-	Laragon <br>
https://github.com/leokhoa/laragon/releases/download/5.0.0/laragon-wamp.exe 

<p>En primer lugar, y como recomendación por facilidad de uso, debe configurarse Laragon para que llame a iniciarse con Apache y MySQL, cargando PHP y Node.js; es tan sencillo como introducir los directorios de las 4 aplicaciones en el directorio “bin” de Laragon. </p>
<p>Acto seguido, se deben de habilitar las siguientes extensiones de PHP, fácilmente a través del menú de opciones de laragon: <br>
Curl, fileinfo, gd, mbstring, mysqli, pdo_mysql</p>

<p>Se clona este repositorio dentro del directorio “www” de Laragon.</p>
<p>Desde un terminal de commandos, se hace “cd” al directorio donde se encuentra el proyecto, y se ejecutan los siguientes comandos: <br>
composer install    <br>
#se instalan las dependencias requeridas por el proyecto<br>
npm install         <br>
#se instalan los módulos requeridos<br>
cp .env.example .env <br>
#se genera un nuevo fichero env donde se almacena la configuración del proyecto<br>
php artisan key:generate<br>
#se genera una nueva clave de encriptación<br></p>

<p>A continuación, se crea una nueva base de datos vacía en MySQL, y se conecta al proyecto, editando los campos DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, y DB_PASSWORD en el fichero .env</p>
<p>Por último, se crean las tablas con el siguiente comando:<br>
php artisan migrate</p>

