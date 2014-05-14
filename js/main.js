$(document).on('click touchstart', '.card', function(){
	cards.Click($(this));
});

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

$.each(cardtype, function(index, value) {
    cardtype.push(value);
});
shuffle(cardtype);
$.each(cardtype, function(index, value) {
    $('.cards-block').append('<div class="card flip" data-id="' + value.name + '"><div class="card-front"></div><div class="card-back">'+ value.name +'</div></div>');
});

setTimeout(function(){
	$('.card').removeClass('flip');
}, 3000);

var cards = {
	i: 0,
	clicked: [],
	clicked_name: false,
	Click: function(card) {
		if(card.hasClass('clicked'))
		{
			return;
		}
		var obj = this;
		if(obj.i < 2)
		{
			obj.clicked[obj.i] = card.index();
			card.addClass('clicked');
			obj.i++;
		}
		if(obj.i == 1)
		{
			obj.clicked_name = card.data('id');
		}
		if(obj.i == 2)
		{
			setTimeout(function(){
				obj.clicked.forEach(function(n) {
				    $('.card').eq(n).addClass('flip');
				    if(obj.clicked_name == card.data('id'))
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
				obj.i = 0;
				obj.clicked = [];
			}, 1000);
		}
	}
};