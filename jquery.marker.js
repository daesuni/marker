
	// Jquery Marker v1.0.0
	// https://github.com/daesuni/marker
	// Author: Daesung Jeon
	// License: MIT

	;(function ($) {
	
	    'use strict';
	    
	    var mark = 'ø^˚';
        var class_default = 'marker';
        var class_active = 'marker-active';
        var attr_unqName = 'data-unique-name';
        var attr_order = 'data-order';
        
	    $.widget('ds.marker', {
	    	
	        options: {
	        	
				minimum : 3,
				maximum : 3000,
				overlap : false,
				colorPicker : true,
				style : {
				   'background' : 'rgba(249, 255, 0, 0.2)',
				},
				activeRemove : true,
				caseSensitive : true,
				add : undefined,
				remove : undefined,
				colorChange : undefined,
				mouseenter : undefined,
				mouseleave : undefined,
				debug : undefined,
				
	        },
	        
	        _create: function() {
	        	
	    		var _that = this;
	        	var isDragging = false;
	    		
	    		var that_mouseup = function that_mouseup(e) {
	    			
	    			isDragging = false;
			        
	    			e.preventDefault();

	            	var _this = this;
	            	
						var _target = e.target;
						var kc = e.which;
						
						if (kc === 1) {
							
							e.preventDefault();
							
							var block, range, tempRange, before = '', after = '';
		
							if (window.getSelection) {
		
								block = window.getSelection();
								if (block.rangeCount) {
									range = block.getRangeAt(0);
								} else {
									range = document.createRange();
									range.collapse(true);
								};
		
								if (!_that._validatemarker(range)[0]) {
									_that._callback('debug', e, _that._validatemarker(range)[1]);
									return;
								};
		
								tempRange = document.createRange();
								tempRange.selectNodeContents(_this);
								tempRange.setEnd(range.startContainer, range.startOffset);
		
								var expandedSelRange = range.cloneRange();
								var el = document.createElement('div');
									el.innerHTML = mark;
								var frag = document.createDocumentFragment(), node, lastNode;
								while ((node = el.firstChild)) {
									lastNode = frag.appendChild(node);
								};
								range.insertNode(frag);
								before = tempRange.toString();
		
								tempRange.selectNodeContents(_this);
								tempRange.setStart(range.endContainer, range.endOffset);
								tempRange.insertNode(document.createTextNode(mark));
								//after = tempRange.toString();
		
								tempRange.detach();
		
							} else if (document.selection && document.selection.type != 'Control') {
		
								range = block.createRange();
		
								if (!_that._validatemarker(range)[0]) {
									_that._callback('debug', e, _that._validatemarker(range)[1]);
									return;
								};
		
								tempRange = document.body.createTextRange();
								tempRange.moveToElementText(_this);
								tempRange.setEndPoint('EndToStart', range);
								expandedSelRange = range.duplicate();
								range.pasteHTML(mark);
								expandedSelRange.setEndPoint('EndToEnd', range);
								before = tempRange.text;
		
								tempRange.moveToElementText(_this);
								tempRange.setEndPoint('StartToEnd', range);
								//after = tempRange.text;
							}
		
							var htmlArr = $(_this).html().toString().split(mark);
							var selHtml = htmlArr[1];
							var tagRegex = /(<[^>]*>)/g;
							var selHtmlArr = selHtml.split(tagRegex);
							var newHtml = '';
							var unqName = _that._generateUnqName();
		
							$.each(selHtmlArr, function(k, v) {
								if (tagRegex.test(v)) {
									newHtml += v;
								} else {
									before += v;
									if (v.trim().length > 0) {
										var $_span = $('<span/>');
											$_span.addClass(class_default);
											$_span.attr(attr_unqName, unqName);
											$_span.attr(attr_order, _that._getTextOccur(before, v));
											$.each(_that.options.style, function(prop, value) {
												$_span.css(prop, value);
											});
											$_span.append(v);
										newHtml += $_span[0].outerHTML;
									} else {
										newHtml += v;
									};
								};
							});
		
							htmlArr[1] = newHtml; 
							$(_this).html(htmlArr.join(''));
		
							_that._deselection();
							
							_that._callback('add', e);
							
						} else if (kc === 3) {
							
							e.preventDefault();
							
							if ($(_target).hasClass(class_default) && _that.options.activeRemove) {
								
								var unqName = $(_target).attr(attr_unqName);
								var target = $(_this).find('.' + class_default + '[' + attr_unqName + '="' + unqName + '"]');
								_that.clear(target);
								
							};
						};
				};
				
				var marker_mouseenter = function marker_mouseenter(e) {

					_that._callback('mouseenter', e);
					
					if (isDragging == true) { return; }
					
					$('.' + class_active).removeClass(class_active);
					var unqName = $(e.target).attr(attr_unqName);
					$('.' + class_default + '[' + attr_unqName + '="' + unqName + '"]').addClass(class_active);

					if ($(e.target).hasClass(class_default) && $(e.relatedTarget).hasClass(class_default) && ($(e.target).attr(attr_unqName) != $(e.relatedTarget).attr(attr_unqName))) {
						$('.' + class_active).removeClass(class_active);
						var targetUnqName = $(e.target).attr(attr_unqName);
						$('.' + class_default + '[' + attr_unqName + '="' + targetUnqName + '"]').addClass(class_active);
					};
					
				};
				
				var marker_mouseleave = function marker_mouseleave(e) {
					
					_that._callback('mouseleave', e);
					
					$('.' + class_active).removeClass(class_active);

					if (isDragging == true) { return; };
					
					if ($(e.target).hasClass(class_default) && $(e.relatedTarget).hasClass(class_default) && ($(e.target).attr(attr_unqName) != $(e.relatedTarget).attr(attr_unqName))) {
						$('.' + class_active).removeClass(class_active);
						var targetUnqName = $(e.relatedTarget).attr(attr_unqName);
						$('.' + class_default + '[' + attr_unqName + '="' + targetUnqName + '"]').addClass(class_active);
					};
						
				};
				
				var that_mousedown = function that_mousedown(e) {
					if (e.which == 1) { isDragging = true; };
				};
				
				var that_mousemove = function that_mousemove(e) {
					if (isDragging == true && $('#color-picker').length > 0 && _that.options.colorPicker == true) {
						$('#color-picker').spectrum('disable');
						$('#color-picker').spectrum('destroy');
						$('#color-picker').remove();
					};
				};
				
				var that_contextmenu = function that_contextmenu(e) {
					e.preventDefault();
				};
				
				var marker_click = function marker_click(e) {
					
					e.stopPropagation();
					
					_that._callback('click', e);
					
					if (_that.options.colorPicker == true) {
						var unqName = $(e.target).attr(attr_unqName);
						var $_target = $('.' + class_default + '[' + attr_unqName + '="' + unqName + '"]');
						
						var colorPicker = $('<input type="text" id="color-picker" />');
						
						$('#color-picker').spectrum('disable');
						$('#color-picker').spectrum('destroy');
						$('#color-picker').remove();
						$('body').append(colorPicker);
						
						$('#color-picker').spectrum({
							color: $_target.first().css('background-color'),
							flat: true,
							showAlpha: true,
							showButtons: false,
							change: function(color) {
								$_target.css('background-color', 'rgba(' + Math.round(color._r) + ', ' + Math.round(color._g) + ', ' + Math.round(color._b) + ', ' + color._a + ')');
								$('#color-picker').spectrum('disable');
								$('#color-picker').spectrum('destroy');
								$('#color-picker').remove();
								
								_that._callback('colorChange', e);
							},
							move: function(color) {
								$_target.css('background-color', 'rgba(' + Math.round(color._r) + ', ' + Math.round(color._g) + ', ' + Math.round(color._b) + ', ' + color._a + ')');
							}
						});
						
						$('#color-picker').spectrum('container').css({
							'position' : 'absolute',
							'top' : e.pageY,	
							'left' : e.pageX
						});
					};
				};
				
				_that.element.on('contextmenu', that_contextmenu);
				_that.element.on('mousedown', that_mousedown);
				_that.element.on('mouseup', that_mouseup);
				_that.element.on('mouseenter', '.' + class_default, marker_mouseenter);
				_that.element.on('mouseleave', '.' + class_default, marker_mouseleave);
				_that.element.on('click', '.' + class_default, marker_click);
				_that.element.on('mousemove', that_mousemove);
				
				
				return _that;
	        },
	        
	        _destroy: function() {
	        	var _that = this;
	        	_that.clear();
	        	_that.element.off();
	        },
	        
	        _callback: function(callback, e, data) {
	        	var _that = this;
				_that._trigger(callback, e, [data]);
			},
	        
			restore: function(data) {
				
				var _that = this;
				_that.clear();
				var tagRegex = /(<[^>]*>)/g;
				var htmlArr = _that.element.html().split(tagRegex);
				var tagArr = [];
				
				$.each(htmlArr, function(k, v) {
					//tagRegex.test(v) ? tagArr.push({ idx: k, value: v }) : textArr.push({ idx: k, value: v });
					if (tagRegex.test(v)) {
						tagArr.push(v);
						htmlArr[k] = mark;
					};
				});
				
				var htmlArrJoin = htmlArr.join('');
				
				$.each(data, function(k, v) {
					var pos;
					if (_that.options.caseSensitive) {
						pos = fn_getPosition(htmlArrJoin, v.text, v.order);
					} else {
						pos = fn_getPosition(htmlArrJoin.toLowerCase(), v.text.toLowerCase(), v.order);
					}
					htmlArrJoin = fn_insertString(htmlArrJoin, v, pos);
				});
				
				for (var i = 0; i < tagArr.length; i++) {
					htmlArrJoin = htmlArrJoin.replace(mark, tagArr[i])
				};
				
				_that.element.html(htmlArrJoin);
				
				// str에서 n번째 출연한 find의 위치
				function fn_getPosition(str, find, n) {
					return str.split(find, n).join(find).length;
				}
				
				// str의 pos위치에 insert를 태그로 감싸기
				function fn_insertString(str, insert, pos) {
					var length = insert.text.length;
					return str.slice(0, pos) + '\<span class="' + class_default + '" ' + attr_unqName + '="' + insert.uniqueName + '" ' + attr_order + '="' + insert.order + '" style="' + insert.style + '" \>' + str.slice(pos, pos + length) + '\</span\>' + str.slice(pos + length);
				}
				
			},
			
	        data: function(e) {
	        	var _that = this;
	        	var target = _that.element.find('.' + class_default);
	        	var data = [];
	        	
	        	$.each(target, function(k, v) {
	        		var temp = {
        				'style' : $(v).attr('style'),
        				'order' : $(v).attr(attr_order),
        				'uniqueName' : $(v).attr(attr_unqName),
        				'text'	: $(v).text(),
	        		}
	        		data.push(temp);
				});
	        	//console.log(JSON.stringify(data))
	        	_that._callback('data', e, data);
	        },
	        
	        clear: function(tgt, e) {
	        	
	        	var _that = this;
	        	var target = tgt;
	        	if (!target) {
	        		target = _that.element.find('.' + class_default);
				}
	        	$.each(target, function(k, v) {
	        		$(v).off();
					$(v).contents().unwrap();
				});
	        	
	        	if (_that.options.colorPicker == true) {
	        		$('#color-picker').spectrum('disable');
					$('#color-picker').spectrum('destroy');
					$('#color-picker').remove();
				}
	        	_that._callback('remove', e);
	        },
	        
	        _generateUnqName : function() {
	        	function chr4() {
					return Math.random().toString(16).slice(-4);
				}
				return chr4() + chr4() + '-' + chr4() + '-' + chr4() + '-' + chr4() + '-' + chr4() + chr4() + chr4();
	        },
	        
	        _validatemarker : function(range, e) {
	        	var _that = this;
				var val = true;
				var message;
				
				if (val && range.toString().length == 0) {
					_that._deselection();
					val = false;
				};

				if (val && range.toString().length < _that.options.minimum) {
					_that._deselection();
					if (_that.options.debug) {
						message = 'Block setting can be at least ' + _that.options.minimum + ' characters.\nSet the "minimum" option to a smaller size if you want to set marker.';
					};
					val = false;
				};
				
				if (val && range.toString().length > _that.options.maximum) {
					_that._deselection();
					if (_that.options.debug) {
						message = 'Block settings can be up to ' + _that.options.maximum + ' characters.\nSet the "maximum" option to a larger size if you want to set marker.';
					};
					val = false;
				};

				if (val && _that._getParentNode(range).className.indexOf(class_default) > -1 && _that.options.overlap == false) {
					_that._deselection();
					if (_that.options.debug) {
						message = 'Set the "overlap" option to "true" if you want to set overap marker.';
					}
					val = false;
				};

				//if (val && $(range.cloneContents()).find('*').filter('.' + class_default).length > 0 && _that.options.overlap == false) {
				if (val && $(range.cloneContents()).children().find('*').filter('.' + class_default).length + $(range.cloneContents()).children().find('*').prevObject.filter('.' + class_default).length > 0 && _that.options.overlap == false) {
					_that._deselection();
					if (_that.options.debug) {
						message = 'Set the "overlap" option to "true" if you want to set overap marker.';
					}
					val = false;
				};

				return [val, message];
			},
			
			_getTextOccur : function(string, substring) {
				var n = 0;
				var pos = 0;
				var _that = this;
				while (true) {
					if (_that.options.caseSensitive) {
						pos = string.indexOf(substring, pos);
					} else {
						pos = string.toLowerCase().indexOf(substring.toLowerCase(), pos);
					}
					if (pos != -1) {
						n++;
						pos += substring.length;
					} else {
						break;
					}
				}
				return n;
			},
	        
			_deselection : function() {
				if (window.getSelection) {
					if (window.getSelection().empty) {
						window.getSelection().empty();
					} else if (window.getSelection().removeAllRanges) {
						window.getSelection().removeAllRanges();
					}
				} else if (document.selection) {
					document.selection.empty();
				}
			},
	        
			_getParentNode : function(range) {
				var node;
				if (window.getSelection) {
					node = range.commonAncestorContainer;
				} else if (document.selection && document.selection.type != 'Control') {
					node = range.parentElement();
				}

				while (node) {
					if (node.nodeType == 1 && node.tagName != 'undefined') {
						return node;
					}
					node = node.parentNode;
				}
			}
	        
	    });
	    
	}(jQuery));

	$(window).scroll(function() {
		$('#color-picker').spectrum('disable');
		$('#color-picker').spectrum('destroy');
		$('#color-picker').remove();
	});
	