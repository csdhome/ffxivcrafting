var crafting={init:function(){crafting.events(),crafting_tour.init()},events:function(){$("#toggle-crystals").click(crafting.toggle_crystals),"off"==localStorage.getItem("config:toggle-crystals")&&$("#toggle-crystals").trigger("click"),$("#obtain-these-items .collapsible").click(function(){$(this).find("i").toggleClass("glyphicon-chevron-down").toggleClass("glyphicon-chevron-up"),$(this).closest("tbody").find("tr:not(:first-child)").toggleClass("hidden")}),$(".needed input").change(function(){var e=$(this),t=e.closest("#CraftingList-section").length>0;crafting.recalculate_all(t),e.closest("tr").find(".total").html(e.val())}),$("input.obtained").change(function(){var e=$(this).closest("#CraftingList-section").length>0;return crafting.recalculate_all(e)}),$(".obtained-ok").click(function(){var e=$(this).closest("tr"),t=$("td.total",e).html();$("input.obtained",e).val(t).trigger("change")}),$("#clear-localstorage").click(crafting.clear_localstorage),crafting.set_localstorage_id(),crafting.restore_localstorage(),crafting.init_reagents(),crafting.recalculate_all(!0),$("#map_all, #map_remaining").click(function(e){e.preventDefault()}),$("#csv_download").click(function(e){e.preventDefault();var t=[["Item","iLevel","Yields","Needed","Purchase"]];$("tr.reagent").each(function(){var e=[],n=$(this);e.push(n.find("span.name").text()),e.push(n.data("ilvl")||n.find(".ilvl").text().replace(/\s|\n/gi,"")||"-"),e.push(n.data("yields")),e.push(n.find(".total").text()),e.push(n.find(".vendors").length?n.find(".vendors").text().replace(/\s|\n/gi,"")+" gil":""),t.push(e)});var n=$(".csv-filename").text().trim()+" "+$(".csv-filename + h2").text().trim();global.exportToCsv(n+".csv",t)})},toggle_crystals:function(){var e=$(this),t=e.closest("th").attr("colspan"),n=e.closest("tr");if(e.hasClass("off"))n.next("tr.crystals").remove(),$("[data-item-category=Crystal]").each(function(){$(this).show()}),e.removeClass("off"),localStorage.removeItem("config:toggle-crystals");else{var a=$("<th>",{colspan:t,class:"text-center"}),i=$("<tr>",{class:"crystals hidden"}).append(a);n.after(i),$("[data-item-category=Crystal]").each(function(){var e=$(this),t=e.data("itemId"),n=e.find(".name").first().html(),i=e.find("img").first().clone(!0,!0),r=parseInt(e.find(".total").html()),l=0==r?"success":"primary";e.hide(),i.removeClass("margin-right");var o=$("<span>",{id:"crystal-"+t,class:"crystal-container",html:'<span class="label label-'+l+'">'+r+"</span>",rel:"tooltip",title:n});o.tooltip(global.tooltip_options),o.append(i),a.append(o)}),i.removeClass("hidden"),e.addClass("off"),localStorage.setItem("config:toggle-crystals","off")}},localstorage_id:null,set_localstorage_id:function(){crafting.localstorage_id="page:"+encodeURIComponent(window.location.pathname),null!=crafting.localstorage_id.match("from-list")&&(crafting.localstorage_id=$("#CraftingList-section").find(".reagent").map(function(){return $(this).data("itemId")+"_"+$(this).find(".needed input").val()}).get().sort().join("|"))},clear_localstorage:function(e){e.preventDefault(),localStorage.removeItem(crafting.localstorage_id),location.reload()},restore_localstorage:function(){var e=JSON.parse(localStorage.getItem(crafting.localstorage_id));null!==e&&($(".reagent").not(".exempt").each(function(){var t=$(this),n=t.data("itemId"),a=t.find("input.obtained");void 0!==e.progress.hasOwnProperty("item"+n)&&e.progress["item"+n]>0&&a.val(e.progress["item"+n])}),$(".reagent.exempt").each(function(){var t=$(this),n=t.data("itemId"),a=t.find(".needed input"),i=t.find("input.obtained");void 0!==e.contents.hasOwnProperty("needed"+n)&&e.contents["needed"+n]>0&&a.val(e.contents["needed"+n]),void 0!==e.contents.hasOwnProperty("item"+n)&&e.contents["item"+n]>0&&i.val(e.contents["item"+n])}))},store_localstorage:function(){var e={progress:{},contents:{}};$(".reagent").not(".exempt").each(function(){var t=$(this),n=t.data("itemId"),a=t.find("input.obtained"),i=parseInt(a.val());i>0&&(e.progress["item"+n]=i)}),$(".reagent.exempt").each(function(){var t=$(this),n=t.data("itemId"),a=t.find(".needed input"),i=t.find("input.obtained"),r=parseInt(a.val()),l=parseInt(i.val());r>0&&(e.contents["needed"+n]=r),l>0&&(e.contents["item"+n]=l)}),localStorage.setItem(crafting.localstorage_id,JSON.stringify(e))},reagents:[],init_reagents:function(){$(".reagent").each(function(){var e=$(this),t={name:e.find('a[href^="http"]').text().trim(),exempt:e.hasClass("exempt"),item_id:e.data("itemId"),yields:e.data("yields"),reagents:[],needed:0,obtained:0,total:0,remainder:0,elements:{row:e,needed:$("td.needed span",e).length>0?$("td.needed span",e):$("td.needed input",e),obtained:$("input.obtained",e),total:$("td.total",e)}};if(requires=e.data("requires").split("&"),t.exempt&&$("tr.reagent:not(.exempt)[data-item-id="+t.item_id+"]").length>0&&(requires[requires.length]="1x"+t.item_id),1==requires.length&&""==requires[0])t.reagents=null;else for(var n=0;n<requires.length;n++){var a=requires[n].split("x");t.item_id!=a[1]&&(t.reagents[t.reagents.length]={item_id:a[1],quantity:parseInt(a[0])})}crafting.reagents[crafting.reagents.length]=t})},recalculate_all:function(e){for(var t=0;t<crafting.reagents.length;t++){var n=crafting.reagents[t];if(n.obtained=parseInt(n.elements.obtained.val()),n.total=0,n.remainder=0,1==n.exempt){n.needed=parseInt(n.elements.needed.val()),n.elements.obtained.attr("max",n.needed),n.elements.row[(n.needed-n.obtained==0?"add":"remove")+"Class"]("success");var a=Math.ceil(Math.max(n.needed-n.obtained,0)/n.yields);crafting.oven(n,a,e)}else n.needed=0}for(var t=0;t<crafting.reagents.length;t++){var n=crafting.reagents[t];if(1!=n.exempt&&null!=n.reagents){var a=Math.ceil(Math.min(0-n.obtained,0)/n.yields);crafting.oven(n,a,e)}}for(var t=0;t<crafting.reagents.length;t++){var n=crafting.reagents[t];if(1!=n.exempt){if(n.needed=n.needed-n.obtained,n.needed<0){n.obtained+=n.needed;var i=Math.ceil(n.obtained/n.yields)*n.yields;n.elements.obtained.val(i<0?0:i),n.needed=0}var r=Math.ceil(n.needed/n.yields)*n.yields,l=Math.ceil(n.total/n.yields)*n.yields;n.elements.needed.html(r),n.elements.obtained.attr("max",l),n.elements.total.html(n.total<0?0:Math.ceil(n.total/n.yields)*n.yields),n.elements.row[(0==n.needed?"add":"remove")+"Class"]("success")}}crafting.store_localstorage(),$("tr.crystals").length>0&&$("[data-item-category=Crystal]").each(function(){var e=$(this),t=e.data("itemId"),n=parseInt(e.find(".total").html()),a=$("#crystal-"+t).find(".label");a.html(n),a.toggleClass("label-primary",0!=n),a.toggleClass("label-success",0==n)})},oven:function(e,t,n){if(null!=e.reagents)e:for(var a=0;a<e.reagents.length;a++)for(var i=e.reagents[a],r=0;r<crafting.reagents.length;r++){var l=crafting.reagents[r];if(l.item_id==i.item_id){var o=t*i.quantity;if(l.needed+=o,l.total+=o,l.remainder>0){var s=Math.min(o,l.remainder);o-=s,l.remainder-=s}var c=Math.ceil(o/l.yields);l.remainder+=c*l.yields-o,crafting.oven(l,c,n);continue e}}}},crafting_tour={tour:null,first_run:!0,init:function(){var e=$("#start_tour");crafting_tour.tour=new Tour({orphan:!0,onStart:function(){return e.addClass("disabled",!0)},onEnd:function(){return e.removeClass("disabled",!0)}}),e.click(function(e){e.preventDefault(),$("#toggle-slim").bootstrapSwitch("status")&&$("#toggle-slim").bootstrapSwitch("setState",!1),1==crafting_tour.first_run&&crafting_tour.build(),$(this).hasClass("disabled")||crafting_tour.tour.restart()})},build:function(){crafting_tour.tour.addSteps([{element:"#CraftingList-section",title:"Recipe List",content:"The list at the bottom is your official Recipe List.  You will be making these items.",placement:"top"},{element:"#Gathered-section tr:first-child",title:"Gathered Section",content:"Items you can gather with MIN, BTN or FSH will appear in the Gathered Section.",placement:"bottom"},{element:"#Bought-section tr:first-child",title:"Bought Section",content:"Items you cannot gather will be thrown into the Bought Section.",placement:"bottom"},{element:"#Other-section tr:first-child",title:"Other Section",content:"Items that cannot be bought or gathered show up in the Other Section.  Most likely these will involve monster drops.",placement:"bottom"},{element:"#PreRequisiteCrafting-section tr:first-child",title:"Pre-Requisite Crafting",content:"Why buy what you can craft?  The Crafted Section contains items necessary for your main recipes to finish.  The previous sections will already contain the sub items required.",placement:"bottom"},{element:"#self-sufficient-form",title:"Self Sufficient",content:"By default it assumes you want to be Self Sufficient.  Turning this option off will eliminate the Gathering and Crafting aspect and appropriately force the items into either Bought or Other.",placement:"top"},{element:"#leveling-information",title:"Leveling Information",content:"Pay attention to the Leveling Information box as it will give you a heads up as to what your next quest turn ins will require.",placement:"top"}]),crafting_tour.first_run=!1}};$(crafting.init);