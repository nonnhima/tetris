function drawNewBlock() {
    /**
     * 新しいブロックを出力する。
     **/
    if ($('[data-active="1"]').length) {
        // アクティブ状態のブロックが存在している場合、何もしない
        return;
    }
    // デフォルトポジションをデフォルト値にリセット
    default_position = 207;
    // ローテーションのindexをデフォルト値にリセット
    lotation_index = 0;

    // 今から出力するブロックのクラス名を更新
    active_class = block_types[random];

    if (!checkValidPosition(default_position)) {
        // デフォルトポジションに新しいブロックを置くことができない場合、ゲームオーバーにする
        stopTimer();
        is_game_over = true;
        // 白く表示されているブロックがあれば、元に戻す
        $('.max_bottom').removeClass('max_bottom');
        alert('GAME OVER!\n\nブロックを置くことができなくなりました。もう一度遊ぶ場合はブラウザをリロードしてください。\nIf you reload the browser, you can play the game again.');
        return;
    }
    // クラスを付与し、アクティブ状態にする
    nextBlockActive();
    // ブロックを置くことができる最も低いpositionを白枠で表示する
    displayMaxBottomPosition();

    // 0～4までのランダムな数値を取得
    random = Math.floor(Math.random() * block_types.length);
    // 「NEXT BLOCK」の表示を更新する
    changeNextBlockView();
}

function moveToDirection(direction) {
    /**
     * @param {string} direction 左右の情報。 'left' or 'right'
     * ブロックの位置を左右どちらかの方向に移動させる
     **/
    if (!$('[data-active="1"]').length) {
        // アクティブ状態のブロックが存在しない場合、何もしない
        return;
    }
    if (!checkValidPosition(default_position + adjust_position[direction])) {
        // ブロックを移動先に動かすことができない場合、何もしない
        return;
    }
    // default_positionを更新する
    default_position += adjust_position[direction];

    // ブロックの移動先にクラスを付与し、アクティブ状態にする
    nextBlockActive();
    // ブロックを置くことができる最も低いpositionを白い外枠で囲み表示する
    displayMaxBottomPosition();
}

function rotate(new_lotation_index) {
    /**
     * @param {number} new_lotation_index 新しいlotation_index
     * ブロックの回転処理
     **/
    if (!$('[data-active="1"]').length) {
        // アクティブ状態のブロックが存在していない場合、何もしない
        return;
    }
    if (!checkValidPosition(default_position, new_lotation_index)) {
        // 回転させることができない場合、何もしない
        return;
    }
    // lotation_indexを新しい値に上書きする
    lotation_index = new_lotation_index;
    // ブロックの移動先にクラスを付与し、アクティブ状態にする
    nextBlockActive();
    // ブロックを置くことができる最も低いpositionを表示する
    displayMaxBottomPosition();
}

function drop(new_default_position) {
    /**
     * @param {number} new_default_position ブロックの移動先のdefault_position
     * ブロックの落下処理。
     **/
    if (!$('[data-active="1"]').length) {
        // アクティブ状態のブロックが存在していない場合、何もしない
        return;
    }
    if (!checkValidPosition(new_default_position)) {
        // ブロックを下に動かせない場合、data-activeを0にしてreturnする
        $('[data-active="1"]').attr('data-active', '0');
        // 白い枠で表示されているブロックがあれば、元に戻す
        $('.max_bottom').removeClass('max_bottom');
        return;
    }
    // default_positionを更新する
    default_position = new_default_position;

    // ブロックの移動先にクラスを付与し、アクティブ状態にする
    nextBlockActive();

    if (!checkValidPosition(default_position + 100)) {
        // 1マス下に動かせない場合、data-activeを0にする
        $('[data-active="1"]').attr('data-active', '0');
        // 白い枠で表示されているブロックがあれば、元に戻す
        $('.max_bottom').removeClass('max_bottom');
    }
}

function checkValidPosition(next_default_position, new_lotation_index = lotation_index) {
    /**
     * @param {number} next_default_position ブロックの移動先のdefault_position
     * @param {number} new_lotation_index ローテーションのindex（0～3）。指定がない場合、lotation_indexを使う
     * 与えられた条件で、ブロックを置くことができるか判定を変えす。移動先にブロックを置くことができる場合は、Trueを返す。
     **/
    var result = true;
    $.each(position[active_class][new_lotation_index], function(index, val) {
        var next_position_val = next_default_position + val
        if (next_position_val % 100 <= 0 || max_width + 1 <= next_position_val % 100 ||
            Math.floor(next_position_val / 100) <= 0 || max_height < Math.floor(next_position_val / 100)) {
            // 移動先のブロックが、ボードの範囲外だった場合
            result = false;
            return false;
        }
        var next_position_block = $('[data-position="' + next_position_val + '"]')
        if (next_position_block.attr('data-active') === '0' && !next_position_block.hasClass('default')) {
            // 移動先に、すでにアクティブ状態ではないブロックが置かれていた場合
            result = false;
            return false;
        }
    });
    return result;
}

