var leves={init:function(){leves.events(),leves.decipher_hash(),leves.search()},decipher_hash:function(){var a=document.location.hash;return""==a?!1:(a=a.slice(1).split("|"),$("#class-selector").multiselect("deselect","CRP").multiselect("select",a[0].split(",")),$("#min-level").val(a[1]),$("#max-level").val(a[2]),$("#type-selector").multiselect("deselect",["Town","Courier","Field"]).multiselect("select",a[3].split(",")),"1"==a[4]&&$("#repeatable_only").prop("checked",!0),(""!=a[5]||""!=a[6]||""!=a[7])&&$(".toggle-advanced").trigger("click"),$("#leve_item").val(a[5]),$("#leve_name").val(a[6]),$("#leve_location").val(a[7]),!0)},events:function(){$("#class-selector").multiselect({buttonClass:"btn",buttonWidth:"auto",buttonContainer:'<div class="btn-group" />',maxHeight:!1,includeSelectAllOption:!0,buttonText:function(a){if(0==a.length)return'None selected <b class="caret"></b>';if(1==a.length)return'<img src="/img/jobs/'+$(a[0]).val().toUpperCase()+'-active.png" width="24" height="24"> <b class="caret"></b>';if(a.length>1)return a.length+' selected  <b class="caret"></b>';var b="";return a.each(function(){b+=$(this).text()+", "}),b.substr(0,b.length-2)+' <b class="caret"></b>'}}),$("#type-selector").multiselect({buttonClass:"btn",buttonWidth:"auto",buttonContainer:'<div class="btn-group" />',maxHeight:!1,includeSelectAllOption:!0,buttonText:function(a){if(0==a.length)return'None selected <b class="caret"></b>';if(a.length>1)return a.length+' selected  <b class="caret"></b>';var b="";return a.each(function(){b+=$(this).text()+", "}),b.substr(0,b.length-2)+' <b class="caret"></b>'}}),$(".leve-form").submit(function(a){a.preventDefault(),leves.search()}),$(".leve-form .filter-form").click(function(a){a.preventDefault(),$(".leve-form").submit()}),$(".toggle-advanced").click(function(a){a.preventDefault(),$(".advanced").toggleClass("hidden"),$(".advanced input").val("")}),$(".leve-text-search").keyup(function(a){13==a.which&&leves.search()}),$("#min-level, #max-level").change(function(){var a=$(this),b=parseInt(a.attr("min")),c=parseInt(a.attr("max")),d=parseInt(a.val());if(a.is("#max-level")){var e=parseInt($("#min-level").val());e>d&&(a.val(e),d=e)}else{var f=parseInt($("#max-level").val());d>f&&(a.val(f),d=f)}b>d&&(d=b),d>c&&(d=c),a.val(d)}),$("#save-setup").click(function(a){a.preventDefault(),global.set_cookie("previous_leve_load",document.location.hash),global.noty({type:"success",text:"Setup Saved"})}),$("#load-setup").click(function(a){a.preventDefault(),global.noty({type:"info",text:"Loading Setup"}),document.location.hash=decodeURIComponent(global.get_cookie("previous_leve_load")),leves.decipher_hash(),leves.search()})},search:function(){var a=[],b=[],c=$("#repeatable_only").is(":checked"),d=parseInt($("#min-level").val()),e=parseInt($("#max-level").val()),f=$("#leve_item").val(),g=$("#leve_name").val(),h=$("#leve_location").val();$("#class-selector + .btn-group input:checked").each(function(){a[a.length]=$(this).val()}),$("#type-selector + .btn-group input:checked").each(function(){b[b.length]=$(this).val()}),document.location.hash=[a.join(","),d,e,b.join(","),1==c?1:0,f,g,h].join("|"),$(".leve_rewards").popover("destroy"),$.ajax({url:"/levequests/populate-advanced",type:"get",dataType:"html",data:{classes:a,types:b,repeatable_only:c,min_level:d,max_level:e,leve_item:f,leve_name:g,leve_location:h},beforeStart:function(){global.noty({type:"info",text:"Searching for Leves"})},success:function(a){$(".leve-table tbody").html(a),"undefined"!=typeof XIVDBTooltips&&XIVDBTooltips.initialize(),global.reset_popovers(),$("[rel=tooltip]").tooltip(global.tooltip_options)}})}};$(leves.init);