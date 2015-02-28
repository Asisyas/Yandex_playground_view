function geocode(name, callback) {
    onmessage = callback;
    postMessage({
        controller: "yandex-maps",
        action: "geocode",
        data: {
            geocode: name
        }
    });
}


function _html(html, isAppend) {
    postMessage({
        controller: "base",
        action: "html",
        data: {
            html: html,
            append: Boolean(isAppend)
        }
    });
}


function innerHTML(e) {
    var response    = e.response;
    var objectColl  = response.GeoObjectCollection;

    var metaData    = objectColl.metaDataProperty.GeocoderResponseMetaData;
    var request     = metaData.request;
    var found       = metaData.found;
    var html = [];
    html.push("<b>============= REQUEST DONE ==============</b>");
    html.push("<b>Request: </b>" + request);
    html.push("<b>Count items: </b>" + found);
    _html(html.join("<br>"));
}

geocode("Минск", function(e) {
    var data = e.data;
    if(data.code) {
        console.log(data);
        _html("Системная ошибка #" + data.code);
        return;
    }
    var resp = data.data;
    if(resp.code) {
        _html("Jшибка контроллера#" + resp.code);
        return;
    }
    innerHTML(resp);
});