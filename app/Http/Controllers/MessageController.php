<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Message;
use App\Events\MessageDelivered;

class MessageController extends Controller
{
    public function __construct()
    {
    	$this->middleware('auth');
    }


	public function index()
	{
		$messages = Message::all();
		return view('messages.index', compact('messages'));
	}


	public function store(Request $request)
	{

		$message = auth()->user()->messages()->create($request->all());

		broadcast(new MessageDelivered($message->load('user')))->toOthers();


	}
}
