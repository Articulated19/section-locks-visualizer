(function($) {


    let sectionList = {
        "Intersection_1": {
            min_x: 550 * 0.1,
            max_x: 1800 * 0.1,
            min_y: 5600 * 0.1,
            max_y: 7300 * 0.1,
            subsections: []
        },
        "Intersection_2": {
            min_x: 550 * 0.1,
            max_x: 1800 * 0.1,
            min_y: 2700 * 0.1,
            max_y: 5200 * 0.1,
            subsections: []
        },
        "Intersection_3": {
            min_x: 2700 * 0.1,
            max_x: 3950 * 0.1,
            min_y: 5600 * 0.1,
            max_y: 7300 * 0.1,
            subsections: []
        },
        "Roundabout": {
            min_x: 2200 * 0.1,
            max_x: 4600 * 0.1,
            min_y: 2700 * 0.1,
            max_y: 5200 * 0.1,
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
                $('#nodes').empty();
                $('#nodes').append('<li>/</li>');
                let nodeArr = parseNodes(resp);
                delete nodeArr[0];
                sortNodes(nodeArr)
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
                            cname  = "tr";
                            break;
                    }

                    let booked = subnode.nodes.length > 0 ? "ss-booked" : "";
                    innerWrap.append('<div class="'+cname+'-ss ss ' + booked + '"></div>');
                }

            }



            if (node.name == "Right_Curve" || node.name == "Left_Curve") {

            } else {

                innerWrap.append('<div class="tr-ss ss"></div>');
                innerWrap.append('<div class="bl-ss ss"></div>');
                innerWrap.append('<div class="br-ss ss"></div>');
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