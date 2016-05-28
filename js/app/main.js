var Main = 
{
	ros: undefined,
	url: "ws://192.168.1.101:9090",
	stateListener: undefined,
	rcInListener: undefined,
	batteryListener: undefined,
	mavState: new MavState(),
	mavBattery: new MavBattery(),
	
	
	
	init: function()
	{
		this.connectToServer()
	},
	
	
	
	connectToServer: function()
	{
		this.url = prompt("Websocket server", this.url);
		
		if(this.url)
		{
			this.ros = new ROSLIB.Ros({url : this.url});
			this.ros.on('connection', this.rosOnConnection.bind(this));
			this.ros.on('error', this.rosOnError.bind(this));
			this.ros.on('close', this.rosOnClose.bind(this));
		}
	},
	
	
	
	rosOnConnection: function()
	{
		jQuery("div.box.logs").html("connected: "+this.url);
		
		this.mavState.connect();
		this.mavBattery.connect();
	},
	
	
	
	rosOnError: function()
	{
		jQuery("div.box.logs").html("error: "+this.url);
	},
	
	
	
	rosOnClose: function()
	{
		jQuery("div.box.logs").html("close: "+this.url);
	}
};


jQuery(document).ready(Main.init.bind(Main));