function delate() {
    /**
     * ブロックの削除処理。
     **/
    for (var column = 1; column <= max_height; column++) {
        var can_delate = true;

        for (var row = 1 + 100 * column; row % 100 <= max_width; row++) {
            var delate_check_block = $('[data-position="' + row + '"]');
            if (delate_check_block.hasClass('default') || delate_check_block.attr('data-active') === '1') {
                can_delate = false;
            }
        }
        if (!can_delate) {
            continue;
        }
        var can_delate_array = Array.from(Array(max_width)).map((v, i) => i + 1 + 100 * column)
        $.each(can_delate_array, function(index, value) {
            var delate_block = $('[data-position="' + value + '"]');
            // これから行が削除されることが分かりやすいように、行の色を変える
            delate_block.addClass('will-delate');
        });
        // 0.2秒後に削除処理を実行する
        setTimeout(delateBlocks, 200, column);
        // 行を削除したカウントを更新
        goal_times++;
        $('.goal_times').text(goal_times);

        function delateBlocks(column) {
            /**
             * @param {number} column 削除された行のdata-position（100の位）
             * ブロックの削除処理。
             **/
            // ブロックが揃った1行を削除する
            $('.will-delate').attr('class', 'default');

            // 上にあるブロックを下に移動させる
            for (var drop_column = column - 1; drop_column >= 1; drop_column--) {
                var empty_count = 0;
                for (var drop_row = 1 + 100 * drop_column; drop_row % 100 <= max_width; drop_row++) {
                    var drop_check_block = $('[data-position="' + drop_row + '"]');
                    if (drop_check_block.attr('data-active') === '1' || drop_check_block.hasClass('default')) {
                        empty_count++;
                        continue;
                    }
                    var this_class = drop_check_block.attr('class');
                    // そのブロックをdefaultにする
                    drop_check_block.attr('class', 'default');
                    // 1つ下のブロックに移動させる
                    $('[data-position="' + (drop_row + 100) + '"]').attr('class', this_class);
                }
                if (empty_count === max_width) {
                    // 横1行すべてdefaultだった場合、それより上の行の移動処理は行わない
                    break;
                }
            }
        }
    }
    if ($('[data-active="1"]').length) {
        // アクティブ状態のブロックが存在している場合、
        // ブロックを置くことができる最も低いpositionを白枠で表示する
        displayMaxBottomPosition();
    }
}

function nextBlockActive() {
    /**
     * ブロックの移動先にクラスを付与し、アクティブ状態にする共通処理。
     **/

    // アクティブ状態のブロックをdefault状態に戻す
    $('[data-active="1"]').attr('class', 'default');
    $('[data-active="1"]').attr('data-active', '0');

    // ブロックの移動先にクラスを付与し、アクティブ状態にする
    $.each(position[active_class][lotation_index], function(index, val) {
        $('[data-position="' + (default_position + val) + '"]').attr('class', active_class);
        $('[data-position="' + (default_position + val) + '"]').attr('data-active', '1');
    });
}

function startGame() {
    /**
     * ゲームスタート時の処理。
     **/
    // 棒を描く処理
    var drawNewBlockFunction = setInterval(function() {
        drawNewBlock();
        if (is_game_over) {
            clearInterval(drawNewBlockFunction);
        }
    }, 100); // 0.1秒ごとに更新

    // active状態のブロックを一つ下に下げる処理
    var dropFunction = setInterval(function() {
        drop(default_position + 100);
        if (is_game_over) {
            clearInterval(dropFunction);
        }
    }, 1000); // 1秒ごとに更新

    // 横一行にブロックが揃ったら、行を消す処理
    var delateFunction = setInterval(function() {
        delate();
        if (is_game_over) {
            clearInterval(delateFunction);
        }
    }, 500); // 0.5秒ごとに更新

    window.onkeydown = (e) => {
        var key_code = e.keyCode
        if (key_code === 37) {
            // ←左方向
            moveToDirection('left');
        } else if (key_code === 39) {
            // →右方向
            moveToDirection('right');
        } else if (key_code === 40) {
            // ↓下方向
            drop(max_bottom_default_position);
        } else if (key_code === 188) {
            // ＜左回転
            var new_lotation_index = lotation_index + 1;
            if (4 <= new_lotation_index) {
                // new_lotation_indexが4以上になる場合、new_lotation_indexを最小値（0）にする
                new_lotation_index = 0;
            }
            rotate(new_lotation_index);
        } else if (key_code === 190) {
            // ＞右回転
            var new_lotation_index = lotation_index - 1;
            if (new_lotation_index < 0) {
                // new_lotation_indexが0未満になる場合、new_lotation_indexを最大値（3）にする
                new_lotation_index = 3;
            }
            rotate(new_lotation_index);
        }
    }
}

function displayMaxBottomPosition() {
    /**
     * ブロックを置くことができる最も低いpositionを白い外枠で囲み、表示する。
     **/
    // すでに白く表示されているブロックがあれば、元に戻す
    $('.max_bottom').removeClass('max_bottom');

    // 現在のブロックのtypeで、最も底辺のポジションを取得
    var max_bottom_position = Math.max(...position[active_class][lotation_index]);

    for (var i = default_position + 100; i < max_height * 100 + max_width; i += 100) {
        if (!checkValidPosition(i)) {
            // 実際に置けるのはiの1行上のため、ここで100を引く
            i -= 100;
            break;
        }
        if (Math.floor((i + max_bottom_position) / 100) === max_height) {
            // ブロックが一部が最も低い行に到達した場合は、breakする
            break;
        }
    }
    // max_bottom_default_positionを更新する
    max_bottom_default_position = i;

    // ブロックを置くことができる最も低いpositionを白い外枠で囲み、表示する
    $.each(position[active_class][lotation_index], function(index, val) {
        $('[data-position="' + (max_bottom_default_position + val) + '"]').addClass('max_bottom');
    });
}

// 起動時処理
$(function() {
    startGame();
    startTimer();
});
