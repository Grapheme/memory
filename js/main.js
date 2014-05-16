/* Cards module */

document.ontouchmove = function(e){ e.preventDefault(); };

var Nav = (function(){
	return {
		init: function() {
			$(document).on('click touchstart', '.plugins', function(){
				$('.start-game').addClass('opened');
			});
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
		tilesFlipped = 0,
		newCardType = [],
		time = 200,
		speed = 100,
		super_count = 0,
		coolDown = false,
		fail = 0,
		timer_time = 60,
		touch_allow = true;

	return {
		init: function() {
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
				$('.container').addClass('opened');
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
			$('.container, .start-game, .cigarbox').hide().removeClass('opened').show();
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
			var timer_default = timer_time;
			$('.timer').text(timer_time);
			$('.timer').addClass('started');
			timerInt = setInterval(function(){
				if(timer_time == 0) {
					clearInterval(timerInt);
					Cards.bot();
					$('.timer').removeClass('started');
					timer_time = timer_default;
				} else {
					$('.timer').text(timer_time);
					timer_time--;
				}
			}, 1000);
		},
		finish: function() {
			setTimeout( function() { $('.cigarbox').addClass('opened'); }, 1000 );
			$('.super-card').addClass('opened');
			setTimeout( function() { Cards.reinit(); }, 5000 );
			timer_time = 0;
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
						console.log();
					});

					setTimeout( function(){
						coolDown = false;
						i = 0;
						clicked = [];
					}, 100);
					
				}, 100);

				if(!isRight) {
					fail++;
				}
				if(fail == 3) {
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
			$.each(cardtype, function(index, value) {
				thatcard = $('.card[data-id=' + value.name + ']');
				if(!thatcard.hasClass('removed') && i)
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
				bot_array.push(value.name);
			});
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

Nav.init();
Cards.init();

