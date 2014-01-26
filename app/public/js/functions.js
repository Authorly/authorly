$(document).ready(function() {

var transitionEnd = "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd";

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

/* pop up info along with string text arg */
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

/* Read button click hover function */
$(".read_our_btn").click(function(){
	pop_up_info('Coming soon!');
}).hover(function(){
	$(this).addClass('read_our_focus');
},function(){
	$(this).removeClass('read_our_focus');
});

/* Menu login button hover function */
$(".menu_log_in").hover(function(){
	$(this).addClass('menu_log_in_hover');
},function(){
	$(this).removeClass('menu_log_in_hover');
});


/* faq simple navigation */
$(".faq li, .faq_backTop").click(function(e){
	e.preventDefault();
	var where_to = $(this).html(); //takes table-of-contents position text and compares it with h2 and h3 text below
	where_to = $("h2:contains("+where_to+"), h3:contains("+where_to+")").offset().top;

	// for Back to top btn or any button, which hasn't got it's relative in h2, h3 - going back to top.
	if (where_to == 0) {
		where_to = $("#cover_wrapper").offset().top;
	}
	//navigates to particular section
	$("html, body").animate({ scrollTop: where_to });
});


/* determines color of info text */
var invalid_col = "#d6220a", valid_col = "#468c13";


/* contact form validation function */
$("#sign-up-submit").click(function(e){
	e.preventDefault();
	$("#invalid_text, .invalid_form, #invalid_email").removeClass("fadeIn").removeAttr("style");
	var valid = true;
	var which_field = [];
	if (valid) {
    $("#sign-up-submit").val('Submitting...').prop('disabled', true);
    $.post('/users.json', {
      user: {
        name: $('#name').val(),
        email: $('#email').val()
      }
    }, 'json').done(function (data) {
      console.log(data);
      if (data['error'] == 'oops') {
        window.toastr.options = { 'positionClass': 'toast-top-full-width' };
        window.toastr['error']('', 'This email is already in use.');
      } else {
        window.location.href = "/thankyou.html"
      }
    });
	} else {
		which_field[which_field.length - 1] = which_field[which_field.length - 1].slice(0, -2);
		//compose text of invalid form names
		if (which_field.length > 1) {
			which_field[which_field.length - 2] = which_field[which_field.length - 2].slice(0, -2);
			which_field.splice(which_field.length - 1, 0, "and");
		}

		if (which_field.length === 4) {
			which_field[1] = which_field[1] + ',';
		}
		var err_text = "";
		//compose array of empty fields names into error text string
		for (var i = 0; i < which_field.length; i++) {
			err_text += which_field[i]+" ";
		}

		$('#invalid_text').css({color: invalid_col}).text("Please fill out these fields: " + err_text).addClass("fadeIn");

		return false;
  }
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
    $.post('/users', form_parent.serialize(), function (data) {
      $('.close_login').trigger('click')
      pop_up_info("Thank you for Signing Up!<br>Your Username &amp; Password will be emailed as soon as we are ready for you.")
    });
	});
}

/* iPad video controls */
var myVideo=document.getElementById("video1");

$('.video_control .general_btn').click(function(e){
	window.kissmetrics.trackEvent('Played demo video');

    e.preventDefault();

	$(this).parent().fadeOut('fast', function(){
		$(this).addClass("compact_control");
		$(".sp_ipad video").mousemove(function(){
			$(".compact_control").fadeIn('fast')
			setTimeout(function(){
				$(".compact_control").fadeOut('slow')
			}, 4000);
		});
	}
	);

	if (myVideo.paused) {
		$(this).addClass('pauseVidBtn');
	  myVideo.play();
	  }
	else {
		$(this).removeClass('pauseVidBtn');
	  myVideo.pause();
	}
});

/* Hover effect on Sign Up chalkboard button */
$(".no-touch .sp_chalkboard a").hover(function(){
	$(this).find('span').css({width:0})
	$(this).find('.first_underline')
		.stop()
		.animate({width: 100 + "%"},400)
		.siblings()
		.delay(300)
		.animate({width:100 + "%"},400);
}, function(){
	$(this).find('span').css({width:100 + "%"});
});

/* Carousel */
var authorlyMadeCarousel = new function() {
	// Variables
	var howManyBooks = $(".books_set").length,
		bookSetNo = 0;

	$(".books_set").css({width: 100 / howManyBooks + "%"});

	$('#books_set_wrapper').css({width:howManyBooks * 100  + "%"});

	// Setting  initial height for carousel viewport (based on first books set)
	$("#carousel_viewport").css({height:$(".books_set:eq(0)").css('height')});

	// Adjusting viewport's height when resizing
	$(window).resize(function(){
		$("#carousel_viewport").css({height:$(".books_set:eq(0)").css('height')});
	});

	// Some css books formatting for keeping layout in whole piece
	$(".books_set").each(function(){
		$(this).find('div').eq(2).css({clear:'left'});
	});
	$(".books_set div:even").addClass('even_thumbnail');
	$(".books_set div:odd").addClass('odd_thumbnail');

	// If there's only one books set (one page), hide navigation
	if (howManyBooks == 1) {
		$(".next_book_btn, .prev_book_btn").css({display:'none'});
	}

	// Setting btns behaviour
	$(".next_book_btn").click(function(e){
		e.preventDefault();
		bookSetNo ++;
		authorlyMadeCarousel.btnLookReset();
		//if scrolling reaches it's boundaries, stop!
		if (bookSetNo > howManyBooks - 1) {
			bookSetNo = howManyBooks - 1;
			return false
		}
		authorlyMadeCarousel.bookAnim();
	});

	$(".prev_book_btn").click(function(e){
		e.preventDefault();
		bookSetNo --;
		authorlyMadeCarousel.btnLookReset();
		//if scrolling reaches it's boundaries, stop!
		if (bookSetNo < 0) {
			bookSetNo = 0;
			return false
		}
		authorlyMadeCarousel.bookAnim();
	});

	// Resetting look of buttons
	this.btnLookReset = function() {
		$(".next_book_btn, .prev_book_btn").removeClass('book_btn_end');

		if (bookSetNo <= 0) {
			$(".prev_book_btn").addClass('book_btn_end');
		}
		if (bookSetNo >= howManyBooks - 1 ) {
			$(".next_book_btn").addClass('book_btn_end');
		}
	}

	// Method responsible for css animation
	this.bookAnim = function() {

		// Get margin-left offset (used in animation)
		var leftPos = bookSetNo * -100;

		// Get next/prev books set's height
		var booksSetHeight = $('.books_set').eq(bookSetNo).css('height');

		// Use CSS transitions when possible
		if ($('html').hasClass('csstransitions')) {
			$("#books_set_wrapper").css({marginLeft: leftPos + "%"});
			$("#carousel_viewport").css({height:booksSetHeight});
		}
		else {
			// Otherwise use jquery animate method
			$("#books_set_wrapper").animate({marginLeft: leftPos + "%"},500);
			$("#carousel_viewport").animate({height:booksSetHeight});
		}
	}

	//setting button look on startup
	this.btnLookReset();
}
});