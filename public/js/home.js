var home={init:function(){$(".class-selector:not(.multi)").click(function(){$(".class-selector.active").removeClass("active")});$("#slider-range-min").slider({range:"min",value:$("#forecast").val(),min:0,max:5,slide:function(a,b){$("#forecast").val(b.value);$("#forecast_plural")[(b.value!=1?"remove":"add")+"Class"]("hidden")}});$("#forecast").val($("#slider-range-min").slider("value"));$(".quest-selector").click(function(){var a=$(this).data("job");$("fieldset.quests").addClass("hidden");$('fieldset.quests[data-job="'+a+'"]').removeClass("hidden")});$("#self_sufficient_switch").change(function(){$(".ss_yes, .ss_no").toggleClass("hidden")});$("#multi").change(function(){$(".jobs-list").toggleClass("hidden")})}};$(home.init);