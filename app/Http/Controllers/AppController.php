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
        $projects = DB::table('projects')
            ->where('user_id', session('user_id'))
            ->pluck('project_name');

        $creation_dates = DB::table('projects')
            ->where('user_id', session('user_id'))
            ->select('created_at')
            ->get();


        return view('app', ['projects' => $projects]);
    }


    public function saveSound(Request $request)
    {
        $sound = $request->file('audio-blob');
        $id = $request->input('recording-id');
        $projectname = $request->input('project-name');
        Storage::makeDirectory('public/projects/' . $projectname);
        $filename = 'public/projects/' . $projectname . '/' . $projectname . '_' . $id . '.wav';

        if (Storage::exists($filename)) {
            Storage::delete($filename);
        }
        Storage::put($filename, file_get_contents($sound));
    }

    public function saveProject(Request $request)
    {
        $projectname = $request->input('project-name');
        $project = $request->input('project');
        $filename = 'public/projects/' . $projectname . '/' . $projectname . '.json';

        $search = DB::table('projects')
            ->where('project_name', $projectname)
            ->where('user_id', session('user_id'))
            ->first();

        if (!$search) {
            DB::table('projects')->insert([
                'project_name' => $projectname,
                'json_data' => json_encode($project),
                'user_id' => session('user_id'),
                'created_at' => now(),
                'updated_at' => now()
            ]);
        } else {
            DB::table('projects')
                ->where('project_name', $projectname)
                ->where('user_id', session('user_id'))
                ->update([
                    'json_data' => json_encode($project),
                    'updated_at' => now()
                ]);
        }
    }

    public function loadProject($project)
    {

        $projectContent = DB::table('projects')
            ->where('project_name', '=', $project)
            ->pluck('json_data')
            ->first();

        return response(json_decode($projectContent));
    }

    public function loadSound($project, $recording)
    {
        $file = Storage::get('public/projects/' . $project . '/' . $recording . '.wav');

        return response($file);
    }
}
