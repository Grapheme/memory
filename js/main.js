$(document).on('click touchstart', '.card', function(){
	cards.Click($(this));
});

var cards = {
	i: 0,
	clicked: false,
	Click: function(card) {
		var obj = this;
		if(obj.i < 2)
		{
			card.addClass('flip');
			obj.i++;
		}
		if(obj.i == 2)
		{
			setTimeout(function(){
				$('.card').removeClass('flip');
				obj.i = 0;
			}, 1000);
		}
	}
};