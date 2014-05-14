/* Cards module */

var Cards = (function(){
	var i = 0,
		clicked = [],
		clicked_name = false,
		type = false,
		sup_content = false,
		cardtype = [

			{name: 'smoke', type: 'super', content: 'меньше мать его дыма'},
			{name: 'xyu', type: 'super', content: 'Cuase i got nothing to hide, cuz i true'},
			{name: 3, type: 'normal'},
			{name: 4, type: 'normal'},
			{name: 5, type: 'normal'},
			{name: 6, type: 'normal'},
			{name: 7, type: 'normal'},
			{name: 8, type: 'normal'}

		],
		tilesFlipped = [],
		newCardType = [],
		time = 200,
		speed = 100,
		coolDown = false;

	return {
		init: function() {
			$.each(cardtype, function(index, value) {
				for(var i = 0; i < 2; i++) newCardType.push(value);
			});

			this.shuffle(newCardType);
			$.each(newCardType, function(index, value) {
				$('.cards-block').append('<div class="card flip" data-type="' + value.type + '" data-id="' + value.name + '"><div class="card-front"></div><div class="card-back">'+ value.name +'</div></div>');
				$('.container').append('<a href="#" class="start-btn">Начать!</a>');
			});

			$(document).on('click touchstart', '.card', function(){
				Cards.click($(this));
			});
			$(document).on('click touchstart', '.start-btn', function(){
				Cards.start();
				return false;
			});

		},
		destroy: function() {
			$('.card').remove();
			$('.start-btn').remove();
			newCardType = [];
		},
		reinit: function() {
			this.destroy();
			this.init();
		},
		start: function() {
			$.each( $('.card'), function(){
				var that = $(this);
				var timer = setTimeout( function(){
					that.removeClass('flip');
				}, time += speed );
			});
			$('.start-btn').remove();
			console.log(newCardType);
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
					alert('super');
				}
				setTimeout(function(){
					clicked.forEach(function(n) {
						if(clicked_name == card.data('id'))
						{
							setTimeout(function(){
								$('.card').eq(n).css('opacity', 0);
							}, 1000);
						} else {
							setTimeout(function(){
								$('.card').eq(n).removeClass('flip').removeClass('flip');
							}, 1000);
						}
					});

					setTimeout( function(){ 
						coolDown = false;
						i = 0;
						clicked = [];
					}, 1000);
					
				}, 1000);
			}
		}
	};
})();

Cards.init();

