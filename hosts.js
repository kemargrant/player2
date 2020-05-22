var WebSocket = require('ws');
let {execSync} = require('child_process');
let machine = "";

machine = execSync("uname").toString();

function setupSocket(port = 5001){
	var ws = new WebSocket.Server({port});
	return new Promise((resolve,reject) =>{			
		ws.on('connection',(ws)=>{
			console.log("Websocket connection created:",new Date());
			resolve(ws);
			ws.on('error',(e)=>{
				setTimeout(setupSocket,1000);
				return console.log("Signal WebSocket Error:",e,new Date());
			})
			ws.on('close',(e)=>{
				return console.log("Signal WebSocket Closed:",e,new Date());
			})	
			if(machine.search("Linux") > -1){
				console.log("Using xdotool");
				let button;
				ws.on('message',(message)=>{
					button = message.slice(1,message.length);
					if (message[0] === "d"){
						return execSync("DISPLAY=:0 /usr/bin/xdotool keydown "+button);
					}
					else{
						return execSync("DISPLAY=:0 /usr/bin/xdotool keyup "+button);
					}
				});	
			}
			else{
				console.log("Using osascript");
				let button;
				ws.on('message',(message)=>{
					button = message.slice(1,message.length);
					if (message[0] === "d"){
						return execSync(`osascript -e 'tell application "System Events" to key down "${button}"'`);
					}
					else{
						
						return execSync(`osascript -e 'tell application "System Events" to keys up "${button}"'`);
						
					}
					
				});
			}
			
		});
	});	
}

setupSocket().catch(console.warn);
