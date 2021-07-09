<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

use App\Models\Project;
use App\Models\Recording;

class ProjectController extends Controller
{

    public function app()
    {
        if (Auth::check()) {
            $projects = Project::where('user_id', Auth::user()->id)
                ->pluck('project_name');

            return view('app', ['projects' => $projects]);
        }

        return view('app');
    }

    public function appUnsigned(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return view('app');
    }

    public function newProject(Request $request)
    {
    }

    public function saveSound(Request $request)
    {
        $file_name = Recording::firstWhere('file_name', $request->input('filename'))
            ? $request->input('filename')
            : basename($request->file('audio-file')->store('public/recordings'));

        $recording_id = $request->input('recording_id');

        $project_id = $request->has('project_name')
            ? Project::where('project_name', $request->input('project_name'))
            ->pluck('id')
            ->first()
            : null;

        Recording::updateOrCreate(
            ['recording_id' => $recording_id, 'file_name' => $file_name],
            ['project_id' => $project_id]
        );

        return $file_name;
    }

    public function saveProject(Request $request)
    {
        $projectname = $request->input('project-name');
        $project_data = $request->input('project');

        Project::updateOrCreate(
            ['user_id' => Auth::user()->id, 'project_name' => $projectname],
            ['json_data' => $project_data]
        );
    }

    public function loadProject($project_name)
    {
        $project_data = Project::where('user_id', Auth::user()->id)
            ->where('project_name', $project_name)
            ->pluck('json_data')
            ->first();

        return $project_data;
    }

    public function loadSound($file_name)
    {
        $file = Storage::get('public/recordings/' . $file_name);
        return response($file);
    }

    public function deleteProject(Request $request)
    {
        $project_name = $request->input('project');
        $project_id = Project::where('project_name', $project_name)
            ->pluck('id')
            ->first();
        $recordings = Recording::where('project_id', $project_id)
            ->get();

        foreach ($recordings as $recording) {
            Storage::delete('public/recordings/' . $recording->file_name);
            $recording->delete();
        }

        Project::where('user_id', Auth::user()->id)
            ->where('project_name', $project_name)
            ->delete();
    }
}
