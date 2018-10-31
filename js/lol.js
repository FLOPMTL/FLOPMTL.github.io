$(document).on("box2DReady", function () {

  var elem = $('.description');
  var characters = elem.text().split("");
  elem.empty();


  $.each(characters, function (i, el) {
    elem.append("<span>" + el + "</span");
  });


  elem = $('#title');
  characters = elem.text().split("");
  elem.empty();

  $.each(characters, function (i, el) {
    elem.append("<span>" + el + "</span");
  });

  // $('.description').html(function (i, html) {
  //     return html.replace(/\b([^ ]+)\b/g, '<span>$1</span>');
  // });


  var seed = 1;
  function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  function map(x, in_min, in_max, out_min, out_max)
  {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }




  var elem = $('.description span').each(function(){


    // setTimeout((function(){

    var x = map(random(), 0, 1, -20, 20);
    var y = map(random(), 0, 1, -40 , 40 );

    var physicsEleemnt = $(this).box2d({'x-velocity' : x, 'y-velocity': y, 'static' : true});

    //
    //
    // $(physicsEleemnt).on('collisionStart', function(node){
    //   if(node)
    // })


    // }).bind(this), map(random(), 0, 1, 0, 1000));
  })


  $('#title').on('click', function(){


    var x = map(random(), 0, 1, -1000, 1000);
    var y = map(random(), 0, 1, -1000 , 1000 );

    $('#flopsie').box2d({'x-velocity' : x, 'y-velocity': y, 'shape' : 'circle'});

    var elem = $('#title span').each(function(){


      // setTimeout((function(){

      // setTimeout((function() {
      var x = map(random(), 0, 1, -1000, 1000);
      var y = map(random(), 0, 1, -1000 , 1000 );

      $(this).box2d({'x-velocity' : x, 'y-velocity': y});

      // }).bind(this), 500);

    })
  });



  $('#flopsie').on('click', function(){

    var elem = $('#title span').each(function(){

      $(this).box2d({'static':true});

    });

    var x = map(random(), 0, 1, -1000, 1000);
    var y = map(random(), 0, 1, -1000 , 1000 );

    $('#flopsie').box2d({'x-velocity' : x, 'y-velocity': y, 'shape' : 'circle', 'restitution' : 1, 'density' : 4});

  });


  $('u').each(function(){

    // console.log(this);
    var x = map(random(), 0, 1, -2, 2);
    var y = map(random(), 0, 1, 0, 12);
    $(this).box2d({'x-velocity' : x, 'y-velocity': y, 'static' : true});


  });

});
