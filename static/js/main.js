/**
 * Created by awanabe on 2017/4/27.
 */

const request = require('request');

// 热门文章的最新的ID
function local_topic_last_id() {
    return localStorage.getItem('topic_last_id');
}

// 热门文章的总数
function local_topic_total_count() {
    return localStorage.getItem('topic_total_count');
}

// 最新文章的最新的ID
function local_news_last_id() {
    return localStorage.getItem('news_last_id')
}

// 最新文章的总数
function local_news_total_count() {
    return localStorage.getItem('news_total_count')
}

function clear_nav_btn_active() {
    Array.prototype.forEach.call(document.querySelectorAll('.btn-nav'), function (btn) {
        btn.classList.remove('active');
    });
}

const TOPIC = 1;
const NEWS = 2;

function build_first_data(post_type) {
    switch (post_type) {
        case TOPIC:
            clear_nav_btn_active();
            document.getElementById('btn_nav_topic').classList.add('active');

            break;
        case NEWS:
            clear_nav_btn_active();
            document.getElementById('btn_nav_news').classList.add('active');
            break;
    }

    if (local_topic_last_id() === null) {

    } else {

    }

    if (local_news_last_id() === null) {

    } else {

    }
}

function init_app() {
    // 初始化数据
    build_first_data(TOPIC);
    // 给按钮增加切换事件
    Array.prototype.forEach.call(document.querySelectorAll('.btn-nav'), function (btn) {
        btn.addEventListener('click', function (event) {
            let post_type = parseInt(event.target.dataset.postType);
            build_first_data(post_type)
        });
    });
}
init_app();
