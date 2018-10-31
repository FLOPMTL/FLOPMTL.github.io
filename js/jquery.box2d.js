var userdatas = {};
var userdatasIndex = 1;

Box2D().then(function(Box2D) {
  window.Box2D = Box2D;
  (function($){
    $.fn.getStyleObject = function(){
      var dom = this.get(0);
      var style;
      var returns = {};
      if(window.getComputedStyle){
        var camelize = function(a,b){
          return b.toUpperCase();
        }
        style = window.getComputedStyle(dom, null);
        for(var i=0;i<style.length;i++){
          var prop = style[i];
          var camel = prop.replace(/\-([a-z])/g, camelize);
          var val = style.getPropertyValue(prop);
          returns[camel] = val;
        }
        return returns;
      }
      if(dom.currentStyle){
        style = dom.currentStyle;
        for(var prop in style){
          returns[prop] = style[prop];
        }
        return returns;
      }
      return this.css();
    }
  })(jQuery);

  (function($){

    $.fn.bodysnatch = function() {
      //rA = [];
      var collection = this;
      //console.log(collection)
      return collection.each(function(a,b) {
        var element = $(this);
        var clone = element.clone();

        var w = element.width(),
        h = element.height();
        //var translate_values = 'translateX(' + element.offset().left + 'px) translateY(' + element.offset().top +'px)';
        var translate_values = 'translate3d(' + (element.offset().left | 0) + 'px,' + (element.offset().top | 0) + 'px,0px)';
        //otherwise not loaded image will be stuck with zero width/height
        if ( w && h)
        {
          //cssText returns "" on FF!!!
          if ( window.getComputedStyle && window.getComputedStyle.cssText )
          {
            clone.attr('style', window.getComputedStyle(element[0]).cssText);
          }
          else
          {
            clone.css(element.getStyleObject());
          }

          clone.css({
            position: 'absolute',
            left: 0,
            top: 0,
            //hot fix for the 101 balls samplein FF and opera
            //due to idiotic behaviour of
            //https://developer.mozilla.org/de/docs/DOM/window.getComputedStyle
            //'background-color': element.css('background-color'),
            width: element.width(),
            height: element.height(),
            margin:0,
            "-webkit-transform": translate_values,
            "-moz-transform": translate_values,
            "-ms-transform": translate_values,
            "-o-transform": translate_values,
            "transform": translate_values
            //padding: 0
          });
          clone.addClass('perfect');
        }
        else //probably images without a width and height yet
        {
          clone.css({
            position: 'absolute',
            margin:0,
            left: 0,
            top: 0,
            "-webkit-transform": translate_values,
            "-moz-transform": translate_values,
            "-ms-transform": translate_values,
            "-o-transform": translate_values,
            "transform": translate_values
          });
          clone.addClass('imperfect');
        }
        //clone.hide();
        //$('body').append(clone);
        //clone.show();
        if(element[0].id) {
          element[0].id=element[0].id+'_snatched';
        }
        element.addClass('snatched');
        clone.addClass('bodysnatcher');
        //stop audio and videos
        element.css('visibility','hidden');
        if(element[0].pause){
          //console.log('video or audio')
          element[0].pause();
          element[0].src='';
        }
        collection[a]=clone[0]
        $('body').append(clone);
        //experiments for better rendering
        //window.setTimeout(function(){element.css('visibility','hidden');},0);
        //windiw.setTimeout(function(){element.css('visibility','hidden');}, 0);
      });
      //return $(rA);
    };
  })(jQuery);
  (function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
      timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

    if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }());
  (function() {
    var $, D2R, D_E_B_U_G, DragHandler, MutationObserver, PI2, R2D, SCALE, S_T_A_R_T_E_D, applyCustomGravity, processElementPhysicsChanges, areaDetection, areas, b2AABB, b2Body, b2BodyDef, b2CircleShape, b2ContactListener, b2DebugDraw, b2Fixture, b2FixtureDef, b2MassData, b2MouseJointDef, b2PolygonShape, b2RevoluteJointDef, b2Vec2, b2World, bodyKey, bodySet, cleanGraveyard, createBox, createCircle, createDOMObjects, default_density, default_friction, default_passive, default_restitution, default_shape, default_static, drawDOMObjects, fpsEl, graveyard, hw, interval, isMouseDown, measureTime, mouseJoint, mousePVec, mouseX, mouseY, mutationConfig, mutationHandler, mutationObserver, selectedBody, startWorld, time0, update, world, x_velocity, y_velocity;

    b2Vec2 = Box2D.b2Vec2;

    b2AABB = Box2D.b2AABB;

    b2BodyDef = Box2D.b2BodyDef;

    b2Body = Box2D.b2Body;

    b2FixtureDef = Box2D.b2FixtureDef;

    b2Fixture = Box2D.b2Fixture;

    b2World = Box2D.b2World;

    b2MassData = Box2D.b2MassData;

    b2PolygonShape = Box2D.b2PolygonShape;

    b2CircleShape = Box2D.b2CircleShape;

    b2ContactListener = Box2D.b2ContactListener;

    b2DebugDraw = Box2D.b2DebugDraw;

    b2RevoluteJointDef = Box2D.b2RevoluteJointDef;

    b2MouseJointDef = Box2D.b2MouseJointDef;

    $ = jQuery;

    hw = {
      '-webkit-transform': 'translateZ(0)',
      '-moz-transform': 'translateZ(0)',
      '-o-transform': 'translateZ(0)',
      'transform': 'translateZ(0)'
    };

    S_T_A_R_T_E_D = false;

    D_E_B_U_G = false;

    world = {};

    x_velocity = 0;

    y_velocity = 0;

    SCALE = 30;

    D2R = Math.PI / 180;

    R2D = 180 / Math.PI;

    PI2 = Math.PI * 2;

    interval = {};

    default_static = false;

    default_density = 1.5;

    default_friction = 0.3;

    default_restitution = 0.4;

    default_shape = 'box';

    default_passive = false;

    mouseX = 0;

    mouseY = 0;

    mousePVec = void 0;

    isMouseDown = false;

    selectedBody = void 0;

    mouseJoint = void 0;

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    mutationObserver = void 0;

    mutationConfig = {
      attributes: false,
      childList: true,
      characterData: false
    };

    bodySet = {};

    bodyKey = 0;

    areas = [];

    graveyard = [];

    time0 = 0;

    fpsEl = void 0;

    DragHandler = (function() {
      var downHandler, moveHandler, upHandler, updateFromEvent;
      selectedBody = void 0;
      mouseJoint = false;
      mouseX = void 0;
      mouseY = void 0;
      upHandler = function() {
        if (selectedBody) {
          mouseX = null;
          mouseY = null;
          return selectedBody = null;
        }
      };
      moveHandler = function(e) {
        if (selectedBody) {
          return updateFromEvent(e);
        }
      };
      downHandler = function(domEl, e) {
        var fixture;
        fixture = bodySet[domEl.attr('data-box2d-bodykey')];
        if (!userdatas[fixture.GetUserData()].isPassive) {
          selectedBody = fixture.GetBody();
          return updateFromEvent(e);
        }
      };
      $(document).mouseup(upHandler);
      $(document).mousemove(moveHandler);
      updateFromEvent = function(e) {
        var touch;
        e.preventDefault();
        touch = e.originalEvent;
        if (touch && touch.touches && touch.touches.length === 1) {
          touch.preventDefault();
          mouseX = touch.touches[0].pageX;
          mouseY = touch.touches[0].pageY;
        } else {
          mouseX = e.pageX;
          mouseY = e.pageY;
        }
        mouseX = mouseX / 30;
        return mouseY = mouseY / 30;
      };
      return {
        register: function(domEl) {
          domEl.mousedown(function(e) {
            return downHandler(domEl, e);
          });
          domEl.bind('touchstart', function(e) {
            return downHandler(domEl, e);
          });
          domEl.bind('touchend', upHandler);
          return domEl.bind('touchmove', moveHandler);
        },
        updateMouseDrag: function() {
          // var md;
          // if (selectedBody && (!mouseJoint)) {
          //   md = new b2MouseJointDef();
          //   md.bodyA = world.GetGroundBody();
          //   md.bodyB = selectedBody;
          //   md.target.Set(mouseX, mouseY);
          //   md.collideConnected = true;
          //   md.maxForce = 300.0 * selectedBody.GetMass();
          //   mouseJoint = world.CreateJoint(md);
          //   selectedBody.SetAwake(true);
          // }
          // if (mouseJoint) {
          //   if (selectedBody) {
          //     return mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
          //   } else {
          //     world.DestroyJoint(mouseJoint);
          //     return mouseJoint = null;
          //   }
          // }
        }
      };
    })();

    createDOMObjects = function(jquery_selector, shape, static_, density, restitution, friction, passive) {
      if (shape == null) {
        shape = default_shape;
      }
      if (static_ == null) {
        static_ = default_static;
      }
      if (density == null) {
        density = default_density;
      }
      if (restitution == null) {
        restitution = default_restitution;
      }
      if (friction == null) {
        friction = default_friction;
      }
      if (passive == null) {
        passive = default_passive;
      }
      return $(jquery_selector).each(function(a, b) {
        var body, domObj, domPos, full_height, full_width, height, make_density, make_friction, make_passive, make_restitution, make_shape, make_static, origin_values, r, width, x, y;
        domObj = $(b);
        full_width = domObj.attr('width') ? domObj.attr('width') : domObj.width();
        full_height = domObj.attr('height') ? domObj.attr('height') : domObj.height();
        if (!(full_width && full_height)) {
          if (domObj.attr('src')) {
            if (typeof console !== "undefined" && console !== null) {
              console.log(' - box2d-jquery ERROR: an element withour width or height, will lead to strangeness!');
            }
            domObj.on('load', function() {
              return createDOMObjects(this, shape, static_, density, restitution, friction);
            });
          }
          return true;
        }
        domPos = $(b).position();
        width = full_width / 2;
        height = full_height / 2;
        x = domPos.left + width;
        y = domPos.top + height;
        make_shape = (domObj.attr('data-box2d-shape') ? domObj.attr('data-box2d-shape') : shape);
        make_density = parseFloat((domObj.attr('data-box2d-density') ? domObj.attr('data-box2d-density') : density));
        make_restitution = parseFloat((domObj.attr('data-box2d-restitution') ? domObj.attr('data-box2d-restitution') : restitution));
        make_friction = parseFloat((domObj.attr('data-box2d-friction') ? domObj.attr('data-box2d-friction') : friction));
        if (domObj.attr('data-box2d-static') === "true") {
          make_static = true;
        } else if (domObj.attr('data-box2d-static') === "false") {
          make_static = false;
        } else {
          make_static = static_;
        }
        if (domObj.attr('data-box2d-passive') === "true") {
          make_passive = true;
        } else if (domObj.attr('data-box2d-passive') === "false") {
          make_passive = false;
        } else {
          make_passive = passive;
        }
        if (make_shape && make_shape !== 'circle') {
          body = createBox(x, y, width, height, make_static, make_density, make_restitution, make_friction);
        } else {
          r = (width > height ? width : height);
          body = createCircle(x, y, r, make_static, make_density, make_restitution, make_friction);
        }




        userdatas[userdatasIndex] = {
          domObj: domObj,
          width: width,
          height: height,
          isPassive: make_passive
        };

        body.SetUserData(userdatasIndex);
        userdatasIndex++;


        window.bodybody = body;

        origin_values = '50% 50% 0';
        domObj.css({
          "-webkit-transform-origin": origin_values,
          "-moz-transform-origin": origin_values,
          "-ms-transform-origin": origin_values,
          "-o-transform-origin": origin_values,
          "transform-origin": origin_values
        });
        domObj.attr('data-box2d-bodykey', bodyKey);
        DragHandler.register(domObj);
        bodySet[bodyKey] = body;
        bodyKey++;
        return true;
      });
    };

    createBox = function(x, y, width, height, static_, density, restitution, friction) {
      var bodyDef, fixDef;
      if (static_ == null) {
        static_ = default_static;
      }
      if (density == null) {
        density = default_density;
      }
      if (restitution == null) {
        restitution = default_restitution;
      }
      if (friction == null) {
        friction = default_friction;
      }
      bodyDef = new b2BodyDef();
      bodyDef.set_type((static_ ? Box2D.b2_staticBody : Box2D.b2_dynamicBody));
      bodyDef.set_position(new b2Vec2(  x / SCALE, y / SCALE ));

      fixDef = new b2FixtureDef();
      fixDef.set_density(density);
      fixDef.set_friction(friction);
      fixDef.set_restitution(restitution);
      var shape = new Box2D.b2PolygonShape;
      shape.SetAsBox(width / SCALE, height / SCALE);
      fixDef.set_shape(shape)
      window.fixDef = fixDef;
      var body = world.CreateBody(bodyDef);
      body.SetAwake(1);
      body.SetActive(1);
      return  body.CreateFixture(fixDef);
    };

    createCircle = function(x, y, r, static_, density, restitution, friction) {
      var bodyDef, fixDef;
      if (static_ == null) {
        static_ = default_static;
      }
      if (density == null) {
        density = default_density;
      }
      if (restitution == null) {
        restitution = default_restitution;
      }
      if (friction == null) {
        friction = default_friction;
      }
      bodyDef = new b2BodyDef();
      bodyDef.set_type((static_ ? Box2D.b2_staticBody : Box2D.b2_dynamicBody));
      bodyDef.set_position(new b2Vec2(  x / SCALE, y / SCALE ));



      fixDef = new b2FixtureDef();
      fixDef.set_density(density);
      fixDef.set_friction(friction);
      fixDef.set_restitution(restitution);
      var shape = new Box2D.b2CircleShape();
      shape.set_m_radius(r / SCALE);
      fixDef.set_shape(shape)

      return world.CreateBody(bodyDef).CreateFixture(fixDef);
    };

    /*

    fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;

    bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    fixDef.shape = new b2CircleShape(10 / SCALE);

    bodyDef.position.x = 100 / SCALE;
    bodyDef.position.y = 10 / SCALE;
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    */


    drawDOMObjects = function() {
      var b, css, domObj, f, i, r, translate_values, x, y, _results;
      i = 0;
      b = world.GetBodyList();
      _results = [];
      while (b.ptr) {
        f = b.GetFixtureList();
        while (f.ptr) {

          if (userdatas[f.GetUserData()]) {
            domObj = userdatas[f.GetUserData()].domObj;
            // console.log("jjsdf", domObj, f.GetUserData(), userdatas[f.GetUserData()].domObj);
            x = Math.floor((f.GetBody().GetTransform().get_p().get_x() * SCALE) - userdatas[f.GetUserData()].width) + 'px';
            y = Math.floor((f.GetBody().GetTransform().get_p().get_y() * SCALE) - userdatas[f.GetUserData()].height) + 'px';
            // console.log(f.GetBody().GetTransform().get_p().get_x(), f.GetBody().GetTransform().get_p().get_y());
            r = Math.round(((f.GetBody().GetAngle() + PI2) % PI2) * R2D * 100) / 100;

            //translate_values = ["translateX(", x, ') translateY(', y, ')'].join('');
            translate_values = 'translate3d(' + x + ',' + y + ',0px)';
            translate_values += " rotate(" + r + "deg)";
            css = {
              "-webkit-transform": translate_values,
              "-moz-transform": translate_values,
              "-ms-transform": translate_values,
              "-o-transform": translate_values,
              "transform": translate_values
            };
            userdatas[f.GetUserData()].domObj.css(css);
          }
          f = f.GetNext();
        }
        _results.push(b = b.GetNext());
      }
      return _results;
    };



    processElementPhysicsChanges = function() {
      var b, f, force, _results;
      b = world.GetBodyList();
      // console.log(b);
      _results = [];

      while (b.ptr) {

        f = b.GetFixtureList();
        while (f.ptr) {
          if (userdatas[f.GetUserData()] && userdatas[f.GetUserData()].changed) {

            f.GetBody().SetType(userdatas[f.GetUserData()].static ? Box2D.b2_staticBody : Box2D.b2_dynamicBody);
            f.GetBody().SetAwake(true);
          }


          f = f.GetNext();
        }
        b = b.GetNext();
      }
    };


    applyCustomGravity = function() {
      var b, f, force, _results;
      b = world.GetBodyList();
      // console.log(b);
      _results = [];

      while (b.ptr) {

        f = b.GetFixtureList();
        while (f.ptr) {
          if (userdatas[f.GetUserData()] && userdatas[f.GetUserData()].gravity) {
            force = userdatas[f.GetUserData()].gravity;
            f.GetBody().ApplyForce(force, f.GetBody().GetWorldCenter());
          }
          f = f.GetNext();
        }
        _results.push(b = b.GetNext());
      }
      return _results;
    };

    areaDetection = (function() {
      var _elementsInArea;
      _elementsInArea = [];
      return function() {
        var aabb, area, elements, i, joined, left, shape, shapes, _i, _j, _len, _len1, _results;
        _results = [];
        for (i = _i = 0, _len = areas.length; _i < _len; i = ++_i) {
          area = areas[i];
          if (!_elementsInArea[i]) {
            _elementsInArea[i] = [];
          }
          aabb = new b2AABB();
          aabb.lowerBound = new b2Vec2(area[0] / SCALE, area[1] / SCALE);
          aabb.upperBound = new b2Vec2(area[2] / SCALE, area[3] / SCALE);
          shapes = [];
          world.QueryAABB(function(shape) {
            shapes.push(shape);
            return true;
          }, aabb);
          elements = [];
          for (_j = 0, _len1 = shapes.length; _j < _len1; _j++) {
            shape = shapes[_j];
            if (userdatas[shape.GetUserData()]) {
              elements.push(userdatas[shape.GetUserData()].domObj);
            }
          }
          joined = $(elements).not(_elementsInArea[i]);
          left = $(_elementsInArea[i]).not(elements);
          _elementsInArea[i] = elements;
          if (joined.length !== 0) {
            _results.push($(document).trigger('areajoined', {
              areaIndex: i,
              joinedEl: joined,
              areaElements: _elementsInArea[i]
            }));
          } else {
            if (left.length !== 0) {
              _results.push($(document).trigger('arealeft', {
                areaIndex: i,
                leftEl: left,
                areaElements: _elementsInArea[i]
              }));
            } else {
              _results.push(void 0);
            }
          }
        }
        return _results;
      };
    })();

    measureTime = function() {
      var fps, now;
      now = (window['performance'] && performance.now()) || +(new Date);
      fps = 1000 / (now - time0);
      fpsEl.text((fps >> 0) + ' fps');
      return time0 = now;
    };

    update = function() {
      cleanGraveyard();
      DragHandler.updateMouseDrag();
      applyCustomGravity();
      if (areas.length > 0) {
        areaDetection();
      }
      //world.Step(2 / 60, 8, 3);
      world.Step(1 / 30, 8, 3);
      drawDOMObjects();
      if (D_E_B_U_G) {
        world.DrawDebugData();
        measureTime();
      }
      world.ClearForces();

      processElementPhysicsChanges();
      //return window.setTimeout(update, 1000 / 30);
      return requestAnimationFrame(update);
    };

    mutationHandler = function(mutations) {
      return mutations.forEach(function(mutation) {
        var node, _i, _len, _ref, _results;
        if (mutation.removedNodes.length > 0) {
          _ref = mutation.removedNodes;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push((function(node) {
              var index;
              index = $(node).attr('data-box2d-bodykey');
              if (bodySet[index] != null) {
                return graveyard.push([index, bodySet[index]]);
              }
            })(node));
          }
          return _results;
        }
      });
    };

    cleanGraveyard = function() {
      var zombie, _results;
      _results = [];
      while (graveyard.length > 0) {
        zombie = graveyard.pop();
        zombie[1].GetBody().SetUserData(null);
        world.DestroyBody(zombie[1].GetBody());
        _results.push(delete bodySet[zombie[0]]);
      }
      return _results;
    };

    startWorld = function(jquery_selector, density, restitution, friction) {
      var canvas, contactListener, debugDraw, h, w;
      if (density == null) {
        density = default_density;
      }
      if (restitution == null) {
        restitution = default_restitution;
      }
      if (friction == null) {
        friction = default_friction;
      }
      S_T_A_R_T_E_D = true;
      console.log("ca la", x_velocity, y_velocity);
      var gravity = new b2Vec2(x_velocity ? x_velocity : 0, y_velocity ? y_velocity : 0);
      world = new b2World(gravity, false);
      window.world = world;
      w = $(window).width();
      h = $(window).height();
      createBox(0, -1, $(window).width(), 1, true, density, restitution, friction);
      createBox($(window).width() + 1, 0, 1, $(window).height(), true, density, restitution, friction);
      createBox(-1, 0, 1, $(window).height(), true, density, restitution, friction);
      createBox(0, $(window).height() + 1, $(window).width(), 1, true, density, restitution, friction);
      contactListener = new Box2D.JSContactListener();
      contactListener.BeginContact = function(contactPtr) {
        var node0, node1, _ref, _ref1;
        var contact = Box2D.wrapPointer( contactPtr, Box2D.b2Contact );
        node0 = (_ref = userdatas[contact.GetFixtureA().GetUserData()]) != null ? _ref.domObj : void 0;
        node1 = (_ref1 = userdatas[contact.GetFixtureA().GetUserData()]) != null ? _ref1.domObj : void 0;
        if ((node0 != null) && (node1 != null)) {
          // console.log(node0);

          var bodyA = contact.GetFixtureA().GetBody();
          var bodyB = contact.GetFixtureB().GetBody();

          if(bodyA.GetType() == Box2D.b2_staticBody){


            console.log("le A est");
            // bodyA.SetType(Box2D.b2_dynamicBody);

            userdatas[contact.GetFixtureA().GetUserData()].changed = true;
            userdatas[contact.GetFixtureA().GetUserData()].static = false;
            // bodyA.SetAwake(true); // awake the body to enable physics calculations
          }

          if(bodyB.GetType() ==  Box2D.b2_staticBody){
            // console.log("le B est");

            userdatas[contact.GetFixtureA().GetUserData()].changed = true;
            userdatas[contact.GetFixtureA().GetUserData()].static = false;

            // bodyB.SetType(Box2D.b2_dynamicBody);
            // bodyB.SetAwake(true); // awake the body to enable physics calculations
          }

          return node0.trigger('collisionStart', node1);
        }
      };
      contactListener.EndContact = function(contactPtr) {
        var contact = Box2D.wrapPointer( contactPtr, Box2D.b2Contact );

        var node0, node1, _ref, _ref1;

        node0 = (_ref = userdatas[contact.GetFixtureA().GetUserData()]) != null ? _ref.domObj : void 0;
        node1 = (_ref1 = userdatas[contact.GetFixtureB().GetUserData()]) != null ? _ref1.domObj : void 0;
        if ((node0 != null) && (node1 != null)) {
          return node0.trigger('collisionEnd', node1);
        }
      };

      contactListener.PreSolve = function(){};
      contactListener.PostSolve = function(){};

      world.SetContactListener(contactListener);
      mutationObserver = new MutationObserver(mutationHandler);
      mutationObserver.observe(document.body, mutationConfig);
      if (D_E_B_U_G) {
        debugDraw = new b2DebugDraw();
        canvas = $('<canvas></canvas>');
        debugDraw.SetSprite(canvas[0].getContext("2d"));
        debugDraw.SetDrawScale(SCALE);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        canvas.css('position', 'absolute');
        canvas.css('top', 0);
        canvas.css('left', 0);
        canvas.css('border', '1px solid green');
        canvas.attr('width', $(window).width());
        canvas.attr('height', $(document).height());
        world.SetDebugDraw(debugDraw);
        fpsEl = $('<div style="position:absolute;bottom:0;right:0;background:red;padding:5px;">0</div>');
        $('body').append(canvas).append(fpsEl);
      }
      return update();
    };

    $.Physics = (function() {
      var getBodyFromEl, getFixtureFromEl, getVectorFromForceInput;
      getFixtureFromEl = function(el) {
        bodyKey = el.attr('data-box2d-bodykey');
        return bodySet[bodyKey];
      };
      getBodyFromEl = function(el) {
        var fixture;
        fixture = getFixtureFromEl(el);
        return fixture && fixture.GetBody();
      };
      getVectorFromForceInput = function(force) {
        force = $.extend({}, {
          x: 0,
          y: 0
        }, force);
        return new b2Vec2(force.x, force.y);
      };
      return {
        applyForce: function(el, force) {
          var body;
          body = getBodyFromEl(el);
          return body.ApplyForce(getVectorFromForceInput(force), body.GetWorldCenter());
        },
        applyImpulse: function(el, force) {
          var body;
          body = getBodyFromEl(el);
          return body.ApplyImpulse(getVectorFromForceInput(force), body.GetWorldCenter());
        },
        setWorldGravity: function(force) {
          return world.SetGravity(new b2Vec2(force['x-velocity'], force['y-velocity']));
        },
        setElementGravity: function(el, force) {
          var fixture;
          fixture = getFixtureFromEl(el);

          console.log("alala", getVectorFromForceInput(force), userdatas[fixture.GetUserData()]);
          return userdatas[fixture.GetUserData()].gravity = getVectorFromForceInput(force);
        }
      };
    })();


    $.fn.extend({
      box2d: function(options) {
        var absolute_elements, debug, density, friction, opts, restitution, self, shape, static_;
        self = $.fn.box2d;
        opts = $.extend({}, self.default_options, options);
        x_velocity = opts['x-velocity'];
        y_velocity = opts['y-velocity'];
        density = opts['density'];
        restitution = opts['restitution'];
        friction = opts['friction'];
        shape = opts['shape'];
        static_ = opts['static'];
        debug = opts['debug'];
        areas = opts['area-detection'] || [];
        if (S_T_A_R_T_E_D === false) {
          if (debug === true) {
            D_E_B_U_G = true;
          }
          startWorld(this, density, restitution, friction);
        }
        absolute_elements = this.bodysnatch();
        createDOMObjects(absolute_elements, shape, static_, density, restitution, friction);
        return $(absolute_elements);
      }
    });

    $.extend($.Physics, {
      default_options: {
        'x-velocity': 0,
        'y-velocity': 0,
        'area-detection': [],
        'density': default_density,
        'restitution': default_restitution,
        'friction': default_friction,
        'static': default_static,
        'shape': default_shape,
        'debug': D_E_B_U_G
      }
    });

    $(document).trigger("box2DReady");

  }).call(this);

});
