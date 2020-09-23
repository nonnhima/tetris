var max_height = 22; // 縦22マス
var max_width = 12; // 横12マス


$(function() {

    // メインボードを出力する
    for (var height = 1; height <= max_height; height++) {
        $('table#board').append('<tr></tr>');
        for (var width = 1 + 100 * height; width % 100 <= max_width; width++) {
            $('table#board tr').eq(height - 1).append('<td class="default" data-active="0"data-position="' + width + '"></td>');
        }
    }

});
