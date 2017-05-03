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

function hidden_list() {
    Array.prototype.forEach.call(document.querySelectorAll('.items'), function (btn) {
        btn.classList.add('hidden');
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
    if (last_cursor === null) {
        request('https://api.readhub.me/topic?pageSize=' + PageSize, function (error, response, body) {
            if (error !== null || response.statusCode !== 200) {
                alert('获取数据失败');
                return false;
            }
            let result = JSON.parse(body);
            let total_size = result.totalItems;
            // 设置话题总数
            set_local_topic_total_count(total_size);

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
                    src_li.classList.add('src-link');

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


}

function request_news(last_cursor) {
    if (last_cursor === null) {
        request('https://api.readhub.me/news?pageSize=' + PageSize, function (error, response, body) {
            if (error !== null || response.statusCode !== 200) {
                alert('获取数据失败');
                return false;
            }
            let result = JSON.parse(body);
            let total_size = result.totalItems;
            // 设置新闻总数
            set_local_news_total_count(total_size);

            let news_items = document.getElementById('news_items');
            news_items.innerHTML = '';

            Array.prototype.forEach.call(result.data, function (item) {
                let new_item = document.createElement('li');
                new_item.classList.add('list-group-item');
                new_item.dataset.id = item.id;

                let content = document.createElement('div');
                content.classList.add('media-body');

                let title = document.createElement('p');
                title.classList.add('title');
                title.classList.add('src-link');
                title.innerHTML = item.title;
                title.dataset.url = item.url;
                content.appendChild(title);

                if (item.summary !== "") {
                    let summary = document.createElement('p');
                    summary.classList.add('summary');
                    summary.innerHTML = item.summary;
                    content.appendChild(summary);
                }

                let source = document.createElement('p');
                source.classList.add('source');
                source.innerHTML = item.siteName + ' / ' + item.authorName;

                content.appendChild(source);

                new_item.appendChild(content);
                news_items.appendChild(new_item);
            });

        })
    } else {
    }

}

const TOPIC = 1;
const NEWS = 2;

const PageSize = 20;

function build_first_data(post_type) {
    // 清理导航状态
    clear_nav_btn_active();
    // 隐藏所有列表
    hidden_list();
    switch (post_type) {
        case TOPIC:
            document.getElementById('topic_items').classList.remove('hidden');
            document.getElementById('btn_nav_topic').classList.add('active');
            break;
        case NEWS:
            document.getElementById('news_items').classList.remove('hidden');
            document.getElementById('btn_nav_news').classList.add('active');
            break;
    }

    if (local_topic_last_id() === null) {
        request_topics(null);
    } else {

    }

    if (local_news_last_id() === null) {
        request_news(null);
    } else {

    }
}

// src-link 点击之后的时间
document.body.addEventListener("click", function (e) {
    let link_el = null;
    if (e.target.classList.contains('src-link')) {
        link_el = e.target;
    }

    if (e.target.parentNode.classList.contains('src-link')) {
        link_el = e.target.parentNode;
    }

    if (link_el === null) {
        return false;
    }

    let url = link_el.dataset.url;
    console.log(url);
});


function init_app() {
    // 初始化数据
    build_first_data(TOPIC);
    // 给按钮增加切换事件
    Array.prototype.forEach.call(document.querySelectorAll('.btn-nav'), function (btn) {
        btn.addEventListener('click', function (event) {
            let post_type = parseInt(event.target.dataset.postType);
            build_first_data(post_type);
        });
    });
}
init_app();
