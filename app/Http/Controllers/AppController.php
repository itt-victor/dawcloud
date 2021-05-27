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

    public function saveProject(Request $request)
    {
        $projectname = $request->input('project-name');
        $project = $request->input('project');
        $filename = 'public/projects/'. $projectname . '/' . $projectname .'.json';

		$search = DB::table('projects')
		    ->where('project_name', $projectname)
			->where('user_id', '1')
			->first();

		if ($search == null) {
			DB::table('projects')->insert([
	            'project_name' => $projectname,
	            'json_data' => json_encode($project),
	            'user_id' => '1',
				'created_at' => now()
	        ]);
		} else {
			DB::table('projects')
				->where('project_name', $projectname)
				->where('user_id', '1')
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
        $file = Storage::get('public/projects/'. $project . '/'.$recording.'.wav');

        return response($file);
    }

	public function signup(Request $request){

        $errors = new \Illuminate\Support\MessageBag;
		$email = $request->input('signup_email');
        $user_name = $request->input('signup_username');
        $password = $request->input('signup_password');

		$user = DB::table('users')
		    ->where('user_name', $user_name)
			->where('email', $email)
			->where('password', $password)
			->first();

		if ($user !== null) {
			$errors->add('Account already exists', 'The data provided already exists in the database!');
			$redirect = view('home')->withErrors($errors);
		} else {
			$user_id = DB::table('users')->insertGetId([
				'user_name' => $user_name,
				'email' => $email,
				'password' => Hash::make($password),
				'created_at' => now(),
				'updated_at' => now()
			]);

			$redirect = redirect('/app?user='.$user_name);

		}
		return $redirect;
    }

}
