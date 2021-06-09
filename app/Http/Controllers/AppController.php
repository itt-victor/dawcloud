<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

use App\Models\Project;

class AppController extends Controller
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

    public function saveSound(Request $request)
    {
        $sound = $request->file('audio-blob');
        $id = $request->input('recording-id');
        $projectname = $request->input('project-name');
        $filename = 'public/projects/' . Auth::user()->email . '/' . $projectname . '/' . $id . '.wav';

        Storage::makeDirectory('public/projects/' . Auth::user()->email . '/' . $projectname);

        if (Storage::exists($filename)) {
            Storage::delete($filename);
        }
        Storage::put($filename, file_get_contents($sound));
    }

    public function saveProject(Request $request)
    {
        $projectname = $request->input('project-name');
        $project_data = $request->input('project');

		$operation = Project::updateOrCreate(
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

    public function loadSound($project_name, $recording)
    {
        $file = Storage::get('public/projects/' . Auth::user()->email . '/' . $project_name . '/' . $recording . '.wav');
        return response($file);
    }

    public function deleteProject(Request $request)
    {
        $project_name = $request->input('project');

        Storage::deleteDirectory('public/projects/' . Auth::user()->email . '/' . $project_name);

        Project::where('user_id', Auth::user()->id)
            ->where('project_name', $project_name)
            ->delete();
    }
}
