/* Cards module */

document.ontouchmove = function(e){ e.preventDefault(); };

var Nav = (function(){
	return {
		start: function() {
			$('section').removeClass('faded');
			$('section[data-id=1]').addClass('faded');
		},
		slide: function(id) {
			var oid = id - 1;
			$('section[data-id=' + oid + ']').removeClass('faded');
			$('section[data-id=' + id + ']').addClass('faded');
		}
	};
})();

var Cards = (function(){
	var i = 0,
		clicked = [],
		clicked_name = false,
		type = false,
		sup_content = false,
		cardtype = [

			{name: 'crown', type: 'normal'},
			{name: 'less_smell', type: 'super', content: 'ls'},
			{name: 'white_sheet', type: 'normal'},
			{name: 'ac', type: 'super', content: 'ac'},
			{name: 'wp', type: 'normal'},
			{name: 'ff', type: 'super', content: 'ff'},
			{name: 'night', type: 'normal'},
			{name: 'vpech', type: 'normal'}

		],
		shuffleCards = [],
		tilesFlipped = 0,
		newCardType = [],
		time = 200,
		speed = 100,
		super_count = 0,
		coolDown = false,
		fail = 0,
		timer_time = 60,
		fail_try = 3,
		touch_allow = true
		interval_allow = true
		interval_stop = false;

	function interval(time) {
		setTimeout(function () {
			interval_allow = true;
	        if(time == 0 || interval_stop) {
				interval_allow = false;
				Cards.bot();
				$('.timer').removeClass('started');
				time = timer_time;
			} else {
				$('.timer').text(time);
				time--;
			}
			if(interval_allow)
			{
				interval(time);
			}
	    }, 1000);
	}

	return {
		init: function() {
			shuffleCards = this.shuffle(cardtype);
			$.each(cardtype, function(index, value) {
				for(var i = 0; i < 2; i++) newCardType.push(value);
			});

			this.shuffle(newCardType);
			$.each(newCardType, function(index, value) {
				$('.cards-block').append('<div class="card flip" data-type="' + value.type + '" data-id="' + value.name + '"><div class="card-front"></div><div class="card-back"><img src="img/cards/'+ value.name +'.png"></div></div>');
				if(value.content) {
					$('.card[data-id=' + value.name + ']').attr('data-content', value.content);
				}
			});

			$(document).on('click', '.card', function(){
				Cards.click($(this));
			});
			$(document).on('touchstart', '.card', function(){
				if(touch_allow)
				{
					Cards.click($(this));
				}
			});
			$(document).on('click touchstart', '.start-btn', function(){
				setTimeout( function() { Cards.start(); }, 3000 );
				Nav.slide(2);
			});
			$(document).on('click touchstart', '.bot', function(){
				Cards.hint();
			});


		},
		destroy: function() {
			$('.card').remove();
			$('.super-card').remove();
			newCardType = [];
			tilesFlipped = 0;
			super_count = 0;
		},
		reinit: function() {
			var obj = this;
			setTimeout(function(){
				obj.destroy();
				obj.init();
			}, 1000);
		},
		start: function() {
			var oldtime = time;
			$.each( $('.card'), function(){
				var that = $(this);
				var timer = setTimeout( function(){
					that.removeClass('flip');
				}, time += speed );
			});
			time = oldtime;
			this.timer();
		},
		timer: function() {
			interval_stop = false;
			$('.timer').text(timer_time);
			$('.timer').addClass('started');
			interval(timer_time);
		},
		finish: function() {
			$('.super-card').addClass('opened');
			setTimeout( function() { $('.cigarbox').addClass('opened'); }, 1000 );
			setTimeout( function(){
				Nav.slide(3);
				setTimeout(function(){
					Nav.slide(4);
					setTimeout(function(){
						$('.cigarbox').removeClass('opened');
					}, 1000);
					setTimeout( function(){
						Nav.start();
						//$('.last-slide').css('opacity', 0);
					}, 5000);
				}, 6000);
			}, 6000);
			setTimeout( function() { Cards.reinit(); }, 10000 );
			interval_stop = true;
		},
		shuffle: function(o) {
			for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
			return o;
		},
		click: function(card) {
			if(card.hasClass('flip')) {
				return;
			}
			if( i < 2 ) {
				clicked[i] = card.index();
				card.addClass('flip');
				i++;
			}
			if( i == 1 ) {
				clicked_name = card.data('id');
			}
			if( i == 2 && !coolDown ) {
				coolDown = true;
				var isRight = (clicked_name == card.data('id'));

				type = card.data('type');
				if(isRight && type == 'super')
				{
					if(super_count == 1) {
						$('.super-card').addClass('to-left');
					}
					if(super_count == 2) {
						$('.super-card').last().addClass('to-right');
					}
					$('.container').append('<div class="super-card"><img src="img/super/' + card.data('content') + '.png"></div>');
					setTimeout(function(){
						$('.super-card').addClass('loaded');
					}, 500);
					super_count++;
				}
				setTimeout(function(){
					clicked.forEach(function(n) {
						if(isRight)
						{
							setTimeout(function(){
								$('.card').eq(n).addClass('removed');
								tilesFlipped += 1;
								if(tilesFlipped >= newCardType.length) {
									//Cards.reinit();
									Cards.finish();
								}
							}, 500);

						} else {
							setTimeout(function(){
								$('.card').eq(n).removeClass('flip');
							}, 500);
						}
					});

					setTimeout( function(){
						coolDown = false;
						i = 0;
						clicked = [];
					}, 100);
					
				}, 100);

				if(isRight) {
					fail = 0;
				} else {
					fail++;
				}
				if(fail == fail_try) {
					fail = 0;
					setTimeout(function(){
						Cards.hint();
					}, 1000);
				}
			}
		},
		hint: function() {
			var thatcard;
			var i = true;
			$.each(shuffleCards, function(index, value) {
				thatcard = $('.card[data-id=' + value.name + ']');
				if(!thatcard.hasClass('removed') && !thatcard.hasClass('flip') && i)
				{
					thatcard.addClass('shake');
					i = false;
				}
			});
			setTimeout(function(){
				$('.card').removeClass('shake');
			}, 150*5);
		},
		bot: function() {
			var bot_array = [];
			var i = 0;
			touch_allow = false;
			$.each(cardtype, function(index, value) {
				if(!$('.card[data-id=' + value.name + ']').hasClass('removed'))
				{
					bot_array.push(value.name);
				}
			});
			this.shuffle(bot_array);
			int = setInterval(function(){
				$('.card[data-id=' + bot_array[i] + ']').trigger('click');
				i++;
				if(i == 8) {
					clearInterval(int);
					touch_allow = true;
				}
			}, 700);
		}
	};
})();

Nav.start();
Cards.init();

