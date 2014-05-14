$(document).on('click touchstart', '.card', function(){
	Cards.click($(this));
});

/* Cards module */

var Cards = (function(){
	var i = 0;
	var clicked = [];
	var clicked_name = false;
	var cardtype = [
		{name: 1},
		{name: 2},
		{name: 3},
		{name: 4},
		{name: 5},
		{name: 6},
		{name: 7},
		{name: 8}
	];

	return {
		init: function() {
			$.each(cardtype, function(index, value) {
				cardtype.push(value);
			});

			this.shuffle(cardtype);
			$.each(cardtype, function(index, value) {
				$('.cards-block').append('<div class="card flip" data-id="' + value.name + '"><div class="card-front"></div><div class="card-back">'+ value.name +'</div></div>');
			});

			setTimeout(function(){
				$('.card').removeClass('flip');
			}, 3000);
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
			if( i == 2 ) {
				setTimeout(function(){
					clicked.forEach(function(n) {
						$('.card').eq(n).addClass('flip');
						if(clicked_name == card.data('id'))
						{
							setTimeout(function(){
								$('.card').eq(n).css('opacity', 0);
							}, 2000);
						} else {
							setTimeout(function(){
								$('.card').eq(n).removeClass('flip').removeClass('clicked');
							}, 2000);
						}
					});
					i = 0;
					clicked = [];
				}, 1000);
			}
		}
	};
})();

Cards.init();

