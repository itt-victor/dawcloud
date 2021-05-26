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
        <h1 id="page-title" class="h1 center">daw Cloud</h1>
        <div id="user-window">
            <form id="user_signup">
                <p>Create account. It's free</p>
                @csrf
                <label for="signup_email">Email</label>
                <input type="email" id="signup_email" name="signup_email" autocomplete="off">
                <label for="signup_username">User Name</label>
                <input type="text" id="signup_username" name="signup_username" autocomplete="off">
                <label for="signup_password">Password</label>
                <input type="text" id="signup_password" name="signup_password" autocomplete="off">
                <button id="register" type="submit">Sign Up!</button>
            </form>
            <form id="user_login">
                <p>Log in to daw Cloud</p>
                @csrf
                <label for="login_email">Email</label>
                <input type="email" id="login_email" name="login_email" autocomplete="off">
                <label for="login_password">Password</label>
                <input type="text" id="login_password" name="login_password" autocomplete="off">
                <button id="login" type="submit">Log In!</button>
            </form>

        </div>
        <a href={{ route('app') }} id="startunsigned" name="startunsigned" class="startunsigned">Start daw Cloud without account</a>
        <script type="text/javascript" src="js/home.js"></script>
    </body>
</html>
