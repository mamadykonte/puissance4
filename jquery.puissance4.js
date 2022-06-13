(function ($) {
  const pluginName = "puissance4";

  $.fn[pluginName] = function (options) {
    let defaults = {
      row : 6,
      col : 7,
      idPlayer1 : "player1",
      idPlayer2 : "player2",
      colorPlayer1 : "#C70000",
      colorPlayer2 : "gold",
    };

    $.extend(defaults, options);
    let play = new Puissance4(this[0],defaults.row,defaults.col,defaults.idPlayer1,defaults.idPlayer2,defaults.colorPlayer1,defaults.colorPlayer2);
    
    return this[0];
   
  };
})(jQuery);

