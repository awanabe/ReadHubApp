/**
 * Created by awanabe on 2017/4/27.
 */
const request = require('request');

// 热门文章的最新的ID
function local_topic_last_id() {
    return localStorage.getItem('topic_last_id');
}

function set_local_topic_last_id(last_id) {
    localStorage.setItem('topic_last_id', last_id);
}

// 热门文章的总数
function local_topic_total_count() {
    return localStorage.getItem('topic_total_count');
}

function set_local_topic_total_count(total_count) {
    localStorage.setItem('topic_total_count', total_count);
}

// 最新文章的最新的ID
function local_news_last_id() {
    return localStorage.getItem('news_last_id')
}

function set_local_news_last_id(last_id) {
    localStorage.setItem('news_last_id', last_id)
}

// 最新文章的总数
function local_news_total_count() {
    return localStorage.getItem('news_total_count')
}

function set_local_news_total_count(total_count) {
    localStorage.setItem('news_total_count', total_count)
}

function clear_nav_btn_active() {
    Array.prototype.forEach.call(document.querySelectorAll('.btn-nav'), function (btn) {
        btn.classList.remove('active');
    });
}

//     <li data-id="" class="list-group-item">
//          <div class="media-body">
//              <p class="title"></p>
//              <p class="summary"></p>
//              <ul class="sources">
//                  <li data-url=""><span class="filter">></span> <span class="l-title"></span><span class="l-source"></span></li>
//              </ul>
//          </div>
//     </li>

function request_topics(last_cursor) {
    let total_size;
    if (last_cursor === null) {
        request('https://api.readhub.me/topic?pageSize=' + PageSize, function (error, response, body) {
            if (error !== null || response.statusCode !== 200) {
                alert('获取数据失败');
                return false;
            }
            let result = JSON.parse(body);
            total_size = result.totalItems;

            let topic_items = document.getElementById('topic_items');
            topic_items.innerHTML = '';

            Array.prototype.forEach.call(result.data, function (item) {
                let new_item = document.createElement('li');
                new_item.classList.add('list-group-item');
                new_item.dataset.id = item.id;

                let content = document.createElement('div');
                content.classList.add('media-body');

                let title = document.createElement('p');
                title.classList.add('title');
                title.innerHTML = item.title;
                content.appendChild(title);

                if (item.summary !== "") {
                    let summary = document.createElement('p');
                    summary.classList.add('summary');
                    summary.innerHTML = item.summary;
                    content.appendChild(summary);
                }

                let sources = document.createElement('ul');
                sources.classList.add('sources');

                Array.prototype.forEach.call(item.newsArray, function (src) {
                    let src_li = document.createElement('li');
                    src_li.dataset.url = src.url;

                    let filter_span = document.createElement('span');
                    filter_span.classList.add('filter');
                    filter_span.innerHTML = '>';

                    let src_title = document.createElement('span');
                    src_title.classList.add('l-title');
                    src_title.innerHTML = src.title;

                    let src_media = document.createElement('span');
                    src_media.classList.add('l-source');
                    src_media.innerHTML = ' - ' + src.siteName;

                    src_li.innerHTML = filter_span.outerHTML + src_title.outerHTML + src_media.outerHTML;

                    sources.appendChild(src_li);
                });
                content.appendChild(sources);

                new_item.appendChild(content);
                topic_items.appendChild(new_item);
            });
        });
    } else {

    }

    // 设置话题总数
    set_local_topic_total_count(total_size);
}

const TOPIC = 1;
const NEWS = 2;

const PageSize = 10;

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
        request_topics(null)
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
