<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;


class AppController extends Controller
{

    public function app()
    {
        return view('app');
    }


    public function saveSound(Request $request)
    {
        $sound = $request->file('audio-blob');
        $id = $request->input('recording-id');
        $projectname = $request->input('project-name');
        Storage::makeDirectory('public/projects/'.$projectname);
        $filename = 'public/projects/' . $projectname . '/' . $projectname . '_' . $id . '.wav';

        if (Storage::exists($filename)) {
            Storage::delete($filename);
        }
        Storage::put($filename, file_get_contents($sound));

    }

    //FALTA QUE SI YA EXISTE ESE PROYECTO, SE HAGA UPDATE AL GUARDAR POR SEGUNDA VEZ
    public function saveProject(Request $request)
    {
        $projectname = $request->input('project-name');
        $project = $request->input('project');
        $filename = 'public/projects/'. $projectname . '/' . $projectname .'.json';

        /*if (Storage::exists($filename)) {
            Storage::delete($filename);
        }
        Storage::put($filename, json_encode($project));*/

        $project = DB::table('projects')->insert([
            'project_name' => $projectname,
            'json_data' => json_encode($project),
            'user_id' => '1' //esto se ha de cambiar según haya usuarios bien
        ]);

    }

    public function loadProject($project)
    {
        //$projectContent = Storage::get('public/projects/'. $project . '/'.$project.'.json');

        $projectContent = DB::table('projects')
                        ->where('project_name', '=', $project)
                        ->pluck('json_data')
                        ->first();

        return response(json_decode($projectContent));
    }

    public function loadSound($project, $recording)
    {
        $file = Storage::get('public/projects/'. $project . '/'.$recording.'.wav');

        return response($file);
    }

}
