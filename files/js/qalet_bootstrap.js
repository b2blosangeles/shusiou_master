
if (!_QALET_) var _QALET_={_Q:{}};
_QALET_._loadItv = setInterval(
	function() {
		if ((_dns) && (typeof _QALET_._Q['lang_space'] == 'function')) {
			clearInterval(_QALET_._loadItv);
			_QALET_._Q['lang_space']( {"module":"lang_space"});
		}
	}, 100
);
