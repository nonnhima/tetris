// 初期値0（必ず最初はstickが出る）
var random = 0;

let next_block_position = [
    [24, 34, 44],
    [32, 42, 43, 44, 45],
     [33, 43, 44,53, 54],
     [33,43,44,54],
     [24,33, 34, 44],
];

function changeNextBlockView() {
    /**
     * 「NEXT BLOCK」に次のブロックを表示する。
     **/
    // 「NEXT BLOCK」のブロックをdefaultにもどす
    $('table#next').find('td').attr('class', 'default');

    var next_block_view_class = block_types[random];
    // 「NEXT BLOCK」のブロックに次のブロックを出力する
    $.each(next_block_position[random], function(index, val) {
        $('[data-pos="' + val + '"]').attr('class', next_block_view_class);
    });
}
