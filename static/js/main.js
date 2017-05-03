/**
 * Created by awanabe on 2017/4/27.
 */
const request = require('request');
const shell = require("electron").shell;

// 热门文章的总数
function local_topic_max_order() {
    return localStorage.getItem('topic_max_order');
}

function set_local_topic_max_order(max_order) {
    localStorage.setItem('topic_max_order', max_order);
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

function build_topic_item(item) {
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
        src_li.dataset.url = src.mobileUrl;
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
    return new_item
}

function build_news_item(item) {
    let new_item = document.createElement('li');
    new_item.classList.add('list-group-item');
    new_item.dataset.id = item.id;

    let content = document.createElement('div');
    content.classList.add('media-body');

    let title = document.createElement('p');
    title.classList.add('title');
    title.classList.add('src-link');
    title.innerHTML = item.title;
    title.dataset.url = item.mobileUrl;
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
    return new_item;
}

function request_topics(last_cursor) {
    if (last_cursor === null) {
        request('https://api.readhub.me/topic?pageSize=' + PageSize, function (error, response, body) {
            if (error !== null || response.statusCode !== 200) {
                alert('获取数据失败');
                return false;
            }
            let result = JSON.parse(body);
            let topic_items = document.getElementById('topic_items');
            topic_items.innerHTML = '';

            let order = null;

            Array.prototype.forEach.call(result.data, function (item) {
                let new_item = build_topic_item(item);
                // 新数据添加到列表中
                topic_items.appendChild(new_item);
                // 获取最后一个item的order，作为请求更多的lastCursor
                order = item.order;

                // 获取最新数据的order
                let max_order = local_topic_max_order();
                if (max_order === null) {
                    set_local_topic_max_order(order);
                } else {
                    if (parseInt(max_order) < parseInt(order)) {
                        set_local_topic_max_order(order);
                    }
                }
            });

            // 构建加载更多
            let load_more = document.createElement('li');
            load_more.classList.add('load-more');
            load_more.classList.add('list-group-item');
            load_more.dataset.lastId = order;
            load_more.dataset.postType = TOPIC;
            load_more.setAttribute('id', 'load_more_topic');
            load_more.innerHTML = '加载更多...';
            topic_items.appendChild(load_more);
        });
    } else {
        request('https://api.readhub.me/topic?lastCursor=' + last_cursor + 'pageSize=' + PageSize, function (error, response, body) {
            if (error !== null || response.statusCode !== 200) {
                alert('获取数据失败');
                return false;
            }
            let result = JSON.parse(body);
            let topic_items = document.getElementById('topic_items');
            let load_more = document.getElementById('load_more_topic');
            let order = null;

            Array.prototype.forEach.call(result.data, function (item) {
                let new_item = build_topic_item(item);
                // 添加到加载更多按钮之前
                topic_items.insertBefore(new_item, load_more);
                order = item.order;
            });

            // 加载更多
            load_more.dataset.lastId = order;
            load_more.innerHTML = '加载更多...';
        });

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
            let news_items = document.getElementById('news_items');
            news_items.innerHTML = '';

            let order = null;

            Array.prototype.forEach.call(result.data, function (item) {
                let new_item = build_news_item(item);
                news_items.appendChild(new_item);
                order = item.publishDate;
            });

            // 加载更多
            let load_more = document.createElement('li');
            load_more.classList.add('load-more');
            load_more.classList.add('list-group-item');
            load_more.dataset.lastId = new Date(order).getTime();
            load_more.dataset.postType = NEWS;
            load_more.setAttribute('id', 'load_more_news');
            load_more.innerHTML = '加载更多...';
            news_items.appendChild(load_more);
        })
    } else {
        request('https://api.readhub.me/news?lastCursor=' + last_cursor + 'pageSize=' + PageSize, function (error, response, body) {
            if (error !== null || response.statusCode !== 200) {
                alert('获取数据失败');
                return false;
            }
            let result = JSON.parse(body);

            let news_items = document.getElementById('news_items');
            let load_more = document.getElementById('load_more_news');
            let order = null;

            Array.prototype.forEach.call(result.data, function (item) {
                let new_item = build_news_item(item);
                news_items.insertBefore(new_item, load_more);
                order = item.publishDate;
            });

            // 加载更多
            load_more.dataset.lastId = new Date(order).getTime();
        })
    }

}

const TOPIC = 1;
const NEWS = 2;

const PageSize = 20;

function build_first_data(post_type) {
    console.log('>>> starting build');
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

    request_topics(null);
    request_news(null);
    console.log('>>> finished build');
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

    let ifrm = document.createElement('iframe');
    ifrm.setAttribute('src', url);
    ifrm.setAttribute('sandbox', 'allow-scripts');

    let container = document.getElementById('ifrm_container');
    container.innerHTML = '';
    container.appendChild(ifrm);
});

// 在浏览器中打开
document.getElementById('btn_open_in_b').addEventListener('click', function () {
    let ifrm = document.getElementById('ifrm_container');
    if (ifrm.getElementsByTagName('iframe').length > 0) {
        url = ifrm.getElementsByTagName('iframe')[0].src;
        shell.openExternal(url);
    }
});

// load more data
document.body.addEventListener("click", function (e) {
    if (!e.target.classList.contains('load-more')) {
        return false;
    }
    let el = e.target;
    let post_type = el.dataset.postType;
    let last_id = el.dataset.lastId;

    if (parseInt(post_type) === TOPIC) {
        request_topics(last_id);
    } else if (parseInt(post_type) === NEWS) {
        request_news(last_id)
    }
});

document.getElementById('btn_refresh').addEventListener('click', function () {
    build_first_data(TOPIC);
    document.getElementById('topic_items').scrollTop = 0;
    document.getElementById('new_count').innerHTML = '';
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
    // 定时程序判断是否有新的数据
    setInterval(function () {
        let max_order = local_topic_max_order();
        request('https://api.readhub.me/topic/newCount?latestCursor=' + max_order, function (error, response, body) {
            if (error !== null || response.statusCode !== 200) {
                return false;
            }
            let result = JSON.parse(body);
            let new_count = result.count;
            if (parseInt(new_count) > 0) {
                document.getElementById('new_count').innerHTML = '(' + new_count + ')';
            }
        })
    }, 1000 * 60);
}
init_app();
