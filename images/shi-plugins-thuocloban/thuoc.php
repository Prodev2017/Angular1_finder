<script>
     var jshi_loban = jQuery.noConflict();
                    //Mỗi đoạn thước dài 1000mm
                    var rulerLength = 1000; //Số đo 1 đoạn thước (mm)
                    var trimStart = 0;  //Số đo đầu của thước (mm)
                    var trimEnd = 1000; //Số đo cuối của thước (mm)

                    var myScroll;

                    function pullRightAction() {
                        if (trimStart > 0) {
                            jshi_loban('#scroller').width(function(i, width) {
                                return width + 10000;
                            });
                            trimStart -= rulerLength;
                            var qStr = '?trimStart=' + trimStart + '&rulerLength=' + rulerLength;
           var newLi = jshi_loban('<li>').append(jshi_loban('<img/>', {src: '<?php echo SHI_THUOC_PLUGIN_URL ; ?>/thuoc522.php' + qStr}))
                                    .append(jshi_loban('<img/>', {src: '<?php echo SHI_THUOC_PLUGIN_URL ; ?>/thuoc429.php' + qStr}))
                                    .append(jshi_loban('<img/>', {src: '<?php echo SHI_THUOC_PLUGIN_URL ; ?>/thuoc388.php' + qStr}));
                            jshi_loban('#thelist').prepend(newLi);
                            myScroll.refresh();
                        }
                    }

                    function pullLeftAction() {
                        if (trimEnd < 100000) {
                            jshi_loban('#scroller').width(function(i, width) {
                                return width + 10000;
                            });
                            var qStr = '?trimStart=' + trimEnd + '&rulerLength=' + rulerLength;
                            var newLi = jshi_loban('<li>').append(jshi_loban('<img/>', {src: '<?php echo SHI_THUOC_PLUGIN_URL ; ?>/thuoc522.php' + qStr}))
                                    .append(jshi_loban('<img/>', {src: '<?php echo SHI_THUOC_PLUGIN_URL ; ?>/thuoc429.php' + qStr}))
                                    .append(jshi_loban('<img/>', {src: '<?php echo SHI_THUOC_PLUGIN_URL ; ?>/thuoc388.php' + qStr}));
                            trimEnd += rulerLength;
                            jshi_loban('#thelist').append(newLi);
                            myScroll.refresh();
                        }
                    }

                    function loaded() {
                        Math.nativeRound = Math.round;
                        Math.round = function(i, iDecimals) {
                            if (!iDecimals)
                                return Math.nativeRound(i);
                            else
                                return Math.nativeRound(i * Math.pow(10, Math.abs(iDecimals))) / Math.pow(10, Math.abs(iDecimals));

                        };

                        myScroll = new iScroll('shi_wrapper', {
                            useTransition: true,
                            leftOffset: jshi_loban('#pullRight').outerWidth(true),
                            onRefresh: function() {
                                if (jshi_loban('#pullRight').hasClass('loading')) {
                                    jshi_loban('#pullRight').removeClass('loading');
                                    jshi_loban('#pullRight .pullRightLabel').html('Kéo qua phải tải thêm...');
                                } else if (jshi_loban('#pullLeft').hasClass('loading')) {
                                    jshi_loban('#pullLeft').removeClass('loading');
                                    jshi_loban('#pullLeft .pullLeftLabel').html('Kéo qua trái tải thêm...');
                                }
                                jshi_loban('#sodoLoban').html(Math.round((-this.x + 48 * 10) / 100, 2) + ' cm').css({'left': jshi_loban('.container').outerWidth(true) / 2 - jshi_loban('#sodoLoban').outerWidth(true) / 2});
                            },
                            onScrollMove: function() {
                                jshi_loban('#sodoLoban').html(Math.round((-this.x + 48 * 10) / 100, 2) + ' cm').css({'left': jshi_loban('.container').outerWidth(true) / 2 - jshi_loban('#sodoLoban').outerWidth(true) / 2});
                            },
                            onScrollEnd: function() {
                                myScroll.refresh();
                                console.log(this.x);
                                console.log((jshi_loban('#scroller').width() - 1000));
                                if (this.x > 5 && !jshi_loban('#pullRight').hasClass('flip')) {
                                    jshi_loban('#pullRight').addClass('flip');
                                    jshi_loban('#pullRight .pullRightLabel').html('Thả ra để làm mới...');
                                } else if (this.x < -(jshi_loban('#scroller').width() - 2000) && !jshi_loban('#pullRight').hasClass('flip')) {
                                    jshi_loban('#pullLeft').addClass('flip');
                                    jshi_loban('#pullLeft .pullLeftLabel').html('Thả ra để làm mới...');
                                }
                                //jshi_loban('#abc').html('this.x='+this.x+' : out='+(jshi_loban('#scroller').width()-1000));
                                if (jshi_loban('#pullRight').hasClass('flip')) {
                                    jshi_loban('#pullRight').removeClass('flip');
                                    jshi_loban('#pullRight').addClass('loading');
                                    jshi_loban('#pullRight .pullRightLabel').html('Đang tải...');
                                    pullRightAction();  // Execute custom function (ajax call?)
                                } else if (jshi_loban('#pullLeft').hasClass('flip')) {
                                    jshi_loban('#pullLeft').removeClass('flip');
                                    jshi_loban('#pullLeft').addClass('loading');
                                    jshi_loban('#pullLeft .pullLeftLabel').html('Đang tải...');
                                    pullLeftAction();   // Execute custom function (ajax call?)
                                }
                                jshi_loban('#sodoLoban').html(Math.round((-this.x + 48 * 10) / 100, 2) + ' cm').css({'left': jshi_loban('.container').outerWidth(true) / 2 - jshi_loban('#sodoLoban').outerWidth(true) / 2});
                            }
                        });

                        setTimeout(function() {
                            document.getElementById('shi_wrapper').style.left = '0';
                        }, 800);
                    }
                    if (document.addEventListener) {
                        document.addEventListener('DOMContentLoaded', function() {
                            setTimeout(loaded, 200);
                        }, false);
                    } else {
                        document.attachEvent('onreadystatechange', function() {
                            setTimeout(loaded, 200);
                        });
                    }

