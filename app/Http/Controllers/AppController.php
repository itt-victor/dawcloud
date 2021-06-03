<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class AppController extends Controller
{

    public function app()
    {
        $signed = true;
        $projects = DB::table('projects')
            ->where('user_id', Auth::user()->id)
            ->pluck('project_name');

        return view('app', ['projects' => $projects, 'signed' => $signed]);
    }

    public function appUnsigned()
    {
        $signed = false;
        return view('app', ['signed' => $signed]);
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

        $search = DB::table('projects')
            ->where('project_name', $projectname)
            ->where('user_id', Auth::user()->id)
            ->first();

        if (!$search) {
            DB::table('projects')->insert([
                'project_name' => $projectname,
                'json_data' => json_encode($project),
                'user_id' => Auth::user()->id,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        } else {
            DB::table('projects')
                ->where('project_name', $projectname)
                ->where('user_id', Auth::user()->id)
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

    public function deleteProject(Request $request)
    {
        $project = $request->input('project');

        DB::table('projects')
        ->where('project_name', '=', $project)
        ->delete();

    }
}
