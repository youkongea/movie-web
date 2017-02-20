/**
 * Created by unsad on 2017/2/16.
 */
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
    })
});