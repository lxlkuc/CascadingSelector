// Cascading selector
// created by kuc(angel211@vip.sina.com)

(function($) {
    "use strict";

    $.extend({
        CascadingSelectorSetup : function(options) {
            return $.extend(options);
        }
    }).fn.extend({
        CascadingSelector : function(options) {

            options = $.extend({}, options);

            return $(this).each(function() {
                var $element, $trigger, $selector, inputHTML, triggerHTML, selectorHTML, selectors, $selected;
                var cs_width = 400;
                var cs_height = 240;
                
                $element = $(this);

                if (!options.id) {
                    options.id = 'cs'+Math.ceil(Math.random() * 1000000);
                }
                console.log(options.id);

                selectors = ['site', 'departments_id', 'sections_id', 'teams_id'];
                if (options.selectors) {
                    selectors = options.selectors;
                }

                $selected = [0, 0, 0];
                if (options.selected != undefined) {
                    $selected = options.selected;
                }

                if (!options.theme) {
                    options.theme = 'adminlte';
                }
                
                switch (options.theme) {
                    case 'adminlte':
                        selectorHTML = '<div id="'+options.id+'" class="box '+options.wrapperClass+'"><div class="cs-header box-header"><div class="box-tools pull-right"><button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times" style="padding: .9em .5em;"></i></button></div><ol class="breadcrumb" style="margin:0;"></ol></div><div class="cs-body box-body" style="width:100%;height:'+(cs_height-80)+'px;overflow:auto;"></div>'+(options.submit == true ? '<div class="box-footer"><button type="button" class="btn btn-primary cs-submit pull-right">选择</button></div>' : '')+'</div>';
                        break;
                    case 'bootstrap':
                        selectorHTML = '<div id="'+options.id+'" class="panel panel-default'+options.wrapperClass+'"><div class="panel-heading"><ul>省市</ul></div><div class="panel-body">2</div></div>';
                        break;
                    default:
                        selectorHTML = '<div id="'+options.id+'" class="cs-wrapper '+options.wrapperClass+'"><div class="cs-header"><ul>省市</ul></div><div class="cs-body">2</div></div>';
                        break;
                }

                triggerHTML = ' <a href="'+options.url+'" id="'+options.id+'_trigger">选择</a>';
                
                if ($element.find('input[name='+options.target+']').length == 0) {
                    inputHTML = '<input type="hidden" value="'+options.selected+'" name="'+options.target+'" class="target_value">';
                }

                if ($element.find('span.target_text').length == 0) {
                    var target_text = $element.text();
                    $element.html('<span class="target_text">'+target_text+'</span>');
                }
                
                $element.append(inputHTML + triggerHTML + selectorHTML);

                $trigger = $element.find('#'+options.id+'_trigger');
                $selector = $element.find('#'+options.id);
                $selector.css('position', 'absolute').css('z-index', '100').css('box-shadow', '0 0 20px #666').css('width', cs_width)/* .css('height', cs_height) */.hide();

                $trigger.click(function(event) {
                    event.preventDefault();
                    $selector.show();
                    if ($selector.find('.cs-header ol.breadcrumb').text() == '') {
                        selectOne(0);
                    }
                });

                var selectOne = function(id) {
                    $selector.find('.cs-body').html('<i class="fa fa-spinner fa-spin fa-fw"></i>');
                    var ajaxUrl = options.url + (options.url.match(/\?/) ? '&' : '?') + 'id=';
                    $.ajax({
                        method: 'GET',
                        url: ajaxUrl + id,
                        dataType: 'json',
                        statusCode: {
                            500: function() {
                                $selector.find('.cs-body').text('500: server error');
                            },
                            404: function() {
                                $selector.find('.cs-body').text('404: page not found');
                            },
                            403: function() {
                                $selector.find('.cs-body').text('403: unauthorized');
                            },
                            200: function(data) {
                                $selector.find('.cs-header .breadcrumb li a').removeClass('btn-primary').addClass('btn-link');
                                if ($selector.find('.cs-header .breadcrumb li').length > 0 && $selector.find('.cs-header .breadcrumb li:last a').attr('data-id') == data.id) {
                                    $selector.find('.cs-header .breadcrumb li:last a').removeClass('btn-link').addClass('btn-primary');
                                } else {
                                    $selector.find('.cs-header ol.breadcrumb').append('<li><a class="btn btn-primary btn-xs" href="'+ajaxUrl + id+'" data-id="'+data.id+'" data-index="'+$selector.find('.cs-header ol.breadcrumb li').length+'">'+data.text+'</a></li>');
                                }
                                $selector.find('.cs-body').html('<ul class="list-inline"></ul>');
                                for (var i = 0; i < data.children.length; i++) {
                                    var oneLink = '<li><a href="'+ajaxUrl + data.children[i].id+'" data-id="'+data.children[i].id+'" data-children="'+data.children[i].children+'" class="btn btn-xs '+(data.children[i].children == false ? (data.children[i].id == $element.find('input[name='+options.target+']').val() ? 'btn-primary' : 'btn-default') : 'btn-link')+'">'+data.children[i].text+'</a></li>';

                                    if (data.children[i].group != undefined && data.children[i].group != 0) {
                                        if ($selector.find('.cs-body ul').length < (data.children[i].group + 1)) {
                                            for (var j = 0; j < data.children[i].group + 1 - $selector.find('.cs-body ul').length; j++) {
                                                $selector.find('.cs-body').append('<ul class="list-inline"></ul>');
                                            }
                                        }
                                        $selector.find('.cs-body ul:eq('+data.children[i].group+')').append(oneLink);
                                    } else {
                                        $selector.find('.cs-body ul:first').append(oneLink);
                                    }
                                }
                                setLinkAction();
                            }
                        }
                    });
                };

                var setLinkAction = function() {
                    $selector.find('.cs-header .breadcrumb a:last').unbind('click')
                    .click(function(event) {
                        event.preventDefault();
                        $selector.find('.cs-header .breadcrumb li:gt('+($(this).attr('data-index'))+')').remove();
                        selectOne($(this).attr('data-id'));
                    });
                    $selector.find('.cs-body a').click(function(event) {
                        event.preventDefault();
                        $selector.find('.cs-body a').removeClass('btn-primary').addClass('btn-default');
                        if ($(this).attr('data-children') == 'true') {
                            selectOne($(this).attr('data-id'));
                        } else {
                            $(this).removeClass('btn-default').addClass('btn-primary');
                            $element.find('input[name='+options.target+']').val($(this).attr('data-id'));
                            $element.find('span.target_text').text($(this).text());
                            $selector.hide();
                        }
                        
                    });
                };

                $('.cs-submit').click(function() {
                    var current = $selector.find('.cs-header .breadcrumb a.btn-primary:first');
                    if (current.length > 0) {
                        $element.find('input[name='+options.target+']').val(current.attr('data-id'));
                        $element.find('span.target_text').text(current.text());
                        $selector.hide();
                    }
                });
            });
        }
    });
})(jQuery);
