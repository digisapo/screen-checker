/**
 * LCD screen check display on browser
 * JavaScript implementation.
 *
 * Copyright (c) 2013-2018 DigiSapo.
 *
 * This code is released undeder the WTFPL License:
 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://www.wtfpl.net/ for more details.
 */

/*
 * Some stuff about the fullscreen APIs.
 */
var FullScreenAPI = FullScreenAPI || {};

FullScreenAPI.isAvailable = function(){
	return(	document.fullscreenEnabled ||
			document.webkitFullscreenEnabled ||
			document.mozFullScreenEnabled ||
			document.msFullscreenEnabled ||
			false );
};

FullScreenAPI.getFullScreenElement = function(){
	return(	document.fullscreenElement ||
			document.webkitFullscreenElement ||
			document.mozFullScreenElement ||
			document.msFullscreenElement ||
			null );
};

FullScreenAPI.startFullScreen = function(domElem){
	if (!domElem) return;
	var funks = ["requestFullscreen",
			"webkitRequestFullScreen",
			"mozRequestFullScreen",
			"msRequestFullscreen"
		];
	var i;
	var num = funks.length;
	for (i=0;i < num;i++){
		if (domElem[funks[i]]) {
			domElem[funks[i]]();
			break;
		}
	}
};

FullScreenAPI.endFullScreen = function(){
	var funks = [
		"exitFullscreen",
		"webkitExitFullscreen",
		"mozCancelFullScreen",
		"msExitFullscreen"
	];
	var i;
	var num = funks.length;
	for (i=0;i < num;i++){
		if (document[funks[i]]) {
			document[funks[i]]();
			break;
		}
	}
};

FullScreenAPI.toggle = function(domElem){
	if (this.getFullScreenElement() == null) {
		this.startFullScreen(domElem);
	} else {
		this.endFullScreen();
	}
};

/*
 * Extends jQuery object methods.
 */
(function($){

	$.fn.startFullScreen = function() {
		if (FullScreenAPI.isAvailable()) FullScreenAPI.startFullScreen(this.get(0));
		return this;
	};
	$.fn.endFullScreen = function() {
		FullScreenAPI.endFullScreen();
		return this;
	};
})(jQuery);

/*
 * The method will be called when the DOM is ready to use.
 */
$(function(){
	var h=0, s=255;
	var ColorSelectMode=0;
	var fullscreenOn=false;
	var setvalue = function(o,px,py){
		if(1<ColorSelectMode) return;
		var clientw = $(o).attr('clientWidth');
		var clienth = $(o).attr('clientHeight');
		if (clientw<360) clientw=360;
		if (clienth<256) clienth=256;
		var ofs=$(o).offset();
		var ox=ofs.left;
		var oy=ofs.top;
		var cx=((px-ox)*360)/clientw;
		var cy=((py-(oy+clienth*0.2))*256)/(clienth*0.75);
		if(cx<0) cx=0; else if(cx>359) cx=359;
		if(cy<0) cy=0; else if(cy>255) cy=255;
		var v=255;
		if(0==ColorSelectMode){
			h = 360-cx;
			v = 255-cy;
		}else{
			s = ~~(256*(cx/360));
			v = 255-cy;
		}
		var f, i, p, q, t, r, g, b;
		i = ~~(Math.floor(h/60.0)%6);
		f = (h/60)-Math.floor(h/60);
		p = Math.round(v*(1-(s/255)));
		q = Math.round(v*(1-(s/255)*f));
		t = Math.round(v*(1-(s/255)*(1-f)));
		switch(i){
			case 0: r=v;g=t;b=p; break;
			case 1: r=q;g=v;b=p; break;
			case 2: r=p;g=v;b=t; break;
			case 3: r=p;g=q;b=v; break;
			case 4: r=t;g=p;b=v; break;
			case 5: r=v;g=p;b=q; break;
		}
		var rgbcolor="000000"+(((r&255)<<16)|((g&255)<<8)|(b&255)).toString(16);
		rgbcolor="#"+rgbcolor.substr(rgbcolor.length-6,6);
		$(o).css("background-color", rgbcolor);
		$(document.body).css("background-color", rgbcolor);
		$("#info").html("color:"+rgbcolor);
		if (v<128||s>128) {
			$(o).css("color", "#fff");
		} else {
			$(o).css("color", "#000");
		}
	};
	var toggleHueAndSatMode = function(o){
		ColorSelectMode++; ColorSelectMode%=3;
		if(0==ColorSelectMode){
			$(o).html('<p id="touchmode"><--- Hue Select ---><\/p>');
		}else if(1==ColorSelectMode){
			$(o).html('<p id="touchmode"><--- Saturation Select ---><\/p>');
		}else{
			$(o).html('<p id="touchmode">-- Pause --<\/p>');
		}
		$("p#touchmode").show("slow");
		$("p#touchmode").fadeOut("slow");
	};
	var showHelp = function(o){
		$(o).html('<p id="touchmode">MOUSE DRAG or MULTI TOUCH<br \/>to change saturation<\/p>');
		$("p#touchmode").show("slow");
		setTimeout(function(){
			$("p#touchmode").fadeOut("slow");
		},1800);
	}
	$("#toucharea").mousemove(function(e){
		setvalue(this,e.pageX,e.pageY);
	})
	.mousedown(function(e){
		ColorSelectMode=1;
		setvalue(this,e.pageX,e.pageY);
	})
	.mouseup(function(e){
		showHelp(this);
		ColorSelectMode=0;
	})
	.mouseout(function(e){
		ColorSelectMode=0;
	})
//	.click(function(){
//		toggleHueAndSatMode(this);
//	})
	.bind('touchstart',function(e){
		e.preventDefault()
//		toggleHueAndSatMode(this);
		showHelp(this);
	})
	.bind('touchmove', function(e){
		var touchevt = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
		if(1<e.originalEvent.touches.length){
			ColorSelectMode=1;
		}else{
			ColorSelectMode=0;
		}
		setvalue(this,touchevt.pageX,touchevt.pageY);
	});
	$(":button#hideUI").click(function(){
		$("#toucharea").css("border-color","transparent");
		$("#inittext").fadeOut("slow");
		$("#fullscreenBtns").fadeOut("slow");
	});
	$(":button#startFullScreen").click(function(){
		if (FullScreenAPI.isAvailable()) {
			$("#toucharea").css("border","none");
			$("#toucharea").css("width",screen.width).css("height",screen.height);
			$("#inittext").fadeOut("slow");
			$("#toucharea").startFullScreen();
			fullscreenOn=true;
		} else {
			alert("Your browser does not support fullscreen mode.");
			$("#toucharea").css("border-color","transparent");
			$("#toucharea").css("width","95%").css("height",(($(window).height()*80)/100));
			$("#fullscreenBtns").fadeOut("slow");
			$("#inittext").fadeOut("slow");
		}
	});
	$("#inittext").mousemove(function(e){
		$(this).hide();
	})
	.bind('touchstart', function(e){
		$(this).hide();
	})
	.bind('touchmove', function(e){
		$(this).hide();
	});
	setInterval(function(){
		if (fullscreenOn && FullScreenAPI.getFullScreenElement() == null) {
			$("#inittext").fadeIn("slow");
			$("#fullscreenBtns").fadeIn("slow");
			$("#toucharea").css("width","360px").css("height","300px").css("border","1px dotted #000");
			fullscreenOn=false;
		}
	},500);

});

