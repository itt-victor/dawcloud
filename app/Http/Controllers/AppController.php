<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;


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

    //Lo siguiente que puedes hacer aquí, es que en vez de guardar el fichero en storage, haces json_decode y metes las cosas en mySQL
    public function saveProject(Request $request)
    {
        $projectname = $request->input('project-name');
        $project = $request->input('project');
        $filename = 'public/projects/'. $projectname . '/' . $projectname .'.json';

        if (Storage::exists($filename)) {
            Storage::delete($filename);
        }
        Storage::put($filename, json_encode($project));
    }

    public function loadProject($project)
    {

        $projectContent = Storage::get('public/projects/'. $project . '/'.$project.'.json');
        return response($projectContent);
    }

    public function loadSound($project, $recording)
    {
        $file = Storage::get('public/projects/'. $project . '/'.$recording.'.wav');
        return response($file);
    }

}
