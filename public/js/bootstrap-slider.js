!function(a){var b=function(b,c){this.element=a(b),this.picker=a('<div class="slider"><div class="slider-track"><div class="slider-selection"></div><div class="slider-handle"></div><div class="slider-handle"></div></div><div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div></div>').insertBefore(this.element).append(this.element),this.id=this.element.data("slider-id")||c.id,this.id&&(this.picker[0].id=this.id),"undefined"!=typeof Modernizr&&Modernizr.touch&&(this.touchCapable=!0);var d=this.element.data("slider-tooltip")||c.tooltip;switch(this.tooltip=this.picker.find(".tooltip"),this.tooltipInner=this.tooltip.find("div.tooltip-inner"),this.orientation=this.element.data("slider-orientation")||c.orientation,this.orientation){case"vertical":this.picker.addClass("slider-vertical"),this.stylePos="top",this.mousePos="pageY",this.sizePos="offsetHeight",this.tooltip.addClass("right")[0].style.left="100%";break;default:this.picker.addClass("slider-horizontal").css("width",this.element.outerWidth()),this.orientation="horizontal",this.stylePos="left",this.mousePos="pageX",this.sizePos="offsetWidth",this.tooltip.addClass("top")[0].style.top=-this.tooltip.outerHeight()-14+"px"}this.min=this.element.data("slider-min")||c.min,this.max=this.element.data("slider-max")||c.max,this.step=this.element.data("slider-step")||c.step,this.value=this.element.data("slider-value")||c.value,this.value[1]&&(this.range=!0),this.selection=this.element.data("slider-selection")||c.selection,this.selectionEl=this.picker.find(".slider-selection"),"none"===this.selection&&this.selectionEl.addClass("hide"),this.selectionElStyle=this.selectionEl[0].style,this.handle1=this.picker.find(".slider-handle:first"),this.handle1Stype=this.handle1[0].style,this.handle2=this.picker.find(".slider-handle:last"),this.handle2Stype=this.handle2[0].style;var e=this.element.data("slider-handle")||c.handle;switch(e){case"round":this.handle1.addClass("round"),this.handle2.addClass("round");break;case"triangle":this.handle1.addClass("triangle"),this.handle2.addClass("triangle")}this.range?(this.value[0]=Math.max(this.min,Math.min(this.max,this.value[0])),this.value[1]=Math.max(this.min,Math.min(this.max,this.value[1]))):(this.value=[Math.max(this.min,Math.min(this.max,this.value))],this.handle2.addClass("hide"),this.value[1]="after"==this.selection?this.max:this.min),this.diff=this.max-this.min,this.percentage=[100*(this.value[0]-this.min)/this.diff,100*(this.value[1]-this.min)/this.diff,100*this.step/this.diff],this.offset=this.picker.offset(),this.size=this.picker[0][this.sizePos],this.formater=c.formater,this.layout(),this.picker.on(this.touchCapable?{touchstart:a.proxy(this.mousedown,this)}:{mousedown:a.proxy(this.mousedown,this)}),"show"===d?this.picker.on({mouseenter:a.proxy(this.showTooltip,this),mouseleave:a.proxy(this.hideTooltip,this)}):this.tooltip.addClass("hide")};b.prototype={constructor:b,over:!1,inDrag:!1,showTooltip:function(){this.tooltip.addClass("in"),this.over=!0},hideTooltip:function(){this.inDrag===!1&&this.tooltip.removeClass("in"),this.over=!1},layout:function(){this.handle1Stype[this.stylePos]=this.percentage[0]+"%",this.handle2Stype[this.stylePos]=this.percentage[1]+"%","vertical"==this.orientation?(this.selectionElStyle.top=Math.min(this.percentage[0],this.percentage[1])+"%",this.selectionElStyle.height=Math.abs(this.percentage[0]-this.percentage[1])+"%"):(this.selectionElStyle.left=Math.min(this.percentage[0],this.percentage[1])+"%",this.selectionElStyle.width=Math.abs(this.percentage[0]-this.percentage[1])+"%"),this.range?(this.tooltipInner.text(this.formater(this.value[0])+" : "+this.formater(this.value[1])),this.tooltip[0].style[this.stylePos]=this.size*(this.percentage[0]+(this.percentage[1]-this.percentage[0])/2)/100-("vertical"===this.orientation?this.tooltip.outerHeight()/2:this.tooltip.outerWidth()/2)+"px"):(this.tooltipInner.text(this.formater(this.value[0])),this.tooltip[0].style[this.stylePos]=this.size*this.percentage[0]/100-("vertical"===this.orientation?this.tooltip.outerHeight()/2:this.tooltip.outerWidth()/2)+"px")},mousedown:function(b){this.touchCapable&&"touchstart"===b.type&&(b=b.originalEvent),this.offset=this.picker.offset(),this.size=this.picker[0][this.sizePos];var c=this.getPercentage(b);if(this.range){var d=Math.abs(this.percentage[0]-c),e=Math.abs(this.percentage[1]-c);this.dragged=e>d?0:1}else this.dragged=0;this.percentage[this.dragged]=c,this.layout(),a(document).on(this.touchCapable?{touchmove:a.proxy(this.mousemove,this),touchend:a.proxy(this.mouseup,this)}:{mousemove:a.proxy(this.mousemove,this),mouseup:a.proxy(this.mouseup,this)}),this.inDrag=!0;var f=this.calculateValue();return this.element.trigger({type:"slideStart",value:f}).trigger({type:"slide",value:f}),!1},mousemove:function(a){this.touchCapable&&"touchmove"===a.type&&(a=a.originalEvent);var b=this.getPercentage(a);this.range&&(0===this.dragged&&this.percentage[1]<b?(this.percentage[0]=this.percentage[1],this.dragged=1):1===this.dragged&&this.percentage[0]>b&&(this.percentage[1]=this.percentage[0],this.dragged=0)),this.percentage[this.dragged]=b,this.layout();var c=this.calculateValue();return this.element.trigger({type:"slide",value:c}).data("value",c).prop("value",c),!1},mouseup:function(){a(document).off(this.touchCapable?{touchmove:this.mousemove,touchend:this.mouseup}:{mousemove:this.mousemove,mouseup:this.mouseup}),this.inDrag=!1,0==this.over&&this.hideTooltip(),this.element;var b=this.calculateValue();return this.element.trigger({type:"slideStop",value:b}).data("value",b).prop("value",b),!1},calculateValue:function(){var a;return this.range?(a=[this.min+Math.round(this.diff*this.percentage[0]/100/this.step)*this.step,this.min+Math.round(this.diff*this.percentage[1]/100/this.step)*this.step],this.value=a):(a=this.min+Math.round(this.diff*this.percentage[0]/100/this.step)*this.step,this.value=[a,this.value[1]]),a},getPercentage:function(a){this.touchCapable&&(a=a.touches[0]);var b=100*(a[this.mousePos]-this.offset[this.stylePos])/this.size;return b=Math.round(b/this.percentage[2])*this.percentage[2],Math.max(0,Math.min(100,b))},getValue:function(){return this.range?this.value:this.value[0]},setValue:function(a){this.value=a,this.range?(this.value[0]=Math.max(this.min,Math.min(this.max,this.value[0])),this.value[1]=Math.max(this.min,Math.min(this.max,this.value[1]))):(this.value=[Math.max(this.min,Math.min(this.max,this.value))],this.handle2.addClass("hide"),this.value[1]="after"==this.selection?this.max:this.min),this.diff=this.max-this.min,this.percentage=[100*(this.value[0]-this.min)/this.diff,100*(this.value[1]-this.min)/this.diff,100*this.step/this.diff],this.layout()}},a.fn.slider=function(c,d){return this.each(function(){var e=a(this),f=e.data("slider"),g="object"==typeof c&&c;f||e.data("slider",f=new b(this,a.extend({},a.fn.slider.defaults,g))),"string"==typeof c&&f[c](d)})},a.fn.slider.defaults={min:0,max:10,step:1,orientation:"horizontal",value:5,selection:"before",tooltip:"show",handle:"round",formater:function(a){return a}},a.fn.slider.Constructor=b}(window.jQuery);