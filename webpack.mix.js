const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.ts('resources/ts/app_core.ts', 'public/js')
    .ts('resources/ts/audio/metronome_worker.ts', 'public/js/workers')
    .ts('resources/ts/ui/draw_worker.ts', 'public/js/workers')
    //.js('resources/js/app_core.js', 'public/js')
    .js('resources/js/home.js', 'public/js')
    .js('resources/js/user_profile.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css')
    .sourceMaps()
    .disableSuccessNotifications()
    .options({ processCssUrls: false })
    .webpackConfig({
        experiments : {
            topLevelAwait: true
        }
    });
