$(document).ready(function() {

var transitionEnd = "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd";

//if theres any video to be played, use popcorn.js
if ($('#video').length>0) {
	var example = Popcorn.vimeo(
			'#video',
			'http://vimeo.com/18167652');


	$('.ipad_showcase').append('<span class="video_bg"></span>');

	$('.play_btn').click(function(){
		example.play();
		$(".video_bg, .play_btn").css({display:'none'});

	}).hover(function(){
		$(".video_bg").text("Play video");
	},function(){
		$(".video_bg").text("");
	});
}


$(".menubtn").click(function(){
	$("nav ul").toggleClass('slideDown');
	$(this).addClass('menu_pull_down').bind(transitionEnd,function(){
		$(this).unbind(transitionEnd).removeClass('menu_pull_down');
	});
}).hover(function(){
	$(this).addClass('menu_pull_down');
},function(){
	$(this).removeClass('menu_pull_down');
});

//pop up info along with string text arg
function pop_up_info(str_info) {
	//pop up box wrapper with box and all other informations, along with behaviour (close btn)
	var pop_up_coming = $('<div/>', {'class':'pop_up_box_wrapper'}).append(
							$('<div/>', {'class': 'pop_up_box'}).append(
								$('<span/>', {'class': 'close_btn close_login','html':'Close pop up'}).click(function(){
									$('.pop_up_box_wrapper').removeClass('fadeIn');
									$('.pop_up_box').removeClass('pop_up_show').bind(transitionEnd, function(){
										$(this).unbind(transitionEnd);
										$('.pop_up_box_wrapper').remove();
										});
									})
							).append(
								$('<p/>', {'html': str_info})
							));
	//adding box wrapper variable (defined above) to body
	$("body").append(pop_up_coming);
	//fix for animation
	setTimeout(function(){
		$('.pop_up_box').addClass('pop_up_show');
		$('.pop_up_box_wrapper').addClass('fadeIn');
	},10);
}


//read button click hover function
$(".read_our_btn").click(function(){
	pop_up_info('Coming soon!');
}).hover(function(){
	$(this).addClass('read_our_focus');
},function(){
	$(this).removeClass('read_our_focus');
});

//menu login button hover function
$(".menu_log_in").hover(function(){
	$(this).addClass('menu_log_in_hover');
},function(){
	$(this).removeClass('menu_log_in_hover');
});


//fading in sign form function – loads login div from login.html
$(".menu_log_in, .try_button, .create_app_btn").click(function(){

	//temporaily information
	pop_up_info('Registration will be available on 27th of&nbsp;February');

	//uncomment if login functionality is on
	/*
	$('body').append('<div class="log_in_overlay"></div>','<div class="log_in_div"></div>');
	$('.log_in_div').load('login.html .log_in_form', function(){
		var form_height=$(window).scrollTop();
		$(".log_in_form").css({top:form_height+50}).addClass('fadeIn');
		$(".log_in_overlay").css({top:0}).addClass('fadeIn');
		//after login.html elemenent has been loaded, add click functionality
		//fading out sign in form function
		$(".log_in_form .close_login, .log_in_overlay").click(function() {
			$(".log_in_form").removeAttr('style').removeClass('fadeIn');
			$(".log_in_overlay").removeAttr('style').removeClass('fadeIn');
			setTimeout(function(){
				$('.log_in_overlay, .log_in_div').remove();
			},600);
		});
		validateLogin();
	});
	*/
});

//faq simple navigation
$(".faq li").click(function(){
	var where_to = $(this).html(); //takes table-of-contents position text and compares it with h2 and h3 text below
	where_to = $("h2:contains("+where_to+"), h3:contains("+where_to+")").offset().top;
	//navigates to particular section
	$(window).scrollTop(where_to);
});


var invalid_col = "#d6220a", valid_col = "#468c13"; //determines color of info text

//contact form validation function
$("#send_message").click(function(e){
	e.preventDefault();
	$(".invalid_text, .invalid_form").removeClass("fadeIn").removeAttr("style");
	var valid = true;
	var which_field = [];
	$("#contact-form input, #contact-form textarea").not("#valid").each(function(){
		//if value is empty, form isn't valid. Fade in invalid icon and add to "which_field" var name of field
		if (!$(this).val()) {
			valid = false;
			$(this).prev().addClass('fadeIn');
			which_field.push($(this).attr("name")+", ");
			//which_field += $(this).attr("name") + ", ";
		}
	});
	if (!valid) {
		var fields_text = " field";
		which_field[which_field.length-1]= which_field[which_field.length-1].slice(0,-2);
		//compose text of invalid form names
		if (which_field.length>1) {
			which_field[which_field.length-2]= which_field[which_field.length-2].slice(0,-2);
			which_field.splice(which_field.length-1, 0, "and");
			fields_text = " fields";
		}
		var err_text = "";
		//compose array of empty fields names into error text string
		for (var i=0; i < which_field.length; i++) {
			err_text += which_field[i]+" ";
		}
		$(".invalid_text").css({color:invalid_col}).text("Oops! You left "+err_text+fields_text+" blank.").addClass("fadeIn");
		return false;
	}


	//make ajax request!
	//after success you can place
	//$(".invalid_text").css({color:valid_col}).text("Message has been sent!.").addClass("fadeIn");
});

function validateLogin() {
	//sign in/register validation function
	$('#sign_in_btn, #register_btn').click(function(e){
		e.preventDefault();
		var form_parent = $(this).parent();
		var valid = true;
		//resets invalid text
		form_parent.find('.invalid_text').removeClass("fadeIn").removeAttr("style");
		form_parent.find('input').each(function(){
			if (!$(this).val()) {
				valid=false;
			}
		});
		if (!valid) {
			form_parent.find('.invalid_text').css({color:invalid_col}).text("Please fill out all fields").addClass("fadeIn");
			return false;
		}


		//if verification is okay, fire away! ajax or anything

	});
}
//ipad closing button - for book showcase
$(".ipad_showcase .close_ipad").click(function() {
	returnBooks();
	closeShowcase();
});

//function of returning books to shelf - needed for book animation
function returnBooks() {
	//checks if any book is pulled out
	$(".books li").each(function(){
		var pulled_book = $(this);
		if (pulled_book.hasClass('pullout')) {
			//if any book is being pulled out, it hides book
			pulled_book.removeClass('focus');
			setTimeout(function(){
				pulled_book.removeAttr('style').removeClass("pullout");
			}, 700);
			return;
		}
	});
}

//function of ending whole book-ipad showcase
function closeShowcase() {
	//ends book showcase by fading out iPad
	example.pause();
	$(".book_showcase_overlay").removeClass('fadeIn');
	$(".ipad_showcase").removeClass('fadeIn').bind(transitionEnd, function(){
		//hides invisible ipad in order to prevent clicking on it (display none didn't work)
		$(this).css({top:'-999%'}).unbind(transitionEnd);
		$(".book_showcase_overlay").remove();
	});
}

//books animation function
$(".books li").click(function(){

	if ($(".book_showcase_overlay").length < 1){
		var scrollTop = $(window).scrollTop();
		//initializes by detecting if background for books was initated
		$(".ipad_showcase").css({top:scrollTop+50}).addClass("fadeIn");
		//creates invisible background (if there isn't any)
		var books_shwcase = $("<span />",{class: 'book_showcase_overlay'}).click(function(){
			returnBooks();
			closeShowcase();
		});
		$('.ipad_showcase').before(books_shwcase);
		//animation fix
		setTimeout(function(){
			$(".book_showcase_overlay").addClass("fadeIn");
		},10);
		

	}
	
	//hides book button
	if ($(".book_btn").length > 0){
		//if there's "Click on a book!" button, fadeout and remove it
		$(".book_btn").addClass('fadeOut');
		setTimeout(function(){$(".book_btn").remove();}, 700);
	}

	returnBooks();

	var book = $(this);

	if (book.hasClass('pullout')) {
		/*
		if clicked book was pulled out, it returns to shelf by "each"
		function. To avoid being pulled out once more, this function
		should be finished right now.
		*/
		closeShowcase(); //<- removes ipad and other things
		return;
	}

	//pulls out book
	book.addClass('pullout');
	
	if (!book.hasClass('book3') && $('.ipad_showcase p').length<1) {
		$('.ipad_showcase').append('<p>Coming soon. Play the demo for Stranger in the Woods</p>');
	}
	else if (book.hasClass('book3'))  {
		$('.ipad_showcase p').remove();
	}

	setTimeout(function(){
		book.css({zIndex:50}).addClass("focus");
	}, 700);
});
});