function MavState()
{
	this.listener = undefined;
}


MavState.prototype.connect = function()
{
	this.listener = new ROSLIB.Topic({ros:Main.ros , name:'/mavros/state' , messageType:'mavros_msgs/State'});
	
	this.listener.subscribe(this.callback.bind(this));
};



MavState.prototype.callback = function(msg)
{
	var jq = jQuery("html").eq(0);
	
	if(msg.connected)
	{
		if(msg.armed){jq.attr("data-level", "danger");}
		else{jq.attr("data-level", "ok");}
	}
	else
	{
		jq.attr("data-level", "warning");
	}
	
	jQuery("div#MavState>h1").html(msg.mode)
};