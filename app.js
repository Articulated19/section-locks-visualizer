(function($) {
    let error = false;
    let sectionList = {
        "Intersection_1": {
            min_x: 550 * 0.1,
            max_x: 1400 * 0.1,
            min_y: 5850 * 0.1,
            max_y: 7150 * 0.1,
            subsections: []
        },
        "Intersection_2": {
            min_x: 550 * 0.1,
            max_x: 1430 * 0.1,
            min_y: 3300 * 0.1,
            max_y: 4600 * 0.1,
            subsections: []
        },
        "Intersection_3": {
            min_x: 3050 * 0.1,
            max_x: 3900 * 0.1,
            min_y: 5850 * 0.1,
            max_y: 7150 * 0.1,
            subsections: []
        },
        "Roundabout": {
            min_x: 2375 * 0.1,
            max_x: 4650 * 0.1,
            min_y: 2800 * 0.1,
            max_y: 5150 * 0.1,
            subsections: []
        },
        "Left_Curve": {
            min_x: 600 * 0.1,
            max_x: 3800 * 0.1,
            min_y: 600 * 0.1,
            max_y: 2200 * 0.1,
            subsections: []
        },
        "Right_Curve": {
            min_x: 550 * 0.1,
            max_x: 3800 * 0.1,
            min_y: 7900 * 0.1,
            max_y: 9500 * 0.1,
            subsections: []
        }
    };

    function callApi() {
        $.ajax({
            url: "http://127.0.0.1:8081/sections",
            method: 'get',
            crossDomain: true,
            success: function (resp) {
                $('.warning').hide();
                $('.successful').show();

                error = false;
                $('#nodes').empty();
                $('#nodes').append('<li>/</li>');
                let nodeArr = parseNodes(resp);
                delete nodeArr[0];
                sortNodes(nodeArr);
            },
            error: function() {
                $('.successful').hide();
                $('.warning').show();
                error = true;
            }
        });
    }

    function sortNodes(nodes) {
        let sectionsWrap = $('#sections');
        sectionsWrap.empty();
        for(const index in nodes) {
            let node = nodes[index];
            let nodeData = sectionList[node.name];
            let sWidth = (nodeData.max_y - nodeData.min_y);
            let sHeight = (nodeData.max_x - nodeData.min_x);

            sectionsWrap.append('<div class="'+node.name+'" ' +
                'style="top: ' + (490 - nodeData.max_x) + 'px; width: '+sWidth+'px;' +
                'left: '+ (nodeData.min_y) +'px; height: '+sHeight+'px;"></div>');


            let innerWrap = sectionsWrap.find('.' + node.name);

            if (node.nodes.length === 1) {
                let booked = node.nodes[0].nodes.length > 0 ? "ss-booked" : "";
                innerWrap.append('<div class="ss-full ss ' + booked + '"></div>');
            } else if (node.nodes.length > 1) {

                for (const index in node.nodes) {

                    let subnode = node.nodes[index];

                    let cname;
                    switch (subnode.name) {
                        case "k1":
                            cname  = "tl";
                            break;
                        case "k2":
                            cname  = "tr";
                            break;
                        case "k3":
                            cname  = "bl";
                            break;
                        case "k4":
                            cname  = "br";
                            break;
                    }

                    let booked = subnode.nodes.length > 0 ? "ss-booked" : "";
                    innerWrap.append('<div class="'+subnode.name + ' ' +cname+'-ss ss ' + booked + '"></div>');
                }

            }

        }

    }


    function addNodesToFront(nodeArr, el) {
        el.append('<ul></ul>');
        var ul = el.find('ul');
        for (let index in nodeArr) {
            let node = nodeArr[index];
            ul.append('<li class="'+index+'">'+node.name+'</li>');
            if (node.nodes.length) {
                addNodesToFront(node.nodes, ul.find('li.'+index));
            }
        }
    }

    function parseNodes(nodes) {
        let arr = [];
        for(let node in nodes) {
            arr.push({
               name: node,
               nodes: parseNodes(nodes[node])
            });
        }
        return arr;
    }

    setInterval(() => {
        callApi();
    }, 1000)

})(jQuery);