/*大小自适应*/
new function() {
    var _self = this;
    _self.width = 640; // 设置默认最大宽度
    _self.fontSize = 40; // 默认字体大小
    _self.widthProportion = function() { 
    	var p = (document.body && document.body.clientWidth || document.getElementsByTagName("html")[0].offsetWidth) / _self.width; return p > 1 ? 1 : p < 0.5 ? 0.5 : p; 
    };
    _self.changePage = function() {
        document.getElementsByTagName("html")[0].setAttribute("style", "font-size:" + _self.widthProportion() * _self.fontSize + "px !important");
    }
    _self.changePage();
    window.addEventListener('resize', function() { _self.changePage(); }, false);

    // 重新计算rem
    correctPx();
};
//修复某些安卓机计算rem时会不准的问题
function correctPx() {
    var htmlEle = document.documentElement;
    if(!htmlEle) return;
    var standard_rem = Math.round(parseFloat(htmlEle.style.fontSize));
    var test_div = document.createElement('div');
    test_div.style.width = '1rem';
    test_div.style.height = '0';
    document.body.appendChild(test_div);
    var actual_rem = test_div.offsetWidth;
    var rate = standard_rem / actual_rem;
    if(rate != 1) {
        document.getElementsByTagName("html")[0].setAttribute("style", "font-size:" + (parseFloat(htmlEle.style.fontSize) * rate) + "px !important");
    }
    document.body.removeChild(test_div);
}

