/* Cards module */

document.ontouchmove = function(e){ e.preventDefault(); };

var Nav = (function(){
	return {
		init: function() {
			$(document).on('click touchstart', '.drives', function(){
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
		coolDown = false;

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

			$(document).on('click touchstart', '.card', function(){
				Cards.click($(this));
			});
			$(document).on('click touchstart', '.start-btn', function(){
				setTimeout( function() { Cards.start(); }, 3000 );
				$('.container').addClass('opened');				
			});

		},
		destroy: function() {
			$('.card').remove();
			$('.super-card').remove();
			newCardType = [];
			tilesFlipped = 0;
		},
		reinit: function() {
			this.destroy();
			this.init();
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

				type = card.data('type');
				if(clicked_name == card.data('id') && type == 'super')
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
						if(clicked_name == card.data('id'))
						{
							setTimeout(function(){
								$('.card').eq(n).css('opacity', 0);
								tilesFlipped += 1;
								if(tilesFlipped >= newCardType.length) {
									setTimeout(function(){
										Cards.reinit();
									}, 1000);
									$('.container, .start-game').hide().removeClass('opened').show();
								}
								console.log();
							}, 500);
						} else {
							setTimeout(function(){
								$('.card').eq(n).removeClass('flip').removeClass('flip');
							}, 500);
						}
					});

					setTimeout( function(){
						coolDown = false;
						i = 0;
						clicked = [];
					}, 100);
					
				}, 100);
			}
		}
	};
})();

Nav.init();
Cards.init();