</script>

<div id="shi_main">
            <div class="container">
       <div class="content">  
                    <div id="lobanOuter" style="height:480px;">
                        <div id="abc"></div>
                        <div id="sodoLoban"></div>
                       <div style="width:1px;height:375px;background:#ffa500;position:absolute;z-index:2;top:53px;left:50%;"></div>
                        <p style="z-index:2;right:0; no-repeat 0 0; padding-left:20px; line-height: 22px;">Kéo thước để xem</p>
                        <p style="position:absolute;z-index:2;top:22px;left:0;"><strong>Thước Lỗ Ban 52.2cm:</strong> Khoảng không thông thủy (cửa, cửa sổ...)</p>
                        <p style="position:absolute;z-index:2;top:158px;left:0;"><strong>Thước Lỗ Ban 42.9cm (Dương trạch):</strong> Khối xây dựng (bếp, bệ, bậc...)</p>
                        <p style="position:absolute;z-index:2;top:293px;left:0;"><strong>Thước Lỗ Ban 38.8cm (Âm phần):</strong> Đồ nội thất (bàn thờ, tủ...)</p>
                         <div id="shi_wrapper">
                            <div id="scroller">
                                <div id="pullRight" style="display:none;">
                                    <span class="pullRightIcon"></span><span class="pullRightLabel">Kéo qua phải tải thêm...</span>
                                </div>
                                <ul id="thelist">
                                    <li>
                                        <img src="<?php echo SHI_THUOC_PLUGIN_URL.'/thuoc388.php' ;?>"/>

                                        <img src="<?php echo SHI_THUOC_PLUGIN_URL.'/thuoc522.php' ;?>"/>
                                        <img src="<?php echo SHI_THUOC_PLUGIN_URL.'/thuoc429.php' ;?>"/>
                                    </li>
                                </ul>
                                <div id="pullLeft" style="display:none;">
                                    <span class="pullLeftIcon"></span><span class="pullLeftLabel">Kéo qua trái tải thêm...</span>
                                </div>
                            </div>
                        </div>
                    </div> 
                      </div>
                    </div>
                </div>