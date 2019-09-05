function conciseSkin(options)
{
	this.video = options.video;
	this.api = options.api;
	
	var w = window.innerWidth, h = window.innerHeight;
	var isTouchDevice = 'ontouchstart' in document.documentElement;
	
	var htmlText = [
		'<div id="play2vr-video-controls" class="play2vr-controls" data-state="hidden">',
		'	<div class="play2vr-playWrap"><button id="play2vr-playpause" type="button" data-state="play">Play/Pause</button></div>',
		'	<div class="play2vr-currentWrap"><p id="play2vr-currentTime" >00:00</p></div>',
		'	<div class="play2vr-progress" id="play2vr-progressBg">',
		'		<div id="play2vr-buf"></div>',
		'		<div id="play2vr-progress" value="0" min="0">',
		'			<span id="play2vr-progress-bar"></span>',
		'		</div>',
		'		<div class="play2vr-ball" id="play2vr-ball"><img height="100%" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAA5CAMAAACVg1IlAAAA/1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFBQUAAAAAAAAAAAAAAAAFBQUAAAAAAAAAAADq7OstLS0AAAAAAAAAAADl5+aIiYkAAAAAAADo6ejg4uHb3dzi5OPAwcDP0M96e3q0tbVyc3LV19bm6Ofm6OfY2dnNzs3e4N/DxcTBwsHNzs3Bw8LT1dS3ubi0tbTJy8q2uLfKy8uYmZjIysmBgoG/wL+PkI+oqqlhYmJbW1ump6YmJiZ8fX1bW1tLTEsZGRlaW1pISUgAAAAaGhrY2dnNzs3s7u1DQkdjYmbo6umjpKVoaGva3NtLSk9HRktKSU4Lg+IQAAAAS3RSTlMAAwYKExAMJRciHjgwLBkpR1w9RBv7cTRWTvehUUr48urp07yako/m8u/p3tvXzcvJyMjHvbq0r66gnZqZi4aAZ1ZUU0tHQUA258F/U+0wAAACnklEQVRIx6WW6XKiQBSFRZpGNhGFKDHGXbPv+74nMx2jMXn/Z5lLg15Qlh9zqqxKpT6PX9/bRZFbjCAIeT/wVy41AIpUIoQU4CNREb6ShEKpKJGiKsumYRimLKtFIonwE/G9lBQV87Hf3dl0mLO50+0/mkqR0Jh+6CW2/HrVZuG0r15lm0D/UnFBebtw2GKcizelsFAviJJt3m+wuGzcm7YkChFY1c9YUs50FXDUkNSPQ5acww9Vmsvkqa13WVq6uk3zM4+C0Wfp6RsFcOEeRH5yMmjnSSbcRQCPE5aVE3DxaKh+djJp5xnKubV+w7Jzo4M5iKjaPsvOvqZSoCWl3GbZaZcVSfC0K+sskq/xZDqdjL9YOOsVEAfaLEXp79Enz+g7QpdMn660Is0AB3i4veXR3OQgTI8/5xkzzIFnwk95HaYnSE8Y5hpO6U/wIbydH6R/Qtt58CcoFnV3L56e4n/3XL0I2+Hig0yTAdfOcZXan4xTDmueSHC9S/WMCdZLswuelxTNaqVup2VpiuSJ+LewUY9sfvT7Owpvvt7QeXVQXra2WHK2rLJXzcOH2Oil0L0GHx9kZl7bToS3axpWB2O5S6TvgoFEyo8S4KN5NZablZXVWHh1pWL61VhO1eraeSx9vlZVqV+N5UR+t4Yx8NB6l0lQjTiFKd7G0LcwPYpw+KDHS/Bx9IjRgzYX4ObSEfG5XHV7i1t0qzZdqg6etWWrE4E7Vpk/WzHRjfKh46hDW1w+KAy9zjB1GDUecancc9mdw7ueR0w1Xl3ugh54UZNcLgP6Ej2SynEuHfRId2l6e0GPdBd3APTARY9UF809ZaeuluqBO5K1l78vmox7SYn37mHohlKgGR74DmTjO08mLlJKxWwYX/Lgk/vf/AMk32gn95O+LAAAAABJRU5ErkJggg=="></div>',
		'	</div>',
		'	<div class="play2vr-totalWrap"><p id="play2vr-totalTime" >00:00</p></div>',
		'	<div class="play2vr-muteWrap"><button id="play2vr-mute" type="button" data-state="mute">Mute/Unmute</button></div>',
		'	<div class="play2vr-vrWrap"><button id="play2vr-vrmode" type="button" data-state="vroff">VR</button></div>',
		'	<div class="play2vr-fullWrap"><button id="play2vr-fullmode" type="button" data-state="fulloff">VR</button></div>',
		'	<div class="play2vr-sxWrap"><div class="play2vr-sx" id="play2vr-sx">/</div></div>',
		'</div>',
	].join("\n");
	
	var cssText = [
		'#play2vr-videoContainer {opacity:0 !important;width:100%;height:2%;position:absolute;left:0;bottom:0;opacity:0.8;margin:0;}',
		".play2vr-controls, .play2vr-controls > * { padding:0;margin:0;}",
		'.play2vr-controls{width:100%;height:100%;position:absolute;left:0;top:0;}',
		".play2vr-controls[data-state=hidden] {display:none;}",
		".play2vr-controls[data-state=visible] {display:block;}",
		".play2vr-controls .play2vr-progress {cursor:pointer;width:100%;height:100%;position:absolute;top:0;left:0;}",
		'.play2vr-controls button {text-align:center;overflow:hidden; white-space:nowrap; text-overflow:ellipsis;border:none; cursor:pointer; text-indent:-99999px; background: transparent; background-size:contain; background-repeat:no-repeat;}',
		'.play2vr-playWrap{width:5%;height:200%;position:absolute;left:1%;top:0;opacity:0.6;transform:translateY(-120%);-webkit-transform:translateY(-120%);}',
		'.play2vr-currentWrap{width:5%;height:100%;position:absolute;left:5%;top:0;opacity:0.6;}',
		'.play2vr-totalWrap{width:5%;height:100%;position:absolute;left:80%;top:0;opacity:0.6;}',
		'.play2vr-muteWrap{width:5%;height:200%;position:absolute;left:85%;top:0;opacity:0.6;transform:translateY(-120%);-webkit-transform:translateY(-120%);}',
		'.play2vr-vrWrap{width:5%;height:200%;position:absolute;left:90%;top:0;transform:translateY(-120%);-webkit-transform:translateY(-120%);}',
		'.play2vr-fullWrap{width:5%;height:200%;position:absolute;left:95%;top:0;opacity:0.6;transform:translateY(-120%);-webkit-transform:translateY(-120%);}',
		'#play2vr-playpause, #play2vr-mute, #play2vr-vrmode, #play2vr-fullmode{height:100%;width:100%;position:absolute;left:0;top:0;right:0;bottom:0;margin:auto;}',
		'#play2vr-currentTime, #play2vr-totalTime, #play2vr-sx{position:absolute;left:50%;top:50%;margin:0;padding:0;color:#fff;font-weight:bold;transform:translateX(-50%) translateY(-50%);-webkit-transform:translateX(-50%) translateY(-50%);opacity:0.6;font-size:10px;display:none;}',
		".play2vr-controls button:hover { opacity:0.5;}",
		".play2vr-controls button[data-state=\"play\"] { background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABCCAMAAADkBuH7AAAA3lBMVEUAAAAAAAAAAAAAAAAAAAD29vYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8/PwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFhYICAgAAAAAAADx8fGnp6cAAAAAAAAAAAD09PTn5+fi4uLc3NzIyMi3t7ewsLCXl5eOjo6AgIBdXV1TU1NJSUlAQEAzMzMgICAAAAD39/fV1dXOzs7CwsK7u7uGhoZlZWUnJyf///9NW5b9AAAASXRSTlOZAI+SjfmIlYJ/TgR8d21JLHRwaWRSQBl5XjH9hWFZVTw1JyIdDAefmxAI9tA4FhP48O3q4NfUyMW/tLCtqqahQ/nm4tzZwrajPsrUPQAAAkJJREFUWMO12OlW2lAUhuGPc44ZyRwIM8ik4mxbtQ6tncv931CD6TJBWMsd3Hku4P2RQJLzobZuPu08NdpRUDc0JYRQQscWulQipTSjFbj9oTcaz2qvFMNH+/0ediWchr/YGu4EeC81mL4O2+MWOMgoWQvbHriI02J4AD7CewkvPA2MzNP5//BEA6v6WRZO2hKsZOP8OdyRYKb8Vdi2wM5bhScu2MXTNDzqgV19Pw03wE+3apjHqEDfRuKiAm4CP0AFHB/NOipQb8IyUAHDwkBDBbQBYgWCXw8oRcUIJQiOl5++ogTpoqWDYG+53Ls5BJnuwAQtnLr8AzITBjmc+vEIIgMaPZzqXh+ARIMihzMXt6RLrSCI4dzVHd4myOGij18IYUkP57onb11qCdDDRcefQUEP5z7cM4dzJ/zh/Drzh78/sty+vbL3TkLsEr4+4PqDdNd+Dw8AV7iQvfgNUMJauTD1TaLBLBW+ugeNiZZOD3+7PaS/mgJJDv/8CyoZIhLE8OUd6FSEtkYKd28Oy32wED+x8kc7jeFV9VE4QsdBBQIfUxcViM5hx6hAu6LDjfSqPI6NXbDrJ2l4boFdMzuk6+ClG+PncBJLsBLWUTaE+AqszLNaFp7xLiHGKJtuUkcuGA0LK9Y4BBtrUQjXJo4OFqo5W58gZ0MFBuHE3tg2JzHeSXf27a1r7Hmzhd2Z1jTL5uG1pXcYKJSk98KGP9vYjzctkk7TG/ajsGVm83RKFjqrRbpnmE4YtRtPp/6ZXdviH9wfZzx1OOoKAAAAAElFTkSuQmCC');}",
		".play2vr-controls button[data-state=\"pause\"] { background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIcAAABeCAMAAAA+CPffAAAAbFBMVEU7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0c7Q0f///9I6BaaAAAAI3RSTlPMygGdvLeww8YLpsGIaJNWE5eAqqIsTI8kcGA5QRozdx57Rr2xE6cAAAPaSURBVGje7dtnk9sgEAZgCEUCoYJ6L87//4/Z5eIodvIlxYJJ/M7czZ1vxjzHChdYk09nlFr6ZmrzdChNl1lrs64zkA5/YZC61rqSUgrBIUlMHxMnHCOElLLSuq4ZBO4l6+AeIPCTKbdhzNvbtPZLoT6dIaei2JvpBogDEG5Il6qSEOHCXZIkwsTIIPhF3HcngcCfEgShCCOdCoMy6yhp3s6PEvKdYs7Tw1gG/7Ib8xw0htAfQ55Df8wTDFm6Zpk5gDL1hXpyqAUUg2FaCp5Ez8OSP8qTKwKTkLU1Qz43O0pOR7E0bVraSvDIjfvKOE3ERWXLtF1hSk6HWtY2NUzy+HWGZ0vEZQ1Tcq8N+SgKMGoBC4BcFpAI3TnI3VE0N8eglFwZmJIKIOuuPhxqn8aSXck4ITAjbVMo5yjW/LCSX85AiNAmnXvnUP2cdhWPL2WcEFbm66LAAdNR1iLywEBIIrPh1oND7XOaycQPg9CYa5iQAhx9ezBxeVXOysgsnXdFinU0FffFIJTy+mh7RZYJyhJ5c+AVYsa1IH27MR57dMQiS6eFNHmp/ZUFIZxtt57A5SEjr44EVkxDcNXGXh2RNONE2oGJmPhMjCuX5AfjlPgMFXZoyVjWvh2cbTlJjU58O+pyJFtXRZ4dSWVSUmbStyOS3UYM+71l+/kjP7vt1x22JB0uW68OEgtmSFZz6tlBRd0Rq/07uLaEVQE4KnDIEBwMHIl3RyLREb0dH6FRSA4RiiP27oiFcxDPDhKWg3p30Lfj7fhXHZT+dExK6f02inm1gz456Nf8r45Q6hLMdfp2/GfP+8E4vL8uDOr1+tvx3fu5kN7f+nfwigWy7xDIPoy2YexL1VkI+3S4XxjGvqUtibEB7ON2GzkC2NfG/fXBeN/n57ocgzj3YFsewjmQO4/KN+bZgQe4N3dO6M9xnlfOaSZiv+e3VZmvAZwj83pr+wDO1YVN5931Gfh04KPpOBVkmQbrqyvnPN4vSDGNnUw8OgTDBiGimhwfyXxAzrIs4Ohvg/W3YrAtB8oCfVvLNBrtoyPmbFPqXf9YAyvG0xVCY86OfC3QofYpNdrLkqGUV9/6+nBChsxLYx9NpB3aZlHf+i0PJq+H0EhAVaZd3ftP+zktL4dQmghWjnNT3B2qaC5sCz4ZEhg3qMpjfzLOSHQVxPUnO8Z+9knjJYKQTDvJyy0UFUJn23g2jj/2r1uQcNep/xIOdcEOdqltmeZTswDjwaGKfmrHzWQMu/k5NtP/Xcv3TfSadaCYsXkdGafj/GDBVnaW1c7yQfl7DEQICQj3qYLb9PD5hi8Y55HMi3pmEwAAAABJRU5ErkJggg==');}",
		".play2vr-controls button[data-state=\"mute\"] {background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAMAAADUivDaAAAA81BMVEUAAAAAAAAAAAB8fHxVVVUAAABAQEATExMAAADg4OAAAAAAAAALCwsAAAAAAAAAAAAAAAD5+fkAAAAAAAAAAAAAAADU1NQAAAAAAAAAAADk5OTb29soKCgAAAAAAAAAAAAAAAAAAAA4ODgAAAAAAAAAAAAAAAD19fX09PTFxcWrq6unp6eFhYVQUFAzMzMvLy8AAAAAAAAAAADo6OihoaGQkJCMjIxycnJbW1tJSUkjIyMbGxsAAAD19fXv7++/v7+xsbGUlJSAgIB6enpnZ2c8PDwAAAAAAAAAAAAAAADr6+vS0tLKysp9fX1GRkb////9/f1PTYGDAAAAT3RSTlPMAMvi2wLXz6D4HQbOx8C2Nf6jdmdP9cOwRPn306WegmIN1qlKLSD9/PHs6+Ta1dRHPj356ubl4NzZ0tGq/Pvw7efj4t7WiWgsDPr08uLYoByZYAAAAo1JREFUWMPNmNl22jAQQCcqxq5t9n2HsO8QoGxJmqZplm7i/7+mtogTW5GQXJ+ck/viF8410ow0M4azwLyr4mleryVjOYBcLFmrz5/8KvS0hsAD0tK6vEKZVREwQNWZIqVQMnngks8oYsVjEk6SfBQojBQCAShlnFLoTZCgqfMV8ShIEY3zFIUISBIpsBUFBNKgAksRj4APIvG3Cj0KvojqtMJogk+aBqVIgW9SXkUcgW9Q261QmvAfVBSXIgN8tiHgkXlVKPyzWV5djfjnVnlRtIDHXRbj78Bl9qLQgM354Bpj/Am4aI6iA0z2t0WMTyug86x4YIYs1MdYqHiwFZx17JZdLKHQjooGcr98V7bYwQZjrwIBC9QgigtwMbnCFiUIeRXmejgGC3W0PAc3F0RRBxdhbPOZUphfEvjnBmA/OODSD3BRJ4qaWLFNWM9FSB0erOdXcFEjCk2s+GsrcLGfwLRCI4qY3EIcShNwESOKnFBhO7qOwbudOaIAocLmGyZcT8GLvMIcYkJvTF3D0gtRh85CiiFwE5XdTnX5up1Fz//IM4J6YCnG2CY7IKLfVFDp1Jr2WIpw7xiLlf2CGyq16ASfHJOIUqB1lyS2acWlX6YSnD5m06xN/01EQrckmubdnz19zOjDDiqBUnBBDf6Vo44WPq6cszTn7u2JFelnhY6Ahbn5JVIg3SkCVWCjrhanFVWJUrS9OZwqRS2Zgmiui6KCKC7Lk7CwLNsolUDNAaEdsEUJ3igRjEvfyzDoprETsGkM3roGb6AdZkHb+ODDBKEjFZfLznsOVoR2RZAObZkhMwZcYuIhk2C0quzlVFuGn4E7SVlQUjxw0zTm6Xtn7L9PzxvcH36M7xf/ABNpnPyavuLEAAAAAElFTkSuQmCC');}",
		".play2vr-controls button[data-state=\"unmute\"] {background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAMAAADUivDaAAABCFBMVEUAAAAAAABqamoFBQUAAADz8/M9PT0AAAAAAADZ2dkAAABOTk4AAAAAAADn5+dDQ0MAAAAAAAAAAAAAAADT09M1NTUoKCgiIiIAAAAAAAAAAAAAAAAAAADg4OC2trZQUFAvLy8UFBQAAAAAAADx8fHc3Nynp6ePj48YGBgAAAAAAAAAAAAAAAAAAADt7e2srKxxcXFISEgtLS0KCgoAAAD19fXk5OTX19fNzc2IiIh4eHhjY2NXV1dTU1MeHh76+vr5+fnp6enQ0NCvr6+goKCCgoJtbW1cXFwPDw/39/fd3d2bm5uVlZV6enoAAAAAAAAAAADHx8fCwsK+vr67u7sAAAD////9/f3fFRhzAAAAVnRSTlPMAN/NoPzXpAL2HdlnBvnYx8C2NfXV09Kqdk5EPfju2tTPwyz89+vm0LCCYkgN++zg2NTOIP359fPl4d7b29H+/vr07enj39zP/ffo5+KJUgzy8fDvsqEJSqYAAAMCSURBVFjDzdjnUttAFAXgC+siHNty770G995tek+AtKP3f5M4MghrLWEJDTM5vzQy8412tau9FzqwnE8lnlP1mjNQICoEnLV66tks4XLbiIvN7TJOCA0bacbWEAwRQuKYdHOcEPYTRSe9G2dxD+GJ097EPe8RrhgZSMylTwT9ZCj+oB6R9JHB+JLaRJJMJKlFBH1mCF9wl3D5yVT8Lp7wxMhkYh6OiJPpxNVEkD6Q4jYhxD5COIUtIkG6Ycsu21x12w7ut8QbIejvzdXUPttc5UL4dcvtW0EhGnpA/2YCHG6uLwBpyv3eUAibjhCulKAQlwC8Ye4b9EoMtIHbWRl4IViUrUIAqoxUGbwQbk2h+/MOCtEpz2kxBMo9UsUtE9rj+Fo9AxQi20IoyjKA1OFHIhNN1c1ILxLp9dhCwhZxBWBKN6dAu682mjKRUt374R2NvOlwFttEbwyk86sxUI6oiZRM1FX30ljnVMyqnoI6J8CcXQLDrpqoy0RNde8I69gdX9TE6hxo07UEcJNRkwmbAYIegFBftANVbj5lImCEOLxDOhr2AhU1EZCJghFi2cJZOFIGMmqiIBNkhMi2UBKj4x2CTBEth8ZT+IwPZFHCKKIxF37j0zk7wVFeLO28kT+GXyprA79pLgHX/EvdXVrjDcGtzlwauGIPgF3klpbeApdE7immEobh/AQ4ivILfHebZULn56FJboltQvQCGda1A5U+v812N3v+67+w5ekW0b8Ahlm6BKRDUqep/8m5naXfCFYFKiw3Au5z3Gy+++ELt0vKQPIXoRxVAHxj2h8+F2nnZqJMZz5K8xPgjD+MXPsOgWjVqxwCkXuNh7DtP4pIzLwSubUWivJHkZEDMd/xfpcv2LVUWhB/IBo6lkl0sI1xtbZ0j+UDwWm5ODgoWihRrBRKlss1p4cvGgcWi0brpav1Atp6GW+9mdjOwFhLM7DeWH1Ce8dHeAroA4EnwVCr60notboJj5mG27kzgv0NN59myv342vY/ulNN3T/8P/5/8Rc7O7ZeYRf8ugAAAABJRU5ErkJggg==');	}",
		".play2vr-controls button[data-state=\"vroff\"] {background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAMAAADUivDaAAAAdVBMVEUAAAAAAADZ2dkAAAAAAAAAAAD29vaoqKjt7e1LS0sAAAC1tbUAAAAAAACJiYl4eHgtLS0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADNzc0AAAAAAADCwsIAAAAAAACZmZljY2MAAADj4+MAAAD///9Loj3HAAAAJnRSTlPMAPHBoWX85PjTHeelBt3az8e2NaqEdk5EPQzusCzrnkng1iD1UlIgDT8AAAIoSURBVFjDzZjrcrIwEIbfcogcBVFEBNSKzf1f4tek0kBCLCRfZ/r8cJCBZ1h2IbvgzZpfVZxrv/QKF3ALr/Tr81pF5HuQ8PxoheJ2xSzX20JF1UJLWy1QdAleknQ/KNIjfuSYvlJEByzgEOkVexeLcPc6xWmHhexO84oTVnCaU+x3WMFuryoiF6twI1mRHrCSQyopjljNcarYw4BuojjAgGSsqGBENVK0MKIVihsMuX0rPBjiDYoexvRPhQ9jfKZQ4wgIBnLqAA5lkKDJ5iLhijOmxPT72C19Z4rNJ/GnKYbCmStqTMnoBU8aGjIFOLlDt5CpucKHRBDgCXEgFAipAxmfK0pIXOh9uJ7NWIEHgUzJFR4E4kxGTEOhEFtjPK4oIEMe44gcquRKUHCFCzWS8Cv2eKK40wYyLldAgecS2ND7WBEG7L+MohhnAk4AhqiLLRR2mkDQ0JyVZvxUcII4BDSBFHORbNlPJvIQkgBztENSZXJWoA0Zp3LDM61JagkFfjq5jBV4sDRpSsuHyju9ZzSbKDJR3kqB15iLZBMTqSYvcxmpxcMu4zyCRlLkJMg1D/ubNxsJ3QrFsC9W76b+xRdSkksKthVqXnwRjImGReAKQ67/cSmyXxDtl2VOYtUccDoY0Nk3StbtWpLKTWNv3TTat672DbR9G28/TAj6ZSNNbz9Y/d54J/gooKX4WDbqppVu1K1S24HbZOxPvsb+5OXY/ze+X/wDaZQi/2wN0NEAAAAASUVORK5CYII=');}",
		".play2vr-controls button[data-state=\"vron\"] {background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAMAAADUivDaAAAAe1BMVEUAAAAAAAAHtMUAAAAAAAAAAAAJzOAEi5gAAAAIxdcBPUQFlqUAAAAAAAADcXwCYmwBJCgAAAAAAAAAAAAAAAAAAAAAAAAGqrsAAAAAAAAAAAAFoLAAAAAAAAAAAAAAAAADfosCUVoAAAAIvM4AAAAAAAAAAAAAAAAK1Ojt7vbIAAAAKHRSTlPMAPGhBsH85Kj40+dnT93az8e2H3ZEDO6wLBzrnoJiSODWNPU+PTaJOJibPwAAAixJREFUWMPNmOtyqjAUhVcJ94sgqHhDq9Y27/+ER3IaA7moJO1Mvx9OdPQblzuQvcWbM7+qWH0cOlIHQFCT7vCxmqrY5gQSJN9OUBz30LI/vqgo1jCyLl5QbAgeQjZPFP4CT1n4jxRNjBeIG7PiM8BLBJ8mxXKOF5kv9YolJrDUKc5zTGB+VhVNgEkEjazwY0wk9iXFApNZjBVnWLARChbDgnioKGBFIRT+Glas/bviCEuOdwWBJYQrGljTfCtyWJMzhZIjCcGpqAd4tCdM2lKXhClWGJPR+3tn9L1XRDeymymDwooprhhT0h1ftjTtFWBUHp1B5soUB0gkCV+FHoQC6S2WzIEpOkjs6Il/n2iowCWETMcUBEqSiP8qqVDw1RjCFDVkwsswkUeVWglqpgigJkn/Z89GihNtIRMwBWRYLW9E9DRUpAl7LqFRiErAYzkG+2IGhbkhCFpa9Vsz+1YwkiwFDEFqXZJZ/1CKOqRhAh1rXlSZqt+gbTgsZcQqbShqBwX28XA3VOBCdUE6vsEV3umppOVIUYrtrWzwK3RJoiyU9uROV5Erv9hVvEvSSooqTCrDxf5GtEnoTCj4axkkyIMbX0rDSijuq9Rw49vCmi0/BPawZP+DR5H7geh+LDPcmgPGxq5FcW+U3Ns156Zx6966ujfQ7m28+zDhPtL80mAl2MRPvoJxvBP4RQ0jdeFrh0xVYhp1C9914J4+9udffOz/yh+M/X/j/4t/Qgsj36x/vDAAAAAASUVORK5CYII=');}",		
		".play2vr-controls button[data-state=\"fulloff\"] {background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAMAAADUivDaAAAAV1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8OKbV/AAAAHHRSTlPMAKFnTwbHtjWqpXZEPQzDwLAsHhyegmJIvokimWJWaQAAAU9JREFUWMPN2AluwjAQheHBS+Ls+wL0/ues5CYtSeNgzwOJ/wCfBFk8E7rAvZUoi2kUcUVUxWKcijKU6KWgXUL2AcQ80GHD7Emohpw1yoNoUzotbZ8QOqOnZfqM6BLyKOnchKnJq6txEXlEnkX5MZFTQPkRYaIQIjL/ia6moOpuT+iEAkv0jsgouGxLGGLUboiEQ6SPhCJW6oFoeETzR8zEbP4lBJcQK3EndveFkLTty92ekAsh+IT4IUriE1RaokCIwhITQkyWGBFitIRACGGJGCFiS1QIUVmCEIJwIsJ/yBX/O5tXXVT81sJvcPwxwx92/JWzvvjYyYXo+US/EJeBKwwvPIrwAxE/lm0pNBzYWg7R4oMSPK6lGh4ae3x0xQdofIxHl4na4CsNvli9eb2zqdgNxMpv1dXKteoqjS7c4Wu/vK1r/02erP2f8f3iGxkCRhfYhMFxAAAAAElFTkSuQmCC');}",		
		".play2vr-controls button[data-state=\"fullon\"] {background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAMAAADUivDaAAAAV1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8OKbV/AAAAHHRSTlPMAKFnTwbHtjWqpXZEPQzDwLAsHhyegmJIvokimWJWaQAAAWFJREFUWMPN2FdywkAQRdFmgkY5J8D7X6erGmEjWWn6mSruAk7xpekHXeDeSuTZ0CtXEBVO9UOW+xKtVrRI6daDGDtarRtPEqaizSpzgqhj2i2uDwib0GGJ3SOaiE4UNdtEWNKpruEWkQZ0siBdJ1LyKF0jwsCHCMK/RFOSV2WzJGxEnkV2QSTkXTInQhJUz4hIQsSvhCFR5oWoZET1S4wkbPwhlJRQT+JOy762o1n3idByQk+EkhPqQeQkJyhnIkOIjIkBIQYmeoTomVAIoZhwCOGYKBCiYIIQgh7EUXtEwERx8Bt2iSsTDiEqJhRCKCZ6hOiZGBBiYCJDiIyJHCHy6ZNzQOyknh8+OaEnoiVx7URcOqnQ/eNThD+I+LPMxdBxwNUSosYPJfhciy18NLb46Yof0PgZj46JMsQnDT6s3jzvOOO2AWfOTV1rtqausejg9p/9+vac/Te9M/s/4/+Lb8hXSJtHPax0AAAAAElFTkSuQmCC');}",
		'#play2vr-videoContainer[data-show=\"show\"] {opacity:1 !important;}',
		".play2vr-ball{height:130%;position:absolute;left:0;top:-30%;margin-left:0;pointer-events:none;transform:translateX(-50%);-webkit-transform:translateX(-50%);display:none;}",
		'.play2vr-ball img{display:block;}',
		".play2vr-controls #play2vr-buf {position:absolute;left:0;top:0;width:0%;height:100%;background:#666;pointer-events:none;}",
		".play2vr-sxWrap{display:none;color:#fff;font-weight:bold;position:absolute;}",
		".play2vr-progress{background:rgba(0,0,0,1);transition:transform .6s ease;-webkit-transition:-webkit-transform .6s ease;}",
		'#play2vr-progress{height:100%;background:#d0353d;width:0;position:relative;}',
		'.play2vr-controls button { background-position:center center; text-align:center}',
		'#play2vr-posterImg{pointer-events:none;width:100%;height:100%;position:absolute;left:0;top:0;z-index:100;background-size:cover;}',
		'@media screen and (max-device-width:736px) and (orientation:landscape){#play2vr-videoContainer, #play2vr-blurDiv{height:4%;} .play2vr-controls .play2vr-progress{width:100%;left:0;} .play2vr-currentWrap{width:7.5%;} .play2vr-totalWrap{width:7.5%;left:77.5%;} .play2vr-playWrap,.play2vr-muteWrap,.play2vr-vrWrap,.play2vr-fullWrap{transform:translateY(-150%);-webkit-transform:translateY(-150%);}}',
		'@media screen and (max-device-width:736px) and (orientation:portrait){#play2vr-videoContainer, #play2vr-blurDiv{height:4%;} .play2vr-controls .play2vr-progress{width:100%;height:100%;} .play2vr-playWrap{width:10%} .play2vr-muteWrap{width:10%;left:60%;} .play2vr-vrWrap{width:10%;left:75%;} .play2vr-fullWrap{width:10%;left:90%;} .play2vr-currentWrap{width:15%;height:40%;left:15%;top:43%;} .play2vr-totalWrap{width:15%;height:40%;left:30%;top:43%;} .play2vr-sxWrap{display:block;width:2%;height:40%;left:29%;top:43%;} .play2vr-playWrap, .play2vr-currentWrap, .play2vr-muteWrap, .play2vr-totalWrap{box-shadow:none;} #videoContainer[data-state=\"small\"] .play2vr-playWrap{width:5%;height:80%;top:10%;left:2%;} #play2vr-videoContainer[data-state=\"small\"] .play2vr-vrWrap{display:none;} #play2vr-videoContainer[data-state=\"small\"] .play2vr-muteWrap{display:none;} #play2vr-videoContainer[data-state=\"small\"] .play2vr-progress{width:35%;height:8%;top:46%;left:11%;} #play2vr-videoContainer[data-state=\"small\"] .play2vr-currentWrap{left:50%;top:30%;} #play2vr-videoContainer[data-state=\"small\"] .play2vr-sxWrap{left:66%;top:30%;} #play2vr-videoContainer[data-state=\"small\"] .play2vr-totalWrap{left:70%;top:30%;} #play2vr-videoContainer[data-state=\"small\"] .play2vr-fullWrap{width:5%;height:80%;top:10%;left:89%;} #play2vr-videoContainer[data-state=\"small\"]  img{height:100% !important;}}',
		'@supports (-webkit-backdrop-filter: none) { #videoContainer{z-index:222}}'
	].join("\n");
	
	
	var $t = this;
	var container = $t.api.getDiv();
	
	var _attr = function(ele, props)
	{
		if (typeof ele == 'string') ele = document.querySelector(ele);
		if (ele)
			for (var p in props)
				if (props.hasOwnProperty(p))
					ele.setAttribute(p, props[p]);
	};
	
	var _addFigure = function(htmlText)
	{
		var figure = document.createElement('div');
		_attr(figure, {
			id: 'play2vr-videoContainer',
			'data-fullscreen': false
		});
		
		figure.innerHTML = htmlText;
		container.appendChild(figure);
	};
	
	var _addCss = function(cssText)
	{
		var style = document.createElement('style');
	    style.type = 'text/css';
	    style.id = 'play2VRskin';
	
	    if (style.styleSheet) {
	        style.styleSheet.cssText = cssText;
	    } else {
	        style.innerHTML = cssText;
	    }
		
		var play2VRskin = document.getElementById('play2VRskin');
	   
		if(play2VRskin){
			play2VRskin.parentNode.removeChild(play2VRskin); 
			
		}
		
	    document.getElementsByTagName("head")[0].appendChild( style );
	};	
	
	var _togglePlayState = function()
	{
		if ($t.video.paused || $t.video.ended){
			playpause.setAttribute('data-state', 'play');
		}else{
			playpause.setAttribute('data-state', 'pause');
		}
	}
	
	var _toggleMuteState = function()
	{
		mute.setAttribute('data-state', $t.video.muted ? 'unmute' : 'mute');
	}
	
	var hours = 0, minutes = 0, seconds = 0;
	var _setPlayerTime = function(ele, sec_num)
	{
		hours   = Math.floor(sec_num / 3600);
		minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	    seconds = Math.floor(sec_num - (hours * 3600) - (minutes * 60));
	
	    if (hours   < 10) {hours   = "0"+hours;}
	    if (minutes < 10) {minutes = "0"+minutes;}
	    if (seconds < 10) {seconds = "0"+seconds;}
	    
	    ele.innerText = minutes+':'+seconds;
	}
	
	var _bindVideoEvents = function()
	{		
		var videoEventHandlers = {
	    	loadedmetadata: function(e)
	    	{
	    		progress.setAttribute('max', $t.video.duration);
	    		_setPlayerTime(totalTime, $t.video.duration);
	    	},
	    	canplay: function(e)
	    	{
				
	    	},
	    	play: function(e)
	    	{
				_togglePlayState();
	    	},
	    	pause: function(e)
	    	{
	    		_togglePlayState();
	    	},
	    	timeupdate: function(e)
	    	{
	    		_setPlayerTime(currentTime, $t.video.currentTime);
				if (!progress.getAttribute('max')) progress.setAttribute('max', $t.video.duration);
				progress.value = $t.video.currentTime;
				document.getElementById('play2vr-progress').style.width = Math.floor(($t.video.currentTime / $t.video.duration) * 100) + '%';
				ball.style.left = Math.floor(($t.video.currentTime / $t.video.duration) * 100) + '%';
				ball.style.display = 'block';
	    	},
	    	progress: function(e)
	    	{
				var buf = $t.video.buffered, leg = buf.length-1, progessPercent = 0;
				if(leg >= 0) progessPercent = buf.end(leg)/$t.video.duration * 100;	
				document.getElementById('play2vr-buf').style.width = Math.floor(progessPercent) + '%';
	    	},
	    	ended: function()
	    	{
	    		videoContainer.removeAttribute('data-show');
	    	},
	    	error: function()
	    	{
	    	
	    	}
	    }
	    for (var e in videoEventHandlers)
	    	$t.video.addEventListener(e, videoEventHandlers[e].bind(this));	
	};
	
	_addCss(cssText);
	_addFigure(htmlText);
	
	var videoContainer = document.getElementById('play2vr-videoContainer');
	var videoControls = document.getElementById('play2vr-video-controls');
	videoControls.setAttribute('data-state', 'visible');

	var playpause = document.getElementById('play2vr-playpause');
	var _playpauseButton = function(e)
	{
		if ($t.video.paused || $t.video.ended) $t.api.play();
		else $t.api.pause();
	};
	
	var mute = document.getElementById('play2vr-mute');
	var _muteButton = function(e)
	{
		$t.video.muted = !$t.video.muted;
		_toggleMuteState();
	};
	
	var progress = document.getElementById('play2vr-progress');
	var progressBar = document.getElementById('play2vr-progress-bar');
	var ball = document.getElementById('play2vr-ball');
	var _progressButton = function(e)
	{
		var XX; 
		var d = document.getElementById('play2vr-progressBg');
		var WW = parseInt(window.getComputedStyle(d).width);
		
		if(isTouchDevice){
			XX = e.changedTouches[0].pageX;
		}else{
			XX = e.offsetX;
		}	 
				
		$t.video.currentTime = XX / WW * $t.video.duration;
	};
	
	var supportsProgress = (document.createElement('play2vr-progress').max !== undefined);
	if (!supportsProgress) progress.setAttribute('data-state', 'fake');
	
	var currentTime = document.getElementById('play2vr-currentTime');
	var totalTime = document.getElementById('play2vr-totalTime');
	
	var vrMode = document.getElementById('play2vr-vrmode');
	var _vrModeButton = function(e)
	{
		var currentState = this.getAttribute('data-state');
		if (currentState == 'vroff') currentState = 'vron';
		else if (currentState == 'vron') currentState = 'vroff';
		this.setAttribute('data-state', currentState);
		$t.api.toggleVR();
	}
	
	var fullMode = document.getElementById('play2vr-fullmode');
	var _fullScreenButton = function(e)
	{
		var currentState = this.getAttribute('data-state');
		if (currentState == 'fulloff') currentState = 'fullon';
		else if (currentState == 'fullon') currentState = 'fulloff';
		this.setAttribute('data-state', currentState);
		$t.api.toggleFullscreen();
		fitCanvas();
	}
	
	document.getElementById('play2vr-videoContainer').addEventListener('touchstart', function(e){e.preventDefault()});

	var startX, startY, moveEndX, moveEndY, X, Y; 
	
	var touchstartBall = function(e){
		e.preventDefault();
		startX = e.targetTouches[0].pageX,
		startY = e.targetTouches[0].pageY;
	}
	
	var touchmoveBall = function(e){
		e.preventDefault();
		moveEndX = e.targetTouches[0].pageX,
		moveEndY = e.targetTouches[0].pageY;
		 X = moveEndX - startX,
		 Y = moveEndY - startY;	
		    if ( Math.abs(X) > Math.abs(Y) && X > 0 ) {
		    	$t.video.currentTime += X/$t.video.duration;
		    }
		    else if ( Math.abs(X) > Math.abs(Y) && X < 0 ) {
		    	$t.video.currentTime += X/$t.video.duration;
		    }
	}
	
	videoContainer.addEventListener('touchstart', touchstartBall);
	videoContainer.addEventListener('touchmove', touchmoveBall);
	
	var hideId;
	var _progressHide = function(){
		clearTimeout(hideId);
		videoContainer.setAttribute('data-show', 'show');
		document.querySelector('.play2vr-progress').style.cssText += '-webkit-transform:translateY(0px);transform:translateY(0px);';
		document.querySelector('#play2vr-ball').style.opacity = 1;
		document.querySelector('.play2vr-playWrap').style.display = 'block';
		document.querySelector('.play2vr-muteWrap').style.display = 'block';
		document.querySelector('.play2vr-vrWrap').style.display = 'block';
		document.querySelector('.play2vr-fullWrap').style.display = 'block';
		
		hideId = setTimeout(function(){
			document.querySelector('.play2vr-progress').style.cssText += '-webkit-transform:translateY(60%);transform:translateY(60%);';
			if(window.orientation == 0){
				document.querySelector('.play2vr-progress').style.cssText += '-webkit-transform:translateY(80%);transform:translateY(80%);';
			}
			document.querySelector('#play2vr-ball').style.opacity = 0;
			document.querySelector('.play2vr-playWrap').style.display = 'none';
			document.querySelector('.play2vr-muteWrap').style.display = 'none';
			document.querySelector('.play2vr-vrWrap').style.display = 'none';
			document.querySelector('.play2vr-fullWrap').style.display = 'none';
		},4000)
	}
	
	
	var eventName = isTouchDevice ? 'touchstart' : 'click';
	
	
	playpause.addEventListener(eventName, _playpauseButton);
	mute.addEventListener(eventName, _muteButton);	
	document.getElementById('play2vr-progressBg').addEventListener(eventName, _progressButton);	
	vrMode.addEventListener(eventName, _vrModeButton);
	fullMode.addEventListener(eventName, _fullScreenButton);
	
	container.addEventListener(eventName, _progressHide);

	
	_bindVideoEvents();
	
	
	
	function fitCanvas(){
		var canvasData = container.getBoundingClientRect();
		var barHeight = canvasData.height / 9;
		var btnHeight = canvasData.height / 4;
		var barStyle, btnStyle;
		
		barStyle = 'height:' + barHeight + 'px;';
		btnStyle = 'height:' + btnHeight + 'px;width:' + btnHeight + 'px;';
		
		
		clearTimeout(hideId);
		
		//document.querySelector('#player').style.cssText += 'position:absolute !important;'
				
		//if(window.orientation == 0){
//			if(canvasData.height < window.innerHeight){ //小窗口
//				document.querySelector('.play2vr-ball').style.cssText += 'display:none;'
//			}else if(canvasData.height == window.innerHeight){
//				alert(2)
//				document.querySelector('.rich_media_area_primary').style.cssText += 'padding:0;'
//			}	
//		}
	}
	
	fitCanvas();
	container.addEventListener('resize', fitCanvas);
	
}
play2VR.conciseSkin = conciseSkin;