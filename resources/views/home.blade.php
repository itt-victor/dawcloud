<!DOCTYPE html>
<html lang="en-us">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Daw Cloud</title>
        <link rel="icon" href="favicon.ico" type="image/x-icon"/>
        <link rel="stylesheet" type="text/css" href="css/app.css"/>

    </head>
    <body class="antialiased">
        <div id="user-window" style="display: none; visibility: hidden;">
            <form id="user login">
                @csrf
                <input type="email" placeholder="Type your user e-mail">
                <input type="text" placeholder="Password">
                <button type="submit">Log In!</button>
            </form>
            <button id="register">Sign In!</button>
        </div>

    </body>
</html>
