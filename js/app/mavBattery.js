function MavBattery()
{
	this.listener = undefined;
}


MavBattery.prototype.connect = function()
{
	this.listener = new ROSLIB.Topic({ros:Main.ros , name:'/mavros/battery' , messageType:'mavros_msgs/BatteryStatus'});
	
	this.listener.subscribe(this.callback.bind(this));
};



MavBattery.prototype.callback = function(msg)
{	
	jQuery("div#MavBattery>div").css({"width": (msg.remaining*100)+"%"});
};