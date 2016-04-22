var Main = 
{
	ros: undefined,
	url: "ws://localhost:9090",
	stateListener: undefined,
	rcInListener: undefined,
	batteryListener: undefined,
	
	
	
	init: function()
	{
		this.connectToServer()
	},
	
	
	
	connectToServer: function()
	{
		this.url = prompt("Websocket server", this.url);
		
		if(this.url)
		{
			this.ros = new ROSLIB.Ros({url : 'ws://localhost:9090'});
			this.ros.on('connection', this.rosOnConnection.bind(this));
			this.ros.on('error', this.rosOnError.bind(this));
			this.ros.on('close', this.rosOnClose.bind(this));
		}
	},
	
	
	
	rosOnConnection: function()
	{
		jQuery("div.box.logs").html("connected: "+this.url);
		
		this.subscribeToTopics();
	},
	
	
	
	rosOnError: function()
	{
		jQuery("div.box.logs").html("error: "+this.url);
	},
	
	
	
	
	rosOnClose: function()
	{
		jQuery("div.box.logs").html("close: "+this.url);
	},
	
	
	
	subscribeToTopics: function()
	{
		this.stateListener = new ROSLIB.Topic({ros:this.ros , name:'/mavros/state' , messageType:'mavros_msgs/State'});
		
		this.stateListener.subscribe(function(msg)
		{
			var str = "";
			
			str += "MAV <b>is"+(msg.connected?"":" NOT")+"</b> connected<br>";
			str += "MAV <b>is"+(msg.armed?"":" NOT")+"</b> armed<br>";
			str += "MAV mode: <b>"+msg.mode+"</b><br>";
			
			jQuery("div.box.state").html(str);
		});
		
		//=======================================
		
		this.rcInListener = new ROSLIB.Topic({ros:this.ros , name:'/mavros/rc/in' , messageType:'mavros_msgs/RCIn'});
		
		this.rcInListener.subscribe(function(msg)
		{
			var str = "";
			
			for(var i=0; i<msg.channels.length; ++i)
			{
				str += "ch "+i+": "+msg.channels[i]+"</br>";
			}
			jQuery("div.box.rc-in").html(str);
			
			var t = ((2000-msg.channels[2])/10)+"%";
			var l = ((msg.channels[3]-1000)/10)+"%";
			
			jQuery("#rc-interface>div.left>div").css({"left":l, "top":t});
			
			t = ((2000-msg.channels[1])/10)+"%";
			l = ((msg.channels[0]-1000)/10)+"%";
			
			jQuery("#rc-interface>div.right>div").css({"left":l, "top":t});
		});
		
		//=======================================
		
		this.batteryListener = new ROSLIB.Topic({ros:this.ros , name:'/mavros/battery' , messageType:'mavros_msgs/BatteryStatus'});
		
		this.batteryListener.subscribe(function(msg)
		{
			var str = "";
			
			str += "<b>Voltage [V]:</b> "+msg.voltage;
			str += "</br><b>Current [A]:</b> "+msg.current;
			str += "</br><b>Remaining:</b> "+msg.remaining;
			
			jQuery("div.box.battery>div").html(str);
			jQuery("div.box.battery>progress").val(msg.remaining);
		});
	}
};


jQuery(document).ready(Main.init.bind(Main));