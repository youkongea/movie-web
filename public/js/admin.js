/**
 * Created by unsad on 2017/2/16.
 */
// 异步删除电影数据
$(function() {
    "use strict";
    $('.del').click(function(e) {
        const target = $(e.target),
            id = target.data('id'),
            tr = $('.item-id-' + id);

        $.ajax({
            type: 'DELETE',
            url: '/admin/movie/list?id=' + id
        })
            .done(function(results) {
                if (results.success === 1) {
                    if(tr.length > 0) {
                        tr.remove();
                    }
                }
            })
         });
//  豆瓣API数据录入
    $('#douban').blur(function() {
        let douban = $(this),
            id = douban.val();
        if (id) {
            $.ajax({
                url: 'https://api.douban.com/v2/movie/subject/' + id,
                cache: true,
                type: 'get',
                dataType: 'jsonp',
                crossDomain: true,
                jsonp: 'callback',
                success: function (data) {
                    $('#inputTitle').val(data.title);
                    $('#inputDoctor').val(data.directors[0].name);
                    $('#inputCountry').val(data.countries[0]);
                    $('#inputPoster').val(data.images.large);
                    $('#inputYear').val(data.year);
                    $('#inputSummary').val(data.summary);
                }
            })
        }
    })
});