window.onload = () => {
    collectDOMStat(document.querySelector('.some-class-1'));

    function collectDOMStat(root) {
        const text = 3;
        let statistics = {
            tags: {},
            classes: {},
            text: 0
        };

        recursiveTreeTraversal(root);

        function addStatistic(node) {
            // add  to statistics classes amount
            let tags = statistics.tags;
            let keys = Object.keys(statistics.tags);
            let tagName = node.tagName;

            if (tagName) {
                if (keys.includes(tagName)) {
                    tags[tagName]++;
                } else {
                    tags[tagName] = 1;
                }
            }
            // add  to statistics classes amount
            let classList = node.classList;

            if (classList) {
                for (const key of classList.keys()) {
                    let nodeClass = classList[key];
                    let statisticClasses = statistics.classes;

                    if (statisticClasses.hasOwnProperty(nodeClass)) {
                        statisticClasses[nodeClass]++;
                    } else {
                        statisticClasses[nodeClass] = 1;
                    }
                }
                console.log('statistics:');
                console.log(statistics);
            }

            // add to statistics text nodes amount
            // I suppose it works but not sure
            if (node.nodeType === text) {
                statistics.text++;
            }
        }

        function recursiveTreeTraversal(node) {
            addStatistic(node);

            if (node.hasChildNodes()) {
                recursiveTreeTraversal(node.firstChild);
            }

            if (node.nextSibling != null) {
                recursiveTreeTraversal(node.nextSibling);
            }
        }
    }
};