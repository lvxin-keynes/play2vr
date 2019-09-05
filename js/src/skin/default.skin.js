//! Copyright 2017 Digitberry Ltd. 
//! Build time: 2018/4/13 10:00:00
function defaultSkin(options) {
	this.video = options.video;
	this.api = options.api;
	var _this = this;
	var container = _this.api.getDiv();
	var hours = 0,minutes = 0,seconds = 0;
	var isShow=false;
	var enableMove=false;
	var isTouchDevice = 'ontouchstart' in document.documentElement;
	var eventName = isTouchDevice ? 'touchstart' : 'click';
	var _totalTime=0;
	var _bitrates=[];
	var _curBitrates='';
	var cssTextPC = [
		"*{margin:0;padding:0;}",
		".clearfix:after{display: block; content: ''; width:100%; clear: both;}",
		"#play2vr-blurDiv{width: 100%; height: 40px; position: absolute; left: 0; bottom: 0;z-index: 400000; }",
		"#play2vr-videoContainer{transition: bottom 0.5s; -webkit-transition:bottom 0.5s; -moz-transition:bottom 0.5s ;width: 100%; height: 45px; position: absolute; left: 0; bottom:-40px; background: rgba(59,63,81,0.6);z-index: 500000;}",
		"#play2vr-video-controls{height:40px; }",
		".playskin-btn-playwrap{cursor:pointer;width:60px; height: 40px;float: left;position: relative;}",
		".playskin-btn-playwrap button{transition: opacity 0.5s; -webkit-transition:opacity 0.5s; -moz-transition:opacity 0.5s ;cursor:pointer;-webkit-opacity:0.5; -moz-opacity: 0.5; opacity:0.5;width: 20px; height: 20px; position: absolute; left: 0; right: 0; top: 0; bottom: 0;margin: auto; z-index:500200 ;background-position: center center;background: transparent;background-size:20px 20px;background-repeat: no-repeat;border: none;}",
		".playskin-btn-playwrap:hover button{opacity:1;-webkit-opacity:1; -moz-opacity:1; }",
		".playskin-time-playwrap{width: 120px; height: 40px;float:left; line-height: 40px; color: #FFFFFF;opacity: 0.5;-webkit-opacity:0.5; -moz-opacity:0.5; text-align: center;}",
		".playskin-time-playwrap span{margin: 0 5px;font-size:14px ;}",
		".playskin-controls-left { float:left;}",
		".playskin-controls-right{float:right;}",
		".playskin-btn-play[data-state=\"play\"]{background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABTklEQVRoge2awXHCMBAAqYFQCcmDOhIqSagkeVICPygkg10ANQAFbB7O4RmPwljC0t1psk+/bmfWtixrNhsA7IDV8Lo7gBMdW2ChPU8ywDc9R+AdmGvPFc1ARNgDr9qzRfGHCMAZ+ASW2jOO4o6I0LjIbYSIj9wiRAAuZnOLFBEktyft+W8kigh2cntQBPrcnr2LCLq5TSgi7IG3GkRAI7dMIkIDfFAit8wiQv7cColAl9sXuXIrKCLkyU1BRDgwZW6KIgBXpspNWURo6XJL/9TGhoiQnhu2RKDP7cW7iBCXG3ZFhAOw/hcxQAtscJxWFTe7+8ev+xdiFUsU94tGycjtMr6KD6tpM1IQcb/5kDejQiLuN+jKZZRJpIpNbJ2MQiSKuP/RYyOjEBEidv5OhRghYi+jEHdEqjgwYDujEAMR14dqTr8S7o85uTx49gMS2BYyfQubIAAAAABJRU5ErkJggg==');}",
		".playskin-btn-play[data-state=\"pause\"]{background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAaklEQVRoge3PMRHAMBADQfNvDCnQPghcpHGuWAHQza5l9u9m5pnzdu33ehCkFgSpBUFqQZBaEKQWBKkFQWpBkFoQpBYEqQVBakGQWhCkFgSpBUFqQZBaEKQWBKkFQWpBkFoQpBa8DjH7thdG1bkXIgxlEwAAAABJRU5ErkJggg==');}",
		".playskin-btn-voice[data-state=\"voice\"]{background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACGElEQVRoge3ZsWsTURwH8BM7VBDsUFGwg0P/gI6iDp1sB4WgHRwcOhanFqouIoHi5NBFcBJ1kApiF6dODg4FdXGqUNRBRdChg2OGj0OS+lrb3ruaNO9JvnDb75f7fXK83OVdUfTTz/8VDGIRV3s9y76Dy1jRzGKv56kcnMICfviTvCC4iJf+Th4QHMdtfN0BkQcEF/BiF0D6EBzDTXwsQaQLwTiWIgBpQnAEs1irgEgLghE7/yLFpF7y2aN4i9c42U3ENWzsExEDuRfUPogdagCTmI44zuP5PwBiIdNB7QYGYyCTHRis05Cj+BXUlz+b2ao/qJQudtwP6pdShex5RVpznQnqGxjJEtKabT3omUoREnUfwcOg527OkBtBz3LOkEtBzxoOpQapR0KGt/XtfpdPGdKa73vQN54aJPqhER+CvomcIW+CviupQeoVIK+CvunUIFWuyLugr5Yz5FPQdy41SL0CJMzpLCEYC3oaGEgNEntnnwt6VsuKU4Y8DXoepwipR0LCfYH5suJaihBb1weMlTUMYgb1iGMWXw4IMh/Ur5fVVw6G8OgAIOGe2ULHIcGJavjZRUj7y2pgtGuQ1smG7W+fKwYyhClla6NTwWFcx/sKkHT2frcHZ/Eke0hRbO7Oz9n6Zyg/SDua70ueZQ8pis3Fegufs4a0gwksZw8piqLACdzBt6wh7Wg+P61iptez9NPPHvkNZa0xecRQrboAAAAASUVORK5CYII=');}",
		".playskin-btn-voice[data-state=\"mute\"]{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAB7ElEQVRoge3ZvWvVUBjH8TN0KDi5CQ4uTuIqdHOVLio4udjBP6BDkYuLBQXfhjsKruJkwUERXOyg4ODQoZsOHZyE4h0cigh+HJLobXKT+1KbcwL5QqY8Ib8vz81zknND6Onp6ekZA0tYxxd8xErsTHODVbx0mK3YuWYm78ImfqmyFzvfTOAyXk8QKBjFztgIzuAevjVIpC2Ca3g7RSBdEZzFQ3yfUSI9EVzHuzkE0hLBOQzxYwGJNERwAx8WFGhPBJfw6YhBp3H86wh2j1miNZE2qIjgseyZ25ySbwlPMMJGUiJ5uPHBMWyQeDFWt5uUSH7fu6WaYel8WQJuJieS33tYqhs2SKzXSsQWqZMxr0SLIrXrCE7gUc11P3F7qkQKHWnoDLN0IpWO5BlOyUZsmftY7oRIg0TBbDLteNROrYnTSc00S0Gk0hHVThxgkJ9blnVinObOtOMxcUEs/5wqD7ZqZwYpioyaJGpkdlIU2ZC9ea/VhvtXO8BOYy1etSDSyofVCraxV3P8D+Jv0Mk2HLaPKBL/mz2Ev1tAD7DfaZECXMWbzouEEAJO4w6+dlqkQLb7stV5kRBCwEncwudOixTgIp51XqQAaw6/ehTEX0fmBRfwFL/HRJ7HzrUwuIL3sv8Tz8fO09PT0xOfP8jlmG3jn1L5AAAAAElFTkSuQmCC')}",
		".playskin-btn-fullscreen[data-state=\"fullon\"]{background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACs0lEQVRoge2aP2sUQRiHt7BIYWmRwiJFiissgooGPTSKEWNjUCGihY2t3yGdH8HCD2CpKBqJaIhRxEKPEMhho0WKFSyCXGnxWOxuHGdnbv69e3vI/WCru/m97zPz7s27s5cBD4HvAdceZuVZoIDXFq+9wJweZRajUG0CFyJAzgNvJRKQAHkHXAyFUGDOAW9Sk0gFeQ9cioVQYLrYy6xxkA/AYiqEAnMWWB81yEfgshSEAnMGeDVKkAfSEArMLPB7VCC/gPsNQHSAxzEJpdwjP4B74wCRCgLFZnSnbQgJEIBd4HqbECADAvAZWGoLAuRAoNgcF9qAADtIH7gJDAL9+sC0B8RhYCvQe1Dm1Dd9aAI5SIaidYiBmRoCcYg4iG45fhoDjA5Sm9EImAEwMwTkSIRfV/OowaggG1hqHFgGeh5BvwF3PUprheLXzqU+cMviMQ+s6SDO2sa9MrWZa9oPZWUyYMcF4RE8CELSr4TZCY1tKrOvwO1go79+N4Btxc9aTuJSZjJqJZr2Cw0+CxwT9OtI+k000UQT/acqd9QZQb+jkn6+QTtALrghVn450JHI0SfoFYoDukrbpD2zXwU+KX49YDnGqBfQNFYzJ9U02vy8V+agaVQaNVcbbwsaBePh54RBa+P3y4FrwLxlgF5ONu0CKx4Q14AvHn7WMgPmgCfVF30edV0zp2ugexhm8WeAX21lcDzq1mAiIKrxww4fpvQkQmBMEDD8OGiBOAif4yBjMg7lZU7W46B90wcRst5jFph/ajxVUiBBEE3ASIBEQUjDpIIkQUjCpICIQEjBxIKIQkjAxL5WmJOG0GCiQMZpRY4DT0cJIg4DnACeReYyNr9aJ4HnCXmMxT5yCniRmEPrO/tp4KVAfDKKFzy6ctx/9toqx1bXagTIquax4RHX1Mj2/gAk/0tjajDnQgAAAABJRU5ErkJggg==');}",
		".playskin-btn-fullscreen[data-state=\"fulloff\"]{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACzUlEQVRoge3aL4zUQBTH8QoEAonAYQipIUEgSFhxCea43YMlWXHiBEGQE4iTyE0QSAQS0QRHMLhzkGD4/yc5seLEYcgKBGIFYsUX0U622+28zpvO7B1Jf8mptu/10+m13WmTpCbAY+AI6NUtP4kAI+AYGLpuMGaRH8DdyPvosk/3CgTAT+B+0wZPWc1MMzJAD9gVlj8EUkW9ETCv7NMcGGkQKkyBmAFjYZ0MmLpgLAg7pnI62XJoPQp5jR1gUqwrQcwB+wT0hfXKp5Mtv4AHZoMnDgiT2pFhMRImEiQrrVc7MsgjUc0cGCbkVydNljA1CA1kBaNEmBwkQFoUU2MsCNBBKPqn+CEmwAVT3BdThwA9BOA3bRClBtvAF2UhWySIdHXU5AC4bmsyAD4HaBIbYkeUGvXJL41tEhPSjCg12wI+nkKIO6LU8Bbw4RRB9IhS05T8ahISknnUO6J6dVJC9tBflpsgPiMyAXbWjYgB8cO0RMSC6DABEDEhbphACIh/Q7RjgE30zzq2WI8Y+S/EEJkBV8WR6dKlS5cuawtwHtgI8NcDzgh9zgbqswGcq2sQ8oa4L0A082hSpsAlWxOX2T2XjAVIiEeU7zTNyhMGExPSjAiIiQVxRwTCxIDoEQEwoSH+iKLpnaLISUPeADd8EbeBbx5NY0Agnw66pkVsA189G8aCALwGrrgiBrSfzI4FAXgJXG5C9Pk/JrFfABdtDbZoP3ltEhsC8JyadyM+L3qmwjYSJLNs80fZH+AV5gEVf0QqbKuFmHr7yv0AeGYKa+8T1ZeXdRgNpFrPB7OXAEPcH99tr5OrGFeIrZ4GM8PcX3B7FHkPbAo7OGBx75Eg5p/9HXBTWO8R8Ldhn1ZnHJFfDbt+cmFGRoJkinrSyNg/K7FgnJpWMANh+a6yXh2m+dsYlk8z8XRaV1g+zVSvFobAW82Rix3yye9j20j8A2yHwvmw6qDQAAAAAElFTkSuQmCC') ;}",
		".playskin-btn-vr[data-state=\"vr\"]{width:28px; background-size: 28px 20px; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAApCAMAAABeObpoAAAAM1BMVEUAAAD///////////////////////////////////////////////////////////////+3leKCAAAAEHRSTlMAgMDwQOCgUCCQMBBgsNBwGcfoZQAAAaZJREFUSMfFlluWhCAMRAUEQVF7/6udcwzjnSR8T+cvkFdVRbqXb1oQW/XpPo63x+nhjNfnsRTDTthHrOnkOI6fmpKH5bdTloOoctcRdlJfWaEHyVQUq1SaZreB5W9uHyHh8W5ysE0IG96kcToe75wlZwWv+sa3ZqWEUOBufXTAMY2zeIcabU0KEiBM422Ea0Y3JUSmknRKOjpw77WN5jIYHJE5vLYNh8bswTL8apILneyUBFfFnoIJIYnG3EHQyeaCCq1ozH6AKoCKXmh1yJDsBxChr17IPEBwXUCoSwsEuWYyaktjdAGUt82ionHUe+6tj1tWiMY7yWWSmrp7Ns43sizY5VOb4FWw4qt4XTCb2gQt9ptcAG+munqLSSrvJjmP5IQK8AGZ/r1Cq9hfJrETZTatktYqSGA2Q/GVJLbczdbsc8QTlJRqwIKV5N5vPikccCmt2A/Pl3+AMPdLMP+kmnknKOn3A44OPeFtGzAf5p6grH09Tz50cjfitBkxYcIjwcxT+TH3G8zJjC++sWS0IsirwME9W1H08zUZiLmL+1dTl3+0H7dIQKu06WK7AAAAAElFTkSuQmCC');}",
		".playskin-progress-wrap{cursor: pointer; width:100%;height: 5px;position: relative;}",
		".playskin-progress-container{cursor: pointer; width: 100%; height: 5px; background:rgba(0,0,0,0.2);}",
		"#play2vr-buf{cursor: pointer; width: 100%; height: 100%; position: absolute;left: 0; top: 0; z-index:500300 ; background:rgba(204,204,204,0.5);opacity: 0.6;-webkit-opacity:0.6; -moz-opacity:0.6;pointer-events: none;}",
		"#play2vr-progress{cursor: pointer;width: 100%; height: 100%; position: absolute; left: 0; top: 0; z-index: 500400; background:rgba(50, 197, 210, 0.5);}",
		"#play2vr-ball{-webkit-transition:opacity 0.5s; -moz-transition:opacity 0.5s ;-webkit-opacity:0.5; cursor: pointer; opacity: 0;-webkit-opacity:0; -moz-opacity:0; width: 10px; height: 10px; background: #FFFFFF; border-radius: 50%; position: absolute;left: 0; top: 0; bottom: 0; margin: auto;z-index: 500500;}",
		".playskin-progress-wrap:hover #play2vr-ball{opacity: 1 !important;-webkit-opacity:1 !important; -moz-opacity:1 !important;}",
		".playskin-bitrates-playwrap{display:none;cursor:pointer;width: 70px; height: 40px;float:left; line-height: 40px;  text-align: center; position: relative;}",
		".playskin-bitrates-playwrap span{transition: opacity 0.5s; -webkit-transition:opacity 0.5s; -moz-transition:opacity 0.5s ;-webkit-opacity:0.5; -moz-opacity:0.5;opacity: 0.5;color: #FFFFFF;}",
		".playskin-bitrates-playwrap:hover span{opacity:1;-webkit-opacity:1; -moz-opacity:1;}",
		".playskin-bitrates-choose{display:none; width: 100px; height: 123px; position: absolute; z-index: 500500; left:-15px; bottom: 45px; background:rgba(59,63,81,0.8);}",
		".playskin-bitrates-choose ul li{-webkit-transition:opacity 0.5s; -moz-transition:opacity 0.5s ;-webkit-opacity:0.5;  list-style: none; color: #FFFFFF; opacity: 0.5;-webkit-opacity:0.5; -moz-opacity:0.5;border-bottom:1px solid rgba(0,0,0,0.4);}",
		".playskin-bitrates-choose ul li:hover{opacity: 1;-webkit-opacity:1; -moz-opacity:1; border-bottom:1px solid rgba(0,0,0,0.2);}",
		"@media only screen and (max-width: 450px) {.playskin-bitrates-playwrap,.playskin-voice-playwrap,.playskin-vr-playwrap{display: none !important;}}",
		"@media only screen and (max-width: 260px) {.playskin-time-playwrap{ display: none;}}"
	].join("\n");
	var cssTextMobile=[
		"*{margin:0;padding:0;}",
		".clearfix:after{display: block; content: ''; width:100%; clear: both;}",
		"#play2vr-blurDiv{width: 100%;position: absolute; left: 0; bottom: 0;z-index: 400000; }",
		"#play2vr-videoContainer{transition: bottom 0.5s; -webkit-transition:bottom 0.5s; -moz-transition:bottom 0.5s ;width: 100%;position: absolute; left: 0;  background: rgba(59,63,81,0.6);z-index: 500000;}",
		".playskin-progress-wrap{ position: relative;}",
		".playskin-progress-container{width: 100%; background:rgba(0,0,0,0.2);}",
		"#play2vr-buf{ width: 100%; height: 100%; position: absolute;left: 0; top: 0; z-index:500300 ; background: #ccc;opacity: 0.6; -webkit-opacity:0.6; -moz-opacity:0.6;pointer-events: none;}",
		"#play2vr-progress{cursor: pointer; width: 100%; height: 100%; position: absolute; left: 0; top: 0; z-index: 500400; background:#32c5d2 ;}",
		"#play2vr-ball{background: #FFFFFF; border-radius: 50%; position: absolute;left: 0; top: 0; bottom: 0; margin: auto;z-index: 500500;}",
		".playskin-btn-playwrap{float: left;position: relative;}",
		".playskin-btn-playwrap button{cursor:pointer;opacity:0.5;-webkit-opacity:0.5; -moz-opacity:0.5; position: absolute; left: 0; right: 0; top: 0; bottom: 0;margin: auto; z-index:500200 ;background-position: center center;background: transparent;background-repeat: no-repeat;border: none;}",
		".playskin-time-playwrap{font-size:12px ;float:left; color: #FFFFFF;opacity: 0.5;-webkit-opacity:0.5; -moz-opacity:0.5; text-align: center;}",
		".playskin-time-playwrap span{font-size:12px ;}",
		".playskin-bitrates-playwrap{font-size: 12px;cursor:pointer;float:left;  text-align: center; position: relative;}",
		".playskin-bitrates-playwrap span{opacity: 0.5;-webkit-opacity:0.5; -moz-opacity:0.5;color: #FFFFFF; font-size: 12px;}",
		".playskin-bitrates-choose{  position: absolute; z-index: 500500; background:rgba(59,63,81,0.8);}",
		".playskin-bitrates-choose ul li{ list-style: none; color: #FFFFFF; opacity: 0.5;-webkit-opacity:0.5; -moz-opacity:0.5;border-bottom:0.013rem solid rgba(0,0,0,0.4);}",
		"@media screen and (max-device-width:1366px) and (orientation:landscape){#play2vr-blurDiv{height:0.533rem;}#play2vr-videoContainer{height:0.867rem;bottom:-0.867rem;} #play2vr-videoContainer.on{bottom:0;} .playskin-progress-wrap{height:0.067rem;margin:0.133rem;}.playskin-progress-container{height:0.067rem;}#play2vr-ball{width:0.26rem;height:0.26rem;}#play2vr-video-controls{height:0.533rem;}.playskin-btn-playwrap{width:0.8rem;height:0.533rem;}.playskin-btn-playwrap button{width:0.267rem;height:0.267rem;background-size:0.267rem 0.267rem;}.playskin-time-playwrap{width:1.6rem;height:0.533rem;line-height:0.533rem;}.playskin-time-playwrap span{margin:0 0.067rem;}.playskin-bitrates-playwrap{width:0.933rem;height:0.533rem;line-height:0.533rem;}.playskin-bitrates-choose{width:1.333rem;display:none;left:-0.2rem;bottom:0.867rem;}.playskin-btn-vr[data-state=\"vr\"]{width:0.373rem;background-size:0.373rem 0.267rem;}}",
		"@media screen and (max-device-width:1024px) and (orientation:portrait){#play2vr-blurDiv{height:1.067rem;}#play2vr-videoContainer{height:1.733rem;bottom:-1.733rem;} #play2vr-videoContainer.on{bottom:0;} .playskin-progress-wrap{height:0.133rem;margin:0.267rem;}.playskin-progress-container{height:0.133rem;}#play2vr-ball{width:0.4rem;height:0.4rem;}#play2vr-video-controls{height:1.067rem;}.playskin-btn-playwrap{width:1.333rem;height:1.067rem;}.playskin-btn-playwrap button{width:0.533rem;height:0.533rem;background-size:0.533rem 0.533rem;}.playskin-time-playwrap{width:2.667rem;height:1.067rem;line-height:1.067rem;}.playskin-time-playwrap span{margin:0 0.133rem;}.playskin-bitrates-playwrap{width:1.6rem;height:1.067rem;line-height:1.067rem;}.playskin-bitrates-choose{width:2.667rem;display:none;left:-0.55rem;bottom:1.733rem;}.playskin-btn-vr[data-state=\"vr\"]{width:0.747rem;background-size:0.747rem 0.533rem;}}",
		".playskin-controls-left { float:left;}",
		".playskin-controls-right{float:right;}",
		".playskin-btn-play[data-state=\"play\"]{background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABTklEQVRoge2awXHCMBAAqYFQCcmDOhIqSagkeVICPygkg10ANQAFbB7O4RmPwljC0t1psk+/bmfWtixrNhsA7IDV8Lo7gBMdW2ChPU8ywDc9R+AdmGvPFc1ARNgDr9qzRfGHCMAZ+ASW2jOO4o6I0LjIbYSIj9wiRAAuZnOLFBEktyft+W8kigh2cntQBPrcnr2LCLq5TSgi7IG3GkRAI7dMIkIDfFAit8wiQv7cColAl9sXuXIrKCLkyU1BRDgwZW6KIgBXpspNWURo6XJL/9TGhoiQnhu2RKDP7cW7iBCXG3ZFhAOw/hcxQAtscJxWFTe7+8ev+xdiFUsU94tGycjtMr6KD6tpM1IQcb/5kDejQiLuN+jKZZRJpIpNbJ2MQiSKuP/RYyOjEBEidv5OhRghYi+jEHdEqjgwYDujEAMR14dqTr8S7o85uTx49gMS2BYyfQubIAAAAABJRU5ErkJggg==');}",
		".playskin-btn-play[data-state=\"pause\"]{background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAaklEQVRoge3PMRHAMBADQfNvDCnQPghcpHGuWAHQza5l9u9m5pnzdu33ehCkFgSpBUFqQZBaEKQWBKkFQWpBkFoQpBYEqQVBakGQWhCkFgSpBUFqQZBaEKQWBKkFQWpBkFoQpBa8DjH7thdG1bkXIgxlEwAAAABJRU5ErkJggg==');}",
		".playskin-btn-voice[data-state=\"voice\"]{background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACGElEQVRoge3ZsWsTURwH8BM7VBDsUFGwg0P/gI6iDp1sB4WgHRwcOhanFqouIoHi5NBFcBJ1kApiF6dODg4FdXGqUNRBRdChg2OGj0OS+lrb3ruaNO9JvnDb75f7fXK83OVdUfTTz/8VDGIRV3s9y76Dy1jRzGKv56kcnMICfviTvCC4iJf+Th4QHMdtfN0BkQcEF/BiF0D6EBzDTXwsQaQLwTiWIgBpQnAEs1irgEgLghE7/yLFpF7y2aN4i9c42U3ENWzsExEDuRfUPogdagCTmI44zuP5PwBiIdNB7QYGYyCTHRis05Cj+BXUlz+b2ao/qJQudtwP6pdShex5RVpznQnqGxjJEtKabT3omUoREnUfwcOg527OkBtBz3LOkEtBzxoOpQapR0KGt/XtfpdPGdKa73vQN54aJPqhER+CvomcIW+CviupQeoVIK+CvunUIFWuyLugr5Yz5FPQdy41SL0CJMzpLCEYC3oaGEgNEntnnwt6VsuKU4Y8DXoepwipR0LCfYH5suJaihBb1weMlTUMYgb1iGMWXw4IMh/Ur5fVVw6G8OgAIOGe2ULHIcGJavjZRUj7y2pgtGuQ1smG7W+fKwYyhClla6NTwWFcx/sKkHT2frcHZ/Eke0hRbO7Oz9n6Zyg/SDua70ueZQ8pis3Fegufs4a0gwksZw8piqLACdzBt6wh7Wg+P61iptez9NPPHvkNZa0xecRQrboAAAAASUVORK5CYII=');}",
		".playskin-btn-voice[data-state=\"mute\"]{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAB7ElEQVRoge3ZvWvVUBjH8TN0KDi5CQ4uTuIqdHOVLio4udjBP6BDkYuLBQXfhjsKruJkwUERXOyg4ODQoZsOHZyE4h0cigh+HJLobXKT+1KbcwL5QqY8Ib8vz81zknND6Onp6ekZA0tYxxd8xErsTHODVbx0mK3YuWYm78ImfqmyFzvfTOAyXk8QKBjFztgIzuAevjVIpC2Ca3g7RSBdEZzFQ3yfUSI9EVzHuzkE0hLBOQzxYwGJNERwAx8WFGhPBJfw6YhBp3H86wh2j1miNZE2qIjgseyZ25ySbwlPMMJGUiJ5uPHBMWyQeDFWt5uUSH7fu6WaYel8WQJuJieS33tYqhs2SKzXSsQWqZMxr0SLIrXrCE7gUc11P3F7qkQKHWnoDLN0IpWO5BlOyUZsmftY7oRIg0TBbDLteNROrYnTSc00S0Gk0hHVThxgkJ9blnVinObOtOMxcUEs/5wqD7ZqZwYpioyaJGpkdlIU2ZC9ea/VhvtXO8BOYy1etSDSyofVCraxV3P8D+Jv0Mk2HLaPKBL/mz2Ev1tAD7DfaZECXMWbzouEEAJO4w6+dlqkQLb7stV5kRBCwEncwudOixTgIp51XqQAaw6/ehTEX0fmBRfwFL/HRJ7HzrUwuIL3sv8Tz8fO09PT0xOfP8jlmG3jn1L5AAAAAElFTkSuQmCC')}",
		".playskin-btn-fullscreen[data-state=\"fullon\"]{background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACs0lEQVRoge2aP2sUQRiHt7BIYWmRwiJFiissgooGPTSKEWNjUCGihY2t3yGdH8HCD2CpKBqJaIhRxEKPEMhho0WKFSyCXGnxWOxuHGdnbv69e3vI/WCru/m97zPz7s27s5cBD4HvAdceZuVZoIDXFq+9wJweZRajUG0CFyJAzgNvJRKQAHkHXAyFUGDOAW9Sk0gFeQ9cioVQYLrYy6xxkA/AYiqEAnMWWB81yEfgshSEAnMGeDVKkAfSEArMLPB7VCC/gPsNQHSAxzEJpdwjP4B74wCRCgLFZnSnbQgJEIBd4HqbECADAvAZWGoLAuRAoNgcF9qAADtIH7gJDAL9+sC0B8RhYCvQe1Dm1Dd9aAI5SIaidYiBmRoCcYg4iG45fhoDjA5Sm9EImAEwMwTkSIRfV/OowaggG1hqHFgGeh5BvwF3PUprheLXzqU+cMviMQ+s6SDO2sa9MrWZa9oPZWUyYMcF4RE8CELSr4TZCY1tKrOvwO1go79+N4Btxc9aTuJSZjJqJZr2Cw0+CxwT9OtI+k000UQT/acqd9QZQb+jkn6+QTtALrghVn450JHI0SfoFYoDukrbpD2zXwU+KX49YDnGqBfQNFYzJ9U02vy8V+agaVQaNVcbbwsaBePh54RBa+P3y4FrwLxlgF5ONu0CKx4Q14AvHn7WMgPmgCfVF30edV0zp2ugexhm8WeAX21lcDzq1mAiIKrxww4fpvQkQmBMEDD8OGiBOAif4yBjMg7lZU7W46B90wcRst5jFph/ajxVUiBBEE3ASIBEQUjDpIIkQUjCpICIQEjBxIKIQkjAxL5WmJOG0GCiQMZpRY4DT0cJIg4DnACeReYyNr9aJ4HnCXmMxT5yCniRmEPrO/tp4KVAfDKKFzy6ctx/9toqx1bXagTIquax4RHX1Mj2/gAk/0tjajDnQgAAAABJRU5ErkJggg==');}",
		".playskin-btn-fullscreen[data-state=\"fulloff\"]{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACzUlEQVRoge3aL4zUQBTH8QoEAonAYQipIUEgSFhxCea43YMlWXHiBEGQE4iTyE0QSAQS0QRHMLhzkGD4/yc5seLEYcgKBGIFYsUX0U622+28zpvO7B1Jf8mptu/10+m13WmTpCbAY+AI6NUtP4kAI+AYGLpuMGaRH8DdyPvosk/3CgTAT+B+0wZPWc1MMzJAD9gVlj8EUkW9ETCv7NMcGGkQKkyBmAFjYZ0MmLpgLAg7pnI62XJoPQp5jR1gUqwrQcwB+wT0hfXKp5Mtv4AHZoMnDgiT2pFhMRImEiQrrVc7MsgjUc0cGCbkVydNljA1CA1kBaNEmBwkQFoUU2MsCNBBKPqn+CEmwAVT3BdThwA9BOA3bRClBtvAF2UhWySIdHXU5AC4bmsyAD4HaBIbYkeUGvXJL41tEhPSjCg12wI+nkKIO6LU8Bbw4RRB9IhS05T8ahISknnUO6J6dVJC9tBflpsgPiMyAXbWjYgB8cO0RMSC6DABEDEhbphACIh/Q7RjgE30zzq2WI8Y+S/EEJkBV8WR6dKlS5cuawtwHtgI8NcDzgh9zgbqswGcq2sQ8oa4L0A082hSpsAlWxOX2T2XjAVIiEeU7zTNyhMGExPSjAiIiQVxRwTCxIDoEQEwoSH+iKLpnaLISUPeADd8EbeBbx5NY0Agnw66pkVsA189G8aCALwGrrgiBrSfzI4FAXgJXG5C9Pk/JrFfABdtDbZoP3ltEhsC8JyadyM+L3qmwjYSJLNs80fZH+AV5gEVf0QqbKuFmHr7yv0AeGYKa+8T1ZeXdRgNpFrPB7OXAEPcH99tr5OrGFeIrZ4GM8PcX3B7FHkPbAo7OGBx75Eg5p/9HXBTWO8R8Ldhn1ZnHJFfDbt+cmFGRoJkinrSyNg/K7FgnJpWMANh+a6yXh2m+dsYlk8z8XRaV1g+zVSvFobAW82Rix3yye9j20j8A2yHwvmw6qDQAAAAAElFTkSuQmCC') ;}",
		".playskin-btn-vr[data-state=\"vr\"]{ background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAApCAMAAABeObpoAAAAM1BMVEUAAAD///////////////////////////////////////////////////////////////+3leKCAAAAEHRSTlMAgMDwQOCgUCCQMBBgsNBwGcfoZQAAAaZJREFUSMfFlluWhCAMRAUEQVF7/6udcwzjnSR8T+cvkFdVRbqXb1oQW/XpPo63x+nhjNfnsRTDTthHrOnkOI6fmpKH5bdTloOoctcRdlJfWaEHyVQUq1SaZreB5W9uHyHh8W5ysE0IG96kcToe75wlZwWv+sa3ZqWEUOBufXTAMY2zeIcabU0KEiBM422Ea0Y3JUSmknRKOjpw77WN5jIYHJE5vLYNh8bswTL8apILneyUBFfFnoIJIYnG3EHQyeaCCq1ozH6AKoCKXmh1yJDsBxChr17IPEBwXUCoSwsEuWYyaktjdAGUt82ionHUe+6tj1tWiMY7yWWSmrp7Ns43sizY5VOb4FWw4qt4XTCb2gQt9ptcAG+munqLSSrvJjmP5IQK8AGZ/r1Cq9hfJrETZTatktYqSGA2Q/GVJLbczdbsc8QTlJRqwIKV5N5vPikccCmt2A/Pl3+AMPdLMP+kmnknKOn3A44OPeFtGzAf5p6grH09Tz50cjfitBkxYcIjwcxT+TH3G8zJjC++sWS0IsirwME9W1H08zUZiLmL+1dTl3+0H7dIQKu06WK7AAAAAElFTkSuQmCC');}"
	].join("\n");
	var htmlText = [
		'<div class="playskin-progress-wrap">',
			'<div class="playskin-progress-container" id="play2vr-progressBg">',
				'<div id="play2vr-buf" style="width: 0%;"></div>',
				'<div id="play2vr-progress" value="0" min="0" style="width: 0%;"><span id="play2vr-progress-bar"></span></div>',
			'</div>',
			'<span id="play2vr-ball" style="left: 0%;"></span>',
		'</div>',
		'<div id="play2vr-video-controls" class="clearfix">',
			'<div class="playskin-controls-left clearfix">',
				'<div class="playskin-btn-playwrap playskin-play-playwrap" id="play2vr-playpause"><button class="playskin-btn-play" type="button" data-state="play"></button></div>',
				'<div class="playskin-time-playwrap"><span id="play2vr-currentTime">00:00</span>/<span id="play2vr-totalTime">00:00</span></div>',
			'</div>',
			'<div class="playskin-controls-right clearfix">',
				'<div class="playskin-bitrates-playwrap">',
					'<div class="playskin-bitrates-choose"><ul></ul></div><span></span>',
				'</div>',
				'<div class="playskin-btn-playwrap playskin-voice-playwrap" id="play2vr-mute"><button class="playskin-btn-voice" type="button" data-state="voice"></button></div>',
				'<div class="playskin-btn-playwrap playskin-vr-playwrap" id="play2vr-vrmode"><button class="playskin-btn-vr" type="button" data-state="vr"></button></div>',
				'<div class="playskin-btn-playwrap playskin-fullscreen-playwrap" id="play2vr-fullmode"><button class="playskin-btn-fullscreen" type="button" data-state="fullon"></button></div>',
			'</div>',
		'</div>',
	].join("\n");
	
	var initCSS=[
		"html{color:#000;background:#fff;overflow-y:scroll;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}",
		"html *{outline:0;-webkit-text-size-adjust:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}",
		"html,body{font-family:sans-serif}",
		"body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td,hr,button,article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{margin:0;padding:0}",
		"input,select,textarea{font-size:100%}",
		"table{border-collapse:collapse;border-spacing:0}",
		"fieldset,img{border:0}",
		"abbr,acronym{border:0;font-variant:normal}",
		"del{text-decoration:line-through}",
		"address,caption,cite,code,dfn,em,th,var{font-style:normal;font-weight:500}",
		"ol,ul{list-style:none}",
		"caption,th{text-align:left}",
		"h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:500}",
		"q:before,q:after{content:''}",
		"sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}",
		"sup{top:-.5em}",
		"sub{bottom:-.25em}",
		"a:hover{text-decoration:underline}",
		"ins,a{text-decoration:none}",
	].join("\n");
	
	var addAttr = function(ele, props) {
		if(typeof ele == 'string') ele = document.querySelector(ele);
		if(ele)
			for(var p in props)
				if(props.hasOwnProperty(p))
					ele.setAttribute(p, props[p]);
	};
	
	var addHTML = function(htmlText) {
		var figure = document.createElement('div');
		var blurDiv = document.createElement('div');
		addAttr(figure, {id: 'play2vr-videoContainer','data-fullscreen': false});
		addAttr(blurDiv, {id: 'play2vr-blurDiv',});
		figure.innerHTML = htmlText;
		container.appendChild(blurDiv);
		container.appendChild(figure);
	};
	
	var addCSS = function(cssText,id) {
		var style = document.createElement('style');
		style.type = 'text/css';
		style.id = id;
		if(style.styleSheet) style.styleSheet.cssText = cssText;
		else style.innerHTML = cssText;
		var getStyle = document.getElementById(id);
		if(getStyle) getStyle.parentNode.removeChild(getStyle);
		document.getElementsByTagName("head")[0].appendChild(style);
	};
	
	var togglePlayState = function() {
		if(_this.video.paused || _this.video.ended) iconPlaypause.setAttribute('data-state', 'play');
		else iconPlaypause.setAttribute('data-state', 'pause');
	}
	
	var toggleMuteState = function() {
		iconMute.setAttribute('data-state', _this.video.muted ? 'mute' : 'voice');
	}
	
	var playpauseButton = function(e) {
		e.stopPropagation();
		if(_this.video.paused || _this.video.ended) _this.api.play();
		else _this.api.pause();
	};
	
	var muteButton = function(e) {
		e.stopPropagation();
		_this.video.muted = !_this.video.muted;
		toggleMuteState();
	};
	
	var vrModeButton = function(e) {
		e.stopPropagation();
		var currentState = iconVrMode.getAttribute('data-state');
		if(currentState == 'vroff') currentState = 'vron';
		else if(currentState == 'vron') currentState = 'vroff';
		iconVrMode.setAttribute('data-state', currentState);
		_this.api.toggleVR();
	}
	
	var fullScreenButton = function(e) {
		var event= e || null;
		if(event) event.stopPropagation();
		var currentState = iconFullMode.getAttribute('data-state');
		if(currentState == 'fulloff'){
			currentState = 'fullon';
			if(!isTouchDevice) closeFullScreen()
		} else if(currentState == 'fullon'){
			currentState = 'fulloff';
			if(!isTouchDevice) openFullScreen(document.documentElement);
		} 
		iconFullMode.setAttribute('data-state', currentState);
		_this.api.toggleFullscreen();
	}
	
	var addBitrates = function(bitrates){
		var controlH=document.querySelector('#play2vr-video-controls').offsetHeight+1;
		var bitratesWrap=document.querySelector('.playskin-bitrates-playwrap');
		var chooseWrap=document.querySelector('.playskin-bitrates-choose');
		var bitratesLength=bitrates.length;
		if(bitratesLength>0){
			var _html='';
			bitratesWrap.style.display='block';
			chooseWrap.querySelector('ul').innerHTML='';
			for(var i=0;i<bitratesLength;i++){
				var _name='';
				if(bitrates[i]=='hd') _name='标清';
				else if(bitrates[i]=='fhd') _name='高清';
				else if(bitrates[i]=='4k') _name='超清';
				_html+='<li data-bitrates="'+bitrates[i]+'">'+_name+'</li>';
			}
			chooseWrap.querySelector('ul').innerHTML=_html;
		}
	}
	
	var bitratesButton = function(bitrates,curBitrates){
		var bitratesStatue=document.querySelector('.playskin-bitrates-playwrap span');
		if(bitrates.length>0) changeBitrates(curBitrates,bitratesStatue)
		addBitrates(bitrates);
		var li=document.querySelectorAll('.playskin-bitrates-choose ul li');
		for(var i=0;i<li.length;i++){
			li[i].addEventListener(eventName,function(e){
				e.stopPropagation();
				var value=this.getAttribute('data-bitrates');
				changeBitrates(value,bitratesStatue)
				play2VR.switchBitrateFormat(value);
				chooseBitrates.style.display='none';
				isShow=false;
			});
		}
	}
	
	var changeBitrates=function(value,obj){
		if(value=='hd') obj.innerHTML='标清';
		else if(value=='fhd') obj.innerHTML='高清';
		else if(value=='4k') obj.innerHTML='超清';
	}
	
	var setPlayerTime = function(ele, sec_num) {
		hours = Math.floor(sec_num / 3600);
		minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		seconds = Math.floor(sec_num - (hours * 3600) - (minutes * 60));
		if(hours < 10)  hours = "0" + hours;
		if(minutes < 10)  minutes = "0" + minutes;
		if(seconds < 10)  seconds = "0" + seconds;
		ele.innerText = minutes + ':' + seconds;
	}
	
	var progressButton = function(e) {
		e.stopPropagation();
		containerW=videoContainer.offsetWidth;
		var XX;
		var d = document.getElementById('play2vr-progressBg');
		var WW = parseInt(window.getComputedStyle(d).width);
		if(isTouchDevice) XX = e.changedTouches[0].pageX;
		else  XX = e.offsetX;
		progress.style.width = Math.floor((XX / containerW) * 100) + '%';
		ball.style.left = Math.floor((XX / containerW) * 100) + '%';
		_this.video.currentTime = XX / WW * _this.video.duration;
	};
	
	var updateInfo=function(){
		if(isTouchDevice){
			if(_totalTime==0 || _totalTime==NaN){
				_totalTime=_this.video.duration
				setPlayerTime(totalTime,_totalTime);
			}
			if(_bitrates.length==0){
				play2VR.getBitratesFormats().then(function(data){
					_bitrates=data.bitrates;
					_curBitrates=data.bitrate;
					bitratesButton(data.bitrates,data.bitrate);
				});
			}
		}
	}
	
	var bindVideoEvents = function() {
		var videoEventHandlers = {
			loadedmetadata: function(e) {
				progress.setAttribute('max', _this.video.duration);
				if(_totalTime==0){
					_totalTime=_this.video.duration;
					setPlayerTime(totalTime, _this.video.duration);
				}  
			},
			canplay: function(e) {
				play2VR.getBitratesFormats().then(function(data){
					_bitrates=data.bitrates;
					_curBitrates=data.bitrate;
					bitratesButton(data.bitrates,data.bitrate);
				});
			},
			play: function(e) {
				togglePlayState();
			},
			pause: function(e) {
				togglePlayState();
			},
			timeupdate: function(e) {
				updateInfo();
				setPlayerTime(currentTime, _this.video.currentTime);
				if(!progress.getAttribute('max')) progress.setAttribute('max', _this.video.duration);
				progress.value = _this.video.currentTime;
				progress.style.width = Math.floor((_this.video.currentTime / _this.video.duration) * 100) + '%';
				ball.style.left = Math.floor((_this.video.currentTime / _this.video.duration) * 100) + '%';
			},
			progress: function(e) {
				var buf = _this.video.buffered,leg = buf.length - 1,progessPercent = 0;
				if(leg >= 0) progessPercent = buf.end(leg) / _this.video.duration * 100;
				document.getElementById('play2vr-buf').style.width = Math.floor(progessPercent) + '%';
			},
			ended: function() {
				
			},
			error: function() {

			}
		}
		for(var e in videoEventHandlers) _this.video.addEventListener(e, videoEventHandlers[e].bind(this));
	}
	
	var closeFullScreen=function(){
		if (document.exitFullscreen) {  
		    document.exitFullscreen();  
		}else if (document.mozCancelFullScreen) {  
		    document.mozCancelFullScreen();  
		}else if (document.webkitCancelFullScreen) {  
		    document.webkitCancelFullScreen();  
		}else if (document.msExitFullscreen) {
		    document.msExitFullscreen();
		}
	}
	
	var openFullScreen=function(docElm){
		if (docElm.requestFullscreen) {  
		    docElm.requestFullscreen();  
		}else if (docElm.mozRequestFullScreen) {  
		    docElm.mozRequestFullScreen();  
		}else if (docElm.webkitRequestFullScreen) {  
		    docElm.webkitRequestFullScreen();  
		}else if (docElm.msRequestFullscreen) {
		  	docElm.msRequestFullscreen();
		}
	}
	
	var flexible = function() {
		(function(win, lib) {
			var doc = win.document;
			var docEl = doc.documentElement;
			var metaEl = doc.querySelector('meta[name="viewport"]');
			var flexibleEl = doc.querySelector('meta[name="flexible"]');
			var dpr = 0;
			var scale = 0;
			var tid;
			var flexible = lib.flexible || (lib.flexible = {});
	
			if(metaEl) {
				console.warn('将根据已有的meta标签来设置缩放比例');
				var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
				if(match) {
					scale = parseFloat(match[1]);
					dpr = parseInt(1 / scale);
				}
			} else if(flexibleEl) {
				var content = flexibleEl.getAttribute('content');
				if(content) {
					var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
					var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
					if(initialDpr) {
						dpr = parseFloat(initialDpr[1]);
						scale = parseFloat((1 / dpr).toFixed(2));
					}
					if(maximumDpr) {
						dpr = parseFloat(maximumDpr[1]);
						scale = parseFloat((1 / dpr).toFixed(2));
					}
				}
			}
			if(!dpr && !scale) {
				var isAndroid = win.navigator.appVersion.match(/android/gi);
				var isIPhone = win.navigator.appVersion.match(/iphone/gi);
				var devicePixelRatio = win.devicePixelRatio;
				if(isIPhone) {
					// iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
					if(devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
						dpr = 3;
					} else if(devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
						dpr = 2;
					} else {
						dpr = 1;
					}
				} else {
					// 其他设备下，仍旧使用1倍的方案
					dpr = 1;
				}
				scale = 1 / dpr;
			}
			docEl.setAttribute('data-dpr', dpr);
			if(!metaEl) {
				metaEl = doc.createElement('meta');
				metaEl.setAttribute('name', 'viewport');
				metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
				if(docEl.firstElementChild) {
					docEl.firstElementChild.appendChild(metaEl);
				} else {
					var wrap = doc.createElement('div');
					wrap.appendChild(metaEl);
					doc.write(wrap.innerHTML);
				}
			}
	
			function refreshRem() {
				var width = docEl.getBoundingClientRect().width;
				if(width / dpr > 540) {
					width = 540 * dpr;
				}
				var rem = width / 10;
				docEl.style.fontSize = rem + 'px';
				flexible.rem = win.rem = rem;
			}
			win.addEventListener('resize', function() {
				clearTimeout(tid);
				tid = setTimeout(refreshRem, 300);
			}, false);
			win.addEventListener('pageshow', function(e) {
				if(e.persisted) {
					clearTimeout(tid);
					tid = setTimeout(refreshRem, 300);
				}
			}, false);
			if(doc.readyState === 'complete') {
				doc.body.style.fontSize = 12 * dpr + 'px';
			} else {
				doc.addEventListener('DOMContentLoaded', function(e) {
					doc.body.style.fontSize = 12 * dpr + 'px';
				}, false);
			}
	
			refreshRem();
			flexible.dpr = win.dpr = dpr;
			flexible.refreshRem = refreshRem;
			flexible.rem2px = function(d) {
				var val = parseFloat(d) * this.rem;
				if(typeof d === 'string' && d.match(/rem$/)) {
					val += 'px';
				}
				return val;
			}
			flexible.px2rem = function(d) {
				var val = parseFloat(d) / this.rem;
				if(typeof d === 'string' && d.match(/px$/)) {
					val += 'rem';
				}
				return val;
			}
		})(window, window['lib'] || (window['lib'] = {}));
	}
	
	var isFullScreen=function() {
		var fullscreenElement = document.fullscreenEnabled || document.mozFullscreenElement || document.webkitFullscreenElement;
		var fullscreenEnabled = document.fullscreenEnabled || document.mozFullscreenEnabled || document.webkitFullscreenEnabled;
		if (fullscreenElement == null) return false;
		else  return true;
	}

	
	if(!isTouchDevice){
		addCSS(cssTextPC,'play2VRskin');
	} else {
		addCSS(initCSS,'play2VRinit');
		flexible();
		addCSS(cssTextMobile,'play2VRskin');
	}
	addHTML(htmlText);
	
	var btnPlaypause = document.querySelector('#play2vr-playpause');
	var iconPlaypause = document.querySelector('#play2vr-playpause button');
	var btnMute = document.querySelector('#play2vr-mute');
	var iconMute = document.querySelector('#play2vr-mute button');
	var btnVrMode = document.querySelector('#play2vr-vrmode');
	var iconVrMode = document.querySelector('#play2vr-vrmode button');
	var btnFullMode = document.querySelector('#play2vr-fullmode');
	var iconFullMode = document.querySelector('#play2vr-fullmode button');
	var totalTime = document.querySelector('#play2vr-totalTime');
	var currentTime = document.querySelector('#play2vr-currentTime');
	var progress = document.querySelector('#play2vr-progress');
	var progressBar = document.querySelector('#play2vr-progress-bar');
	var ball = document.querySelector('#play2vr-ball');
	var buf=document.querySelector('#play2vr-buf');
	var progressBg=document.querySelector('#play2vr-progressBg');
	var btnBitrates=document.querySelector('.playskin-bitrates-playwrap');
	var chooseBitrates=document.querySelector('.playskin-bitrates-choose');
	var videoContainer=document.querySelector('#play2vr-videoContainer');
	var blur=document.querySelector('#play2vr-blurDiv');
	
	bindVideoEvents();
	btnPlaypause.addEventListener(eventName, playpauseButton);
	btnMute.addEventListener(eventName, muteButton);
	btnVrMode.addEventListener(eventName, vrModeButton);
	btnFullMode.addEventListener(eventName, fullScreenButton);
	progressBg.addEventListener(eventName, progressButton);
	
	if(!isTouchDevice && isFullScreen()) fullScreenButton();
	
	btnBitrates.addEventListener(eventName,function(e){
		e.stopPropagation();
		if(!isShow) chooseBitrates.style.display='block';
		else chooseBitrates.style.display='none';
		isShow=!isShow;
	});
	
	videoContainer.addEventListener('touchstart', function(e) {
		e.preventDefault()
	});
	
	var startX=0 ,moveX=0;
	var startLeft=0 ,moveLeft=0;
	var leftPercent=0;
	var containerW=videoContainer.offsetWidth;
	var eStart=isTouchDevice ? 'touchstart' : 'mousedown';
	var eMove=isTouchDevice ? 'touchmove' : 'mousemove';
	var eEnd=isTouchDevice ? 'touchend' : 'mouseup';
	var _time;
	var isShowControl=false;
	
	ball.addEventListener(eStart,function(e){
		e.stopPropagation();
		containerW=videoContainer.offsetWidth;
		enableMove=true;
		startLeft=this.offsetLeft;
		startX = isTouchDevice ? e.targetTouches[0].pageX : e.clientX;
		_this.api.pause();
	});
	
	document.addEventListener(eMove,function(e){
		e.stopPropagation();
		if(enableMove){
			moveX = isTouchDevice ? e.targetTouches[0].pageX : e.clientX;
			moveLeft=startLeft+(moveX-startX);
			leftPercent=(moveLeft/containerW)*100;
			if(leftPercent<=0) leftPercent=0;
			if(leftPercent>=99) leftPercent=99;
			if(! isTouchDevice) ball.style.cssText='left:'+leftPercent+'%;-webkit-opacity:1; -moz-opacity:1;opacity:1;';
			else ball.style.left=leftPercent+'%';
			progress.style.width = leftPercent + '%';
		}
	});
	
	document.addEventListener(eEnd,function(e){
		e.stopPropagation();
		if(enableMove){
			enableMove=false;
			startLeft=moveLeft;
			if(! isTouchDevice) ball.style.cssText='left:'+leftPercent+'%;-webkit-opacity:0; -moz-opacity:0;opacity:0;';
			else ball.style.left=leftPercent+'%';
			progress.style.width = leftPercent + '%';
			_this.video.currentTime = (leftPercent/100) * _this.video.duration;
			_this.api.play();
		}
	});
	
	
	if(!isTouchDevice){
		chooseBitrates.addEventListener('mouseleave',function(){
			chooseBitrates.style.display='none';
			isShow=false;
		});
		
		blur.addEventListener('mouseenter',function(){
			videoContainer.style.bottom=0;
			clearTimeout(_time);
		});
		
		videoContainer.addEventListener('mouseleave',function(){
			_time=setTimeout(function(){
				videoContainer.style.bottom='-40px';
			},2000);
		});
	}else {
		window.addEventListener('orientationchange',function(){
			var fullState=iconFullMode.getAttribute('data-state');
			if(fullState=='fulloff') play2VR.toggleFullscreen(true);
		});
		
		container.addEventListener(eventName,function(){
			clearTimeout(_time);
			if(!isShowControl){
				videoContainer.classList.add('on');
				_time=setTimeout(function(){
					videoContainer.classList.remove('on');
					chooseBitrates.style.display='none';
					isShowControl=false;
					isShow=false;
				},5000);
			}else{
				videoContainer.classList.remove('on');
			}
			isShowControl=!isShowControl;
		});
	}
	
}
play2VR.defaultSkin = defaultSkin;