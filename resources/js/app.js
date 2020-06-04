require('./bootstrap');


import Echo from "laravel-echo"

window.io = require('socket.io-client');

window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: window.location.hostname + ':6001'
});



let onlineUserLength = 0;


window.Echo.join(`online`)
    .here((users) => {

    	onlineUserLength = users.length;

    	if(users.length > 1)
    	{

    	$('#no-users').css('display', 'none');

    	}

    	let userId = $('meta[name=user-id]').attr('content');


    	users.forEach( function(user) {

    		if(user.id == userId)
    		{
    			return;
    		}

    		$('#online-users').append(`<li id="user-${user.id}" class="list-group-item"><i class="fa fa-circle text-success"></i>  ${user.name}</li>`);

    	});




    })
    .joining((user) => {

    	onlineUserLength++

    	$('#no-users').css('display', 'none');

		$('#online-users').append(`<li id="user-${user.id}" class="list-group-item"><i class="fa fa-circle text-success"></i>  ${user.name}</li>`);


    })
    .leaving((user) => {

    	onlineUserLength--

    	if (onlineUserLength == 1) {

    	$('#no-users').css('display', 'block');

    	}

    	$('#user-' + user.id).remove();

    });


    $('#chat-text').keypress(function(e) {

    	if(e.which == 13){


    		e.preventDefault();

    		let body = $(this).val();
    		let url = $(this).data('url');
    		let userName = $('meta[name=user-name]').attr('content');

    		$(this).val('');

    		//About Sender

	$('#chat').append(`


		<div class="mt-4 w-50 text-white p-3 rounded float-right bg-primary" >
				
			<p style="color:yellow">${userName}</p>
			<p>${body}</p>

			</div>
			<div class="clearfix"></div>


		`);
$("#chat").stop().animate({ scrollTop: $("#chat")[0].scrollHeight}, 1);

    		let data = {

    			'_token' : $('meta[name=csrf-token]').attr('content'),
    			'body':body
    		}


    		$.ajax({
    			url: url,
    			method: 'post',
    			data: data

    		})

    	}

    });

window.Echo.channel('chat-group')
    .listen('MessageDelivered', (e) => {

    	//Receiver Part

    	$('#chat').append(`


	<div class="mt-4 w-50 text-white p-3 rounded float-left bg-success" >
			
		<p style="color:yellow">${e.message.user.name}</p>
		<p>${e.message.body}</p>

		</div>
		<div class="clearfix"></div>


		`);
$("#chat").stop().animate({ scrollTop: $("#chat")[0].scrollHeight}, 1);

    });

$("#chat").stop().animate({ scrollTop: $("#chat")[0].scrollHeight}, 1);
