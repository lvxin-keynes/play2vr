var _T = require('./track');

function trackVideo(_video, _key)
{
	if (!_video) return;
	_key = _key || _video.getAttribute('play2vr');
	if (!_key) return;
	
	_video.addEventListener('play', function(){		
		_T._trackPV(_key);
		_T._trackEvent(_key, 'play', _video.currentTime);	
	});
	
	_video.addEventListener('pause', function(){
		_T._trackEvent(_key, 'pause', _video.currentTime);
	});	
}

function trackVideos()
{
	var _videos = document.querySelectorAll('video[play2vr]');
	for (var i=0; i<_videos.length; i++)
		trackVideo(_videos[i]);  
}

if (!window['play2VRTrack']) 
{
	window['play2VRTrack'] = {
		trackVideo: trackVideo
	};			
	trackVideos();
}
