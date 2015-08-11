function parseHashBangArgs(aURL) {
    aURL = aURL || window.location.href;

    var vars = {};
    var hashes = aURL.slice(aURL.indexOf('#') + 1).split('&');

    for(var i = 0; i < hashes.length; i++) {
        var hash = hashes[i].split('=');

        if(hash.length > 1) {
            vars[hash[0]] = hash[1];
        } else {
            vars[hash[0]] = null;
        }      
    }

    return vars;
}


$(document).ready(function() {

	var $items = $('#items'),
		$baseItem = $items.find('.item:eq(0)').clone(),
		$offscreen = $('#offscreen'),
		update,
		createItem;

	createItem = function(selector, $prev) {
		var $item = $baseItem.clone(),
			$input = $item.find('.input').val(selector),
			$selector = $item.find('.col-xs-12 .selector'),
			$specificityZ = $item.find('.specificity .type-z'),
			$specificityA = $item.find('.specificity .type-a'),
			$specificityB = $item.find('.specificity .type-b'),
			$specificityC = $item.find('.specificity .type-c'),
			update;

		update = function(e) {
			var input = $input.val(),
				result,
				specificity,
				highlightedSelector,
				i, len, part, text1, text2, text3;

			// Resize the textarea to fit contents
			
			(function() {
				var $temp = $('<div class="selector"></div>'),
					lastChar = input.substr(input.length-1),
					height;

				if (lastChar === '\n' || lastChar === '\r') {
					$temp.text(input + ' ');
				} else {
					$temp.text(input);
				}
        
        $temp.width($selector.width()+"px")
				$offscreen.append($temp);
				height = $temp.height();
				$temp.remove();
				$input.height(height + 'px');
				$selector.height(height + 'px');
			}());
      

			result = SPECIFICITY.calculate(input);

			if (result.length === 0) {
				$selector.text(' ');
				$specificityZ.text('0');
				$specificityA.text('0');
				$specificityB.text('0');
				$specificityC.text('0');
				return;
			}

			result = result[0];
			specificity = result.specificity.split(',');
			$specificityZ.text(specificity[0]);
			$specificityA.text(specificity[1]);
			$specificityB.text(specificity[2]);
			$specificityC.text(specificity[3]);

			highlightedSelector = result.selector;
			for (i = result.parts.length - 1; i >= 0; i -= 1) {
				part = result.parts[i];
				text1 = highlightedSelector.substring(0, part.index);
				text2 = highlightedSelector.substring(part.index, part.index + part.length);
				text3 = highlightedSelector.substring(part.index + part.length);
				highlightedSelector = text1 + '<span class="type-' + part.type + '">' + text2 + '</span>' + text3;
			}
			$selector.html(highlightedSelector);
		};

		$input.keyup(update);
		update();
		if ($prev) {
			$prev.after($item);
		} else {
			$items.append($item);
		}
		setTimeout(function() {
      update();
			$item.removeClass('is-small');
		}, 100);
	};

	$items.empty();
  
  if(window.location.hash) {
                
    var hashes = parseHashBangArgs();
    
    if (hashes.rule) {
       createItem(decodeURIComponent(hashes.rule));
    }
  
  } else {

    createItem('li:first-child h2 .title');
  }
    
    
	
  
  $("a[data-rule]").click(function(){
    $items.empty();
    createItem($(this).data("rule"));
  });

});
